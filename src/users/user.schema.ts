import mongoose, { Schema, Document } from 'mongoose';

export interface User extends Document {
  username: string;
  password: string;
  email: string;
  phone:String;
  subscription: {
    planType: string;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
    referralCode?: string;
  } | null;
  resetToken?: string;            
  resetTokenExpiry?: Date;        
}

export const UserSchema = new Schema<User>({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone:{type:String, require:true},
  subscription: {
    planType: { type: String, default: null },
    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null },
    isActive: { type: Boolean, default: false },
    referralCode: { type: String, default: null },
  },
  resetToken: { type: String, default: null },  // New field for reset token
  resetTokenExpiry: { type: Date, default: null }, // New field for token expiry
});

export const UserModel = mongoose.model<User>('User', UserSchema);
