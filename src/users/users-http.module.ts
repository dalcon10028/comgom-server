import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [UsersModule],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersHttpModule {}
