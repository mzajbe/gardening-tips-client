/* eslint-disable prettier/prettier */

import nexiosInstance from "@/src/config/nexios.config";

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

// interface UserProfilesPostsProps {  
//   params: {  
//     userId: string;  
//   };  
// }  


const UserProfilesPosts =async ({ params }: { params: { userId: string } }) => {

  const res: any = await nexiosInstance.get(`/posts/user-posts/${params.userId}`, {
    cache: "no-store",
    next: {},
  });

 // Get the posts data from the response  
 const posts : Post[] = res.data.data;  

//  console.log(posts);
  


  return (
    <div>  
      <h2>User Posts</h2>  
      {posts.length === 0 ? (  
        <p>No posts found.</p>  
      ) : (  
        posts.map(post => (  
          <div key={post._id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>  
            <h3>{post.title}</h3>  
            <p>{post.content}</p>  
            {post.images.length > 0 && (  
              <img src={post.images[0]} alt={post.title} style={{ maxWidth: '100%', height: 'auto' }} />  
            )}  
            <div style={{ marginTop: '10px', fontSize: '0.9em', color: '#555' }}>  
              <p>Author: {post.author.name}</p>  
              <p>Email: {post.author.email}</p>  
              {post.author.profilePicture && (  
                <img  
                  src={post.author.profilePicture}  
                  alt={post.author.name}  
                  style={{ width: '50px', borderRadius: '50%' }}  
                />  
              )}  
            </div>  
          </div>  
        ))  
      )}  
    </div>  
  );
};

export default UserProfilesPosts;