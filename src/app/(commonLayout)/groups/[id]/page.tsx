/* eslint-disable prettier/prettier */
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { parseCookies } from "nookies";
import { jwtDecode } from "jwt-decode";
import { Card, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Users, Crown, UserPlus, Check, Trash, ArrowLeft } from "lucide-react";

const GroupDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [group, setGroup] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    try {
      const cookies = parseCookies();
      const accessToken = cookies.accessToken;
      if (accessToken) {
        const decoded: any = jwtDecode(accessToken);
        setUserId(decoded._id);
      }
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

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this group?")) return;
    try {
      await axios.delete(`/api/proxy/groups/${id}`, { data: { userId } });
      router.push("/groups");
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to delete");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-muted-foreground">Loading group...</p>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="text-center py-16">
        <p className="text-lg text-muted-foreground">Group not found</p>
      </div>
    );
  }

  const isAdmin = (group.admin?._id || group.admin) === userId;
  const isMember = group.members?.some((m: any) => (m._id || m) === userId);

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Back */}
      <button
        onClick={() => router.push("/groups")}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Groups
      </button>

      {/* Cover */}
      <div className="h-40 rounded-xl bg-gradient-to-br from-emerald-400 via-green-500 to-teal-500 mb-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute bottom-4 left-6">
          <h1 className="text-3xl font-bold text-white drop-shadow-md">
            {group.name}
          </h1>
        </div>
      </div>

      {/* Info bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>{group.members?.length || 0} members</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Crown className="w-4 h-4 text-amber-500" />
            <span>Admin: {group.admin?.name || "Unknown"}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {userId && !isAdmin && (
            isMember ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleLeave}
                className="text-emerald-600 border-emerald-300"
              >
                <Check className="w-4 h-4 mr-1" />
                Joined
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={handleJoin}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <UserPlus className="w-4 h-4 mr-1" />
                Join Group
              </Button>
            )
          )}
          {isAdmin && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
            >
              <Trash className="w-4 h-4 mr-1" />
              Delete Group
            </Button>
          )}
        </div>
      </div>

      {/* Description */}
      <Card className="mb-6">
        <CardContent className="p-5">
          <h2 className="font-semibold mb-2">About</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {group.description}
          </p>
        </CardContent>
      </Card>

      {/* Members List */}
      <Card>
        <CardContent className="p-5">
          <h2 className="font-semibold mb-4">
            Members ({group.members?.length || 0})
          </h2>
          <div className="space-y-3">
            {group.members?.map((member: any) => {
              const memberId = member._id || member;
              const memberIsAdmin = (group.admin?._id || group.admin) === memberId;
              return (
                <div
                  key={memberId}
                  className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <img
                    src={member.profilePicture || "https://i.postimg.cc/KcBGjPS7/profile-picture.webp"}
                    alt={member.name || "Member"}
                    className="w-9 h-9 rounded-full object-cover border border-border"
                  />
                  <div className="flex-1">
                    <span className="text-sm font-medium">
                      {member.name || "Unknown"}
                    </span>
                  </div>
                  {memberIsAdmin && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 font-medium">
                      Admin
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GroupDetailPage;
