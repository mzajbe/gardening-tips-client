/* eslint-disable prettier/prettier */
"use client";
import { FaLeaf, FaSeedling, FaHandsHelping } from "react-icons/fa";

const AboutPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
      {/* Card Container */}
      <div className=" backdrop-blur-md border border-purple-200 rounded-3xl shadow-xl p-10 max-w-3xl text-center animate-fadeIn">
        <h1 className="text-5xl font-extrabold text-purple-700 mb-6 drop-shadow-md">
          About <span className="text-green-600">Us</span>
        </h1>
        <p className="text-lg  mb-10 leading-relaxed">
          Welcome to <span className="font-semibold text-green-700">BloomSpace</span> —
          a community where gardeners, nature lovers, and green souls come together to
          share inspiration, tips, and stories. Our goal is to make your garden grow as
          beautifully as your ideas do.
        </p>

        {/* Mission Section */}
        <div className="mb-8 hover:scale-105 transition-transform duration-300">
          <div className="flex justify-center mb-3">
            <FaHandsHelping className="text-4xl text-purple-600" />
          </div>
          <h2 className="text-2xl font-semibold text-purple-700 mb-2">Our Mission</h2>
          <p className="text-md  max-w-md mx-auto">
            To cultivate a friendly online space where every gardener — from beginner to
            expert — feels encouraged to grow, share, and learn from each other.
          </p>
        </div>

        {/* Vision Section */}
        <div className="mb-8 hover:scale-105 transition-transform duration-300">
          <div className="flex justify-center mb-3">
            <FaSeedling className="text-4xl text-green-600" />
          </div>
          <h2 className="text-2xl font-semibold text-purple-700 mb-2">Our Vision</h2>
          <p className="text-md  max-w-md mx-auto">
            To become the most trusted and inspiring platform for garden enthusiasts
            worldwide — where nature meets technology and every idea takes root.
          </p>
        </div>

        {/* Values Section */}
        <div className="hover:scale-105 transition-transform duration-300">
          <div className="flex justify-center mb-3">
            <FaLeaf className="text-4xl text-green-500" />
          </div>
          <h2 className="text-2xl font-semibold text-purple-700 mb-2">Our Values</h2>
          <p className="text-md  max-w-md mx-auto">
            We believe in sustainability, creativity, and community. Each post, tip, and
            photo shared helps our planet breathe a little easier.
          </p>
        </div>
      </div>

      {/* Decorative Leaves */}
      <div className="absolute bottom-4 right-4 opacity-20 text-green-500 text-6xl animate-bounce-slow">
        <FaLeaf />
      </div>
      <div className="absolute top-4 left-4 opacity-20 text-purple-400 text-6xl animate-bounce-slow">
        <FaSeedling />
      </div>
    </div>
  );
};

export default AboutPage;
