/* eslint-disable no-console */
/* eslint-disable padding-line-between-statements */
/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable prettier/prettier */
"use client"

import { useEffect, useState } from "react";
import Nexios from "axios";
// import { Post } from "../../../../types";

type Post = {
    images: never[];
    _id: string;
    imageUrls?: string[];
  };
  
  // Response type to match the full Axios response structure
  type PostsResponse = {
    data: Post[];
    message: string;
    success: boolean;
  };

const page = () => {
    const [images, setImages] = useState<string[]>([]);

    useEffect(() => {
        const fetchImages = async () => {
          try {
            // Fetch posts, typing response as `PostsResponse`
            const response = await Nexios.get<PostsResponse>("https://gardening-server.vercel.app/api/v1/posts");
            // console.log(response);
      
            // Extract all image URLs from posts
            const imageUrls = response.data.data
              .flatMap((post) => post.images || []) // Access `imageUrls` field directly
              .filter(Boolean); // Filter out any empty URLs
      
            setImages(imageUrls);
          } catch (error) {
            console.error("Error fetching images:", error);
          }
        };
      
        fetchImages();
      }, []);

      
      
    return (
        <div className="container mx-auto py-8">
        <h2 className="text-2xl font-semibold mb-6 text-center">Gardening Image Gallery</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.length > 0 ? (
            images.map((url, index) => (
              <div key={index} className="overflow-hidden rounded-lg shadow-lg">
                <img src={url} alt={`Gardening Image ${index + 1}`} className="w-full h-full object-cover transition-transform duration-300 transform hover:scale-105" />
              </div>
            ))
          ) : (
            <p className="col-span-full text-center">No images available</p>
          )}
        </div>
      </div>
    );
};

export default page;