import React from "react";

export default function Navbar() {
  return (
    <nav className="w-full flex items-center justify-between px-8 py-4 mt-4 mb-8 shadow-lg bg-[#00150E] bg-opacity-80 rounded-2xl border border-[#97FBE4]/20" style={{gap: 0}}>
      <div className="text-2xl font-bold text-[#97FBE4] tracking-tight">HYPE</div>
      <div className="flex gap-8">

        <a href="/gluex" className="text-white font-medium hover:text-[#97FBE4] transition">GlueX</a>
        <a href="/liquidlabs" className="text-[#97FBE4] font-semibold hover:text-white transition">Liquid Labs</a>
      </div>
    </nav>
  );
}
