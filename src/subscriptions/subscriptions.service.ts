import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/user.schema';
import * as nodemailer from 'nodemailer'; 
import { PlansService } from '../plans/plans.service';
import { SentMessageInfo } from 'nodemailer/lib/smtp-transport';
import { Plan } from '../plans/plan/plan';

@Injectable()
export class SubscriptionsService {
  private transporter: nodemailer.Transporter<SentMessageInfo>;

  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
  //  @InjectModel('Plan') private readonly planModel: Model<Plan>,
    private readonly plansService: PlansService,
  ) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail', // or any other email service
      auth: {
        user: 'rushikeshsobale@gmail.com', // Your email username  
        pass: 'bhzw yovd ugah jzol', // Your email password
      },
    });
  }
  
  async purchaseSubscription(userId: string, planId: string, paymentToken: string): Promise<any> {
    console.log(userId, planId, 'users')
    try {
      const plan = await this.plansService.getPlanById(planId);
      if (!plan) {
        throw new NotFoundException(`Plan with ID ${planId} not found`);
      }

      const endDate = this.calculateEndDate(plan.duration);
      const referralCode = this.generateReferralCode(userId);

      const updatedUser = await this.userModel.findByIdAndUpdate(userId, {
        subscription: {
          planType: planId,
          startDate: new Date(),
          endDate,
          isActive: true,
          referralCode,
        }
      }, { new: true });
      console.log(updatedUser, plan, 'dhsj')
      if (!updatedUser) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      const emailContent = `
        Your subscription to the following plan has been successfully activated:

        **Plan Details**
        - Name: ${plan.name}
        - Price: $${plan.price}
        - Duration: ${plan.duration} months
        - Features: ${plan.features.join(', ')}

        **Subscription Details**
        - Plan ID: ${planId}
        - Referral Code: ${referralCode}
        - Start Date: ${new Date().toLocaleDateString()}
        - End Date: ${endDate.toLocaleDateString()}
      `;

      await this.transporter.sendMail({
        from: 'rushikeshsobale@gmail.com',
        to: updatedUser.email,
        subject: 'Subscription Purchased',
        text: emailContent
      });

      return {
        message: 'Subscription purchased successfully',
        updatedUser,
      };

    } catch (error) {
      // Handle errors
      throw new InternalServerErrorException('An error occurred while processing the subscription');
    }
  }

  private calculateEndDate(duration: number): Date {
    const today = new Date();
    const endDate = new Date(today.setMonth(today.getMonth() + duration));
    return endDate;
  }

  private generateReferralCode(userId: string): string {
    return `REF-${userId}-${new Date().getTime()}`;
  }
}
