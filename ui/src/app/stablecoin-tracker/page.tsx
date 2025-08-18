"use client";
import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { SparklesCore } from "../../components/ui/sparkles";
import { StablecoinDashboard } from "../../components/StablecoinDashboard";

export default function StablecoinTrackerPage() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 w-full h-full">
        <SparklesCore
          id="stablecoinparticles"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="w-full h-full"
          particleColor="#22c55e"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-emerald-400 via-green-500 to-teal-400 bg-clip-text text-transparent">
              HyperEVM
            </span>{" "}
            Stablecoin Tracker
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Comprehensive stablecoin analytics for the HyperEVM ecosystem. 
            Track supply, holders, protocol distribution, and rehypothecation rates.
          </p>
          
          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            <div className="bg-emerald-500/10 p-4 rounded-lg border border-emerald-500/20">
              <div className="text-2xl mb-2">📊</div>
              <h3 className="font-semibold text-emerald-400 mb-1">Supply Tracking</h3>
              <p className="text-gray-300 text-xs">
                Real-time total supply and growth trajectories
              </p>
            </div>
            <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/20">
              <div className="text-2xl mb-2">👥</div>
              <h3 className="font-semibold text-blue-400 mb-1">Holder Analytics</h3>
              <p className="text-gray-300 text-xs">
                Track unique holders per stablecoin
              </p>
            </div>
            <div className="bg-purple-500/10 p-4 rounded-lg border border-purple-500/20">
              <div className="text-2xl mb-2">🏦</div>
              <h3 className="font-semibold text-purple-400 mb-1">Protocol Distribution</h3>
              <p className="text-gray-300 text-xs">
                Which protocols hold the most stablecoins
              </p>
            </div>
            <div className="bg-orange-500/10 p-4 rounded-lg border border-orange-500/20">
              <div className="text-2xl mb-2">🔄</div>
              <h3 className="font-semibold text-orange-400 mb-1">Rehypothecation</h3>
              <p className="text-gray-300 text-xs">
                Track rehypothecation rates across protocols
              </p>
            </div>
          </div>
        </motion.div>

        <StablecoinDashboard />
      </div>
    </div>
  );
}