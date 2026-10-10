"use client";
import { useState, useEffect, useRef, FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Radio,
  Users,
  Flame,
  Play,
  MessageSquare,
  Maximize,
  Minimize,
  UserPlus,
  UserCheck,
  Heart,
} from "lucide-react";

interface ChatMessage {
  id: number;
  user: string;
  text: string;
  color: string;
}

interface Stream {
  id: number;
  streamer: string;
  title: string;
  game: string;
  viewers: string;
  thumbnail: string;
  avatar: string;
  category: string;
}

const FEATURED_STREAM = {
  streamer: "Ninja",
  title: "🔥 RANKED GRIND | Road to Radiant | !drops enabled",
  game: "Valorant",
  baseViewers: 124500,
  thumbnail:
    "https://media.rawg.io/media/games/b11/b115b2bc6a5957a917bc7601f4abdda2.jpg",
  avatar: "https://i.pravatar.cc/150?u=ninja",
};

const CATEGORIES = [
  "All",
  "FPS",
  "RPG",
  "Esports",
  "Just Chatting",
  "Speedrun",
];

const LIVE_STREAMS: Stream[] = [
  {
    id: 1,
    streamer: "Shroud",
    title: "Testing the new updates... chill",
    game: "Cyberpunk 2077",
    viewers: "84.2K",
    thumbnail:
      "https://media.rawg.io/media/games/26d/26d4437715bee60138cb4a44dbe8bf2f.jpg",
    avatar: "https://i.pravatar.cc/150?u=shroud",
    category: "RPG",
  },
  {
    id: 2,
    streamer: "Faker",
    title: "T1 Faker - Solo Queue Finals Prep",
    game: "League of Legends",
    viewers: "210K",
    thumbnail:
      "https://media.rawg.io/media/games/78b/78bc81e247fc7e77af700cbd632a9297.jpg",
    avatar: "https://i.pravatar.cc/150?u=faker",
    category: "Esports",
  },
  {
    id: 3,
    streamer: "Tarik",
    title: "VCT Masters Watch Party 🏆",
    game: "Valorant",
    viewers: "95K",
    thumbnail:
      "https://media.rawg.io/media/games/b11/b115b2bc6a5957a917bc7601f4abdda2.jpg",
    avatar: "https://i.pravatar.cc/150?u=tarik",
    category: "FPS",
  },
  {
    id: 4,
    streamer: "xQc",
    title: "REACTING THEN PLAYING RL",
    game: "Rocket League",
    viewers: "68K",
    thumbnail:
      "https://media.rawg.io/media/games/8cc/8cce7c0e99dcc43d66c8efd42f9d03e3.jpg",
    avatar: "https://i.pravatar.cc/150?u=xqc",
    category: "Just Chatting",
  },
  {
    id: 5,
    streamer: "KaiCenat",
    title: "ELDEN RING MARATHON 💀",
    game: "Elden Ring",
    viewers: "112K",
    thumbnail:
      "https://media.rawg.io/media/games/174/1743b3dd185bda4a7be349347d4064df.jpg",
    avatar: "https://i.pravatar.cc/150?u=kai",
    category: "RPG",
  },
  {
    id: 6,
    streamer: "Lirik",
    title: "Story Sunday! Let's dive in.",
    game: "Red Dead Redemption 2",
    viewers: "32K",
    thumbnail:
      "https://media.rawg.io/media/games/511/5118aff5091cb3efec399c808f8c598f.jpg",
    avatar: "https://i.pravatar.cc/150?u=lirik",
    category: "RPG",
  },
  {
    id: 7,
    streamer: "TenZ",
    title: "Aim Training & Comp",
    game: "Valorant",
    viewers: "45K",
    thumbnail:
      "https://media.rawg.io/media/games/b11/b115b2bc6a5957a917bc7601f4abdda2.jpg",
    avatar: "https://i.pravatar.cc/150?u=tenz",
    category: "FPS",
  },
  {
    id: 8,
    streamer: "Distortion2",
    title: "Elden Ring Any% Glitchless",
    game: "Elden Ring",
    viewers: "15K",
    thumbnail:
      "https://media.rawg.io/media/games/174/1743b3dd185bda4a7be349347d4064df.jpg",
    avatar: "https://i.pravatar.cc/150?u=dist",
    category: "Speedrun",
  },
];

const BOT_NAMES = [
  "VoidWalker",
  "NeonNinja",
  "PixelKing",
  "CyberPunk",
  "Shadow",
  "Gamer123",
  "NoobMaster",
];

