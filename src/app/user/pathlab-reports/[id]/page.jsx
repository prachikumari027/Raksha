"use client";

import React from "react";
import UserNavbar from "@/components/UserNavbar";

const dummyReportDetail = {
  id: 1,
  patientName: "Aryan Verma",
  pathlabName: "HealthCare Diagnostics Lab",
  date: "2025-04-07",
  tests: ["CBC", "Blood Sugar", "Liver Function Test"],
  reports: [
    {
      reportName: "CBC Report",
      fileUrl: "/my_resume (1).pdf",
    },
    {
      reportName: "Blood Sugar Report",
      fileUrl: "/Medication_2025-04-13.pdf",
    },
    {
      reportName: "Liver Function Report",
      fileUrl: "/dummy-prescription.pdf",
    },
  ],
};

const PathlabReportDetailsPage = () => {
  return (
    <>
      <UserNavbar />
      <div className="min-h-screen bg-purple-50 dark:bg-purple-900 py-10 px-4 sm:px-8">
        <div className="max-w-3xl mx-auto bg-white dark:bg-purple-950 border border-purple-300 dark:border-purple-700 rounded-2xl shadow-lg p-6 space-y-6">
          <h1 className="text-2xl font-bold text-purple-800 dark:text-white text-center">
            Pathlab Report Details
          </h1>

          <div className="text-gray-800 dark:text-gray-200 space-y-2">
            <p>
              👤 <span className="font-medium">Patient:</span>{" "}
              {dummyReportDetail.patientName}
            </p>
            <p>
              🏥 <span className="font-medium">Pathlab:</span>{" "}
              {dummyReportDetail.pathlabName}
            </p>
            <p>
              📅 <span className="font-medium">Date:</span>{" "}
              {dummyReportDetail.date}
            </p>
            <p>
              🧪 <span className="font-medium">Tests:</span>{" "}
              {dummyReportDetail.tests.join(", ")}
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-purple-700 dark:text-purple-200 mb-3">
              Reports
            </h2>
            <div className="space-y-4">
              {dummyReportDetail.reports.map((report, index) => (
                <div
                  key={index}
                  className="bg-purple-100 dark:bg-purple-800 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                >
                  <p className="text-purple-900 dark:text-white font-medium">
                    📄 {report.reportName}
                  </p>
                  <div className="flex gap-2">
                    <a
                      href={report.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-purple-600 text-white px-4 py-1 rounded-lg text-sm hover:bg-purple-700 transition"
                    >
                      View
                    </a>
                    <a
                      href={report.fileUrl}
                      download
                      className="bg-green-600 text-white px-4 py-1 rounded-lg text-sm hover:bg-green-700 transition"
                    >
                      Download
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PathlabReportDetailsPage;
