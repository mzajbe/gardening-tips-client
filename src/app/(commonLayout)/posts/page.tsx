/* eslint-disable react/self-closing-comp */
/* eslint-disable prettier/prettier */
/* eslint-disable import/order */
/* eslint-disable padding-line-between-statements */
/* eslint-disable prettier/prettier */
"use client";

import { useState, useEffect } from "react";
import nexiosInstance from "@/src/config/nexios.config";
import FollowButton from "@/src/components/followButton/FollowButton";
import Link from "next/link";
import VoteButton from "../vote/VoteButton";
import CommentBtn from "@/src/components/comment/Comment";
import { parseCookies } from "nookies";
import { jwtDecode } from "jwt-decode";

const Posts = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [userId, setUserId] = useState<string>("");

  const cookies = parseCookies();
  const accessToken = cookies.accessToken;

  useEffect(() => {
    const fetchUserFromToken = () => {
      try {
        if (!accessToken) throw new Error("Access token is missing");
        const decodedToken: any = jwtDecode(accessToken);
        const userId = decodedToken._id;
        if (!userId) throw new Error("User ID not found in token");
        setUserId(userId);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUserFromToken();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data }: any = await nexiosInstance.get("/posts", {
          cache: "no-store",
        });
        setPosts(data?.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  console.log(userId);

  const handleEditPost = async (postId: string) => {
    try {
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
              : post
          )
        );
        setEditingPostId(null);
      }
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      const response = await nexiosInstance.delete(`/posts/delete/${postId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          userId, // Send the userId as a query parameter
        },
      });

      if (response.status === 200) {
        setPosts(posts.filter((post) => post._id !== postId));
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  if (loading) {
    return <p>Loading posts...</p>;
  }

  console.log(posts);
  

  return (
    <div className="flex justify-center p-6 border bg-gray-100 dark:bg-black">
      <div className="w-full max-w-3xl bg-white dark:bg-black shadow-lg rounded-lg p-6">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post._id}
              className="relative p-4 mb-6 bg-gray-50 shadow-md rounded-lg border border-gray-300 dark:bg-black transition-transform duration-300 hover:shadow-xl"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <img
                    src={post.author.profilePicture}
                    alt="user-photo"
                    className="w-10 h-10 rounded-full border border-gray-300 mr-4"
                  />
                  <span className="font-semibold text-gray-800 dark:text-white">
                    <Link href={`/user/${post.author._id}`}>
                      {post.author.name}
                    </Link>
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <FollowButton followingId={post.author._id as string} />
                </div>
              </div>

              {editingPostId === post._id ? (
                <div>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full p-2 mb-2 border rounded"
                  />
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full p-2 mb-2 border rounded"
                  />
                  <button
                    onClick={() => handleEditPost(post._id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingPostId(null)}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-200 mb-2">
                    {post.title}
                  </h2>
                  <div
                    className="mt-2 text-gray-700 dark:text-gray-300 mb-3"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                </>
              )}

              {post.images && post.images.length > 0 && post.images[0] && (
                <img
                  src={post.images[0]}
                  alt={post.title}
                  className="w-full h-64 object-cover rounded-lg mb-3"
                />
              )}

              <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Category: {post.categories.join(", ")}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="mt-4 flex items-center space-x-2">
                <VoteButton postId={post._id as string} />

                <CommentBtn postId={post._id as string} />
                {userId === post.author._id && (
                  <>
                    <button
                      onClick={() => {
                        setEditingPostId(post._id);
                        setEditTitle(post.title);
                        setEditContent(post.content);
                      }}
                      className="bg-yellow-500 text-white px-4 py-2 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeletePost(post._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No posts found</p>
        )}
      </div>
    </div>
  );
};

export default Posts;
