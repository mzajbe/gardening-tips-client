/* eslint-disable padding-line-between-statements */
/* eslint-disable prettier/prettier */

import nexiosInstance from "@/src/config/nexios.config";
import VoteButton from "../vote/page";
// import Vote from "../vote/page";

// "use client";

const Posts = async () => {
    

    const {data}:any = await nexiosInstance.get("/posts",{
      cache:"no-store"
    })

    


    
  return (
    <div>  
      <div className="w-full max-w-3xl flex flex-col gap-4 ">  
        {data?.data?.length > 0 ? (  
          data?.data?.map((post: any) => (  
            <div  
              key={post._id}  
              className="p-4 shadow-md rounded-lg border border-gray-500"  
            >  
              <div className="flex items-center justify-between">  
                <h2 className="text-lg font-semibold text-black dark:text-gray-200">  
                  {post.title}  
                </h2>  
                <span className="text-sm text-black dark:text-gray-200">  
                  {new Date(post.createdAt).toLocaleDateString()}  
                </span>  
              </div>  
              {/* Image section */}  
              {post.images?.length > 0 && (  
                <img  
                  src={post.images[0]}  
                  alt={post.title}  
                  className="w-full h-96 object-fill rounded-lg mt-3"  
                />  
              )}  
              
              <div  
                className="mt-2 text-black dark:text-gray-200"  
                dangerouslySetInnerHTML={{ __html: post.content }} 
              />  
              <div className="mt-3 flex items-center text-sm text-black dark:text-gray-200">  
                <span>Category: {post.categories.join(', ')}</span>  
                <span className="ml-4">Author: {post.author.name}</span>  
              </div>  
                
              <div className="mt-4">  
                <VoteButton postId={post._id} />  
              </div>  
            </div>  
          ))  
        ) : (  
          <p>No posts found</p>  
        )}  
      </div>  
    </div> 
    
  );
};

export default Posts;
