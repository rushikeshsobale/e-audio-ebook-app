import { Injectable, ConflictException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema'; // Assuming UserSchema is in the same file
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  private readonly saltRounds = 10;

  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
  ) {}

  async findOne(username: string): Promise<User | null> {
    const user = await this.userModel.findOne({ username }).exec();
    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  async create(username: string, email: string, password: string, phone:Number): Promise<User> {
    const existingUser = await this.userModel.findOne({ $or: [{ username }, { email }] }).exec();
    if (existingUser) {
      throw new ConflictException('Username or email already exists');
    }
  
    const hashedPassword = await bcrypt.hash(password, this.saltRounds);
    const newUser = new this.userModel({ username, email, password: hashedPassword });
  
    try {
      return await newUser.save();
    } catch (error) {
      console.error('Error while saving user:', error);
      throw new InternalServerErrorException('Failed to create user'); // More specific exception
    }
  }
  
  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.userModel.findOne({ username }).exec();
    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    return null;
  }
}
