"use client";

import Link from "next/link";
import { Github, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-100 pb-0">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
        {/* Logo and Tagline */}
        <div>
          <h2 className="text-2xl font-bold">🩺 Rakshaa</h2>
          <p className="text-sm mt-2">
            Your AI-powered healthcare companion for smarter living.
          </p>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col gap-2">
          <FooterLink href="/user/doctor" label="Doctors" />
          <FooterLink href="/user/pathlabs" label="Path Labs" />
          <FooterLink href="/user/ai" label="Ask Saksham" />
          <FooterLink href="/user/ml" label="Predict Disease" />
          <FooterLink href="/user/reports" label="Appointments" />
          <FooterLink href="/user/pathlab-reports" label="Reports" />
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
