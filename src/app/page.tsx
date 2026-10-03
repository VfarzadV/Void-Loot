import Hero, { Game } from "@/components/home/Hero";

async function getFeaturedGames(): Promise<Game[]> {
  try {
    const res = await fetch(
      `https://api.rawg.io/api/games?key=${process.env.RAWG_API_KEY}&dates=2023-01-01,2024-12-31&ordering=-added&page_size=3`,
      {
        next: { revalidate: 3600 },
      },
    );

    if (!res.ok) {
      throw new Error("خطا در دریافت اطلاعات از API");
    }

    const data = await res.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching games:", error);
    return [];
  }
}

export default async function Home() {
  const featuredGames = await getFeaturedGames();

  return (
    <div className="flex flex-col w-full pb-20">
      <Hero featuredGames={featuredGames} />
    </div>
  );
}
