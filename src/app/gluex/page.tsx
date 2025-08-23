/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import { motion } from "motion/react";
import { SparklesCore } from "../../components/ui/sparkles";
import { getActiveProtocols, getHistoricalApy, getDilutedApy, getExchangeRates } from "./helper";

export default function GluexDemo() {
  // Active Protocols
  const [activeProtocols, setActiveProtocols] = useState<any>(null);
  const [activeLoading, setActiveLoading] = useState(false);
  const [activeError, setActiveError] = useState("");

  // Historical APY
  const [histParams, setHistParams] = useState({ pool_address: "", lp_token_address: "", chain: "", input_token: "" });
  const [histResponse, setHistResponse] = useState<any>(null);
  const [histLoading, setHistLoading] = useState(false);
  const [histError, setHistError] = useState("");

  // Diluted APY
  const [diluteParams, setDiluteParams] = useState({ pool_address: "", lp_token_address: "", chain: "", input_token: "", input_amount: "" });
  const [diluteResponse, setDiluteResponse] = useState<any>(null);
  const [diluteLoading, setDiluteLoading] = useState(false);
  const [diluteError, setDiluteError] = useState("");

  // Exchange Rates
  const [exchangeParams, setExchangeParams] = useState([{ domestic_blockchain: "", domestic_token: "", foreign_blockchain: "", foreign_token: "" }]);
  const [exchangeResponse, setExchangeResponse] = useState<any>(null);
  const [exchangeLoading, setExchangeLoading] = useState(false);
  const [exchangeError, setExchangeError] = useState("");

  // Handlers
  const handleActiveProtocols = async () => {
    setActiveLoading(true); setActiveError(""); setActiveProtocols(null);
    try {
      const data = await getActiveProtocols();
      setActiveProtocols(data);
    } catch (err: any) {
      setActiveError(err.message || "Unknown error");
    } finally {
      setActiveLoading(false);
    }
  };

  const handleHist = async (e: React.FormEvent) => {
    e.preventDefault(); setHistLoading(true); setHistError(""); setHistResponse(null);
    try {
      const data = await getHistoricalApy(histParams);
      setHistResponse(data);
    } catch (err: any) {
      setHistError(err.message || "Unknown error");
    } finally {
      setHistLoading(false);
    }
  };

  const handleDilute = async (e: React.FormEvent) => {
    e.preventDefault(); setDiluteLoading(true); setDiluteError(""); setDiluteResponse(null);
    try {
      const data = await getDilutedApy(diluteParams);
      setDiluteResponse(data);
    } catch (err: any) {
      setDiluteError(err.message || "Unknown error");
    } finally {
      setDiluteLoading(false);
    }
  };

  const handleExchange = async (e: React.FormEvent) => {
    e.preventDefault(); setExchangeLoading(true); setExchangeError(""); setExchangeResponse(null);
    try {
      const data = await getExchangeRates(exchangeParams);
      setExchangeResponse(data);
    } catch (err: any) {
      setExchangeError(err.message || "Unknown error");
    } finally {
      setExchangeLoading(false);
    }
  };

  const [selectedBox, setSelectedBox] = useState(0);
  const boxTitles = [
    "Active Protocols",
    "Historical APY",
    "Diluted APY",
    "Exchange Rates"
  ];

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 py-12 gap-10 relative">
      {/* Background Sparkles */}
      <div className="absolute inset-0 w-full h-full">
        <SparklesCore
          id="gluex-particles"
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
          GlueX Demo
        </motion.h1>
        <motion.p 
          className="text-lg text-[#97FBE4]/80 pixel-font"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Test GlueX DeFi Intelligence APIs
        </motion.p>
      </motion.div>

      {/* Toggle Tabs */}
      <div className="w-full max-w-xl flex gap-2 mb-4 z-10">
        {boxTitles.map((title, idx) => (
          <button
            key={title}
            onClick={() => setSelectedBox(idx)}
            className={`flex-1 py-2 rounded-lg font-bold transition-all ${selectedBox === idx ? 'bg-black text-white border border-[#ffffff]' : 'bg-[#00150E] text-[#97FBE4] border border-[#97FBE4]/30'}`}
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
            transition={{ duration: 0.18, delay: 0.01 }}
            whileHover={{ y: -5, scale: 1.02 }}
          >
            <motion.h1 
              className="text-3xl font-bold text-[#97FBE4] mb-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.12, delay: 0.01 }}
            >
              Active Protocols
            </motion.h1>
            <motion.button 
              onClick={handleActiveProtocols} 
              className="api-btn px-6 py-3 rounded-full bg-[#97FBE4] text-black font-bold text-lg shadow-lg hover:bg-[#7be3c7] transition-all duration-300 button-glow"
              disabled={activeLoading}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.12, delay: 0.01 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {activeLoading ? (
                <motion.span 
                  className="loading-dots"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  Loading
                </motion.span>
              ) : (
                "Fetch Active Protocols"
              )}
            </motion.button>
            {activeError && (
              <motion.div 
                className="text-red-400 font-bold bg-red-900/20 p-3 rounded-lg border border-red-400/30"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.1 }}
              >
                Error: {activeError}
              </motion.div>
            )}
            {activeProtocols && (
              <motion.pre 
                className="bg-black/70 text-[#97FBE4] rounded-lg p-4 overflow-x-auto text-xs max-h-96 border border-[#97FBE4]/20"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.1 }}
              >
                {JSON.stringify(activeProtocols, null, 2)}
              </motion.pre>
            )}
          </motion.div>
        )}
        {selectedBox === 1 && (
          <motion.div 
            className="w-full max-w-xl glass-morphism rounded-2xl shadow-2xl p-8 flex flex-col gap-6 relative z-10 card-hover"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.18, delay: 0.01 }}
            whileHover={{ y: -5, scale: 1.02 }}
          >
            <motion.h2 
              className="text-2xl font-bold text-[#97FBE4] mb-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.12, delay: 0.01 }}
            >
              Historical APY
            </motion.h2>
            <motion.form 
              onSubmit={handleHist} 
              className="flex flex-col gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.12, delay: 0.01 }}
            >
              {[
                { label: "Pool Address", value: histParams.pool_address, key: "pool_address" },
                { label: "LP Token Address", value: histParams.lp_token_address, key: "lp_token_address" },
                { label: "Chain", value: histParams.chain, key: "chain" },
                { label: "Input Token", value: histParams.input_token, key: "input_token" }
              ].map((field, index) => (
                <motion.label 
                  key={field.key}
                  className="text-[#97FBE4] font-semibold"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.1, delay: 0.01 + index * 0.05 }}
                >
                  {field.label}
                  <motion.input 
                    className="w-full mt-1 p-3 rounded-lg bg-black/50 text-white border border-[#97FBE4]/40 focus:outline-none focus:border-[#97FBE4] focus:ring-2 focus:ring-[#97FBE4]/20 transition-all duration-300" 
                    value={field.value} 
                    onChange={e => setHistParams(p => ({ ...p, [field.key]: e.target.value }))} 
                    required 
                    whileFocus={{ scale: 1.02, borderColor: "#97FBE4" }}
                  />
                </motion.label>
              ))}
              <motion.button 
                type="submit" 
                className="api-btn px-6 py-3 rounded-full bg-[#97FBE4] text-black font-bold text-lg shadow-lg hover:bg-[#7be3c7] transition-all duration-300 button-glow" 
                disabled={histLoading}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.12, delay: 0.01 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {histLoading ? (
                  <motion.span 
                    className="loading-dots"
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  >
                    Loading
                  </motion.span>
                ) : (
                  "Get Historical APY"
                )}
              </motion.button>
            </motion.form>
            {histError && (
              <motion.div 
                className="text-red-400 font-bold bg-red-900/20 p-3 rounded-lg border border-red-400/30"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.1 }}
              >
                Error: {histError}
              </motion.div>
            )}
            {histResponse && (
              <motion.pre 
                className="bg-black/70 text-[#97FBE4] rounded-lg p-4 overflow-x-auto text-xs max-h-96 border border-[#97FBE4]/20"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.1 }}
              >
                {JSON.stringify(histResponse, null, 2)}
              </motion.pre>
            )}
          </motion.div>
        )}
        {selectedBox === 2 && (
          <motion.div 
            className="w-full max-w-xl glass-morphism rounded-2xl shadow-2xl p-8 flex flex-col gap-6 relative z-10 card-hover"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.18, delay: 0.01 }}
            whileHover={{ y: -5, scale: 1.02 }}
          >
            <motion.h2 
              className="text-2xl font-bold text-[#97FBE4] mb-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.12, delay: 0.01 }}
            >
              Diluted APY
            </motion.h2>
            <motion.form 
              onSubmit={handleDilute} 
              className="flex flex-col gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.12, delay: 0.01 }}
            >
              {[
                { label: "Pool Address", value: diluteParams.pool_address, key: "pool_address" },
                { label: "LP Token Address", value: diluteParams.lp_token_address, key: "lp_token_address" },
                { label: "Chain", value: diluteParams.chain, key: "chain" },
                { label: "Input Token", value: diluteParams.input_token, key: "input_token" },
                { label: "Input Amount", value: diluteParams.input_amount, key: "input_amount" }
              ].map((field, index) => (
                <motion.label 
                  key={field.key}
                  className="text-[#97FBE4] font-semibold"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.1, delay: 0.01 + index * 0.05 }}
                >
                  {field.label}
                  <motion.input 
                    className="w-full mt-1 p-3 rounded-lg bg-black/50 text-white border border-[#97FBE4]/40 focus:outline-none focus:border-[#97FBE4] focus:ring-2 focus:ring-[#97FBE4]/20 transition-all duration-300" 
                    value={field.value} 
                    onChange={e => setDiluteParams(p => ({ ...p, [field.key]: e.target.value }))} 
                    required 
                    whileFocus={{ scale: 1.02, borderColor: "#97FBE4" }}
                  />
                </motion.label>
              ))}
              <motion.button 
                type="submit" 
                className="api-btn px-6 py-3 rounded-full bg-[#97FBE4] text-black font-bold text-lg shadow-lg hover:bg-[#7be3c7] transition-all duration-300 button-glow" 
                disabled={diluteLoading}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.12, delay: 0.01 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {diluteLoading ? (
                  <motion.span 
                    className="loading-dots"
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  >
                    Loading
                  </motion.span>
                ) : (
                  "Get Diluted APY"
                )}
              </motion.button>
            </motion.form>
            {diluteError && (
              <motion.div 
                className="text-red-400 font-bold bg-red-900/20 p-3 rounded-lg border border-red-400/30"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.1 }}
              >
                Error: {diluteError}
              </motion.div>
            )}
            {diluteResponse && (
              <motion.pre 
                className="bg-black/70 text-[#97FBE4] rounded-lg p-4 overflow-x-auto text-xs max-h-96 border border-[#97FBE4]/20"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.1 }}
              >
                {JSON.stringify(diluteResponse, null, 2)}
              </motion.pre>
            )}
          </motion.div>
        )}
        {selectedBox === 3 && (
          <motion.div 
            className="w-full max-w-xl glass-morphism rounded-2xl shadow-2xl p-8 flex flex-col gap-6 relative z-10 card-hover"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.18, delay: 0.01 }}
            whileHover={{ y: -5, scale: 1.02 }}
          >
            <motion.h2 
              className="text-2xl font-bold text-[#97FBE4] mb-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.12, delay: 0.01 }}
            >
              Exchange Rates
            </motion.h2>
            <motion.form 
              onSubmit={handleExchange} 
              className="flex flex-col gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.12, delay: 0.01 }}
            >
              {[
                { label: "Domestic Blockchain", value: exchangeParams[0].domestic_blockchain, key: "domestic_blockchain" },
                { label: "Domestic Token", value: exchangeParams[0].domestic_token, key: "domestic_token" },
                { label: "Foreign Blockchain", value: exchangeParams[0].foreign_blockchain, key: "foreign_blockchain" },
                { label: "Foreign Token", value: exchangeParams[0].foreign_token, key: "foreign_token" }
              ].map((field, index) => (
                <motion.label 
                  key={field.key}
                  className="text-[#97FBE4] font-semibold"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.1, delay: 0.01 + index * 0.05 }}
                >
                  {field.label}
                  <motion.input 
                    className="w-full mt-1 p-3 rounded-lg bg-black/50 text-white border border-[#97FBE4]/40 focus:outline-none focus:border-[#97FBE4] focus:ring-2 focus:ring-[#97FBE4]/20 transition-all duration-300" 
                    value={field.value} 
                    onChange={e => setExchangeParams(p => [{ ...p[0], [field.key]: e.target.value }])} 
                    required 
                    whileFocus={{ scale: 1.02, borderColor: "#97FBE4" }}
                  />
                </motion.label>
              ))}
              <motion.button 
                type="submit" 
                className="api-btn px-6 py-3 rounded-full bg-[#97FBE4] text-black font-bold text-lg shadow-lg hover:bg-[#7be3c7] transition-all duration-300 button-glow" 
                disabled={exchangeLoading}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.12, delay: 0.01 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {exchangeLoading ? (
                  <motion.span 
                    className="loading-dots"
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  >
                    Loading
                  </motion.span>
                ) : (
                  "Get Exchange Rate"
                )}
              </motion.button>
            </motion.form>
            {exchangeError && (
              <motion.div 
                className="text-red-400 font-bold bg-red-900/20 p-3 rounded-lg border border-red-400/30"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.1 }}
              >
                Error: {exchangeError}
              </motion.div>
            )}
            {exchangeResponse && (
              <motion.pre 
                className="bg-black/70 text-[#97FBE4] rounded-lg p-4 overflow-x-auto text-xs max-h-96 border border-[#97FBE4]/20"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.1 }}
              >
                {JSON.stringify(exchangeResponse, null, 2)}
              </motion.pre>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
