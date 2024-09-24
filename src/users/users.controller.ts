import { Controller, Get, Post, Body, Param, NotFoundException, ConflictException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':username')
  async findOne(@Param('username') username: string): Promise<User> {
    const user = await this.usersService.findOne(username);
    if (!user) {
      throw new NotFoundException(`User not found`);
    }
    return user;
  }

  @Post('create')
  async create(
    @Body('username') username: string,
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('phone') phone:Number
  ): Promise<User> {
    try {
      return await this.usersService.create(username, email, password, phone);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException(`User with username ${username} already exists`);
      }
      throw error; // rethrow unexpected errors
    }
  }
}
