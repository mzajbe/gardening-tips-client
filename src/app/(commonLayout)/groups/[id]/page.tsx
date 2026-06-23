/* eslint-disable prettier/prettier */
"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { parseCookies } from "nookies";
import { jwtDecode } from "jwt-decode";
import {
  Users,
  Crown,
  UserPlus,
  Check,
  Trash,
  ArrowLeft,
  ImagePlus,
  Ban,
  SendHorizonal,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Textarea } from "@/src/components/ui/textarea";

type GroupMember = {
  _id: string;
  name?: string;
  email?: string;
  profilePicture?: string;
};

type GroupDetails = {
  _id: string;
  name: string;
  description: string;
  admin: GroupMember | string;
  members: Array<GroupMember | string>;
};

type GroupPost = {
  _id: string;
  content: string;
  image?: string;
  isDisabled?: boolean;
  createdAt: string;
  author: GroupMember;
};

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const GroupDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [group, setGroup] = useState<GroupDetails | null>(null);
  const [posts, setPosts] = useState<GroupPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);
  const [userId, setUserId] = useState<string>("");
  const [accessToken, setAccessToken] = useState<string>("");
  const [postText, setPostText] = useState("");
  const [postImage, setPostImage] = useState<File | null>(null);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [isModeratingPost, setIsModeratingPost] = useState<string | null>(null);

  const authHeaders = useMemo(
    () => ({ Authorization: `Bearer ${accessToken}` }),
    [accessToken]
  );

  useEffect(() => {
    try {
      const cookies = parseCookies();
      const token = cookies.accessToken;

      if (!token) return;

      const decoded: any = jwtDecode(token);

      setUserId(decoded._id);
      setAccessToken(token);
    } catch (e) {
      console.log(e);
    }
  }, []);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const { data } = await axios.get(`/api/proxy/groups/${id}`);

        setGroup(data.data);
      } catch (error) {
        console.error("Error fetching group:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchGroup();
  }, [id]);

  useEffect(() => {
    const fetchGroupPosts = async () => {
      try {
        const { data } = await axios.get(`/api/proxy/groups/${id}/posts`);

        setPosts(data.data || []);
      } catch (error) {
        console.error("Error fetching group posts:", error);
      } finally {
        setPostsLoading(false);
      }
    };

    if (id) fetchGroupPosts();
  }, [id]);

  const handleJoin = async () => {
    try {
      await axios.post(`/api/proxy/groups/${id}/join`, { userId });
      const { data } = await axios.get(`/api/proxy/groups/${id}`);

      setGroup(data.data);
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to join");
    }
  };

  const handleLeave = async () => {
    try {
      await axios.post(`/api/proxy/groups/${id}/leave`, { userId });
      const { data } = await axios.get(`/api/proxy/groups/${id}`);

      setGroup(data.data);
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to leave");
    }
  };

  const handleDeleteGroup = async () => {
    if (!confirm("Are you sure you want to delete this group?")) return;

    try {
      await axios.delete(`/api/proxy/groups/${id}`, { data: { userId } });
      router.push("/groups");
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to delete");
    }
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;

    if (!file) {
      setPostImage(null);
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      alert("Image must be 5MB or smaller");
      event.target.value = "";
      return;
    }

    setPostImage(file);
  };

  const handleCreatePost = async () => {
    if (!accessToken) {
      alert("Please login to post in this group");
      return;
    }

    if (!postText.trim()) {
      alert("Post text is required");
      return;
    }

    setIsCreatingPost(true);

    try {
      const formData = new FormData();

      formData.append("content", postText.trim());

      if (postImage) {
        formData.append("image", postImage);
      }

      const { data } = await axios.post(`/api/proxy/groups/${id}/posts`, formData, {
        headers: {
          ...authHeaders,
        },
      });

      setPosts((prev) => [data.data, ...prev]);
      setPostText("");
      setPostImage(null);
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to create post");
    } finally {
      setIsCreatingPost(false);
    }
  };

  const handleDisablePost = async (postId: string) => {
    if (!accessToken) return;

    setIsModeratingPost(postId);

    try {
      await axios.patch(
        `/api/proxy/groups/${id}/posts/${postId}/disable`,
        { isDisabled: true },
        { headers: authHeaders }
      );

      setPosts((prev) => prev.filter((post) => post._id !== postId));
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to disable post");
    } finally {
      setIsModeratingPost(null);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!accessToken) return;

    const confirmed = confirm("Delete this post from the group?");

    if (!confirmed) return;

    setIsModeratingPost(postId);

    try {
      await axios.delete(`/api/proxy/groups/${id}/posts/${postId}`, {
        headers: authHeaders,
      });

      setPosts((prev) => prev.filter((post) => post._id !== postId));
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to delete post");
    } finally {
      setIsModeratingPost(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-muted-foreground">Loading group...</p>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="py-16 text-center">
        <p className="text-lg text-muted-foreground">Group not found</p>
      </div>
    );
  }

  const adminId = (group.admin as GroupMember)?._id || (group.admin as string);
  const isAdmin = adminId === userId;
  const isMember = group.members?.some((member) => {
    const memberId = (member as GroupMember)?._id || (member as string);

    return memberId === userId;
  });

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-6">
      <button
        className="mb-4 flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        onClick={() => router.push("/groups")}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Groups
      </button>

      <div className="relative mb-6 h-40 overflow-hidden rounded-xl bg-gradient-to-br from-emerald-400 via-green-500 to-teal-500">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute bottom-4 left-6">
          <h1 className="text-3xl font-bold text-white drop-shadow-md">{group.name}</h1>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{group.members?.length || 0} members</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Crown className="h-4 w-4 text-amber-500" />
            <span>Admin: {(group.admin as GroupMember)?.name || "Unknown"}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {userId && !isAdmin &&
            (isMember ? (
              <Button
                className="border-emerald-300 text-emerald-600"
                size="sm"
                variant="outline"
                onClick={handleLeave}
              >
                <Check className="mr-1 h-4 w-4" />
                Joined
              </Button>
            ) : (
              <Button
                className="bg-emerald-600 text-white hover:bg-emerald-700"
                size="sm"
                onClick={handleJoin}
              >
                <UserPlus className="mr-1 h-4 w-4" />
                Join Group
              </Button>
            ))}

          {isAdmin && (
            <Button size="sm" variant="destructive" onClick={handleDeleteGroup}>
              <Trash className="mr-1 h-4 w-4" />
              Delete Group
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        <main className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">About this group</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">{group.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Create Post</CardTitle>
              <p className="text-sm text-muted-foreground">
                Text is required. Image is optional (max 5MB).
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                placeholder="Share something with your group..."
                rows={4}
                value={postText}
                onChange={(event) => setPostText(event.target.value)}
              />
              <div className="flex flex-wrap items-center gap-3">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-muted">
                  <ImagePlus className="h-4 w-4" />
                  Add Image
                  <input
                    accept="image/*"
                    className="hidden"
                    type="file"
                    onChange={handleImageChange}
                  />
                </label>
                {postImage && (
                  <span className="text-sm text-muted-foreground">
                    {postImage.name}
                  </span>
                )}
                <Button
                  className="ml-auto gap-2"
                  disabled={isCreatingPost || !isMember}
                  onClick={handleCreatePost}
                >
                  <SendHorizonal className="h-4 w-4" />
                  {isCreatingPost ? "Posting..." : "Post"}
                </Button>
              </div>
              {!isMember && (
                <p className="text-xs text-muted-foreground">Join this group to create posts.</p>
              )}
            </CardContent>
          </Card>

          <section className="space-y-4">
            {postsLoading ? (
              <Card>
                <CardContent className="py-8 text-center text-sm text-muted-foreground">
                  Loading group posts...
                </CardContent>
              </Card>
            ) : posts.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-sm text-muted-foreground">
                  No group posts yet.
                </CardContent>
              </Card>
            ) : (
              posts.map((post) => (
                <Card key={post._id}>
                  <CardContent className="space-y-3 pt-6">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          alt={post.author?.name || "User"}
                          className="h-10 w-10 rounded-full border object-cover"
                          src={
                            post.author?.profilePicture ||
                            "https://i.postimg.cc/KcBGjPS7/profile-picture.webp"
                          }
                        />
                        <div>
                          <p className="text-sm font-semibold">{post.author?.name || "Unknown"}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(post.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {isAdmin && (
                        <div className="flex items-center gap-2">
                          <Button
                            className="gap-1"
                            disabled={isModeratingPost === post._id}
                            size="sm"
                            variant="outline"
                            onClick={() => handleDisablePost(post._id)}
                          >
                            <Ban className="h-4 w-4" />
                            Disable
                          </Button>
                          <Button
                            className="gap-1"
                            disabled={isModeratingPost === post._id}
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeletePost(post._id)}
                          >
                            <Trash className="h-4 w-4" />
                            Delete
                          </Button>
                        </div>
                      )}
                    </div>

                    <p className="whitespace-pre-wrap text-sm leading-6">{post.content}</p>

                    {post.image && (
                      <img
                        alt="Group post"
                        className="max-h-[420px] w-full rounded-lg border object-cover"
                        src={post.image}
                      />
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </section>
        </main>

        <aside>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-lg">Members ({group.members?.length || 0})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {group.members?.map((member) => {
                const memberItem = member as GroupMember;
                const memberId = memberItem?._id || (member as string);
                const memberIsAdmin = adminId === memberId;

                return (
                  <div
                    key={memberId}
                    className="flex items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-muted/50"
                  >
                    <img
                      alt={memberItem?.name || "Member"}
                      className="h-9 w-9 rounded-full border object-cover"
                      src={
                        memberItem?.profilePicture ||
                        "https://i.postimg.cc/KcBGjPS7/profile-picture.webp"
                      }
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{memberItem?.name || "Unknown"}</p>
                    </div>
                    {memberIsAdmin && (
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                        Admin
                      </span>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
};

export default GroupDetailPage;

