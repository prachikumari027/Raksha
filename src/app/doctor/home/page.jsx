"use client";

import Link from "next/link";
import {
  ClipboardList,
  LayoutDashboard,
  FileText,
  Activity,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import DocNav from "@/components/DocNavbar";
import DoctorFooter from "@/components/DocFooter";

export default function DoctorHomePage() {
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-purple-50 dark:bg-purple-950 text-purple-900 dark:text-purple-100">
        {/* Navbar */}
        <DocNav />

        {/* Hero Section */}
        <section className="text-center py-20 px-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
            Welcome Doctor 👨‍⚕️
          </h1>

          <p className="text-lg text-purple-700 dark:text-purple-300 mb-20">
            Your central hub to manage appointments, assess disease patterns,
            and review patient reports.
          </p>
        </section>

        {/* Disease Spread Info */}
        <section className="px-4 md:px-16 mb-12">
          <h2 className="text-2xl font-bold mb-4">
            Ongoing Disease Spread Info
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-purple-400 scrollbar-track-purple-100">
            {[
              {
                title: "Dengue Outbreak",
                description: "High spike in urban areas.",
                color: "bg-red-100 text-red-700",
              },
              {
                title: "Influenza",
                description: "Seasonal cases on the rise.",
                color: "bg-blue-100 text-blue-700",
              },
              {
                title: "COVID-19",
                description: "New variants detected.",
                color: "bg-yellow-100 text-yellow-800",
              },
              {
                title: "Chikungunya",
                description: "Localized clusters in rural zones.",
                color: "bg-green-100 text-green-700",
              },
              {
                title: "Malaria",
                description: "Rising in monsoon regions.",
                color: "bg-teal-100 text-teal-800",
              },
              {
                title: "Swine Flu",
                description: "Spikes in schools reported.",
                color: "bg-pink-100 text-pink-700",
              },
            ].map((disease, index) => (
              <div
                key={index}
                className={`min-w-[250px] p-4 rounded-xl shadow-md ${disease.color} transition-transform duration-300 hover:scale-105`}
              >
                <h3 className="text-lg font-semibold">{disease.title}</h3>
                <p className="text-sm mt-1">{disease.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Action Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-6 pb-16 pt-10">
          {[
            {
              title: "Appointments",
              description: "Manage your upcoming appointments.",
              icon: ClipboardList,
              link: "/doctor/appointments",
            },
            {
              title: "Disease Prediction",
              description: "Use ML tools to predict possible conditions.",
              icon: Activity,
              link: "/doctor/ml",
            },
            {
              title: "Dashboard",
              description: "Overview of patient interactions.",
              icon: LayoutDashboard,
              link: "/doctor/dashboard",
            },
            {
              title: "Submitted Reports",
              description: "Access and review submitted documents.",
              icon: FileText,
              link: "/doctor/reports",
            },
          ].map((card, index) => {
            const Icon = card.icon;
            return (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <Link
                    href={card.link}
                    className="bg-white dark:bg-purple-900 p-5 rounded-xl shadow hover:shadow-lg transition-all py-15"
                  >
                    <div className="flex items-center gap-3 mb-3 ">
                      <Icon className="w-6 h-6 text-purple-700" />
                      <h4 className="text-lg font-bold">{card.title}</h4>
                    </div>
                    <p className="text-sm text-purple-800 dark:text-purple-200">
                      {card.description}
                    </p>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{card.title}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </section>
        <DoctorFooter />
      </div>
    </TooltipProvider>
  );
}
