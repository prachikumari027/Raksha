// /app/api/doctor/details/route.js
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import doctorModel from "@/models/doctorModel";
import { NextResponse } from "next/server";

export async function GET(req) {
  await connectDB();

  try {
    const token = req.headers.get("authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ success: false, message: "No token provided" }, { status: 401 });
    }
    // console.log("token in bekendend", token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const doctor = await doctorModel.findById(decoded.id).select("-password");
    // console.log("doctor in backend", doctor);
    if (!doctor) {
      return NextResponse.json({ success: false, message: "Doctor not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, doctor: doctor });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
