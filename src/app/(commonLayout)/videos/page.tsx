import Link from "next/link";
import { BookOpenText, Eye, Sprout } from "lucide-react";

import VideoLibraryControls from "@/src/components/videos/VideoLibraryControls";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import envConfig from "@/src/config/envConfig";

type VideoItem = {
  _id: string;
  title: string;
  description: string;
  category: string;
  thumbnailUrl: string;
  viewCount: number;
};

type VideoResponse = {
  success: boolean;
  data: {
    videos: VideoItem[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

const buildVideosUrl = (params: {
  page: number;
  limit: number;
  search?: string;
  category?: string;
}) => {
  const query = new URLSearchParams();

  query.set("page", String(params.page));
  query.set("limit", String(params.limit));

  if (params.search?.trim()) {
    query.set("search", params.search.trim());
  }

  if (params.category && params.category !== "All") {
    query.set("category", params.category);
  }

  return `/videos?${query.toString()}`;
};

const VideosPage = async ({
  searchParams,
}: {
  searchParams: {
    search?: string;
    category?: string;
    page?: string;
    limit?: string;
  };
}) => {
  const search = searchParams.search?.trim() || "";
  const category = searchParams.category || "All";
  const page = Math.max(1, Number(searchParams.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(searchParams.limit) || 12));

  const apiQuery = new URLSearchParams();
  apiQuery.set("page", String(page));
  apiQuery.set("limit", String(limit));

  if (search) {
    apiQuery.set("search", search);
  }

  if (category !== "All") {
    apiQuery.set("category", category);
  }

  const response = await fetch(`${envConfig.baseApi}/videos?${apiQuery.toString()}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load videos");
  }

  const result: VideoResponse = await response.json();
  const videos = result.data.videos;
  const totalVideos = result.data.total;
  const currentPage = result.data.page;
  const totalPages = result.data.totalPages;

  return (
    <div className="space-y-6 px-2 py-4 md:px-4">
      <section className="rounded-3xl border bg-card/70 p-6 shadow-sm">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground">
            <BookOpenText className="h-3.5 w-3.5" />
            Gardening Learning Center
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">Video Library</h1>
          <p className="text-sm text-muted-foreground">
            Explore practical, educational gardening tutorials curated by the admin team.
          </p>
          <p className="text-sm text-muted-foreground">{totalVideos} videos available</p>
        </div>
      </section>

      <VideoLibraryControls initialCategory={category} initialSearch={search} limit={limit} />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {videos.map((video) => (
          <Link key={video._id} href={`/videos/${video._id}`}>
            <Card className="h-full overflow-hidden transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
              <img
                alt={video.title}
                className="aspect-video w-full object-cover"
                src={video.thumbnailUrl}
              />
              <CardHeader className="pb-2">
                <CardTitle className="line-clamp-2 text-base leading-6">{video.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p className="inline-flex items-center gap-1">
                  <Sprout className="h-4 w-4" />
                  {video.category}
                </p>
                <p className="inline-flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {video.viewCount} views
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}

        {videos.length === 0 && (
          <Card className="sm:col-span-2 xl:col-span-3">
            <CardContent className="py-12 text-center text-muted-foreground">
              No videos found for the current filters.
            </CardContent>
          </Card>
        )}
      </section>

      <section className="flex items-center justify-between rounded-2xl border bg-card/70 px-4 py-3">
        {currentPage <= 1 ? (
          <Button disabled variant="outline">
            Previous
          </Button>
        ) : (
          <Button asChild variant="outline">
            <Link
              href={buildVideosUrl({
                page: Math.max(1, currentPage - 1),
                limit,
                search,
                category,
              })}
            >
              Previous
            </Link>
          </Button>
        )}

        <p className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </p>

        {currentPage >= totalPages ? (
          <Button disabled variant="outline">
            Next
          </Button>
        ) : (
          <Button asChild variant="outline">
            <Link
              href={buildVideosUrl({
                page: Math.min(totalPages, currentPage + 1),
                limit,
                search,
                category,
              })}
            >
              Next
            </Link>
          </Button>
        )}
      </section>
    </div>
  );
};

export default VideosPage;

