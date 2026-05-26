"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import UserNavbar from "@/components/UserNavbar";
import { useUser } from "@/context/userContext";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

function MyProfile() {
  const router = useRouter();
  const [isEditing, setIsEditing] = React.useState(false);
  const { user, loading, } = useUser();
  // console.log("user details", user);
  const [userDetails, setUserDetails] = React.useState(null);

  React.useEffect(() => {
    if (user) {
      setUserDetails({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        emergencyContact: user.emergencyContact || "",
        bloodType: user.bloodType || "",
        allergies: user.allergies || "",
        medications: user.medications || "",
        weight: user.weight || "",
        height: user.height || "",
        age: user.age || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const toggleEdit = () => setIsEditing(!isEditing);

  const handleSaveChanges = async () => {
    try {
      const res = await fetch("/api/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user._id,
          ...userDetails,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Profile Updated!!");
        setIsEditing(false);
        router.push("/user/profile");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("An error occurred. Please try again.");
    }
  };

  if (loading  || !userDetails) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-purple-400 border-dashed rounded-full animate-spin dark:border-purple-300"></div>
          <p className="text-purple-700 dark:text-purple-200 text-lg font-semibold animate-pulse">
            Loading Profile Details...
          </p>
        </div>
      </div>
    );
  }
  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };
  return (
    <>
      <UserNavbar />
      <div className="p-6 bg-purple-100 dark:bg-purple-900 min-h-screen">
        {isEditing ? (
          <div className="bg-purple-200 dark:bg-purple-800 p-8 rounded-xl shadow-xl max-w-4xl mx-auto">
            <h2 className="text-3xl font-semibold text-purple-900 dark:text-purple-100 mb-6 text-center">
              Edit Profile
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(userDetails).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-purple-800 dark:text-purple-200 font-semibold mb-1 capitalize">
                    {key.replace(/([A-Z])/g, " $1")}:
                  </label>
                  <input
                    type="text"
                    name={key}
                    value={value}
                    onChange={handleChange}
                    className="w-full p-2 rounded-md bg-white dark:bg-purple-950 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-600"
                  />
                </div>
              ))}
            </div>
            <div className="mt-8 flex justify-center gap-4">
              <Button
                onClick={handleSaveChanges}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full cursor-pointer"
              >
                Save Changes
              </Button>
              <Button
                onClick={toggleEdit}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-full cursor-pointer"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col-reverse lg:flex-row gap-10">
            {/* Profile Section */}
            <div className="bg-purple-200 dark:bg-purple-800 p-6 rounded-xl w-full lg:w-1/3 shadow-xl">
              <div className="flex justify-center mb-4">
                <img
                  src={user.profilePic}
                  alt="User"
                  className="w-36 h-36 rounded-full object-cover"
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                <Button
                  onClick={() => handleLogout()}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md w-full sm:w-auto cursor-pointer"
                >
                  Logout
                </Button>
                <Button
                  onClick={toggleEdit}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md w-full sm:w-auto cursor-pointer"
                >
                  Edit Profile
                </Button>
              </div>

              <div className="space-y-4">
                {["name", "email", "phone", "address", "emergencyContact"].map(
                  (key) => (
                    <div
                      key={key}
                      className="flex flex-col lg:flex-row lg:justify-between text-md"
                    >
                      <span className="text-purple-800 dark:text-purple-200 font-semibold capitalize">
                        {key.replace(/([A-Z])/g, " $1")}:
                      </span>
                      <span className="text-purple-600 dark:text-purple-400 text-right lg:ml-2">
                        {userDetails[key]}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Medical Info Section */}
            <div className="bg-purple-200 dark:bg-purple-800 p-6 rounded-xl w-full lg:w-2/3 shadow-xl">
              <h3 className="text-3xl font-semibold text-purple-900 dark:text-purple-100 mb-6">
                Medical Information
              </h3>
              <div className="space-y-4">
                {[
                  "bloodType",
                  "allergies",
                  "medications",
                  "weight",
                  "height",
                  "age",
                ].map((key) => (
                  <div
                    key={key}
                    className="flex flex-col lg:flex-row lg:justify-between text-md"
                  >
                    <span className="text-purple-800 dark:text-purple-200 font-semibold capitalize">
                      {key.replace(/([A-Z])/g, " $1")}:
                    </span>
                    <span className="text-purple-600 dark:text-purple-400 text-right lg:ml-2">
                      {userDetails[key]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default MyProfile;
