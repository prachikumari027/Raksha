import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const doctorReportSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    reports: [reportSchema],
  },
  { timestamps: true }
);

// Avoid OverwriteModelError
const DoctorReport =
  mongoose.models.DoctorReport || mongoose.model("DoctorReport", doctorReportSchema);

export default DoctorReport;
