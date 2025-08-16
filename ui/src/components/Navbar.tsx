import React from "react";

export default function Navbar() {
  return (
    <nav className="w-full flex justify-center mt-4 mb-8">
      <div className="w-full max-w-3xl flex items-center justify-between px-4 py-4 shadow-lg bg-[#00150E] bg-opacity-80 rounded-2xl border border-[#97FBE4]/20">
        <div className="text-2xl font-bold text-[#97FBE4] tracking-tight"><a href="/">HYPE</a></div>
        <div className="flex gap-8">
          <a href="/gluex" className="text-white font-medium hover:text-[#97FBE4] transition">GlueX</a>
          <a href="/liquidlabs" className="text-[#97FBE4] font-semibold hover:text-white transition">Liquid Labs</a>
        </div>
      </div>
    </nav>
  );
}
