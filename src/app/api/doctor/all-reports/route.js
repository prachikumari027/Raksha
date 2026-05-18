import connectDB from "@/lib/db";
import DoctorReport from "@/models/doctorReportModel";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const doctorId = searchParams.get("doctorId");
    const patientId = searchParams.get("patientId");

    if (!doctorId) {
      return NextResponse.json(
        { error: "doctorId is required" },
        { status: 400 }
      );
    }

    // Build query
    const query = { doctorId };
    if (patientId) {
      query.patientId = patientId;
    }

    // Fetch doctor reports and populate patient info
    const doctorReports = await DoctorReport.find(query)
      .populate("patientId", "name email") // fetch patient's name & email
      .sort({ createdAt: -1 });

    // Flatten and reshape the report data
    const allReports = doctorReports.flatMap((doc) =>
      doc.reports.map((r) => ({
        url: r.url,
        date: r.date,
        disease: r.disease, // Include disease field
        reportName: r.reportName || "report.pdf",
        patientId: doc.patientId._id,
        patientName: doc.patientId.name,
        patientEmail: doc.patientId.email,
      }))
    );

    return NextResponse.json(
      { success: true, reports: allReports },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching doctor reports:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
