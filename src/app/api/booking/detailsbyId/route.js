import connectDB from "@/lib/db";
import bookingModel from "@/models/doctorBookingModel";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectDB();
  try {
    const body = await req.json();
    const { bookingId } = body;

    if (!bookingId) {
      return NextResponse.json(
        { success: false, message: "Missing bookingId" },
        { status: 400 }
      );
    }
    // console.log("bookingId received:", bookingId);
    const booking = await bookingModel
      .findById(bookingId)
      .populate("patientId", "name")
      .populate("doctorId", "name");

    if (!booking) {
      return NextResponse.json(
        { success: false, message: "booking not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error("Failed to fetch booking details:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching booking details" },
      { status: 500 }
    );
  }
}
