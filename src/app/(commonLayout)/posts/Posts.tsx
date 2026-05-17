/* eslint-disable unused-imports/no-unused-imports */
/* eslint-disable no-console */
/* eslint-disable react/jsx-sort-props */
/* eslint-disable react/self-closing-comp */
/* eslint-disable prettier/prettier */
/* eslint-disable import/order */
/* eslint-disable padding-line-between-statements */
/* eslint-disable prettier/prettier */
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
import { MoreVertical, Download, Edit, Trash, Loader2, Leaf } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";

const LIMIT = 8;

const Posts = ({
  initialPosts = [],
  initialTotal = 0,
  selectedCategory = "All",
}: {
  initialPosts?: any[];
  initialTotal?: number;
  selectedCategory?: string;
}) => {
  const [posts, setPosts] = useState<any[]>(initialPosts);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [userId, setUserId] = useState<string>("");
  const [copySuccess, setCopySuccess] = useState<string>("");

  const postspdf = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  // Track whether we're currently loading to avoid double-fires
  const loadingRef = useRef(false);

  const hasMore = posts.length < total;

  // ── Decode user from cookie ──────────────────────────────────────────────
  const cookies = parseCookies();
  const accessToken = cookies.accessToken;

  useEffect(() => {
    try {
      if (!accessToken) return;
      const decoded: any = jwtDecode(accessToken);
      if (decoded._id) setUserId(decoded._id);
    } catch (e) {
      console.log(e);
    }
  }, []);

  // ── Reset when initialPosts or category changes (SSR re-fetch) ──────────
  useEffect(() => {
    setPosts(initialPosts);
    setTotal(initialTotal);
    setPage(1);
  }, [initialPosts, initialTotal]);

  // ── Load next page from proxy ────────────────────────────────────────────
  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;
    loadingRef.current = true;
    setIsFetchingMore(true);

    try {
      const nextPage = page + 1;
      const res = await fetch(`/api/proxy/posts?page=${nextPage}&limit=${LIMIT}`);
      const data = await res.json();
      const newPosts: any[] = data?.data?.posts || [];
      const newTotal: number = data?.data?.total ?? total;

      setPosts((prev) => [...prev, ...newPosts]);
      setTotal(newTotal);
      setPage(nextPage);
    } catch (err) {
      console.error("Infinite scroll fetch error:", err);
    } finally {
      setIsFetchingMore(false);
      loadingRef.current = false;
    }
  }, [page, hasMore, total]);

  // ── IntersectionObserver on the sentinel div ─────────────────────────────
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "200px" } // start loading 200 px before user hits bottom
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  // ── PDF download ─────────────────────────────────────────────────────────
  const downloadGardenAsPDF = async () => {
    if (postspdf.current) {
      const canvas = await html2canvas(postspdf.current, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("posts.pdf");
    }
  };

  // ── Share / copy link ────────────────────────────────────────────────────
  const copyToClipboard = (postId: string) => {
    const url = `${window.location.origin}/posts/${postId}`;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setCopySuccess("Link copied to clipboard!");
        setTimeout(() => setCopySuccess(""), 2000);
      })
      .catch((err) => console.error("Failed to copy:", err));
  };

  // ── Edit ─────────────────────────────────────────────────────────────────
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

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDeletePost = async (postId: string) => {
    try {
      const response = await nexiosInstance.delete(`/posts/delete/${postId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { userId },
      });
      if (response.status === 200) {
        setPosts(posts.filter((post) => post._id !== postId));
        setTotal((t) => t - 1);
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  // ── Filter by category (client-side) ────────────────────────────────────
  const filteredPosts =
    selectedCategory === "All"
      ? posts
      : posts.filter((post) => post.categories?.includes(selectedCategory));

  return (
    <div className="flex justify-center p-0 sm:p-6 dark:bg-black">
      <div className="w-full max-w-3xl shadow-lg rounded-lg p-2 sm:p-6">
        <div ref={postspdf}>
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <div
                key={post._id}
                className="relative p-3 sm:p-4 mb-4 sm:mb-6 shadow-md rounded-lg border border-gray-300 dark:border-gray-700 transition-transform duration-300 hover:shadow-xl"
              >
                {/* ── Author row ── */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <img
                      src={post.author?.profilePicture}
                      alt="user-photo"
                      className="w-10 h-10 rounded-full border border-gray-300 mr-4"
                    />
                    <span className="font-semibold">
                      <Link href={`/user/${post.author._id}`}>
                        {post.author.name}
                      </Link>
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <FollowButton followingId={post.author._id as string} />
                  </div>
                </div>

                {/* ── Content / edit form ── */}
                {editingPostId === post._id ? (
                  <div>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full p-2 mb-2 border rounded"
                      placeholder="Edit title"
                    />
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full p-2 mb-2 border rounded"
                      placeholder="Edit content"
                    />
                    <button
                      onClick={() => handleEditPost(post._id)}
                      className="bg-blue-500 px-4 py-2 rounded mr-2"
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
                    <h2 className="text-xl font-bold mb-2">{post.title}</h2>
                    <div
                      className="mt-2 mb-3"
                      dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                  </>
                )}

                {/* ── Cover image ── */}
                {post.images && post.images.length > 0 && post.images[0] && (
                  <img
                    src={post.images[0]}
                    alt={post.title}
                    className="w-full h-48 sm:h-64 object-cover rounded-lg mb-3"
                  />
                )}

                {/* ── Meta row ── */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-3 sm:mt-4 gap-1">
                  <span className="text-xs sm:text-sm">
                    Category: {post.categories.join(", ")}
                  </span>
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    {new Date(post.createdAt).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </span>
                </div>

                {/* ── Action bar ── */}
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
                        <DropdownMenuItem
                          onClick={downloadGardenAsPDF}
                          className="cursor-pointer"
                        >
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
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No posts found</p>
          )}
        </div>

        {/* ── Infinite scroll sentinel ─────────────────────────────────── */}
        <div ref={sentinelRef} className="h-4" />

        {/* Loading spinner */}
        {isFetchingMore && (
          <div className="flex justify-center items-center py-6 gap-2 text-muted-foreground text-sm">
            <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
            <span>Loading more posts...</span>
          </div>
        )}

        {/* All caught up */}
        {!hasMore && posts.length > 0 && !isFetchingMore && (
          <div className="flex justify-center items-center py-8 gap-2 text-muted-foreground text-sm">
            <Leaf className="h-4 w-4 text-emerald-500" />
            <span>You&apos;re all caught up!</span>
            <Leaf className="h-4 w-4 text-emerald-500" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Posts;
