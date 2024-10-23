import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './user.service'; // Make sure to import UsersService
import { User } from './entities/user/user'; // Import your User entity

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private usersService: UsersService) {} // Inject UsersService

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Return all users.', type: User, isArray: true }) // Inform Swagger about the return type
  getAllUsers(): Promise<User[]> {
    return this.usersService.findAll(); // Call findAll from UsersService
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'The user has been successfully created.', type: User }) // Inform Swagger about the return type
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  createUser(@Body() userDto: User): Promise<User> { // Expect User DTO to match the User entity structure
    return this.usersService.createUser(userDto.email, userDto.username, userDto.password); // Assume createUser expects email, username, and password
  }
}
