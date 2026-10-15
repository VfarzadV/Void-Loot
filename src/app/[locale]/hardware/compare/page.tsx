"use client";
import { useState } from "react";
import Image from "next/image";
import { Cpu, Activity } from "lucide-react";

interface TechItem {
  id: string;
  name: string;
  image: string;
  price: number;
  specs: {
    performance: number;
    cooling: number;
    value: number;
    power: number;
  };
}

const MOCK_ITEMS: TechItem[] = [
  {
    id: "rtx4090",
    name: "NVIDIA RTX 4090",
    image: "https://dummyjson.com/image/150x150/404040/ffffff?text=RTX+4090",
    price: 1599.99,
    specs: { performance: 98, cooling: 85, value: 65, power: 30 },
  },
  {
    id: "rx7900",
    name: "AMD RX 7900 XTX",
    image: "https://dummyjson.com/image/150x150/404040/ffffff?text=RX+7900",
    price: 999.99,
    specs: { performance: 88, cooling: 90, value: 85, power: 45 },
  },
  {
    id: "rtx4080",
    name: "NVIDIA RTX 4080",
    image: "https://dummyjson.com/image/150x150/404040/ffffff?text=RTX+4080",
    price: 1199.99,
    specs: { performance: 85, cooling: 92, value: 70, power: 60 },
  },
];

export default function ComparePage() {
  const [item1, setItem1] = useState<TechItem>(MOCK_ITEMS[0]);
  const [item2, setItem2] = useState<TechItem>(MOCK_ITEMS[1]);

  const renderStatBar = (
    label: string,
    val1: number,
    val2: number,
    inverse = false,
  ) => {
    const isItem1Better = inverse ? val1 < val2 : val1 > val2;
    const isItem2Better = inverse ? val2 < val1 : val2 > val1;

    return (
      <div className="flex flex-col gap-2 w-full mt-4">
        <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-base-400">
          <span className={isItem1Better ? "text-primary-400" : ""}>
            {val1}%
          </span>
          <span>{label}</span>
          <span className={isItem2Better ? "text-primary-400" : ""}>
            {val2}%
          </span>
        </div>
        <div className="flex w-full h-3 bg-base-900 rounded-full overflow-hidden border border-white/5">
          <div
            className={`h-full ${isItem1Better ? "bg-primary-500 shadow-[0_0_10px_rgba(170,79,255,0.5)]" : "bg-base-700"}`}
            style={{ width: `${(val1 / (val1 + val2)) * 100}%` }}
          />
          <div className="w-1 h-full bg-base-950 z-10" />
          <div
            className={`h-full ${isItem2Better ? "bg-primary-500 shadow-[0_0_10px_rgba(170,79,255,0.5)]" : "bg-base-700"}`}
            style={{ width: `${(val2 / (val1 + val2)) * 100}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col pb-20 px-6 lg:px-12 pt-10 max-w-350 mx-auto overflow-hidden">
      <div className="flex flex-col items-center text-center mb-12 border-b border-white/5 pb-10">
        <div className="w-16 h-16 rounded-2xl bg-primary-500/10 border border-primary-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(170,79,255,0.2)] mb-4">
          <Cpu size={32} className="text-primary-400" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-3">
          Hardware <span className="text-primary-500">Benchmark</span>
        </h1>
        <p className="text-sm text-base-400 max-w-lg">
          Pit the best hardware against each other. Compare raw performance,
          thermals, and value to build your ultimate rig.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start">
        <div className="flex flex-col gap-6">
          <select
            aria-label="First hardware product"
            value={item1.id}
            onChange={(e) =>
              setItem1(
                MOCK_ITEMS.find((i) => i.id === e.target.value) ||
                  MOCK_ITEMS[0],
              )
            }
            className="w-full bg-base-950 border border-base-800 rounded-xl py-4 px-4 text-sm font-bold text-white focus:outline-none focus:border-primary-500 transition-colors cursor-pointer appearance-none"
          >
            {MOCK_ITEMS.map((item) => (
              <option
                key={item.id}
                value={item.id}
                disabled={item.id === item2.id}
              >
                {item.name}
              </option>
            ))}
          </select>
          <div className="glass-panel p-8 rounded-3xl bg-base-950/60 border border-white/5 flex flex-col items-center text-center">
            <div className="w-48 h-48 relative mb-6 rounded-2xl overflow-hidden border border-white/10 bg-white/5 p-4">
              <Image
                src={item1.image}
                alt={item1.name}
                fill
                className="object-contain p-4"
                unoptimized
              />
            </div>
            <h2 className="text-2xl font-black text-white mb-2">
              {item1.name}
            </h2>
            <span className="text-xl font-bold text-primary-400 mb-6">
              ${item1.price}
            </span>
            <button type="button" className="w-full py-3 rounded-xl bg-base-900 hover:bg-primary-600 font-bold text-sm transition-colors border border-white/5 hover:border-primary-500 text-white">
              View Product
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <select
            aria-label="Second hardware product"
            value={item2.id}
            onChange={(e) =>
              setItem2(
                MOCK_ITEMS.find((i) => i.id === e.target.value) ||
                  MOCK_ITEMS[1],
              )
            }
            className="w-full bg-base-950 border border-base-800 rounded-xl py-4 px-4 text-sm font-bold text-white focus:outline-none focus:border-primary-500 transition-colors cursor-pointer appearance-none"
          >
            {MOCK_ITEMS.map((item) => (
              <option
                key={item.id}
                value={item.id}
                disabled={item.id === item1.id}
              >
                {item.name}
              </option>
            ))}
          </select>
          <div className="glass-panel p-8 rounded-3xl bg-base-950/60 border border-white/5 flex flex-col items-center text-center">
            <div className="w-48 h-48 relative mb-6 rounded-2xl overflow-hidden border border-white/10 bg-white/5 p-4">
              <Image
                src={item2.image}
                alt={item2.name}
                fill
                className="object-contain p-4"
                unoptimized
              />
            </div>
            <h2 className="text-2xl font-black text-white mb-2">
              {item2.name}
            </h2>
            <span className="text-xl font-bold text-primary-400 mb-6">
              ${item2.price}
            </span>
            <button type="button" className="w-full py-3 rounded-xl bg-base-900 hover:bg-primary-600 font-bold text-sm transition-colors border border-white/5 hover:border-primary-500 text-white">
              View Product
            </button>
          </div>
        </div>
      </div>
      <div className="w-full mt-12 glass-panel bg-base-950/80 p-8 md:p-12 rounded-3xl border border-white/10">
        <h3 className="text-xl font-black text-white flex items-center justify-center gap-2 mb-8">
          <Activity size={24} className="text-primary-500" /> Head-to-Head Stats
        </h3>
        <div className="flex flex-col gap-8 max-w-3xl mx-auto">
          {renderStatBar(
            "Gaming Performance",
            item1.specs.performance,
            item2.specs.performance,
          )}
          {renderStatBar(
            "Thermal Efficiency",
            item1.specs.cooling,
            item2.specs.cooling,
          )}
          {renderStatBar(
            "Value for Money",
            item1.specs.value,
            item2.specs.value,
          )}
          {renderStatBar(
            "Power Efficiency (Lower % is Better)",
            item1.specs.power,
            item2.specs.power,
            true,
          )}
        </div>
        <div className="mt-12 flex items-center justify-center gap-4 text-xs font-bold text-base-400">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary-500 rounded-sm"></div> Winner
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-base-700 rounded-sm"></div> Loser
          </div>
        </div>
      </div>
    </div>
  );
}
