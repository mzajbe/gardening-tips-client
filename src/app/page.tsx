/* eslint-disable prettier/prettier */
/* eslint-disable react/self-closing-comp */
// "use client";


import Quets from "../components/quets/Quets";
import Posts from "./(commonLayout)/posts/page";



export default function Home() {
  return (
    <div className=" mx-auto px-4">
      <section className="flex flex-col md:flex-row md:gap-6 py-8 md:py-10">
        {/* Left column: main content (Posts) */}


        
        <div className="flex-1">
          <Posts />
        </div>

        {/* Right column: sidebar with quote card */}
        <aside className="w-full md:w-1/3">
          <Quets />
        </aside>
        
      </section>
    </div>
  );
}
