// app/api/doctor/reports/route.js
import connectDB from "@/lib/db";
import DoctorReport from "@/models/doctorReportModel";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const doctorId = searchParams.get("doctorId");
    const patientId = searchParams.get("patientId");

    if (!doctorId || !patientId) {
      return NextResponse.json(
        { error: "Both doctorId and patientId are required" },
        { status: 400 }
      );
    }

    // Find all DoctorReport documents for this doctor
    const doctorReports = await DoctorReport.find({ doctorId, patientId })
      .populate("patientId", "name email")
      .sort({ createdAt: -1 });

    // console.log(doctorReports);

    // Flatten all reports into one array with metadata
    const allReports = doctorReports.flatMap((doc) =>
      doc.reports.map((r) => ({
        url: r.url,
        date: r.date,
        patientId: doc.patientId._id,
        patientName: doc.patientId.name,
        patientEmail: doc.patientId.email,
      }))
    );

    return NextResponse.json({ reports: allReports }, { status: 200 });
  } catch (error) {
    console.error("Error fetching doctor reports:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
