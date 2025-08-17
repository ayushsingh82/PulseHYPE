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
  const [shareableLink, setShareableLink] = useState("");

  // Initialize simulator when network changes
  useEffect(() => {
    setSimulator(new HyperEVMSimulator(network));
  }, [network]);

    // Predefined scenarios for testing
  const scenarios = [
    {
      name: "Simple ETH Transfer",
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
      description: "Deploy a simple contract",
      params: {
        value: "0.0",
        data: "0x608060405234801561001057600080fd5b50610150806100206000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c80636057361d1461003b578063b05784b814610057575b600080fd5b610055600480360381019061005091906100c3565b610075565b005b61005f61007f565b60405161006c91906100ff565b60405180910390f35b8060008190555050565b60008054905090565b600080fd5b6000819050919050565b6100a08161008d565b81146100ab57600080fd5b50565b6000813590506100bd81610097565b92915050565b6000602082840312156100d9576100d8610088565b5b60006100e7848285016100ae565b91505092915050565b6100f98161008d565b82525050565b600060208201905061011460008301846100f0565b9291505056fea2646970667358221220a2d45c0b77a5f6d3c8c4d4e7f8e9f2a5b6c9d0e1f264736f6c63430008120033",
        gasLimit: "200000"
      }
    }
  ];

  // Load scenario data
  const loadScenario = (scenarioIndex: number) => {
    const scenario = scenarios[scenarioIndex];
    if (scenario) {
      setToAddress(scenario.params.to || "");
      setValue(scenario.params.value || "");
      setData(scenario.params.data || "");
      setGasLimit(scenario.params.gasLimit || "");
      
      // Clear previous results
      setSimulationResult(null);
      setSimulationError("");
    }
  };

  // Main simulation function
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
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Comprehensive transaction simulation platform for HyperEVM ecosystem. 
            Test, debug, and optimize your transactions before execution.
          </p>
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

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex space-x-4 border-b border-gray-700">
            {[
              { id: 'single', label: '🎯 Single Transaction', desc: 'Simulate individual transactions' },
              { id: 'bundle', label: '📦 Bundle Simulation', desc: 'Test multiple transactions together' },
              { id: 'analysis', label: '🔍 Advanced Analysis', desc: 'Deep dive into transaction behavior' }
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
                className="mb-4 text-emerald-400 hover:text-emerald-300 font-medium"
              >
                {showAdvanced ? '▼' : '▶'} Advanced Parameters
              </button>

              {showAdvanced && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-gray-700/30 rounded-lg border border-gray-600">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Max Fee Per Gas</label>
                    <input
                      type="text"
                      value={maxFeePerGas}
                      onChange={(e) => setMaxFeePerGas(e.target.value)}
                      placeholder="Auto"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Max Priority Fee</label>
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
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleSimulation}
                  disabled={simulationLoading || (!toAddress && !data)}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors"
                >
                  {simulationLoading ? '🔄 Simulating...' : 
                   (!toAddress && data) ? '🚀 Deploy Contract' : '🎯 Simulate Transaction'}
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
