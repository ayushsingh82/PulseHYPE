import React from "react";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full flex justify-center mt-4 mb-8">
      <div className="w-full max-w-3xl flex items-center justify-between px-6 py-4 shadow-lg glass-morphism rounded-2xl">
        <div className="text-2xl font-bold text-[#97FBE4] tracking-tight">
          <Link 
            href="/"
            className="hover:scale-110 transition-transform duration-300"
          >
            HYPE
          </Link>
        </div>
        <div className="flex gap-6">
          <Link 
            href="/gluex" 
            className="text-white font-medium hover:text-[#97FBE4] transition-colors duration-300 px-3 py-2 rounded-lg hover:bg-[#97FBE4]/10 hover:scale-110"
          >
            GlueX
          </Link>
          <Link 
            href="/liquidlabs" 
            className="text-[#97FBE4] font-semibold hover:text-white transition-colors duration-300 px-3 py-2 rounded-lg hover:bg-[#97FBE4]/10 hover:scale-110"
          >
            Liquid Labs
          </Link>
          <Link 
            href="/simulator" 
            className="text-[#FF6B6B] font-semibold hover:text-white transition-colors duration-300 px-3 py-2 rounded-lg hover:bg-[#FF6B6B]/10 hover:scale-110"
          >
            Simulator
          </Link>
          <Link 
            href="/stablecoin-tracker" 
            className="text-[#22c55e] font-semibold hover:text-white transition-colors duration-300 px-3 py-2 rounded-lg hover:bg-[#22c55e]/10 hover:scale-110"
          >
            Stablecoin Tracker
          </Link>
        </div>
      </div>
    </nav>
  );
}
