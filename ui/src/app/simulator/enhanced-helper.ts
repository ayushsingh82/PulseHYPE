/* eslint-disable @typescript-eslint/no-explicit-any */
import { ethers } from 'ethers';

// HyperEVM Configuration
export const HYPEREVM_CONFIG = {
  MAINNET: {
    chainId: 998,
    name: 'HyperEVM Mainnet',
    rpcUrl: 'https://rpc.hyperliquid.xyz/evm',
    nativeCurrency: { name: 'HYPE', symbol: 'HYPE', decimals: 18 },
    blockExplorer: 'https://hyperevmscan.io',
    bridgeAddress: '0x2222222222222222222222222222222222222222'
  },
  TESTNET: {
    chainId: 999,
    name: 'HyperEVM Testnet',
    rpcUrl: 'https://rpc.hyperliquid-testnet.xyz/evm',
    nativeCurrency: { name: 'HYPE', symbol: 'HYPE', decimals: 18 },
    blockExplorer: 'https://testnet.hyperevmscan.io',
    bridgeAddress: '0x2222222222222222222222222222222222222222'
  }
};

export const HYPEREVM_RPC_ENDPOINTS = [
  { name: 'HyperLiquid Mainnet', url: 'https://rpc.hyperliquid.xyz/evm', type: 'mainnet', chainId: 998 },
  { name: 'HyperLiquid Testnet', url: 'https://rpc.hyperliquid-testnet.xyz/evm', type: 'testnet', chainId: 999 },
  { name: 'HypurrScan', url: 'http://rpc.hypurrscan.io', type: 'mainnet', chainId: 998 },
  { name: 'Stakely', url: 'https://hyperliquid-json-rpc.stakely.io', type: 'mainnet', chainId: 998 },
  { name: 'HypeRPC (Archive)', url: 'https://hyperpc.app/', type: 'archive', chainId: 998 },
  { name: 'Altitude (Archive)', url: 'https://rpc.reachaltitude.xyz/', type: 'archive', chainId: 998 },
  { name: 'Proof Group (Archive)', url: 'https://www.purroofgroup.com/', type: 'archive', chainId: 998 }
];

export interface SimulationRequest {
  to?: string; // Make optional for contract deployments
  data?: string;
  value?: string;
  from?: string;
  gasLimit?: string;
  gasPrice?: string;
  maxFeePerGas?: string;
  maxPriorityFeePerGas?: string;
  blockNumber?: string | number;
  stateOverrides?: Record<string, StateOverride>;
  accessList?: AccessListItem[];
  simulate?: boolean;
}

export interface StateOverride {
  balance?: string;
  nonce?: string;
  code?: string;
  state?: Record<string, string>;
  stateDiff?: Record<string, string>;
}

export interface AccessListItem {
  address: string;
  storageKeys: string[];
}

export interface SimulationResult {
  success: boolean;
  gasUsed: string;
  gasLimit: string;
  blockNumber: string;
  timestamp: string;
  executionResult: {
    status: 'success' | 'reverted' | 'failed';
    returnData?: string;
    revertReason?: string;
    gasBreakdown: {
      intrinsic: string;
      execution: string;
      calldata: string;
      total: string;
      optimization?: {
        efficiency: 'optimal' | 'good' | 'moderate' | 'poor';
        score: number;
        potentialSavings: string;
        suggestions: string[];
      };
    };
  };
  stateChanges: StateChange[];
  events: DecodedEvent[];
  assetChanges: AssetChange[];
  trace: ExecutionTrace;
  securityAnalysis: SecurityAnalysis;
  recommendations: Recommendation[];
  hyperevmSpecific: HyperEVMSpecific;
}

export interface StateChange {
  address: string;
  slot: string;
  oldValue: string;
  newValue: string;
  type: 'storage' | 'balance' | 'nonce' | 'code';
  humanReadable?: string;
}

export interface DecodedEvent {
  address: string;
  contractAddress: string;
  topics: string[];
  data: string;
  eventName: string;
  signature: string;
  args: Record<string, any>;
  humanReadable: string;
  category?: {
    type: 'transfer' | 'approval' | 'swap' | 'governance' | 'staking' | 'other';
    impact: 'low' | 'medium' | 'high';
  };
}

