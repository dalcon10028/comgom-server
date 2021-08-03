import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOneByEmail(user_email: string): Promise<User> {
    return this.userRepository.findOne({ user_email });
  }

  async create(userData: CreateUserDto): Promise<User> {
    return this.userRepository.save(userData);
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}
