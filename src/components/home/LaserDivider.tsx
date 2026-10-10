"use client";

export default function LaserDivider() {
  return (
    <div className="w-full max-w-7xl mx-auto py-4 flex items-center justify-center relative overflow-hidden opacity-70 hover:opacity-100 transition-opacity">
      <div className="w-full h-px bg-linear-to-r from-transparent via-primary-500/20 to-transparent relative">
        <div
          className="absolute top-0 h-0.5 w-48 bg-linear-to-r from-transparent via-primary-400 to-transparent shadow-[0_0_15px_rgba(170,79,255,0.8)]"
          style={{
            animation: "laser 3s cubic-bezier(0.4, 0, 0.2, 1) infinite",
          }}
        />
      </div>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes laser {
          0% { left: -20%; opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { left: 120%; opacity: 0; }
        }
      `,
        }}
      />
    </div>
  );
}
