// src/app/api/user/me/route.js

import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import patientModel from "@/models/patientModel";
import { NextResponse } from "next/server";

export async function GET(req) {
  await connectDB();

  try {
    const token = req.headers.get("authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ success: false, message: "No token provided" }, { status: 401 });
    }

    // console.log("secret printing",process.env.JWT_SECRET)
    // console.log("token checking" , token)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await patientModel.findById(decoded.id).select("-password");

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
