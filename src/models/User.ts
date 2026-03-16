import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  familyMembers: number;
  healthConditions: string[];
  dietaryPreferences: string[];
  profileImage?: string;
  currentPlan: string;
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  familyMembers: { type: Number, default: 1 },
  healthConditions: [{ type: String }],
  dietaryPreferences: [{ type: String }],
  profileImage: { type: String },
  currentPlan: { type: String, default: 'FREE' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
