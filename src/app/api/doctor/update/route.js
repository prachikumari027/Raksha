import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import connectDB from "@/lib/db";
import doctorModel from "@/models/doctorModel";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function PUT(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { doctorId, ...updatedData } = body;
    if (!doctorId) {
      return NextResponse.json({
        success: false,
        message: "Missing doctor ID",
      });
    }

    const updatedDoctor = await doctorModel
      .findByIdAndUpdate(
        doctorId,
        { $set: updatedData },
        { new: true, runValidators: true }
      )
      .select("-password");

    if (!updatedDoctor) {
      return NextResponse.json(
        { success: false, message: "Doctor not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      doctor: updatedDoctor,
    });
  } catch (err) {
    console.error("Update error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
