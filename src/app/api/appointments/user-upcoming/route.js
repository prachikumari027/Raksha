// /api/appointments/user-upcoming (GET)
import Appointment from "@/models/meetingModel";
import connectDB from "@/lib/db";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const appointmentId = searchParams.get("appointmentId");

    if (!appointmentId) {
      return new Response(JSON.stringify({ error: "Missing appointmentId" }), {
        status: 400,
      });
    }

    const upcomingAppointment = await Appointment.findOne({
      appointmentId,
      status: "scheduled", // only fetch if status is 'scheduled'
    });

    if (!upcomingAppointment) {
  return Response.json({
    meetingLink: null,
    message: "No scheduled meeting found",
  });
} 

    // Mark the appointment as completed (so it doesn't reappear)
    upcomingAppointment.status = "completed";
    await upcomingAppointment.save();

    return Response.json({
      meetingLink: upcomingAppointment.meetingLink || null,
    });

  } catch (err) {
    console.error("Error fetching appointment:", err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}
