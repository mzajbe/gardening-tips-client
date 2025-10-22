/* eslint-disable react/self-closing-comp */
/* eslint-disable prettier/prettier */

import { Leaf, Sparkles } from "lucide-react";

const CosmosLogo = () => {
  return (
    <>
      <div className="flex items-center justify-center gap-4 group cursor-pointer">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-green-500 rounded-full group-hover:scale-150 transition-transform duration-300"></div>
          <div className="w-2 h-2 bg-emerald-500 rounded-full group-hover:scale-150 transition-transform duration-300 delay-75"></div>
          <div className="w-2 h-2 bg-violet-500 rounded-full group-hover:scale-150 transition-transform duration-300 delay-150"></div>
        </div>
        {/* <h1 className="text-5xl font-bold  group-hover:tracking-wider transition-all duration-300">
              COSMOS
            </h1> */}
        <h1
          className="text-5xl font-extrabold group-hover:tracking-wider transition-all duration-300"
          style={{
            WebkitTextStroke: "1px white", // white border around each letter
            color: "transparent", // makes inside transparent
          }}
        >
          Cosmos
        </h1>
      </div>
    </>
  );
};

export default CosmosLogo;

// version 1

{
  /* <div className="flex items-center justify-center gap-3 group cursor-pointer">
  <div className="relative">
    <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-violet-500 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
    <div className="relative bg-gradient-to-br from-green-500 to-violet-600 p-3 rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300">
      <Leaf className="w-7 h-7 text-white" />
    </div>
  </div>
  <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 via-emerald-500 to-violet-600 bg-clip-text text-transparent group-hover:from-green-500 group-hover:via-emerald-400 group-hover:to-violet-500 transition-all duration-300">
    COSMOS
  </h1>
</div>; */
}

// version 2

{
  /* <div className="flex items-center justify-center group cursor-pointer">
        <div className="relative">
          <h1 className="text-6xl font-black bg-gradient-to-r from-green-600 via-emerald-500 to-violet-600 bg-clip-text text-transparent tracking-tight">
            COSMOS
          </h1>
        </div>
      </div> */
}
