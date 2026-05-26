"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Patient");
  const [message, setMessage] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/forgot-password", { email, role });
      //   setMessage(res.data.message);
      if (res.data.success) {
        toast.success(res.data.message);
        router.push("/login");
      }
    } catch (err) {
      setMessage(err.response?.data?.error || "Something went wrong.");
    }
  };

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-purple-200 to-purple-300 dark:from-purple-950 dark:via-purple-900 dark:to-purple-950 text-gray-900 dark:text-white px-4 overflow-hidden">
      {/* Background blobs */}
      <div className="absolute w-[600px] h-[600px] bg-purple-400 dark:bg-purple-800 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob1 top-[-10%] left-[-20%] z-0"></div>
      <div className="absolute w-[500px] h-[500px] bg-pink-400 dark:bg-pink-800 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob2 top-[30%] right-[-10%] z-0"></div>
      <div className="absolute w-[500px] h-[500px] bg-indigo-400 dark:bg-indigo-700 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob3 bottom-[-20%] left-[25%] z-0"></div>

      {/* Content Card */}
      <div className="relative w-full max-w-md bg-white dark:bg-purple-900 p-6 rounded-2xl shadow-lg animate-slide-fade z-10">
        <h1 className="text-3xl font-extrabold text-center mb-2 text-purple-700 dark:text-purple-300 tracking-wide">
          Rakshaa
        </h1>
        <h2 className="text-xl font-bold mb-4 text-center">Forgot Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-2 rounded-md border bg-purple-100 dark:bg-purple-950"
            >
              <option value="Patient">Patient</option>
              <option value="Doctor">Doctor</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 font-semibold">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 rounded-md border bg-purple-100 dark:bg-purple-950"
              placeholder="Enter your email"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-700 hover:bg-purple-800 active:scale-95 transition-transform duration-150 text-white py-2 rounded-md font-semibold"
          >
            Send Reset Link
          </button>
        </form>
        {/* {message && (
          <p className="mt-4 text-center text-sm transition-opacity duration-500 opacity-100">
            {message}
          </p>
        )} */}
      </div>

      <style jsx>{`
        .animate-slide-fade {
          animation: slideFadeIn 0.6s ease forwards;
        }

        @keyframes slideFadeIn {
          0% {
            opacity: 0;
            transform: translateY(40px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes blob1 {
          0%,
          100% {
            transform: translate(0px, 0px) scale(1);
          }
          50% {
            transform: translate(30px, -20px) scale(1.05);
          }
        }

        @keyframes blob2 {
          0%,
          100% {
            transform: translate(0px, 0px) scale(1);
          }
          50% {
            transform: translate(-30px, 30px) scale(1.08);
          }
        }

        @keyframes blob3 {
          0%,
          100% {
            transform: translate(0px, 0px) scale(1);
          }
          50% {
            transform: translate(40px, -10px) scale(1.04);
          }
        }

        .animate-blob1 {
          animation: blob1 8s ease-in-out infinite;
        }
        .animate-blob2 {
          animation: blob2 10s ease-in-out infinite;
        }
        .animate-blob3 {
          animation: blob3 12s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
