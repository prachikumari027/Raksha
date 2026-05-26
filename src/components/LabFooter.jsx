"use client";

import React from "react";
import Link from "next/link";

const LabFooter = () => {
  return (
    <footer className="bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-100 py-8 px-4 sm:px-10 font-sans">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
        {/* Section 1: About */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Rakshaa Labs</h3>
          <p className="text-sm font-light leading-relaxed">
            Empowering diagnostics through seamless technology. Manage reports,
            stay organized, and offer better care.
          </p>
        </div>

        {/* Section 2: Quick Links */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm font-medium">
            <li>
              <Link href="/pathlab/home" className="hover:underline">
                Home
              </Link>
            </li>
            <li>
              <Link href="/pathlab/pending-reports" className="hover:underline">
                Pending Reports
              </Link>
            </li>
            <li>
              <Link
                href="/pathlab/completed-reports"
                className="hover:underline"
              >
                Reports Submitted
              </Link>
            </li>
            <li>
              <Link href="/pathlab/tests" className="hover:underline">
                Test Offered
              </Link>
            </li>
          </ul>
        </div>

        {/* Section 3: Contact */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Support</h3>
          <p className="text-sm font-light leading-relaxed">
            📧 Email: support@rakshaa.com <br />
            📞 Phone: +91-98765-43210
          </p>
          <p className="text-xs mt-2 text-purple-600 dark:text-purple-300 font-medium">
            Available Mon-Fri • 9am to 6pm
          </p>
        </div>
      </div>
      <hr className="my-6 border-t border-purple-300 dark:border-purple-600" />
      <div className="text-center text-xs text-purple-600 dark:text-purple-400 font-light">
        © {new Date().getFullYear()} Rakshaa Labs. All rights reserved.
      </div>
    </footer>
  );
};

export default LabFooter;
