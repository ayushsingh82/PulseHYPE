/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { SparklesCore } from "../../components/ui/sparkles";
import { SimulationDashboard } from "../../components/SimulationDashboard";
import { HyperEVMSimulator, SimulationRequest, HYPEREVM_CONFIG, HYPEREVM_RPC_ENDPOINTS, utils } from "./enhanced-helper";

export default function HyperEVMSimulatorPage() {
  // Core simulation state
  const [simulator, setSimulator] = useState<HyperEVMSimulator | null>(null);
  const [network, setNetwork] = useState<'mainnet' | 'testnet'>('mainnet');
  const [selectedRPC, setSelectedRPC] = useState(HYPEREVM_RPC_ENDPOINTS[0]);

  // Transaction parameters
  const [fromAddress, setFromAddress] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [value, setValue] = useState("");
  const [gasLimit, setGasLimit] = useState("");
  const [gasPrice, setGasPrice] = useState("");
  const [data, setData] = useState("");
  const [blockNumber, setBlockNumber] = useState("");

  // Advanced parameters
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [nonce, setNonce] = useState("");
  const [maxFeePerGas, setMaxFeePerGas] = useState("");
  const [maxPriorityFeePerGas, setMaxPriorityFeePerGas] = useState("");
  const [simulationMode, setSimulationMode] = useState<"realtime" | "historical">("realtime");

  // Results and loading states
  const [simulationResult, setSimulationResult] = useState<any>(null);
  const [simulationLoading, setSimulationLoading] = useState(false);
  const [simulationError, setSimulationError] = useState("");

  // Bundle simulation
  const [bundleTransactions, setBundleTransactions] = useState<SimulationRequest[]>([]);
  const [bundleResults, setBundleResults] = useState<any[]>([]);

  // State overrides
  const [stateOverrides, setStateOverrides] = useState<Record<string, any>>({});
  const [impersonatedAccount, setImpersonatedAccount] = useState("");

  // UI state
  const [activeTab, setActiveTab] = useState<'single' | 'bundle' | 'analysis'>('single');
  
  // Blockchain information state
  const [blockchainInfo, setBlockchainInfo] = useState<any>(null);
  const [gasInfo, setGasInfo] = useState<any>(null);
  const [mempoolInfo, setMempoolInfo] = useState<any>(null);
  const [blockchainLoading, setBlockchainLoading] = useState(false);
  const [shareableLink, setShareableLink] = useState("");

  // Initialize simulator when network changes
  useEffect(() => {
    const newSimulator = new HyperEVMSimulator(network);
    setSimulator(newSimulator);
    
    // Fetch initial blockchain info
    fetchBlockchainInfo(newSimulator);
  }, [network]);

  // Fetch blockchain information
  const fetchBlockchainInfo = async (sim?: HyperEVMSimulator) => {
    const currentSimulator = sim || simulator;
    if (!currentSimulator) return;
    
    setBlockchainLoading(true);
    try {
      const [blockchain, gas, mempool] = await Promise.all([
        currentSimulator.getBlockchainInfo().catch(() => null),
        currentSimulator.getGasInfo().catch(() => null),
        currentSimulator.getMempoolInfo().catch(() => null)
      ]);
      
      setBlockchainInfo(blockchain);
      setGasInfo(gas);
      setMempoolInfo(mempool);
    } catch (error) {
      console.error('Error fetching blockchain info:', error);
    } finally {
      setBlockchainLoading(false);
    }
  };

    // Predefined scenarios for testing
  const scenarios = [
    {
      name: "Simple HYPE Transfer",
      description: "Transfer 1 HYPE to another address",
      params: {
        to: "0x742D35Cc6634c0532925A3B8d7C9DD7fEAd9c027",
        value: "1.0",
        gasLimit: "21000"
      }
    },
    {
      name: "ERC20 Transfer", 
      description: "Transfer tokens using ERC20 interface",
      params: {
        to: "0xA0b86a33E6F57c8c05Bd7b4F2F3E8a7e4b2F57C8",
        value: "0.0",
        data: "0xa9059cbb000000000000000000000000742D35Cc6634c0532925A3B8d7C9DD7fEAd9c027000000000000000000000000000000000000000000000000016345785d8a0000",
        gasLimit: "60000"
      }
    },
    {
      name: "Contract Deployment",
      description: "Deploy a simple storage contract",
      params: {
        value: "0.0",
        data: "0x608060405234801561001057600080fd5b50610150806100206000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c80636057361d1461003b578063b05784b814610057575b600080fd5b610055600480360381019061005091906100c3565b610075565b005b61005f61007f565b60405161006c91906100ff565b60405180910390f35b8060008190555050565b60008054905090565b600080fd5b6000819050919050565b6100a08161008d565b81146100ab57600080fd5b50565b6000813590506100bd81610097565b92915050565b6000602082840312156100d9576100d8610088565b5b60006100e7848285016100ae565b91505092915050565b6100f98161008d565b82525050565b600060208201905061011460008301846100f0565b9291505056fea2646970667358221220a2d45c0b77a5f6d3c8c4d4e7f8e9f2a5b6c9d0e1f264736f6c63430008120033",
        gasLimit: "200000"
      }
    },
    {
      name: "High Value Transfer",
      description: "Large HYPE transfer (100 HYPE) - tests whale scenarios",
      params: {
        to: "0x742D35Cc6634c0532925A3B8d7C9DD7fEAd9c027",
        value: "100.0",
        gasLimit: "21000"
      }
    },
    {
      name: "Complex DeFi Interaction",
      description: "ERC20 approve call - common DeFi pattern",
      params: {
        to: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
        value: "0.0",
        data: "0x095ea7b3000000000000000000000000742D35Cc6634c0532925A3B8d7C9DD7fEAd9c027ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
        gasLimit: "100000"
      }
    }
  ];

  // Load scenario data - supports both old scenarios array and new enhanced scenarios
  const loadScenario = (scenarioOrIndex: any) => {
    let scenario;
    
    if (typeof scenarioOrIndex === 'number') {
      // Old format - index into scenarios array
      scenario = scenarios[scenarioOrIndex];
      if (scenario) {
        setToAddress(scenario.params.to || "");
        setValue(scenario.params.value || "");
        setData(scenario.params.data || "");
        setGasLimit(scenario.params.gasLimit || "");
      }
    } else {
      // New format - scenario object
      scenario = scenarioOrIndex;
      setFromAddress(scenario.fromAddress);
      setToAddress(scenario.toAddress);
      setValue(scenario.value);
      setGasLimit(scenario.gasLimit);
      setGasPrice(scenario.gasPrice);
      if (scenario.data) {
        setData(scenario.data);
      } else {
        setData("");
      }
    }
    
    // Clear previous results
    setSimulationResult(null);
    setSimulationError("");
  };

  // Main simulation function
  // Enhanced scenarios for testing
  const enhancedScenarios = [
    {
      name: "Simple Transfer",
      icon: "💰",
      description: "Basic HYPE transfer between accounts",
      fromAddress: "0x742d35Cc6C4BA3b8B68d3e9Ea9A7C0C1b3C5aBe1",
      toAddress: "0x742d35Cc6C4BA3b8B68d3e9Ea9A7C0C1b3C5aBe2",
      value: "1.0",
      gasLimit: "21000",
      gasPrice: "20"
    },
    {
      name: "Large Transfer",
      icon: "🐋",
      description: "High-value transfer to test whale scenarios",
      fromAddress: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
      toAddress: "0x742d35Cc6C4BA3b8B68d3e9Ea9A7C0C1b3C5aBe2",
      value: "1000.0",
      gasLimit: "21000",
      gasPrice: "50"
    },
    {
      name: "Smart Contract",
      icon: "📄",
      description: "Contract interaction with complex data",
      fromAddress: "0x742d35Cc6C4BA3b8B68d3e9Ea9A7C0C1b3C5aBe1",
      toAddress: "0xa0b86a33e6d616c93c8c8f3c9b3d4ed2a8b3d3c4",
      value: "0.0",
      gasLimit: "200000",
      gasPrice: "30",
      data: "0xa9059cbb000000000000000000000000742d35cc6c4ba3b8b68d3e9ea9a7c0c1b3c5abe200000000000000000000000000000000000000000000000de0b6b3a7640000"
    },
    {
      name: "DeFi Interaction",
      icon: "🔄",
      description: "Complex DeFi protocol interaction",
      fromAddress: "0x742d35Cc6C4BA3b8B68d3e9Ea9A7C0C1b3C5aBe1",
      toAddress: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
      value: "5.0",
      gasLimit: "300000",
      gasPrice: "40",
      data: "0x7ff36ab5000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000000"
    },
    {
      name: "Gas Optimization",
      icon: "⚡",
      description: "Test transaction with optimized gas settings",
      fromAddress: "0x742d35Cc6C4BA3b8B68d3e9Ea9A7C0C1b3C5aBe1",
      toAddress: "0x742d35Cc6C4BA3b8B68d3e9Ea9A7C0C1b3C5aBe2",
      value: "0.1",
      gasLimit: "21000",
      gasPrice: "1"
    }
  ];

  const handleSimulation = async () => {
    if (!simulator) {
      setSimulationError("Simulator not initialized");
      return;
    }

    // Check if this is a contract deployment (toAddress is empty and data is provided)
    const isContractDeployment = !toAddress.trim() && data && data.trim() !== "";
    
    // For regular transactions (not contract deployment), toAddress is required
    if (!isContractDeployment && !toAddress.trim()) {
      setSimulationError("To address is required for regular transactions");
      return;
    }

    // If toAddress is provided, it must be valid
    if (toAddress.trim() && !utils.isValidHyperEVMAddress(toAddress)) {
      setSimulationError("Invalid to address format");
      return;
    }

    setSimulationLoading(true);
    setSimulationError("");

    try {
      const request: SimulationRequest = {
        to: toAddress.trim() || undefined, // Allow undefined for contract deployment
        from: fromAddress || undefined,
        value: value ? utils.parseHypeAmount(value) : undefined,
        data: data || undefined,
        gasLimit: gasLimit || undefined,
        gasPrice: gasPrice || undefined,
        maxFeePerGas: maxFeePerGas || undefined,
        maxPriorityFeePerGas: maxPriorityFeePerGas || undefined,
        blockNumber: blockNumber || undefined,
        stateOverrides: Object.keys(stateOverrides).length > 0 ? stateOverrides : undefined,
      };

      const result = await simulator.simulateTransaction(request);
      setSimulationResult(result);

      if (result.success) {
        // Generate shareable link
        const link = utils.generateShareableLink(Date.now().toString());
        setShareableLink(link);
      }
    } catch (error: any) {
      setSimulationError(error.message || "Simulation failed");
    } finally {
      setSimulationLoading(false);
    }
  };

  // Bundle simulation function
  const handleBundleSimulation = async () => {
    if (!simulator || bundleTransactions.length === 0) {
      return;
    }

    setSimulationLoading(true);
    setSimulationError("");

    try {
      const results = await simulator.simulateBundle(bundleTransactions);
      setBundleResults(results);
    } catch (error: any) {
      setSimulationError(error.message || "Bundle simulation failed");
    } finally {
      setSimulationLoading(false);
    }
  };

  // Add transaction to bundle
  const addToBundleTransaction = () => {
    if (!toAddress) return;

    const newTransaction: SimulationRequest = {
      to: toAddress,
      from: fromAddress || undefined,
      value: value ? utils.parseHypeAmount(value) : undefined,
      data: data || undefined,
      gasLimit: gasLimit || undefined,
      gasPrice: gasPrice || undefined,
    };

    setBundleTransactions([...bundleTransactions, newTransaction]);
    
    // Clear form
    setToAddress("");
    setValue("");
    setData("");
    setGasLimit("");
    setGasPrice("");
  };

  // Generate access list
  const generateAccessList = async () => {
    if (!simulator || !toAddress) return;

    try {
      const tx = {
        to: toAddress,
        from: fromAddress || undefined,
        value: value ? utils.parseHypeAmount(value) : undefined,
        data: data || undefined,
      };

      const accessList = await simulator.generateAccessList(tx);
      console.log("Generated access list:", accessList);
    } catch (error) {
      console.error("Access list generation failed:", error);
    }
  };

  // Handle sharing results
  const handleShare = (link: string) => {
    navigator.clipboard.writeText(link);
    alert("Shareable link copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 w-full h-full">
        <SparklesCore
          id="tsparticlesfullpage"
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
            Transaction Simulator
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Comprehensive transaction simulation platform for HyperEVM ecosystem. 
            Test, debug, and optimize your transactions before execution.
          </p>
          
          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-emerald-500/10 to-green-600/10 p-6 rounded-xl border border-emerald-500/20">
              <div className="text-3xl mb-3">🚀</div>
              <h3 className="font-semibold text-emerald-400 mb-2">Auto-Balance Handling</h3>
              <p className="text-gray-300 text-sm">
                No more "insufficient funds" errors! Automatically provides test balance for realistic simulations.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-600/10 p-6 rounded-xl border border-blue-500/20">
              <div className="text-3xl mb-3">🔬</div>
              <h3 className="font-semibold text-blue-400 mb-2">Advanced Analysis</h3>
              <p className="text-gray-300 text-sm">
                Historical simulation, state overrides, whale testing, access lists, and asset tracking.
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-600/10 p-6 rounded-xl border border-purple-500/20">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="font-semibold text-purple-400 mb-2">HyperEVM Optimized</h3>
              <p className="text-gray-300 text-sm">
                Native support for HyperEVM's low latency, precompiles, and cross-chain features.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Network and RPC Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8 bg-gray-800/50 rounded-lg p-6 border border-gray-700"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Network</label>
              <select
                value={network}
                onChange={(e) => setNetwork(e.target.value as 'mainnet' | 'testnet')}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="mainnet">HyperEVM Mainnet</option>
                <option value="testnet">HyperEVM Testnet</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">RPC Endpoint</label>
              <select
                value={selectedRPC.url}
                onChange={(e) => {
                  const rpc = HYPEREVM_RPC_ENDPOINTS.find(r => r.url === e.target.value);
                  if (rpc) setSelectedRPC(rpc);
                }}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {HYPEREVM_RPC_ENDPOINTS.filter(rpc => 
                  network === 'mainnet' ? rpc.type !== 'testnet' : rpc.type === 'testnet'
                ).map((rpc) => (
                  <option key={rpc.url} value={rpc.url}>
                    {rpc.name} {rpc.type === 'archive' && '(Archive)'}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Blockchain Information Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-8 bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-emerald-400">🔗 HyperEVM Network Status</h3>
            <button
              onClick={() => fetchBlockchainInfo()}
              disabled={blockchainLoading}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              {blockchainLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Refreshing...</span>
                </>
              ) : (
                <>
                  <span>🔄</span>
                  <span>Refresh</span>
                </>
              )}
            </button>
          </div>

          {blockchainInfo && (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-600">
                <div className="text-xs text-gray-400 mb-1">Block Number</div>
                <div className="text-lg font-bold text-white">#{blockchainInfo.blockNumber}</div>
              </div>
              
              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-600">
                <div className="text-xs text-gray-400 mb-1">Network Status</div>
                <div className={`text-lg font-bold ${
                  blockchainInfo.networkStatus === 'healthy' ? 'text-green-400' :
                  blockchainInfo.networkStatus === 'degraded' ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {blockchainInfo.networkStatus === 'healthy' ? '🟢' : 
                   blockchainInfo.networkStatus === 'degraded' ? '🟡' : '🔴'} 
                  {blockchainInfo.networkStatus}
                </div>
              </div>

              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-600">
                <div className="text-xs text-gray-400 mb-1">Gas Price</div>
                <div className="text-lg font-bold text-emerald-400">{blockchainInfo.gasPrice}</div>
              </div>

              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-600">
                <div className="text-xs text-gray-400 mb-1">Block Time</div>
                <div className="text-lg font-bold text-blue-400">{blockchainInfo.blockTime}s</div>
              </div>

              {mempoolInfo && (
                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-600">
                  <div className="text-xs text-gray-400 mb-1">Pending TXs</div>
                  <div className="text-lg font-bold text-purple-400">{mempoolInfo.pendingCount}</div>
                </div>
              )}

              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-600">
                <div className="text-xs text-gray-400 mb-1">Chain ID</div>
                <div className="text-lg font-bold text-yellow-400">{blockchainInfo.chainId}</div>
              </div>
            </div>
          )}

          {gasInfo && (
            <div className="mt-4 bg-gray-800/30 p-4 rounded-lg border border-gray-600">
              <h4 className="text-sm font-semibold text-emerald-400 mb-3">⛽ Gas Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="text-xs text-gray-400 mb-2">Suggested Gas Prices</div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Slow:</span>
                      <span className="text-green-400">{gasInfo.suggestedGasPrice.slow}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Standard:</span>
                      <span className="text-yellow-400">{gasInfo.suggestedGasPrice.standard}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Fast:</span>
                      <span className="text-red-400">{gasInfo.suggestedGasPrice.fast}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="text-xs text-gray-400 mb-2">Gas Limits</div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Simple TX:</span>
                      <span className="text-blue-400">{gasInfo.gasLimit.simple}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Contract:</span>
                      <span className="text-blue-400">{gasInfo.gasLimit.contract}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Complex:</span>
                      <span className="text-blue-400">{gasInfo.gasLimit.complex}</span>
                    </div>
                  </div>
                </div>

                {mempoolInfo && (
                  <div>
                    <div className="text-xs text-gray-400 mb-2">Mempool Status</div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Congestion:</span>
                        <span className={`font-medium ${
                          mempoolInfo.congestionLevel === 'low' ? 'text-green-400' :
                          mempoolInfo.congestionLevel === 'medium' ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          {mempoolInfo.congestionLevel}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Avg Gas:</span>
                        <span className="text-purple-400">{mempoolInfo.avgGasPrice}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex space-x-4 border-b border-gray-700">
            {[
              { id: 'single', label: '🎯 Single Transaction', desc: 'Simulate individual transactions with auto-balance' },
              { id: 'bundle', label: '📦 Bundle Simulation', desc: 'Test multiple transactions together' },
              { id: 'analysis', label: '🔍 Advanced Analysis', desc: 'Deep dive with historical & whale testing' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-emerald-400 border-b-2 border-emerald-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <div>{tab.label}</div>
                <div className="text-xs text-gray-500">{tab.desc}</div>
              </button>
            ))}
            
            {/* Quick Link to Advanced Features Page */}
            <a
              href="/advanced"
              className="px-6 py-3 text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors border-l border-gray-600"
            >
              <div>🚀 Advanced Features</div>
              <div className="text-xs text-gray-500">Full feature showcase</div>
            </a>
          </div>
        </motion.div>

        {/* Single Transaction Tab */}
        {activeTab === 'single' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-emerald-400 mb-2">🎯 Single Transaction Simulator</h2>
              <p className="text-gray-300">Test individual transactions with comprehensive analysis and auto-balance handling</p>
            </div>

            {/* Enhanced Info Banner */}
            <div className="bg-gradient-to-r from-emerald-900/20 to-blue-900/20 border border-emerald-400/30 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🚀</span>
                <div>
                  <h5 className="font-semibold text-emerald-400 mb-1">Smart Balance Management</h5>
                  <p className="text-emerald-200 text-sm leading-relaxed">
                    Our simulator automatically provides 10,000 HYPE test balance when needed, eliminating "insufficient funds" errors. 
                    Perfect for testing whale transactions, DeFi interactions, and complex scenarios without requiring actual funds!
                  </p>
                </div>
              </div>
            </div>

            {/* Scenario Selection */}
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-emerald-400 mb-4">🚀 Quick Start Scenarios</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {scenarios.map((scenario, index) => (
                  <button
                    key={index}
                    onClick={() => loadScenario(index)}
                    className="p-4 bg-gray-700/50 hover:bg-gray-700 rounded-lg border border-gray-600 hover:border-emerald-500 transition-colors text-left"
                  >
                    <div className="font-semibold text-emerald-300">{scenario.name}</div>
                    <div className="text-sm text-gray-400 mt-1">{scenario.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Transaction Parameters */}
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-emerald-400 mb-4">📝 Transaction Parameters</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">From Address</label>
                  <input
                    type="text"
                    value={fromAddress}
                    onChange={(e) => setFromAddress(e.target.value)}
                    placeholder="0x742d35Cc..."
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">To Address *</label>
                  <input
                    type="text"
                    value={toAddress}
                    onChange={(e) => setToAddress(e.target.value)}
                    placeholder="0x742d35Cc..."
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Value (HYPE)</label>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="0.0"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Gas Limit</label>
                  <input
                    type="text"
                    value={gasLimit}
                    onChange={(e) => setGasLimit(e.target.value)}
                    placeholder="21000"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Gas Price (gwei)</label>
                  <input
                    type="text"
                    value={gasPrice}
                    onChange={(e) => setGasPrice(e.target.value)}
                    placeholder="20"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">Call Data (Optional)</label>
                <textarea
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  placeholder="0x..."
                  rows={3}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Advanced Parameters Toggle */}
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="mb-4 text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-2"
              >
                {showAdvanced ? '🔽' : '🔼'} Advanced Simulation Features
                <span className="text-xs text-gray-400">(Balance handling, impersonation, state overrides)</span>
              </button>

              {showAdvanced && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mb-6 space-y-4 bg-gray-800/30 p-4 rounded-lg border border-gray-600"
                >
                  {/* Info Banner */}
                  <div className="bg-emerald-900/20 border border-emerald-400/30 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <span className="text-emerald-400 text-xl">✨</span>
                      <div>
                        <h5 className="font-semibold text-emerald-400">Enhanced Simulation Engine</h5>
                        <p className="text-emerald-200 text-sm">
                          Automatically handles insufficient balance issues by providing test funds. 
                          Perfect for whale testing and complex scenarios!
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Max Fee Per Gas (gwei)</label>
                      <input
                        type="text"
                        value={maxFeePerGas}
                        onChange={(e) => setMaxFeePerGas(e.target.value)}
                        placeholder="Auto"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Max Priority Fee (gwei)</label>
                      <input
                        type="text"
                        value={maxPriorityFeePerGas}
                        onChange={(e) => setMaxPriorityFeePerGas(e.target.value)}
                        placeholder="Auto"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Block Number</label>
                      <input
                        type="text"
                        value={blockNumber}
                        onChange={(e) => setBlockNumber(e.target.value)}
                        placeholder="Latest"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Advanced Feature Buttons */}
                  <div className="border-t border-gray-600 pt-4">
                    <h5 className="text-sm font-semibold text-gray-300 mb-3">🚀 Advanced Analysis Tools</h5>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={async () => {
                          if (!simulator) return;
                          try {
                            const result = await simulator.generateAccessListForTransaction({
                              to: toAddress,
                              value: value,
                              data: data || '0x'
                            });
                            console.log('Access List Result:', result);
                            alert(JSON.stringify(result, null, 2));
                          } catch (err: any) {
                            alert(`Error: ${err.message}`);
                          }
                        }}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        📋 Generate Access List
                      </button>
                      
                      <button
                        onClick={async () => {
                          if (!simulator || !toAddress) return;
                          try {
                            const result = await simulator.trackAssetChanges({
                              to: toAddress,
                              value: value,
                              data: data || '0x',
                              from: fromAddress || undefined
                            });
                            console.log('Asset Tracking Result:', result);
                            alert('Asset tracking complete! Check console for details.');
                          } catch (err: any) {
                            alert(`Error: ${err.message}`);
                          }
                        }}
                        disabled={!toAddress}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        💰 Track Asset Changes
                      </button>

                      <button
                        onClick={async () => {
                          if (!simulator || !toAddress) return;
                          try {
                            const whaleAddress = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';
                            const result = await simulator.simulateWithImpersonation({
                              to: toAddress,
                              value: value,
                              data: data || '0x'
                            }, whaleAddress);
                            setSimulationResult(result);
                            alert('Whale simulation complete! Check results below.');
                          } catch (err: any) {
                            alert(`Error: ${err.message}`);
                          }
                        }}
                        disabled={!toAddress}
                        className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        🐋 Whale Simulation
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Test Scenarios */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  💡 Sample Test Scenarios - <span className="text-emerald-400">Auto-funded for testing!</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {enhancedScenarios.map((scenario, index) => (
                    <button
                      key={index}
                      onClick={() => loadScenario(scenario)}
                      className="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg border border-gray-600 hover:border-emerald-500 transition-all text-left group"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{scenario.icon}</span>
                        <span className="text-sm font-medium text-gray-200 group-hover:text-emerald-300">
                          {scenario.name}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed">{scenario.description}</p>
                      <div className="mt-2 text-xs text-emerald-400 font-medium">
                        Value: {scenario.value} HYPE
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleSimulation}
                  disabled={simulationLoading || (!toAddress && !data)}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
                >
                  {simulationLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Simulating with Auto Balance...</span>
                    </>
                  ) : (
                    <>
                      {(!toAddress && data) ? (
                        <>
                          <span>🚀</span>
                          <span>Deploy Contract</span>
                        </>
                      ) : (
                        <>
                          <span>✨</span>
                          <span>Smart Simulate (Auto-funded)</span>
                        </>
                      )}
                    </>
                  )}
                </button>
                
                <button
                  onClick={generateAccessList}
                  disabled={!toAddress}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors"
                >
                  📋 Generate Access List
                </button>

                <button
                  onClick={addToBundleTransaction}
                  disabled={!toAddress}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors"
                >
                  📦 Add to Bundle
                </button>
              </div>

              {simulationError && (
                <div className="mt-4 p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-red-300">
                  ❌ {simulationError}
                </div>
              )}

              {simulationResult && !simulationError && (
                <div className="mt-4 p-4 bg-emerald-900/30 border border-emerald-500/50 rounded-lg text-emerald-300">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-emerald-400">✅</span>
                    <span className="font-semibold">Simulation Successful!</span>
                  </div>
                  <p className="text-sm text-emerald-200">
                    Auto-balance feature ensured sufficient funds for testing. Check results below for detailed analysis.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Bundle Simulation Tab */}
        {activeTab === 'bundle' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-purple-400 mb-4">📦 Bundle Simulation</h3>
              
              {bundleTransactions.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-3">Queued Transactions ({bundleTransactions.length})</h4>
                  <div className="space-y-2">
                    {bundleTransactions.map((tx, index) => (
                      <div key={index} className="p-3 bg-gray-700/50 rounded-lg border border-gray-600">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-sm">{tx.to}</span>
                          <button
                            onClick={() => setBundleTransactions(bundleTransactions.filter((_, i) => i !== index))}
                            className="text-red-400 hover:text-red-300"
                          >
                            ❌
                          </button>
                        </div>
                        {tx.value && <div className="text-xs text-gray-400">Value: {utils.formatHypeAmount(tx.value)} HYPE</div>}
                      </div>
                    ))}
                  </div>
                  
                  <button
                    onClick={handleBundleSimulation}
                    disabled={simulationLoading}
                    className="mt-4 px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
                  >
                    {simulationLoading ? '🔄 Simulating Bundle...' : '🚀 Simulate Bundle'}
                  </button>
                </div>
              )}

              {bundleTransactions.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <div className="text-4xl mb-4">📦</div>
                  <p>No transactions in bundle. Add transactions from the Single Transaction tab.</p>
                </div>
              )}

              {bundleResults.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold">Bundle Results</h4>
                  {bundleResults.map((result, index) => (
                    <div key={index} className="p-4 bg-gray-700/30 rounded-lg border border-gray-600">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">Transaction {index + 1}</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          result.success ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'
                        }`}>
                          {result.success ? '✅ Success' : '❌ Failed'}
                        </span>
                      </div>
                      <div className="text-sm text-gray-400">
                        Gas Used: {result.gasUsed} | Status: {result.executionResult.status}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Results Section */}
        {simulationResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-8"
          >
            <SimulationDashboard 
              result={simulationResult} 
              onShare={shareableLink ? handleShare : undefined}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}
