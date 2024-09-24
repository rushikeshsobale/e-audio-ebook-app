import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionSchema } from './subscription.model';  // Ensure this path is correct
import { UserSubscriptionSchema } from './user-subscription.schema'; // Ensure this path is correct
import { User, UserSchema } from '../users/user.schema'; // Ensure this path is correct
import { PlansModule } from '../plans/plans.module'; 
import {Plan, PlanSchema} from '../plans/plan/plan'
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },  // Directly use 'User' as the model name
      { name: 'Subscription', schema: SubscriptionSchema },
      { name: 'UserSubscription', schema: UserSubscriptionSchema },
      { name: 'Plan', schema: PlanSchema }
    ]),
    PlansModule
  
  ],
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService],
  exports: [SubscriptionsService],
})
export class SubscriptionsModule {}
