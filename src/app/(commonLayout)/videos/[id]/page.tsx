import Link from "next/link";
import { Eye, Sprout } from "lucide-react";

import VideoPlayer from "@/src/components/videos/VideoPlayer";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import envConfig from "@/src/config/envConfig";

type VideoItem = {
  _id: string;
  title: string;
  description: string;
  category: string;
  youtubeVideoId: string;
  thumbnailUrl: string;
  viewCount: number;
};

type SingleVideoResponse = {
  success: boolean;
  data: VideoItem;
};

type RelatedVideoResponse = {
  success: boolean;
  data: VideoItem[];
};

const VideoDetailsPage = async ({ params }: { params: { id: string } }) => {
  const [videoResponse, relatedResponse] = await Promise.all([
    fetch(`${envConfig.baseApi}/videos/${params.id}`, { cache: "no-store" }),
    fetch(`${envConfig.baseApi}/videos/${params.id}/related`, {
      cache: "no-store",
    }),
  ]);

  if (!videoResponse.ok) {
    throw new Error("Failed to load video");
  }

  const videoResult: SingleVideoResponse = await videoResponse.json();
  const video = videoResult.data;

  const relatedResult: RelatedVideoResponse = relatedResponse.ok
    ? await relatedResponse.json()
    : { success: false, data: [] };

  return (
    <div className="space-y-6 px-2 py-4 md:px-4">
      <section className="space-y-4 rounded-3xl border bg-card/70 p-4 shadow-sm sm:p-6">
        <VideoPlayer
          resourceId={video._id}
          title={video.title}
          youtubeVideoId={video.youtubeVideoId}
        />

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {video.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Sprout className="h-4 w-4" />
              {video.category}
            </span>
            <span className="inline-flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {video.viewCount} views
            </span>
          </div>
          <p className="leading-7 text-muted-foreground">{video.description}</p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Related Videos</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {relatedResult.data.map((related) => (
            <Link key={related._id} href={`/videos/${related._id}`}>
              <Card className="overflow-hidden transition-transform duration-200 hover:-translate-y-1 hover:shadow-md">
                <img
                  alt={related.title}
                  className="aspect-video w-full object-cover"
                  src={related.thumbnailUrl}
                />
                <CardHeader className="pb-2">
                  <CardTitle className="line-clamp-2 text-base">
                    {related.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1 text-sm text-muted-foreground">
                  <p>{related.category}</p>
                  <p>{related.viewCount} views</p>
                </CardContent>
              </Card>
            </Link>
          ))}

          {relatedResult.data.length === 0 && (
            <Card className="sm:col-span-2 xl:col-span-3">
              <CardContent className="py-10 text-center text-muted-foreground">
                No related videos yet.
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
};

export default VideoDetailsPage;
