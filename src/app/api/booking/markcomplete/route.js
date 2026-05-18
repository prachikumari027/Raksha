import connectDB from "@/lib/db";
import bookingModel from "@/models/doctorBookingModel";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectDB();
  try {
    const { bookingId } = await req.json();

    if (!bookingId) {
      return NextResponse.json({ success: false, message: "Missing bookingId" }, { status: 400 });
    }

    const updatedBooking = await bookingModel.findByIdAndUpdate(
      bookingId,
      { status: "completed" },
      { new: true }
    );

    if (!updatedBooking) {
      return NextResponse.json({ success: false, message: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, booking: updatedBooking });
  } catch (error) {
    console.error("Error updating booking:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
