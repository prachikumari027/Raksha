"use client";

import Link from "next/link";
import { Github, Instagram, Linkedin } from "lucide-react";

export default function DoctorFooter() {
  return (
    <footer className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-100 pb-0">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
        {/* Logo and Tagline */}
        <div>
          <h2 className="text-2xl font-bold">🩺 Rakshaa - Doctor</h2>
          <p className="text-sm mt-2">
            Helping doctors deliver smarter, AI-powered care.
          </p>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col gap-2">
          <FooterLink href="/doctor/home" label="Home" />
          <FooterLink href="/doctor/appointments" label="Appointments" />
          <FooterLink href="/doctor/ml" label="Disease Prediction" />
          <FooterLink href="/doctor/dashboard" label="Dashboard" />
        </div>

        {/* Social / Contact */}
        <div className="flex flex-col gap-2">
          <span className="font-semibold">Connect with us</span>
          <div className="flex gap-4">
            <FooterIcon href="https://github.com" icon={<Github />} />
            <FooterIcon href="https://linkedin.com" icon={<Linkedin />} />
            <FooterIcon href="https://instagram.com" icon={<Instagram />} />
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-purple-300 dark:border-purple-700 py-4 text-center text-sm">
        &copy; {new Date().getFullYear()} Rakshaa. All rights reserved.
      </div>
    </footer>
  );
}

function FooterLink({ href, label }) {
  return (
    <Link
      href={href}
      className="text-md hover:text-black dark:hover:text-purple-300 transition"
    >
      {label}
    </Link>
  );
}

function FooterIcon({ href, icon }) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="hover:text-purple-600 dark:hover:text-purple-300 transition"
    >
      {icon}
    </Link>
  );
}
