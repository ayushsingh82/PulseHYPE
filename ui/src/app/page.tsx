import Navbar from "../components/Navbar";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 py-12 gap-12">
      {/* Navbar (for demo, already in layout) */}
      {/* <Navbar /> */}

      {/* Headline - Big Box */}
      <header className="w-full max-w-4xl text-center flex flex-col gap-4 py-12 bg-[#00150E] bg-opacity-80 rounded-3xl shadow-2xl border border-[#97FBE4]/30 mb-4">
        <h1 className="text-5xl sm:text-6xl font-bold mb-2 text-white">Trade. Bridge. Earn. All in One Place.</h1>
        <p className="text-2xl sm:text-3xl font-medium">The fastest, smartest way to swap, stake, and farm—powered by <span className="text-white font-bold">LiquidSwap</span> route-finding and <span className="text-white font-bold">GlueX</span> DeFi intelligence.</p>
      </header>

      {/* Hero Section (CTA) - Small Box */}
      <section className="w-full max-w-xl flex flex-col items-center gap-6 py-8 bg-[#00150E] bg-opacity-70 rounded-2xl shadow-xl border border-[#97FBE4]/20">
        <div className="text-xl sm:text-2xl font-semibold flex flex-col items-center gap-2 text-white drop-shadow-lg">
          <span>⚡ Optimal Swaps • One-Click Yield • Cross-Chain Ready</span>
        </div>
        <p className="text-lg sm:text-xl text-center">Get the best rates, lowest slippage, and integrated yield opportunities without juggling multiple apps.</p>
        <button className="mt-2 px-8 py-3 rounded-full bg-[#00150E] text-[#97FBE4] font-bold text-lg shadow-lg hover:bg-[#003d2a] transition border-2 border-[#97FBE4]">Start Now</button>
      </section>

      {/* Problem Statement - Big Box */}
      <section className="w-full max-w-3xl flex flex-col gap-4 bg-[#00150E] bg-opacity-80 rounded-3xl p-10 shadow-2xl border border-[#97FBE4]/30">
        <h2 className="text-3xl font-bold mb-2 text-white">DeFi is powerful, but messy:</h2>
        <ul className="list-disc list-inside text-xl flex flex-col gap-1">
          <li>You have to check multiple DEXs for the best swap route.</li>
          <li>Bridging and staking take multiple transactions.</li>
          <li>Yield opportunities are scattered across protocols.</li>
        </ul>
        <p className="mt-2 font-semibold">We fixed that.</p>
      </section>

      {/* How It Works (3 Steps) - Small Boxes */}
      <section className="w-full max-w-4xl flex flex-col gap-6">
        <h2 className="text-3xl font-bold mb-2 text-white">How It Works</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          <div className="flex flex-col items-center bg-[#00150E] bg-opacity-70 rounded-2xl p-6 shadow-lg border border-[#97FBE4]/20">
            <span className="text-3xl font-bold mb-2 text-white">1️⃣</span>
            <h3 className="text-xl font-semibold mb-1 text-white">Find the Best Route</h3>
            <p className="text-center">Enter the tokens you want to swap—our <span className="text-white font-bold">LiquidSwap</span> integration finds the most efficient multi-hop route across multiple liquidity sources.</p>
          </div>
          <div className="flex flex-col items-center bg-[#00150E] bg-opacity-70 rounded-2xl p-6 shadow-lg border border-[#97FBE4]/20">
            <span className="text-3xl font-bold mb-2 text-white">2️⃣</span>
            <h3 className="text-xl font-semibold mb-1 text-white">Take Action</h3>
            <p className="text-center">With <span className="text-white font-bold">GlueX Router</span>, perform swaps, bridges, and staking in one seamless flow—no manual juggling.</p>
          </div>
          <div className="flex flex-col items-center bg-[#00150E] bg-opacity-70 rounded-2xl p-6 shadow-lg border border-[#97FBE4]/20">
            <span className="text-3xl font-bold mb-2 text-white">3️⃣</span>
            <h3 className="text-xl font-semibold mb-1 text-white">Earn Smarter</h3>
            <p className="text-center">Access real-time <span className="text-white font-bold">APY, TVL</span>, and liquidity analytics to make informed yield farming decisions.</p>
          </div>
        </div>
      </section>

      {/* Features - Big Box */}
      <section className="w-full max-w-4xl flex flex-col gap-4 bg-[#00150E] bg-opacity-80 rounded-3xl p-10 shadow-2xl border border-[#97FBE4]/30">
        <h2 className="text-3xl font-bold mb-2 text-white">Features</h2>
        <ul className="list-disc list-inside text-xl flex flex-col gap-1">
          <li><b>Smart Route Finding</b> – Powered by LiquidSwap’s v2 API for optimal trade execution.</li>
          <li><b>Cross-Chain Liquidity</b> – Swap and bridge across chains effortlessly.</li>
          <li><b>Integrated Yield</b> – Stake, lend, and farm directly from your wallet.</li>
          <li><b>Real-Time Data</b> – GlueX analytics show live rates, pool sizes, and historical yield.</li>
          <li><b>Revenue Sharing</b> – Built-in fee collection for DAO, projects, or power users.</li>
        </ul>
      </section>

      {/* Example User Flow - Small Box */}
      <section className="w-full max-w-xl flex flex-col gap-4 bg-[#00150E] bg-opacity-70 rounded-2xl p-8 shadow-xl border border-[#97FBE4]/30">
        <h2 className="text-2xl font-bold mb-2 text-white">Example User Flow</h2>
        <p><b className="text-white">Sam swaps USDC → LINK using our app:</b></p>
        <ul className="list-disc list-inside text-lg flex flex-col gap-1">
          <li>LiquidSwap finds the cheapest, fastest route.</li>
          <li>GlueX bundles the swap + staking in one transaction.</li>
          <li>Sam is now earning yield on her LINK without touching another dApp.</li>
        </ul>
      </section>

      {/* For Developers & Power Users - Big Box */}
      <section className="w-full max-w-3xl flex flex-col gap-4 bg-[#00150E] bg-opacity-80 rounded-3xl p-10 shadow-2xl border border-[#97FBE4]/30">
        <h2 className="text-3xl font-bold mb-2 text-white">For Developers & Power Users</h2>
        <ul className="list-disc list-inside text-xl flex flex-col gap-1">
          <li>Plug in your own fee recipient to monetize swaps.</li>
          <li>Whitelabel the swap UI for your community.</li>
          <li>Build automated strategies leveraging both APIs.</li>
        </ul>
      </section>

      {/* Call To Action (Final) - Small Box */}
      <section className="w-full max-w-xl flex flex-col items-center gap-6 mt-8 py-8 bg-[#00150E] bg-opacity-70 rounded-2xl shadow-xl border border-[#97FBE4]/20">
        <h2 className="text-3xl font-bold text-center text-white">DeFi without friction.</h2>
        <p className="text-lg text-center">Join traders, yield farmers, and DAOs already using our unified DeFi terminal.</p>
        <div className="flex gap-4">
          <button className="px-8 py-3 rounded-full bg-[#00150E] text-white font-bold text-lg shadow-lg hover:bg-[#003d2a] transition border-2 border-[#97FBE4]">Launch App</button>
          <button className="px-8 py-3 rounded-full border-2 border-[#97FBE4] text-[#97FBE4] font-bold text-lg hover:bg-[#00150E] transition">Join Waitlist</button>
        </div>
      </section>
    </div>
  );
}
