/* eslint-disable padding-line-between-statements */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */

import { jwtDecode } from "jwt-decode";
import { parseCookies } from "nookies";
import { useEffect, useState } from "react";
import Nexios from "axios";

import { Bookmark } from "lucide-react";

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
            `/api/proxy/fav/${postId}`
          );
          console.log(response.data.data.postId);
          if (response) {
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
          `/api/proxy/fav/${postId}`,
          { data: { userId } }
        );
        setIsFavourite(false);
      } else {
        // Add to favorites
        await Nexios.post("/api/proxy/fav", {
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
    <span
      className={`cursor-pointer w-full text-sm font-medium flex items-center ${
        isFavourite ? "text-emerald-500" : ""
      }`}
      onClick={handleToggleFavourite}
    >
      <Bookmark className={`w-4 h-4 mr-2 ${isFavourite ? "fill-emerald-500" : ""}`} />
      {isFavourite ? "Saved" : "Save"}
    </span>
  );
};

export default FavouriteBtn;
