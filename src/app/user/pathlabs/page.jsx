"use client";

import Image from "next/image";
import { useState } from "react";
import lab1 from "@/assets/lab1.jpg";
import UserNavbar from "@/components/UserNavbar";
import UserFooter from "@/components/UserFooter";
import { useRouter } from "next/navigation";

const pathlabs = [
  {
    id: 1,
    name: "Thyrocare Diagnostics",
    specialization: "Thyroid & Preventive Health Packages",
    bio: "Nationwide trusted lab for thyroid and full body health checkups.",
    tests: ["Thyroid Panel", "Full Body Checkup", "Diabetes Test"],
    price: 999,
  },
  {
    id: 2,
    name: "Dr. Lal PathLabs",
    specialization: "Comprehensive Pathology Tests",
    bio: "One of India's largest diagnostic chains with accurate results.",
    tests: ["CBC", "Lipid Profile", "Vitamin D", "Blood Sugar"],
    price: 1199,
  },
  {
    id: 3,
    name: "Redcliff Labs",
    specialization: "At-Home Test Services",
    bio: "Modern lab with online booking & doorstep sample collection.",
    tests: ["COVID RT-PCR", "HbA1c", "Allergy Test"],
    price: 899,
  },
  {
    id: 4,
    name: "Apollo Diagnostics",
    specialization: "Hospital-Grade Pathology",
    bio: "Backed by Apollo Hospitals, offers trustworthy diagnostics.",
    tests: ["Liver Function Test", "Renal Profile", "Electrolytes"],
    price: 1399,
  },
];

export default function PathlabSection() {
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const router = useRouter();
  const filteredLabs = pathlabs
    .filter(
      (lab) =>
        lab.name.toLowerCase().includes(search.toLowerCase()) ||
        lab.tests.some((test) =>
          test.toLowerCase().includes(search.toLowerCase())
        )
    )
    .sort((a, b) =>
      sortOrder === "asc" ? a.price - b.price : b.price - a.price
    );

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const handlechange = (id) => {
    router.push(`/user/pathlabs/${id}`);
  };
  return (
    <>
      <UserNavbar />
      <section className="py-12 px-4 bg-purple-50 dark:bg-purple-900 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-6 text-purple-800 dark:text-purple-100">
            Book Pathology Tests at Trusted Labs
          </h2>

          <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
            <input
              type="text"
              placeholder="Search by lab name or test"
              className="w-full sm:w-1/2 px-4 py-2 rounded-xl border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              onClick={toggleSortOrder}
              className="px-4 py-2 bg-purple-600 text-white rounded-full font-semibold hover:bg-purple-700 transition cursor-pointer"
            >
              Sort by Price: {sortOrder === "asc" ? "Low → High" : "High → Low"}
            </button>
          </div>

          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
            {filteredLabs.map((lab) => (
              <div
                key={lab.id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transform transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="flex flex-col sm:flex-row">
                  <div className="min-w-[300px] max-w-[300px]">
                    <Image
                      src={lab1}
                      alt={lab.name}
                      width={300}
                      height={200}
                      className="object-cover w-full h-full"
                    />
                  </div>

                  <div className="p-5 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-purple-800 dark:text-purple-100">
                        {lab.name}
                      </h3>
                      <p className="text-sm text-green-600 font-medium mt-1">
                        {lab.specialization}
                      </p>
                      <p className="text-gray-600 dark:text-purple-300 mt-2 text-sm">
                        {lab.bio}
                      </p>
                      <ul className="text-sm mt-2 text-gray-700 dark:text-purple-200 list-disc list-inside">
                        {lab.tests.map((test, i) => (
                          <li key={i}>{test}</li>
                        ))}
                      </ul>
                      <p className="mt-2 font-semibold text-purple-700 dark:text-purple-100">
                        Starting at ₹{lab.price}
                      </p>
                    </div>
                    <button
                      onClick={() => handlechange(lab.id)}
                      className="mt-4 w-fit px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-semibold transition cursor-pointer"
                    >
                      Book Test
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {filteredLabs.length === 0 && (
              <p className="text-center text-gray-600 dark:text-purple-300 col-span-2">
                No labs found for your search.
              </p>
            )}
          </div>
        </div>
      </section>
      <UserFooter />
    </>
  );
}