const BOT_COLORS = [
  "text-blue-400",
  "text-emerald-400",
  "text-rose-400",
  "text-yellow-400",
  "text-cyan-400",
  "text-orange-400",
];

const BOT_MESSAGES = [
  "POGGERS",
  "W stream",
  "LET'S GOOO! 🔥",
  "Sheeeeesh 🥶",
  "Drops enabled?",
  "that shot was insane",
  "LMAO",
  "W W W W W",
  "can't wait for the new update",
  "aimbot?? jk 😂",
];

export default function LivePage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      user: "System",
      text: "Welcome to the VoidLive Chat!",
      color: "text-base-400",
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [viewers, setViewers] = useState(FEATURED_STREAM.baseViewers);
  const [isTheater, setIsTheater] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");

  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  useEffect(() => {
    const interval = setInterval(
      () => {
        const randomName =
          BOT_NAMES[Math.floor(Math.random() * BOT_NAMES.length)];
        const randomColor =
          BOT_COLORS[Math.floor(Math.random() * BOT_COLORS.length)];
        const randomText =
          BOT_MESSAGES[Math.floor(Math.random() * BOT_MESSAGES.length)];

        setMessages((prev) => [
          ...prev.slice(-40),
          {
            id: Date.now(),
            user: randomName,
            text: randomText,
            color: randomColor,
          },
        ]);
      },
      Math.floor(Math.random() * 2000) + 2000,
    );

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setViewers((prev) => prev + Math.floor(Math.random() * 150) - 75);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        user: "You",
        text: newMessage,
        color: "text-primary-400",
      },
    ]);
    setNewMessage("");
  };

  const filteredStreams =
    activeCategory === "All"
      ? LIVE_STREAMS
      : LIVE_STREAMS.filter((s) => s.category === activeCategory);

  return (
    <div className="w-full flex flex-col pb-20 px-6 lg:px-12 pt-6 max-w-[1600px] mx-auto overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <Radio size={28} className="text-red-500 animate-pulse" />
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            Void<span className="text-red-500">Live</span>
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2 md:gap-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full border text-xs font-bold transition-all ${
                activeCategory === cat
                  ? "bg-red-500/20 border-red-500 text-white shadow-[0_0_10px_rgba(239,68,68,0.3)]"
                  : "bg-base-900 border-white/5 text-base-300 hover:text-white hover:border-red-500/50 hover:bg-red-500/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      <section
        className={`w-full grid ${isTheater ? "grid-cols-1" : "lg:grid-cols-4"} gap-6 mb-12 transition-all duration-500`}
      >
        <div
          className={`${isTheater ? "col-span-1" : "lg:col-span-3"} relative w-full aspect-video rounded-3xl overflow-hidden border border-white/10 group bg-black transition-all duration-500`}
        >
          <Image
            src={FEATURED_STREAM.thumbnail}
            alt={FEATURED_STREAM.title}
            fill
            unoptimized
            priority
            className="object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-linear-to-t from-base-950 via-transparent to-transparent opacity-90" />
          <div className="absolute top-6 left-6 flex items-center gap-2 bg-red-600/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-red-400/30 shadow-[0_0_15px_rgba(220,38,38,0.6)] z-20">
            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span className="text-[10px] font-black text-white uppercase tracking-widest">
              Live Now
            </span>
          </div>
          <div className="absolute top-6 right-6 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 z-20 transition-all">
            <Users size={14} className="text-red-400" />
            <span className="text-xs font-bold text-white font-mono">
              {viewers.toLocaleString()}
            </span>
          </div>
          <button
            onClick={() => setIsTheater(!isTheater)}
            className="absolute bottom-6 right-6 p-2 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-white hover:bg-primary-600 hover:border-primary-500 transition-all z-20"
            title={isTheater ? "Exit Theater Mode" : "Theater Mode"}
          >
            {isTheater ? <Minimize size={18} /> : <Maximize size={18} />}
          </button>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            <button className="w-16 h-16 rounded-full bg-red-600/90 text-white flex items-center justify-center backdrop-blur-md shadow-[0_0_30px_rgba(220,38,38,0.5)] hover:scale-110 transition-transform">
              <Play size={24} className="ml-1" fill="currentColor" />
            </button>
          </div>
          <div className="absolute bottom-6 left-6 flex flex-col sm:flex-row items-start sm:items-end gap-4 z-20 pr-16">
            <div className="relative w-14 h-14 rounded-xl overflow-hidden border-2 border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.4)] shrink-0">
              <Image
                src={FEATURED_STREAM.avatar}
                alt={FEATURED_STREAM.streamer}
                fill
                unoptimized
                className="object-cover"
              />
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-xl md:text-2xl font-black text-white drop-shadow-md line-clamp-2 leading-tight">
                {FEATURED_STREAM.title}
              </h2>
              <div className="flex flex-wrap items-center gap-3 text-sm font-semibold">
                <span className="text-base-50 text-base font-black">
                  {FEATURED_STREAM.streamer}
                </span>
                <span className="text-red-400">playing</span>
                <span className="text-primary-400 font-black">
                  {FEATURED_STREAM.game}
                </span>
                <div className="flex items-center gap-2 ml-2">
                  <button
                    onClick={() => setIsFollowing(!isFollowing)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition-all ${
                      isFollowing
                        ? "bg-base-800 text-white border border-white/10"
                        : "bg-primary-600 text-white border border-primary-500 shadow-[0_0_10px_rgba(170,79,255,0.4)]"
                    }`}
                  >
                    {isFollowing ? (
                      <>
                        <UserCheck size={14} /> Following
                      </>
                    ) : (
                      <>
                        <UserPlus size={14} /> Follow
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className={`p-1.5 rounded-md transition-colors ${
                      isLiked
                        ? "text-rose-500 bg-rose-500/20"
                        : "text-base-300 bg-base-800 hover:text-white"
                    }`}
                  >
                    <Heart
                      size={16}
                      className={isLiked ? "fill-rose-500 animate-bounce" : ""}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`${isTheater ? "col-span-1" : "lg:col-span-1"} glass-panel bg-base-950/60 rounded-3xl border border-white/5 flex flex-col overflow-hidden transition-all duration-500 h-112.5 lg:h-137.5`}
        >
          <div className="p-4 border-b border-white/5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <MessageSquare size={16} className="text-base-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Stream Chat
              </span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-base-500">
              <Users size={12} /> {Math.floor(viewers * 0.1).toLocaleString()}{" "}
              in chat
            </div>
          </div>
          <div
            ref={chatContainerRef}
            className="flex flex-col gap-3 p-4 flex-1 overflow-y-auto min-h-0 text-xs font-medium"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className="animate-in fade-in slide-in-from-right-4 duration-300 wrap-break-word"
              >
                <strong className={`${msg.color} mr-1.5`}>{msg.user}:</strong>
                <span className="text-base-100">{msg.text}</span>
              </div>
            ))}
          </div>
          <form
            onSubmit={handleSendMessage}
            className="p-3 border-t border-white/5 bg-base-900/50 shrink-0"
          >
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Send a message..."
              className="w-full bg-base-950 border border-base-800 rounded-lg px-3 py-2.5 text-xs text-white placeholder-base-600 focus:outline-none focus:border-primary-500 transition-colors shadow-[inset_0_2px_5px_rgba(0,0,0,0.2)]"
            />
          </form>
        </div>
      </section>
      <div className="flex flex-col gap-6">
        <h3 className="text-xl font-black text-white flex items-center gap-2 border-b border-white/5 pb-4">
          <Flame size={20} className="text-red-500" />
          {activeCategory === "All"
            ? "Live Channels We Think You'll Like"
            : `${activeCategory} Live Streams`}
        </h3>
        {filteredStreams.length === 0 ? (
          <div className="py-10 text-center text-base-400 text-sm">
            No live streams found in this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredStreams.map((stream) => (
              <Link
                href="#"
                key={stream.id}
                className="group flex flex-col gap-3"
              >
                <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-white/5 group-hover:border-red-500/50 transition-colors">
                  <Image
                    src={stream.thumbnail}
                    alt={stream.title}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 bg-red-600 px-1.5 py-0.5 rounded text-[9px] font-black text-white uppercase tracking-wider">
                    Live
                  </div>
                  <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] font-bold text-white flex items-center gap-1">
                    <Users size={10} className="text-red-400" />{" "}
                    {stream.viewers}
                  </div>
                </div>
                <div className="flex items-start gap-3 px-1">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border border-white/10">
                    <Image
                      src={stream.avatar}
                      alt={stream.streamer}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <h4
                      className="text-sm font-bold text-white line-clamp-1 group-hover:text-red-400 transition-colors"
                      title={stream.title}
                    >
                      {stream.title}
                    </h4>
                    <span className="text-xs text-base-400 font-medium">
                      {stream.streamer}
                    </span>
                    <span className="text-[10px] text-base-500 truncate">
                      {stream.game}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
