import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  arbitrum,
  base,
  mainnet,
  hyperliquidEvmTestnet
} from 'wagmi/chains';

// Define HyperEVM chain
export const hyperEVM = {
  id: 999,
  name: 'HyperEVM',
  nativeCurrency: { name: 'HyperEVM', symbol: 'HYPE', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.hyperliquid.xyz/evm'] },
  },
  blockExplorers: {
    default: { name: 'HyperEVM Explorer', url: 'https://explorer.hyperevm.org/' },
  },
} as const;

export const config = getDefaultConfig({
  appName: 'HyperEVM GlueX Swap',
  projectId: 'fcd3420b61e039382c67c578b42abe70',
  chains: [
    mainnet,
    hyperEVM,
    hyperliquidEvmTestnet,
    arbitrum,
    base,
  ],
  ssr: true,
});
