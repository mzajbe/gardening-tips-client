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
import { toast, ToastContainer } from "react-toastify";
import { Loader2, ImageDown } from "lucide-react";
import { compressImage, formatFileSize } from "@/src/lib/compressImage";

import { Button } from "@/src/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";

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
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [compressionInfo, setCompressionInfo] = useState<{ original: number; compressed: number } | null>(null);

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

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.files?.[0] ?? null;
    if (!raw) return;

    setIsCompressing(true);
    setCompressionInfo(null);

    const compressed = await compressImage(raw);

    setCompressionInfo({ original: raw.size, compressed: compressed.size });
    setImageFile(compressed);
    setIsCompressing(false);
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
            {/* ── Compressing spinner ── */}
            {isCompressing ? (
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="h-24 w-40 bg-muted rounded-md border border-border flex items-center justify-center flex-shrink-0">
                  <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="flex items-center gap-1 font-medium text-foreground">
                    <ImageDown className="h-4 w-4 text-emerald-600" />
                    Compressing image...
                  </span>
                  <span className="text-xs">Optimizing size automatically</span>
                </div>
              </div>
            ) : !imageFile ? (
              /* ── No image selected ── */
              <Button
                className="text-muted-foreground border-border/80 hover:bg-muted font-medium"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                Add a cover image
              </Button>
            ) : (
              /* ── Image selected & ready ── */
              <div className="flex items-center gap-4 w-full">
                <div className="relative h-24 w-40 bg-muted rounded-md overflow-hidden flex-shrink-0 border border-border">
                  <img
                    alt="Cover Preview"
                    className="object-cover w-full h-full"
                    src={URL.createObjectURL(imageFile)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  {/* Size badge */}
                  {compressionInfo && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 rounded-full px-2.5 py-0.5">
                      <ImageDown className="h-3 w-3" />
                      {formatFileSize(compressionInfo.original)}
                      {" → "}
                      {formatFileSize(compressionInfo.compressed)}
                    </span>
                  )}
                  <Button
                    className="w-fit"
                    size="sm"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Change
                  </Button>
                  <Button
                    className="w-fit text-destructive hover:text-destructive hover:bg-destructive/10"
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setImageFile(null);
                      setCompressionInfo(null);
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
              accept="image/*"
              className="hidden"
              disabled={isLoading || isCompressing}
              type="file"
              onChange={handleImageChange}
            />
          </div>

          {/* Title Area */}
          <textarea
            className="w-full text-4xl md:text-5xl font-extrabold bg-transparent border-none outline-none mt-6 resize-none overflow-hidden placeholder:text-muted-foreground/50 focus:ring-0 leading-tight"
            disabled={isLoading}
            placeholder="New post title here..."
            rows={1}
            value={title}
            onChange={handleTitleChange}
            onKeyDown={handleTitleKeyDown}
          />
          
          {/* Category selection */}
          <div className="mt-6 flex items-center">
            <Select
              disabled={isLoading}
              value={category}
              onValueChange={setCategory}
            >
              <SelectTrigger className="w-full max-w-xs bg-transparent border-border/60 focus:ring-emerald-600 focus:ring-offset-0">
                <SelectValue placeholder="Select a category..." />
              </SelectTrigger>
              <SelectContent>
                {categoriesOptions.map((categoryOption) => (
                  <SelectItem key={categoryOption} value={categoryOption}>
                    {categoryOption}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-grow flex flex-col">
          <ReactQuill
            className="flex-grow [&_.ql-toolbar]:border-x-0 [&_.ql-toolbar]:border-border [&_.ql-toolbar]:bg-muted/10 [&_.ql-container]:border-none [&_.ql-container]:text-lg [&_.ql-editor]:min-h-[40vh] [&_.ql-editor]:px-8 [&_.ql-editor]:py-6"
            placeholder="Write your post content here..."
            readOnly={isLoading}
            theme="snow"
            value={content}
            onChange={setContent}
          />
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-2">
        <div className="flex items-center gap-4">
          <Button
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-6"
            disabled={isLoading}
            onClick={handleSubmit}
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
            className="text-muted-foreground"
            disabled={isLoading}
            variant="ghost"
            onClick={() => {
               // optional clear functionality or save draft
               toast.info("Drafts not implemented yet");
            }}
          >
            Save draft
          </Button>
        </div>

        <label className="flex items-center gap-2 cursor-pointer text-sm text-muted-foreground hover:text-foreground">
          <input
            checked={isPremium}
            className="accent-emerald-600 h-4 w-4 rounded border-border"
            disabled={isLoading}
            type="checkbox"
            onChange={(e) => setIsPremium(e.target.checked)}
          />
          Mark as Premium Content
        </label>
      </div>

      <ToastContainer 
        autoClose={4000} 
        position="bottom-right" 
        theme="colored"
      />
    </div>
  );
};

export default page;

