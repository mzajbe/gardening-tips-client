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

import { useState } from "react";
import { parseCookies } from "nookies";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import { Edit } from "lucide-react";

import { Post } from "../../../../types";
import VoteButton from "../vote/VoteButton";

import SavesPostsModal from "@/src/components/modal/SavesPostsModal";
import { Button } from "@/src/components/ui/button";
import nexiosInstance from "@/src/config/nexios.config";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";

interface ProfileClientProps {
  initialUserInfo: any;
  initialFollowers: number;
  initialFollowing: number;
  initialPosts: Post[];
}

const ProfileClient = ({
  initialUserInfo,
  initialFollowers,
  initialFollowing,
  initialPosts,
}: ProfileClientProps) => {
  const [userInfo, setUserInfo] = useState<any>(initialUserInfo);
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenforSaved, setIsModalOpenforSaved] = useState(false);
  const [newProfilePicture, setNewProfilePicture] = useState<File | null>(null);
  const [newName, setNewName] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const handleOpenModalforSaved = () => setIsModalOpenforSaved(true);
  const handleCloseModal = () => setIsModalOpenforSaved(false);

  const handleEditPost = async (postId: string) => {
    try {
      const cookies = parseCookies();
      const accessToken = cookies.accessToken;
      const decodedToken: any = jwtDecode(accessToken);
      const userId = decodedToken._id;

      const response = await nexiosInstance.put(`/posts/update/${postId}`, {
        userId,
        content: editContent,
        title: editTitle,
      });

      if (response.status === 200) {
        setPosts(
          posts.map((post) =>
            post._id === postId
              ? { ...post, title: editTitle, content: editContent }
              : post,
          ),
        );
        setEditingPostId(null);
        toast.success("Post updated successfully!");
      }
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error("Failed to update post");
    }
  };

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

      const decodedToken: any = jwtDecode(accessToken);
      const userId = decodedToken._id;

      const response = await fetch(`/api/proxy/users/${userId}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${accessToken}` },
        body: formData,
      });

      if (response.ok) {
        const updatedData = await response.json();

        // Optimistically update the UI
        setUserInfo({
          ...userInfo,
          name: newName || userInfo.name,
          profilePicture: previewImage || userInfo.profilePicture,
        });

        setIsModalOpen(false);
        toast.success("Your profile updated successfully!");
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  const totalPosts = posts.length;
  const formattedDate = userInfo?.createdAt
    ? new Date(userInfo.createdAt).toLocaleDateString()
    : "";

  return (
    <div className="min-h-screen  p-8 flex flex-col items-center">
      {/* Profile Section */}
      <div className="w-full max-w-3xl">
        <div className="flex flex-col items-center">
          <div className="relative">
            <img
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-blue-500 object-cover"
              src={userInfo?.profilePicture || "/path/to/default-profile.jpg"} // Fallback image
            />
          </div>

          <h1 className="text-3xl font-bold mt-4 ">
            {userInfo?.name || "Username"}
          </h1>
          <p className="text-gray-400 dark:text-gray-300 mt-1">
            Joined on {formattedDate}
          </p>
          <div className="flex gap-x-2 mt-4">
            <Button
              className="border p-2 hover:bg-green-300 dark:border-red-700 dark:hover:bg-red-600"
              onClick={() => setIsModalOpen(true)}
            >
              Edit profile
            </Button>

            <Button
              className="px-4 py-2 rounded bg-green-300"
              onClick={handleOpenModalforSaved}
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
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center dark:text-white">
                Edit Profile
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center mb-4 mt-4">
              <label className="block mb-2 text-sm font-medium">
                New Profile Picture:
              </label>
              <input
                accept="image/*"
                className="mb-4 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 w-full bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
                type="file"
                onChange={handleFileChange}
              />
              {/* Image Preview */}
              {previewImage && (
                <img
                  alt="Profile Preview"
                  className="w-20 h-20 rounded-full object-cover mb-4"
                  src={previewImage}
                />
              )}
            </div>
            <label className="block mb-2 text-sm font-medium">New Name:</label>
            <input
              className="w-full mb-4 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:ring-blue-500"
              placeholder="Enter new name"
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <div className="flex justify-end gap-3 mt-4">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleProfileUpdate}
              >
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Stats Section */}
        <div className="flex justify-around mt-8 text-center text-xl">
          <div>
            <p className="font-semibold ">{initialFollowers}</p>
            <p className="">Followers</p>
          </div>
          <div>
            <p className="font-semibold ">{initialFollowing}</p>
            <p className="">Following</p>
          </div>
          <div>
            <p className="font-semibold ">{totalPosts}</p>
            <p className="">Posts</p>
          </div>
        </div>

        {/* Posts Section */}
        <div className="mt-12 w-full">
          <h2 className="text-2xl font-bold mb-4 text-center ">Your Posts</h2>
          {posts.length > 0 ? (
            <div>
              {posts.map((post) => (
                <div
                  key={post._id}
                  className="border p-6 mb-6 rounded-lg relative"
                >
                  {editingPostId === post._id ? (
                    <div>
                      <input
                        className="w-full p-2 mb-2 border rounded dark:bg-gray-800"
                        placeholder="Edit title"
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                      />
                      <textarea
                        className="w-full p-2 mb-2 border rounded dark:bg-gray-800"
                        placeholder="Edit content"
                        rows={4}
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                      />
                      <div className="flex gap-2">
                        <Button
                          className="bg-blue-500 hover:bg-blue-600 text-white"
                          onClick={() => handleEditPost(post._id)}
                        >
                          Save
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() => setEditingPostId(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-start">
                        <h3 className="text-xl font-semibold ">{post.title}</h3>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            setEditingPostId(post._id);
                            setEditTitle(post.title);
                            setEditContent(post.content);
                          }}
                        >
                          <Edit className="w-5 h-5 text-gray-500 hover:text-blue-500" />
                        </Button>
                      </div>
                      <div
                        dangerouslySetInnerHTML={{ __html: post.content }}
                        className=" dark:text-gray-300 mt-2"
                      />
                    </>
                  )}
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
                      alt={post.title}
                      className="w-full h-48 mt-4 object-cover rounded-lg"
                      src={post.images[0]}
                    />
                  )}
                  <VoteButton postId={post._id} />
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

export default ProfileClient;
