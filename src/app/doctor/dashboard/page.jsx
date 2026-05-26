"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  CircleDollarSign,
  User,
  CalendarCheck,
  MessageCircle,
  Activity,
} from "lucide-react";
import DocNav from "@/components/DocNavbar";
import DoctorFooter from "@/components/DocFooter";
import axios from "axios";
import { useDoctor } from "@/context/doctorContext";

const barData = [
  { month: "Jan", value: 70 },
  { month: "Feb", value: 85 },
  { month: "Mar", value: 60 },
  { month: "Apr", value: 95 },
  { month: "May", value: 90 },
];

const pieData = [
  { label: "Excellent", value: 65, color: "#7e22ce" },
  { label: "Good", value: 25, color: "#a78bfa" },
  { label: "Average", value: 10, color: "#ddd6fe" },
];

const linePoints = [
  { x: 0, y: 90 },
  { x: 50, y: 40 },
  { x: 100, y: 60 },
  { x: 150, y: 30 },
  { x: 200, y: 50 },
  { x: 250, y: 20 },
  { x: 300, y: 40 },
];

const areaPoints = [
  { x: 0, y: 80 },
  { x: 50, y: 50 },
  { x: 100, y: 70 },
  { x: 150, y: 40 },
  { x: 200, y: 60 },
  { x: 250, y: 30 },
  { x: 300, y: 50 },
];

