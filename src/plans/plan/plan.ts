import { Schema, Document } from 'mongoose';

export interface Plan extends Document {
  name: string;
  price: number;
  duration: number;
  features: string[];
}

export const PlanSchema = new Schema<Plan>({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: Number, required: true },
  features: [{ type: String }],
});
