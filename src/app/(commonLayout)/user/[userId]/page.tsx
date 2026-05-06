/* eslint-disable prettier/prettier */

import Link from "next/link";

import envConfig from "@/src/config/envConfig";
import FollowButton from "@/src/components/followButton/FollowButton";
import VoteButton from "@/src/app/(commonLayout)/vote/VoteButton";
import CommentBtn from "@/src/components/comment/Comment";

// Define the types for Author and Post  
interface Author {  
  _id: string;  
  name: string;  
  email: string;  
  profilePicture: string;  
  followers: string[];  
  following: string[];  
  isVerified: boolean;  
  isPremium: boolean;  
  role: string;  
  createdAt: string;  
  updatedAt: string;  
  __v: number;  
}  

interface Post {  
  _id: string;  
  title: string;  
  content: string;  
  author: Author;  
  categories: string[];  
  images: string[];  
  isPremium: boolean;  
  isDeleted: boolean;  
  createdAt: string;  
  updatedAt: string;  
  __v: number;  
}  

const UserProfilesPosts = async ({ params }: { params: { userId: string } }) => {
  let posts: Post[] = [];

  try {
    const res = await fetch(`${envConfig.baseApi}/posts/user-posts/${params.userId}`, {
      cache: "no-store",
    });
    const result = await res.json();

    posts = result?.data || [];
  } catch (error) {
    console.error("Error fetching user posts:", error);
  }

  return (
    <div className="flex justify-center p-0 sm:p-6 dark:bg-black">  
      <div className="w-full max-w-3xl shadow-lg rounded-lg p-2 sm:p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">User Posts</h2>  
        {posts.length === 0 ? (  
          <p className="text-center text-gray-500">No posts found.</p>  
        ) : (  
          posts.map((post) => (  
            <div
              key={post._id}
              className="relative p-3 sm:p-4 mb-4 sm:mb-6 shadow-md rounded-lg border border-gray-300 dark:border-gray-700 transition-transform duration-300 hover:shadow-xl"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <img
                    alt="user-photo"
                    className="w-10 h-10 rounded-full border border-gray-300 mr-4"
                    src={post.author?.profilePicture}
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

              <h2 className="text-xl font-bold mb-2">
                {post.title}
              </h2>
              <div
                dangerouslySetInnerHTML={{ __html: post.content }}
                className="mt-2 mb-3"
              />

              {post.images && post.images.length > 0 && post.images[0] && (
                <img
                  alt={post.title}
                  className="w-full h-48 sm:h-64 object-cover rounded-lg mb-3"
                  src={post.images[0]}
                />
              )}

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-3 sm:mt-4 gap-1">
                <span className="text-xs sm:text-sm">
                  Category: {post.categories?.join(", ")}
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
              </div>
            </div>
          ))  
        )}  
      </div>  
    </div>  
  );
};

export default UserProfilesPosts;