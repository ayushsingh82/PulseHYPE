"use client";
import React, { useState } from "react";
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

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 py-12 gap-10">
      {/* Route API Demo */}
      <div className="w-full max-w-xl bg-[#00150E] bg-opacity-80 rounded-2xl shadow-2xl border border-[#97FBE4]/30 p-8 flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-[#97FBE4] mb-2">LiquidLabs Route API Demo</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="text-[#97FBE4] font-semibold">Token In Address
            <input
              className="w-full mt-1 p-2 rounded bg-black text-white border border-[#97FBE4]/40 focus:outline-none focus:border-[#97FBE4]"
              value={tokenIn}
              onChange={e => setTokenIn(e.target.value)}
              required
            />
          </label>
          <label className="text-[#97FBE4] font-semibold">Token Out Address
            <input
              className="w-full mt-1 p-2 rounded bg-black text-white border border-[#97FBE4]/40 focus:outline-none focus:border-[#97FBE4]"
              value={tokenOut}
              onChange={e => setTokenOut(e.target.value)}
              required
            />
          </label>
          <label className="text-[#97FBE4] font-semibold">Amount In
            <input
              className="w-full mt-1 p-2 rounded bg-black text-white border border-[#97FBE4]/40 focus:outline-none focus:border-[#97FBE4]"
              value={amountIn}
              onChange={e => setAmountIn(e.target.value)}
              required
              type="number"
              min="0"
              step="any"
            />
          </label>
          <button
            type="submit"
            className="api-btn mt-2 px-6 py-2 rounded-full bg-[#97FBE4] text-black font-bold text-lg shadow-lg hover:bg-[#7be3c7] transition"
            disabled={loading}
          >
            {loading ? "Loading..." : "Get Route"}
          </button>
        </form>
        {error && <div className="text-red-400 font-bold">Error: {error}</div>}
        {response && (
          <pre className="bg-black text-[#97FBE4] rounded p-4 overflow-x-auto text-xs max-h-96">
            {JSON.stringify(response, null, 2)}
          </pre>
        )}
      </div>

      {/* Find Pools Section */}
      <div className="w-full max-w-xl bg-[#00150E] bg-opacity-80 rounded-2xl shadow-2xl border border-[#97FBE4]/30 p-8 flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-[#97FBE4] mb-2">Find Pools for Token Pair</h2>
        <form onSubmit={handlePools} className="flex flex-col gap-4">
          <label className="text-[#97FBE4] font-semibold">Token A Address
            <input
              className="w-full mt-1 p-2 rounded bg-black text-white border border-[#97FBE4]/40 focus:outline-none focus:border-[#97FBE4]"
              value={poolTokenA}
              onChange={e => setPoolTokenA(e.target.value)}
              required
            />
          </label>
          <label className="text-[#97FBE4] font-semibold">Token B Address
            <input
              className="w-full mt-1 p-2 rounded bg-black text-white border border-[#97FBE4]/40 focus:outline-none focus:border-[#97FBE4]"
              value={poolTokenB}
              onChange={e => setPoolTokenB(e.target.value)}
              required
            />
          </label>
          <button
            type="submit"
            className="api-btn mt-2 px-6 py-2 rounded-full bg-[#97FBE4] text-black font-bold text-lg shadow-lg hover:bg-[#7be3c7] transition"
            disabled={poolsLoading}
          >
            {poolsLoading ? "Loading..." : "Find Pools"}
          </button>
        </form>
        {poolsError && <div className="text-red-400 font-bold">Error: {poolsError}</div>}
        {poolsResponse && (
          <pre className="bg-black text-[#97FBE4] rounded p-4 overflow-x-auto text-xs max-h-96">
            {JSON.stringify(poolsResponse, null, 2)}
          </pre>
        )}
      </div>

      {/* Token List Section */}
      <div className="w-full max-w-xl bg-[#00150E] bg-opacity-80 rounded-2xl shadow-2xl border border-[#97FBE4]/30 p-8 flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-[#97FBE4] mb-2">Token List</h2>
        <form onSubmit={handleTokens} className="flex flex-col gap-4">
          <label className="text-[#97FBE4] font-semibold">Search (address, name, or symbol)
            <input
              className="w-full mt-1 p-2 rounded bg-black text-white border border-[#97FBE4]/40 focus:outline-none focus:border-[#97FBE4]"
              value={tokenSearch}
              onChange={e => setTokenSearch(e.target.value)}
            />
          </label>
          <label className="text-[#97FBE4] font-semibold">Limit
            <input
              className="w-full mt-1 p-2 rounded bg-black text-white border border-[#97FBE4]/40 focus:outline-none focus:border-[#97FBE4]"
              value={tokenLimit}
              onChange={e => setTokenLimit(e.target.value)}
              type="number"
              min="1"
            />
          </label>
          <button
            type="submit"
            className="api-btn mt-2 px-6 py-2 rounded-full bg-[#97FBE4] text-black font-bold text-lg shadow-lg hover:bg-[#7be3c7] hover:text-black transition"
            disabled={tokensLoading}
          >
            {tokensLoading ? "Loading..." : "Get Tokens"}
          </button>
        </form>
        {tokensError && <div className="text-red-400 font-bold">Error: {tokensError}</div>}
        {tokensResponse && (
          <pre className="bg-black text-[#97FBE4] rounded p-4 overflow-x-auto text-xs max-h-96">
            {JSON.stringify(tokensResponse, null, 2)}
          </pre>
        )}
      </div>

      {/* Token Balances Section */}
      <div className="w-full max-w-xl bg-[#00150E] bg-opacity-80 rounded-2xl shadow-2xl border border-[#97FBE4]/30 p-8 flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-[#97FBE4] mb-2">Token Balances</h2>
        <form onSubmit={handleBalances} className="flex flex-col gap-4">
          <label className="text-[#97FBE4] font-semibold">Wallet Address
            <input
              className="w-full mt-1 p-2 rounded bg-black text-white border border-[#97FBE4]/40 focus:outline-none focus:border-[#97FBE4]"
              value={wallet}
              onChange={e => setWallet(e.target.value)}
              required
            />
          </label>
          <button
            type="submit"
            className="api-btn mt-2 px-6 py-2 rounded-full bg-[#97FBE4] text-black font-bold text-lg shadow-lg hover:bg-[#7be3c7] transition"
            disabled={balancesLoading}
          >
            {balancesLoading ? "Loading..." : "Get Balances"}
          </button>
        </form>
        {balancesError && <div className="text-red-400 font-bold">Error: {balancesError}</div>}
        {balancesResponse && (
          <pre className="bg-black text-[#97FBE4] rounded p-4 overflow-x-auto text-xs max-h-96">
            {JSON.stringify(balancesResponse, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}
