import { NextResponse } from "next/server";
import validator from "validator";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import Doctor from "@/models/doctorModel";

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// JWT Token Creator
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export async function POST(req) {
  try {
    await connectDB();

    const formData = await req.formData();
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    const {
      name,
      email,
      phone,
      specialization,
      qualification,
      experience,
      hospital,
      address,
      languages,
      consultationFees,
      achievements,
      college,
      pastHospitals,
      password,
      profilePic,
    } = data;
    // console.log("data:", data);
    if (!validator.isEmail(email)) {
      return NextResponse.json({ success: false, message: "Invalid Email" });
    }

    if (password.length < 8) {
      return NextResponse.json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    
   

    const existingDoctor = await Doctor.findOne({ email });

    if (existingDoctor) {
      return NextResponse.json({
        success: false,
        message: "Doctor already registered",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let imageUrl = "";
    if (
      profilePic &&
      typeof profilePic === "object" &&
      profilePic.arrayBuffer
    ) {
      const buffer = Buffer.from(await profilePic.arrayBuffer());
      const base64 = `data:${profilePic.type};base64,${buffer.toString(
        "base64"
      )}`;

      const uploadResult = await cloudinary.uploader.upload(base64, {
        folder: "rakshaa/doctors",
      });

      imageUrl = uploadResult.secure_url;
    }

    const newDoctor = new Doctor({
      name,
      email,
      phone,
      specialization,
      qualification,
      experience,
      hospital,
      address,
      languages,
      consultationFees,
      achievements,
      college,
      pastHospitals,
      password: hashedPassword,
      profilePic: imageUrl,
    });

    const savedDoctor = await newDoctor.save();
    const token = createToken(savedDoctor._id);

    return NextResponse.json({
      success: true,
      token,
      message: "Doctor Registered Successfully",
    });
  } catch (error) {
    console.error("Doctor registration error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
