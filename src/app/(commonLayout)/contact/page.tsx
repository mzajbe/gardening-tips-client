/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable prettier/prettier */
"use client"

import { useState } from "react";
import Nexios from "axios";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Page = () => {
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
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ">
      <div className="max-w-md w-full space-y-8 p-8 border rounded-2xl shadow-lg  backdrop-blur-md">
        <h2 className="text-3xl font-extrabold text-center text-purple-700">
          Contact <span className="text-green-600">Us</span>
        </h2>
        <p className="text-center mb-4 ">
          Have a question or suggestion? Fill out the form below — we’d love to hear from you!
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className=" font-semibold">
              Name
            </label>
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
            <label htmlFor="email" className=" font-semibold">
              Email
            </label>
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
            <label htmlFor="message" className=" font-semibold">
              Message
            </label>
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
          <p className="mt-4 text-center text-green-600 font-medium">
            🌸 Thank you! Your message has been sent successfully.
          </p>
        )}

        {/* Social Media Links */}
        <div className="mt-8 border-t border-purple-200 pt-6">
          <h3 className="text-center text-lg font-semibold text-purple-700 mb-4">
            Connect with us
          </h3>
          <div className="flex justify-center gap-6">
            <a
              href="https://facebook.com"
              target="_blank"
              className="text-purple-600 hover:text-green-600 transition-transform transform hover:scale-110"
            >
              <Facebook size={28} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              className="text-purple-600 hover:text-green-600 transition-transform transform hover:scale-110"
            >
              <Twitter size={28} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              className="text-purple-600 hover:text-green-600 transition-transform transform hover:scale-110"
            >
              <Instagram size={28} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              className="text-purple-600 hover:text-green-600 transition-transform transform hover:scale-110"
            >
              <Linkedin size={28} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
