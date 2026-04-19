/* eslint-disable no-console */
/* eslint-disable padding-line-between-statements */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable prettier/prettier */
"use client";
import dynamic from "next/dynamic";
import { parseCookies } from "nookies";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState, useRef } from "react";
import "react-quill/dist/quill.snow.css";
import { ToastContainer, toast } from "react-toastify";
import { Button } from "@/src/components/ui/button";
import { Loader2 } from "lucide-react";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const categoriesOptions: string[] = [
  "Vegetables",
  "Flowers",
  "Fruits",
  "Indoor Plants",
  "Hydroponics",
  "Bonsai",
  "Landscaping",
  "Others",
];

const page: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [authorId, setAuthorId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchUserFromToken = () => {
      try {
        const cookies = parseCookies(); 
        const accessToken = cookies.accessToken;

        if (!accessToken) throw new Error("Access token is missing");

        const decodedToken: any = jwtDecode(accessToken);
        setAuthorId(decodedToken._id);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserFromToken();
  }, []);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setImageFile(file);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent newlines in title
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTitle(e.target.value);
    // Auto resize
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
  };

  const handleSubmit = async () => {
    if (!authorId) {
      toast.error("User is not logged in");
      return;
    }

    if (!title.trim() || !content || !category) {
      toast.error("Please fill out all required fields.");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("content", content);
    formData.append("author", authorId);
    formData.append("categories", category);
    if (imageFile) formData.append("itemImages", imageFile);
    formData.append("isPremium", String(isPremium));

    try {
      const response = await fetch("/api/proxy/posts/create", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      // Reset fields upon success
      setTitle("");
      setContent("");
      setCategory("");
      setImageFile(null);
      setIsPremium(false);
      if (fileInputRef.current) fileInputRef.current.value = "";

      toast.success("Post created successfully!"); 
    } catch (error) {
      console.error("Error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      toast.error(`Error: ${errorMessage}`); 
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto md:py-8 px-4 py-4 min-h-screen">
      <div className="bg-background rounded-md shadow-sm border border-border/60 overflow-hidden flex flex-col">
        {/* Cover Image Area */}
        <div className="p-8 pb-4">
          <div className="flex items-center gap-4">
            {!imageFile ? (
              <Button
                variant="outline"
                className="text-muted-foreground border-border/80 hover:bg-muted font-medium"
                onClick={() => fileInputRef.current?.click()}
              >
                Add a cover image
              </Button>
            ) : (
              <div className="flex items-center gap-4 w-full">
                 <div className="relative h-24 w-40 bg-muted rounded-md overflow-hidden flex-shrink-0 border border-border">
                   <img 
                      src={URL.createObjectURL(imageFile)} 
                      alt="Cover Preview" 
                      className="object-cover w-full h-full"
                   />
                 </div>
                 <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-fit"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Change
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-fit text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => {
                        setImageFile(null);
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                    >
                      Remove
                    </Button>
                 </div>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={isLoading}
              className="hidden"
            />
          </div>

          {/* Title Area */}
          <textarea
            placeholder="New post title here..."
            value={title}
            onChange={handleTitleChange}
            onKeyDown={handleTitleKeyDown}
            disabled={isLoading}
            className="w-full text-4xl md:text-5xl font-extrabold bg-transparent border-none outline-none mt-6 resize-none overflow-hidden placeholder:text-muted-foreground/50 focus:ring-0 leading-tight"
            rows={1}
          />
          
          {/* Category selection */}
          <div className="mt-6 flex items-center">
            <select
                id="category"
                value={category}
                onChange={handleCategoryChange}
                disabled={isLoading}
                className="block w-full max-w-xs rounded-md border-0 py-1.5 pl-3 pr-10 text-foreground ring-1 ring-inset ring-border focus:ring-2 focus:ring-emerald-600 sm:text-sm sm:leading-6 bg-transparent"
              >
                <option value="" disabled>Select a category...</option>
                {categoriesOptions.map((categoryOption) => (
                  <option key={categoryOption} value={categoryOption}>
                    {categoryOption}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-grow flex flex-col">
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            readOnly={isLoading}
            className="flex-grow [&_.ql-toolbar]:border-x-0 [&_.ql-toolbar]:border-border [&_.ql-toolbar]:bg-muted/10 [&_.ql-container]:border-none [&_.ql-container]:text-lg [&_.ql-editor]:min-h-[40vh] [&_.ql-editor]:px-8 [&_.ql-editor]:py-6"
            placeholder="Write your post content here..."
          />
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-2">
        <div className="flex items-center gap-4">
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-6"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Publishing...
              </>
            ) : (
              "Publish"
            )}
          </Button>

          <Button
            variant="ghost"
            onClick={() => {
               // optional clear functionality or save draft
               toast.info("Drafts not implemented yet");
            }}
            disabled={isLoading}
            className="text-muted-foreground"
          >
            Save draft
          </Button>
        </div>

        <label className="flex items-center gap-2 cursor-pointer text-sm text-muted-foreground hover:text-foreground">
          <input
            type="checkbox"
            checked={isPremium}
            onChange={(e) => setIsPremium(e.target.checked)}
            disabled={isLoading}
            className="accent-emerald-600 h-4 w-4 rounded border-border"
          />
          Mark as Premium Content
        </label>
      </div>

      <ToastContainer 
        position="bottom-right" 
        autoClose={4000} 
        theme="colored"
      />
    </div>
  );
};

export default page;

