/* eslint-disable no-console */
/* eslint-disable padding-line-between-statements */
/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable prettier/prettier */
"use client"

import { useEffect, useState } from "react";
import Nexios from "axios";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/src/components/ui/dialog";

type Author = {
  _id: string;
  name: string;
  profilePicture?: string;
};

type Post = {
  _id: string;
  images: string[];
  author?: Author;
  createdAt?: string;
};

type PostsResponse = {
  data: {
    posts: Post[];
  };
  message: string;
  success: boolean;
};

type GalleryItem = {
  url: string;
  authorName: string;
  authorProfilePicture?: string;
  createdAt: string;
};

const page = () => {
    const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
    const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

    useEffect(() => {
        const fetchImages = async () => {
          try {
            // Fetch posts, typing response as `PostsResponse`
            const response = await Nexios.get<PostsResponse>("/api/proxy/posts");
      
            // Extract all image URLs from posts and associate them with post metadata
            const items: GalleryItem[] = (response.data.data.posts || [])
              .flatMap((post) =>
                (post.images || []).map((url) => ({
                  url,
                  authorName: post.author?.name || "Anonymous User",
                  authorProfilePicture: post.author?.profilePicture,
                  createdAt: post.createdAt ? new Date(post.createdAt).toLocaleDateString("en-US", {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : "Unknown Date",
                }))
              )
              .filter((item) => !!item.url);
      
            setGalleryItems(items);
          } catch (error) {
            console.error("Error fetching images:", error);
          }
        };
      
        fetchImages();
      }, []);

    return (
        <div className="container mx-auto py-8 px-4 sm:px-6">
        <h2 className="text-3xl font-bold mb-8 text-center text-zinc-800 dark:text-zinc-100">Gardening Image Gallery</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {galleryItems.length > 0 ? (
            galleryItems.map((item, index) => (
              <div 
                key={index} 
                className="group relative cursor-pointer overflow-hidden rounded-xl shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                onClick={() => setSelectedItem(item)}
              >
                {/* Image Aspect ratio container */}
                <div className="aspect-square w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                  <img 
                    alt={`Gardening Image by ${item.authorName}`} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    src={item.url} 
                  />
                </div>
                
                {/* Hover overlay with quick details */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <p className="text-white text-xs font-semibold truncate">by {item.authorName}</p>
                  <p className="text-zinc-300 text-[10px] mt-0.5">{item.createdAt}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-zinc-500 dark:text-zinc-400 py-12">No images available</p>
          )}
        </div>

        {/* Lightbox Modal */}
        <Dialog open={!!selectedItem} onOpenChange={(open) => { if (!open) setSelectedItem(null); }}>
          <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black/95 border-none text-white flex flex-col md:flex-row h-[80vh] md:h-[70vh] w-[95vw]">
            <DialogTitle className="sr-only">Image Gallery Lightbox</DialogTitle>
            {selectedItem && (
              <>
                {/* Responsive Image Container */}
                <div className="relative flex-1 bg-black flex items-center justify-center h-[60%] md:h-full p-4">
                  <img
                    alt={`Gardening Gallery - by ${selectedItem.authorName}`}
                    className="max-h-full max-w-full object-contain"
                    src={selectedItem.url}
                  />
                </div>

                {/* Metadata Sidebar Panel */}
                <div className="w-full md:w-80 bg-zinc-900 p-6 flex flex-col justify-between h-[40%] md:h-full border-t md:border-t-0 md:border-l border-zinc-800">
                  <div>
                    <h3 className="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-4">Post Info</h3>
                    
                    {/* Author Section */}
                    <div className="flex items-center gap-3 mb-6">
                      {selectedItem.authorProfilePicture ? (
                        <img
                          alt={selectedItem.authorName}
                          className="w-10 h-10 rounded-full object-cover border border-zinc-700"
                          src={selectedItem.authorProfilePicture}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 font-bold">
                          {selectedItem.authorName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-zinc-100 text-sm truncate max-w-[180px]">{selectedItem.authorName}</p>
                        <p className="text-xs text-zinc-500">Author</p>
                      </div>
                    </div>

                    {/* Metadata Section */}
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-zinc-500 font-medium">Date Posted</p>
                        <p className="text-sm text-zinc-300 mt-1">{selectedItem.createdAt}</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions Section */}
                  <div className="pt-4 border-t border-zinc-800 flex justify-end">
                    <button
                      className="px-4 py-2 bg-zinc-800 hover:bg-zinc-750 text-zinc-200 hover:text-white rounded text-sm transition-colors border border-zinc-700"
                      onClick={() => setSelectedItem(null)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    );
};

export default page;