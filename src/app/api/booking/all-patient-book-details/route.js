// src/app/api/booking/all/route.js

import connectDB from "@/lib/db";
import bookingModel from "@/models/doctorBookingModel";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectDB();

  try {
    const { doctorId } = await req.json();
    // console.log("consoling the doctorId  passed from the frontend", doctorId);
    if (!doctorId) {
      return NextResponse.json(
        { success: false, message: "Doctor ID is required" },
        { status: 400 }
      );
    }

    const bookings = await bookingModel
      .find({ doctorId: doctorId })
      .populate("patientId", "name")
      .sort({ date: -1 }); // latest first
    // console.log("bookings from the backend side" , bookings);
    const formattedBookings = bookings.map((booking) => ({
      ...booking._doc,
      patient: {
        name: booking.patientId?.name || "N/A",
      },
    }));
    return NextResponse.json({
      success: true,
      bookings:formattedBookings,
    });
  } catch (error) {
    console.error("Failed to fetch bookings:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching bookings" },
      { status: 500 }
    );
  }
}
