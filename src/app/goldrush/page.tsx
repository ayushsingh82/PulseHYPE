"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { motion } from "framer-motion";
import { SparklesCore } from "../../components/ui/sparkles";

const GOLDRUSH_API_KEY = process.env.NEXT_PUBLIC_GOLDRUSH_API || "";
const CHAIN_NAME = "hyperevm-mainnet";
const CHAIN_LABEL = "HyperEVM Mainnet";
const CHAIN_EXPLORER = "https://hyperevmscan.io/";

export default function GoldRushDemo() {
  const [balancesWallet, setBalancesWallet] = useState("");
  const [portfolioWallet, setPortfolioWallet] = useState("");
  const [logsBlockHeight, setLogsBlockHeight] = useState("");
  const [blockWallet, setBlockWallet] = useState("");
  const [resolvedWallet, setResolvedWallet] = useState("");
  const [spotPricesContract, setSpotPricesContract] = useState("");
  const [gasWallet, setGasWallet] = useState("");
  const [balances, setBalances] = useState<any>(null);
  const [portfolio, setPortfolio] = useState<any>(null);
  const [logs, setLogs] = useState<any>(null);
  const [block, setBlock] = useState<any>(null);
  const [resolved, setResolved] = useState<any>(null);
  const [spotPrices, setSpotPrices] = useState<any>(null);
  const [gasPrices, setGasPrices] = useState<any>(null);
  const [loading, setLoading] = useState("");
  const [error, setError] = useState("");

  // Dynamic import for GoldRushClient (to avoid SSR issues)
  async function getClient() {
    const mod = await import("@covalenthq/client-sdk");
    return new mod.GoldRushClient(GOLDRUSH_API_KEY);
  }

  const handleBalances = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading("balances"); setError(""); setBalances(null);
    try {
      const client = await getClient();
      const resp = await client.BalanceService.getTokenBalancesForWalletAddress(CHAIN_NAME, balancesWallet);
      setBalances(resp.data);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
    } finally {
      setLoading("");
    }
  };
  const handlePortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading("portfolio"); setError(""); setPortfolio(null);
    try {
      const client = await getClient();
      const resp = await client.BalanceService.getHistoricalPortfolioForWalletAddress(CHAIN_NAME, portfolioWallet);
      setPortfolio(resp.data);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
    } finally {
      setLoading("");
    }
  };
  const handleLogs = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading("logs"); setError(""); setLogs(null);
    try {
      const client = await getClient();
      const params: any = { chainName: CHAIN_NAME };
      if (logsBlockHeight) params.blockHeight = logsBlockHeight;
      const resp = await client.BaseService.getLogs(params);
      setLogs(resp.data);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
    } finally {
      setLoading("");
    }
  };
  const handleBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading("block"); setError(""); setBlock(null);
    try {
      const client = await getClient();
      const resp = await client.BaseService.getBlock(CHAIN_NAME, blockWallet);
      setBlock(resp.data);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
    } finally {
      setLoading("");
    }
  };
  const handleResolved = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading("resolved"); setError(""); setResolved(null);
    try {
      const client = await getClient();
      const resp = await client.BaseService.getResolvedAddress(CHAIN_NAME, resolvedWallet);
      setResolved(resp.data);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
    } finally {
      setLoading("");
    }
  };
  const handleSpotPrices = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading("spotPrices"); setError(""); setSpotPrices(null);
    try {
      const client = await getClient();
      const resp = await client.PricingService.getPoolSpotPrices(CHAIN_NAME, spotPricesContract);
      setSpotPrices(resp.data);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
    } finally {
      setLoading("");
    }
  };
  const handleGasPrices = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading("gasPrices"); setError(""); setGasPrices(null);
    try {
      const client = await getClient();
      // getGasPrices requires an eventType, default to 'nativetokens'
      const resp = await client.BaseService.getGasPrices(CHAIN_NAME, 'nativetokens');
      setGasPrices(resp.data);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
    } finally {
      setLoading("");
    }
  };

  // Animation variants
  const [selectedBox, setSelectedBox] = useState(0);
  const boxTitles = [
    "Token Balances",
    "Historical Portfolio",
    "Event Logs",
    "Get a Block",
    "Get Resolved Address",
    "Get Pool Spot Prices",
    "Get Gas Prices"
  ];

  return (
    <div className="min-h-screen bg-black text-[#97FBE4] flex flex-col items-center justify-center px-4 py-12 gap-10 relative overflow-x-hidden">
      {/* Dotted Background */}
      <div className="absolute inset-0 w-full h-full">
        <SparklesCore
          id="goldrush-particles"
          background="transparent"
          minSize={0.4}
          maxSize={1.0}
          particleDensity={50}
          className="w-full h-full"
          particleColor="#97FBE4"
        />
      </div>
      {/* Top Heading with animation */}
      <motion.div
        className="w-full max-w-xl mx-auto text-center mb-2 relative z-10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1
          className="text-4xl md:text-6xl font-light mb-2 tracking-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          GoldRush API
        </motion.h1>
        <motion.p
          className="text-base md:text-lg text-[#97FBE4]/80 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Explore HyperEVM Mainnet data and analytics with Covalent&apos;s GoldRush SDK.
        </motion.p>
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="inline-block px-3 py-1 rounded-full bg-black text-white font-bold text-xs">{CHAIN_LABEL}</span>
          <a href={CHAIN_EXPLORER} target="_blank" rel="noopener noreferrer" className="underline text-[#97FBE4]/80 text-xs">Explorer</a>
        </div>
      </motion.div>
      {/* Toggle Tabs - 2 rows */}
      <div className="w-full max-w-xl flex flex-wrap gap-2 mb-4 z-10">
        {boxTitles.map((title, idx) => (
          <button
            key={title}
            onClick={() => setSelectedBox(idx)}
            className={`flex-1 min-w-[45%] py-2 rounded-lg font-bold transition-all ${selectedBox === idx ? 'bg-black  text-white border border-[#ffffff]' : 'bg-[#00150E] text-[#97FBE4] border border-[#97FBE4]/30'}`}
            style={{ flexBasis: '48%' }}
          >
            {title}
          </button>
        ))}
      </div>
      {/* API Boxes with animation */}
      <div className="w-full max-w-xl flex flex-col gap-8 z-10">
        {selectedBox === 0 && (
          <motion.div className="bg-[#00150E] bg-opacity-80 rounded-2xl shadow-2xl border border-[#97FBE4]/30 p-8 flex flex-col gap-6">
            <form onSubmit={handleBalances} className="flex flex-col gap-4">
              <label className="text-[#97FBE4] font-semibold">Wallet Address
                <input className="w-full mt-1 p-2 rounded bg-black text-white border border-[#97FBE4]/40 focus:outline-none focus:border-[#97FBE4]" value={balancesWallet} onChange={e => setBalancesWallet(e.target.value)} required />
              </label>
              <button type="submit" className="api-btn px-6 py-2 rounded-full bg-[#97FBE4] text-black font-bold text-lg shadow-lg hover:bg-[#7be3c7] transition" disabled={loading === "balances"}>
                {loading === "balances" ? "Loading..." : "Get Token Balances"}
              </button>
            </form>
            {error && loading === "balances" && <div className="text-red-400 font-bold">Error: {error}</div>}
            {balances && (
              <pre className="bg-black text-[#97FBE4] rounded p-4 overflow-x-auto text-xs max-h-96">{JSON.stringify(balances, null, 2)}</pre>
            )}
          </motion.div>
        )}
        {selectedBox === 1 && (
          <motion.div className="bg-[#00150E] bg-opacity-80 rounded-2xl shadow-2xl border border-[#97FBE4]/30 p-8 flex flex-col gap-6">
            <form onSubmit={handlePortfolio} className="flex flex-col gap-4">
              <label className="text-[#97FBE4] font-semibold">Wallet Address
                <input className="w-full mt-1 p-2 rounded bg-black text-white border border-[#97FBE4]/40 focus:outline-none focus:border-[#97FBE4]" value={portfolioWallet} onChange={e => setPortfolioWallet(e.target.value)} required />
              </label>
              <button type="submit" className="api-btn px-6 py-2 rounded-full bg-[#97FBE4] text-black font-bold text-lg shadow-lg hover:bg-[#7be3c7] transition" disabled={loading === "portfolio"}>
                {loading === "portfolio" ? "Loading..." : "Get Historical Portfolio"}
              </button>
            </form>
            {error && loading === "portfolio" && <div className="text-red-400 font-bold">Error: {error}</div>}
            {portfolio && (
              <pre className="bg-black text-[#97FBE4] rounded p-4 overflow-x-auto text-xs max-h-96">{JSON.stringify(portfolio, null, 2)}</pre>
            )}
          </motion.div>
        )}
        {selectedBox === 2 && (
          <motion.div className="bg-[#00150E] bg-opacity-80 rounded-2xl shadow-2xl border border-[#97FBE4]/30 p-8 flex flex-col gap-6">
            <form onSubmit={handleLogs} className="flex flex-col gap-4">
              <label className="text-[#97FBE4] font-semibold">Block Height (optional)
                <input className="w-full mt-1 p-2 rounded bg-black text-white border border-[#97FBE4]/40 focus:outline-none focus:border-[#97FBE4]" value={logsBlockHeight} onChange={e => setLogsBlockHeight(e.target.value)} />
              </label>
              <button type="submit" className="api-btn px-6 py-2 rounded-full bg-[#97FBE4] text-black font-bold text-lg shadow-lg hover:bg-[#7be3c7] transition" disabled={loading === "logs"}>
                {loading === "logs" ? "Loading..." : "Get Event Logs"}
              </button>
            </form>
            {error && loading === "logs" && <div className="text-red-400 font-bold">Error: {error}</div>}
            {logs && (
              <pre className="bg-black text-[#97FBE4] rounded p-4 overflow-x-auto text-xs max-h-96">{JSON.stringify(logs, null, 2)}</pre>
            )}
          </motion.div>
        )}
        {selectedBox === 3 && (
          <motion.div className="bg-[#00150E] bg-opacity-80 rounded-2xl shadow-2xl border border-[#97FBE4]/30 p-8 flex flex-col gap-6">
            <form onSubmit={handleBlock} className="flex flex-col gap-4">
              <label className="text-[#97FBE4] font-semibold">Wallet Address (for Block)
                <input className="w-full mt-1 p-2 rounded bg-black text-white border border-[#97FBE4]/40 focus:outline-none focus:border-[#97FBE4]" value={blockWallet} onChange={e => setBlockWallet(e.target.value)} required />
              </label>
              <button type="submit" className="api-btn px-6 py-2 rounded-full bg-[#97FBE4] text-black font-bold text-lg shadow-lg hover:bg-[#7be3c7] transition" disabled={loading === "block"}>
                {loading === "block" ? "Loading..." : "Get a Block"}
              </button>
            </form>
            {error && loading === "block" && <div className="text-red-400 font-bold">Error: {error}</div>}
            {block && (
              <pre className="bg-black text-[#97FBE4] rounded p-4 overflow-x-auto text-xs max-h-96">{JSON.stringify(block, null, 2)}</pre>
            )}
          </motion.div>
        )}
        {selectedBox === 4 && (
          <motion.div className="bg-[#00150E] bg-opacity-80 rounded-2xl shadow-2xl border border-[#97FBE4]/30 p-8 flex flex-col gap-6">
            <form onSubmit={handleResolved} className="flex flex-col gap-4">
              <label className="text-[#97FBE4] font-semibold">Wallet Address (for Resolved Address)
                <input className="w-full mt-1 p-2 rounded bg-black text-white border border-[#97FBE4]/40 focus:outline-none focus:border-[#97FBE4]" value={resolvedWallet} onChange={e => setResolvedWallet(e.target.value)} required />
              </label>
              <button type="submit" className="api-btn px-6 py-2 rounded-full bg-[#97FBE4] text-black font-bold text-lg shadow-lg hover:bg-[#7be3c7] transition" disabled={loading === "resolved"}>
                {loading === "resolved" ? "Loading..." : "Get Resolved Address"}
              </button>
            </form>
            {error && loading === "resolved" && <div className="text-red-400 font-bold">Error: {error}</div>}
            {resolved && (
              <pre className="bg-black text-[#97FBE4] rounded p-4 overflow-x-auto text-xs max-h-96">{JSON.stringify(resolved, null, 2)}</pre>
            )}
          </motion.div>
        )}
        {selectedBox === 5 && (
          <motion.div className="bg-[#00150E] bg-opacity-80 rounded-2xl shadow-2xl border border-[#97FBE4]/30 p-8 flex flex-col gap-6">
            <form onSubmit={handleSpotPrices} className="flex flex-col gap-4">
              <label className="text-[#97FBE4] font-semibold">Contract Address (for Spot Prices)
                <input className="w-full mt-1 p-2 rounded bg-black text-white border border-[#97FBE4]/40 focus:outline-none focus:border-[#97FBE4]" value={spotPricesContract} onChange={e => setSpotPricesContract(e.target.value)} required />
              </label>
              <button type="submit" className="api-btn px-6 py-2 rounded-full bg-[#97FBE4] text-black font-bold text-lg shadow-lg hover:bg-[#7be3c7] transition" disabled={loading === "spotPrices"}>
                {loading === "spotPrices" ? "Loading..." : "Get Pool Spot Prices"}
              </button>
            </form>
            {error && loading === "spotPrices" && <div className="text-red-400 font-bold">Error: {error}</div>}
            {spotPrices && (
              <pre className="bg-black text-[#97FBE4] rounded p-4 overflow-x-auto text-xs max-h-96">{JSON.stringify(spotPrices, null, 2)}</pre>
            )}
          </motion.div>
        )}
        {selectedBox === 6 && (
          <motion.div className="bg-[#00150E] bg-opacity-80 rounded-2xl shadow-2xl border border-[#97FBE4]/30 p-8 flex flex-col gap-6">
            <form onSubmit={handleGasPrices} className="flex flex-col gap-4">
              <label className="text-[#97FBE4] font-semibold">Wallet Address (for Gas Prices)
                <input className="w-full mt-1 p-2 rounded bg-black text-white border border-[#97FBE4]/40 focus:outline-none focus:border-[#97FBE4]" value={gasWallet} onChange={e => setGasWallet(e.target.value)} required />
              </label>
              <button type="submit" className="api-btn px-6 py-2 rounded-full bg-[#97FBE4] text-black font-bold text-lg shadow-lg hover:bg-[#7be3c7] transition" disabled={loading === "gasPrices"}>
                {loading === "gasPrices" ? "Loading..." : "Get Gas Prices"}
              </button>
            </form>
            {error && loading === "gasPrices" && <div className="text-red-400 font-bold">Error: {error}</div>}
            {gasPrices && (
              <pre className="bg-black text-[#97FBE4] rounded p-4 overflow-x-auto text-xs max-h-96">{JSON.stringify(gasPrices, null, 2)}</pre>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}