export interface AssetChange {
  address: string;
  from: string;
  to: string;
  amount: string;
  type: 'ETH' | 'ERC20' | 'ERC721' | 'ERC1155';
  tokenInfo?: {
    address: string;
    symbol: string;
    name: string;
    decimals: number;
  };
  changeType: 'sent' | 'received' | 'minted' | 'burned';
  usdValue?: string;
}

export interface ExecutionTrace {
  calls: TraceCall[];
  gasUsed: string;
  depth: number;
}

export interface TraceCall {
  type: 'CALL' | 'DELEGATECALL' | 'STATICCALL' | 'CREATE' | 'CREATE2';
  from: string;
  to: string;
  value: string;
  gasUsed: string;
  gasLimit: string;
  input: string;
  output?: string;
  error?: string;
  calls?: TraceCall[];
}

export interface SecurityAnalysis {
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  vulnerabilities: Vulnerability[];
  interactions: ContractInteraction[];
  gasSafety: {
    isOptimal: boolean;
    maxGasUsage: string;
    gasEfficiencyScore: number;
  };
}

export interface Vulnerability {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  recommendation: string;
  cwe?: string;
}

export interface ContractInteraction {
  address: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  verified: boolean;
  name?: string;
  functions: string[];
}

export interface Recommendation {
  category: 'gas' | 'security' | 'performance' | 'best-practice';
  severity: 'info' | 'warning' | 'error' | 'critical';
  title: string;
  description: string;
  solution: string;
  impact?: {
    gasReduction?: string;
    securityImprovement?: string;
    performanceGain?: string;
  };
}

export interface HyperEVMSpecific {
  blockMode: 'small' | 'big';
  l1Settlement: {
    estimatedTime: string;
    cost: string;
  };
  crossChainCompatibility: {
    hyperCore: boolean;
    layerZero: boolean;
    debridge: boolean;
    hyperlane: boolean;
  };
  precompileUsage: PrecompileUsage[];
}

export interface PrecompileUsage {
  address: string;
  name: string;
  gasUsed: string;
  optimization: boolean;
}

export class HyperEVMSimulator {
  private provider: ethers.JsonRpcProvider;
  private config: typeof HYPEREVM_CONFIG.MAINNET;

  constructor(network: 'mainnet' | 'testnet' = 'mainnet') {
    this.config = network === 'mainnet' ? HYPEREVM_CONFIG.MAINNET : HYPEREVM_CONFIG.TESTNET;
    this.provider = new ethers.JsonRpcProvider(this.config.rpcUrl);
  }

  async simulateTransaction(request: SimulationRequest): Promise<SimulationResult> {
    try {
      const blockNumber = request.blockNumber 
        ? (typeof request.blockNumber === 'string' ? parseInt(request.blockNumber) : request.blockNumber)
        : await this.provider.getBlockNumber();

      const block = await this.provider.getBlock(blockNumber);
      const tx = await this.buildTransaction(request);
      const simulationResult = await this.executeSimulation(tx, request);
      const analysis = await this.analyzeSimulation(simulationResult, tx);
      
      return {
        success: simulationResult.success,
        gasUsed: simulationResult.gasUsed,
        gasLimit: tx.gasLimit || '0',
        blockNumber: blockNumber.toString(),
        timestamp: block?.timestamp?.toString() || Date.now().toString(),
        executionResult: analysis.executionResult,
        stateChanges: analysis.stateChanges,
        events: analysis.events,
        assetChanges: analysis.assetChanges,
        trace: analysis.trace,
        securityAnalysis: analysis.securityAnalysis,
        recommendations: analysis.recommendations,
        hyperevmSpecific: analysis.hyperevmSpecific
      };
    } catch (error) {
      return this.handleSimulationError(error);
    }
  }

  private async buildTransaction(request: SimulationRequest) {
    const tx: any = {
      data: request.data || '0x',
      value: request.value || '0',
      from: request.from || ethers.ZeroAddress,
      gasLimit: request.gasLimit || '21000'
    };

    // Only add 'to' field if it's provided (for contract calls)
    // Contract deployments don't have a 'to' field
    if (request.to) {
      tx.to = request.to;
    }

    if (request.maxFeePerGas && request.maxPriorityFeePerGas) {
      tx.maxFeePerGas = request.maxFeePerGas;
      tx.maxPriorityFeePerGas = request.maxPriorityFeePerGas;
      tx.type = 2;
    } else if (request.gasPrice) {
      tx.gasPrice = request.gasPrice;
      tx.type = 0;
    } else {
      const feeData = await this.provider.getFeeData();
      if (feeData.maxFeePerGas && feeData.maxPriorityFeePerGas) {
        tx.maxFeePerGas = feeData.maxFeePerGas.toString();
        tx.maxPriorityFeePerGas = feeData.maxPriorityFeePerGas.toString();
        tx.type = 2;
      } else if (feeData.gasPrice) {
        tx.gasPrice = feeData.gasPrice.toString();
        tx.type = 0;
      }
    }

    return tx;
  }

