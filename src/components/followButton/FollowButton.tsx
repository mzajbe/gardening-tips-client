/* eslint-disable prettier/prettier */
"use client";
import { jwtDecode } from "jwt-decode";
import { parseCookies } from "nookies";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface FollowButtonProps {
  followingId: string; // ID of the user to be followed/unfollowed
}

const FollowButton: React.FC<FollowButtonProps> = ({ followingId }) => {
  const [isFollowing, setIsFollowing] = useState<boolean>(false); // Follow state management
  const [followerId, setFollowerId] = useState<string>("");

  useEffect(() => {
    const fetchUserFromToken = () => {
      try {
        const cookies = parseCookies(); // Using nookies to parse cookies
        const accessToken = cookies.accessToken;

        if (!accessToken) throw new Error("Access token is missing");

        // Decode the token to get the user ID
        const decodedToken: any = jwtDecode(accessToken);
        // console.log(decodedToken._id);

        const userId = decodedToken._id;
        // console.log(userId);

        setFollowerId(userId);
      } catch (error) {
        toast.error("Error retrieving user ID from token");
      }
    };

    fetchUserFromToken(); // Extract user when the page loads
  }, []);

  //   console.log(followerId);
  //   console.log(followingId);

  // Fetch the follow status from the backend when the followerId and followingId are available
  useEffect(() => {
    const fetchFollowStatus = async () => {
      if (!followerId || !followingId) return; // Ensure both IDs are available

      try {
        const response = await fetch(
          `http://localhost:5000/api/v1/follow/status/${followerId}/${followingId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setIsFollowing(data.isFollowing); // Set the follow state based on the response
        } else {
          throw new Error("Failed to fetch follow status");
        }
      } catch (error) {
        console.error("Error while fetching follow status:", error);
      }
    };

    fetchFollowStatus(); // Fetch follow status on component mount
  }, [followerId, followingId]); // Run when followerId or followingId changes

  const handleFollowToggle = async () => {
    const url = isFollowing
      ? "http://localhost:5000/api/v1/follow/unfollow" // Unfollow endpoint
      : "http://localhost:5000/api/v1/follow"; // Follow endpoint

    const method = isFollowing ? "DELETE" : "POST"; // DELETE for unfollow, POST for follow

    const body = JSON.stringify({
      followerId,
      followingId,
    });

    console.log(body);

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body, // Include body for both POST and DELETE requests
      });

      console.log(response);

      if (!response.ok) {
        throw new Error("Failed to update follow status");
      }

      // Toggle follow state
      setIsFollowing((prevFollowed) => !prevFollowed);
    } catch (error) {
      console.error("Error while updating follow status:", error);
    }
  };

  return (
    <button
      onClick={handleFollowToggle}
      className={`flex items-center justify-center px-4 py-2 rounded-lg border transition duration-300   
        ${isFollowing ? "dark:bg-black  dark:text-white border-blue-500 hover:bg-red-500" : "dark:bg-black text-blue-500 border-gray-300 hover:bg-gray-50"}`}
    >
      {isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
};

export default FollowButton;
