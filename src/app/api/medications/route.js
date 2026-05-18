import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Medication from "@/models/medicationModel";
import mongoose from "mongoose";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const patientId = searchParams.get("patientId");
  const doctorId = searchParams.get("doctorId");

  // Validate ObjectIds
  if (!mongoose.Types.ObjectId.isValid(patientId)) {
    return NextResponse.json({ success: false, error: "Invalid patientId" });
  }
  if (doctorId && !mongoose.Types.ObjectId.isValid(doctorId)) {
    return NextResponse.json({ success: false, error: "Invalid doctorId" });
  }

  try {
    await connectDB();

    const filter = { patientId };
    if (doctorId) filter.doctorId = doctorId;

    const medications = await Medication.find(filter).sort({ date: -1 });

    return NextResponse.json({ success: true, medications });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