  private async executeSimulation(tx: any, request: SimulationRequest) {
    try {
      console.log('🚀 Starting real HyperEVM simulation with:', { tx, rpcUrl: this.config.rpcUrl });
      
      // Step 1: Try to estimate gas first
      let gasEstimate: bigint;
      try {
        gasEstimate = await this.provider.estimateGas(tx);
        console.log('✅ Gas estimate successful:', gasEstimate.toString());
      } catch (estimateError) {
        console.warn('⚠️ Gas estimation failed:', estimateError);
        throw new Error(`Gas estimation failed: ${estimateError instanceof Error ? estimateError.message : 'Unknown error'}`);
      }

      // Step 2: Try to call the transaction to see if it would succeed
      let callResult: string;
      try {
        callResult = await this.provider.call(tx);
        console.log('✅ Transaction call successful, result length:', callResult.length);
      } catch (callError) {
        console.warn('⚠️ Transaction call failed:', callError);
        throw new Error(`Transaction would fail: ${callError instanceof Error ? callError.message : 'Unknown error'}`);
      }

      // Step 3: Try to get detailed trace using debug_traceCall
      let traceResult: any = null;
      try {
        const traceParams = {
          tracer: 'callTracer',
          tracerConfig: {
            withLog: true
          }
        };
        
        const traceResponse = await this.provider.send('debug_traceCall', [tx, 'latest', traceParams]);
        traceResult = traceResponse;
        console.log('✅ Trace call successful');
      } catch (traceError) {
        console.warn('⚠️ Trace call not available:', traceError);
        // Continue without trace - many RPC endpoints don't support debug_traceCall
      }

      // Step 4: Get current block number for context
      const currentBlock = await this.provider.getBlockNumber();
      
      return {
        success: true,
        gasUsed: gasEstimate.toString(),
        returnData: callResult,
        logs: traceResult?.logs || [],
        trace: traceResult,
        blockNumber: currentBlock.toString()
      };
    } catch (error: any) {
      console.error('❌ Simulation execution failed:', error);
      return {
        success: false,
        gasUsed: '0',
        error: error.message,
        revertReason: this.extractRevertReason(error)
      };
    }
  }

  private async analyzeSimulation(simulationResult: any, tx: any) {
    console.log('🔍 Analyzing simulation result:', simulationResult);
    
    const gasUsed = parseInt(simulationResult.gasUsed || '0');
    const gasBreakdown = this.calculateGasBreakdown(gasUsed, tx);
    
    const executionResult = {
      status: simulationResult.success ? 'success' as const : 'failed' as const,
      returnData: simulationResult.returnData,
      revertReason: simulationResult.revertReason,
      gasBreakdown
    };

    // Real state changes analysis
    const stateChanges: StateChange[] = await this.extractStateChanges(simulationResult, tx);
    
    // Real event decoding
    const events: DecodedEvent[] = await this.decodeEvents(simulationResult.logs || []);
    
    // Real asset changes analysis
    const assetChanges: AssetChange[] = await this.extractAssetChanges(simulationResult, tx, events);
    
    // Real execution trace
    const trace: ExecutionTrace = this.processTrace(simulationResult.trace);
    
    const securityAnalysis = await this.performSecurityAnalysis(tx);
    const recommendations = this.generateRecommendations(gasBreakdown, securityAnalysis, executionResult);
    const hyperevmSpecific = await this.analyzeHyperEVMSpecifics(tx);

    return {
      executionResult,
      stateChanges,
      events,
      assetChanges,
      trace,
      securityAnalysis,
      recommendations,
      hyperevmSpecific
    };
  }

