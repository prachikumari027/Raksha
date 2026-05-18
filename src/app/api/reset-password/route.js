import connectDB from "@/lib/db";
import patientModel from "@/models/patientModel";
import doctorModel from "@/models/doctorModel";
import bcrypt from "bcryptjs";

export async function POST(req, res) {
  try {
    await connectDB();

    const { token, role, newPassword } = await req.json();

    if (!token || !role || !newPassword) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
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

    // Find user with valid token & expiry
    const user = await UserModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, // token not expired
    });

    if (!user) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired token" }),
        { status: 400 }
      );
    }

    // Hash new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password and clear reset fields
    user.password = hashedPassword;
    user.resetPasswordToken = "";
    user.resetPasswordExpires = "";

    await user.save();

    return new Response(
      JSON.stringify({
        success: true,
        message: "Password has been reset successfully",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Reset password error:", error);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}
