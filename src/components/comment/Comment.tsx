/* eslint-disable padding-line-between-statements */
/* eslint-disable prettier/prettier */
import { useState, useEffect, useCallback } from "react";
// import { FaRegComment } from "react-icons/fa";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { parseCookies } from "nookies";
import { jwtDecode } from "jwt-decode";
import { TComment } from "./types.comment";
import { toast } from "sonner";
import { MessageCircle } from "lucide-react";

const CommentBtn = ({ postId }: { postId: string }) => {
  const [comments, setComments] = useState<TComment[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [updatedCommentContent, setUpdatedCommentContent] =
    useState<string>("");
  const [userId, setUserId] = useState<string>("");

  const fetchUserFromToken = useCallback(() => {
    try {
      const cookies = parseCookies();
      const accessToken = cookies.accessToken;

      if (!accessToken) throw new Error("Access token is missing");

      const decodedToken: any = jwtDecode(accessToken);
      const userId = decodedToken._id;

      if (!userId) throw new Error("User ID not found in token");

      setUserId(userId);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    fetchUserFromToken();
  }, [fetchUserFromToken]);

  const fetchComments = useCallback(async () => {
    const res = await fetch(
      `https://gardening-server.vercel.app/api/v1/comment/${postId}`
    );
    const data = await res.json();
    setComments(data.data);
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleNewComment = async () => {
    if (userId) {
      const commentPayload = { postId, userId, content: newComment };

      const res = await fetch(
        `https://gardening-server.vercel.app/api/v1/comment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(commentPayload),
        }
      );

      if (res.ok) {
        const createdComment = await res.json();
        setComments([...comments, createdComment.data]);
        setNewComment("");
      } else {
        console.log("Error posting comment:", res.statusText);
      }
    } else {
      toast.error("Please login First!");
      console.log("User is not authenticated.");
    }
  };

  const handleEditComment = async (commentId: string) => {
    if (updatedCommentContent.trim() && userId) {
      const editPayload = { content: updatedCommentContent, userId };

      const res = await fetch(
        `https://gardening-server.vercel.app/api/v1/comment/${commentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editPayload),
        }
      );

      if (res.ok) {
        setComments(
          comments.map((comment) =>
            comment._id === commentId
              ? { ...comment, content: updatedCommentContent }
              : comment
          )
        );
        setEditingCommentId(null);
      } else {
        console.log("Error editing comment:", res.statusText);
      }
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    const deletePayload = { userId };

    const res = await fetch(
      `https://gardening-server.vercel.app/api/v1/comment/${commentId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(deletePayload),
      }
    );

    if (res.ok) {
      setComments(comments.filter((comment) => comment._id !== commentId));
    } else {
      console.log("Error deleting comment:", res.statusText);
    }
  };

  return (
    <div className="">
      <div className="flex items-center space-x-2">
        {/* <FaRegComment /> */}

        <MessageCircle
          className="text-gray-500 hover:text-blue-500 cursor-pointer"
          size={24}
          onClick={() => setIsModalOpen(true)}
        />
        <span className="text-gray-600 text-sm">{comments.length}</span>
      </div>

      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsModalOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 mb-4"
                  >
                    Comments
                  </Dialog.Title>

                  <div className="max-h-60 overflow-y-auto mb-4">
                    {comments.length > 0 ? (
                      comments.map((comment) => (
                        <div
                          key={comment._id}
                          className="mb-4 p-4 border rounded-md shadow-sm"
                        >
                          <p className="text-sm text-gray-600">
                            <span className="font-semibold">
                              {comment.userName}
                            </span>{" "}
                            - {new Date(comment.createdAt).toLocaleString()}
                          </p>

                          {editingCommentId === comment._id ? (
                            <div>
                              <textarea
                                className="w-full border rounded-md p-2 mt-2"
                                value={updatedCommentContent}
                                onChange={(e) =>
                                  setUpdatedCommentContent(e.target.value)
                                }
                              />
                              <div className="mt-2 flex space-x-2">
                                <button
                                  className="text-blue-500 hover:underline"
                                  onClick={() => handleEditComment(comment._id)}
                                >
                                  Save
                                </button>
                                <button
                                  className="text-gray-500 hover:underline"
                                  onClick={() => setEditingCommentId(null)}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <p className="mt-2 text-gray-800">
                              {comment.content}
                            </p>
                          )}

                          {comment.userId === userId && (
                            <div className="mt-2 flex space-x-4">
                              <button
                                className="text-blue-500 hover:underline"
                                onClick={() => {
                                  setEditingCommentId(comment._id);
                                  setUpdatedCommentContent(comment.content);
                                }}
                              >
                                Edit
                              </button>
                              <button
                                className="text-red-500 hover:underline"
                                onClick={() => handleDeleteComment(comment._id)}
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">
                        No comments yet. Be the first to comment!
                      </p>
                    )}
                  </div>

                  <div className="mt-4">
                    <textarea
                      className="w-full border rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Write your comment here..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    />
                  </div>

                  <div className="mt-4 flex justify-end space-x-2">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
                      onClick={handleNewComment}
                    >
                      Post Comment
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default CommentBtn;
