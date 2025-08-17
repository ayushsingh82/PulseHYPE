/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import { motion } from "motion/react";
import { SparklesCore } from "../../components/ui/sparkles";
import { simulateTransaction, getTransactionTrace, estimateGas, validateContract, analyzeTransaction, analyzeTransactionError } from "./helper";

export default function HyperEVMSimulator() {
  // Transaction Simulation State
  const [fromAddress, setFromAddress] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [value, setValue] = useState("");
  const [gasLimit, setGasLimit] = useState("");
  const [gasPrice, setGasPrice] = useState("");
  const [data, setData] = useState("");
  const [blockNumber, setBlockNumber] = useState("");
  const [simulationResult, setSimulationResult] = useState<any>(null);
  const [simulationLoading, setSimulationLoading] = useState(false);
  const [simulationError, setSimulationError] = useState("");

  // Gas Estimation State
  const [gasEstimateResult, setGasEstimateResult] = useState<any>(null);
  const [gasEstimateLoading, setGasEstimateLoading] = useState(false);
  const [gasEstimateError, setGasEstimateError] = useState("");

  // Transaction Trace State
  const [traceResult, setTraceResult] = useState<any>(null);
  const [traceLoading, setTraceLoading] = useState(false);
  const [traceError, setTraceError] = useState("");

  // Contract Validation State
  const [contractAddress, setContractAddress] = useState("");
  const [validationResult, setValidationResult] = useState<any>(null);
  const [validationLoading, setValidationLoading] = useState(false);
  const [validationError, setValidationError] = useState("");

  // Transaction Analysis State
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState("");
  const [selectedAnalysisTab, setSelectedAnalysisTab] = useState("assets");

  // Advanced Parameters State
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [nonce, setNonce] = useState("");
  const [maxFeePerGas, setMaxFeePerGas] = useState("");
  const [maxPriorityFeePerGas, setMaxPriorityFeePerGas] = useState("");
  const [simulationMode, setSimulationMode] = useState<"realtime" | "historical">("realtime");
  const [historicalBlock, setHistoricalBlock] = useState("");
  const [currentScenario, setCurrentScenario] = useState<string | null>(null);

  // Demo Data Options
  const demoScenarios = {
    ethTransfer: {
      name: "🔄 Simple ETH Transfer",
      description: "Basic ETH transfer between accounts",
      data: {
        fromAddress: "0x742d35Cc6634C0532925a3b8d1Ecf55E0965E5C0",
        toAddress: "0x8ba1f109551bD432803012645Hac136c22C8e8a9",
        value: "0.1",
        gasLimit: "21000",
        gasPrice: "20",
        data: "",
        blockNumber: ""
      }
    },
    uniswapSwap: {
      name: "🦄 Uniswap Token Swap",
      description: "Swap ETH for USDC on Uniswap V3",
      data: {
        fromAddress: "0x742d35Cc6634C0532925a3b8d1Ecf55E0965E5C0",
        toAddress: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
        value: "0.1",
        gasLimit: "300000",
        gasPrice: "25",
        data: "0x414bf389000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc20000000000000000000000001F13F7F2b5a9b1D9F3B1c4E5C6d7E8F9A0B1C2D3000000000000000000000000000000000000000000000000000000000000007d0000000000000000000000000000000000000000000000000000000000989680",
        blockNumber: ""
      }
    },
    erc20Transfer: {
      name: "🪙 ERC20 Token Transfer",
      description: "Transfer USDC tokens between accounts",
      data: {
        fromAddress: "0x742d35Cc6634C0532925a3b8d1Ecf55E0965E5C0",
        toAddress: "0xA0b86a33E6C7d5F8e4c9d8F2A3b4c5d6e7f8a9b0",
        value: "0",
        gasLimit: "65000",
        gasPrice: "20",
        data: "0xa9059cbb000000000000000000000000742d35cc6634c0532925a3b8d1ecf55e0965e5c000000000000000000000000000000000000000000000000000000000000f4240",
        blockNumber: ""
      }
    },
    contractDeployment: {
      name: "🚀 Contract Deployment",
      description: "Deploy a simple smart contract",
      data: {
        fromAddress: "0x742d35Cc6634C0532925a3b8d1Ecf55E0965E5C0",
        toAddress: "",
        value: "0",
        gasLimit: "2000000",
        gasPrice: "30",
        data: "0x608060405234801561001057600080fd5b50336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550610201806100606000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c806341c0e1b51461003b578063cfae321714610045575b600080fd5b610043610063565b005b61004d6100f7565b60405161005a919061015c565b60405180910390f35b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16146100c157600080fd5b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff5b60606040518060400160405280600c81526020017f48656c6c6f20576f726c64210000000000000000000000000000000000000000815250905090565b600081519050919050565b600082825260208201905092915050565b60005b8381101561016f578082015181840152602081019050610154565b60008484015250505050565b6000601f19601f8301169050919050565b600061019782610135565b6101a18185610140565b93506101b1818560208601610151565b6101ba8161017b565b840191505092915050565b600060208201905081810360008301526101df818461018c565b90509291505056fea2646970667358221220c7f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f864736f6c634300081a0033",
        blockNumber: ""
      }
    },
    nftMint: {
      name: "🎨 NFT Mint",
      description: "Mint an ERC721 NFT token",
      data: {
        fromAddress: "0x742d35Cc6634C0532925a3b8d1Ecf55E0965E5C0",
        toAddress: "0x23581767a106ae21c074b2276d25e5c3e136a68b",
        value: "0.08",
        gasLimit: "150000",
        gasPrice: "35",
        data: "0x40c10f19000000000000000000000000742d35cc6634c0532925a3b8d1ecf55e0965e5c00000000000000000000000000000000000000000000000000000000000000001",
        blockNumber: ""
      }
    }
  };

  // Function to load demo data
  const loadDemoData = (scenario: keyof typeof demoScenarios) => {
    const demo = demoScenarios[scenario].data;
    setFromAddress(demo.fromAddress);
    setToAddress(demo.toAddress);
    setValue(demo.value);
    setGasLimit(demo.gasLimit);
    setGasPrice(demo.gasPrice);
    setData(demo.data);
    setBlockNumber(demo.blockNumber);
    setCurrentScenario(demoScenarios[scenario].name);
    
    // Clear previous results
    setSimulationResult(null);
    setGasEstimateResult(null);
    setTraceResult(null);
    setAnalysisResult(null);
    setValidationResult(null);
    
    // Clear errors
    setSimulationError("");
    setGasEstimateError("");
    setTraceError("");
    setAnalysisError("");
    setValidationError("");
  };

  // RPC Endpoint Selection
  const [selectedRPC, setSelectedRPC] = useState("https://rpc.hyperliquid.xyz/evm");

  const rpcEndpoints = [
    { name: "HyperLiquid Mainnet", url: "https://rpc.hyperliquid.xyz/evm", type: "mainnet" },
    { name: "HyperLiquid Testnet", url: "https://rpc.hyperliquid-testnet.xyz/evm", type: "testnet" },
    { name: "HypurrScan", url: "http://rpc.hypurrscan.io", type: "mainnet" },
    { name: "Stakely", url: "https://hyperliquid-json-rpc.stakely.io", type: "mainnet" },
    { name: "HypeRPC (Archive)", url: "https://hyperpc.app/", type: "archive" },
    { name: "Altitude (Archive)", url: "https://rpc.reachaltitude.xyz/", type: "archive" }
  ];

  // Handlers
  const handleSimulation = async (e: React.FormEvent) => {
    e.preventDefault();
    setSimulationLoading(true);
    setSimulationError("");
    setSimulationResult(null);
    try {
      const result = await simulateTransaction({
        from: fromAddress,
        to: toAddress,
        value,
        gas: gasLimit,
        gasPrice,
        data,
        blockNumber: simulationMode === "historical" ? historicalBlock : "latest",
        nonce,
        maxFeePerGas,
        maxPriorityFeePerGas
      }, selectedRPC);
      setSimulationResult(result);
    } catch (err: any) {
      setSimulationError(err.message || "Simulation failed");
    } finally {
      setSimulationLoading(false);
    }
  };

  const handleGasEstimation = async () => {
    setGasEstimateLoading(true);
    setGasEstimateError("");
    setGasEstimateResult(null);
    try {
      const result = await estimateGas({
        from: fromAddress,
        to: toAddress,
        value,
        data
      }, selectedRPC);
      setGasEstimateResult(result);
      setGasLimit(result.gasEstimate);
    } catch (err: any) {
      setGasEstimateError(err.message || "Gas estimation failed");
    } finally {
      setGasEstimateLoading(false);
    }
  };

  const handleTransactionTrace = async () => {
    if (!simulationResult?.transactionHash) {
      setTraceError("Please run a simulation first");
      return;
    }
    setTraceLoading(true);
    setTraceError("");
    setTraceResult(null);
    try {
      const result = await getTransactionTrace(simulationResult.transactionHash, selectedRPC);
      setTraceResult(result);
    } catch (err: any) {
      setTraceError(err.message || "Transaction trace failed");
    } finally {
      setTraceLoading(false);
    }
  };

  const handleContractValidation = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationLoading(true);
    setValidationError("");
    setValidationResult(null);
    try {
      const result = await validateContract(contractAddress, selectedRPC);
      setValidationResult(result);
    } catch (err: any) {
      setValidationError(err.message || "Contract validation failed");
    } finally {
      setValidationLoading(false);
    }
  };

  // Transaction Analysis Handler
  const handleTransactionAnalysis = async () => {
    if (!simulationResult?.transactionHash) {
      setAnalysisError("Please run a simulation first");
      return;
    }
    setAnalysisLoading(true);
    setAnalysisError("");
    setAnalysisResult(null);
    try {
      const result = await analyzeTransaction(simulationResult.transactionHash, {
        from: fromAddress,
        to: toAddress,
        value,
        gas: gasLimit,
        gasPrice,
        data,
        blockNumber
      }, selectedRPC);
      
      // Add error analysis if simulation failed
      if (!simulationResult.success && simulationResult.error) {
        result.errorAnalysis = analyzeTransactionError(simulationResult.error);
      }
      
      setAnalysisResult(result);
    } catch (err: any) {
      setAnalysisError(err.message || "Transaction analysis failed");
    } finally {
      setAnalysisLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-start px-4 py-12 gap-10 relative">
      {/* Background Sparkles */}
      <div className="absolute inset-0 w-full h-full">
        <SparklesCore
          id="simulator-particles"
          background="transparent"
          minSize={0.4}
          maxSize={1.0}
          particleDensity={60}
          className="w-full h-full"
          particleColor="#FF6B6B"
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
          className="text-4xl md:text-6xl font-bold text-[#FF6B6B] mb-4"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          HyperEVM Transaction Simulator
        </motion.h1>
        <motion.p 
          className="text-lg text-[#FF6B6B]/80 pixel-font max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Comprehensive transaction simulation platform for HyperEVM. Simulate, debug, and optimize your transactions before execution.
        </motion.p>
      </motion.div>

      {/* RPC Endpoint Selection */}
      <motion.div 
        className="w-full max-w-4xl glass-morphism rounded-2xl shadow-2xl p-6 relative z-10 card-hover"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <motion.h2 
          className="text-2xl font-bold text-[#FF6B6B] mb-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          Select RPC Endpoint
        </motion.h2>
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.0 }}
        >
          {rpcEndpoints.map((endpoint, index) => (
            <motion.label
              key={endpoint.url}
              className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all duration-300 ${
                selectedRPC === endpoint.url
                  ? 'border-[#FF6B6B] bg-[#FF6B6B]/10 text-[#FF6B6B]'
                  : 'border-[#FF6B6B]/30 text-[#FF6B6B]/70 hover:border-[#FF6B6B]/60'
              }`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 1.2 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <input
                type="radio"
                name="rpc"
                value={endpoint.url}
                checked={selectedRPC === endpoint.url}
                onChange={(e) => setSelectedRPC(e.target.value)}
                className="mr-3 accent-[#FF6B6B]"
              />
              <div>
                <div className="font-semibold">{endpoint.name}</div>
                <div className="text-xs opacity-75">
                  {endpoint.type} • {endpoint.url.replace('https://', '').replace('http://', '')}
                </div>
              </div>
            </motion.label>
          ))}
        </motion.div>
      </motion.div>

      {/* Demo Data Section */}
      <motion.div 
        className="w-full max-w-4xl glass-morphism rounded-2xl shadow-2xl p-6 relative z-10 card-hover"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
      >
        <motion.h2 
          className="text-2xl font-bold text-[#FF6B6B] mb-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 1.3 }}
        >
          🎯 Quick Demo Scenarios
        </motion.h2>
        <motion.p 
          className="text-[#FF6B6B]/70 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.4 }}
        >
          Load pre-configured demo data to quickly test different transaction scenarios
        </motion.p>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.5 }}
        >
          {Object.entries(demoScenarios).map(([key, scenario], index) => (
            <motion.button
              key={key}
              type="button"
              onClick={() => loadDemoData(key as keyof typeof demoScenarios)}
              className="p-4 bg-gradient-to-br from-[#FF6B6B]/10 to-[#FF6B6B]/5 border border-[#FF6B6B]/30 rounded-lg hover:border-[#FF6B6B]/60 hover:bg-[#FF6B6B]/20 transition-all duration-300 text-left group"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 1.6 + index * 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="font-semibold text-[#FF6B6B] mb-2 group-hover:text-white transition-colors">
                {scenario.name}
              </div>
              <div className="text-xs text-[#FF6B6B]/60 group-hover:text-white/80 transition-colors">
                {scenario.description}
              </div>
            </motion.button>
          ))}
        </motion.div>
      </motion.div>

      {/* Transaction Simulation Section */}
      <motion.div 
        className="w-full max-w-4xl glass-morphism rounded-2xl shadow-2xl p-8 relative z-10 card-hover"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.4 }}
      >
        <motion.h2 
          className="text-3xl font-bold text-[#FF6B6B] mb-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 1.6 }}
        >
          Transaction Simulation
        </motion.h2>

        {/* Form Controls */}
        <motion.div 
          className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-[#FF6B6B]/20"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.7 }}
        >
          <div className="flex flex-wrap gap-3">
            <motion.button
              type="button"
              onClick={() => {
                setFromAddress("");
                setToAddress("");
                setValue("");
                setGasLimit("");
                setGasPrice("");
                setData("");
                setBlockNumber("");
                setNonce("");
                setMaxFeePerGas("");
                setMaxPriorityFeePerGas("");
                setHistoricalBlock("");
                setCurrentScenario(null);
                setSimulationResult(null);
                setGasEstimateResult(null);
                setTraceResult(null);
                setAnalysisResult(null);
                setValidationResult(null);
                setSimulationError("");
                setGasEstimateError("");
                setTraceError("");
                setAnalysisError("");
                setValidationError("");
              }}
              className="px-4 py-2 bg-gray-600/20 hover:bg-gray-600/40 border border-gray-500/30 hover:border-gray-400/60 rounded-lg text-gray-300 hover:text-white transition-all duration-300 text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🗑️ Clear All
            </motion.button>
            
            <motion.button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`px-4 py-2 border rounded-lg text-sm transition-all duration-300 ${
                showAdvanced 
                  ? 'bg-[#FF6B6B]/20 border-[#FF6B6B]/60 text-[#FF6B6B]' 
                  : 'bg-[#FF6B6B]/10 border-[#FF6B6B]/30 text-[#FF6B6B]/80 hover:border-[#FF6B6B]/60 hover:text-[#FF6B6B]'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ⚙️ {showAdvanced ? 'Hide' : 'Show'} Advanced
            </motion.button>
          </div>

          {currentScenario && (
            <motion.div 
              className="px-3 py-1 bg-[#FF6B6B]/10 border border-[#FF6B6B]/30 rounded-full text-xs text-[#FF6B6B]"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              📋 Loaded: {currentScenario}
            </motion.div>
          )}
        </motion.div>
        
        <motion.form 
          onSubmit={handleSimulation} 
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.8 }}
        >
          {[
            { label: "From Address", value: fromAddress, setter: setFromAddress, placeholder: "0x..." },
            { label: "To Address", value: toAddress, setter: setToAddress, placeholder: "0x..." },
            { label: "Value (ETH)", value: value, setter: setValue, placeholder: "0.1", type: "number", step: "any" },
            { label: "Gas Limit", value: gasLimit, setter: setGasLimit, placeholder: "21000", type: "number" },
            { label: "Gas Price (Gwei)", value: gasPrice, setter: setGasPrice, placeholder: "20", type: "number" },
            { label: "Block Number (optional)", value: blockNumber, setter: setBlockNumber, placeholder: "latest", type: "number" }
          ].map((field, index) => (
            <motion.label 
              key={field.label}
              className="text-[#FF6B6B] font-semibold"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 2.0 + index * 0.1 }}
            >
              {field.label}
              <motion.input
                className="w-full mt-2 p-3 rounded-lg bg-black/50 text-white border border-[#FF6B6B]/40 focus:outline-none focus:border-[#FF6B6B] focus:ring-2 focus:ring-[#FF6B6B]/20 transition-all duration-300"
                value={field.value}
                onChange={e => field.setter(e.target.value)}
                placeholder={field.placeholder}
                type={field.type || "text"}
                step={field.step}
                required={!field.label.includes("optional")}
                whileFocus={{ scale: 1.02 }}
              />
            </motion.label>
          ))}

          {/* Advanced Parameters Section */}
          {showAdvanced && (
            <motion.div 
              className="md:col-span-2 mt-8 space-y-6 p-6 bg-black/20 rounded-lg border border-[#FF6B6B]/20"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h3 className="text-xl font-bold text-[#FF6B6B] mb-4">⚙️ Advanced Parameters</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.label 
                  className="text-[#FF6B6B] font-semibold"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  Nonce (Optional)
                  <motion.input
                    className="w-full mt-2 p-3 rounded-lg bg-black/50 text-white border border-[#FF6B6B]/40 focus:outline-none focus:border-[#FF6B6B] focus:ring-2 focus:ring-[#FF6B6B]/20 transition-all duration-300"
                    value={nonce}
                    onChange={e => setNonce(e.target.value)}
                    placeholder="Auto-detect"
                    type="number"
                    whileFocus={{ scale: 1.02 }}
                  />
                </motion.label>

                <motion.label 
                className="text-[#FF6B6B] font-semibold"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 3.0 }}
              >
                Simulation Mode
                <motion.select
                  className="w-full mt-2 p-3 rounded-lg bg-black/50 text-white border border-[#FF6B6B]/40 focus:outline-none focus:border-[#FF6B6B] focus:ring-2 focus:ring-[#FF6B6B]/20 transition-all duration-300"
                  value={simulationMode}
                  onChange={e => setSimulationMode(e.target.value as "realtime" | "historical")}
                  whileFocus={{ scale: 1.02 }}
                >
                  <option value="realtime">Latest Block</option>
                  <option value="historical">Historical Block</option>
                </motion.select>
              </motion.label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.label 
                className="text-[#FF6B6B] font-semibold"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 3.1 }}
              >
                Max Fee Per Gas (Wei)
                <motion.input
                  className="w-full mt-2 p-3 rounded-lg bg-black/50 text-white border border-[#FF6B6B]/40 focus:outline-none focus:border-[#FF6B6B] focus:ring-2 focus:ring-[#FF6B6B]/20 transition-all duration-300"
                  value={maxFeePerGas}
                  onChange={e => setMaxFeePerGas(e.target.value)}
                  placeholder="EIP-1559 Max Fee"
                  type="text"
                  whileFocus={{ scale: 1.02 }}
                />
              </motion.label>

              <motion.label 
                className="text-[#FF6B6B] font-semibold"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 3.2 }}
              >
                Max Priority Fee Per Gas (Wei)
                <motion.input
                  className="w-full mt-2 p-3 rounded-lg bg-black/50 text-white border border-[#FF6B6B]/40 focus:outline-none focus:border-[#FF6B6B] focus:ring-2 focus:ring-[#FF6B6B]/20 transition-all duration-300"
                  value={maxPriorityFeePerGas}
                  onChange={e => setMaxPriorityFeePerGas(e.target.value)}
                  placeholder="EIP-1559 Priority Fee"
                  type="text"
                  whileFocus={{ scale: 1.02 }}
                />
              </motion.label>
            </div>

            {simulationMode === "historical" && (
              <motion.label 
                className="text-[#FF6B6B] font-semibold"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 3.3 }}
              >
                Historical Block Number
                <motion.input
                  className="w-full mt-2 p-3 rounded-lg bg-black/50 text-white border border-[#FF6B6B]/40 focus:outline-none focus:border-[#FF6B6B] focus:ring-2 focus:ring-[#FF6B6B]/20 transition-all duration-300"
                  value={historicalBlock}
                  onChange={e => setHistoricalBlock(e.target.value)}
                  placeholder="Block number for simulation"
                  type="number"
                  whileFocus={{ scale: 1.02 }}
                />
              </motion.label>
            )}
            </motion.div>
          )}
          
          {/* Transaction Data Section */}
          <motion.div 
            className="md:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 2.6 }}
          >
            <label className="text-[#FF6B6B] font-semibold">
              Transaction Data (Hex) - Optional
              <motion.textarea
                className="w-full mt-2 p-3 rounded-lg bg-black/50 text-white border border-[#FF6B6B]/40 focus:outline-none focus:border-[#FF6B6B] focus:ring-2 focus:ring-[#FF6B6B]/20 transition-all duration-300 h-24 resize-none"
                value={data}
                onChange={e => setData(e.target.value)}
                placeholder="0x... (for contract interactions - leave empty for simple transfers)"
                whileFocus={{ scale: 1.01 }}
              />
            </label>
          </motion.div>

          {/* Action Buttons */}
          <motion.div 
            className="md:col-span-2 flex gap-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 2.8 }}
          >
            <motion.button
              type="button"
              onClick={handleGasEstimation}
              className="px-6 py-3 rounded-full bg-[#FF6B6B]/20 text-[#FF6B6B] border border-[#FF6B6B] font-bold hover:bg-[#FF6B6B]/30 transition-all duration-300"
              disabled={gasEstimateLoading || !fromAddress || !toAddress}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {gasEstimateLoading ? "Estimating..." : "Estimate Gas"}
            </motion.button>
            
            <motion.button
              type="submit"
              className="flex-1 px-6 py-3 rounded-full bg-[#FF6B6B] text-black font-bold text-lg shadow-lg hover:bg-[#ff5252] transition-all duration-300 button-glow"
              disabled={simulationLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {simulationLoading ? (
                <motion.span 
                  className="loading-dots"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  Simulating
                </motion.span>
              ) : (
                "Simulate Transaction"
              )}
            </motion.button>

            {simulationResult && (
              <>
                <motion.button
                  type="button"
                  onClick={handleTransactionTrace}
                  className="px-6 py-3 rounded-full bg-purple-600 text-white font-bold hover:bg-purple-700 transition-all duration-300"
                  disabled={traceLoading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {traceLoading ? "Tracing..." : "Get Trace"}
                </motion.button>

                <motion.button
                  type="button"
                  onClick={handleTransactionAnalysis}
                  className="px-6 py-3 rounded-full bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-all duration-300"
                  disabled={analysisLoading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {analysisLoading ? "Analyzing..." : "📊 Deep Analysis"}
                </motion.button>
              </>
            )}
          </motion.div>
        </motion.form>

        {/* Results */}
        {(simulationError || gasEstimateError || traceError || analysisError) && (
          <motion.div 
            className="mt-6 space-y-2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {simulationError && (
              <div className="text-red-400 font-bold bg-red-900/20 p-3 rounded-lg border border-red-400/30">
                Simulation Error: {simulationError}
              </div>
            )}
            {gasEstimateError && (
              <div className="text-red-400 font-bold bg-red-900/20 p-3 rounded-lg border border-red-400/30">
                Gas Estimation Error: {gasEstimateError}
              </div>
            )}
            {traceError && (
              <div className="text-red-400 font-bold bg-red-900/20 p-3 rounded-lg border border-red-400/30">
                Trace Error: {traceError}
              </div>
            )}
            {analysisError && (
              <div className="text-red-400 font-bold bg-red-900/20 p-3 rounded-lg border border-red-400/30">
                Analysis Error: {analysisError}
              </div>
            )}
          </motion.div>
        )}

        {gasEstimateResult && (
          <motion.div 
            className="mt-6 bg-green-900/20 text-green-400 rounded-lg p-4 border border-green-400/30"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="font-bold mb-4">Gas Estimation Result:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-lg font-semibold">Total Estimate: {gasEstimateResult.gasEstimate}</div>
                <div>Cost (ETH): {gasEstimateResult.costETH}</div>
                <div>Cost (USD): ${gasEstimateResult.costUSD}</div>
              </div>
              {gasEstimateResult.breakdown && (
                <div className="space-y-2">
                  <div className="font-semibold text-green-300">Gas Breakdown:</div>
                  <div className="text-sm space-y-1">
                    <div>Base: {gasEstimateResult.breakdown.base}</div>
                    <div>Call Data: {gasEstimateResult.breakdown.callData}</div>
                    <div>Execution: {gasEstimateResult.breakdown.execution}</div>
                    <div>Access List: {gasEstimateResult.breakdown.accessList}</div>
                  </div>
                </div>
              )}
            </div>
            {gasEstimateResult.suggestions && gasEstimateResult.suggestions.length > 0 && (
              <div className="mt-4 p-3 bg-green-800/20 rounded-lg border border-green-400/20">
                <div className="font-semibold text-green-300 mb-2">Optimization Suggestions:</div>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {gasEstimateResult.suggestions.map((suggestion: string, index: number) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}

        {simulationResult && (
          <motion.div 
            className="mt-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-[#FF6B6B] font-bold text-xl mb-4">Simulation Result:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className={`p-4 rounded-lg border ${
                simulationResult.success 
                  ? 'bg-green-900/20 border-green-400/30 text-green-400' 
                  : 'bg-red-900/20 border-red-400/30 text-red-400'
              }`}>
                <div className="font-bold">Status: {simulationResult.success ? 'SUCCESS' : 'FAILED'}</div>
                <div className="text-sm mt-1">Gas Used: {simulationResult.gasUsed}</div>
                {simulationResult.gasBreakdown && (
                  <div className="text-xs mt-2 space-y-1">
                    <div>Base: {simulationResult.gasBreakdown.base}</div>
                    <div>Execution: {simulationResult.gasBreakdown.execution}</div>
                    <div>Call Data: {simulationResult.gasBreakdown.callData}</div>
                  </div>
                )}
              </div>
              <div className="p-4 rounded-lg border border-[#FF6B6B]/30 bg-[#FF6B6B]/10 text-[#FF6B6B]">
                <div className="font-bold">Block Number: {simulationResult.blockNumber}</div>
                <div className="text-sm mt-1">Transaction Hash: {simulationResult.transactionHash?.slice(0, 20)}...</div>
                {simulationResult.stateChanges && simulationResult.stateChanges.length > 0 && (
                  <div className="text-xs mt-2">
                    <div className="font-semibold">State Changes: {simulationResult.stateChanges.length}</div>
                  </div>
                )}
              </div>
            </div>
            <pre className="bg-black/70 text-[#FF6B6B] rounded-lg p-4 overflow-x-auto text-xs max-h-96 border border-[#FF6B6B]/20">
              {JSON.stringify(simulationResult, null, 2)}
            </pre>
          </motion.div>
        )}

        {traceResult && (
          <motion.div 
            className="mt-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-purple-400 font-bold text-xl mb-4">Transaction Trace:</h3>
            <pre className="bg-black/70 text-purple-400 rounded-lg p-4 overflow-x-auto text-xs max-h-96 border border-purple-400/20">
              {JSON.stringify(traceResult, null, 2)}
            </pre>
          </motion.div>
        )}

        {/* Transaction Analysis Results */}
        {analysisResult && (
          <motion.div 
            className="mt-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-emerald-400 font-bold text-xl mb-4">📊 Transaction Analysis</h3>
            
            {/* Analysis Tab Navigation */}
            <div className="flex flex-wrap gap-2 mb-6">
              {[
                { id: "assets", name: "💰 Asset Changes", color: "emerald" },
                { id: "gas", name: "⛽ Gas Profile", color: "blue" },
                { id: "events", name: "📝 Events", color: "purple" },
                { id: "trace", name: "🔍 Execution", color: "orange" },
                { id: "error", name: "❌ Error Analysis", color: "red" }
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setSelectedAnalysisTab(tab.id)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                    selectedAnalysisTab === tab.id
                      ? `bg-${tab.color}-600 text-white`
                      : `bg-${tab.color}-600/20 text-${tab.color}-400 hover:bg-${tab.color}-600/30`
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {tab.name}
                </motion.button>
              ))}
            </div>

            {/* Asset Changes Tab */}
            {selectedAnalysisTab === "assets" && analysisResult.assetChanges && (
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h4 className="text-lg font-semibold text-emerald-400">Asset & Balance Changes</h4>
                {analysisResult.assetChanges.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3">
                    {analysisResult.assetChanges.map((change: any, index: number) => (
                      <div key={index} className="p-4 rounded-lg border border-emerald-400/30 bg-emerald-400/10">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-emerald-400">
                            {change.tokenType} {change.tokenSymbol && `(${change.tokenSymbol})`}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            change.change === 'increase' ? 'bg-green-600 text-white' :
                            change.change === 'decrease' ? 'bg-red-600 text-white' :
                            'bg-blue-600 text-white'
                          }`}>
                            {change.change.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-sm text-emerald-400/80">
                          <div>From: {change.from}</div>
                          <div>To: {change.to}</div>
                          {change.amount && <div>Amount: {change.amount}</div>}
                          {change.tokenId && <div>Token ID: {change.tokenId}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-emerald-400/60">No asset changes detected</div>
                )}
              </motion.div>
            )}

            {/* Gas Profile Tab */}
            {selectedAnalysisTab === "gas" && analysisResult.gasProfile && (
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h4 className="text-lg font-semibold text-blue-400">Gas Usage Breakdown</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg border border-blue-400/30 bg-blue-400/10">
                    <div className="text-blue-400 font-semibold mb-2">Total Gas Used</div>
                    <div className="text-2xl font-bold text-blue-400">{analysisResult.gasProfile.totalGas.toLocaleString()}</div>
                    <div className={`text-sm mt-1 ${
                      analysisResult.gasProfile.efficiency === 'optimal' ? 'text-green-400' :
                      analysisResult.gasProfile.efficiency === 'moderate' ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>
                      Efficiency: {analysisResult.gasProfile.efficiency}
                    </div>
                  </div>
                  <div className="p-4 rounded-lg border border-blue-400/30 bg-blue-400/10">
                    <div className="text-blue-400 font-semibold mb-2">Operations</div>
                    <div className="space-y-2">
                      {analysisResult.gasProfile.operations.map((op: any, index: number) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-blue-400/80">{op.operation}</span>
                          <span className="text-blue-400">{op.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-lg border border-blue-400/30 bg-blue-400/10">
                  <div className="text-blue-400 font-semibold mb-2">Optimization Suggestions</div>
                  <ul className="list-disc list-inside space-y-1 text-sm text-blue-400/80">
                    {analysisResult.gasProfile.suggestions.map((suggestion: string, index: number) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}

            {/* Events Tab */}
            {selectedAnalysisTab === "events" && analysisResult.decodedEvents && (
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h4 className="text-lg font-semibold text-purple-400">Decoded Events</h4>
                {analysisResult.decodedEvents.length > 0 ? (
                  <div className="space-y-3">
                    {analysisResult.decodedEvents.map((event: any, index: number) => (
                      <div key={index} className="p-4 rounded-lg border border-purple-400/30 bg-purple-400/10">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-purple-400">{event.eventName}</span>
                          <span className="text-xs text-purple-400/60">Log #{event.logIndex}</span>
                        </div>
                        <div className="text-sm text-purple-400/80 mb-2">
                          Contract: {event.contractAddress}
                        </div>
                        <div className="text-sm text-purple-400/90 mb-3 italic">
                          {event.humanReadable}
                        </div>
                        {event.parameters && event.parameters.length > 0 && (
                          <div className="space-y-1">
                            <div className="text-xs font-semibold text-purple-400">Parameters:</div>
                            {event.parameters.map((param: any, paramIndex: number) => (
                              <div key={paramIndex} className="text-xs text-purple-400/70 pl-2">
                                {param.name} ({param.type}): {param.value} {param.indexed && "(indexed)"}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-purple-400/60">No events emitted</div>
                )}
              </motion.div>
            )}

            {/* Execution Trace Tab */}
            {selectedAnalysisTab === "trace" && analysisResult.executionTrace && (
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h4 className="text-lg font-semibold text-orange-400">Execution Steps</h4>
                <div className="max-h-96 overflow-y-auto">
                  {analysisResult.executionTrace.length > 0 ? (
                    <div className="space-y-2">
                      {analysisResult.executionTrace.slice(0, 50).map((step: any, index: number) => (
                        <div key={index} className="p-3 rounded border border-orange-400/30 bg-orange-400/10 text-xs">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-orange-400">
                              PC: {step.pc} | {step.opcode}
                            </span>
                            <span className="text-orange-400/70">
                              Gas: {step.gas} (-{step.gasCost})
                            </span>
                          </div>
                          {step.error && (
                            <div className="text-red-400 text-xs">Error: {step.error}</div>
                          )}
                        </div>
                      ))}
                      {analysisResult.executionTrace.length > 50 && (
                        <div className="text-orange-400/60 text-sm text-center">
                          ... and {analysisResult.executionTrace.length - 50} more steps
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-orange-400/60">No execution trace available</div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Error Analysis Tab */}
            {selectedAnalysisTab === "error" && analysisResult.errorAnalysis && (
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h4 className="text-lg font-semibold text-red-400">Error Analysis & Solutions</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg border border-red-400/30 bg-red-400/10">
                    <div className="text-red-400 font-semibold mb-2">Error Details</div>
                    <div className="text-sm space-y-1">
                      <div><span className="text-red-400/70">Type:</span> {analysisResult.errorAnalysis.errorType}</div>
                      <div><span className="text-red-400/70">Reason:</span> {analysisResult.errorAnalysis.reason}</div>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg border border-red-400/30 bg-red-400/10">
                    <div className="text-red-400 font-semibold mb-2">Common Causes</div>
                    <ul className="list-disc list-inside space-y-1 text-sm text-red-400/80">
                      {analysisResult.errorAnalysis.commonCauses.map((cause: string, index: number) => (
                        <li key={index}>{cause}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg border border-green-400/30 bg-green-400/10">
                    <div className="text-green-400 font-semibold mb-2">Suggested Solutions</div>
                    <ul className="list-disc list-inside space-y-1 text-sm text-green-400/80">
                      {analysisResult.errorAnalysis.suggestions.map((suggestion: string, index: number) => (
                        <li key={index}>{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-4 rounded-lg border border-blue-400/30 bg-blue-400/10">
                    <div className="text-blue-400 font-semibold mb-2">Fix Steps</div>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-blue-400/80">
                      {analysisResult.errorAnalysis.fixSteps.map((step: string, index: number) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </motion.div>

      {/* Contract Validation Section */}
      <motion.div 
        className="w-full max-w-4xl glass-morphism rounded-2xl shadow-2xl p-8 relative z-10 card-hover"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 3.0 }}
      >
        <motion.h2 
          className="text-3xl font-bold text-[#FF6B6B] mb-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 3.2 }}
        >
          Smart Contract Validation
        </motion.h2>
        
        <motion.form 
          onSubmit={handleContractValidation} 
          className="flex flex-col gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 3.4 }}
        >
          <motion.label 
            className="text-[#FF6B6B] font-semibold"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 3.6 }}
          >
            Contract Address
            <motion.input
              className="w-full mt-2 p-3 rounded-lg bg-black/50 text-white border border-[#FF6B6B]/40 focus:outline-none focus:border-[#FF6B6B] focus:ring-2 focus:ring-[#FF6B6B]/20 transition-all duration-300"
              value={contractAddress}
              onChange={e => setContractAddress(e.target.value)}
              placeholder="0x... (contract address to validate)"
              required
              whileFocus={{ scale: 1.02 }}
            />
          </motion.label>
          
          <motion.button
            type="submit"
            className="px-6 py-3 rounded-full bg-[#FF6B6B] text-black font-bold text-lg shadow-lg hover:bg-[#ff5252] transition-all duration-300 button-glow"
            disabled={validationLoading}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 3.8 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {validationLoading ? (
              <motion.span 
                className="loading-dots"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                Validating
              </motion.span>
            ) : (
              "Validate Contract"
            )}
          </motion.button>
        </motion.form>

        {validationError && (
          <motion.div 
            className="mt-6 text-red-400 font-bold bg-red-900/20 p-3 rounded-lg border border-red-400/30"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            Validation Error: {validationError}
          </motion.div>
        )}

        {validationResult && (
          <motion.div 
            className="mt-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-[#FF6B6B] font-bold text-xl mb-4">Contract Validation Result:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className={`p-4 rounded-lg border ${
                validationResult.isContract 
                  ? 'bg-green-900/20 border-green-400/30 text-green-400' 
                  : 'bg-yellow-900/20 border-yellow-400/30 text-yellow-400'
              }`}>
                <div className="font-bold">Type: {validationResult.isContract ? 'SMART CONTRACT' : 'EOA/WALLET'}</div>
                <div className="text-sm mt-1">Bytecode Size: {validationResult.bytecodeSize || 0} bytes</div>
              </div>
              <div className="p-4 rounded-lg border border-[#FF6B6B]/30 bg-[#FF6B6B]/10 text-[#FF6B6B]">
                <div className="font-bold">Balance: {validationResult.balance} ETH</div>
                <div className="text-sm mt-1">Nonce: {validationResult.nonce}</div>
              </div>
            </div>
            <pre className="bg-black/70 text-[#FF6B6B] rounded-lg p-4 overflow-x-auto text-xs max-h-96 border border-[#FF6B6B]/20">
              {JSON.stringify(validationResult, null, 2)}
            </pre>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
