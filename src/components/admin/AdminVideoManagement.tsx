"use client";

import { useState } from "react";
import { Edit, ExternalLink, Plus, Trash2, Video } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Textarea } from "@/src/components/ui/textarea";
import { decodeAccessToken, getAccessTokenFromBrowser } from "@/src/lib/auth";

type VideoItem = {
  _id: string;
  title: string;
  description: string;
  category: string;
  youtubeUrl: string;
  youtubeVideoId: string;
  thumbnailUrl: string;
  viewCount: number;
};

type VideoFormState = {
  title: string;
  description: string;
  category: string;
  youtubeUrl: string;
};

const defaultFormState: VideoFormState = {
  title: "",
  description: "",
  category: "Vegetables",
  youtubeUrl: "",
};

const categories = [
  "Vegetables",
  "Flowers",
  "Landscaping",
  "Soil Health",
  "Composting",
  "Pest Control",
  "Irrigation",
  "General Gardening",
];

const AdminVideoManagement = ({ initialVideos }: { initialVideos: VideoItem[] }) => {
  const [videos, setVideos] = useState<VideoItem[]>(initialVideos);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [createForm, setCreateForm] = useState<VideoFormState>(defaultFormState);
  const [editForm, setEditForm] = useState<VideoFormState>(defaultFormState);
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const token = getAccessTokenFromBrowser();
  const currentUser = decodeAccessToken(token);

  if (currentUser?.role !== "admin") {
    return null;
  }

  const buildHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  });

  const resetCreateForm = () => setCreateForm(defaultFormState);

  const handleCreateVideo = async () => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/proxy/videos", {
        method: "POST",
        headers: buildHeaders(),
        body: JSON.stringify(createForm),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to upload video");
      }

      setVideos((prev) => [data.data, ...prev]);
      resetCreateForm();
      setIsCreateOpen(false);
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Failed to upload video");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditDialog = (video: VideoItem) => {
    setEditingVideoId(video._id);
    setEditForm({
      title: video.title,
      description: video.description,
      category: video.category,
      youtubeUrl: video.youtubeUrl,
    });
    setIsEditOpen(true);
  };

  const handleUpdateVideo = async () => {
    if (!editingVideoId) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/proxy/videos/${editingVideoId}`, {
        method: "PATCH",
        headers: buildHeaders(),
        body: JSON.stringify(editForm),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to update video");
      }

      setVideos((prev) =>
        prev.map((video) => (video._id === editingVideoId ? data.data : video))
      );
      setIsEditOpen(false);
      setEditingVideoId(null);
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Failed to update video");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteVideo = async (videoId: string) => {
    const confirmed = window.confirm("Delete this video from learning center?");

    if (!confirmed) return;

    try {
      const response = await fetch(`/api/proxy/videos/${videoId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to delete video");
      }

      setVideos((prev) => prev.filter((video) => video._id !== videoId));
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Failed to delete video");
    }
  };

  const VideoForm = ({
    state,
    setState,
  }: {
    state: VideoFormState;
    setState: React.Dispatch<React.SetStateAction<VideoFormState>>;
  }) => (
    <div className="grid gap-4 py-2">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={state.title}
          onChange={(event) =>
            setState((prev) => ({ ...prev, title: event.target.value }))
          }
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          rows={4}
          value={state.description}
          onChange={(event) =>
            setState((prev) => ({ ...prev, description: event.target.value }))
          }
        />
      </div>

      <div className="space-y-2">
        <Label>Category</Label>
        <Select
          value={state.category}
          onValueChange={(value) =>
            setState((prev) => ({ ...prev, category: value }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="youtube-url">YouTube URL</Label>
        <Input
          id="youtube-url"
          placeholder="https://www.youtube.com/watch?v=..."
          value={state.youtubeUrl}
          onChange={(event) =>
            setState((prev) => ({ ...prev, youtubeUrl: event.target.value }))
          }
        />
      </div>
    </div>
  );

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Video Management</h2>
          <p className="text-sm text-muted-foreground">
            Upload and manage educational YouTube videos for gardeners.
          </p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Upload Video
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload New Video</DialogTitle>
              <DialogDescription>
                Add a YouTube video to the gardening learning center.
              </DialogDescription>
            </DialogHeader>

            <VideoForm state={createForm} setState={setCreateForm} />

            <DialogFooter>
              <Button
                disabled={isSubmitting}
                variant="outline"
                onClick={() => {
                  resetCreateForm();
                  setIsCreateOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button disabled={isSubmitting} onClick={handleCreateVideo}>
                {isSubmitting ? "Uploading..." : "Upload"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {videos.map((video) => (
          <Card key={video._id} className="overflow-hidden">
            <img
              alt={video.title}
              className="aspect-video w-full object-cover"
              src={video.thumbnailUrl}
            />
            <CardHeader className="pb-2">
              <CardTitle className="line-clamp-2 text-base">{video.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p className="line-clamp-2">{video.description}</p>
              <p>Category: {video.category}</p>
              <p>Views: {video.viewCount}</p>
              <div className="flex items-center gap-2">
                <Button asChild size="sm" variant="outline">
                  <a href={video.youtubeUrl} rel="noreferrer" target="_blank">
                    <ExternalLink className="mr-1 h-3.5 w-3.5" />
                    Open
                  </a>
                </Button>
                <Button size="sm" variant="outline" onClick={() => openEditDialog(video)}>
                  <Edit className="mr-1 h-3.5 w-3.5" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDeleteVideo(video._id)}
                >
                  <Trash2 className="mr-1 h-3.5 w-3.5" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {videos.length === 0 && (
          <Card className="sm:col-span-2 xl:col-span-3">
            <CardContent className="flex flex-col items-center justify-center gap-3 py-10 text-center">
              <Video className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="font-medium">No videos yet</p>
                <p className="text-sm text-muted-foreground">
                  Upload your first YouTube tutorial to start the learning center.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Video</DialogTitle>
            <DialogDescription>
              Update the learning content or replace the YouTube URL.
            </DialogDescription>
          </DialogHeader>

          <VideoForm state={editForm} setState={setEditForm} />

          <DialogFooter>
            <Button
              disabled={isSubmitting}
              variant="outline"
              onClick={() => {
                setIsEditOpen(false);
                setEditingVideoId(null);
              }}
            >
              Cancel
            </Button>
            <Button disabled={isSubmitting} onClick={handleUpdateVideo}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default AdminVideoManagement;
