"use client";
import UserNavbar from "@/components/UserNavbar";
import UserFooter from "@/components/UserFooter";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HeartPulse, Bot, Activity, FileText } from "lucide-react";
export default function HomePage() {
  return (
    <main className="min-h-screen bg-purple-50 dark:bg-purple-950 text-purple-900 dark:text-purple-100">
      {/* Hero Section */}
      <UserNavbar />
      <section className="text-center py-20 px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
          Welcome to 🩺 Rakshaa AI
        </h1>
        <p className="text-lg md:text-xl max-w-xl mx-auto mb-6">
          Your smart assistant for health tracking, disease prediction, and
          medical guidance.
        </p>
        <Button
          asChild
          size="lg"
          className="bg-purple-700 hover:bg-purple-800 text-white cursor-pointer"
        >
          <Link href="/user/ai">Ask Our AI Doctor</Link>
        </Button>
      </section>

      {/* Features */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-10">
          What You Can Do
        </h2>
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
          <FeatureCard
            icon={<HeartPulse className="w-8 h-8 text-purple-700" />}
            title="Consult Doctors"
            description="Find and connect with medical professionals easily."
            href="/user/doctor"
          />
          <FeatureCard
            icon={<Bot className="w-8 h-8 text-purple-700" />}
            title="Ask AI"
            description="Get instant answers to your health-related queries."
            href="/user/ai"
          />
          <FeatureCard
            icon={<Activity className="w-8 h-8 text-purple-700" />}
            title="Predict Disease"
            description="Use machine learning to assess potential health risks."
            href="/user/ml"
          />
          <FeatureCard
            icon={<FileText className="w-8 h-8 text-purple-700" />}
            title="Appointments"
            description="View and manage your medical history and reports."
            href="/user/reports"
          />
        </div>
      </section>

      <UserFooter />
    </main>
  );
}

function FeatureCard({ icon, title, description, href }) {
  return (
    <Link
      href={href}
      className="p-6 rounded-2xl bg-white dark:bg-purple-900 shadow-lg hover:shadow-xl hover:scale-[1.03] transition-all duration-300 ease-in-out border border-transparent hover:border-purple-400 dark:hover:border-purple-600"
    >
      <div className="flex flex-col items-start gap-3">
        <div className="text-purple-700 dark:text-purple-300 transition-colors duration-300">
          {icon}
        </div>
        <h3 className="text-lg font-semibold group-hover:text-purple-800 dark:group-hover:text-purple-200 transition-colors">
          {title}
        </h3>
        <p className="text-sm text-purple-700 dark:text-purple-300">
          {description}
        </p>
      </div>
    </Link>
  );
}
