import connectDB from "@/lib/db";
import patientModel from "@/models/patientModel";
import doctorModel from "@/models/doctorModel";
import crypto from "crypto";
import nodemailer from "nodemailer";

export async function POST(req, res) {
  try {
    await connectDB();

    const { email, role } = await req.json();

    if (!email || !role) {
      return new Response(
        JSON.stringify({ error: "Email and role are required" }),
        { status: 400 }
      );
    }

    // Select model based on role
    let UserModel;
    if (role === "Patient") {
      UserModel = patientModel;
    } else if (role === "Doctor") {
      UserModel = doctorModel;
    } else {
      return new Response(JSON.stringify({ error: "Invalid role" }), {
        status: 400,
      });
    }

    // Find user by email
    const user = await UserModel.findOne({ email });
    if (!user) {
      return new Response(
        JSON.stringify({ error: "User not found with this email" }),
        { status: 404 }
      );
    }

    // Generate reset token and expiry (1 hour)
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 3600000;

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();

    // Prepare reset URL with token and role params
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${resetToken}&role=${role}`;

    // Setup nodemailer transporter with Gmail service
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email content
    const mailOptions = {
      from: `"Rakshaa Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Request",
      html: `
        <p>Hello,</p>
        <p>You requested a password reset for your <strong>${role}</strong> account.</p>
        <p>Please click the link below to reset your password:</p>
        <a href="${resetUrl}" style="background-color:#7c3aed;color:white;padding:10px 15px;border-radius:5px;text-decoration:none;">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you did not request this, please ignore this email.</p>
        <br/>
        <p>Thanks,<br/>Rakshaa Team</p>
      `,
    };

    // Send mail
    await transporter.sendMail(mailOptions);

    return new Response(
      JSON.stringify({
         success: true,
        message: `Password reset link sent to ${email}. Please check your inbox.`,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}
