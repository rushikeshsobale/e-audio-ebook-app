import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../users/users.module';
import { PlansService } from '../plans/plans.service';
import { PlansModule } from '../plans/plans.module';
import { MongooseModule } from '@nestjs/mongoose';
import { PlanSchema } from '../plans/plan/plan';
import { UserSchema } from 'src/users/user.schema';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Plan', schema: PlanSchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    PlansModule,
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: 'yourSecretKey', 
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService, JwtStrategy, PlansService],
  controllers: [AuthController],
})
export class AuthModule {}
