"use client";

import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const DoctorContext = createContext();

const DoctorProvider = ({ children }) => {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctor = async () => {
      const token = await localStorage.getItem("drtoken");
      // console.log("token in context", token);

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get("/api/doctor/details", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.success) {
          setDoctor(res.data.doctor); 
        } else {
          setDoctor(null);
        }
      } catch (error) {
        console.error("Doctor fetch error:", error);
        setDoctor(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, []);

  const doctorId = doctor?._id || doctor?.id || null;

  return (
    <DoctorContext.Provider value={{ doctor, setDoctor, loading, doctorId }}>
      {children}
    </DoctorContext.Provider>
  );
};

// Custom hook to use DoctorContext
export const useDoctor = () => useContext(DoctorContext);

export default DoctorProvider;
