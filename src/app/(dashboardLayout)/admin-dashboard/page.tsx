import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FileText, LayoutDashboard, UserPlus, Users } from "lucide-react";

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

const AdminDashboardPage = async () => {
  const accessToken = cookies().get("accessToken")?.value;
  const decodedUser = decodeAccessToken(accessToken);

  if (!accessToken || !isAdminRole(decodedUser?.role)) {
    redirect("/login?redirect=/admin-dashboard");
  }

  const response = await fetch(`${envConfig.baseApi}/users/admin/overview`, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to load admin overview");
  }

  const overview: AdminOverviewResponse = await response.json();
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
                Monitor the platform with a quick snapshot of users and content.
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
    </div>
  );
};

export default AdminDashboardPage;
