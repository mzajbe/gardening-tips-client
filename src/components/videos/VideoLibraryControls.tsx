"use client";

import { FormEvent, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";

type VideoLibraryControlsProps = {
  initialSearch: string;
  initialCategory: string;
  limit: number;
};

const categories = [
  "All",
  "Vegetables",
  "Flowers",
  "Landscaping",
  "Soil Health",
  "Composting",
  "Pest Control",
  "Irrigation",
  "General Gardening",
];

const VideoLibraryControls = ({
  initialSearch,
  initialCategory,
  limit,
}: VideoLibraryControlsProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);

  const pushFilters = (nextSearch: string, nextCategory: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("limit", String(limit));
    params.set("page", "1");

    const trimmedSearch = nextSearch.trim();

    if (trimmedSearch) {
      params.set("search", trimmedSearch);
    } else {
      params.delete("search");
    }

    if (nextCategory !== "All") {
      params.set("category", nextCategory);
    } else {
      params.delete("category");
    }

    startTransition(() => {
      router.push(`/videos?${params.toString()}`);
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    pushFilters(search, category);
  };

  const handleReset = () => {
    setSearch("");
    setCategory("All");
    pushFilters("", "All");
  };

  return (
    <form className="grid gap-3 rounded-2xl border bg-card/70 p-4 sm:grid-cols-12" onSubmit={handleSubmit}>
      <div className="sm:col-span-6">
        <Input
          value={search}
          placeholder="Search videos by title, topic, or keywords"
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      <div className="sm:col-span-3">
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2 sm:col-span-3">
        <Button className="flex-1 gap-2" disabled={isPending} type="submit">
          <Search className="h-4 w-4" />
          Apply
        </Button>
        <Button disabled={isPending} type="button" variant="outline" onClick={handleReset}>
          Reset
        </Button>
      </div>
    </form>
  );
};

export default VideoLibraryControls;
