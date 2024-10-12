/* eslint-disable react-hooks/rules-of-hooks */  
/* eslint-disable prettier/prettier */  
"use client";  
import dynamic from 'next/dynamic';  
import { useState } from 'react';  
import 'react-quill/dist/quill.snow.css';  
import { ToastContainer, toast } from 'react-toastify';  
  

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });  

const categoriesOptions: string[] = ['Vegetables', 'Flowers', 'Landscaping', 'Others'];  

const page: React.FC = () => {  
  const [title, setTitle] = useState<string>('');  
  const [content, setContent] = useState<string>('');  
  const [category, setCategory] = useState<string>(''); // For single category selection  
  const [imageUrl, setImageUrl] = useState<string>(''); // Image URL input  
  const [isPremium, setIsPremium] = useState<boolean>(false);  

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {  
    setCategory(e.target.value); // Set the selected category  
  };  

  const handleSubmit = async () => {  
    // Create the post object  
    const post = {  
      title: title,  
      content: content,  
      author: '67054f8cdc995b9c338898ae', // Replace with logged-in user ID  
      category: category, // Send single category as a string  
      images: [imageUrl], // Send images as an array  
      isPremium: isPremium,  
    };  

    try {  
      const response = await fetch('http://localhost:5000/api/v1/posts/create', {  
        method: 'POST',  
        headers: {  
          'Content-Type': 'application/json', // Set the content type to JSON  
        },  
        body: JSON.stringify(post), // Convert post object to JSON string  
      });  

      if (!response.ok) {  
        throw new Error('Failed to create post');  
      }  

      const data = await response.json();  
      console.log('Post created:', data);  
      
      // Reset fields  
      setTitle('');  
      setContent('');  
      setCategory('');  
      setImageUrl('');  
      setIsPremium(false);  
      
      toast.success("Post created successfully!"); // Show success toast  

    } catch (error) {  
      console.error('Error:', error);  
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';  
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
        <option value="" disabled>Select a category</option> {/* Placeholder option */}  
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