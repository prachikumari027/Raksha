import mongoose from 'mongoose';

const doctorBookingSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true,
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
  },
  doctorName: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  disease: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['upcoming', 'started', 'completed'],
    default: 'upcoming',
  },
  consultationFee: {
    type: Number,
    required: true,
  },
  paymentMode: {
    type: String,
    enum: ['cash', 'card', 'upi', 'online'],
    default: 'cash',
  },
}, { timestamps: true });

const DoctorBooking = mongoose.models.DoctorBooking ||mongoose.model('DoctorBooking', doctorBookingSchema);

export default DoctorBooking;
