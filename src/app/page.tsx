/* eslint-disable react/self-closing-comp */
// "use client";
// import { useEffect, useState } from "react";

// import Sidebar from "../components/sidebar/Sidebar";
import Posts from "./(commonLayout)/posts/page";

// type TPost = {
//   _id: string;
//   title: string;
//   content: string;
//   category: string;
//   author: string; // Can be user ID or name
//   createdAt: string;
// };

// import Posts from "@/src/app/(commonLayout)/posts";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      {/* <Sidebar className=""></Sidebar> */}
      <Posts></Posts>
    </section>
  );
}
