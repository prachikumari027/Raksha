// app/api/appointments/doctors/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Doctor from "@/models/doctorModel";
import DoctorBooking from "@/models/doctorBookingModel";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const dateParam = searchParams.get("date");

    if (!dateParam) {
      return NextResponse.json({ error: "Missing date parameter" }, { status: 400 });
    }

    // Normalize the date to ignore time portion
    const targetDate = new Date(dateParam);
    targetDate.setUTCHours(0, 0, 0, 0);

    const nextDate = new Date(targetDate);
    nextDate.setDate(nextDate.getDate() + 1);

    // Step 1: Find all doctor bookings on that date
    const bookings = await DoctorBooking.find({
      date: { $gte: targetDate, $lt: nextDate },
    });

    const bookedDoctorIds = bookings.map((b) => b.doctorId.toString());

    // Step 2: Find all doctors not booked
    const availableDoctors = await Doctor.find({
      _id: { $nin: bookedDoctorIds },
    });

    return NextResponse.json(availableDoctors);
  } catch (error) {
    console.error("Error fetching available doctors:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
