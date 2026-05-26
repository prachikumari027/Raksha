"use client";

import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { usePathname } from "next/navigation";
const UserContext = createContext({});

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = await localStorage.getItem("token");
      // console.log("token in contex", token);
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get("/api/user/details", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.success) {
          // console.log("checking the response", res.data.user)
          setUser(res.data.user);
        } else {
          console.log("Something went Wrong");
          setUser(null);
        }
      } catch (error) {
        console.error("User fetch error:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const userId = user?._id || user?.id || null;
  const patientName = user?.name || user?.name || null;

  return (
    <UserContext.Provider value={{ user, setUser, loading, userId,patientName }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

export default UserProvider;
