/* eslint-disable react/jsx-no-undef */
/* eslint-disable import/order */
/* eslint-disable no-console */
/* eslint-disable react/jsx-sort-props */
/* eslint-disable react/self-closing-comp */
/* eslint-disable padding-line-between-statements */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable prettier/prettier */
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import { redirect } from "next/navigation";

import ProfileClient from "./ProfileClient";

import envConfig from "@/src/config/envConfig";

export default async function ProfilePage() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    redirect("/login");
  }

  let decodedToken: any;

  try {
    decodedToken = jwtDecode(accessToken);
  } catch (error) {
    redirect("/login");
  }

  const userId = decodedToken._id;

  let userData = null;
  let followersData = 0;
  let followingData = 0;
  let postsData = [];

  try {
    const [userRes, followRes, followingRes, postsRes, groupPostsRes] = await Promise.all([
      fetch(`${envConfig.baseApi}/users/${userId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "no-store",
      }),
      fetch(`${envConfig.baseApi}/follow/${userId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "no-store",
      }),
      fetch(`${envConfig.baseApi}/following/${userId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "no-store",
      }),
      fetch(`${envConfig.baseApi}/posts/user-posts/${userId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "no-store",
      }),
      fetch(`${envConfig.baseApi}/groups/posts/user/${userId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "no-store",
      }),
    ]);

    const [userJson, followJson, followingJson, postsJson, groupPostsJson] = await Promise.all([
      userRes.ok ? userRes.json() : Promise.resolve({}),
      followRes.ok ? followRes.json() : Promise.resolve({}),
      followingRes.ok ? followingRes.json() : Promise.resolve({}),
      postsRes.ok ? postsRes.json() : Promise.resolve({}),
      groupPostsRes.ok ? groupPostsRes.json() : Promise.resolve({}),
    ]);

    userData = userJson?.data || null;
    followersData = followJson?.data?.length || 0;
    followingData = followingJson?.count || 0;

    const regularPosts = postsJson?.data || [];
    const groupPosts = (groupPostsJson?.data || []).map((post: any) => ({
      _id: post._id,
      title: `Group: ${post?.group?.name || "Community"}`,
      content: post.content,
      categories: ["Group Post"],
      images: post.image ? [post.image] : [],
      createdAt: post.createdAt,
      postId: post._id,
      data: post,
      isGroupPost: true,
    }));

    postsData = [...regularPosts, ...groupPosts].sort(
      (a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error) {
    console.error("Error fetching profile data on server:", error);
  }

  return (
    <ProfileClient
      initialFollowers={followersData}
      initialFollowing={followingData}
      initialPosts={postsData}
      initialUserInfo={userData}
    />
  );
}
