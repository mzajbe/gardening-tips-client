/* eslint-disable padding-line-between-statements */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable prettier/prettier */
"use client";

import { useEffect, useState } from "react";
import { Post } from "../../../../types";
import { parseCookies } from "nookies";
import { jwtDecode } from "jwt-decode";
import { FiEdit2 } from "react-icons/fi"; // Add edit icon

const page = () => {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [followers, setFollowers] = useState<number>(0);
  const [following, setFollowing] = useState<number>(0);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProfilePicture, setNewProfilePicture] = useState<File | null>(null);
  const [newName, setNewName] = useState("");

  const cookies = parseCookies();
  const accessToken = cookies.accessToken;

  if (!accessToken) {
    throw new Error("User is not authenticated");
  }

  const decodedToken: any = jwtDecode(accessToken);
  const userId = decodedToken._id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch followers, following, and posts
        const responses = await Promise.all([
          fetch(`https://gardening-server.vercel.app/api/v1/users/${userId}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }),
          fetch(`https://gardening-server.vercel.app/api/v1/follow/${userId}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }),
          fetch("https://gardening-server.vercel.app/api/v1/users/following", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }),
          fetch(
            `https://gardening-server.vercel.app/api/v1/posts/user-posts/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          ),
        ]);

        const [userData, followersData, followingData, postsData] =
          await Promise.all(responses.map((response) => response.json()));

        console.log(followersData.data.length);

        setUserInfo(userData.data);
        setFollowers(followersData.data.length || 0);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      // Check file size limit (e.g., 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert("File size exceeds 2MB");
        return;
      }
      setNewProfilePicture(file);
    }
  };

  const handleProfileUpdate = async () => {
    // const cookies = parseCookies();
    // const accessToken = cookies.accessToken;
    const formData = new FormData();

    if (newProfilePicture) {
      formData.append("profilePicture", newProfilePicture);
    }
    if (newName) {
      formData.append("name", newName);
    }

    try {
      await fetch(
        `https://gardening-server.vercel.app/api/v1/users/${userId}`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${accessToken}` },
          body: formData,
        }
      );

      setIsModalOpen(false);
      // Optionally, refresh user data after updating profile
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (loading) {
    return <div className="text-center text-white">Loading...</div>;
  }

  // Count total posts from the posts array
  const totalPosts = posts.length;
  const formattedDate = userInfo
    ? new Date(userInfo.createdAt).toLocaleDateString()
    : "";

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 flex flex-col items-center">
      {/* Profile Section */}
      <div className="w-full max-w-3xl">
        <div className="flex flex-col items-center">
          <div className="relative">
            <img
              src={userInfo?.profilePicture || "/path/to/default-profile.jpg"} // Fallback image
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-blue-500 object-cover"
            />
            <button className="absolute bottom-1 right-1 bg-blue-500 text-white p-1 rounded-full">
              <FiEdit2 size={20} />
            </button>
          </div>
          <h1 className="text-3xl font-bold mt-4">
            {userInfo?.name || "Username"}
          </h1>
          <p className="text-gray-400 mt-1">Joined on {formattedDate}</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="border border-red-500 p-2 hover:bg-red-300 "
          >
            Edit profile
          </button>
        </div>

        {/* Edit Profile Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-gray-800 p-6 rounded-lg max-w-sm w-full">
              <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
              <label className="block mb-2 text-gray-400">
                New Profile Picture:
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mb-4"
              />
              <label className="block mb-2 text-gray-400">New Name:</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Enter new name"
                className="w-full mb-4 px-3 py-2 rounded-lg"
              />
              <button
                onClick={handleProfileUpdate}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
              >
                Save Changes
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Stats Section */}
        <div className="flex justify-around mt-8 text-center text-xl">
          <div>
            <p className="font-semibold">{followers}</p>
            <p className="text-gray-400">Followers</p>
          </div>
          <div>
            <p className="font-semibold">{following}</p>
            <p className="text-gray-400">Following</p>
          </div>
          <div>
            <p className="font-semibold">{totalPosts}</p>
            <p className="text-gray-400">Posts</p>
          </div>
        </div>

        {/* Posts Section */}
        <div className="mt-12 w-full">
          <h2 className="text-2xl font-bold mb-4 text-center">Your Posts</h2>
          {posts.length > 0 ? (
            <div>
              {posts.map((post) => (
                <div key={post._id} className="bg-gray-800 p-6 mb-6 rounded-lg">
                  <h3 className="text-xl font-semibold">{post.title}</h3>
                  <p className="text-gray-300 mt-2">{post.content}</p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-sm text-gray-500">
                      Categories: {post.categories.join(", ")}
                    </span>
                    <span className="text-sm text-gray-500">
                      Created: {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {post.images.length > 0 && (
                    <img
                      src={post.images[0]}
                      alt={post.title}
                      className="w-full h-48 mt-4 object-cover rounded-lg"
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center mt-16">
              <p className="text-gray-500">You haven’t written anything yet.</p>
              <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Write your first post
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
