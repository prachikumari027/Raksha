"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import UserNavbar from "@/components/UserNavbar";
import UserFooter from "@/components/UserFooter";
import { useUser } from "@/context/userContext";
import axios from "axios";
const tabs = ["started", "upcoming", "completed"];

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("started");
  const [appointments, setAppointments] = useState([]);
  const router = useRouter();
  const { user, userId } = useUser();
  useEffect(() => {
    if (!userId) router.push("/login");
    const fetchAppointments = async () => {
      try {
        const res = await axios.post("/api/booking/all-doct-book-details", {
          patientId: userId,
        });
        if (res.data.success) {
          // console.log("bookings" , res.data.bookings)
          setAppointments(res.data.bookings);
        } else {
          console.error("Failed to fetch bookings:", res.data.message);
        }
      } catch (err) {
        console.error("Error fetching bookings:", err);
      }
    };

    fetchAppointments();
    const interval = setInterval(fetchAppointments, 10000); // Every 10 seconds
    return () => clearInterval(interval);
  }, [userId]);

  // console.log("appointments", appointments);

  const filteredAppointments = appointments
    .filter((a) => a.status === activeTab)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <>
      <UserNavbar />
      <section className="min-h-screen bg-purple-100 dark:bg-purple-950 py-10 px-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-purple-900 dark:text-white mb-8">
          Your Appointments
        </h2>

        <div className="flex flex-col sm:flex-row justify-center mb-8 gap-4 items-center cursor-pointer">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={clsx(
                "px-4 py-2 rounded-full text-sm font-semibold capitalize w-40 text-center cursor-pointer transition transform duration-200 hover:scale-105 active:scale-95 shadow-md",
                {
                  "bg-purple-700 text-white": activeTab === tab,
                  "bg-purple-200 text-purple-900 dark:bg-purple-800 dark:text-white":
                    activeTab !== tab,
                }
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex flex-col-reverse sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAppointments.map((appt) => (
            <div
              key={appt._id}
              onClick={
                appt.type === "started"
                  ? () => router.push(`/user/reports/${appt._id}`)
                  : undefined
              }
              className={clsx(
                "relative bg-pink-50 dark:bg-purple-900 shadow-md rounded-xl p-5 transition transform duration-200",
                {
                  "cursor-pointer hover:shadow-lg hover:scale-105 active:scale-95":
                    appt.type === "started",
                }
              )}
            >
              {appt.type === "started" && (
                <span className="absolute top-3 right-3 w-3 h-3 bg-red-600 rounded-full shadow-md" />
              )}
              <h3 className="text-lg font-semibold text-purple-800 dark:text-white">
                Doctor: {appt.doctorName}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                Patient: {user ? user.name : "patient name loading...."}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Disease: {appt.disease}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-400 mt-2 font-medium">
                Date:{" "}
                {new Date(appt.date).toLocaleDateString("en-US", {
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
              {appt.status === "started" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/user/reports/${appt._id}`);
                  }}
                  className="mt-4 px-4 py-2 bg-purple-700 text-white text-sm rounded-full  hover:bg-purple-800 transition cursor-pointer"
                >
                  View Details
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="my-6 border-t border-gray-300 dark:border-gray-600" />
      </section>
      <UserFooter />
    </>
  );
}
