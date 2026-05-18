import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import connectDB from "@/lib/db";
import DoctorReport from "@/models/doctorReportModel";

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    await connectDB();

    const formData = await req.formData();
    const patientId = formData.get("patientId");
    const doctorId = formData.get("doctorId");
    const files = formData.getAll("reports");

    // console.log("backend hit", patientId, doctorId, files);
    
    if (!patientId || !doctorId || files.length === 0) {
      return NextResponse.json(
        { success: false, message: "Missing data" },
        { status: 400 }
      );
    }

    const uploadedUrls = [];

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());

      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: "auto",
            folder: "reports",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        uploadStream.end(buffer);
      });

      uploadedUrls.push({
        url: result.secure_url,
        date: new Date(),
      });
    }

    const reportDoc = await DoctorReport.create({
      patientId,
      doctorId,
      reports: uploadedUrls,
    });

    return NextResponse.json(
      { success: true, data: reportDoc },
      { status: 201 }
    );
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
