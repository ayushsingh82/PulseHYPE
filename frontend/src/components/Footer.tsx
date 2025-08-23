import React from "react";

export default function Footer() {
  return (
    <footer className="w-full bg-black/80 border-t border-[#97FBE4]/20 mt-20">
      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="text-3xl font-bold text-[#97FBE4] mb-4">
              PulseHYPE
            </div>
          </div>

          {/* Analytics */}
          <div>
            
          </div>
        </div>
      </div>
    </footer>
  );
}
