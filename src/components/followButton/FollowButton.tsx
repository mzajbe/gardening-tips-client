/* eslint-disable prettier/prettier */
"use client"
import { jwtDecode } from 'jwt-decode';
import { parseCookies } from 'nookies';
import React, { useEffect, useState } from 'react';  
import { toast } from 'react-toastify';

interface FollowButtonProps {  
  followerId: string;   // ID of the user who is following  
  followingId: string;  // ID of the user to be followed/unfollowed  
  initialFollowed: boolean; // Initial follow state  
}  

const FollowButton: React.FC<FollowButtonProps> = ({  followingId, initialFollowed }) => {  
    const [isFollowing, setIsFollowing] = useState<boolean>(initialFollowed); // Follow state management 
    const [followerId, setfollowerId] = useState<string>("");
    
    

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
    
            setfollowerId(userId);
          } catch (error) {
            toast.error("Error retrieving user ID from token");
          }
        };
    
        fetchUserFromToken(); // Extract user when the page loads
      }, []);

      

      console.log(followerId);
      console.log(followingId);
      
      
    

    const handleFollowToggle = async () => {  
        const url = isFollowing  
            ? 'http://localhost:5000/api/v1/follow/unfollow' // Unfollow endpoint  
            : 'http://localhost:5000/api/v1/follow'; // Follow endpoint  
        
        const method = isFollowing ? 'DELETE' : 'POST'; // DELETE for unfollow, POST for follow  

        const body = JSON.stringify({  
            followerId,  
            followingId  
        });  

        console.log(body);
        

        try {  
            const response = await fetch(url, {  
                method,  
                headers: {  
                    'Content-Type': 'application/json',  
                },  
                body: !isFollowing ? body : undefined, // Only attach body on POST  
            });
            
            console.log(response);
            

            if (!response.ok) {  
                throw new Error('Failed to update follow status');  
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
            className={`px-4 py-2 rounded transition duration-200 ${  
                isFollowing ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'  
            }`}  
        >  
            {isFollowing ? 'Unfollow' : 'Follow'}  
        </button>  
    );  
};  

export default FollowButton;