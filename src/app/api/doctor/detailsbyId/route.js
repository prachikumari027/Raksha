
import connectDB from "@/lib/db";
import doctorModel from "@/models/doctorModel";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectDB();
  try {
    const body = await req.json();
    const { doctorId } = body;

    if (!doctorId) {
      return NextResponse.json({ success: false, message: "Missing doctorId" }, { status: 400 });
    }
    // console.log("doctorId received:", doctorId);
    const doctor = await doctorModel.findById(doctorId).select("-password");

    if (!doctor) {
      return NextResponse.json({ success: false, message: "Doctor not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      doctor,
    });
  } catch (error) {
    console.error("Failed to fetch doctor details:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching doctor details" },
      { status: 500 }
    );
  }
}
