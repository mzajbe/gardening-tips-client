/* eslint-disable padding-line-between-statements */
/* eslint-disable prettier/prettier */

import nexiosInstance from "@/src/config/nexios.config";
import VoteButton from "../vote/page";

import FollowButton from "@/src/components/followButton/FollowButton";
import Link from "next/link";

// "use client";

const Posts = async () => {
  const { data }: any = await nexiosInstance.get("/posts", {
    cache: "no-store",
  });


  return (
    <div className="flex justify-center p-6 border bg-gray-100 dark:bg-black">  
      <div className="w-full max-w-3xl bg-white dark:bg-black shadow-lg rounded-lg p-6">  
        {data?.data?.length > 0 ? (  
          data?.data?.map((post: any) => (  
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
                    
                    {post.author.name}s profile
                    </Link>
                     
                  </span> 
                  
                   
                </div>  
                <div className="absolute top-4 right-4">  
                  <FollowButton followingId={post.author._id} />  
                </div>  
              </div>  

              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-200 mb-2">  
                {post.title}  
              </h2>  

              <div  
                className="mt-2 text-gray-700 dark:text-gray-300 mb-3"  
                dangerouslySetInnerHTML={{ __html: post.content }}  
              />  

              {/* Image section */}  
              {post.images?.length > 0 && (  
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

              <div className="mt-4 ">  
                <VoteButton postId={post._id} />  
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
