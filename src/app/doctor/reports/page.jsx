"use client";

import { useEffect, useState, useRef } from "react";
import { Download, Eye } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import DocNav from "@/components/DocNavbar";
import DoctorFooter from "@/components/DocFooter";
import { useDoctor } from "@/context/doctorContext";
import axios from "axios";

export default function DoctorDashboard() {
  const { doctorId } = useDoctor();
  const [reports, setReports] = useState([]);

  useEffect(() => {
    if (!doctorId) return;

    const fetchReports = async () => {
      try {
        const token = localStorage.getItem("drtoken");
        const res = await axios.get(
          `/api/doctor/all-reports?doctorId=${doctorId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data.success) {
          setReports(res.data.reports);
          // console.log("reports pringting", res.data.reports);
        }
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    fetchReports();
    const interval = setInterval(fetchReports, 10000); // Every 10 seconds
    return () => clearInterval(interval);
  }, [doctorId]);

  // Group reports by patient name
  const groupedReports = reports.reduce((acc, report) => {
    acc[report.patientName] = acc[report.patientName] || [];
    acc[report.patientName].push(report);
    return acc;
  }, {});

  // Scroll to patient section when dropdown changes
  const handleSelectChange = (e) => {
    const patientId = e.target.value;
    if (!patientId) return;

    const el = document.getElementById(patientId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-purple-50 dark:bg-purple-950 text-purple-900 dark:text-purple-100">
        <DocNav />

        <section className="px-4 sm:px-6 lg:px-10 py-10 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center break-words">
            Submitted Reports
          </h2>

          {/* Dropdown to select patient */}
          <div className="mb-8 text-center">
            <select
              onChange={handleSelectChange}
              className="border border-purple-400 rounded-md p-2 text-purple-900 dark:text-purple-100 bg-white dark:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
              defaultValue=""
            >
              <option value="" disabled>
                Select Patient
              </option>
              {Object.keys(groupedReports).map((patientName) => (
                // Use a safe id by replacing spaces with dashes or encoding
                <option
                  key={patientName}
                  value={patientName.replace(/\s+/g, "-")}
                >
                  {patientName}
                </option>
              ))}
            </select>
          </div>

          {Object.entries(groupedReports).map(([patientName, reports]) => (
            <div
              key={patientName}
              id={patientName.replace(/\s+/g, "-")} // ID for scrolling
              className="mb-10 bg-white dark:bg-purple-900 rounded-2xl shadow-lg p-6 sm:p-8"
              style={{ border: "2px solid #7c3aed" }}
            >
              <h3 className="text-2xl font-semibold mb-6 text-center text-purple-700 dark:text-purple-300 break-words">
                {patientName}
              </h3>
              <div className="space-y-6">
                {reports.map((report, index) => (
                  <div
                    key={index}
                    className="bg-purple-50 dark:bg-purple-800 rounded-lg p-4 sm:p-6 shadow-md border border-purple-300 dark:border-purple-700 break-words"
                  >
                    <p className="text-purple-900 dark:text-purple-200 font-medium mb-4 break-words">
                      <span className="font-semibold">Date:</span>{" "}
                      {new Date(report.date).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>

                    <div className="flex flex-wrap gap-4">
                      {/* Download Image */}
                      <Button
                        onClick={() => {
                          const a = document.createElement("a");
                          a.href = report.url; // Cloudinary image URL
                          a.download = report.reportName || "report.jpg"; // Default extension can be jpg/png based on your data
                          a.click();
                        }}
                        variant="link"
                        className="text-purple-600 hover:text-purple-800 flex items-center gap-1 text-sm whitespace-nowrap cursor-pointer"
                      >
                        <Download className="w-4 h-4" /> Download
                      </Button>

                      {/* View Image */}
                      <Button
                        onClick={() => {
                          window.open(report.url, "_blank"); // Open image in new tab
                        }}
                        variant="link"
                        className="text-purple-600 hover:text-purple-800 flex items-center gap-1 text-sm whitespace-nowrap cursor-pointer"
                      >
                        <Eye className="w-4 h-4" /> View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        <DoctorFooter />
      </div>
    </TooltipProvider>
  );
}
