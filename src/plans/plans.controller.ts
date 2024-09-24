import { Controller, Post, Get, Body } from '@nestjs/common';
import { PlansService } from './plans.service';

@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Post('create')
  async createPlan(
    @Body('name') name: string,
    @Body('price') price: number,
    @Body('duration') duration: number,
    @Body('features') features: string[],
  ) {
    return this.plansService.createPlan(name, price, duration, features);
  }

  @Get()
  async getAllPlans() {
    return this.plansService.getAllPlans();
  }
}
