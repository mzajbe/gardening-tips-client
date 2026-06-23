"use client";

import { useEffect, useRef } from "react";

type VideoPlayerProps = {
  resourceId: string;
  youtubeVideoId: string;
  title: string;
};

const VideoPlayer = ({ resourceId, youtubeVideoId, title }: VideoPlayerProps) => {
  const hasIncrementedRef = useRef(false);

  useEffect(() => {
    if (hasIncrementedRef.current) {
      return;
    }

    hasIncrementedRef.current = true;

    const incrementView = async () => {
      try {
        await fetch(`/api/proxy/videos/${resourceId}/view`, {
          method: "POST",
        });
      } catch (error) {
        console.error("Failed to increment view count:", error);
      }
    };

    incrementView();
  }, [resourceId]);

  return (
    <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
      <div className="aspect-video w-full bg-black">
        <iframe
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="h-full w-full"
          referrerPolicy="strict-origin-when-cross-origin"
          src={`https://www.youtube.com/embed/${youtubeVideoId}`}
          title={title}
        />
      </div>
    </div>
  );
};

export default VideoPlayer;
