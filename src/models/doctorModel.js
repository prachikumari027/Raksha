import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  specialization: { type: String },
  qualification: { type: String },
  experience: { type: String },
  hospital: { type: String },
  address: { type: String },
  languages: { type: String },
  consultationFees: { type: String },
  achievements: { type: String },
  college: { type: String },
  pastHospitals: { type: String },
  password: { type: String, required: true },
  profilePic: { type: String },
  resetPasswordToken: {
    type: String,
    default: null,
  },

  resetPasswordExpires: {
    type: Date,
    default: null,
  },
});

const doctorModel =
  mongoose.models.Doctor || mongoose.model("Doctor", doctorSchema);
export default doctorModel;
