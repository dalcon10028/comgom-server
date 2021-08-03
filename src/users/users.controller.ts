import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  @Get()
  async getAll(@Req() request: Request): Promise<User[]> {
    try {
      const cookie = request.cookies['jwt'];
      const jwtData = await this.jwtService.verifyAsync(cookie);
      if (!jwtData) throw new UnauthorizedException();
      return await this.usersService.findAll();
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  @Post('register')
  async register(@Body() userData: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(userData.user_password, 12);

    const createdUserData = await this.usersService.create({
      ...userData,
      user_password: hashedPassword,
    });

    delete createdUserData.user_password;
    delete createdUserData.ban;
    delete createdUserData.admin;

    return createdUserData;
  }

  @Post('login')
  async login(
    @Body() userData: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.usersService.findOneByEmail(userData.user_email);

    if (!user) {
      throw new BadRequestException('존재하지 않는 이메일 입니다.');
    }

    const password_vaildate = await bcrypt.compare(
      userData.user_password,
      user.user_password,
    );

    if (!password_vaildate) {
      throw new BadRequestException('비밀번호가 유효하지 않습니다.');
    }

    const jwt = await this.jwtService.signAsync({ id: user.id });
    response.cookie('jwt', jwt, { httpOnly: true });

    return { message: '로그인 성공!' };
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt');

    return {
      message: '로그아웃 성공!',
    };
  }
}
