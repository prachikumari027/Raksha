"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { MailIcon, LockIcon } from "lucide-react";
import { toast } from "react-toastify";
const roles = ["Patient", "Doctor"];
import axios from "axios";
import imageCompression from 'browser-image-compression';

const IconInput = ({ icon: Icon, onKeyDown, ...props }) => (
  <div className="relative">
    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
      <Icon size={16} />
    </span>
    <Input
      className="pl-10 py-6 rounded-full bg-gray-100 text-sm"
      onKeyDown={onKeyDown}
      {...props}
    />
  </div>
);

export default function AuthPage() {
  const [mode, setMode] = useState("login");
  const [role, setRole] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [step, setStep] = useState(0);

  // Individual form states
  const [patientData, setPatientData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    emergencyContact: "",
    bloodType: "",
    allergies: "",
    medications: "",
    weight: "",
    height: "",
    age: "",
    password: "",
    profilePic: null,
  });

  const [doctorData, setDoctorData] = useState({
    name: "",
    email: "",
    password: "",
    specialization: "",
    phone: "",
    qualification: "",
    experience: "",
    hospital: "",
    address: "",
    languages: "",
    consultationFees: "",
    achievements: "",
    college: "",
    pastHospitals: "",
    profilePic: null,
  });

  const getFormData = () => {
    if (role === "Patient") return patientData;
    if (role === "Doctor") return doctorData;
    return {};
  };

  const setFormData = (data) => {
    if (role === "Patient") setPatientData((prev) => ({ ...prev, ...data }));
    if (role === "Doctor") setDoctorData((prev) => ({ ...prev, ...data }));
  };

  const handleChange = (field, value) => {
    setFormData({ [field]: value });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleNextStep(); // Go to next step
    }
  };

  const handleImageChange = async (file) => {
    const options = {
      maxSizeMB: 9, // max size in mb
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    try {
      const compressedFile = await imageCompression(file, options);
      setFormData({ profilePic: compressedFile });
    } catch (error) {
      console.error("Image compression error:", error);
    }
  };

  const getSignupSteps = () => {
    switch (role) {
      case "Patient":
        return [
          { label: "Name", field: "name", type: "text", required: true },
          { label: "Email", field: "email", type: "email", required: true },
          { label: "Phone", field: "phone", type: "tel", required: true },
          { label: "Address", field: "address", type: "text" },
          {
            label: "Emergency Contact",
            field: "emergencyContact",
            type: "tel",
          },
          {
            label: "Blood Type",
            field: "bloodType",
            type: "select",
            options: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
            required: true,
          },
          { label: "Allergies", field: "allergies", type: "text" },
          { label: "Medications", field: "medications", type: "text" },
          { label: "Weight (Kg)", field: "weight", type: "number" },
          { label: "Height (cm)", field: "height", type: "number" },
          { label: "Age (Years)", field: "age", type: "number", min: 0 },
          {
            label: "Password",
            field: "password",
            type: "password",
            required: true,
          },
          { label: "Profile Picture", field: "profilePic", type: "image" },
        ];

      case "Doctor":
        return [
          { label: "Name", field: "name" },
          { label: "Email", field: "email" },
          { label: "Password", field: "password", type: "password" },
          { label: "Specialization", field: "specialization" },
          { label: "Phone", field: "phone" },
          { label: "Qualification", field: "qualification" },
          { label: "Experience", field: "experience" },
          { label: "Hospital", field: "hospital" },
          { label: "Address", field: "address" },
          { label: "Languages", field: "languages" },
          {
            label: "Consultation Fees",
            field: "consultationFees",
            type: "number",
            min: 0,
          },
          { label: "Achievements", field: "achievements" },
          { label: "College", field: "college" },
          { label: "Past Hospitals", field: "pastHospitals" },
          { label: "Profile Picture", field: "profilePic", type: "image" },
        ];
      default:
        return [];
    }
  };

  const steps = getSignupSteps();
  const currentData = getFormData();

  const handleLogin = async () => {
    const { email, password } = currentData;

    try {
      if (role === "Patient") {
        await loginPatient(email, password);
      } else if (role === "Doctor") {
        await loginDoctor(email, password);
      }
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleSignup = async () => {
    try {
      if (role === "Patient") {
        await signupPatient(patientData);
      } else if (role === "Doctor") {
        await signupDoctor(doctorData);
      }
    } catch (error) {
      console.error("Signup failed", error);
    }
  };

  const loginPatient = async (email, password) => {
    try {
      const response = await axios.post("/api/user/login", {
        email,
        password,
      });

      const data = response.data;
      // console.log("Login Response:", data);

      if (data.success) {
        // Save token if needed
        localStorage.setItem("token", data.token);
        toast.success("Successfully Logged In");
        // router.push("/user/home");
        window.location.href = "/user/home";
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const loginDoctor = async (email, password) => {
    try {
      const response = await axios.post("/api/doctor/login", {
        email,
        password,
      });

      const data = response.data;
      // console.log("Login Response:", data);

      if (data.success) {
        // Save token if needed
        localStorage.setItem("drtoken", data.token);
        toast.success("Successfully Logged In");
        // router.push("/doctor/home");
        // here we have changed the direct routing to refreshed routing because there was a bug that all time same user details are displayed
        window.location.href = "/doctor/home";
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };
  const signupPatient = async (data) => {
    try {
      const formData = new FormData();

      // Append all fields to FormData
      Object.entries(data).forEach(([key, value]) => {
        if (value) {
          formData.append(key, value);
        }
      });

      const response = await axios.post("/api/user/signup", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        // console.log("Patient created:", response.data);
        toast.success("Account Created Successfully Now login");
        // since it is signed up so move it to login mode
        setMode("login");
      } else {
        toast.error("Something Went Wrong");
      }
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  const signupDoctor = async (data) => {
    try {
      const formData = new FormData();

      // Append all fields to FormData
      Object.entries(data).forEach(([key, value]) => {
        if (value) {
          formData.append(key, value);
        }
      });

      const response = await axios.post("/api/doctor/signup", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        // console.log("doctor created:", response.data);
        toast.success("Account Created Successfully Now Login!!");
        setMode("login");
      } else {
        toast.error("Something Went Wrong");
      }
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setStep(0);
  };

  const FloatingBlobs = () => (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute w-96 h-96 bg-purple-400 opacity-40 rounded-full top-10 left-10 animate-float1 blur-[100px]" />
      <div className="absolute w-[500px] h-[500px] bg-pink-400 opacity-40 rounded-full top-[60%] right-[-100px] animate-float2 blur-[120px]" />
      <div className="absolute w-80 h-80 bg-blue-400 opacity-40 rounded-full bottom-[-100px] left-[40%] animate-float3 blur-[100px]" />
    </div>
  );
  const handleNextStep = () => {
    if (step >= steps.length) {
      if (mode === "signup") {
        handleSignup();
      }
      return;
    }

    const currentField = steps[step].field;
    const isImageField = steps[step].type === "image";
    const currentLabel = steps[step].label;

    if (isImageField) {
      if (!currentData.profilePic) {
        setErrorMessage("Please upload a profile picture or click Skip.");
        return;
      }
    } else {
      const value = currentData[currentField];

      if (!value) {
        setErrorMessage(`${currentLabel} is required.`);
        return;
      }

      if (currentField === "phone" || currentField === "emergencyContact") {
        const isNumeric = /^\d{10,15}$/.test(value);
        if (!isNumeric) {
          setErrorMessage("Please enter a valid phone number.");
          return;
        }
      }

      if (currentField === "email") {
        const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        if (!isValidEmail) {
          setErrorMessage("Please enter a valid email address.");
          return;
        }
      }
    }

    setErrorMessage("");
    setStep((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-purple-200 via-purple-100 to-blue-100 p-2 sm:p-4">
      <FloatingBlobs />
      <div className="flex flex-col md:flex-row w-full max-w-6xl h-auto md:h-[90vh] overflow-hidden rounded-3xl shadow-2xl backdrop-blur-xl bg-white/80">
        {/* Left Image Section */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-tr from-blue-700 via-purple-700 to-pink-500 relative items-center justify-center p-4">
          <img
            src="https://static.vecteezy.com/system/resources/thumbnails/024/585/326/small/3d-happy-cartoon-doctor-cartoon-doctor-on-transparent-background-generative-ai-png.png"
            alt="doctor"
            className="w-[80%] max-h-[80%] object-contain"
          />
        </div>

        {/* Right Form Section */}
        <div className="w-full md:flex-1 p-3 sm:p-6 md:p-10 flex flex-col justify-center bg-gradient-to-tr from-purple-200 via-purple-100 to-blue-100">
          <div className="w-full max-w-xs sm:max-w-md mx-auto">
            {!role ? (
              <>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-center text-purple-700 mb-4 sm:mb-6 tracking-widest drop-shadow-lg flex items-center justify-center gap-2 sm:gap-3">
                  <span className="animate-bounce">🛡️</span>
                  <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-purple-700 bg-clip-text text-transparent">
                    Rakshaa!!
                  </span>
                  <span className="animate-ping text-purple-300 text-sm sm:text-2xl">
                    💖
                  </span>
                </h1>
                <h2 className="text-xl sm:text-3xl font-bold text-center text-purple-700 mb-4 sm:mb-6">
                  Select Your Role
                </h2>
                <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
                  {roles.map((r) => (
                    <Button
                      key={r}
                      variant="outline"
                      className="rounded-full border-purple-400 text-purple-700 hover:bg-purple-100 cursor-pointer text-sm sm:text-base"
                      onClick={() => setRole(r)}
                    >
                      {r}
                    </Button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <h2 className="text-lg sm:text-2xl font-semibold text-center text-blue-800 mb-2">
                  {mode === "login" ? "Welcome Back!!" : `${role} Signup`}
                </h2>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="text-sm text-gray-500">Role:</span>
                  <select
                    className="text-sm border border-purple-300 rounded-full px-3 py-1 text-purple-700 bg-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                    value={role}
                    onChange={(e) => handleRoleChange(e.target.value)}
                  >
                    {roles.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                {mode === "login" ? (
                  <div className="space-y-4">
                    <IconInput
                      icon={MailIcon}
                      placeholder="Your Email"
                      value={currentData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      onKeyDown={handleKeyDown}
                    />
                    <IconInput
                      icon={LockIcon}
                      placeholder="Your Password"
                      type="password"
                      value={currentData.password}
                      onChange={(e) => handleChange("password", e.target.value)}
                      onKeyDown={handleKeyDown}
                    />
                    <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500">
                      <label className="flex items-center gap-1 sm:gap-2">
                        <input type="checkbox" className="accent-blue-500" />
                        Remember me
                      </label>
                      <a href="/forgot-password" className="text-blue-600 hover:underline">
                        Forgot password?
                      </a>
                    </div>
                    <Button
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-full py-4 sm:py-6 cursor-pointer text-sm sm:text-base"
                      onClick={handleLogin}
                    >
                      LOGIN
                    </Button>
                    <p className="text-center text-xs sm:text-sm mt-2 sm:mt-4">
                      Don’t have an account?{" "}
                      <span
                        className="text-blue-600 cursor-pointer hover:underline"
                        onClick={() => {
                          setMode("signup");
                          setStep(0);
                        }}
                      >
                        Signup
                      </span>
                    </p>
                  </div>
                ) : (
                  <>
                    <Progress
                      value={(step / (steps.length - 1)) * 100}
                      className="mb-4"
                    />
                    <div className="space-y-4">
                      {steps[step] && steps[step].type === "image" ? (
                        <div className="space-y-2">
                          <div className="flex flex-col items-center space-y-4">
                            <label
                              htmlFor="profile-upload"
                              className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full border-2 border-dashed border-purple-400 flex items-center justify-center cursor-pointer hover:bg-purple-100 transition-all"
                            >
                              {currentData.profilePic ? (
                                <img
                                  src={URL.createObjectURL(
                                    currentData.profilePic
                                  )}
                                  alt="Profile"
                                  className="w-full h-full object-cover rounded-full"
                                />
                              ) : (
                                <span className="text-center text-xs sm:text-sm text-purple-500 px-2">
                                  Click to upload
                                </span>
                              )}
                              <input
                                id="profile-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) =>
                                  handleImageChange(e.target.files[0])
                                }
                              />
                            </label>
                            {currentData.profilePic && (
                              <p className="text-xs sm:text-sm text-gray-600 text-center truncate max-w-xs">
                                {currentData.profilePic.name}
                              </p>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          {steps[step].type === "select" ? (
                            <select
                              className={`w-full py-3 px-4 rounded-full bg-gray-100 text-gray-700 text-sm border ${
                                errorMessage
                                  ? "border-red-500"
                                  : "border-transparent"
                              }`}
                              value={currentData[steps[step].field] || ""}
                              onChange={(e) =>
                                handleChange(steps[step].field, e.target.value)
                              }
                            >
                              <option value="">
                                Select {steps[step].label}
                              </option>
                              {steps[step].options.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <Input
                              placeholder={steps[step].label}
                              type={steps[step].type || "text"}
                              value={currentData[steps[step].field] || ""}
                              onChange={(e) =>
                                handleChange(steps[step].field, e.target.value)
                              }
                              onKeyDown={handleKeyDown}
                              className={`py-4 rounded-full bg-gray-100 text-sm ${
                                errorMessage ? "border border-red-500" : ""
                              }`}
                            />
                          )}
                          {errorMessage && (
                            <p className="text-red-500 text-xs sm:text-sm ml-2">
                              {errorMessage}
                            </p>
                          )}
                        </div>
                      )}

                      <div className="flex justify-between">
                        <Button
                          variant="ghost"
                          disabled={step === 0}
                          onClick={() => setStep((prev) => prev - 1)}
                          className="text-xs sm:text-sm"
                        >
                          Back
                        </Button>
                        {step === steps.length - 1 ? (
                          <Button
                            className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm"
                            onClick={handleSignup}
                          >
                            Submit
                          </Button>
                        ) : (
                          <Button
                            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm"
                            onClick={handleNextStep}
                          >
                            Next
                          </Button>
                        )}
                      </div>
                      <p className="text-center text-xs sm:text-sm mt-2 sm:mt-4">
                        Already have an account?{" "}
                        <span
                          className="text-blue-600 cursor-pointer hover:underline"
                          onClick={() => setMode("login")}
                        >
                          Login
                        </span>
                      </p>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
