import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlansService } from './plans.service';
import { PlansController } from './plans.controller';
import { PlanSchema } from './plan/plan';  // Adjust the path if necessary

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Plan', schema: PlanSchema }]),  // Register the Plan schema
  ],
  providers: [PlansService],
  controllers: [PlansController],
  exports: [PlansService],  // Export PlansService if needed elsewhere
})
export class PlansModule {}
