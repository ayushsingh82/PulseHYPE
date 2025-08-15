import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 py-12 gap-16">
      {/* Headline */}
      <header className="w-full max-w-3xl text-center flex flex-col gap-4">
        <h1 className="text-4xl sm:text-5xl font-bold mb-2">Trade. Bridge. Earn. All in One Place.</h1>
        <p className="text-xl sm:text-2xl font-medium">The fastest, smartest way to swap, stake, and farm—powered by LiquidSwap route-finding and GlueX DeFi intelligence.</p>
      </header>

      {/* Hero Section (CTA) */}
      <section className="w-full max-w-2xl flex flex-col items-center gap-6">
        <div className="text-lg sm:text-xl font-semibold flex flex-col items-center gap-2">
          <span>⚡ Optimal Swaps • One-Click Yield • Cross-Chain Ready</span>
        </div>
        <p className="text-base sm:text-lg text-center">Get the best rates, lowest slippage, and integrated yield opportunities without juggling multiple apps.</p>
        <button className="mt-2 px-8 py-3 rounded-full bg-[#00150E] text-[#97FBE4] font-bold text-lg shadow-lg hover:bg-[#003d2a] transition">Start Now</button>
      </section>

      {/* Problem Statement */}
      <section className="w-full max-w-2xl flex flex-col gap-4 bg-[#00150E] bg-opacity-60 rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-2">DeFi is powerful, but messy:</h2>
        <ul className="list-disc list-inside text-lg flex flex-col gap-1">
          <li>You have to check multiple DEXs for the best swap route.</li>
          <li>Bridging and staking take multiple transactions.</li>
          <li>Yield opportunities are scattered across protocols.</li>
        </ul>
        <p className="mt-2 font-semibold">We fixed that.</p>
      </section>

      {/* How It Works (3 Steps) */}
      <section className="w-full max-w-3xl flex flex-col gap-6">
        <h2 className="text-2xl font-bold mb-2">How It Works</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          <div className="flex flex-col items-center bg-[#00150E] bg-opacity-60 rounded-lg p-4">
            <span className="text-3xl font-bold mb-2">1️⃣</span>
            <h3 className="text-lg font-semibold mb-1">Find the Best Route</h3>
            <p className="text-center">Enter the tokens you want to swap—our LiquidSwap integration finds the most efficient multi-hop route across multiple liquidity sources.</p>
          </div>
          <div className="flex flex-col items-center bg-[#00150E] bg-opacity-60 rounded-lg p-4">
            <span className="text-3xl font-bold mb-2">2️⃣</span>
            <h3 className="text-lg font-semibold mb-1">Take Action</h3>
            <p className="text-center">With GlueX Router, perform swaps, bridges, and staking in one seamless flow—no manual juggling.</p>
          </div>
          <div className="flex flex-col items-center bg-[#00150E] bg-opacity-60 rounded-lg p-4">
            <span className="text-3xl font-bold mb-2">3️⃣</span>
            <h3 className="text-lg font-semibold mb-1">Earn Smarter</h3>
            <p className="text-center">Access real-time APY, TVL, and liquidity analytics to make informed yield farming decisions.</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="w-full max-w-3xl flex flex-col gap-4">
        <h2 className="text-2xl font-bold mb-2">Features</h2>
        <ul className="list-disc list-inside text-lg flex flex-col gap-1">
          <li><b>Smart Route Finding</b> – Powered by LiquidSwap’s v2 API for optimal trade execution.</li>
          <li><b>Cross-Chain Liquidity</b> – Swap and bridge across chains effortlessly.</li>
          <li><b>Integrated Yield</b> – Stake, lend, and farm directly from your wallet.</li>
          <li><b>Real-Time Data</b> – GlueX analytics show live rates, pool sizes, and historical yield.</li>
          <li><b>Revenue Sharing</b> – Built-in fee collection for DAO, projects, or power users.</li>
        </ul>
      </section>

      {/* Example User Flow */}
      <section className="w-full max-w-2xl flex flex-col gap-4 bg-[#00150E] bg-opacity-60 rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-2">Example User Flow</h2>
        <p><b>Sam swaps USDC → LINK using our app:</b></p>
        <ul className="list-disc list-inside text-lg flex flex-col gap-1">
          <li>LiquidSwap finds the cheapest, fastest route.</li>
          <li>GlueX bundles the swap + staking in one transaction.</li>
          <li>Sam is now earning yield on her LINK without touching another dApp.</li>
        </ul>
      </section>

      {/* For Developers & Power Users */}
      <section className="w-full max-w-3xl flex flex-col gap-4">
        <h2 className="text-2xl font-bold mb-2">For Developers & Power Users</h2>
        <ul className="list-disc list-inside text-lg flex flex-col gap-1">
          <li>Plug in your own fee recipient to monetize swaps.</li>
          <li>Whitelabel the swap UI for your community.</li>
          <li>Build automated strategies leveraging both APIs.</li>
        </ul>
      </section>

      {/* Call To Action (Final) */}
      <section className="w-full max-w-2xl flex flex-col items-center gap-6 mt-8">
        <h2 className="text-3xl font-bold text-center">DeFi without friction.</h2>
        <p className="text-lg text-center">Join traders, yield farmers, and DAOs already using our unified DeFi terminal.</p>
        <div className="flex gap-4">
          <button className="px-8 py-3 rounded-full bg-[#00150E] text-[#97FBE4] font-bold text-lg shadow-lg hover:bg-[#003d2a] transition">Launch App</button>
          <button className="px-8 py-3 rounded-full border-2 border-[#97FBE4] text-[#97FBE4] font-bold text-lg hover:bg-[#00150E] transition">Join Waitlist</button>
        </div>
      </section>
    </div>
  );
}
