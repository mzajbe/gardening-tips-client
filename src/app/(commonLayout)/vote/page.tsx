/* eslint-disable no-console */
/* eslint-disable padding-line-between-statements */
/* eslint-disable prettier/prettier */
"use client";
// import { cookies } from 'next/headers';
import { parseCookies } from "nookies";
import { useState, useEffect } from "react";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";


interface VoteButtonProps {
  postId: string;
}

const VoteButton: React.FC<VoteButtonProps> = ({ postId }) => {
  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvotes] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [userVote, setUserVote] = useState<null | "upvote" | "downvote">(null);

  // Fetch initial vote counts when the component mounts
  useEffect(() => {
    const fetchVotes = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/v1/votes/${postId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch vote counts");
        }

        
        

        const data = await response.json();
        
        
        setUpvotes(data.data.upvoteCount);
        setDownvotes(data.data.downvoteCount);
        setUserVote(data.data.voteType);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };

    fetchVotes();
  }, [postId]);

  // Function to handle voting (upvote or downvote)
  const handleVote = async (voteType: "upvote" | "downvote") => {
    try {
      //get the accesstoken from cookie
      const cookies = parseCookies(); // Using nookies to parse cookies
      const accessToken = cookies.accessToken;
      // console.log(accessToken);

      if (!accessToken) throw new Error("Access token is missing");

      const res = await fetch("http://localhost:5000/api/v1/votes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`, // Add the token to the request headers
        },
        body: JSON.stringify({
          postId,
          voteType,
        }),
      });

      
      

      if (!res.ok) throw new Error("Failed to cast vote");

      const data = await res.json();
      console.log(data);
      

      // Update vote counts based on the response
      if (voteType === "upvote") {
        // If the user is switching from downvote to upvote
        if (userVote === "downvote") {
          setDownvotes((prev) => prev - 1);
        }
        // If the user is casting an upvote for the first time
        if (userVote !== "upvote") {
          setUpvotes((prev) => prev + 1);
        }
      } else {
        // If the user is switching from upvote to downvote
        if (userVote === "upvote") {
          setUpvotes((prev) => prev - 1);
        }
        // If the user is casting a downvote for the first time
        if (userVote !== "downvote") {
          setDownvotes((prev) => prev + 1);
        }
      }
      setUserVote(voteType); // Update user's vote status
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) {
    return <p>Loading...</p>; // Optionally handle loading state
  }

  return (
    <div className="flex space-x-4">
      <button
        onClick={() => handleVote("upvote")}
        className={`${
          userVote === "upvote" ? "bg-green-700" : "bg-green-500"
        } text-white px-4 py-2 rounded-lg`}
      >
        Upvote ({upvotes})
      </button>
      {/* <ThumbUpIcon /> */}
      <button
        onClick={() => handleVote("downvote")}
        className={`${
          userVote === "downvote" ? "bg-red-700" : "bg-red-500"
        } text-white px-4 py-2 rounded-lg`}
      >
        Downvote ({downvotes})
      </button>
    </div>     
  );
};

export default VoteButton;
