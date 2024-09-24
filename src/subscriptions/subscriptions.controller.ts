import { Controller, Post, Body, BadRequestException, Res } from '@nestjs/common';
import { Response } from 'express';
import { SubscriptionsService } from './subscriptions.service';

@Controller('subscriptions')
export class SubscriptionsController {  // Correct class name
  constructor(private readonly subscriptionsService: SubscriptionsService) {}  // Inject the service

  @Post('purchase')
  async purchaseSubscription(
    @Body() body: { userId: string; planId: string; paymentToken: string },
    @Res() res: Response,
  ) {
    const { userId, planId, paymentToken } = body;
          console.log(body,'body');
    try {
     
      if (!userId || !planId || !paymentToken) {
        throw new BadRequestException('Missing required fields');
      }

      // Call the service to handle subscription purchase
      const result = await this.subscriptionsService.purchaseSubscription(userId, planId, paymentToken);

      // Send success response
      res.status(200).json(result);
    }  catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(400).json({ message: 'An unknown error occurred' });
      }
    }
  }
}
