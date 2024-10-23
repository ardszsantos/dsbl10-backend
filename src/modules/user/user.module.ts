// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user/user';
import { UsersService } from './user.service';
import { UserController } from './user.controller'; // Import the controller

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController], // Register the controller
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
