import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserSchema } from './user.schema';  // Import only the schema

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),  // Register the schema
  ],
  controllers: [UsersController],
  providers: [UsersService],  // Only include UsersService here
  exports: [UsersService],  // Export UsersService for use in other modules
})
export class UsersModule {}
