/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable padding-line-between-statements */
/* eslint-disable prettier/prettier */
"use client";
import nexiosInstance from "@/src/config/nexios.config";
import { useRouter } from "next/navigation";
import { useState } from "react";

const SignupPage = () => {

    const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePic,setProfilePic]=useState("");
  const [role] = useState("user"); // default role
  const router = useRouter();


  // Define the expected structure of the response data
interface SignupResponse {
  success: boolean;
  data: {
    accessToken: string;
  };
  message?: string;
}


  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await nexiosInstance.post<SignupResponse>("/auth/signup", { name, email, password,profilePic, role });

      if (response.data.success) {
        // Store the access token in localStorage or cookies if needed
        localStorage.setItem("accessToken", response.data.data.accessToken);

        // Redirect to the dashboard or any protected route
        router.push("/dashboard");
      } else {
        // Handle signup failure (e.g., display an error message)
        console.error("Signup failed");
      }
    } catch (error) {
      console.error("Error during signup:", error);
    }
  };
    return (
        <div className="flex justify-center items-center h-screen">
      <div className="p-8 bg-white shadow-md rounded-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Signup</h1>
        <form onSubmit={handleSignup}>
          <div className="mb-4">
            <label className="block mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          {/* <div className="mb-4">
            <label className="block mb-1">Profile Pic</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setProfilePic(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div> */}
          <button
            type="submit"
            className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
          >
            Signup
          </button>
        </form>
      </div>
    </div>
    );
};

export default SignupPage;