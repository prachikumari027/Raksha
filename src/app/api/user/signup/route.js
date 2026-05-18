import { NextResponse } from "next/server";
import validator from "validator";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
import jwt from "jsonwebtoken";
import patientModel from "@/models/patientModel";
import connectDB from "@/lib/db";

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// JWT Token Creator
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Main POST handler
export async function POST(req) {
  try {
    await connectDB();
    // console.log("hiii this is the debugging line")
    const formData = await req.formData();
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    const {
      name,
      email,
      phone,
      address,
      emergencyContact,
      bloodType,
      allergies,
      medications,
      weight,
      height,
      age,
      password,
      profilePic,
    } = data;

    // console.log("as", data);
    if (!validator.isEmail(email)) {
      return NextResponse.json({
        success: false,
        message: "Enter a valid email",
      });
    }

    if (password.length < 8) {
      return NextResponse.json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    const existingPatient = await patientModel.findOne({ email });

    if (existingPatient) {
      return NextResponse.json({
        success: false,
        message: "Patient already registered",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    let imageUrl = "";
    // Profile Picture Upload (if available)
    if (
      profilePic &&
      typeof profilePic === "object" &&
      profilePic.arrayBuffer
    ) {
      const buffer = Buffer.from(await profilePic.arrayBuffer());
      const base64 = `data:${profilePic.type};base64,${buffer.toString(
        "base64"
      )}`;

      const result = await cloudinary.uploader.upload(base64, {
        folder: "rakshaa/patients",
      });

      imageUrl = result.secure_url;
    }

    const newPatient = new patientModel({
      name,
      email,
      phone,
      address,
      emergencyContact,
      bloodType,
      allergies,
      medications,
      weight,
      height,
      age,
      password: hashedPassword,
      profilePic: imageUrl,
    });
    // console.log(newPatient.profilePic);
    const savedPatient = await newPatient.save();
    const token = createToken(savedPatient._id);

    return NextResponse.json({
      success: true,
      token,
      message: "Patient Registered Successfully",
    });
  } catch (error) {
    console.log("Registration error:", error);
    return NextResponse.json({ success: false, message: error.message });
  }
}
