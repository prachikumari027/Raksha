"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useDoctor } from "@/context/doctorContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { TooltipProvider } from "@/components/ui/tooltip";
import DocNav from "@/components/DocNavbar";
import { Button } from "@/components/ui/button";

export default function DoctorProfilePage() {
  const router = useRouter();
  const { doctor, loding } = useDoctor();
  const [isEditing, setIsEditing] = useState(false);
  const [doctorInfo, setDoctorInfo] = useState(null);

  useEffect(() => {
    if (doctor) {
      setDoctorInfo({
        name: doctor.name || "",
        email: doctor.email || "",
        phone: doctor.phone || "",
        specialization: doctor.specialization || "",
        qualification: doctor.qualification || "",
        experience: doctor.experience || "",
        hospital: doctor.hospital || "",
        address: doctor.address || "",
        languages: doctor.languages || "",
        consultationFees: doctor.consultationFees || "",
        achievements: doctor.achievements || "",
        college: doctor.college || "",
        pastHospitals: doctor.pastHospitals || "",
        profilePic: doctor.profilePic || "",
      });
    }
  }, [doctor]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDoctorInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    try {
      const res = await fetch("/api/doctor/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          doctorId: doctor._id,
          ...doctorInfo,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Profile updated successfully!");
        setIsEditing(false);
        router.refresh();
      } else {
        toast.error(data.message || "Update failed");
      }
    } catch (err) {
      console.error("Update error:", err);
      toast.error("An error occurred. Try again.");
    }
  };

  if (loding || !doctorInfo) {
    return (
      <div className="flex justify-center items-center py-20 bg-purple-50 dark:bg-purple-900 min-h-screen px-4">
        <div className="flex flex-col items-center space-y-6">
          {/* Beautiful Gradient Spinner */}
          <div className="w-16 h-16 border-4 border-transparent border-t-purple-500 border-l-purple-400 rounded-full animate-spin bg-gradient-to-r from-purple-300 via-purple-400 to-purple-600 shadow-lg"></div>

          {/* Animated Text */}
          <p className="text-purple-700 dark:text-purple-200 text-xl font-semibold animate-pulse">
            Loading Profile Details...
          </p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem("drtoken");
    router.push("/login"); // redirect to login
    toast.success("Logged out successfully!");
  };

  const renderField = (label, name) => (
    <div className="flex flex-col gap-1">
      <label className="font-semibold">{label}</label>
      {isEditing ? (
        <input
          type="text"
          name={name}
          value={doctorInfo[name]}
          onChange={handleChange}
          className="p-2 rounded-md border border-purple-300 text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      ) : (
        <p className="text-md">{doctorInfo[name]}</p>
      )}
    </div>
  );

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-purple-50 dark:bg-purple-950 text-purple-900 dark:text-purple-100">
        <DocNav />
        <section className="max-w-6xl mx-auto px-6 py-10 space-y-10">
          {/* HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20 border-4 border-purple-400">
                <AvatarImage src={doctorInfo.profilePic} alt="Doctor" />
                <AvatarFallback>DR</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">{doctorInfo.name}</h2>
                <p className="text-sm text-purple-600">
                  {doctorInfo.specialization}
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              {isEditing ? (
                <>
                  <Button onClick={handleSaveChanges}>Save</Button>
                  <Button
                    variant="secondary"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
              )}
              <Button variant="destructive" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>

          {/* CARD CONTAINER - row above 450px, column below */}
          <div className="flex flex-col max-[450px]:flex-col sm:flex-row gap-6">
            {/* Basic Info */}
            <div className="flex-1 bg-purple-100 dark:bg-purple-900 p-6 rounded-xl shadow space-y-4">
              <h3 className="text-xl font-semibold mb-2">Basic Information</h3>
              {renderField("Name", "name")}
              {renderField("Email", "email")}
              {renderField("Phone", "phone")}
              {renderField("Hospital", "hospital")}
              {renderField("Address", "address")}
              {renderField("Languages", "languages")}
              {renderField("Consultation Fees", "consultationFees")}
            </div>

            {/* Professional Info */}
            <div className="flex-1 bg-purple-100 dark:bg-purple-900 p-6 rounded-xl shadow space-y-4">
              <h3 className="text-xl font-semibold mb-2">
                Professional Details
              </h3>
              {renderField("Specialization", "specialization")}
              {renderField("Qualification", "qualification")}
              {renderField("Experience", "experience")}
              {renderField("Achievements", "achievements")}
              {renderField("College Studied", "college")}
              {renderField("Past Hospital Experience", "pastHospitals")}
            </div>
          </div>
        </section>
      </div>
    </TooltipProvider>
  );
}
