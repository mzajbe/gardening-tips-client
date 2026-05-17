/* eslint-disable padding-line-between-statements */
/* eslint-disable prettier/prettier */
import { jwtDecode } from "jwt-decode";
import { parseCookies } from "nookies";
import { useEffect, useState } from "react";
import Nexios from "axios";

import { Post } from "../../../types";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";

interface SavedPostsModalProps {
    onClose: () => void;
  }

const SavesPostsModal:React.FC<SavedPostsModalProps> = ({ onClose }) => {
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedPosts = async () => {
      try {
        const cookies = parseCookies();
        const accessToken = cookies.accessToken;
        const decodedToken: any = jwtDecode(accessToken);
        const userId = decodedToken._id;

        const response = await Nexios.get(
          `/api/proxy/fav/userfav/${userId}`
        );
        setSavedPosts(response.data.data);
      } catch (error) {
        console.error("Error fetching saved posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedPosts();
  }, []);


  console.log(savedPosts);
  

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl bg-white dark:bg-slate-800 max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800 dark:text-white">Saved Posts</DialogTitle>
        </DialogHeader>

        {loading ? (
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        ) : savedPosts.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300">No saved posts found.</p>
        ) : (
          <ul className="space-y-4 mt-4">  
            {savedPosts.map((post) => (  
              <li key={post._id} className="rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800 transition-transform transform hover:scale-[1.02]">  
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{post.postId.title}</h3>  
                <div 
                  dangerouslySetInnerHTML={{ __html: post.postId.content }} 
                  className="text-gray-700 dark:text-gray-300 mt-2" 
                />
                {/* <img src={post.postId.images[0]} alt="" className="w-full h-48 object-cover rounded-md my-2" /> */}  
              </li>  
            ))}  
          </ul>  
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SavesPostsModal;
