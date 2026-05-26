"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import UserNavbar from "@/components/UserNavbar";
import UserFooter from "@/components/UserFooter";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { useUser } from "@/context/userContext";
// Predefined slot times
const timeSlots = {
  "10:00 AM": 3,
  "11:00 AM": 2,
  "12:00 PM": 5,
  "2:00 PM": 4,
  "3:00 PM": 1,
};

const isWeekday = (date) => {
  const day = date.getDay();
  return day >= 1 && day <= 5; // Mon to Fri
};

export default function DoctorDetailsPage() {
  const router = useRouter();
  const { user } = useUser();
  const [date, setDate] = useState("");
  const [disease, setDisease] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [showSlots, setShowSlots] = useState(false);
  const [isValidDay, setIsValidDay] = useState(false);
  const params = useParams();
  const doctorId = params.id;
  // console.log("doctor id from frontend", doctorId);
  const [doctor, setDoctor] = useState(null);

  const [selectedDateObj, setSelectedDateObj] = useState(null);

  const handleDateChange = (e) => {
    const selectedDate = new Date(e.target.value);

    const formatted = selectedDate.toLocaleDateString("en-CA");
    setDate(formatted);
    setSelectedDateObj(selectedDate);
    setSelectedSlot("");
    setShowSlots(false);
    setIsValidDay(isWeekday(selectedDate));
  };

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const res = await axios.post(
          "/api/doctor/detailsbyId",
          { doctorId },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        // console.log("data doctor", res.data.doctor);

        if (res.data.success) {
          setDoctor(res.data.doctor);
        } else {
          console.error("Doctor not found");
        }
      } catch (err) {
        console.error("Error fetching doctor:", err);
      }
    };

    if (doctorId) {
      fetchDoctorDetails();
    }
  }, [doctorId]);

  if (!doctor) {
    return (
      <>
        <UserNavbar />
        <div className="min-h-screen flex flex-col items-center justify-center bg-purple-50 dark:bg-purple-900 px-4">
          {/* Gradient Spinner */}
          <div className="w-16 h-16 border-4 border-transparent border-t-purple-500 border-l-purple-400 rounded-full animate-spin bg-gradient-to-r from-purple-300 via-purple-400 to-purple-600 shadow-lg mb-6"></div>

          {/* Animated Text */}
          <p className="text-purple-800 dark:text-purple-200 text-xl font-semibold animate-pulse">
            Loading doctor details...
          </p>
        </div>
        <UserFooter />
      </>
    );
  }

  const handleAppointment = () => {
    if (!date || !selectedSlot) {
      alert("Please select a date and a valid slot.");
      return;
    }

    const queryParams = new URLSearchParams({
      doctorId: doctorId,
      patientId: user._id,
      doctorName: doctor.name,
      date: selectedDateObj.toISOString(),
      disease: disease,
      consultationFee: doctor.consultationFees,
      paymentMode: "online",
      patientName: user.name,
    });

    router.push(`/user/doctor/${doctorId}/booking?${queryParams.toString()}`);
  };

  return (
    <>
      <UserNavbar />
      <div className="bg-purple-50 dark:bg-purple-900 min-h-screen py-10">
        <div className="max-w-5xl mx-auto bg-white dark:bg-purple-950 rounded-3xl shadow-xl p-8 md:p-12 border border-purple-300 dark:border-purple-700">
          {/* Doctor Info */}
          <div className="flex flex-col md:flex-row items-center gap-8">
            <Image
              src={doctor.profilePic}
              alt={doctor.name}
              width={160}
              height={160}
              className="rounded-full border-4 border-purple-400 dark:border-purple-600 shadow-md"
            />
            <div className="text-center md:text-left space-y-2">
              <h2 className="text-3xl font-bold text-purple-800 dark:text-purple-100">
                {doctor.name}
              </h2>
              <p className="text-xl font-medium text-purple-600 dark:text-purple-300">
                {doctor.specialization}
              </p>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                {doctor.qualification}
              </p>
              <p className="text-sm text-green-600 dark:text-green-400 font-bold">
                ₹{doctor.consultationFees} per consultation
              </p>
              <div className="flex items-center gap-1 justify-center md:justify-start text-yellow-400">
                {[...Array(3)].map((_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    className="w-4 h-4"
                  >
                    <path d="M12 .587l3.668 7.571 8.332 1.151-6.064 5.916 1.428 8.294L12 18.896l-7.364 4.623 1.428-8.294-6.064-5.916 8.332-1.151z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="mt-10 space-y-4 text-purple-800 dark:text-purple-100">
            <h3 className="text-2xl font-bold border-b border-purple-300 dark:border-purple-600 pb-2">
              About Doctor
            </h3>
            <p className="text-sm leading-relaxed text-gray-800 dark:text-gray-200">
              {doctor.qualification}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div className="bg-purple-100 dark:bg-purple-800 p-4 rounded-xl">
                <p className="font-semibold">Experience</p>
                <p className="text-sm text-gray-700 dark:text-gray-200">
                  {doctor.experience}
                </p>
              </div>
              <div className="bg-purple-100 dark:bg-purple-800 p-4 rounded-xl">
                <p className="font-semibold">Clinic Location</p>
                <p className="text-sm text-gray-700 dark:text-gray-200">
                  {doctor.address}
                </p>
              </div>
              <div className="bg-purple-100 dark:bg-purple-800 p-4 rounded-xl">
                <p className="font-semibold">Availability</p>
                <p className="text-sm text-gray-700 dark:text-gray-200">
                  Mon-Fri (10 am - 6 Pm)
                </p>
              </div>
              <div className="bg-purple-100 dark:bg-purple-800 p-4 rounded-xl">
                <p className="font-semibold">Consultation Fee</p>
                <p className="text-sm text-gray-700 dark:text-gray-200">
                  ₹{doctor.consultationFees}
                </p>
              </div>
            </div>
          </div>

          {/* Date & Slot Selection */}
          <div className="mt-12 space-y-6">
            {/* Date Picker */}
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">
                Select Appointment Date
              </label>
              <input
                type="date"
                value={date}
                onChange={handleDateChange}
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-3 py-2 rounded-lg border border-purple-300 dark:border-purple-700 bg-purple-100 dark:bg-purple-800 text-purple-900 dark:text-white"
              />
            </div>
            {/* Disease Input */}
            <div className="mt-8">
              <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">
                Describe Your Health Issue / Disease
              </label>
              <textarea
                value={disease}
                onChange={(e) => setDisease(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-purple-300 dark:border-purple-700 bg-purple-100 dark:bg-purple-800 text-purple-900 dark:text-white"
                placeholder="E.g., Fever, Cough, Headache..."
              ></textarea>
            </div>

            {/* Slot Reveal Button */}
            {date && (
              <div className="text-center">
                <button
                  onClick={() => setShowSlots(true)}
                  className="px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-all cursor-pointer"
                >
                  Select Slot
                </button>
              </div>
            )}

            {/* Slot Selector */}
            {showSlots && (
              <div>
                {isValidDay ? (
                  <>
                    <p className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                      Available Time Slots
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {Object.entries(timeSlots).map(([slot, count]) => (
                        <label
                          key={slot}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition-all cursor-pointer ${
                            selectedSlot === slot
                              ? "bg-green-500 text-white border-green-600"
                              : count === 0
                              ? "bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed"
                              : "bg-purple-100 dark:bg-purple-800 text-purple-900 dark:text-white border-purple-300 dark:border-purple-700 hover:bg-purple-200 dark:hover:bg-purple-700"
                          }`}
                        >
                          <input
                            type="radio"
                            name="slot"
                            value={slot}
                            checked={selectedSlot === slot}
                            onChange={() => setSelectedSlot(slot)}
                            disabled={count === 0}
                            className="hidden"
                          />
                          {slot}{" "}
                          <span className="text-xs ml-1 font-normal">
                            ({count} left)
                          </span>
                        </label>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="text-center text-red-500 font-semibold">
                    Doctor is not available on weekends. Please select a
                    weekday.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Appointment Button */}
          {selectedSlot && (
            <div className="mt-10 text-center">
              <button
                onClick={handleAppointment}
                className="px-8 py-3 bg-gradient-to-r from-green-400 to-green-600 text-white font-bold rounded-full shadow-lg hover:scale-105 transition-transform cursor-pointer"
              >
                Take Appointment
              </button>
            </div>
          )}
        </div>
      </div>
      <UserFooter />
    </>
  );
}
