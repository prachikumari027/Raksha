import connectDB from "@/lib/db";
import DoctorBooking from "@/models/doctorBookingModel";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    await connectDB();

    const { doctorId } = await req.json();

    if (!doctorId) {
      return NextResponse.json(
        { message: "Doctor ID is required" },
        { status: 400 }
      );
    }

    const appointments = await DoctorBooking.find({ doctorId });

    const completedAppointments = appointments.filter(
      (a) => a.status === "completed"
    ).length;

    const pendingAppointments = appointments.filter(
      (a) => a.status === "upcoming"
    ).length;

    // Total revenue = sum of consultancyFee for all appointments
    const totalRevenue = appointments.reduce(
      (sum, a) => sum + (a.consultationFee || 0),
      0
    );

    return NextResponse.json({
      completedAppointments,
      pendingAppointments,
      totalRevenue,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch appointments", error },
      { status: 500 }
    );
  }
};
