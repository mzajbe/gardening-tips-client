/* eslint-disable prettier/prettier */
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { parseCookies } from "nookies";
import { jwtDecode } from "jwt-decode";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Users, Plus, Crown, UserPlus, Check } from "lucide-react";

const GroupsPage = () => {
  const [groups, setGroups] = useState<any[]>([]);
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
    const fetchGroups = async () => {
      try {
        const { data } = await axios.get("/api/proxy/groups");
        setGroups(data.data || []);
      } catch (error) {
        console.error("Error fetching groups:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, []);

  const handleJoin = async (groupId: string) => {
    try {
      await axios.post(`/api/proxy/groups/${groupId}/join`, { userId });
      // Refresh groups
      const { data } = await axios.get("/api/proxy/groups");
      setGroups(data.data || []);
    } catch (error: any) {
      console.error("Error joining group:", error?.response?.data?.message || error);
    }
  };

  const handleLeave = async (groupId: string) => {
    try {
      await axios.post(`/api/proxy/groups/${groupId}/leave`, { userId });
      const { data } = await axios.get("/api/proxy/groups");
      setGroups(data.data || []);
    } catch (error: any) {
      console.error("Error leaving group:", error?.response?.data?.message || error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-muted-foreground">Loading groups...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
            Groups
          </h1>
          <p className="text-muted-foreground mt-1">
            Join gardening communities and connect with fellow gardeners
          </p>
        </div>
        {userId && (
          <Link href="/groups/create">
            <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md">
              <Plus className="w-4 h-4 mr-2" />
              Create Group
            </Button>
          </Link>
        )}
      </div>

      {/* Groups Grid */}
      {groups.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {groups.map((group) => {
            const isMember = group.members?.some(
              (m: any) => (m._id || m) === userId
            );
            const isAdmin = (group.admin?._id || group.admin) === userId;

            return (
              <Card
                key={group._id}
                className="overflow-hidden hover:shadow-lg transition-shadow duration-300 border-border/50"
              >
                {/* Cover gradient */}
                <div className="h-20 bg-gradient-to-br from-emerald-400 via-green-500 to-teal-500 relative">
                  {isAdmin && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                      <Crown className="w-3 h-3" />
                      Admin
                    </div>
                  )}
                </div>

                <CardHeader className="pb-2 pt-4">
                  <Link href={`/groups/${group._id}`}>
                    <CardTitle className="text-lg hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer">
                      {group.name}
                    </CardTitle>
                  </Link>
                </CardHeader>

                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {group.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>{group.members?.length || 0} members</span>
                    </div>

                    {userId && !isAdmin && (
                      isMember ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleLeave(group._id)}
                          className="text-emerald-600 border-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Joined
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleJoin(group._id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                          <UserPlus className="w-4 h-4 mr-1" />
                          Join
                        </Button>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <Users className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
          <p className="text-lg text-muted-foreground">No groups yet</p>
          <p className="text-sm text-muted-foreground/70 mt-1">
            Be the first to create a gardening community!
          </p>
        </div>
      )}
    </div>
  );
};

export default GroupsPage;
