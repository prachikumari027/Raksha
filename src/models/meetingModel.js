import mongoose from "mongoose";


const appointmentSchema = new mongoose.Schema({
  appointmentId:mongoose.Schema.Types.ObjectId, 
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  date: Date,
  status: String,
  meetingLink: String, 
  meetingCreatedAt: Date, 
});

const Appointment =
  mongoose.models.Appointment || mongoose.model("Appointment", appointmentSchema);

export default Appointment;
