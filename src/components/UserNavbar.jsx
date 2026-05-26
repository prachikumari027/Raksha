"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/context/userContext";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const userData = useUser();
  const user = userData.user;

  return (
    <header className="w-full bg-purple-100 dark:bg-purple-900 shadow-sm top-0 sticky z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center">
          <Link
            href="/user/home"
            className="text-xl font-bold text-purple-700 dark:text-purple-200"
          >
            🩺 Rakshaa
          </Link>
        </div>

        {/* Center: Desktop Links */}
        <nav className="hidden md:flex gap-6 text-purple-900 dark:text-purple-900 text-[18px] font-bold">
          <NavLink href="/user/doctor" label="Doctors" />
          <NavLink href="/user/pathlabs" label="Path Labs" />
          <NavLink href="/user/ai" label="Ask Sakhsam" />
          <NavLink href="/user/ml" label="Predict Disease" />
          <NavLink href="/user/reports" label="Appointments" />
          <NavLink href="/user/pathlab-reports" label="Reports" />
        </nav>

        {/* Right: Avatar & Mobile Menu */}
        <div className="flex items-center gap-4">
          <button
            className="md:hidden text-purple-700 dark:text-purple-900 cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>

          <Link href="/user/profile">
            <Avatar className="w-9 h-9 border-2 border-purple-400 hover:border-purple-600 transition">
              {user?.profilePic ? (
                <AvatarImage src={user.profilePic} alt="Profile" />
              ) : (
                <AvatarImage src="/default-avatar.png" alt="Default Avatar" />
              )}
              <AvatarFallback>US</AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden mt-3 px-4 pb-4 flex flex-col gap-3 text-purple-600 dark:text-purple-200 text-[16px] font-semibold">
          <NavLink href="/user/doctor" label="Doctors" />
          <NavLink href="/user/pathlabs" label="Path Labs" />
          <NavLink href="/user/ai" label="Ask Sakhsam" />
          <NavLink href="/user/ml" label="Predict Disease" />
          <NavLink href="/user/reports" label="Appointments" />
          <NavLink href="/user/pathlab-reports" label="Reports" />
        </div>
      )}
    </header>
  );
}

function NavLink({ href, label }) {
  return (
    <Link
      href={href}
      className="hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
    >
      {label}
    </Link>
  );
}