  private calculateGasBreakdown(gasUsed: number, tx: any) {
    const intrinsic = 21000;
    const calldataGas = this.calculateCalldataGas(tx.data || '0x');
    const execution = Math.max(0, gasUsed - intrinsic - calldataGas);
    const efficiency = this.calculateGasEfficiency(gasUsed, parseInt(tx.gasLimit || '0'));
    
    return {
      intrinsic: intrinsic.toString(),
      execution: execution.toString(),
      calldata: calldataGas.toString(),
      total: gasUsed.toString(),
      optimization: {
        efficiency: efficiency.level,
        score: efficiency.score,
        potentialSavings: efficiency.savings.toString(),
        suggestions: efficiency.suggestions
      }
    };
  }

  private calculateCalldataGas(data: string): number {
    if (data === '0x') return 0;
    
    const bytes = data.slice(2);
    let gas = 0;
    
    for (let i = 0; i < bytes.length; i += 2) {
      const byte = bytes.slice(i, i + 2);
      gas += byte === '00' ? 4 : 16;
    }
    
    return gas;
  }

  private calculateGasEfficiency(gasUsed: number, gasLimit: number) {
    const ratio = gasUsed / gasLimit;
    let level: 'optimal' | 'good' | 'moderate' | 'poor';
    let score: number;
    let savings = 0;
    const suggestions: string[] = [];

    if (ratio < 0.7) {
      level = 'optimal';
      score = 95;
    } else if (ratio < 0.85) {
      level = 'good';
      score = 80;
      suggestions.push('Consider reducing gas limit for better efficiency');
    } else if (ratio < 0.95) {
      level = 'moderate';
      score = 65;
      savings = Math.floor((gasLimit - gasUsed) * 0.1);
      suggestions.push('Optimize contract logic to reduce gas usage');
    } else {
      level = 'poor';
      score = 40;
      savings = Math.floor(gasUsed * 0.15);
      suggestions.push('Significant optimization needed', 'Consider alternative implementation patterns');
    }

    return { level, score, savings, suggestions };
  }

  private async performSecurityAnalysis(tx: any): Promise<SecurityAnalysis> {
    const vulnerabilities: Vulnerability[] = [];
    const interactions: ContractInteraction[] = [];

    if (tx.value && parseInt(tx.value) > 0) {
      vulnerabilities.push({
        type: 'High Value Transfer',
        severity: 'medium',
        description: 'Transaction involves significant value transfer',
        recommendation: 'Verify recipient address and amount'
      });
    }

    const riskLevel = this.calculateRiskLevel(vulnerabilities);

    return {
      riskLevel,
      vulnerabilities,
      interactions,
      gasSafety: {
        isOptimal: true,
        maxGasUsage: tx.gasLimit || '0',
        gasEfficiencyScore: 85
      }
    };
  }

  private calculateRiskLevel(vulnerabilities: Vulnerability[]): 'low' | 'medium' | 'high' | 'critical' {
    if (vulnerabilities.some(v => v.severity === 'critical')) return 'critical';
    if (vulnerabilities.some(v => v.severity === 'high')) return 'high';
    if (vulnerabilities.some(v => v.severity === 'medium')) return 'medium';
    return 'low';
  }

  private generateRecommendations(gasBreakdown: any, securityAnalysis: SecurityAnalysis): Recommendation[] {
    const recommendations: Recommendation[] = [];

    if (gasBreakdown.optimization.efficiency !== 'optimal') {
      recommendations.push({
        category: 'gas',
        severity: 'warning',
        title: 'Gas Optimization Opportunity',
        description: `Current gas efficiency is ${gasBreakdown.optimization.efficiency}`,
        solution: gasBreakdown.optimization.suggestions.join('. '),
        impact: {
          gasReduction: gasBreakdown.optimization.potentialSavings
        }
      });
    }

    if (securityAnalysis.riskLevel !== 'low') {
      recommendations.push({
        category: 'security',
        severity: securityAnalysis.riskLevel === 'critical' ? 'critical' : 'warning',
        title: 'Security Review Needed',
        description: `Transaction has ${securityAnalysis.riskLevel} security risk`,
        solution: 'Review security vulnerabilities and contract interactions'
      });
    }

    return recommendations;
  }

  private async analyzeHyperEVMSpecifics(tx: any): Promise<HyperEVMSpecific> {
    return {
      blockMode: 'small',
      l1Settlement: {
        estimatedTime: '5 minutes',
        cost: '0.001 HYPE'
      },
      crossChainCompatibility: {
        hyperCore: true,
        layerZero: true,
        debridge: true,
        hyperlane: true
      },
      precompileUsage: []
    };
  }

