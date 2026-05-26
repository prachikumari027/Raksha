import mongoose from "mongoose";

const forwardedReportSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const patientReportSchema = new mongoose.Schema(
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
    reports: [forwardedReportSchema],
  },
  { timestamps: true }
);

const PatientReport =
  mongoose.models.PatientReport || mongoose.model("PatientReport", patientReportSchema);

export default PatientReport;
