/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import { motion } from "motion/react";
import { SparklesCore } from "../../components/ui/sparkles";
import { getRoute, findPools, getTokens, getBalances } from "./helper";

export default function LiquidLabsRouteDemo() {
  // Route API state
  const [tokenIn, setTokenIn] = useState("");
  const [tokenOut, setTokenOut] = useState("");
  const [amountIn, setAmountIn] = useState("");
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Find Pools state
  const [poolTokenA, setPoolTokenA] = useState("");
  const [poolTokenB, setPoolTokenB] = useState("");
  const [poolsResponse, setPoolsResponse] = useState<any>(null);
  const [poolsLoading, setPoolsLoading] = useState(false);
  const [poolsError, setPoolsError] = useState("");

  // Token List state
  const [tokenSearch, setTokenSearch] = useState("");
  const [tokenLimit, setTokenLimit] = useState("");
  const [tokensResponse, setTokensResponse] = useState<any>(null);
  const [tokensLoading, setTokensLoading] = useState(false);
  const [tokensError, setTokensError] = useState("");

  // Token Balances state
  const [wallet, setWallet] = useState("");
  const [balancesResponse, setBalancesResponse] = useState<any>(null);
  const [balancesLoading, setBalancesLoading] = useState(false);
  const [balancesError, setBalancesError] = useState("");

  // Route API handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResponse(null);
    try {
      const data = await getRoute(tokenIn, tokenOut, amountIn);
      setResponse(data);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  // Find Pools handler
  const handlePools = async (e: React.FormEvent) => {
    e.preventDefault();
    setPoolsLoading(true);
    setPoolsError("");
    setPoolsResponse(null);
    try {
      const data = await findPools(poolTokenA, poolTokenB);
      setPoolsResponse(data);
    } catch (err: any) {
      setPoolsError(err.message || "Unknown error");
    } finally {
      setPoolsLoading(false);
    }
  };

  // Token List handler
  const handleTokens = async (e: React.FormEvent) => {
    e.preventDefault();
    setTokensLoading(true);
    setTokensError("");
    setTokensResponse(null);
    try {
      const data = await getTokens(tokenSearch, tokenLimit);
      setTokensResponse(data);
    } catch (err: any) {
      setTokensError(err.message || "Unknown error");
    } finally {
      setTokensLoading(false);
    }
  };

  // Token Balances handler
  const handleBalances = async (e: React.FormEvent) => {
    e.preventDefault();
    setBalancesLoading(true);
    setBalancesError("");
    setBalancesResponse(null);
    try {
      const data = await getBalances(wallet);
      setBalancesResponse(data);
    } catch (err: any) {
      setBalancesError(err.message || "Unknown error");
    } finally {
      setBalancesLoading(false);
    }
  };

  const [selectedBox, setSelectedBox] = useState(0);
  const boxTitles = [
    "Route API Demo",
    "Find Pools",
    "Token List",
    "Token Balances"
  ];

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 py-12 gap-10 relative">
      {/* Background Sparkles */}
      <div className="absolute inset-0 w-full h-full">
        <SparklesCore
          id="liquidlabs-particles"
          background="transparent"
          minSize={0.4}
          maxSize={1.0}
          particleDensity={50}
          className="w-full h-full"
          particleColor="#97FBE4"
        />
      </div>

      {/* Page Title */}
      <motion.div 
        className="text-center mb-8 relative z-10"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1 
          className="text-4xl md:text-6xl font-bold text-[#97FBE4] mb-4"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          LiquidLabs Demo
        </motion.h1>
        <motion.p 
          className="text-lg text-[#97FBE4]/80 pixel-font"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Test LiquidLabs Routing & Pool APIs
        </motion.p>
      </motion.div>

      {/* Toggle Tabs */}
      <div className="w-full max-w-xl flex gap-2 mb-4 z-10">
        {boxTitles.map((title, idx) => (
          <button
            key={title}
            onClick={() => setSelectedBox(idx)}
            className={`flex-1 py-2 rounded-lg font-bold transition-all ${selectedBox === idx ? 'bg-[#97FBE4] text-black' : 'bg-[#00150E] text-[#97FBE4] border border-[#97FBE4]/30'}`}
          >
            {title}
          </button>
        ))}
      </div>

      {/* Boxes */}
      <div className="w-full max-w-xl flex flex-col gap-8 z-10">
        {selectedBox === 0 && (
          <motion.div 
            className="w-full max-w-xl glass-morphism rounded-2xl shadow-2xl p-8 flex flex-col gap-6 relative z-10 card-hover"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            whileHover={{ y: -5, scale: 1.02 }}
          >
            <motion.h1 
              className="text-3xl font-bold text-[#97FBE4] mb-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              Route API Demo
            </motion.h1>
            <motion.form 
              onSubmit={handleSubmit} 
              className="flex flex-col gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.0 }}
            >
              {[
                { label: "Token In Address", value: tokenIn, setter: setTokenIn, type: "text" },
                { label: "Token Out Address", value: tokenOut, setter: setTokenOut, type: "text" },
                { label: "Amount In", value: amountIn, setter: setAmountIn, type: "number" }
              ].map((field, index) => (
                <motion.label 
                  key={field.label}
                  className="text-[#97FBE4] font-semibold"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 1.2 + index * 0.1 }}
                >
                  {field.label}
                  <motion.input
                    className="w-full mt-1 p-3 rounded-lg bg-black/50 text-white border border-[#97FBE4]/40 focus:outline-none focus:border-[#97FBE4] focus:ring-2 focus:ring-[#97FBE4]/20 transition-all duration-300"
                    value={field.value}
                    onChange={e => field.setter(e.target.value)}
                    required
                    type={field.type}
                    min={field.type === "number" ? "0" : undefined}
                    step={field.type === "number" ? "any" : undefined}
                    whileFocus={{ scale: 1.02, borderColor: "#97FBE4" }}
                  />
                </motion.label>
              ))}
              <motion.button
                type="submit"
                className="api-btn mt-2 px-6 py-3 rounded-full bg-[#97FBE4] text-black font-bold text-lg shadow-lg hover:bg-[#7be3c7] transition-all duration-300 button-glow"
                disabled={loading}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 1.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {loading ? (
                  <motion.span 
                    className="loading-dots"
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    Loading
                  </motion.span>
                ) : (
                  "Get Route"
                )}
              </motion.button>
            </motion.form>
            {error && (
              <motion.div 
                className="text-red-400 font-bold bg-red-900/20 p-3 rounded-lg border border-red-400/30"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                Error: {error}
              </motion.div>
            )}
            {response && (
              <motion.pre 
                className="bg-black/70 text-[#97FBE4] rounded-lg p-4 overflow-x-auto text-xs max-h-96 border border-[#97FBE4]/20"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.5 }}
              >
                {JSON.stringify(response, null, 2)}
              </motion.pre>
            )}
          </motion.div>
        )}
        {selectedBox === 1 && (
          <motion.div 
            className="w-full max-w-xl glass-morphism rounded-2xl shadow-2xl p-8 flex flex-col gap-6 relative z-10 card-hover"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.8 }}
            whileHover={{ y: -5, scale: 1.02 }}
          >
            <motion.h2 
              className="text-2xl font-bold text-[#97FBE4] mb-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 2.0 }}
            >
              Find Pools for Token Pair
            </motion.h2>
            <motion.form 
              onSubmit={handlePools} 
              className="flex flex-col gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 2.2 }}
            >
              {[
                { label: "Token A Address", value: poolTokenA, setter: setPoolTokenA },
                { label: "Token B Address", value: poolTokenB, setter: setPoolTokenB }
              ].map((field, index) => (
                <motion.label 
                  key={field.label}
                  className="text-[#97FBE4] font-semibold"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 2.4 + index * 0.1 }}
                >
                  {field.label}
                  <motion.input
                    className="w-full mt-1 p-3 rounded-lg bg-black/50 text-white border border-[#97FBE4]/40 focus:outline-none focus:border-[#97FBE4] focus:ring-2 focus:ring-[#97FBE4]/20 transition-all duration-300"
                    value={field.value}
                    onChange={e => field.setter(e.target.value)}
                    required
                    whileFocus={{ scale: 1.02, borderColor: "#97FBE4" }}
                  />
                </motion.label>
              ))}
              <motion.button
                type="submit"
                className="api-btn mt-2 px-6 py-3 rounded-full bg-[#97FBE4] text-black font-bold text-lg shadow-lg hover:bg-[#7be3c7] transition-all duration-300 button-glow"
                disabled={poolsLoading}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 2.6 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {poolsLoading ? (
                  <motion.span 
                    className="loading-dots"
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    Loading
                  </motion.span>
                ) : (
                  "Find Pools"
                )}
              </motion.button>
            </motion.form>
            {poolsError && (
              <motion.div 
                className="text-red-400 font-bold bg-red-900/20 p-3 rounded-lg border border-red-400/30"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                Error: {poolsError}
              </motion.div>
            )}
            {poolsResponse && (
              <motion.pre 
                className="bg-black/70 text-[#97FBE4] rounded-lg p-4 overflow-x-auto text-xs max-h-96 border border-[#97FBE4]/20"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.5 }}
              >
                {JSON.stringify(poolsResponse, null, 2)}
              </motion.pre>
            )}
          </motion.div>
        )}
        {selectedBox === 2 && (
          <motion.div 
            className="w-full max-w-xl glass-morphism rounded-2xl shadow-2xl p-8 flex flex-col gap-6 relative z-10 card-hover"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 2.8 }}
            whileHover={{ y: -5, scale: 1.02 }}
          >
            <motion.h2 
              className="text-2xl font-bold text-[#97FBE4] mb-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 3.0 }}
            >
              Token List
            </motion.h2>
            <motion.form 
              onSubmit={handleTokens} 
              className="flex flex-col gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 3.2 }}
            >
              {[
                { label: "Search (address, name, or symbol)", value: tokenSearch, setter: setTokenSearch, required: false },
                { label: "Limit", value: tokenLimit, setter: setTokenLimit, type: "number", required: false }
              ].map((field, index) => (
                <motion.label 
                  key={field.label}
                  className="text-[#97FBE4] font-semibold"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 3.4 + index * 0.1 }}
                >
                  {field.label}
                  <motion.input
                    className="w-full mt-1 p-3 rounded-lg bg-black/50 text-white border border-[#97FBE4]/40 focus:outline-none focus:border-[#97FBE4] focus:ring-2 focus:ring-[#97FBE4]/20 transition-all duration-300"
                    value={field.value}
                    onChange={e => field.setter(e.target.value)}
                    type={field.type || "text"}
                    min={field.type === "number" ? "1" : undefined}
                    required={field.required}
                    whileFocus={{ scale: 1.02, borderColor: "#97FBE4" }}
                  />
                </motion.label>
              ))}
              <motion.button
                type="submit"
                className="api-btn mt-2 px-6 py-3 rounded-full bg-[#97FBE4] text-black font-bold text-lg shadow-lg hover:bg-[#7be3c7] hover:text-black transition-all duration-300 button-glow"
                disabled={tokensLoading}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 3.6 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {tokensLoading ? (
                  <motion.span 
                    className="loading-dots"
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    Loading
                  </motion.span>
                ) : (
                  "Get Tokens"
                )}
              </motion.button>
            </motion.form>
            {tokensError && (
              <motion.div 
                className="text-red-400 font-bold bg-red-900/20 p-3 rounded-lg border border-red-400/30"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                Error: {tokensError}
              </motion.div>
            )}
            {tokensResponse && (
              <motion.pre 
                className="bg-black/70 text-[#97FBE4] rounded-lg p-4 overflow-x-auto text-xs max-h-96 border border-[#97FBE4]/20"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.5 }}
              >
                {JSON.stringify(tokensResponse, null, 2)}
              </motion.pre>
            )}
          </motion.div>
        )}
        {selectedBox === 3 && (
          <motion.div 
            className="w-full max-w-xl glass-morphism rounded-2xl shadow-2xl p-8 flex flex-col gap-6 relative z-10 card-hover"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 3.8 }}
            whileHover={{ y: -5, scale: 1.02 }}
          >
            <motion.h2 
              className="text-2xl font-bold text-[#97FBE4] mb-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 4.0 }}
            >
              Token Balances
            </motion.h2>
            <motion.form 
              onSubmit={handleBalances} 
              className="flex flex-col gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 4.2 }}
            >
              <motion.label 
                className="text-[#97FBE4] font-semibold"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 4.4 }}
              >
                Wallet Address
                <motion.input
                  className="w-full mt-1 p-3 rounded-lg bg-black/50 text-white border border-[#97FBE4]/40 focus:outline-none focus:border-[#97FBE4] focus:ring-2 focus:ring-[#97FBE4]/20 transition-all duration-300"
                  value={wallet}
                  onChange={e => setWallet(e.target.value)}
                  required
                  whileFocus={{ scale: 1.02, borderColor: "#97FBE4" }}
                />
              </motion.label>
              <motion.button
                type="submit"
                className="api-btn mt-2 px-6 py-3 rounded-full bg-[#97FBE4] text-black font-bold text-lg shadow-lg hover:bg-[#7be3c7] transition-all duration-300 button-glow"
                disabled={balancesLoading}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 4.6 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {balancesLoading ? (
                  <motion.span 
                    className="loading-dots"
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    Loading
                  </motion.span>
                ) : (
                  "Get Balances"
                )}
              </motion.button>
            </motion.form>
            {balancesError && (
              <motion.div 
                className="text-red-400 font-bold bg-red-900/20 p-3 rounded-lg border border-red-400/30"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                Error: {balancesError}
              </motion.div>
            )}
            {balancesResponse && (
              <motion.pre 
                className="bg-black/70 text-[#97FBE4] rounded-lg p-4 overflow-x-auto text-xs max-h-96 border border-[#97FBE4]/20"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.5 }}
              >
                {JSON.stringify(balancesResponse, null, 2)}
              </motion.pre>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
