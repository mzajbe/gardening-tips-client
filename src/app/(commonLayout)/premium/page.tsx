/* eslint-disable no-console */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable padding-line-between-statements */
/* eslint-disable prettier/prettier */
"use client";

import Nexios from "axios";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { parseCookies } from "nookies";

// console.log(userId);

const handleCheckout = async () => {
  try {
    const cookies = parseCookies();
    const accessToken = cookies.accessToken;

    // if(!accessToken){
    //   throw new Error("User is not authenticated");
    // }

    const decodeToken: any = jwtDecode(accessToken);
    const userId = decodeToken._id;
    const response = await Nexios.get(
      `https://gardening-server.vercel.app/api/v1/payment/${userId}`
    );
    // console.log(response);

    if (response.status === 200 && response.data?.data) {
      window.location.href = response.data.data;
    } else {
      console.error("Unexpected response format:", response);
    }
    // console.log(response);
  } catch (error) {
    console.error("Payment initiation failed:", error);
  }
};

// After successful payment, this function confirms the payment and updates the database
const confirmPayment = async () => {
  try {
    const cookies = parseCookies();
    const accessToken = cookies.accessToken;

    // if(!accessToken){
    //   throw new Error("User is not authenticated");
    // }

    const decodeToken: any = jwtDecode(accessToken);
    const userId = decodeToken._id;
    const response = await Nexios.post(
      `https://gardening-server.vercel.app/api/v1/payment/confirmation/${userId}`
    );

    if (response.status === 200) {
      console.log("Payment confirmed and user updated to premium");
    } else {
      console.error("Failed to confirm payment:", response);
    }
  } catch (error) {
    console.error("Payment confirmation failed:", error);
  }
};

const page = () => {
  const router = useRouter();

  // After payment, user could be redirected here and the payment confirmed
  const handlePageLoad = async () => {
    await confirmPayment();
    router.push("/premium-content"); // Redirect to the premium content page after confirmation
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen  p-6">
      <h1 className="text-3xl font-bold text-center mb-4">
        Unlock Premium Gardening Content
      </h1>
      <p className="text-lg text-center mb-6">
        Join our community of gardening enthusiasts and gain access to exclusive
        tips, tricks, and resources!
      </p>

      <div className="border shadow-md rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-semibold text-center mb-4">
          Premium Access: $1.00/month
        </h2>

        <ul className="mb-6 ">
          <li>- Access to exclusive gardening tips and articles</li>
          <li>- Monthly Q&A sessions with gardening experts</li>
          <li>- Downloadable resources, checklists, and guides</li>
          <li>- Access to our gardening community forums</li>
          <li>- Special discounts for gardening products</li>
        </ul>

        <button
          className="bg-green-500 text-white font-semibold py-2 px-4 rounded hover:bg-green-600 transition duration-200 w-full"
          onClick={() => handleCheckout()}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default page;
