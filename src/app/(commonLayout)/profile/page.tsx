/* eslint-disable react/jsx-no-undef */
/* eslint-disable import/order */
/* eslint-disable no-console */
/* eslint-disable react/jsx-sort-props */
/* eslint-disable react/self-closing-comp */
/* eslint-disable padding-line-between-statements */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable prettier/prettier */
"use client";

import { useEffect, useState } from "react";
import { Post } from "../../../../types";
import { parseCookies } from "nookies";
import { jwtDecode } from "jwt-decode";
// import { FiEdit2 } from "react-icons/fi"; // Add edit icon
import { toast } from "sonner";
import VoteButton from "../vote/VoteButton";
// import { FaCheckCircle } from "react-icons/fa";
import SavesPostsModal from "@/src/components/modal/SavesPostsModal";
import { Button } from "@/src/components/ui/button";

const page = () => {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [followers, setFollowers] = useState<number>(0);
  const [following, setFollowing] = useState<number>(0);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenforSaved, setIsModalOpenforSaved] = useState(false);
  const [newProfilePicture, setNewProfilePicture] = useState<File | null>(null);
  const [newName, setNewName] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleOpenModalforSaved = () => setIsModalOpenforSaved(true);
  const handleCloseModal = () => setIsModalOpenforSaved(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cookies = parseCookies();
        const accessToken = cookies.accessToken;

        // if (!accessToken) {
        //   throw new Error("User is not authenticated");
        // }

        const decodedToken: any = jwtDecode(accessToken);
        const userId = decodedToken._id;
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
          fetch(
            `https://gardening-server.vercel.app/api/v1/following/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          ),
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
        toast.warning("Your profile picture should be less then 2 MB");

        return;
      }
      setNewProfilePicture(file);

      // Create a preview URL for the selected image
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);
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
      const cookies = parseCookies();
      const accessToken = cookies.accessToken;

      // if (!accessToken) {
      //   throw new Error("User is not authenticated");
      // }

      const decodedToken: any = jwtDecode(accessToken);
      const userId = decodedToken._id;
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
      toast.success("Your profile updated successfully!");
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

  console.log(userInfo.isVerified);

  return (
    <div className="min-h-screen  p-8 flex flex-col items-center">
      {/* Profile Section */}
      <div className="w-full max-w-3xl">
        <div className="flex flex-col items-center">
          <div className="relative">
            <img
              src={userInfo?.profilePicture || "/path/to/default-profile.jpg"} // Fallback image
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-blue-500 object-cover"
            />
          </div>

          {/* Display blue tick if user is verified */}
          {/* {userInfo?.isVerified && (
            <FaCheckCircle
              size={24}
              className="text-blue-500 ml-24 -mt-4"
              title="Verified user"
            />
          )} */}

          <h1 className="text-3xl font-bold mt-4 ">
            {userInfo?.name || "Username"}
          </h1>
          <p className="text-gray-400 dark:text-gray-300 mt-1">
            Joined on {formattedDate}
          </p>
          <div className="flex gap-x-2">
            <Button
              onClick={() => setIsModalOpen(true)}
              className="border  p-2 hover:bg-green-300 dark:border-red-700 dark:hover:bg-red-600"
            >
              Edit profile
            </Button>

            <Button
              onClick={handleOpenModalforSaved}
              className="px-4 py-2  rounded bg-green-300 "
            >
              Saved Posts
            </Button>
          </div>

          <div>
            {isModalOpenforSaved && (
              <SavesPostsModal onClose={handleCloseModal} />
            )}
          </div>
        </div>

        {/* Edit Profile Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className=" bg-slate-500 rounded-lg max-w-lg w-full shadow-lg transform transition-all duration-300 scale-100 hover:scale-105">
              <div className="p-6">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4 text-center">
                  Edit Profile
                </h2>
                <div className="flex flex-col items-center mb-4">
                  <label className="block mb-2 text-gray-600 dark:text-gray-300 text-lg">
                    New Profile Picture:
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="mb-4 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 w-2/3 bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
                  />
                  {/* Image Preview */}
                  {previewImage && (
                    <img
                      src={previewImage}
                      alt="Profile Preview"
                      className="w-20 h-20 rounded-full object-cover mb-4"
                    />
                  )}
                </div>
                <label className="block mb-2 text-gray-600 dark:text-gray-300 text-lg">
                  New Name:
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Enter new name"
                  className="w-full mb-4 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring focus:ring-blue-500 dark:focus:ring-blue-600 dark:bg-gray-700 text-black dark:text-white"
                />
                <div className="flex justify-between mt-4">
                  <button
                    onClick={handleProfileUpdate}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition duration-150"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700 text-gray-800 dark:text-white px-6 py-3 rounded-lg font-semibold transition duration-150"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Section */}
        <div className="flex justify-around mt-8 text-center text-xl">
          <div>
            <p className="font-semibold text-gray-800 dark:text-white">
              {followers}
            </p>
            <p className="text-gray-400 dark:text-gray-300">Followers</p>
          </div>
          <div>
            <p className="font-semibold text-gray-800 dark:text-white">
              {following}
            </p>
            <p className="text-gray-400 dark:text-gray-300">Following</p>
          </div>
          <div>
            <p className="font-semibold text-gray-800 dark:text-white">
              {totalPosts}
            </p>
            <p className="text-gray-400 dark:text-gray-300">Posts</p>
          </div>
        </div>

        {/* Posts Section */}
        <div className="mt-12 w-full">
          <h2 className="text-2xl font-bold mb-4 text-center ">Your Posts</h2>
          {posts.length > 0 ? (
            <div>
              {posts.map((post) => (
                <div key={post._id} className="border p-6 mb-6 rounded-lg">
                  <h3 className="text-xl font-semibold ">{post.title}</h3>
                  <p className="text-gray-300 mt-2">{post.content}</p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Categories: {post.categories.join(", ")}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
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
                  <VoteButton postId={post._id}></VoteButton>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center mt-16">
              <p className="text-gray-500 dark:text-gray-400">
                You have not written anything yet.
              </p>
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
