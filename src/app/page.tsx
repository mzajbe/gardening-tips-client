import Quets from "../components/quets/Quets";
import PremiumTeaser from "../components/premiumTeaser/PremiumTeaser";
import CategoryFilter from "../components/categoryFilter/CategoryFilter";
import envConfig from "../config/envConfig";

import Posts from "./(commonLayout)/posts/Posts";

export default async function Home({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const selectedCategory = searchParams.category || "All";

  // Fetch only the first page server-side for instant SSR
  const res = await fetch(`${envConfig.baseApi}/posts?page=1&limit=8`, {
    cache: "no-store",
  });
  const data = await res.json();
  const initialPosts = data?.data?.posts || [];
  const initialTotal = data?.data?.total || 0;

  return (
    <div className="mx-auto px-1 sm:px-4">
      <section className="flex flex-col md:flex-row md:gap-6 py-4 md:py-10">
        {/* Right column: sidebar - shown first on mobile for category filter access */}
        <aside className="w-full md:w-1/3 space-y-4 md:space-y-6 order-first md:order-last mb-4 md:mb-0">
          <div className="hidden md:block">
            <Quets />
          </div>
          <CategoryFilter />
          <div className="hidden md:block">
            <PremiumTeaser />
          </div>
        </aside>

        {/* Left column: main content (Posts) */}
        <div className="flex-1 min-w-0 order-last md:order-first">
          <Posts
            initialPosts={initialPosts}
            initialTotal={initialTotal}
            selectedCategory={selectedCategory}
          />
        </div>
      </section>
    </div>
  );
}
