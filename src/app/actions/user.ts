"use server";

import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

export async function getUserProfile(email: string) {
  try {
    await connectToDatabase();
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ email, familyMembers: 2, healthConditions: [], dietaryPreferences: [] });
    }
    return { success: true, data: JSON.parse(JSON.stringify(user)) };
  } catch (error: any) {
    console.warn("DB Auth Failed - falling back to client-side storage:", error.message);
    // Fallback for demo environments without DB access
    return { success: true, isFallback: true };
  }
}

export async function updateUserProfile(data: {
  email: string;
  familyMembers?: number;
  healthConditions?: string[];
  dietaryPreferences?: string[];
}) {
  try {
    await connectToDatabase();
    const user = await User.findOneAndUpdate(
      { email: data.email },
      { $set: data },
      { new: true, upsert: true }
    );
    return { success: true, data: JSON.parse(JSON.stringify(user)) };
  } catch (error: any) {
    console.warn("DB Update Failed - using client-side fallback:", error.message);
    return { success: true, isFallback: true };
  }
}