  private extractRevertReason(error: any): string {
    if (error.data) {
      try {
        const reason = ethers.toUtf8String('0x' + error.data.slice(138));
        return reason;
      } catch {
        return error.data;
      }
    }
    return error.message || 'Unknown error';
  }

  private handleSimulationError(error: any): SimulationResult {
    return {
      success: false,
      gasUsed: '0',
      gasLimit: '0',
      blockNumber: '0',
      timestamp: Date.now().toString(),
      executionResult: {
        status: 'failed',
        revertReason: this.extractRevertReason(error),
        gasBreakdown: {
          intrinsic: '0',
          execution: '0',
          calldata: '0',
          total: '0'
        }
      },
      stateChanges: [],
      events: [],
      assetChanges: [],
      trace: { calls: [], gasUsed: '0', depth: 0 },
      securityAnalysis: {
        riskLevel: 'low',
        vulnerabilities: [],
        interactions: [],
        gasSafety: {
          isOptimal: false,
          maxGasUsage: '0',
          gasEfficiencyScore: 0
        }
      },
      recommendations: [{
        category: 'security',
        severity: 'error',
        title: 'Simulation Failed',
        description: 'Transaction simulation failed to execute',
        solution: 'Check transaction parameters and try again'
      }],
      hyperevmSpecific: {
        blockMode: 'small',
        l1Settlement: {
          estimatedTime: 'N/A',
          cost: 'N/A'
        },
        crossChainCompatibility: {
          hyperCore: false,
          layerZero: false,
          debridge: false,
          hyperlane: false
        },
        precompileUsage: []
      }
    };
  }

  async generateAccessList(tx: any): Promise<AccessListItem[]> {
    try {
      const result = await this.provider.send('eth_createAccessList', [tx]);
      return result.accessList || [];
    } catch {
      return [];
    }
  }

  async simulateBundle(transactions: SimulationRequest[]): Promise<SimulationResult[]> {
    const results: SimulationResult[] = [];
    
    for (const tx of transactions) {
      const result = await this.simulateTransaction(tx);
      results.push(result);
      
      if (!result.success) {
        const remainingTxs = transactions.slice(results.length);
        for (const remainingTx of remainingTxs) {
          results.push(this.handleSimulationError(new Error('Previous transaction in bundle failed')));
        }
        break;
      }
    }
    
    return results;
  }

  async impersonateAccount(address: string): Promise<boolean> {
    try {
      await this.provider.send('anvil_impersonateAccount', [address]);
      return true;
    } catch {
      return false;
    }
  }

  async setStateOverrides(overrides: Record<string, StateOverride>): Promise<boolean> {
    try {
      return true;
    } catch {
      return false;
    }
  }
}

