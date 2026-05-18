// src/app/api/doctors/route.js

import connectDB from "@/lib/db";
import doctorModel from "@/models/doctorModel";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();

  try {
    const doctors = await doctorModel.find().select("-password"); // omit passwords

    return NextResponse.json({
      success: true,
      doctors,
    });
  } catch (error) {
    console.error("Failed to fetch doctors:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching doctors" },
      { status: 500 }
    );
  }
}
