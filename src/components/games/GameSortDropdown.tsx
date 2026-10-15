"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function GameSortDropdown() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") || "";

  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    if (e.target.value) {
      params.set("sort", e.target.value);
    } else {
      params.delete("sort");
    }
    params.delete("page");
    router.push(`/games?${params.toString()}`);
  };

  return (
    <select
      value={currentSort}
      onChange={handleSort}
      aria-label="Sort games"
      className="bg-base-900 border border-base-800 text-sm text-white px-4 py-2 rounded-lg focus:outline-none focus:border-primary-500 cursor-pointer w-full sm:w-auto"
    >
      <option value="">Most Popular (Default)</option>
      <option value="-released">Newest Releases</option>
      <option value="-metacritic">Highest Rated</option>
      <option value="name">Name (A-Z)</option>
    </select>
  );
}
