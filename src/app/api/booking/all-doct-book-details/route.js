// src/app/api/booking/all/route.js

import connectDB from "@/lib/db";
import bookingModel from "@/models/doctorBookingModel";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectDB();

  try {
    const { patientId } = await req.json();
    // console.log("consoling the patient id passed from the frontend" , patientId);
    if (!patientId) {
      return NextResponse.json(
        { success: false, message: "Patient ID is required" },
        { status: 400 }
      );
    }

    const bookings = await bookingModel.find({ patientId: patientId }).sort({ date: -1 }); // latest first
    // console.log("bookings from the backend side" , bookings);
    return NextResponse.json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error("Failed to fetch bookings:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching bookings" },
      { status: 500 }
    );
  }
}
