/* eslint-disable padding-line-between-statements */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable prettier/prettier */
"use client";
import dynamic from "next/dynamic";
import { parseCookies } from "nookies";
// import jwt_decode from "jwt-decode";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import "react-quill/dist/quill.snow.css";
import { ToastContainer, toast } from "react-toastify";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const categoriesOptions: string[] = [
  "Vegetables",
  "Flowers",
  "Landscaping",
  "Others",
];

const page: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [authorId, setAuthorId] = useState<string>("");

  // Extract user ID from the JWT token
  useEffect(() => {
    const fetchUserFromToken = () => {
      try {
        const cookies = parseCookies(); // Using nookies to parse cookies
        const accessToken = cookies.accessToken;

        if (!accessToken) throw new Error("Access token is missing");

        // Decode the token to get the user ID
        const decodedToken: any = jwtDecode(accessToken);
        console.log(decodedToken._id);

        const userId = decodedToken._id;
        console.log(userId);

        setAuthorId(userId);
      } catch (error) {
        console.log(error);
        
      }
    };

    fetchUserFromToken(); // Extract user when the page loads
  }, []);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value); // Set the selected category
  };

  const handleSubmit = async () => {
    if (!authorId) {
      toast.error("User is not logged in");
      return;
    }

    const post = {
      title: title,
      content: content,
      author: authorId, // Use the current logged-in user ID from the token
      category: category,
      images: [imageUrl],
      isPremium: isPremium,
    };

    try {
      const response = await fetch(
        "https://gardening-server.vercel.app/api/v1/posts/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(post),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      const data = await response.json();
      console.log("Post created:", data);

      // Reset fields
      setTitle("");
      setContent("");
      setCategory("");
      setImageUrl("");
      setIsPremium(false);

      toast.success("Post created successfully!"); // Show success toast
    } catch (error) {
      console.error("Error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      toast.error(`Error: ${errorMessage}`); // Show error toast
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create Post</h1>

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full mb-4 px-2 py-2 border rounded"
      />

      <ReactQuill
        theme="snow"
        value={content}
        onChange={setContent}
        className="mb-4"
      />

      <select
        value={category}
        onChange={handleCategoryChange}
        className="w-full mb-4 px-2 py-2 border rounded"
      >
        <option value="" disabled>
          Select a category
        </option>{" "}
        {/* Placeholder option */}
        {categoriesOptions.map((categoryOption) => (
          <option key={categoryOption} value={categoryOption}>
            {categoryOption}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Image URL"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        className="w-full mb-4 px-2 py-2 border rounded"
      />

      <label className="flex items-center mb-4">
        <input
          type="checkbox"
          checked={isPremium}
          onChange={(e) => setIsPremium(e.target.checked)}
          className="mr-2"
        />
        Mark as Premium
      </label>

      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Create Post
      </button>

      <ToastContainer />
    </div>
  );
};

export default page;
