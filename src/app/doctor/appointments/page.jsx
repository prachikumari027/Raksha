"use client";

import React, { useEffect, useState } from "react";
import DocNav from "@/components/DocNavbar";
import DoctorFooter from "@/components/DocFooter";
import Link from "next/link";
import axios from "axios";
import { useDoctor } from "@/context/doctorContext";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
export default function AppointmentPage() {
  const [activeTab, setActiveTab] = useState("started");
  const [appointments, setAppointments] = useState([]);
  const { doctorId } = useDoctor();
  const router = useRouter();
  useEffect(() => {
    if (!doctorId) return;

    const fetchAppointments = async () => {
      try {
        const res = await axios.post("/api/booking/all-patient-book-details", {
          doctorId: doctorId,
        });

        if (res.data.success) {
          // console.log("checkingr", res.data.bookings);
          setAppointments(res.data.bookings);
        } else {
          console.error("Failed to fetch appointments");
        }
      } catch (error) {
        console.error("API Error:", error);
      }
    };

    fetchAppointments();
    const interval = setInterval(fetchAppointments, 10000); // Every 10 seconds
    return () => clearInterval(interval);
  }, [doctorId]);

  const handleMarkStarted = async (bookingId) => {
    try {
      const res = await axios.post("/api/booking/markstarted", {
        bookingId: bookingId,
      });
      if (res.data.success) {
        toast.success("Status Updated");
        router.push("/doctor/home");
      } else {
        toast.error("Error Occured");
      }
    } catch (error) {
      toast.error("Error Occured");
      console.log(error);
    }
  };

  const filteredAppointments = appointments.filter(
    (appt) => appt.status === (activeTab === "started" ? "started" : "upcoming")
  );

  return (
    <div className="min-h-screen bg-purple-50 dark:bg-purple-950 text-purple-900 dark:text-purple-100">
      <DocNav />
      <h2 className="text-2xl sm:text-3xl font-bold text-center text-purple-900 dark:text-white mb-8 mt-5">
        Your Appointments
      </h2>

      <div className="px-4 mb-5 max-w-screen">
        <div className="flex flex-wrap gap-3 mb-6 w-full justify-center">
          <button
            onClick={() => setActiveTab("started")}
            className={`px-4 py-2 rounded-3xl font-semibold text-sm sm:text-base cursor-pointer ${
              activeTab === "started"
                ? "bg-purple-700 text-white"
                : "bg-purple-200 text-purple-800"
            }`}
          >
            Started Appointments
          </button>
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`px-4 py-2 rounded-3xl font-semibold text-sm sm:text-base cursor-pointer ${
              activeTab === "upcoming"
                ? "bg-purple-700 text-white"
                : "bg-purple-200 text-purple-800"
            }`}
          >
            Upcoming Appointments
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAppointments.map((appt) => (
            <div
              key={appt._id}
              className="bg-white dark:bg-purple-900 p-5 rounded-xl shadow"
            >
              <h4 className="text-xl font-semibold mb-2">
                {appt.patient?.name || "Patient"}
              </h4>
              <p className="mb-1">
                Date: {new Date(appt.date).toLocaleDateString()}
              </p>
              <p className="mb-1">
                Time:{" "}
                {new Date(appt.date).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p className="mb-1">Disease: {appt.disease}</p>
              <p className="mb-1">Payment Mode: {appt.paymentMode}</p>
              <p className="mb-1">Fee: ₹{appt.consultationFee}</p>

              {appt.status === "started" && (
                <Link
                  href={`/doctor/appointments/${appt._id}`}
                  className="inline-block mt-3 bg-purple-600 text-white px-4 py-1 rounded-3xl hover:bg-purple-700"
                >
                  View Details
                </Link>
              )}
              {appt.status === "upcoming" && (
                <button
                  onClick={() => handleMarkStarted(appt._id)}
                  className="mt-3 inline-block bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 transition-colors duration-300 cursor-pointer"
                >
                  Start Appointment
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <DoctorFooter />
    </div>
  );
}
