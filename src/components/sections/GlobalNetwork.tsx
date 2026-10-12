import Image from "next/image";
import { Star } from "lucide-react";

interface ApiComment {
  id: number;
  body: string;
  user: {
    id: number;
    username: string;
    fullName: string;
  };
}

async function getTestimonials() {
  try {
    const res = await fetch("https://dummyjson.com/comments?limit=3", {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.comments as ApiComment[];
  } catch (error) {
    return [];
  }
}

export default async function GlobalNetwork() {
  const testimonials = await getTestimonials();

  return (
    <section className="w-full flex flex-col items-center py-24 px-6 lg:px-12 max-w-[1600px] mx-auto overflow-hidden">
      <div className="flex flex-col items-center text-center mb-16 gap-4">
        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
          Global <span className="text-primary-500">Network</span>
        </h2>
        <p className="text-sm text-base-400 max-w-2xl">
          Join millions of players across the globe. Our servers are
          strategically located to guarantee ultra-low latency and seamless
          streaming.
        </p>
      </div>
      <div className="relative w-full max-w-5xl mx-auto mb-24">
        <Image
          src="/images/MAP.png"
          alt="Global Network Map"
          width={1200}
          height={600}
          className="w-full h-auto opacity-80 mix-blend-screen"
        />
      </div>
      <div className="flex flex-col items-center text-center mb-12 gap-2">
        <h3 className="text-2xl md:text-3xl font-black text-white">
          Trusted by Thousands of Happy Gamers
        </h3>
        <p className="text-sm text-base-400">
          Real feedback from the Void community fetched live.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="glass-panel bg-base-950/60 rounded-3xl border border-white/10 backdrop-blur-xl p-8 flex flex-col gap-6 hover:-translate-y-2 transition-all duration-300 hover:border-primary-500/60 hover:shadow-[0_10px_35px_rgba(170,79,255,0.2)] group"
          >
            <div className="flex items-center justify-between border-b border-white/5 pb-6">
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border border-white/10 bg-base-900 group-hover:border-primary-500/40 transition-colors">
                  <Image
                    src={`https://i.pravatar.cc/150?u=${testimonial?.user?.username || "user"}`}
                    alt={testimonial?.user?.fullName || "User"}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <h4 className="text-sm font-bold text-white line-clamp-1 group-hover:text-primary-300 transition-colors">
                    {testimonial?.user?.fullName || "Unknown User"}
                  </h4>
                  <span className="text-[10px] text-base-400 font-medium uppercase tracking-wider">
                    @{testimonial?.user?.username || "anonymous"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-base-900 px-2 py-1 rounded-md border border-white/5 shrink-0">
                <span className="text-xs font-bold text-white">5.0</span>
                <Star size={12} className="text-yellow-500 fill-yellow-500" />
              </div>
            </div>
            <p className="text-sm text-base-300 leading-relaxed font-medium line-clamp-4">
              &quot;{testimonial?.body || "Great service and fast delivery!"}
              &quot;
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
