import { IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  readonly user_email: string;

  @IsString()
  readonly user_password: string;

  @IsString()
  readonly user_name: string;

  @IsOptional()
  @IsString()
  readonly self_introduction: string;

  @IsOptional()
  @IsString()
  readonly avatar: string;
}
