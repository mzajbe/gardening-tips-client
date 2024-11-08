/* eslint-disable padding-line-between-statements */
/* eslint-disable prettier/prettier */
import { jwtDecode } from "jwt-decode";
import { parseCookies } from "nookies";
import { useEffect, useState } from "react";
import Nexios from "axios";
import { Post } from "../../../types";

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
          `https://gardening-server.vercel.app/api/v1/fav/userfav/${userId}`
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-3/4 max-w-lg">
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-800 float-right"
        >
          &times;
        </button>
        <h2 className="text-xl text-black font-semibold mb-4">Saved Posts</h2>

        {loading ? (
          <p>Loading...</p>
        ) : savedPosts.length === 0 ? (
          <p>No saved posts found.</p>
        ) : (
            <ul className="space-y-4">  
            {savedPosts.map((post) => (  
              <li key={post._id} className="rounded-lg shadow-md p-4 bg-white dark:bg-gray-800 transition-transform transform hover:scale-105">  
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{post.postId.title}</h3>  
                <p className="text-gray-700 dark:text-gray-300">{post.postId.content}</p>  
                {/* <img src={post.postId.images[0]} alt="" className="w-full h-48 object-cover rounded-md my-2" /> */}  
              </li>  
            ))}  
          </ul>  
        )}
      </div>
    </div>
  );
};

export default SavesPostsModal;
