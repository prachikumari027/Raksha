"use client";

import UserNavbar from "@/components/UserNavbar";
import UserFooter from "@/components/UserFooter";
import { useRouter } from "next/navigation";

export default function PaymentPage() {
  const router = useRouter();

  return (
    <>
      <UserNavbar />
      <div className="bg-purple-100 dark:bg-purple-900 min-h-screen flex items-center justify-center px-4">
        <div className="bg-white dark:bg-purple-950 rounded-2xl shadow-xl max-w-xl w-full p-8 border border-purple-300 dark:border-purple-700 text-center">
          <h2 className="text-3xl font-bold text-purple-800 dark:text-white mb-4">
            Payment Page
          </h2>
          <p className="text-gray-700 dark:text-gray-300 text-md">
            This page is currently under development. Payment integration will be added soon.
          </p>
          <div className="mt-6">
            <button
              onClick={() => router.push("/")}
              className="mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-full transition cursor-pointer" 
            >
              Go Back to Home
            </button>
          </div>
        </div>
      </div>
      <UserFooter />
    </>
  );
}
