"use client";

import React, { useState } from "react";
import UserNavbar from "@/components/UserNavbar";
import { useRouter } from "next/navigation";

const dummyReports = [
  {
    id: 1,
    pathlabName: "HealthCare Diagnostics Lab",
    patientName: "Aryan Verma",
    date: "2025-04-07",
    tests: ["CBC", "Blood Sugar", "Liver Function Test"],
    status: "Completed",
  },
  {
    id: 2,
    pathlabName: "Wellness Labs",
    patientName: "Simran Kaur",
    date: "2025-04-05",
    tests: ["Thyroid Profile", "Vitamin D Test"],
    status: "Pending",
  },
  {
    id: 3,
    pathlabName: "CityPath Diagnostics",
    patientName: "Rahul Mehra",
    date: "2025-04-02",
    tests: ["Kidney Function Test", "Urine Test"],
    status: "Completed",
  },
];

const PathlabReportsPage = () => {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const filteredReports = dummyReports.filter((report) => {
    const searchLower = search.toLowerCase();
    return (
      report.pathlabName.toLowerCase().includes(searchLower) ||
      report.tests.some((test) => test.toLowerCase().includes(searchLower))
    );
  });

  const handleView = (id) => {
    // Navigate to report detail page (you should create this route)
    router.push(`/user/pathlab-reports/${id}`);
  };

  return (
    <>
      <UserNavbar />
      <div className="min-h-screen bg-purple-50 dark:bg-purple-900 py-10 px-4 sm:px-8">
        <h1 className="text-3xl font-bold text-center text-purple-800 dark:text-white mb-6">
          Pathlab Reports
        </h1>

        <div className="max-w-md mx-auto mb-8">
          <input
            type="text"
            placeholder="Search by pathlab or test name..."
            className="w-full px-4 py-2 rounded-xl border border-purple-300 dark:border-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-purple-950 dark:text-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {filteredReports.length > 0 ? (
            filteredReports.map((report) => (
              <div
                key={report.id}
                className="bg-white dark:bg-purple-950 border border-purple-300 dark:border-purple-700 rounded-2xl shadow-md p-6 transition hover:shadow-lg"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
                  <h2 className="text-xl font-semibold text-purple-800 dark:text-purple-100">
                    {report.pathlabName}
                  </h2>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs px-3 py-1 rounded-full ${
                        report.status === "Completed"
                          ? "bg-green-200 text-green-800"
                          : "bg-yellow-200 text-yellow-800"
                      }`}
                    >
                      {report.status}
                    </span>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      📅 {report.date}
                    </p>
                  </div>
                </div>

                <div className="text-sm text-gray-700 dark:text-gray-200 mb-2">
                  👤 <span className="font-medium">{report.patientName}</span>
                </div>

                <div className="text-sm text-gray-700 dark:text-gray-200 mb-4">
                  🧪 <span className="font-medium">Tests:</span>{" "}
                  {report.tests.join(", ")}
                </div>

                <button
                  onClick={() => handleView(report.id)}
                  className="bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700 transition text-sm cursor-pointer"
                >
                  View
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600 dark:text-gray-300">
              No reports found.
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default PathlabReportsPage;
