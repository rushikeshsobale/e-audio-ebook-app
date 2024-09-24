import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Plan } from './plan/plan';

@Injectable()
export class PlansService {
    constructor(
        @InjectModel('Plan') private readonly planModel: Model<Plan>,
      ) {}

  async createPlan(name: string, price: number, duration: number, features: string[]): Promise<Plan> {
    
    const newPlan = new this.planModel({ name, price, duration, features });
    return await newPlan.save();
  }

  async getAllPlans(): Promise<Plan[]> {
    return await this.planModel.find().exec();
  }

  async getPlanById(id: string): Promise<Plan> {
    const plan = await this.planModel.findById(id).exec();
    if (!plan) {
      throw new NotFoundException(`Plan with id ${id} not found`);
    }
    return plan;
  }

}
