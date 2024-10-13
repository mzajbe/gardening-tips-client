/* eslint-disable prettier/prettier */
/* eslint-disable react/self-closing-comp */
// "use client";


import Posts from "./(commonLayout)/posts/page";



export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      {/* <Sidebar className=""></Sidebar> */}
      <Posts />
    </section>
  );
}