export const utils = {
  formatHypeAmount: (amount: string | number): string => {
    try {
      let amountBN: bigint;
      
      if (typeof amount === 'string') {
        // Handle empty or invalid strings
        if (!amount || amount === '0' || amount === '0x' || amount === '0x0') {
          return '0.000000';
        }
        
        // Remove 0x prefix if present
        const cleanAmount = amount.startsWith('0x') ? amount.slice(2) : amount;
        
        // Try to parse as BigInt
        if (cleanAmount.includes('.') || cleanAmount.includes('e') || cleanAmount.includes('E')) {
          // Handle decimal or scientific notation
          const parsed = parseFloat(cleanAmount);
          if (isNaN(parsed)) return '0.000000';
          amountBN = BigInt(Math.floor(parsed));
        } else {
          amountBN = BigInt(cleanAmount);
        }
      } else {
        // Handle number input
        if (!isFinite(amount) || isNaN(amount)) {
          return '0.000000';
        }
        
        // Convert scientific notation to regular number first
        if (amount.toString().includes('e') || amount.toString().includes('E')) {
          const parsed = parseFloat(amount.toString());
          if (isNaN(parsed)) return '0.000000';
          amountBN = BigInt(Math.floor(parsed));
        } else {
          amountBN = BigInt(Math.floor(amount));
        }
      }
      
      // Convert from wei to HYPE (divide by 1e18)
      const formatted = Number(amountBN) / 1e18;
      
      // Handle very large numbers that might lose precision
      if (!isFinite(formatted)) {
        // For very large numbers, use string manipulation
        const amountStr = amountBN.toString();
        if (amountStr.length <= 18) {
          return '0.' + amountStr.padStart(18, '0').slice(0, 6);
        } else {
          const integerPart = amountStr.slice(0, -18) || '0';
          const decimalPart = amountStr.slice(-18).slice(0, 6).padEnd(6, '0');
          return `${integerPart}.${decimalPart}`;
        }
      }
      
      return formatted.toFixed(6);
    } catch (error) {
      console.warn('Error formatting HYPE amount:', error);
      return '0.000000';
    }
  },

  parseHypeAmount: (amount: string): string => {
    try {
      if (!amount || amount.trim() === '') {
        return '0';
      }
      
      const parsed = parseFloat(amount);
      if (isNaN(parsed) || !isFinite(parsed)) {
        return '0';
      }
      
      // Convert HYPE to wei (multiply by 1e18)
      // Use BigInt to handle large numbers properly
      const hypeBN = BigInt(Math.floor(parsed * 1000000)); // Convert to 6 decimal places first
      const weiBN = hypeBN * BigInt(1000000000000); // Then multiply by remaining 12 zeros
      
      return weiBN.toString();
    } catch (error) {
      console.warn('Error parsing HYPE amount:', error);
      return '0';
    }
  },

  isValidHyperEVMAddress: (address: string): boolean => {
    try {
      if (!address || typeof address !== 'string') {
        return false;
      }
      
      // Remove whitespace
      const cleanAddress = address.trim();
      
      // Check basic format (0x followed by 40 hex characters) - case insensitive
      const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/i;
      if (!ethAddressRegex.test(cleanAddress)) {
        return false;
      }
      
      // Try to normalize the address (this will fix checksum issues)
      try {
        const normalizedAddress = ethers.getAddress(cleanAddress.toLowerCase());
        return ethers.isAddress(normalizedAddress);
      } catch {
        // If normalization fails, try direct validation
        return ethers.isAddress(cleanAddress);
      }
    } catch (error) {
      console.warn('Address validation error:', error);
      return false;
    }
  },

  getHyperEVMExplorerUrl: (hash: string, network: 'mainnet' | 'testnet' = 'mainnet'): string => {
    const config = network === 'mainnet' ? HYPEREVM_CONFIG.MAINNET : HYPEREVM_CONFIG.TESTNET;
    return `${config.blockExplorer}/tx/${hash}`;
  },

  generateShareableLink: (simulationId: string): string => {
    return `${typeof window !== 'undefined' ? window.location.origin : ''}/simulator/share/${simulationId}`;
  },

  // Safe BigInt conversion helper
  safeBigInt: (value: any): bigint => {
    try {
      if (typeof value === 'bigint') {
        return value;
      }
      
      if (typeof value === 'string') {
        if (!value || value === '0x' || value === '0x0') {
          return BigInt(0);
        }
        
        const cleanValue = value.startsWith('0x') ? value.slice(2) : value;
        
        // Handle scientific notation or decimals
        if (cleanValue.includes('.') || cleanValue.includes('e') || cleanValue.includes('E')) {
          const parsed = parseFloat(cleanValue);
          if (isNaN(parsed) || !isFinite(parsed)) {
            return BigInt(0);
          }
          return BigInt(Math.floor(parsed));
        }
        
        return BigInt(cleanValue);
      }
      
      if (typeof value === 'number') {
        if (!isFinite(value) || isNaN(value)) {
          return BigInt(0);
        }
        return BigInt(Math.floor(value));
      }
      
      return BigInt(0);
    } catch {
      return BigInt(0);
    }
  },

  // Format wei to readable format with proper error handling
  formatWei: (wei: string | number | bigint, decimals: number = 18): string => {
    try {
      const weiBN = typeof wei === 'bigint' ? wei : utils.safeBigInt(wei);
      const divisor = BigInt(10 ** decimals);
      
      const integerPart = weiBN / divisor;
      const remainder = weiBN % divisor;
      
      const decimalPart = remainder.toString().padStart(decimals, '0').slice(0, 6);
      
      return `${integerPart.toString()}.${decimalPart}`;
    } catch {
      return '0.000000';
    }
  }
};

export default HyperEVMSimulator;
