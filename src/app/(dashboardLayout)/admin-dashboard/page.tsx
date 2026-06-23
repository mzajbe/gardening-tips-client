import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FileText, LayoutDashboard, UserPlus, Users } from "lucide-react";

import AdminVideoManagement from "@/src/components/admin/AdminVideoManagement";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import envConfig from "@/src/config/envConfig";
import { decodeAccessToken, isAdminRole } from "@/src/lib/auth";

type AdminOverviewResponse = {
  success: boolean;
  data: {
    totalUsers: number;
    totalPosts: number;
    todaySignups: number;
  };
};

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

const AdminDashboardPage = async () => {
  const accessToken = cookies().get("accessToken")?.value;
  const decodedUser = decodeAccessToken(accessToken);

  if (!accessToken || !isAdminRole(decodedUser?.role)) {
    redirect("/login?redirect=/admin-dashboard");
  }

  const [overviewResponse, videosResponse] = await Promise.all([
    fetch(`${envConfig.baseApi}/users/admin/overview`, {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }),
    fetch(`${envConfig.baseApi}/videos?page=1&limit=100`, { cache: "no-store" }),
  ]);

  if (!overviewResponse.ok) {
    throw new Error("Failed to load admin overview");
  }

  if (!videosResponse.ok) {
    throw new Error("Failed to load videos for management");
  }

  const overview: AdminOverviewResponse = await overviewResponse.json();
  const videosResult: VideoResponse = await videosResponse.json();

  const stats = [
    {
      title: "Total Users",
      value: overview.data.totalUsers,
      description: "Registered accounts in the platform.",
      icon: Users,
    },
    {
      title: "Total Posts",
      value: overview.data.totalPosts,
      description: "Published posts across the site.",
      icon: FileText,
    },
    {
      title: "Today's Signups",
      value: overview.data.todaySignups,
      description: "Accounts created since midnight.",
      icon: UserPlus,
    },
  ];

  return (
    <div className="space-y-6 px-2 py-4 md:px-4">
      <section className="rounded-3xl border bg-card/70 p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground">
              <LayoutDashboard className="h-3.5 w-3.5" />
              Admin Control Panel
            </div>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">
                Admin Dashboard
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage your gardening community and educational learning center.
              </p>
            </div>
          </div>

          <Button asChild variant="outline">
            <Link href="/">View Site</Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {stats.map(({ title, value, description, icon: Icon }) => (
          <Card key={title} className="border-border/60 shadow-sm">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
              <div className="space-y-1">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {title}
                </CardTitle>
                <CardDescription>{description}</CardDescription>
              </div>
              <div className="rounded-full border bg-background p-2 text-emerald-600 dark:text-emerald-400">
                <Icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-semibold tracking-tight">{value}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="rounded-3xl border bg-card/70 p-4 shadow-sm sm:p-6">
        <AdminVideoManagement initialVideos={videosResult.data.videos} />
      </section>
    </div>
  );
};

export default AdminDashboardPage;
