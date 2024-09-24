import { Schema, Document } from 'mongoose';

export interface Subscription extends Document {
  userId: string;
  planType: string;  // e.g., 'basic', 'premium'
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}

export const SubscriptionSchema = new Schema<Subscription>({
  userId: { type: String, required: true },
  planType: { type: String, required: true },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
});
