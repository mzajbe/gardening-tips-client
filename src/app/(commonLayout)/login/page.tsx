/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable prettier/prettier */
/* eslint-disable react/self-closing-comp */
/* eslint-disable prettier/prettier */


"use client";

import GoogleLoginBtn from "@/src/components/shared/GoogleLoginBtn";
import nexiosInstance from "@/src/config/nexios.config";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useState } from "react";

// Define the expected structure of the response data
interface LoginResponse {
  success: boolean;
  data: {
    accessToken: string;
  };
  message?: string;
}


const LoginPage = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Reset error message

    try {
      console.log("Attempting to log in...");
      const response = await nexiosInstance.post<LoginResponse>("/auth/login", { email, password });

      if (response.data.success) {
        console.log("Login successful:", response.data);
        
        // Store the access token (cookie storage recommended for security)
        document.cookie = `accessToken=${response.data.data.accessToken}; path=/`;

        // Redirect to the dashboard
        router.push("/dashboard");
      } else {
        setError("Invalid email or password."); // Display error message
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("Something went wrong. Please try again.");
    }
  };
  
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="p-8 bg-white shadow-md rounded-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <form onSubmit={handleLogin}>
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
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Login
          </button>
        </form>

        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

        <div className="mt-4 text-center">
          <p>Dont have an account? <Link href="/signup" className="text-blue-500">Sign up here</Link></p>
        </div>

        <div className="mt-4">
          <GoogleLoginBtn />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;



// import GoogleLoginBtn from "@/src/components/shared/GoogleLoginBtn";

// const LoginPage = () => {
//   return (
//     <div>
//       <h1>Login</h1>
//       <div>
//         <GoogleLoginBtn />
//       </div>
//     </div>
//   );
// };

// export default LoginPage;