import React from "react";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full flex justify-center mt-4 mb-8">
      <div className="w-full max-w-6xl flex items-center justify-between px-8 py-5 shadow-2xl glass-morphism-enhanced rounded-3xl border border-[#97FBE4]/30 relative overflow-hidden">
        {/* Gradient overlay for extra depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#97FBE4]/5 via-transparent to-[#97FBE4]/5 pointer-events-none"></div>
        
        <div className="text-3xl font-bold text-[#97FBE4] tracking-tight relative z-10">
          <Link 
            href="/"
            className="hover:scale-110 transition-all duration-300 neon-text-subtle inline-block"
          >
            PulseHYPE
          </Link>
        </div>
        
        <div className="flex gap-2 relative z-10">
          <Link 
            href="/gluex" 
            className="nav-link text-white font-medium hover:text-[#97FBE4] transition-all duration-300 px-4 py-3 rounded-xl hover:bg-[#97FBE4]/10 hover:scale-105 hover:shadow-lg hover:shadow-[#97FBE4]/20 relative group"
          >
            <span className="relative z-10">GlueX</span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#97FBE4]/0 to-[#97FBE4]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
          </Link>
          
          <Link 
            href="/liquidlabs" 
            className="nav-link text-[#97FBE4] font-semibold hover:text-white transition-all duration-300 px-4 py-3 rounded-xl hover:bg-[#97FBE4]/15 hover:scale-105 hover:shadow-lg hover:shadow-[#97FBE4]/25 relative group"
          >
            <span className="relative z-10">Liquid Labs</span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#97FBE4]/0 to-[#97FBE4]/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
          </Link>
          
          <Link 
            href="/simulator" 
            className="nav-link text-[#FF6B6B] font-semibold hover:text-white transition-all duration-300 px-4 py-3 rounded-xl hover:bg-[#FF6B6B]/15 hover:scale-105 hover:shadow-lg hover:shadow-[#FF6B6B]/25 relative group"
          >
            <span className="relative z-10">Simulator</span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#FF6B6B]/0 to-[#FF6B6B]/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
          </Link>
          
          <Link 
            href="/goldrush" 
            className="nav-link text-[#FFD700] font-semibold hover:text-white transition-all duration-300 px-4 py-3 rounded-xl hover:bg-[#FFD700]/15 hover:scale-105 hover:shadow-lg hover:shadow-[#FFD700]/25 relative group"
          >
            <span className="relative z-10">GoldRush</span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700]/0 to-[#FFD700]/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
          </Link>
       
          
          <Link 
            href="/stablecoin-tracker" 
            className="nav-link text-[#22c55e] font-semibold hover:text-white transition-all duration-300 px-4 py-3 rounded-xl hover:bg-[#22c55e]/15 hover:scale-105 hover:shadow-lg hover:shadow-[#22c55e]/25 relative group"
          >
            <span className="relative z-10">Stablecoin Tracker</span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#22c55e]/0 to-[#22c55e]/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
          </Link>   
        </div>
      </div>
    </nav>
  );
}
