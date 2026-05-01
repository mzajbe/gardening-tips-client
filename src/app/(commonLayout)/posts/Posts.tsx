/* eslint-disable unused-imports/no-unused-imports */
/* eslint-disable no-console */
/* eslint-disable react/jsx-sort-props */
/* eslint-disable react/self-closing-comp */
/* eslint-disable prettier/prettier */
/* eslint-disable import/order */
/* eslint-disable padding-line-between-statements */
/* eslint-disable prettier/prettier */
"use client";

import { useState, useEffect, useRef } from "react";
import nexiosInstance from "@/src/config/nexios.config";
import FollowButton from "@/src/components/followButton/FollowButton";
import Link from "next/link";
import VoteButton from "../vote/VoteButton";
import CommentBtn from "@/src/components/comment/Comment";
import { parseCookies } from "nookies";
import { jwtDecode } from "jwt-decode";
import FavouriteBtn from "@/src/components/favourite/FavouriteBtn";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Quets from "@/src/components/quets/Quets";
import { FaShare } from "react-icons/fa6";
import { MoreVertical, Download, Edit, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";

const Posts = ({ selectedCategory = "All" }: { selectedCategory?: string }) => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [userId, setUserId] = useState<string>("");
  const [copySuccess, setCopySuccess] = useState<string>("");

  const postspdf = useRef<HTMLDivElement>(null);

  const downloadGardenAsPDF = async () => {
    if (postspdf.current) {
      const canvas = await html2canvas(postspdf.current, {
        scale: 2,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("posts.pdf");
    } else {
      console.error("No content to download, postspdf is null.");
    }
  };
  const copyToClipboard = (postId: string) => {
    const url = `${window.location.origin}/posts/${postId}`; // Modify this based on your URL structure
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setCopySuccess("Link copied to clipboard!");
        setTimeout(() => setCopySuccess(""), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

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

  // console.log(userId);

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

  // console.log(posts);

  // console.log(postspdf.current);

  return (
    <div className="flex justify-center p-0 sm:p-6 dark:bg-black">
      <div className="w-full max-w-3xl shadow-lg rounded-lg p-2 sm:p-6">
        <div ref={postspdf}>
          {(() => {
            const filteredPosts = selectedCategory === "All"
              ? posts
              : posts.filter((post) => post.categories?.includes(selectedCategory));
            return filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <div
                key={post._id}
                className="relative p-3 sm:p-4 mb-4 sm:mb-6 shadow-md rounded-lg border border-gray-300 dark:border-gray-700 transition-transform duration-300 hover:shadow-xl"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <img
                      src={post.author?.profilePicture}
                      alt="user-photo"
                      className="w-10 h-10 rounded-full border border-gray-300 mr-4"
                    />

                    <span className="font-semibold ">
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
                      className="w-full p-2 mb-2 border rounded "
                      placeholder="Edit title"
                    />
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full p-2 mb-2 border rounded "
                      placeholder="Edit content"
                    />
                    <button
                      onClick={() => handleEditPost(post._id)}
                      className="bg-blue-500  px-4 py-2 rounded mr-2"
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
                    <h2 className="text-xl font-bold mb-2">
                      {post.title}
                    </h2>
                    <div
                      className="mt-2 mb-3"
                      dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                  </>
                )}

                {post.images && post.images.length > 0 && post.images[0] && (
                  <img
                    src={post.images[0]}
                    alt={post.title}
                    className="w-full h-48 sm:h-64 object-cover rounded-lg mb-3"
                  />
                )}

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-3 sm:mt-4 gap-1">
                  <span className="text-xs sm:text-sm">
                    Category: {post.categories.join(", ")}
                  </span>
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    {new Date(post.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <VoteButton postId={post._id as string} />
                    <CommentBtn postId={post._id as string} />
                  </div>
                  
                  <div className="flex items-center space-x-2 relative z-20">
                    {copySuccess && (
                      <div className="text-green-600 font-semibold text-center text-sm mr-2">
                        {copySuccess}
                      </div>
                    )}
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                          <MoreVertical className="w-5 h-5 text-white" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem asChild className="cursor-pointer">
                          <div className="w-full flex items-center px-2 py-1">
                            <FavouriteBtn postId={post._id}></FavouriteBtn>
                          </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={downloadGardenAsPDF} className="cursor-pointer">
                          <Download className="w-4 h-4 mr-2" />
                          Download as PDF
                        </DropdownMenuItem>
                        
                        {userId === post.author._id && (
                          <>
                            <DropdownMenuItem 
                              onClick={() => {
                                setEditingPostId(post._id);
                                setEditTitle(post.title);
                                setEditContent(post.content);
                              }}
                              className="cursor-pointer"
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit Post
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeletePost(post._id)}
                              className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/30"
                            >
                              <Trash className="w-4 h-4 mr-2" />
                              Delete Post
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                {/* <Quets></Quets> */}
              </div>
            )) ) : (
            <p className="text-center text-gray-500">No posts found</p>
          );
          })()}
        </div>
      </div>
    </div>
  );
};

export default Posts;
