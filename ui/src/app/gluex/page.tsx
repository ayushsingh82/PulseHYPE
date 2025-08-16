"use client";
import React, { useState } from "react";
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

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 py-12 gap-10">
      {/* Active Protocols */}
      <div className="w-full max-w-xl bg-[#00150E] bg-opacity-80 rounded-2xl shadow-2xl border border-[#97FBE4]/30 p-8 flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-[#97FBE4] mb-2">Active Protocols</h1>
        <button onClick={handleActiveProtocols} className="api-btn px-6 py-2 rounded-full bg-[#97FBE4] text-black font-bold text-lg shadow-lg hover:bg-[#7be3c7] transition" disabled={activeLoading}>
          {activeLoading ? "Loading..." : "Fetch Active Protocols"}
        </button>
        {activeError && <div className="text-red-400 font-bold">Error: {activeError}</div>}
        {activeProtocols && (
          <pre className="bg-black text-[#97FBE4] rounded p-4 overflow-x-auto text-xs max-h-96">{JSON.stringify(activeProtocols, null, 2)}</pre>
        )}
      </div>

      {/* Historical APY */}
      <div className="w-full max-w-xl bg-[#00150E] bg-opacity-80 rounded-2xl shadow-2xl border border-[#97FBE4]/30 p-8 flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-[#97FBE4] mb-2">Historical APY</h2>
        <form onSubmit={handleHist} className="flex flex-col gap-4">
          <label className="text-[#97FBE4] font-semibold">Pool Address
            <input className="w-full mt-1 p-2 rounded bg-black text-white border border-[#97FBE4]/40 focus:outline-none focus:border-[#97FBE4]" value={histParams.pool_address} onChange={e => setHistParams(p => ({ ...p, pool_address: e.target.value }))} required />
          </label>
          <label className="text-[#97FBE4] font-semibold">LP Token Address
            <input className="w-full mt-1 p-2 rounded bg-black text-white border border-[#97FBE4]/40 focus:outline-none focus:border-[#97FBE4]" value={histParams.lp_token_address} onChange={e => setHistParams(p => ({ ...p, lp_token_address: e.target.value }))} required />
          </label>
          <label className="text-[#97FBE4] font-semibold">Chain
            <input className="w-full mt-1 p-2 rounded bg-black text-white border border-[#97FBE4]/40 focus:outline-none focus:border-[#97FBE4]" value={histParams.chain} onChange={e => setHistParams(p => ({ ...p, chain: e.target.value }))} required />
          </label>
          <label className="text-[#97FBE4] font-semibold">Input Token
            <input className="w-full mt-1 p-2 rounded bg-black text-white border border-[#97FBE4]/40 focus:outline-none focus:border-[#97FBE4]" value={histParams.input_token} onChange={e => setHistParams(p => ({ ...p, input_token: e.target.value }))} required />
          </label>
          <button type="submit" className="api-btn px-6 py-2 rounded-full bg-[#97FBE4] text-black font-bold text-lg shadow-lg hover:bg-[#7be3c7] transition" disabled={histLoading}>
            {histLoading ? "Loading..." : "Get Historical APY"}
          </button>
        </form>
        {histError && <div className="text-red-400 font-bold">Error: {histError}</div>}
        {histResponse && (
          <pre className="bg-black text-[#97FBE4] rounded p-4 overflow-x-auto text-xs max-h-96">{JSON.stringify(histResponse, null, 2)}</pre>
        )}
      </div>

      {/* Diluted APY */}
      <div className="w-full max-w-xl bg-[#00150E] bg-opacity-80 rounded-2xl shadow-2xl border border-[#97FBE4]/30 p-8 flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-[#97FBE4] mb-2">Diluted APY</h2>
        <form onSubmit={handleDilute} className="flex flex-col gap-4">
          <label className="text-[#97FBE4] font-semibold">Pool Address
            <input className="w-full mt-1 p-2 rounded bg-black text-white border border-[#97FBE4]/40 focus:outline-none focus:border-[#97FBE4]" value={diluteParams.pool_address} onChange={e => setDiluteParams(p => ({ ...p, pool_address: e.target.value }))} required />
          </label>
          <label className="text-[#97FBE4] font-semibold">LP Token Address
            <input className="w-full mt-1 p-2 rounded bg-black text-white border border-[#97FBE4]/40 focus:outline-none focus:border-[#97FBE4]" value={diluteParams.lp_token_address} onChange={e => setDiluteParams(p => ({ ...p, lp_token_address: e.target.value }))} required />
          </label>
          <label className="text-[#97FBE4] font-semibold">Chain
            <input className="w-full mt-1 p-2 rounded bg-black text-white border border-[#97FBE4]/40 focus:outline-none focus:border-[#97FBE4]" value={diluteParams.chain} onChange={e => setDiluteParams(p => ({ ...p, chain: e.target.value }))} required />
          </label>
          <label className="text-[#97FBE4] font-semibold">Input Token
            <input className="w-full mt-1 p-2 rounded bg-black text-white border border-[#97FBE4]/40 focus:outline-none focus:border-[#97FBE4]" value={diluteParams.input_token} onChange={e => setDiluteParams(p => ({ ...p, input_token: e.target.value }))} required />
          </label>
          <label className="text-[#97FBE4] font-semibold">Input Amount
            <input className="w-full mt-1 p-2 rounded bg-black text-white border border-[#97FBE4]/40 focus:outline-none focus:border-[#97FBE4]" value={diluteParams.input_amount} onChange={e => setDiluteParams(p => ({ ...p, input_amount: e.target.value }))} required />
          </label>
          <button type="submit" className="api-btn px-6 py-2 rounded-full bg-[#97FBE4] text-black font-bold text-lg shadow-lg hover:bg-[#7be3c7] transition" disabled={diluteLoading}>
            {diluteLoading ? "Loading..." : "Get Diluted APY"}
          </button>
        </form>
        {diluteError && <div className="text-red-400 font-bold">Error: {diluteError}</div>}
        {diluteResponse && (
          <pre className="bg-black text-[#97FBE4] rounded p-4 overflow-x-auto text-xs max-h-96">{JSON.stringify(diluteResponse, null, 2)}</pre>
        )}
      </div>

      {/* Exchange Rates */}
      <div className="w-full max-w-xl bg-[#00150E] bg-opacity-80 rounded-2xl shadow-2xl border border-[#97FBE4]/30 p-8 flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-[#97FBE4] mb-2">Exchange Rates</h2>
        <form onSubmit={handleExchange} className="flex flex-col gap-4">
          <label className="text-[#97FBE4] font-semibold">Domestic Blockchain
            <input className="w-full mt-1 p-2 rounded bg-black text-white border border-[#97FBE4]/40 focus:outline-none focus:border-[#97FBE4]" value={exchangeParams[0].domestic_blockchain} onChange={e => setExchangeParams(p => [{ ...p[0], domestic_blockchain: e.target.value, domestic_token: p[0].domestic_token, foreign_blockchain: p[0].foreign_blockchain, foreign_token: p[0].foreign_token }])} required />
          </label>
          <label className="text-[#97FBE4] font-semibold">Domestic Token
            <input className="w-full mt-1 p-2 rounded bg-black text-white border border-[#97FBE4]/40 focus:outline-none focus:border-[#97FBE4]" value={exchangeParams[0].domestic_token} onChange={e => setExchangeParams(p => [{ ...p[0], domestic_token: e.target.value }])} required />
          </label>
          <label className="text-[#97FBE4] font-semibold">Foreign Blockchain
            <input className="w-full mt-1 p-2 rounded bg-black text-white border border-[#97FBE4]/40 focus:outline-none focus:border-[#97FBE4]" value={exchangeParams[0].foreign_blockchain} onChange={e => setExchangeParams(p => [{ ...p[0], foreign_blockchain: e.target.value }])} required />
          </label>
          <label className="text-[#97FBE4] font-semibold">Foreign Token
            <input className="w-full mt-1 p-2 rounded bg-black text-white border border-[#97FBE4]/40 focus:outline-none focus:border-[#97FBE4]" value={exchangeParams[0].foreign_token} onChange={e => setExchangeParams(p => [{ ...p[0], foreign_token: e.target.value }])} required />
          </label>
          <button type="submit" className="api-btn px-6 py-2 rounded-full bg-[#97FBE4] text-black font-bold text-lg shadow-lg hover:bg-[#7be3c7] transition" disabled={exchangeLoading}>
            {exchangeLoading ? "Loading..." : "Get Exchange Rate"}
          </button>
        </form>
        {exchangeError && <div className="text-red-400 font-bold">Error: {exchangeError}</div>}
        {exchangeResponse && (
          <pre className="bg-black text-[#97FBE4] rounded p-4 overflow-x-auto text-xs max-h-96">{JSON.stringify(exchangeResponse, null, 2)}</pre>
        )}
      </div>
    </div>
  );
}
