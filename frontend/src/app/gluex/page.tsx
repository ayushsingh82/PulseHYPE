'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useBalance, useWaitForTransactionReceipt, useSendTransaction } from 'wagmi';
import { parseEther, formatUnits } from 'viem';
import { SparklesCore } from '../../components/ui/sparkles';
import { 
  getRouterPrice, 
  getRouterQuote, 
  searchTokens, 
  SUPPORTED_CHAINS,
  formatTokenAmount,
  parseTokenAmount
} from './helper';

// Token Interface
interface Token {
  tokenAddress: string;
  symbol: string;
  name: string;
  decimals: number;
  type: string;
  priority: number;
  branding?: { logoUri?: string };
}

// Popular token pairs for quick access
const POPULAR_PAIRS = [
  { from: 'WETH', to: 'USDC' },
  { from: 'USDC', to: 'USDT' },
  { from: 'WETH', to: 'DAI' },
  { from: 'USDC', to: 'DAI' },
];

export default function UniswapInterface() {
  const { address, isConnected, chain } = useAccount();
  const { sendTransaction, data: hash, isPending, error } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  // Form state
  const [fromToken, setFromToken] = useState<Token | null>(null);
  const [toToken, setToToken] = useState<Token | null>(null);
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [slippage, setSlippage] = useState(0.5);
  
  // UI state
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [selectingToken, setSelectingToken] = useState<'from' | 'to'>('from');
  const [searchQuery, setSearchQuery] = useState('');
  const [popularTokens, setPopularTokens] = useState<Token[]>([]);
  const [searchResults, setSearchResults] = useState<Token[]>([]);
  
  // Quote state
  const [quote, setQuote] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [priceImpact, setPriceImpact] = useState('0.00');
  const [loading, setLoading] = useState(false);
  const [quoteLoading, setQuoteLoading] = useState(false);

  // Get current chain name
  const currentChain = SUPPORTED_CHAINS.find(c => c.chainId === chain?.id)?.id || 'hyperevm';

  // Get user balance for from token
  const { data: balance } = useBalance({
    address,
    token: fromToken?.tokenAddress === '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' 
      ? undefined 
      : fromToken?.tokenAddress as `0x${string}`,
  });

  // Load popular tokens on mount and chain change
  const loadPopularTokens = useCallback(async () => {
    console.log('Loading popular tokens for chain:', currentChain);
    try {
      const result = await searchTokens('', [currentChain]);
      console.log('Search tokens result:', result);
      
      if (result && Array.isArray(result) && result.length > 0) {
        setPopularTokens(result.slice(0, 20));
      }
    } catch (error) {
      console.error('Error loading popular tokens:', error);
    }
  }, [currentChain]);

  useEffect(() => {
    loadPopularTokens();
  }, [loadPopularTokens]);

  // Set default tokens when popular tokens are loaded
  useEffect(() => {
    if (popularTokens.length > 0) {
      if (!fromToken) {
        setFromToken(popularTokens[0]);
      }
      if (!toToken && popularTokens.length > 1) {
        setToToken(popularTokens[1]);
      }
    }
  }, [popularTokens, fromToken, toToken]);

  // Search tokens
  const searchForTokens = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    console.log('Searching for tokens with query:', query);
    try {
      const result = await searchTokens(query, [currentChain]);
      console.log('Search result:', result);
      
      if (result && Array.isArray(result)) {
        setSearchResults(result.slice(0, 50));
      }
    } catch (error) {
      console.error('Error searching tokens:', error);
      setSearchResults([]);
    }
  }, [currentChain]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      searchForTokens(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, searchForTokens]);

  // Get quote when inputs change
  const getQuote = useCallback(async () => {
    if (!fromToken || !toToken || !fromAmount || !address) return;

    setQuoteLoading(true);
    try {
      const inputAmount = parseTokenAmount(fromAmount, fromToken.decimals);
      
      const priceResult = await getRouterPrice({
        chainID: currentChain,
        inputToken: fromToken.tokenAddress,
        outputToken: toToken.tokenAddress,
        inputAmount,
        userAddress: address,
        outputReceiver: address,
        uniquePID: 'uniswap-interface',
        slippage: Math.round(slippage * 100), // Convert to basis points
      });

      setQuote(priceResult);
      
      // Format output amount
      const outputFormatted = formatTokenAmount(priceResult.outputAmount, toToken.decimals);
      setToAmount(outputFormatted);

      // Calculate price impact (simplified)
      const impact = ((parseFloat(priceResult.inputAmount) - parseFloat(priceResult.effectiveInputAmount)) / parseFloat(priceResult.inputAmount)) * 100;
      setPriceImpact(Math.abs(impact).toFixed(2));

    } catch (error) {
      console.error('Error getting quote:', error);
      setToAmount('');
      setQuote(null);
    } finally {
      setQuoteLoading(false);
    }
  }, [fromToken, toToken, fromAmount, address, currentChain, slippage]);

  useEffect(() => {
    if (fromToken && toToken && fromAmount && parseFloat(fromAmount) > 0 && address) {
      getQuote();
    } else {
      setToAmount('');
      setQuote(null);
    }
  }, [getQuote, fromToken, toToken, fromAmount, address]);

  const handleSwap = async () => {
    if (!fromToken || !toToken || !fromAmount || !address || !quote) return;

    setLoading(true);
    try {
      const inputAmount = parseTokenAmount(fromAmount, fromToken.decimals);
      
      const quoteResult = await getRouterQuote({
        chainID: currentChain,
        inputToken: fromToken.tokenAddress,
        outputToken: toToken.tokenAddress,
        inputAmount,
        userAddress: address,
        outputReceiver: address,
        uniquePID: 'uniswap-interface',
        slippage: Math.round(slippage * 100),
      });

      if (quoteResult.revert) {
        throw new Error('Transaction would revert');
      }

      // Send transaction
      sendTransaction({
        to: quoteResult.to || '0x', // Router contract address
        data: quoteResult.calldata as `0x${string}`,
        value: quoteResult.value ? parseEther(quoteResult.value) : undefined,
      });

    } catch (error) {
      console.error('Swap error:', error);
      alert(`Swap failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleTokenSelect = (token: Token) => {
    if (selectingToken === 'from') {
      setFromToken(token);
    } else {
      setToToken(token);
    }
    setShowTokenModal(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleReverseTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    setFromAmount(toAmount);
    setToAmount('');
  };

  const handleMaxClick = () => {
    if (balance && fromToken) {
      const maxAmount = formatUnits(balance.value, balance.decimals);
      setFromAmount(maxAmount);
    }
  };

  const TokenModal = () => (
    <AnimatePresence>
      {showTokenModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && setShowTokenModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-black/90 backdrop-blur-xl border border-[#97FBE4]/30 rounded-3xl p-6 w-full max-w-md max-h-[80vh] overflow-hidden shadow-2xl"
            style={{
              background: 'rgba(0, 0, 0, 0.9)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(151, 251, 228, 0.3)',
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#97FBE4]">Select Token</h3>
              <button
                onClick={() => setShowTokenModal(false)}
                className="text-[#97FBE4]/70 hover:text-[#97FBE4] transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Search */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search tokens..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/50 border border-[#97FBE4]/30 rounded-xl px-4 py-3 text-[#97FBE4] placeholder:text-[#97FBE4]/50 focus:outline-none focus:border-[#97FBE4] focus:ring-2 focus:ring-[#97FBE4]/20 transition-all"
              />
            </div>

            {/* Token List */}
            <div className="overflow-y-auto max-h-96 custom-scrollbar">
              {(searchResults.length > 0 ? searchResults : popularTokens).map((token) => (
                <motion.button
                  key={token.tokenAddress}
                  whileHover={{ backgroundColor: 'rgba(151, 251, 228, 0.1)' }}
                  onClick={() => handleTokenSelect(token)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[#97FBE4]/10 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#97FBE4] to-cyan-400 flex items-center justify-center text-black font-bold">
                    {token.symbol.charAt(0)}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="text-[#97FBE4] font-medium truncate">{token.symbol}</div>
                    <div className="text-[#97FBE4]/70 text-sm truncate">{token.name}</div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="min-h-screen bg-black text-[#97FBE4] overflow-hidden flex flex-col relative">
      {/* Background Sparkles */}
      <div className="absolute inset-0 w-full h-full">
        <SparklesCore
          id="tsparticles"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="w-full h-full"
          particleColor="#97FBE4"
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#97FBE4] to-cyan-400 bg-clip-text text-transparent">
              HyperEVM Swap
            </h1>
            <p className="text-[#97FBE4]/70 mt-2">Trade tokens on HyperEVM with the best rates</p>
          </div>
          <ConnectButton />
        </div>

        {/* Main Swap Interface */}
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/80 backdrop-blur-xl border border-[#97FBE4]/20 rounded-3xl p-6 shadow-2xl relative"
            style={{
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(151, 251, 228, 0.2)',
            }}
          >
            {/* From Token */}
            <div className="mb-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#97FBE4]/70 text-sm">From</span>
                {balance && (
                  <span className="text-[#97FBE4]/70 text-sm">
                    Balance: {parseFloat(formatUnits(balance.value, balance.decimals)).toFixed(4)}
                  </span>
                )}
              </div>
              <div className="bg-black/50 border border-[#97FBE4]/30 rounded-2xl p-4 hover:bg-black/60 transition-colors">
                <div className="flex items-center justify-between">
                  <input
                    type="number"
                    placeholder="0.0"
                    value={fromAmount}
                    onChange={(e) => setFromAmount(e.target.value)}
                    className="bg-transparent text-2xl font-semibold text-[#97FBE4] placeholder:text-[#97FBE4]/50 outline-none flex-1"
                  />
                  <div className="flex items-center gap-2">
                    {balance && (
                      <button
                        onClick={handleMaxClick}
                        className="text-[#97FBE4] text-sm hover:text-cyan-300 transition-colors px-2 py-1 bg-[#97FBE4]/10 rounded-lg"
                      >
                        MAX
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setSelectingToken('from');
                        setShowTokenModal(true);
                      }}
                      className="flex items-center gap-2 bg-[#97FBE4]/10 hover:bg-[#97FBE4]/20 border border-[#97FBE4]/30 rounded-xl px-3 py-2 transition-colors min-w-[100px] whitespace-nowrap"
                    >
                      {fromToken && (
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#97FBE4] to-cyan-400 flex items-center justify-center text-black text-xs font-bold">
                          {fromToken.symbol.charAt(0)}
                        </div>
                      )}
                      <span className="text-[#97FBE4] font-medium truncate">
                        {fromToken?.symbol || 'Select'}
                      </span>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center my-4">
              <motion.button
                whileHover={{ scale: 1.1, rotate: 180 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleReverseTokens}
                className="bg-[#97FBE4]/10 hover:bg-[#97FBE4]/20 border border-[#97FBE4]/30 rounded-xl p-2 transition-colors"
              >
                <svg className="w-5 h-5 text-[#97FBE4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </motion.button>
            </div>

            {/* To Token */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#97FBE4]/70 text-sm">To</span>
                {quote && (
                  <span className="text-[#97FBE4]/70 text-sm">
                    Price Impact: {priceImpact}%
                  </span>
                )}
              </div>
              <div className="bg-black/50 border border-[#97FBE4]/30 rounded-2xl p-4 hover:bg-black/60 transition-colors">
                <div className="flex items-center justify-between">
                  <input
                    type="number"
                    placeholder="0.0"
                    value={toAmount}
                    readOnly
                    className="bg-transparent text-2xl font-semibold text-[#97FBE4] placeholder:text-[#97FBE4]/50 outline-none flex-1"
                  />
                  <button
                    onClick={() => {
                      setSelectingToken('to');
                      setShowTokenModal(true);
                    }}
                    className="flex items-center gap-2 bg-[#97FBE4]/10 hover:bg-[#97FBE4]/20 border border-[#97FBE4]/30 rounded-xl px-3 py-2 transition-colors min-w-[100px] whitespace-nowrap"
                  >
                    {toToken && (
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#97FBE4] to-cyan-400 flex items-center justify-center text-black text-xs font-bold">
                        {toToken.symbol.charAt(0)}
                      </div>
                    )}
                    <span className="text-[#97FBE4] font-medium truncate">
                      {toToken?.symbol || 'Select'}
                    </span>
                    <svg className="w-4 h-4 text-[#97FBE4]/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Quote Info */}
            {quote && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-black/30 border border-[#97FBE4]/20 rounded-xl p-4 mb-4 space-y-2"
              >
                <div className="flex justify-between text-sm">
                  <span className="text-[#97FBE4]/70">Min. received</span>
                  <span className="text-[#97FBE4]">{formatTokenAmount(quote.minOutputAmount, toToken?.decimals || 18)} {toToken?.symbol}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#97FBE4]/70">Price Impact</span>
                  <span className={`${parseFloat(priceImpact) > 3 ? 'text-red-400' : 'text-green-400'}`}>
                    {priceImpact}%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-[#97FBE4]/70">Slippage</span>
                    <button 
                      onClick={() => setSlippage(slippage === 0.5 ? 1.0 : 0.5)}
                      className="text-[#97FBE4] hover:text-cyan-300 text-xs bg-[#97FBE4]/10 px-2 py-1 rounded"
                    >
                      Settings
                    </button>
                  </div>
                  <span className="text-[#97FBE4]">{slippage}%</span>
                </div>
              </motion.div>
            )}

            {/* Swap Button */}
            {!isConnected ? (
              <ConnectButton.Custom>
                {({ openConnectModal }) => (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={openConnectModal}
                    className="w-full bg-gradient-to-r from-[#97FBE4] to-cyan-400 hover:from-cyan-400 hover:to-[#97FBE4] text-black font-semibold py-4 rounded-2xl transition-all"
                  >
                    Connect Wallet
                  </motion.button>
                )}
              </ConnectButton.Custom>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSwap}
                disabled={!quote || loading || quoteLoading || isPending}
                className="w-full bg-gradient-to-r from-[#97FBE4] to-cyan-400 hover:from-cyan-400 hover:to-[#97FBE4] disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-black font-semibold py-4 rounded-2xl transition-all"
              >
                {loading || isPending ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {isPending ? 'Confirming...' : 'Swapping...'}
                  </div>
                ) : quoteLoading ? (
                  'Getting Quote...'
                ) : !quote ? (
                  'Enter Amount'
                ) : (
                  'Swap'
                )}
              </motion.button>
            )}

            {/* Transaction Status */}
            {hash && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-blue-900/30 border border-blue-700/50 rounded-xl"
              >
                <div className="text-blue-400 text-sm">
                  {isConfirming ? 'Waiting for confirmation...' : 
                   isConfirmed ? 'Transaction confirmed!' : 
                   'Transaction submitted'}
                </div>
                {chain?.blockExplorers?.default && (
                  <a
                    href={`${chain.blockExplorers.default.url}/tx/${hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 text-sm underline"
                  >
                    View on explorer →
                  </a>
                )}
              </motion.div>
            )}

            {/* Error Display */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-red-900/30 border border-red-700/50 rounded-xl"
              >
                <div className="text-red-400 text-sm">
                  Error: {error.message}
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Popular Pairs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-6 bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-4"
          >
            <h3 className="text-white font-medium mb-3">Popular Pairs</h3>
            <div className="grid grid-cols-2 gap-2">
              {POPULAR_PAIRS.map((pair, index) => (
                <button
                  key={index}
                  onClick={() => {
                    const fromTokenObj = popularTokens.find(t => t.symbol === pair.from);
                    const toTokenObj = popularTokens.find(t => t.symbol === pair.to);
                    if (fromTokenObj) setFromToken(fromTokenObj);
                    if (toTokenObj) setToToken(toTokenObj);
                  }}
                  className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl p-3 text-left transition-colors"
                >
                  <div className="text-white text-sm font-medium">
                    {pair.from} → {pair.to}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Token Selection Modal */}
      <TokenModal />
    </div>
  );
}
