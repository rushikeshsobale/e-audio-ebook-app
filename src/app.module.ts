import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { ReferralsModule } from './referrals/referrals.module';
import { PlansModule } from './plans/plans.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Loads .env file
    MongooseModule.forRoot (process.env.MONGO_URI as string),
    AuthModule,
    UsersModule,
    SubscriptionsModule,
    ReferralsModule,
    PlansModule
  ],

})
export class AppModule {}
