/* eslint-disable prettier/prettier */
"use client"
import { useState, useEffect } from "react";
import { parseCookies } from "nookies"; // Assuming your access token is stored in cookies
import { jwtDecode } from "jwt-decode";

interface Post {  
    _id: string; // Unique identifier for the post  
    title: string; // Title of the post  
    content: string; // Content of the post  
    categories: string[]; // Array of categories  
    images: string[]; // Array of image URLs  
    createdAt: string; // Creation date in ISO format  
  } 

interface DashboardProps {}

const Dashboard: React.FC<DashboardProps> = () => {
  const [followers, setFollowers] = useState<number>(0);
  const [following, setFollowing] = useState<number>(0);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch Dashboard data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const cookies = parseCookies();
        const accessToken = cookies.accessToken;

        if (!accessToken) {
          throw new Error("User is not authenticated");
        }

        const decodedToken: any = jwtDecode(accessToken);
        const userId = (decodedToken._id);

        // Fetch followers, following, and posts
        const responses = await Promise.all([
          fetch("http://localhost:5000/api/v1/users/followers", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }),
          fetch("http://localhost:5000/api/v1/users/following", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }),
          fetch(`http://localhost:5000/api/v1/posts/user-posts/${userId}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }),
        ]);

        const [followersData, followingData, postsData] =
          await Promise.all(responses.map((response) => response.json()));

        setFollowers(followersData.count || 0);
        setFollowing(followingData.count || 0);
        setPosts(postsData.data || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center text-white">Loading...</div>;
  }

  // Count total posts from the posts array
  const totalPosts = posts.length;

  return (
    <div className="min-h-screen bg-black text-white">  
      {/* Top Section for Total Post Count */}  
      <div className="grid grid-cols-3 gap-4 p-4">  
        <div className="col-span-3 md:col-span-1 bg-gray-800 p-4 rounded-lg text-center">  
          <h2 className="text-2xl font-bold">Total Posts</h2>  
          <p className="text-3xl mt-2">{totalPosts}</p>  
        </div>  
      </div>  

      {/* Main Content */}  
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-4">  
        {/* Sidebar */}  
        <div className="md:col-span-1 bg-black border p-4 rounded-lg">  
          {/* <h2 className="text-xl font-bold mb-4">Followers & Following</h2>   */}
          <div className="mb-4">  
            <p>Followers: {followers}</p>  
          </div>  
          <div>  
            <p>Following: {following}</p>  
          </div>  
        </div>  

        {/* User Posts */}  
        <div className="md:col-span-3 bg-black border p-6 rounded-lg">  
          <h2 className="text-xl font-bold mb-4">Your Posts</h2>  
          {posts.length > 0 ? (  
            <div>  
              {posts.map((post) => (  
                <div  
                  key={post._id}  
                  className="bg-gray-700 p-4 mb-4 rounded-lg flex flex-col"  
                >  
                  <h3 className="text-lg font-bold">{post.title}</h3>  
                  <p className="text-gray-300 mt-2">{post.content}</p>  
                  <div className="flex justify-between mt-4">  
                    <span className="text-sm text-gray-500">  
                      Categories: {post.categories.join(', ')}  
                    </span>  
                    <span className="text-sm text-gray-500">  
                      Created At: {new Date(post.createdAt).toLocaleDateString()}  
                    </span>  
                  </div>  
                  <div className="mt-4">  
                    {post.images.length > 0 && (  
                      <img  
                        src={post.images[0]}  
                        alt={post.title}  
                        className="w-full h-48 object-cover rounded-lg"  
                      />  
                    )}  
                  </div>  
                </div>  
              ))}  
            </div>  
          ) : (  
            <div className="flex flex-col items-center justify-center h-64">  
              <img  
                src="/path/to/sloth.png" // Update the path to your sloth image  
                alt="No posts yet"  
                className="w-32 h-32"  
              />  
              <p className="text-gray-500">You havent written anything yet.</p>  
              <button className="bg-purple-500 text-white mt-4 px-4 py-2 rounded">  
                Write your first post now  
              </button>  
            </div>  
          )}  
        </div>  
      </div>  
    </div>  
  );
};

export default Dashboard;
