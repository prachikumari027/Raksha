import { NextResponse } from 'next/server';
import DoctorBooking from '@/models/doctorBookingModel';
import connectDB from '@/lib/db'; 

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    const {
      doctorId,
      patientId,
      doctorName,
      date,
      disease,
      consultationFee,
      paymentMode = 'online',
    } = body;
    
    if (
      !doctorId ||
      !patientId ||
      !doctorName ||
      !date ||
      !disease ||
      !consultationFee
    ) {
      return NextResponse.json({ success: false, message: 'Missing fields' }, { status: 400 });
    }

    const newBooking = await DoctorBooking.create({
      doctorId,
      patientId,
      doctorName,
      date,
      disease,
      consultationFee,
      paymentMode,
    });

    return NextResponse.json({ success: true, booking: newBooking });
  } catch (error) {
    console.error('Booking Error:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
