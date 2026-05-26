"use client";

import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useDoctor } from "@/context/doctorContext";

export default function DocNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { doctor } = useDoctor();

  return (
    <nav className="w-full bg-purple-100 dark:bg-purple-900 shadow-sm top-0 sticky z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center">
          <Link
            href="/doctor/home"
            className="text-xl font-bold text-purple-700 dark:text-purple-200"
          >
            🩺 Rakshaa
          </Link>
        </div>

        {/* Center: Desktop Menu */}
        <div className="hidden md:flex gap-6 font-semibold text-lg ">
          <Link href="/doctor/home" className="hover:text-purple-700 font-bold">
            Home
          </Link>
          <Link
            href="/doctor/dashboard"
            className="hover:text-purple-700 font-bold"
          >
            Dashboard
          </Link>
          <Link
            href="/doctor/appointments"
            className="hover:text-purple-700 font-bold"
          >
            Appointments
          </Link>
          <Link href="/doctor/ml" className="hover:text-purple-700 font-bold">
            Disease-prediction
          </Link>
        </div>

        {/* Right: Profile + Mobile Menu Toggle */}
        <div className="flex items-center gap-4">
          <button
            className="md:hidden text-purple-700 cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>

          <Link href="/doctor/profile">
            <Avatar className="w-9 h-9 border-2 border-purple-400 hover:border-purple-600 transition">
              <AvatarImage src={doctor?.profilePic} alt="Doctor Profile" />
              <AvatarFallback>DR</AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden mt-3 px-4 pb-4 flex flex-col gap-3 text-purple-600 dark:text-purple-200 text-[16px] font-semibold">
          <Link href="/doctor/home" className="hover:text-purple-700 font-bold">
            Home
          </Link>
          <Link
            href="/doctor/dashboard"
            className="hover:text-purple-700 font-bold"
          >
            Dashboard
          </Link>
          <Link
            href="/doctor/appointments"
            className="hover:text-purple-700 font-bold"
          >
            Appointments
          </Link>
          <Link href="/doctor/ml" className="hover:text-purple-700 font-bold">
            Disease-prediction
          </Link>
        </div>
      )}
    </nav>
  );
}
