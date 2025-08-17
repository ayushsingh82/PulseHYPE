"use client";
import React from "react";
import Link from "next/link";
import { Compare } from "../components/ui/compare";
import { motion } from "motion/react";
import { SparklesCore } from "../components/ui/sparkles";

function CompareDemo() {
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
  const [expandedFaq, setExpandedFaq] = React.useState<number | null>(null);

  return (
    <div className="min-h-screen bg-black text-[#97FBE4] overflow-hidden flex flex-col relative">
      {/* Background Sparkles */}
      <div className="absolute inset-0 w-full h-full">
        <SparklesCore
          id="tsparticles"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="w-full h-full"
          particleColor="#97FBE4"
        />
      </div>
      
      {/* Main Content */}
      <main className="flex-1 relative z-10">
        {/* Hero Section */}
        <section className="relative z-10 px-4 pb-20">
          <div className="max-w-5xl mx-auto">
            <motion.div 
              className="mb-16 pt-12"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.h1 
                className="text-4xl md:text-6xl font-light mb-4 tracking-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <motion.span 
                  className="block text-[#97FBE4]"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  Universal Hype.
                </motion.span>
                <motion.span 
                  className="block text-[#5eead4]"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  For Everyone.
                </motion.span>
              </motion.h1>
              <motion.p 
                className="text-base md:text-lg text-[#97FBE4]/80 max-w-2xl pixel-font"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                The fastest, smartest way to swap, stake, and farm—powered by LiquidSwap route-finding and GlueX DeFi intelligence.
              </motion.p>
            </motion.div>

            {/* Bento Grid */}
            <motion.div 
              className="grid grid-cols-12 gap-4 auto-rows-[160px]"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
            >
              {/* Main Feature */}
              <motion.div 
                className="col-span-12 md:col-span-8 row-span-2 group relative glass-morphism rounded-2xl p-8 shadow-xl overflow-hidden card-hover"
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="relative z-10">
                  <motion.p 
                    className="text-sm text-[#97FBE4]/60 mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                  >
                    FEATURED
                  </motion.p>
                  <motion.h3 
                    className="text-3xl font-light mb-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.4 }}
                  >
                    Optimal Swaps & Yield
                  </motion.h3>
                  <motion.p 
                    className="text-[#97FBE4]/80 max-w-lg pixel-font"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.6 }}
                  >
                    Swap, bridge, and earn yield in one seamless flow. No more juggling dApps.
                  </motion.p>
                </div>
                <div className="absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-[#97FBE4] to-transparent w-full" />
                <motion.div 
                  className="absolute top-0 right-0 w-32 h-32 border border-[#97FBE4]/20 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
              
              {/* Live Stats */}
              <motion.div 
                className="col-span-12 md:col-span-4 row-span-2 bg-[#97FBE4] rounded-2xl p-8 relative overflow-hidden shadow-xl live-stats-box float-animation pulse-glow"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="flex flex-col justify-between h-full">
                  <div>
                    <motion.p 
                      className="text-sm mb-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.8 }}
                    >
                      LIVE
                    </motion.p>
                    <motion.p 
                      className="text-5xl font-light"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 2.0, type: "spring", stiffness: 200 }}
                    >
                      $1.2M+
                    </motion.p>
                    <motion.p 
                      className="text-sm mt-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 2.2 }}
                    >
                      TVL Secured
                    </motion.p>
                  </div>
                  <motion.div 
                    className="flex items-center space-x-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2.4 }}
                  >
                    <motion.div 
                      className="w-2 h-2 bg-black"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                    <span className="text-xs">Real-time</span>
                  </motion.div>
                </div>
                <motion.div 
                  className="absolute top-0 right-0 w-32 h-32 border border-black/10 -translate-y-1/2 translate-x-1/2"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
              {/* Feature Cards */}
              <motion.div 
                className="col-span-6 md:col-span-3 glass-morphism rounded-2xl p-6 shadow-md flex flex-col justify-center card-hover"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 2.6, type: "spring", stiffness: 200 }}
                whileHover={{ y: -8, scale: 1.05 }}
              >
                <h4 className="text-lg font-semibold mb-1 text-[#97FBE4]">Optimal Swaps</h4>
                <p className="text-xs text-[#97FBE4]/80">Get the best rates and lowest slippage with LiquidSwap route-finding.</p>
              </motion.div>
              
              <motion.div 
                className="col-span-6 md:col-span-3 bg-[#97FBE4] rounded-2xl p-6 border border-[#97FBE4]/30 shadow-md flex flex-col justify-center card-hover button-glow"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 2.8, type: "spring", stiffness: 200 }}
                whileHover={{ y: -8, scale: 1.05 }}
              >
                <h4 className="text-lg font-semibold mb-1 text-black">Cross-Chain</h4>
                <p className="text-xs text-black font-light pixel-font">Bridge and swap across chains in one seamless flow.</p>
              </motion.div>
              
              <motion.div 
                className="col-span-12 md:col-span-6 glass-morphism rounded-2xl p-6 shadow-md flex flex-col justify-center card-hover"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 3.0, type: "spring", stiffness: 200 }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <h4 className="text-lg font-semibold mb-1 text-[#22d3ee]">Integrated Yield</h4>
                <p className="text-xs text-[#97FBE4]/80">Stake, lend, and farm directly from your wallet.</p>
              </motion.div>

              {/* Transaction Simulator */}
              <motion.div 
                className="col-span-12 md:col-span-6 bg-[#FF6B6B] rounded-2xl p-6 shadow-md flex flex-col justify-center card-hover button-glow"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 3.2, type: "spring", stiffness: 200 }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">🔬</span>
                  <h4 className="text-lg font-semibold text-black">Transaction Simulator</h4>
                </div>
                <p className="text-xs text-black/80 font-light pixel-font mb-3">
                  Test, debug, and optimize HyperEVM transactions before execution.
                </p>
                <Link 
                  href="/simulator"
                  className="text-xs font-semibold text-black hover:text-black/80 transition-colors duration-300 inline-flex items-center gap-1"
                >
                  Try Simulator →
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Built for Agents + CompareDemo Section */}
        <motion.section 
          className="relative z-10 px-4 py-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left: Built for Agents */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <motion.h2 
                className="text-3xl font-light mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                Built for Agents
              </motion.h2>
              <motion.p 
                className="text-[#97FBE4]/80 mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                viewport={{ once: true }}
              >
                Integrate payments in minutes, not months. Simple, powerful APIs that just work without KYC.
              </motion.p>
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                viewport={{ once: true }}
              >
                {[
                  { title: "Quick Setup", desc: "No KYC, No AML, No ID" },
                  { title: "Compliant Privacy", desc: "Hide your revenue from competitors" },
                  { title: "Instant Payments", desc: "Receive payments in any token from any chain" }
                ].map((item, index) => (
                  <motion.div 
                    key={index}
                    className="flex items-start space-x-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 1.0 + index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ x: 10 }}
                  >
                    <motion.div 
                      className="w-6 h-6 border border-[#97FBE4]/30 flex items-center justify-center mt-1"
                      whileHover={{ scale: 1.2, borderColor: "#97FBE4" }}
                    >
                      <motion.div 
                        className="w-2 h-2 bg-[#97FBE4]/50"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                      />
                    </motion.div>
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-[#97FBE4]/80">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
            {/* Right: CompareDemo */}
            <motion.div 
              className="flex justify-center items-center"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <motion.div
                whileHover={{ scale: 1.05, rotateY: 5 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <CompareDemo />
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* FAQ Section */}
        <motion.section 
          className="relative z-10 px-4 py-20 border-t border-[#97FBE4]/20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="max-w-3xl mx-auto">
            <motion.h2 
              className="text-3xl font-light mb-12 text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Frequently Asked Questions
            </motion.h2>
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              {faqs.map((faq, index) => (
                <motion.div 
                  key={index} 
                  className="glass-morphism rounded-2xl overflow-hidden card-hover"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02 }}
                >
                  <motion.button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-[#00150E]/30 transition-all duration-300"
                    whileHover={{ backgroundColor: "rgba(0, 21, 14, 0.5)" }}
                  >
                    <span className="font-medium">{faq.q}</span>
                    <motion.span 
                      className="text-2xl"
                      animate={{ rotate: expandedFaq === index ? 45 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      +
                    </motion.span>
                  </motion.button>
                  <motion.div
                    initial={false}
                    animate={{
                      height: expandedFaq === index ? "auto" : 0,
                      opacity: expandedFaq === index ? 1 : 0
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    style={{ overflow: "hidden" }}
                  >
                    <motion.div 
                      className="px-6 pb-6 text-[#97FBE4]/80"
                      initial={{ y: -10 }}
                      animate={{ y: expandedFaq === index ? 0 : -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      {faq.a}
                    </motion.div>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
        </div>
        </motion.section>
      </main>
      {/* Footer */}
      <motion.footer 
        className="w-full border-t border-[#97FBE4]/20 py-6 flex items-center justify-between px-4 max-w-3xl mx-auto relative z-10"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <motion.span 
          className="text-lg font-bold tracking-tight"
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          HYPE
        </motion.span>
        <motion.a 
          href="https://github.com/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center"
          whileHover={{ scale: 1.2, rotate: 360 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#97FBE4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 4 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 21.13V25"/>
          </svg>
        </motion.a>
      </motion.footer>
    </div>
  );
}
