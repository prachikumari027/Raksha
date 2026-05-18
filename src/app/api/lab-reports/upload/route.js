import { NextResponse } from "next/server";
import LabReport from "@/models/labReportModel";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";

export async function POST(req) {
  try {
    await connectDB();
    const token = req.headers.get("authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        { success: false, message: "No token provided" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const body = await req.json();
    const { patientId, doctorId, url } = body;

    if (!url || !patientId) {
      return NextResponse.json(
        { success: false, message: "Missing data" },
        { status: 400 }
      );
    }

    let labReport = await LabReport.findOne({ patientId, labId: decoded.id });

    const reportEntry = {
      url,
      date: new Date(),
    };

    if (labReport) {
      labReport.reports.push(reportEntry);
      if (doctorId) labReport.doctorId = doctorId;
      await labReport.save();
    } else {
      labReport = new LabReport({
        patientId,
        labId: decoded.id,
        doctorId,
        reports: [reportEntry],
      });
      await labReport.save();
    }

    return NextResponse.json({ success: true, labReport }, { status: 200 });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
