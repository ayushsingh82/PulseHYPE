"use client";
import React, { useState } from "react";

const GOLDRUSH_API_KEY = process.env.NEXT_PUBLIC_GOLDRUSH_API || "";
const CHAIN_NAME = "hyperevm-mainnet";
const CHAIN_LABEL = "HyperEVM Mainnet";
const CHAIN_EXPLORER = "https://hyperevmscan.io/";

export default function GoldRushDemo() {
  const [walletAddress, setWalletAddress] = useState("");
  const [contractAddress, setContractAddress] = useState("");
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
      const resp = await client.BalanceService.getTokenBalancesForWalletAddress({ chainName: CHAIN_NAME, walletAddress });
      setBalances(resp.data);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading("");
    }
  };

  const handlePortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading("portfolio"); setError(""); setPortfolio(null);
    try {
      const client = await getClient();
      const resp = await client.BalanceService.getHistoricalPortfolioForWalletAddress({ chainName: CHAIN_NAME, walletAddress });
      setPortfolio(resp.data);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading("");
    }
  };

  const handleLogs = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading("logs"); setError(""); setLogs(null);
    try {
      const client = await getClient();
      const resp = await client.BaseService.getLogs({ chainName: CHAIN_NAME, walletAddress });
      setLogs(resp.data);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading("");
    }
  };

  const handleBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading("block"); setError(""); setBlock(null);
    try {
      const client = await getClient();
      const resp = await client.BaseService.getBlock({ chainName: CHAIN_NAME, walletAddress });
      setBlock(resp.data);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading("");
    }
  };

  const handleResolved = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading("resolved"); setError(""); setResolved(null);
    try {
      const client = await getClient();
      const resp = await client.BaseService.getResolvedAddress({ chainName: CHAIN_NAME, walletAddress });
      setResolved(resp.data);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading("");
    }
  };

  const handleSpotPrices = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading("spotPrices"); setError(""); setSpotPrices(null);
    try {
      const client = await getClient();
      const resp = await client.PricingService.getPoolSpotPrices({ chainName: CHAIN_NAME, contractAddress });
      setSpotPrices(resp.data);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading("");
    }
  };

  const handleGasPrices = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading("gasPrices"); setError(""); setGasPrices(null);
    try {
      const client = await getClient();
      const resp = await client.BaseService.getGasPrices({ chainName: CHAIN_NAME, walletAddress });
      setGasPrices(resp.data);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading("");
    }
  };

  return (
    <div className="min-h-screen bg-black text-[#97FBE4] flex flex-col items-center justify-center px-4 py-12 gap-10">
      <div className="w-full max-w-xl bg-[#00150E] bg-opacity-80 rounded-2xl shadow-2xl border border-[#97FBE4]/30 p-8 flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-[#97FBE4] mb-2">GoldRush API Demo</h1>
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-block px-3 py-1 rounded-full bg-[#97FBE4] text-black font-bold text-xs">{CHAIN_LABEL}</span>
          <a href={CHAIN_EXPLORER} target="_blank" rel="noopener noreferrer" className="underline text-[#97FBE4]/80 text-xs">Explorer</a>
        </div>
        <form className="flex flex-col gap-4">
          <label className="text-[#97FBE4] font-semibold">Wallet Address
            <input className="w-full mt-1 p-2 rounded bg-black text-white border border-[#97FBE4]/40 focus:outline-none focus:border-[#97FBE4]" value={walletAddress} onChange={e => setWalletAddress(e.target.value)} required />
          </label>
          <label className="text-[#97FBE4] font-semibold">Contract Address (for Spot Prices)
            <input className="w-full mt-1 p-2 rounded bg-black text-white border border-[#97FBE4]/40 focus:outline-none focus:border-[#97FBE4]" value={contractAddress} onChange={e => setContractAddress(e.target.value)} />
          </label>
        </form>
      </div>
      {/* Token Balances */}
      <div className="w-full max-w-xl bg-[#00150E] bg-opacity-80 rounded-2xl shadow-2xl border border-[#97FBE4]/30 p-8 flex flex-col gap-6">
        <form onSubmit={handleBalances} className="flex flex-col gap-4">
          <button type="submit" className="api-btn px-6 py-2 rounded-full bg-[#97FBE4] text-black font-bold text-lg shadow-lg hover:bg-[#7be3c7] transition" disabled={loading === "balances"}>
            {loading === "balances" ? "Loading..." : "Get Token Balances"}
          </button>
        </form>
        {error && loading === "balances" && <div className="text-red-400 font-bold">Error: {error}</div>}
        {balances && (
          <pre className="bg-black text-[#97FBE4] rounded p-4 overflow-x-auto text-xs max-h-96">{JSON.stringify(balances, null, 2)}</pre>
        )}
      </div>
      {/* Historical Portfolio */}
      <div className="w-full max-w-xl bg-[#00150E] bg-opacity-80 rounded-2xl shadow-2xl border border-[#97FBE4]/30 p-8 flex flex-col gap-6">
        <form onSubmit={handlePortfolio} className="flex flex-col gap-4">
          <button type="submit" className="api-btn px-6 py-2 rounded-full bg-[#97FBE4] text-black font-bold text-lg shadow-lg hover:bg-[#7be3c7] transition" disabled={loading === "portfolio"}>
            {loading === "portfolio" ? "Loading..." : "Get Historical Portfolio"}
          </button>
        </form>
        {error && loading === "portfolio" && <div className="text-red-400 font-bold">Error: {error}</div>}
        {portfolio && (
          <pre className="bg-black text-[#97FBE4] rounded p-4 overflow-x-auto text-xs max-h-96">{JSON.stringify(portfolio, null, 2)}</pre>
        )}
      </div>
      {/* Event Logs */}
      <div className="w-full max-w-xl bg-[#00150E] bg-opacity-80 rounded-2xl shadow-2xl border border-[#97FBE4]/30 p-8 flex flex-col gap-6">
        <form onSubmit={handleLogs} className="flex flex-col gap-4">
          <button type="submit" className="api-btn px-6 py-2 rounded-full bg-[#97FBE4] text-black font-bold text-lg shadow-lg hover:bg-[#7be3c7] transition" disabled={loading === "logs"}>
            {loading === "logs" ? "Loading..." : "Get Event Logs"}
          </button>
        </form>
        {error && loading === "logs" && <div className="text-red-400 font-bold">Error: {error}</div>}
        {logs && (
          <pre className="bg-black text-[#97FBE4] rounded p-4 overflow-x-auto text-xs max-h-96">{JSON.stringify(logs, null, 2)}</pre>
        )}
      </div>
      {/* Get a Block */}
      <div className="w-full max-w-xl bg-[#00150E] bg-opacity-80 rounded-2xl shadow-2xl border border-[#97FBE4]/30 p-8 flex flex-col gap-6">
        <form onSubmit={handleBlock} className="flex flex-col gap-4">
          <button type="submit" className="api-btn px-6 py-2 rounded-full bg-[#97FBE4] text-black font-bold text-lg shadow-lg hover:bg-[#7be3c7] transition" disabled={loading === "block"}>
            {loading === "block" ? "Loading..." : "Get a Block"}
          </button>
        </form>
        {error && loading === "block" && <div className="text-red-400 font-bold">Error: {error}</div>}
        {block && (
          <pre className="bg-black text-[#97FBE4] rounded p-4 overflow-x-auto text-xs max-h-96">{JSON.stringify(block, null, 2)}</pre>
        )}
      </div>
      {/* Get Resolved Address */}
      <div className="w-full max-w-xl bg-[#00150E] bg-opacity-80 rounded-2xl shadow-2xl border border-[#97FBE4]/30 p-8 flex flex-col gap-6">
        <form onSubmit={handleResolved} className="flex flex-col gap-4">
          <button type="submit" className="api-btn px-6 py-2 rounded-full bg-[#97FBE4] text-black font-bold text-lg shadow-lg hover:bg-[#7be3c7] transition" disabled={loading === "resolved"}>
            {loading === "resolved" ? "Loading..." : "Get Resolved Address"}
          </button>
        </form>
        {error && loading === "resolved" && <div className="text-red-400 font-bold">Error: {error}</div>}
        {resolved && (
          <pre className="bg-black text-[#97FBE4] rounded p-4 overflow-x-auto text-xs max-h-96">{JSON.stringify(resolved, null, 2)}</pre>
        )}
      </div>
      {/* Get Pool Spot Prices */}
      <div className="w-full max-w-xl bg-[#00150E] bg-opacity-80 rounded-2xl shadow-2xl border border-[#97FBE4]/30 p-8 flex flex-col gap-6">
        <form onSubmit={handleSpotPrices} className="flex flex-col gap-4">
          <button type="submit" className="api-btn px-6 py-2 rounded-full bg-[#97FBE4] text-black font-bold text-lg shadow-lg hover:bg-[#7be3c7] transition" disabled={loading === "spotPrices"}>
            {loading === "spotPrices" ? "Loading..." : "Get Pool Spot Prices"}
          </button>
        </form>
        {error && loading === "spotPrices" && <div className="text-red-400 font-bold">Error: {error}</div>}
        {spotPrices && (
          <pre className="bg-black text-[#97FBE4] rounded p-4 overflow-x-auto text-xs max-h-96">{JSON.stringify(spotPrices, null, 2)}</pre>
        )}
      </div>
      {/* Get Gas Prices */}
      <div className="w-full max-w-xl bg-[#00150E] bg-opacity-80 rounded-2xl shadow-2xl border border-[#97FBE4]/30 p-8 flex flex-col gap-6">
        <form onSubmit={handleGasPrices} className="flex flex-col gap-4">
          <button type="submit" className="api-btn px-6 py-2 rounded-full bg-[#97FBE4] text-black font-bold text-lg shadow-lg hover:bg-[#7be3c7] transition" disabled={loading === "gasPrices"}>
            {loading === "gasPrices" ? "Loading..." : "Get Gas Prices"}
          </button>
        </form>
        {error && loading === "gasPrices" && <div className="text-red-400 font-bold">Error: {error}</div>}
        {gasPrices && (
          <pre className="bg-black text-[#97FBE4] rounded p-4 overflow-x-auto text-xs max-h-96">{JSON.stringify(gasPrices, null, 2)}</pre>
        )}
      </div>
    </div>
  );
}