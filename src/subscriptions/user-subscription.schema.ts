import { Schema, Document } from 'mongoose';


export const UserSubscriptionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  subscriptionId: { type: Schema.Types.ObjectId, ref: 'Subscription', required: true },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
});

export interface UserSubscription extends Document {
  id: string;
  userId: string;
  subscriptionId: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}
