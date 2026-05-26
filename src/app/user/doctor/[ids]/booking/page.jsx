"use client";
import { useState } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
const MakePayment = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };
  const searchParams = useSearchParams();

  const doctorId = searchParams.get("doctorId");
  const doctorName = searchParams.get("doctorName");
  const patientId = searchParams.get("patientId");
  const date = searchParams.get("date");
  const disease = searchParams.get("disease");
  const fee = searchParams.get("consultationFee");
  const paymentMode = searchParams.get("paymentMode");
  const patientName = searchParams.get("patientName");

  const handlePayment = async () => {
    setLoading(true);
    const isScriptLoaded = await loadRazorpayScript();

    if (!isScriptLoaded) {
      alert("Failed to load Razorpay SDK");
      setLoading(false);
      return;
    }

    try {
      const amount = fee;

      const { data } = await axios.post("/api/payment/create-order", {
        amount,
      });

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: "Rakshaa Health",
        description: "Appointment Payment",
        order_id: data.orderId,
        handler: async function (response) {
          const verifyRes = await axios.post("/api/payment/verify-payment", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          if (verifyRes.data.success) {
            const bookingRes = await axios.post("/api/booking/doctor-booking", {
              doctorId,
              doctorName,
              patientId,
              patientName,
              date,
              disease,
              consultationFee: fee,
              paymentMode,
            });
            if (bookingRes.data.success) {
              router.push("/user/reports");
            } else {
              alert("Payment verified but booking failed!");
            }
          } else {
            alert("Payment Failed Verification!");
          }
        },
        prefill: {
          name: "Patient Name",
          email: "patient@email.com",
          contact: "9000090000",
        },
        theme: {
          color: "#7E22CE",
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (err) {
      console.error("Payment Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.pexels.com/photos/326055/pexels-photo-326055.jpeg?auto=compress&cs=tinysrgb&w=600')",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-40 z-0"></div>

      <div className="relative z-10 bg-white/30 backdrop-blur-lg shadow-2xl p-10 rounded-3xl max-w-md w-full text-center border border-white/30">
        <h2 className="text-3xl font-bold text-white mb-6">
          Complete Your Payment
        </h2>
        <p className="mb-6 text-gray-100 font-medium">
          Click below to pay ₹{fee} securely via Razorpay
        </p>

        <button
          onClick={handlePayment}
          disabled={loading}
          className={`relative bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg transition duration-300 transform hover:scale-105 focus:outline-none cursor-pointer ${
            loading ? "opacity-50 cursor-not-allowed" : "animate-pulse"
          }`}
        >
          {loading ? (
            <div className="flex items-center gap-2 justify-center">
              <span className="loader-small" />
              Processing...
            </div>
          ) : (
            `Pay ₹${fee}`
          )}
        </button>
      </div>
    </div>
  );
};

export default MakePayment;
