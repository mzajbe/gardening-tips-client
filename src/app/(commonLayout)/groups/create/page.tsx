/* eslint-disable prettier/prettier */
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { parseCookies } from "nookies";
import { jwtDecode } from "jwt-decode";
import { Loader2, ArrowLeft, Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";

const CreateGroupPage = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    try {
      const cookies = parseCookies();
      const accessToken = cookies.accessToken;

      if (accessToken) {
        const decoded: any = jwtDecode(accessToken);

        setUserId(decoded._id);
      } else {
        router.push("/login");
      }
    } catch (e) {
      router.push("/login");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await axios.post("/api/proxy/groups/create", {
        name,
        description,
        admin: userId,
      });
      router.push("/groups");
    } catch (error: any) {
      console.error("Error creating group:", error);
      setError(error?.response?.data?.message || "Failed to create group. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <button
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        onClick={() => router.push("/groups")}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Groups
      </button>

      <Card className="shadow-xl border-border/50">
        <CardHeader className="text-center space-y-3">
          <div className="mx-auto w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg">
            <Users className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
            Create a Group
          </CardTitle>
          <CardDescription>
            Start a new gardening community for like-minded enthusiasts
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label className="font-medium" htmlFor="name">
                Group Name
              </Label>
              <Input
                required
                className="h-11"
                disabled={isLoading}
                id="name"
                placeholder="e.g. Urban Balcony Gardeners"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="font-medium" htmlFor="description">
                Description
              </Label>
              <textarea
                required
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                disabled={isLoading}
                id="description"
                placeholder="Tell people what your group is about..."
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            )}

            <Button
              className="w-full h-11 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold shadow-md"
              disabled={isLoading}
              type="submit"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Group"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateGroupPage;
