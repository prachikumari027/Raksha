"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import labImage from "@/assets/lab1.jpg";
import UserNavbar from "@/components/UserNavbar";
import UserFooter from "@/components/UserFooter";

const testsList = [
  { name: "Complete Blood Count (CBC)", price: 300 },
  { name: "Blood Sugar Test", price: 200 },
  { name: "Liver Function Test", price: 500 },
  { name: "Kidney Function Test", price: 450 },
  { name: "Thyroid Profile", price: 400 },
  { name: "Vitamin D Test", price: 350 },
  { name: "Urine Routine Examination", price: 250 },
];

const timeSlots = {
  "9:00 AM": 3,
  "10:30 AM": 2,
  "12:00 PM": 4,
  "2:00 PM": 1,
  "4:00 PM": 5,
};

const PathlabDetailsPage = () => {
  const router = useRouter();
  const [selectedTests, setSelectedTests] = useState([]);
  const [date, setDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [showSlots, setShowSlots] = useState(false);

  const lab = {
    id: 1,
    name: "HealthCare Diagnostics Lab",
    rating: 4.7,
    location: "Sector 12, New Delhi",
    timings: "Mon - Sat, 8:00 AM - 6:00 PM",
    bio: "HealthCare Diagnostics is a state-of-the-art pathlab offering a wide range of blood and urine tests with quick reports and home sample collection.",
    image: labImage,
  };

  const handleTestChange = (testName) => {
    setSelectedTests((prev) =>
      prev.includes(testName)
        ? prev.filter((t) => t !== testName)
        : [...prev, testName]
    );
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
    setSelectedSlot("");
    setShowSlots(false);
  };

  const handleBooking = () => {
    if (selectedTests.length === 0 || !date || !selectedSlot) {
      alert("Please select at least one test, a date, and a time slot.");
      return;
    }
    router.push(`/user/pathlabs/${lab.id}/booking`);
  };

  const getTotalPrice = () => {
    return selectedTests.reduce((total, testName) => {
      const test = testsList.find((t) => t.name === testName);
      return total + (test?.price || 0);
    }, 0);
  };

  return (
    <>
      <UserNavbar />
      <div className="bg-purple-50 dark:bg-purple-900 min-h-screen py-10">
        <div className="max-w-5xl mx-auto bg-white dark:bg-purple-950 rounded-3xl shadow-xl p-8 md:p-12 border border-purple-300 dark:border-purple-700">
          {/* Lab Info */}
          <div className="flex flex-col md:flex-row items-center gap-8">
            <Image
              src={lab.image}
              alt={lab.name}
              width={180}
              height={180}
              className="rounded-xl shadow-md border-4 border-purple-400 dark:border-purple-600"
            />
            <div className="text-center md:text-left space-y-2">
              <h2 className="text-3xl font-bold text-purple-800 dark:text-purple-100">
                {lab.name}
              </h2>
              <p className="text-sm text-gray-700 dark:text-gray-300">{lab.location}</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">{lab.timings}</p>
              <div className="flex items-center justify-center md:justify-start gap-1 text-yellow-400">
                {[...Array(Math.round(lab.rating))].map((_, i) => (
                  <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 .587l3.668 7.571 8.332 1.151-6.064 5.916 1.428 8.294L12 18.896l-7.364 4.623 1.428-8.294-6.064-5.916 8.332-1.151z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>

          {/* About */}
          <div className="mt-10 text-purple-800 dark:text-purple-100 space-y-4">
            <h3 className="text-2xl font-bold border-b border-purple-300 dark:border-purple-600 pb-2">
              About the Pathlab
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">{lab.bio}</p>
          </div>

          {/* Test Selection */}
          <div className="mt-10">
            <h3 className="text-xl font-bold text-purple-800 dark:text-purple-100 mb-4">
              Select Tests
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {testsList.map((test) => (
                <label
                  key={test.name}
                  className="flex items-center justify-between gap-3 bg-purple-100 dark:bg-purple-800 p-3 rounded-xl text-sm font-medium cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      value={test.name}
                      checked={selectedTests.includes(test.name)}
                      onChange={() => handleTestChange(test.name)}
                      className="accent-purple-600"
                    />
                    {test.name}
                  </div>
                  <span className="text-xs text-purple-700 dark:text-purple-300">
                    ₹{test.price}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Date Picker */}
          <div className="mt-10">
            <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">
              Select Date
            </label>
            <input
              type="date"
              value={date}
              onChange={handleDateChange}
              className="w-full px-3 py-2 rounded-lg border border-purple-300 dark:border-purple-700 bg-purple-100 dark:bg-purple-800 text-purple-900 dark:text-white"
            />
          </div>

          {/* Slot Selection */}
          {date && (
            <div className="mt-6">
              <button
                onClick={() => setShowSlots(true)}
                className="px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition cursor-pointer"
              >
                Show Slots
              </button>
            </div>
          )}
          {showSlots && (
            <div className="mt-4">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Available Slots
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {Object.entries(timeSlots).map(([slot, count]) => (
                  <label
                    key={slot}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border cursor-pointer transition-all ${
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
                    {slot} <span className="text-xs ml-1 font-normal">({count} left)</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Total Price & Book Button */}
          {selectedSlot && (
            <div className="mt-10 text-center space-y-4">
              <p className="text-lg font-semibold text-purple-800 dark:text-purple-100">
                Total Price: ₹{getTotalPrice()}
              </p>
              <button
                onClick={handleBooking}
                className="px-8 py-3 bg-gradient-to-r from-green-400 to-green-600 text-white font-bold rounded-full shadow-lg hover:scale-105 transition-transform cursor-pointer"
              >
                Book Lab Test
              </button>
            </div>
          )}
        </div>
      </div>
      <UserFooter />
    </>
  );
};

export default PathlabDetailsPage;
