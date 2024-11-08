/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable prettier/prettier */
"use client"

import { useState } from "react";
import Nexios from "axios";


const page = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
      });
      const [submitted, setSubmitted] = useState(false);
    
      const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
      };
    
      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        setFormData({ name: "", email: "", message: "" });
      };
    
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 text-center">Contact Us</h2>
          <p className="text-center text-gray-600 mb-4">
            Have a question? Fill out the form below, and well get back to you as soon as possible.
          </p>
  
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="text-gray-600 font-semibold">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
              />
            </div>
  
            <div>
              <label htmlFor="email" className="text-gray-600 font-semibold">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
              />
            </div>
  
            <div>
              <label htmlFor="message" className="text-gray-600 font-semibold">Message</label>
              <textarea
                id="message"
                name="message"
                required
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
              />
            </div>
  
            <div>
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md shadow-lg transition-transform transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-green-300"
              >
                Submit
              </button>
            </div>
          </form>
  
          {submitted && (
            <p className="mt-4 text-center text-green-600">Thank you! Your message has been sent successfully.</p>
          )}
        </div>
      </div>
    );
};

export default page;