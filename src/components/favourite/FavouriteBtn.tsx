/* eslint-disable padding-line-between-statements */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */

import { jwtDecode } from "jwt-decode";
import { parseCookies } from "nookies";
import { useEffect, useState } from "react";
import Nexios from "axios";
import { MdFavorite } from "react-icons/md";

interface FavouriteBtnProps {
  postId: string;
}

const FavouriteBtn = ({ postId }: FavouriteBtnProps) => {
  const [isFavourite, setIsFavourite] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const cookies = parseCookies();
    const accessToken = cookies.accessToken;

    if (accessToken) {
      const decodedToken: any = jwtDecode(accessToken);
      setUserId(decodedToken._id);
    }
  }, []);

  // Check if the post is already a favorite
  useEffect(() => {
    if (userId) {
      const checkIfFavourite = async () => {
        try {
          const response = await Nexios.get(
            `https://gardening-server.vercel.app/api/v1/fav/${postId}`
          );
          console.log(response.data.data.postId);
          if(response){
            setIsFavourite(true);
          }

          // setIsFavourite(response.data.isFavourite);
        } catch (error) {
          console.error("Error checking favourite status:", error);
        }
      };
      checkIfFavourite();
    }
  }, [userId, postId]);

  // Toggle favorite status
  const handleToggleFavourite = async () => {
    try {
      if (isFavourite) {
        // Remove from favorites
        await Nexios.delete(
          `https://gardening-server.vercel.app/api/v1/fav/${postId}`,
          { data: { userId } }
        );
        setIsFavourite(false);
      } else {
        // Add to favorites
        await Nexios.post("https://gardening-server.vercel.app/api/v1/fav", {
          postId,
          userId,
        });
        setIsFavourite(true);
      }
    } catch (error) {
      console.error("Error toggling favourite:", error);
    }
  };

  return (
    <MdFavorite
      className={`cursor-pointer ${
        isFavourite ? "text-red-500" : "text-gray-400"
      }`}
      onClick={handleToggleFavourite}
      size={24} // Adjust the size as needed
    />
  );
};

export default FavouriteBtn;
