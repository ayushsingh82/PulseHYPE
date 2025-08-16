"use client";
import React from "react";

const features = [
  {
    title: "Optimal Swaps",
    description: "Get the best rates and lowest slippage with LiquidSwap route-finding.",
  },
  {
    title: "Cross-Chain Ready",
    description: "Bridge and swap across chains in one seamless flow.",
  },
  {
    title: "Integrated Yield",
    description: "Stake, lend, and farm directly from your wallet.",
  },
  
];

function CompareDemo() {
  // Import Compare at the top: import Compare from "../components/ui/compare";
  // If not found, replace with a placeholder div or image.
  // @ts-ignore
  const Compare = require("../components/ui/compare").default;
  return (
    <div className="p-4 border rounded-3xl dark:bg-neutral-900 bg-neutral-100 border-neutral-200 dark:border-neutral-800 px-4">
      <Compare
        firstImage="https://assets.aceternity.com/code-problem.png"
        secondImage="https://assets.aceternity.com/code-solution.png"
        firstImageClassName="object-cover object-left-top"
        secondImageClassname="object-cover object-left-top"
        className="h-[250px] w-[200px] md:h-[500px] md:w-[500px]"
        slideMode="hover"
      />
    </div>
  );
}

const faqs = [
  {
    q: "Do I need a new wallet?",
    a: "No, you can use your existing wallet. Just connect and start trading.",
  },
  {
    q: "How do I earn yield?",
    a: "Stake, lend, or farm directly from the app. Yield opportunities are integrated and easy to access.",
  },
  {
    q: "Is it cross-chain?",
    a: "Yes! Swap and bridge assets across supported chains in one transaction.",
  },
  {
    q: "How do fees work?",
    a: "You can set your own fee recipient and share in protocol revenue.",
  },
];

export default function Home() {
  const [activeFeature, setActiveFeature] = React.useState(0);
  const [expandedFaq, setExpandedFaq] = React.useState<number | null>(null);

  return (
    <div className="min-h-screen bg-black text-[#97FBE4] overflow-hidden flex flex-col">
      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative z-10 px-4 pb-20">
          <div className="max-w-5xl mx-auto">
            <div className="mb-16 pt-12">
              <h1 className="text-5xl md:text-7xl font-light mb-6 tracking-tight">
                DeFi, Unified.<br />
                <span className="text-white">Trade. Bridge. Earn.</span>
              </h1>
              <p className="text-lg text-[#97FBE4]/80 max-w-2xl">
                The fastest, smartest way to swap, stake, and farm—powered by LiquidSwap route-finding and GlueX DeFi intelligence.
              </p>
            </div>

            {/* Bento Grid */}
            <div className="grid grid-cols-12 gap-4 auto-rows-[160px]">
              {/* Main Feature */}
              <div className="col-span-12 md:col-span-8 row-span-2 group relative bg-[#00150E] bg-opacity-80 rounded-2xl p-8 border border-[#97FBE4]/30 shadow-xl overflow-hidden">
                <div className="relative z-10">
                  <p className="text-sm text-[#97FBE4]/60 mb-4">FEATURED</p>
                  <h3 className="text-3xl font-light mb-3">Optimal Swaps & Yield</h3>
                  <p className="text-[#97FBE4]/80 max-w-lg">
                    Swap, bridge, and earn yield in one seamless flow. No more juggling dApps.
                  </p>
                </div>
                <div className="absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-[#97FBE4] to-transparent w-full" />
              </div>
              {/* Live Stats */}
              <div className="col-span-12 md:col-span-4 row-span-2 bg-[#97FBE4] rounded-2xl p-8 relative overflow-hidden shadow-xl live-stats-box">
                <div className="flex flex-col justify-between h-full">
                  <div>
                    <p className="text-sm mb-2">LIVE</p>
                    <p className="text-5xl font-light">$1.2M+</p>
                    <p className="text-sm mt-1">TVL Secured</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-black animate-pulse" />
                    <span className="text-xs">Real-time</span>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 border border-black/10 -translate-y-1/2 translate-x-1/2" />
              </div>
              {/* Feature Cards */}
              <div className="col-span-6 md:col-span-3 bg-[#00150E] bg-opacity-80 rounded-2xl p-6 border border-[#97FBE4]/30 shadow-md">
                <div className="flex flex-col justify-between h-full">
                  <p className="text-3xl font-light">⚡</p>
                  <p className="text-sm mt-1">Optimal Swaps</p>
                </div>
              </div>
              <div className="col-span-6 md:col-span-3 bg-[#00150E] bg-opacity-80 rounded-2xl p-6 border border-[#97FBE4]/30 shadow-md">
                <div className="flex flex-col justify-between h-full">
                  <p className="text-3xl font-light">🌉</p>
                  <p className="text-sm mt-1">Cross-Chain</p>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 bg-[#00150E] bg-opacity-80 rounded-2xl p-6 border border-[#97FBE4]/30 shadow-md">
                <div className="flex flex-col justify-between h-full">
                  <p className="text-3xl font-light">📈</p>
                  <p className="text-sm mt-1">Integrated Yield</p>
                </div>
              </div>
          
            </div>
          </div>
        </section>

        {/* Built for Agents + CompareDemo Section */}
        <section className="relative z-10 px-4 py-20">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left: Built for Agents */}
            <div>
              <h2 className="text-3xl font-light mb-4">Built for Agents</h2>
              <p className="text-[#97FBE4]/80 mb-8">
                Integrate payments in minutes, not months. Simple, powerful APIs that just work without KYC.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 border border-[#97FBE4]/30 flex items-center justify-center mt-1">
                    <div className="w-2 h-2 bg-[#97FBE4]/50" />
                  </div>
                  <div>
                    <p className="font-medium">Quick Setup</p>
                    <p className="text-sm text-[#97FBE4]/80">No KYC, No AML, No ID</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 border border-[#97FBE4]/30 flex items-center justify-center mt-1">
                    <div className="w-2 h-2 bg-[#97FBE4]/50" />
                  </div>
                  <div>
                    <p className="font-medium">Compilant Privacy</p>
                    <p className="text-sm text-[#97FBE4]/80">Hide your revenue from competitors</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 border border-[#97FBE4]/30 flex items-center justify-center mt-1">
                    <div className="w-2 h-2 bg-[#97FBE4]/50" />
                  </div>
                  <div>
                    <p className="font-medium">Instant Payments</p>
                    <p className="text-sm text-[#97FBE4]/80">Receive payments in any token from any chain</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Right: CompareDemo */}
            <div className="flex justify-center items-center">
              <CompareDemo />
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="relative z-10 px-4 py-20 border-t border-[#97FBE4]/20">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-light mb-12 text-center">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border border-[#97FBE4]/30 rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-[#00150E]/30 transition-all duration-300"
                  >
                    <span className="font-medium">{faq.q}</span>
                    <span className="text-2xl">{expandedFaq === index ? "−" : "+"}</span>
                  </button>
                  {expandedFaq === index && (
                    <div className="px-6 pb-6 text-[#97FBE4]/80">{faq.a}</div>
                  )}
                </div>
              ))}
            </div>
        </div>
        </section>
      </main>
      {/* Footer */}
      <footer className="w-full border-t border-[#97FBE4]/20 py-6 flex items-center justify-between px-4 max-w-3xl mx-auto">
        <span className="text-lg font-bold tracking-tight">HYPE</span>
        <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="flex items-center">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#97FBE4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 4 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 21.13V25"/></svg>
        </a>
      </footer>
    </div>
  );
}
