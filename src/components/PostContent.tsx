"use client";

import { useState } from "react";

interface PostContentProps {
  content: string;
}

export default function PostContent({ content }: PostContentProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const safeContent = content || "";
  // Strip HTML tags to get clean word count
  const textContent = safeContent.replace(/<[^>]*>/g, " ").trim();
  const words = textContent.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const wordLimit = 100;

  if (wordCount <= wordLimit) {
    return (
      <div
        dangerouslySetInnerHTML={{ __html: safeContent }}
        className="mt-2 mb-3  leading-relaxed break-words"
      />
    );
  }

  return (
    <div className="mt-2 mb-3">
      {isExpanded ? (
        <>
          <div
            dangerouslySetInnerHTML={{ __html: safeContent }}
            className=" leading-relaxed break-words"
          />
          <button
            className="mt-2 text-emerald-600 dark:text-emerald-400 font-semibold hover:underline text-sm focus:outline-none transition-colors duration-200"
            type="button"
            onClick={() => setIsExpanded(false)}
          >
            See Less
          </button>
        </>
      ) : (
        <>
          <div className=" leading-relaxed break-words">
            {words.slice(0, wordLimit).join(" ") + "..."}
          </div>
          <button
            className="mt-2 text-emerald-600 dark:text-emerald-400 font-semibold hover:underline text-sm focus:outline-none transition-colors duration-200"
            type="button"
            onClick={() => setIsExpanded(true)}
          >
            See More
          </button>
        </>
      )}
    </div>
  );
}
