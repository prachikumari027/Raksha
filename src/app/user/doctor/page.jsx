"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import UserNavbar from "@/components/UserNavbar";
import UserFooter from "@/components/UserFooter";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function DoctorSection() {
  const [doctors, setDoctors] = useState([]);
  const router = useRouter();
  const [selectedSpecializations, setSelectedSpecializations] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();
  const [loading, setLoading] = useState(true);
  const specializations = [
    ...new Set(doctors.map((doc) => doc.specialization)),
  ];

  const toggleSpecialization = (spec) => {
    if (selectedSpecializations.includes(spec)) {
      setSelectedSpecializations(
        selectedSpecializations.filter((s) => s !== spec)
      );
    } else {
      setSelectedSpecializations([...selectedSpecializations, spec]);
    }
  };
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get("/api/user/all-doctors");
        if (response.data.success) {
          setDoctors(response.data.doctors);
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();

    const interval = setInterval(fetchDoctors, 10000); // Every 10 seconds
    return () => clearInterval(interval);

  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  let filteredDoctors = doctors.filter((doc) =>
    selectedSpecializations.length === 0
      ? true
      : selectedSpecializations.includes(doc.specialization)
  );

  if (sortBy === "price") {
    filteredDoctors.sort((a, b) => a.price - b.price);
  } else if (sortBy === "rating") {
    filteredDoctors.sort((a, b) => b.rating - a.rating);
  }
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 bg-purple-50 dark:bg-purple-900 min-h-screen px-4">
        <div className="flex flex-col items-center space-y-6">
          {/* Gradient Spinner */}
          <div className="w-16 h-16 border-4 border-transparent border-t-purple-500 border-l-purple-400 rounded-full animate-spin bg-gradient-to-r from-purple-300 via-purple-400 to-purple-600 shadow-lg"></div>

          {/* Animated Loading Text */}
          <p className="text-purple-700 dark:text-purple-200 text-xl font-semibold animate-pulse">
            Loading doctors...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <UserNavbar />
      <section className="py-10 bg-purple-50 dark:bg-purple-900">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-purple-800 dark:text-purple-100 mb-8 text-center">
            Meet Our Experts
          </h1>

          <div className="mb-6 flex flex-col md:flex-row justify-between gap-4 items-start md:items-center relative">
            {/* Filter Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="border border-purple-300 dark:border-purple-600 bg-white dark:bg-purple-800 rounded px-3 py-2 text-sm font-medium text-purple-800 dark:text-purple-100 cursor-pointer"
              >
                Filter by Specialization ⏷
              </button>

              {dropdownOpen && (
                <div className="absolute z-10 mt-2 bg-white dark:bg-purple-800 border border-purple-300 dark:border-purple-600 rounded-lg shadow-lg p-3 max-h-60 overflow-y-auto w-56">
                  {specializations.map((spec) => (
                    <label
                      key={spec}
                      className="block text-sm text-purple-800 dark:text-purple-100 mb-1"
                    >
                      <input
                        type="checkbox"
                        checked={selectedSpecializations.includes(spec)}
                        onChange={() => toggleSpecialization(spec)}
                        className="mr-2 accent-purple-600"
                      />
                      {spec}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-purple-300 dark:border-purple-600 rounded px-3 py-2 text-sm text-purple-800 dark:text-purple-100 bg-white dark:bg-purple-800"
            >
              <option value="">Sort By</option>
              <option value="price">Price (Low to High)</option>
              <option value="rating">Rating (High to Low)</option>
            </select>
          </div>

          {/* Doctors Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredDoctors.map((doctor) => (
              <div
                key={doctor._id}
                className="bg-gradient-to-tr from-purple-200 via-white to-purple-100 dark:from-purple-800 dark:via-purple-950 dark:to-purple-900 shadow-md rounded-3xl p-5 transition-all duration-300 hover:shadow-2xl hover:scale-[1.03] border border-purple-300 dark:border-purple-700"
              >
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-20 h-20 rounded-full border-4 border-purple-400 dark:border-purple-600 shadow-md overflow-hidden bg-black">
                    <Image
                      src={doctor.profilePic}
                      alt={doctor.name}
                      width={80}
                      height={80}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <h2 className="text-xl font-bold text-purple-800 dark:text-purple-200">
                    {doctor.name}
                  </h2>
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-300">
                    {doctor.specialization}
                  </p>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 max-w-[90%]">
                    {doctor.experience}
                  </p>
                  <p className="text-sm font-bold text-green-700 dark:text-green-400">
                    ₹{doctor.consultationFees}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center gap-1 text-yellow-400">
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

                  <button
                    onClick={() => router.push(`/user/doctor/${doctor._id}`)}
                    className="mt-3 px-5 py-2  rounded-full bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold shadow-md hover:scale-105 transition cursor-pointer"
                  >
                    Take Appointment
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <UserFooter />
    </>
  );
}