const createLinePath = (points) =>
  points
    .map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`))
    .join(" ");

const createAreaPath = (points) =>
  [
    `M${points[0].x},100`,
    ...points.map((p) => `L${p.x},${p.y}`),
    `L${points[points.length - 1].x},100`,
    "Z",
  ].join(" ");

export default function DoctorDashboard() {
  // For triggering animation after mount
  const { doctor } = useDoctor();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [animate, setAnimate] = useState(false);
  useEffect(() => {
    setAnimate(true);
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setAnimate(true);
      try {
        const response = await axios.post("/api/doctor/dashboard", {
          doctorId: doctor._id,
        });
        const data = response.data; // store in variable
        setDashboardData(data);
      } catch (error) {
        console.error("API fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 10000); // Every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const handleMouseEnter = () => {
    setAnimate(false);
    // Longer timeout to let the bars collapse first
    setTimeout(() => {
      setAnimate(true);
    }, 1000); // 50ms or 100ms works better
  };

  // Pie chart circumference
  const circumference = 2 * Math.PI * 16; // r=16

  // For pie chart slice dash offsets
  let accumulated = 0;
  const stats = [
    {
      icon: <User className="text-purple-500 w-6 h-6" />,
      title: "Appointments Pending",
      value: dashboardData?.pendingAppointments || "0",
    },
    {
      icon: <CalendarCheck className="text-purple-500 w-6 h-6" />,
      title: "Appointments Completed",
      value: dashboardData?.completedAppointments || "0",
    },
    {
      icon: <CircleDollarSign className="text-purple-500 w-6 h-6" />,
      title: "Earnings",
      value: `₹${dashboardData?.totalRevenue || "0"}`,
    },
  ];
  if (loading) {
    return (
      <>
        <DocNav />
        <div className="flex items-center justify-center min-h-screen bg-purple-50 dark:bg-purple-950">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-700"></div>
        </div>
      </>
    );
  }
  return (
    <>
      <DocNav />
      <div className="p-6 md:p-10 bg-purple-50 dark:bg-purple-950 min-h-screen text-gray-900 dark:text-white flex justify-center">
        <div className="w-full max-w-7xl space-y-10">
          {/* Title */}
          <h1 className="text-3xl font-extrabold text-center text-purple-800 dark:text-purple-200 select-none">
            Doctor Dashboard
          </h1>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((item, i) => (
              <Card
                key={i}
                className="bg-purple-100 dark:bg-purple-900 shadow-lg hover:shadow-2xl transition-shadow rounded-2xl cursor-default"
              >
                <CardHeader className="flex flex-col items-center gap-2 pb-2">
                  {item.icon}
                  <CardTitle className="text-sm font-semibold text-purple-700 dark:text-purple-300">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-extrabold text-center">
                    {item.value}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Bar Chart */}
          <Card
            onMouseEnter={handleMouseEnter}
            className="bg-white dark:bg-purple-900 shadow-lg rounded-2xl p-6"
          >
            <CardHeader>
              <CardTitle className="text-purple-700 dark:text-purple-200 font-bold text-center">
                Monthly Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <svg viewBox="0 0 320 120" className="w-full h-36">
                {barData.map(({ month, value }, i) => {
                  const barWidth = 40;
                  const gap = 10;
                  const x = i * (barWidth + gap) + 20;
                  // Animate bar height with delay
                  return (
                    <g key={month}>
                      <rect
                        x={x}
                        y={animate ? 100 - value : 100}
                        width={barWidth}
                        height={animate ? value : 0}
                        fill="#7e22ce"
                        rx={6}
                        ry={6}
                        style={{
                          transition: `height 0.7s ease-out ${
                            i * 150
                          }ms, y 0.7s ease-out ${i * 150}ms`,
                        }}
                      />
                      <text
                        x={x + barWidth / 2}
                        y={115}
                        textAnchor="middle"
                        className="fill-purple-700 dark:fill-purple-300 text-xs font-semibold select-none"
                      >
                        {month}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </CardContent>
          </Card>

          {/* Pie Chart */}
          <Card
            onMouseEnter={handleMouseEnter}
            className="bg-white dark:bg-purple-900 shadow-lg rounded-2xl p-6 flex flex-col items-center"
          >
            <CardHeader className="flex items-center justify-center gap-3 mb-4 w-full">
              <MessageCircle className="text-purple-500" />
              <CardTitle className="text-purple-700 dark:text-purple-200 font-bold whitespace-nowrap">
                Patient Feedback
              </CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col items-center">
              <svg
                viewBox="0 0 36 36"
                className="w-44 h-44 rotate-[-90deg]"
                aria-label="Pie chart showing patient feedback"
              >
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  stroke="#e9d5ff"
                  strokeWidth="4"
                />
                {pieData.map(({ label, value, color }, i) => {
                  const dashArray = `${
                    (value / 100) * circumference
                  } ${circumference}`;
                  accumulated += (value / 100) * circumference;
                  const dashOffset = animate
                    ? circumference -
                      (pieData.slice(0, i).reduce((a, b) => a + b.value, 0) /
                        100) *
                        circumference
                    : circumference;
                  return (
                    <circle
                      key={label}
                      cx="18"
                      cy="18"
                      r="16"
                      fill="none"
                      stroke={color}
                      strokeWidth="4"
                      strokeDasharray={dashArray}
                      strokeDashoffset={dashOffset}
                      style={{
                        transition: `stroke-dashoffset 1s ease-out ${
                          i * 400
                        }ms`,
                      }}
                    />
                  );
                })}
              </svg>
              <div className="mt-5 space-y-2 text-sm text-center select-none">
                {pieData.map(({ label, value, color }) => (
                  <p
                    key={label}
                    className="flex items-center justify-center gap-3 font-semibold text-purple-700 dark:text-purple-300"
                  >
                    <span
                      className="inline-block w-5 h-5 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    {label}: {value}%
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Line Chart */}
          <Card
            onMouseEnter={handleMouseEnter}
            className="bg-white dark:bg-purple-900 shadow-lg rounded-2xl p-6"
          >
            <CardHeader className="flex items-center justify-center gap-2 mb-4">
              <Activity className="text-purple-500" />
              <CardTitle className="text-purple-700 dark:text-purple-200 font-bold whitespace-nowrap">
                Weekly Patient Visits
              </CardTitle>
            </CardHeader>

            <CardContent>
              <svg viewBox="0 0 320 100" className="w-full h-36">
                <polyline
                  fill="none"
                  stroke="#7e22ce"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={createLinePath(linePoints)}
                  style={{
                    strokeDasharray: 1000,
                    strokeDashoffset: animate ? 0 : 1000,
                    transition: "stroke-dashoffset 1.8s ease-out",
                  }}
                />
                {linePoints.map(({ x, y }, i) => (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r={5}
                    fill="#7e22ce"
                    stroke="white"
                    strokeWidth="2"
                    style={{
                      transformOrigin: "center",
                      animation: animate
                        ? `popIn 0.3s ease-out forwards ${i * 250 + 1500}ms`
                        : "none",
                      opacity: animate ? 1 : 0,
                    }}
                  />
                ))}
                <style>{`
                @keyframes popIn {
                  0% { transform: scale(0); opacity: 0; }
                  100% { transform: scale(1); opacity: 1; }
                }
              `}</style>
              </svg>
              <div className="flex justify-between text-sm text-gray-600 mt-3 select-none">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                  <span key={d}>{d}</span>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Area Chart */}
          <Card
            onMouseEnter={handleMouseEnter}
            className="bg-white dark:bg-purple-900 shadow-lg rounded-2xl p-6"
          >
            <CardHeader>
              <CardTitle className="text-purple-700 dark:text-purple-200 font-bold text-center">
                Active Users Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <svg viewBox="0 0 320 100" className="w-full h-36">
                <path
                  d={createAreaPath(areaPoints)}
                  fill="url(#areaGradient)"
                  stroke="none"
                  style={{
                    opacity: animate ? 1 : 0,
                    transition: "opacity 1.5s ease-out",
                  }}
                />
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop stopColor="green" stopOpacity="1" />
                    <stop stopColor="darkgreen" stopOpacity="0.2" />
                  </linearGradient>
                </defs>
              </svg>
            </CardContent>
          </Card>

          {/* Progress Bars */}
          <Card
            onMouseEnter={handleMouseEnter}
            className="bg-white dark:bg-purple-900 shadow-lg rounded-2xl p-6"
          >
            <CardHeader>
              <CardTitle className="text-purple-700 dark:text-purple-200 font-bold text-center">
                Appointment Completion Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {[
                { label: "Completed", value: 75, color: "bg-purple-600" },
                { label: "In Progress", value: 15, color: "bg-purple-400" },
                { label: "Cancelled", value: 10, color: "bg-purple-200" },
              ].map(({ label, value, color }) => (
                <div key={label}>
                  <div className="flex justify-between mb-1 font-semibold text-purple-700 dark:text-purple-300 select-none">
                    <span>{label}</span>
                    <span>{value}%</span>
                  </div>
                  <Progress
                    value={animate ? value : 0}
                    className={`${color} h-5 rounded-xl transition-all duration-1000 ease-out`}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
      <DoctorFooter />
    </>
  );
}
