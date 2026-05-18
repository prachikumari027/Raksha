import connectDB from "@/lib/db";
import patientModel from "@/models/patientModel";
import { NextResponse } from "next/server";

export async function PUT(req) {
  await connectDB();

  try {
    const body = await req.json();
    const { userId, ...updatedData } = body;

    if (!userId) {
      return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 });
    }

    const updatedUser = await patientModel.findByIdAndUpdate(
      userId,
      { $set: updatedData },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
