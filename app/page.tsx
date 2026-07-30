"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Download,
  PlusCircle,
  Coins,
  FileText,
  Database,
  TrendingUp,
  CheckCircle2,
  Activity,
  Wallet,
  Send,
  History,
  Sparkles,
  Info,
  QrCode,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  X,
  Copy,
  Check,
  Code2,
  Palette,
  Rocket,
  Receipt,
  ShieldAlert,
  ShieldCheck,
  BookOpen,
  Lock,
  Unlock,
  AlertTriangle,
  Code,
  ExternalLink,
  Layers,
  Terminal,
  ArrowRight,
  Play,
  Gift,
  Users,
  Upload,
  Share2,
  Zap,
  Sliders,
  Bell,
  Megaphone,
  Sun,
  Moon,
  User,
  LogOut,
  AtSign,
  Contrast,
  RotateCcw,
  Grid,
  CircleDot,
  Cpu,
  Square,
  Disc,
  LayoutGrid
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { sdk } from "@farcaster/miniapp-sdk";
import Sparkline from "@/components/Sparkline";

// Interface Definitions
interface FarcasterUser {
  fid: number;
  username: string;
  displayName: string;
  pfpUrl?: string;
  bio?: string;
  custodyAddress?: string;
  verifications?: string[];
  followerCount?: number;
  followingCount?: number;
}

const SAMPLE_FARCASTER_PROFILES: FarcasterUser[] = [
  {
    fid: 9152,
    username: "jessepollak",
    displayName: "Jesse Pollak",
    pfpUrl: "https://i.imgur.com/39wH8y2.jpg",
    bio: "Building Base at Coinbase. Onchain is the new online.",
    custodyAddress: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    followerCount: 142000,
    followingCount: 1250,
    verifications: ["0x71C7656EC7ab88b098defB751B7401B5f6d8976F"]
  },
  {
    fid: 3,
    username: "dwr.eth",
    displayName: "Dan Romero",
    pfpUrl: "https://i.imgur.com/39wH8y2.jpg",
    bio: "Farcaster founder. Building decentralized social protocol.",
    custodyAddress: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
    followerCount: 285000,
    followingCount: 890,
    verifications: ["0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"]
  },
  {
    fid: 5650,
    username: "vitalik.eth",
    displayName: "Vitalik Buterin",
    pfpUrl: "https://i.imgur.com/39wH8y2.jpg",
    bio: "Ethereum researcher and developer.",
    custodyAddress: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
    followerCount: 410000,
    followingCount: 220,
    verifications: ["0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"]
  },
  {
    fid: 111,
    username: "cooper",
    displayName: "Cooper Turley",
    pfpUrl: "https://i.imgur.com/39wH8y2.jpg",
    bio: "Music, crypto & Base ecosystem enthusiast.",
    custodyAddress: "0x324082901a87b9c0214a1f9028a019e840129bc2",
    followerCount: 89000,
    followingCount: 1100,
    verifications: ["0x324082901a87b9c0214a1f9028a019e840129bc2"]
  }
];

interface AirdropCampaign {
  id: string;
  tokenType: "BRC-20" | "Base B20";
  tickerOrSymbol: string;
  totalAmount: number;
  recipientCount: number;
  perRecipientAmount: number;
  memo: string;
  txHash: string;
  timestamp: string;
  status: "Completed" | "In Progress" | "Failed";
}

// Interface Definitions
interface BRC20Token {
  ticker: string;
  totalSupply: number;
  maxMint: number;
  mintLimit: number;
  decimals: number;
  minted: number;
  holders: number;
  transactions: number;
  deployer: string;
  createdBlock: number;
  sparklineData: { value: number }[];
}

interface Inscription {
  id: string;
  number: number;
  ticker: string;
  amount: number;
  op: "deploy" | "mint" | "transfer";
  timestamp: string;
  txHash: string;
}

interface LedgerBalance {
  ticker: string;
  overall: number;
  transferable: number;
  available: number;
  lastUpdated: string;
}

// B20 Token Standard Interfaces for Base
interface B20Token {
  id: string;
  name: string;
  symbol: string;
  decimals: number;
  totalSupplyCap: number;
  currentSupply: number;
  contractAddress: string;
  paused: boolean;
  policy: "Open" | "Allowlist" | "KYC Restricted";
  deployer: string;
  launchedAt: string;
  supportsMemo: boolean;
  memosCount: number;
  logoUrl?: string;
}

interface QrHistoryItem {
  id: string;
  inscriptionId: string;
  number: number;
  ticker: string;
  dataType: "protocol" | "txhash" | "full";
  payload: string;
  timestamp: string;
  inscription: Inscription;
}

interface B20OrderPayment {
  id: string;
  orderId: string;
  tokenSymbol: string;
  tokenAddress: string;
  merchantAddress: string;
  payerAddress: string;
  amount: number;
  memoBytes32: string;
  status: "confirmed" | "reverted_policy" | "reverted_paused";
  revertReason?: string;
  txHash: string;
  blockNumber: number;
  timestamp: string;
}

// Base App DEX Trading Interfaces & Mock Data
interface BaseTradeItem {
  id: string;
  txHash: string;
  payToken: string;
  receiveToken: string;
  payAmount: number;
  receiveAmount: number;
  rate: number;
  route: string;
  paymasterSponsored: boolean;
  timestamp: string;
  status: "Confirmed" | "Pending" | "Failed";
}

interface BaseLimitOrder {
  id: string;
  side: "buy" | "sell";
  token: string;
  targetPriceEth: number;
  amount: number;
  totalEth: number;
  filled: number;
  status: "Open" | "Filled" | "Cancelled";
  timestamp: string;
}

const BASE_TOKEN_PRICES: Record<string, { usd: number; name: string; symbol: string; icon: string }> = {
  ETH: { usd: 3250.0, name: "Ethereum (Base)", symbol: "ETH", icon: "Ξ" },
  USDC: { usd: 1.0, name: "USD Coin (Base)", symbol: "USDC", icon: "$" },
  cbBTC: { usd: 64500.0, name: "Coinbase Wrapped BTC", symbol: "cbBTC", icon: "₿" },
  bORDI: { usd: 28.5, name: "Base Wrapped ORDI", symbol: "bORDI", icon: "🟧" },
  bSATS: { usd: 0.00028, name: "Base Wrapped SATS", symbol: "bSATS", icon: "⚡" },
  bPEPE: { usd: 0.0000085, name: "Base B20 PEPE", symbol: "bPEPE", icon: "🐸" },
  bBASE: { usd: 1.45, name: "Base B20 Token", symbol: "bBASE", icon: "🔵" },
  CUBEY: { usd: 0.85, name: "Cubey Companion", symbol: "CUBEY", icon: "🧊" }
};

const INITIAL_BASE_TRADES: BaseTradeItem[] = [
  {
    id: "trade-101",
    txHash: "0x8f3a9d2c1e4b5f6a7b8c9d0e1f2a3b4c5d6e7f8a",
    payToken: "ETH",
    receiveToken: "bORDI",
    payAmount: 0.1,
    receiveAmount: 11.4,
    rate: 114.0,
    route: "Aerodrome Slipstream (ETH -> cbBTC -> bORDI)",
    paymasterSponsored: true,
    timestamp: "2026-07-27 21:15:02",
    status: "Confirmed"
  },
  {
    id: "trade-102",
    txHash: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
    payToken: "USDC",
    receiveToken: "bSATS",
    payAmount: 250,
    receiveAmount: 892857,
    rate: 3571.42,
    route: "Base Swap Direct Pool",
    paymasterSponsored: true,
    timestamp: "2026-07-27 19:42:18",
    status: "Confirmed"
  },
  {
    id: "trade-103",
    txHash: "0x5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e",
    payToken: "cbBTC",
    receiveToken: "bPEPE",
    payAmount: 0.005,
    receiveAmount: 37941176,
    rate: 7588235200,
    route: "Uniswap v3 Base (cbBTC -> USDC -> bPEPE)",
    paymasterSponsored: true,
    timestamp: "2026-07-27 16:08:55",
    status: "Confirmed"
  }
];

const INITIAL_LIMIT_ORDERS: BaseLimitOrder[] = [
  {
    id: "limit-1",
    side: "buy",
    token: "bORDI",
    targetPriceEth: 0.0085,
    amount: 50,
    totalEth: 0.425,
    filled: 0,
    status: "Open",
    timestamp: "2026-07-27 22:00:10"
  },
  {
    id: "limit-2",
    side: "sell",
    token: "bPEPE",
    targetPriceEth: 0.000000003,
    amount: 10000000,
    totalEth: 0.03,
    filled: 40,
    status: "Open",
    timestamp: "2026-07-27 20:30:15"
  }
];

// Initial Base B20 Tokens Data
const INITIAL_B20_TOKENS: B20Token[] = [
  {
    id: "b20-1",
    name: "Base Cash",
    symbol: "BCASH",
    decimals: 18,
    totalSupplyCap: 100000000,
    currentSupply: 24500000,
    contractAddress: "0xB200a891f7c22e20b2f9104e129bc83a12901402",
    paused: false,
    policy: "Open",
    deployer: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    launchedAt: "2026-07-01 10:00:00",
    supportsMemo: true,
    memosCount: 142,
    logoUrl: "https://api.dicebear.com/7.x/identicon/svg?seed=BCASH"
  },
  {
    id: "b20-2",
    name: "Base Builder Token",
    symbol: "BUILD",
    decimals: 18,
    totalSupplyCap: 10000000,
    currentSupply: 3200000,
    contractAddress: "0xB200b2014092491a92a101f20102b109401290a1",
    paused: false,
    policy: "Open",
    deployer: "0x324082901a87b9c0214a1f9028a019e840129bc2",
    launchedAt: "2026-07-05 14:20:00",
    supportsMemo: true,
    memosCount: 89,
    logoUrl: "https://api.dicebear.com/7.x/identicon/svg?seed=BUILD"
  },
  {
    id: "b20-3",
    name: "Regulated Pay Token",
    symbol: "RPAY",
    decimals: 6,
    totalSupplyCap: 5000000,
    currentSupply: 1200000,
    contractAddress: "0xB200c9210058201a052028109310a019482019c3",
    paused: true,
    policy: "Allowlist",
    deployer: "0x892a014920194b0291a0293019a820391092a01f",
    launchedAt: "2026-07-12 11:15:00",
    supportsMemo: true,
    memosCount: 18,
    logoUrl: "https://api.dicebear.com/7.x/identicon/svg?seed=RPAY"
  }
];

// Initial B20 Memo Payments Reconciled Data
const INITIAL_B20_ORDERS: B20OrderPayment[] = [
  {
    id: "pay-101",
    orderId: "order-42",
    tokenSymbol: "BCASH",
    tokenAddress: "0xB200a891f7c22e20b2f9104e129bc83a12901402",
    merchantAddress: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    payerAddress: "0x324082901a87b9c0214a1f9028a019e840129bc2",
    amount: 10.0,
    memoBytes32: "0x6f726465722d3432000000000000000000000000000000000000000000000000",
    status: "confirmed",
    txHash: "0x91f82b7c0921a83019a0293f0192a8301f201032901a839210f01289389201af",
    blockNumber: 18940210,
    timestamp: "2026-07-20 16:20:11"
  },
  {
    id: "pay-102",
    orderId: "order-88",
    tokenSymbol: "BUILD",
    tokenAddress: "0xB200b2014092491a92a101f20102b109401290a1",
    merchantAddress: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    payerAddress: "0x90281a0293019a820391092a01f892a014920194",
    amount: 250.0,
    memoBytes32: "0x6f726465722d3838000000000000000000000000000000000000000000000000",
    status: "confirmed",
    txHash: "0x3e18a2093f102938a0192a8301f201032901a839210f01289389201af9102931",
    blockNumber: 18942104,
    timestamp: "2026-07-21 11:05:40"
  },
  {
    id: "pay-103",
    orderId: "order-99",
    tokenSymbol: "RPAY",
    tokenAddress: "0xB200c9210058201a052028109310a019482019c3",
    merchantAddress: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    payerAddress: "0x892a014920194b0291a0293019a820391092a01f",
    amount: 50.0,
    memoBytes32: "0x6f726465722d3939000000000000000000000000000000000000000000000000",
    status: "reverted_paused",
    revertReason: "TransferFailed: Token transfers are currently paused by the issuer",
    txHash: "0x7a910293819028301f201032901a839210f01289389201af9102931830192a83",
    blockNumber: 18943500,
    timestamp: "2026-07-22 09:12:30"
  }
];

// Integration Code Snippets for Base B20
const VIEM_PAYMENT_CODE_SNIPPET = `import { createPublicClient, createWalletClient, http, parseUnits, stringToHex, hexToString, parseEventLogs } from 'viem';
import { base } from 'viem/chains';

// 1. Define Base B20 Token & Merchant parameters
const B20_TOKEN_ADDRESS = '0xB200a891f7c22e20b2f9104e129bc83a12901402'; // Deployed B20 Token
const MERCHANT_WALLET   = '0x71C7656EC7ab88b098defB751B7401B5f6d8976F'; // Recipient

// 2. B20 Minimal ABI (transferWithMemo & Memo Event)
const B20_ABI = [
  {
    type: 'function',
    name: 'transferWithMemo',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
      { name: 'memo', type: 'bytes32' }
    ],
    outputs: [{ type: 'bool' }]
  },
  {
    type: 'event',
    name: 'Memo',
    inputs: [
      { name: 'caller', type: 'address', indexed: true },
      { name: 'memo', type: 'bytes32', indexed: true }
    ]
  }
] as const;

export async function payWithB20Memo(orderId: string, amountTokens: string) {
  // Convert Order ID to bytes32 memo
  const memoBytes32 = stringToHex(orderId, { size: 32 });

  // Execute transferWithMemo on Base Network
  const hash = await walletClient.writeContract({
    address: B20_TOKEN_ADDRESS,
    abi: B20_ABI,
    functionName: 'transferWithMemo',
    args: [MERCHANT_WALLET, parseUnits(amountTokens, 18), memoBytes32],
  });

  // Wait for receipt and extract Memo event log
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  const memoLogs = parseEventLogs({
    abi: B20_ABI,
    logs: receipt.logs,
    eventName: 'Memo',
  });

  const reconciledOrderId = hexToString(memoLogs[0].args.memo, { size: 32 }).replace(/\\0+$/, '');
  console.log('Successfully reconciled B20 payment for Order ID:', reconciledOrderId);
  return { hash, reconciledOrderId };
}`;

const SOLIDITY_B20_CODE_SNIPPET = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Base B20 Token Standard Implementation
 * @notice ERC-20 superset adding transferWithMemo, supply caps, pausing, and policy compliance.
 */
contract BaseB20Token is ERC20, ERC20Permit, Ownable {
    uint8 private immutable _customDecimals;
    uint256 public immutable maxCap;
    bool public paused;

    event Memo(address indexed caller, bytes32 indexed memo);

    error PolicyForbids(address sender, address recipient);
    error TokenPaused();
    error MaxCapExceeded();

    constructor(
        string memory name,
        string memory symbol,
        uint8 decimals_,
        uint256 maxCap_
    ) ERC20(name, symbol) ERC20Permit(name) Ownable(msg.sender) {
        _customDecimals = decimals_;
        maxCap = maxCap_;
    }

    function decimals() public view override returns (uint8) {
        return _customDecimals;
    }

    /**
     * @notice Transfer tokens tagged with an onchain order ID memo
     */
    function transferWithMemo(address to, uint256 amount, bytes32 memo) external returns (bool) {
        if (paused) revert TokenPaused();
        _transfer(msg.sender, to, amount);
        emit Memo(msg.sender, memo);
        return true;
    }

    function setPaused(bool state) external onlyOwner {
        paused = state;
    }
}`;

const VIEM_AIRDROP_CODE_SNIPPET = `import { createWalletClient, http, parseUnits, stringToHex } from 'viem';
import { base } from 'viem/chains';

// Batch Airdrop Minted Coins on Base B20 / ERC-20
export async function batchAirdropB20(
  tokenAddress: \`0x\${string}\`,
  recipients: \`0x\${string}\`[],
  amountPerWallet: string,
  memoText: string
) {
  const memoBytes32 = stringToHex(memoText, { size: 32 });
  const amountWei = parseUnits(amountPerWallet, 18);

  console.log(\`Broadcasting Airdrop to \${recipients.length} community wallets...\`);

  const txHashes = [];
  for (const recipient of recipients) {
    const hash = await walletClient.writeContract({
      address: tokenAddress,
      abi: B20_ABI,
      functionName: 'transferWithMemo',
      args: [recipient, amountWei, memoBytes32],
    });
    txHashes.push(hash);
  }
  return txHashes;
}`;

// Initial Mock Airdrop Campaigns Data
const INITIAL_AIRDROP_CAMPAIGNS: AirdropCampaign[] = [
  {
    id: "airdrop-001",
    tokenType: "BRC-20",
    tickerOrSymbol: "ordi",
    totalAmount: 5000,
    recipientCount: 5,
    perRecipientAmount: 1000,
    memo: "Genesis BRC-20 Holder Airdrop",
    txHash: "0x8a92f01982a0194820391092a019a820391092a0",
    timestamp: "2026-07-15 11:20:00",
    status: "Completed"
  },
  {
    id: "airdrop-002",
    tokenType: "Base B20",
    tickerOrSymbol: "BCASH",
    totalAmount: 25000,
    recipientCount: 10,
    perRecipientAmount: 2500,
    memo: "airdrop-season1-base-builders",
    txHash: "0x3b1c920194820391092a019a820391092a019482",
    timestamp: "2026-07-20 16:45:10",
    status: "Completed"
  }
];

// Initial realistic BRC-20 Mock Data
const INITIAL_TOKENS: BRC20Token[] = [
  {
    ticker: "ordi",
    totalSupply: 21000000,
    maxMint: 21000000,
    mintLimit: 1000,
    decimals: 18,
    minted: 21000000,
    holders: 14205,
    transactions: 254109,
    deployer: "bc1p8g...9p8x",
    createdBlock: 779301,
    sparklineData: [
      { value: 10 }, { value: 15 }, { value: 30 }, { value: 45 }, { value: 60 },
      { value: 80 }, { value: 95 }, { value: 100 }, { value: 100 }, { value: 100 }
    ]
  },
  {
    ticker: "sats",
    totalSupply: 2100000000000000,
    maxMint: 2100000000000000,
    mintLimit: 100000000,
    decimals: 18,
    minted: 2100000000000000,
    holders: 42109,
    transactions: 1045920,
    deployer: "bc1p3m...7v9w",
    createdBlock: 780122,
    sparklineData: [
      { value: 5 }, { value: 12 }, { value: 20 }, { value: 35 }, { value: 50 },
      { value: 65 }, { value: 80 }, { value: 90 }, { value: 98 }, { value: 100 }
    ]
  },
  {
    ticker: "rats",
    totalSupply: 1000000000000,
    maxMint: 1000000000000,
    mintLimit: 1000000,
    decimals: 18,
    minted: 1000000000000,
    holders: 18450,
    transactions: 412502,
    deployer: "bc1q9y...5f2k",
    createdBlock: 785402,
    sparklineData: [
      { value: 20 }, { value: 40 }, { value: 65 }, { value: 85 }, { value: 100 },
      { value: 100 }, { value: 100 }, { value: 100 }, { value: 100 }, { value: 100 }
    ]
  },
  {
    ticker: "base",
    totalSupply: 100000000,
    maxMint: 100000000,
    mintLimit: 1000,
    decimals: 18,
    minted: 45200000,
    holders: 3540,
    transactions: 12904,
    deployer: "bc1p7a...2h5n",
    createdBlock: 850124,
    sparklineData: [
      { value: 12 }, { value: 15 }, { value: 18 }, { value: 24 }, { value: 29 },
      { value: 34 }, { value: 39 }, { value: 42 }, { value: 44 }, { value: 45.2 }
    ]
  },
  {
    ticker: "spark",
    totalSupply: 50000000,
    maxMint: 50000000,
    mintLimit: 500,
    decimals: 18,
    minted: 12500000,
    holders: 1850,
    transactions: 5820,
    deployer: "bc1p4k...9q2m",
    createdBlock: 854201,
    sparklineData: [
      { value: 1 }, { value: 3 }, { value: 5 }, { value: 8 }, { value: 11 },
      { value: 14 }, { value: 18 }, { value: 21 }, { value: 23 }, { value: 25 }
    ]
  },
  {
    ticker: "farc",
    totalSupply: 10000000,
    maxMint: 10000000,
    mintLimit: 100,
    decimals: 18,
    minted: 9800000,
    holders: 4100,
    transactions: 22409,
    deployer: "bc1q8t...0v2a",
    createdBlock: 849301,
    sparklineData: [
      { value: 50 }, { value: 55 }, { value: 60 }, { value: 72 }, { value: 81 },
      { value: 89 }, { value: 92 }, { value: 95 }, { value: 97 }, { value: 98 }
    ]
  }
];

const INITIAL_INSCRIPTIONS: Inscription[] = [
  {
    id: "e4f0a203f19bc0319df6b490a6e8b2b76a5b4c10a300d892019ab7612f10b2aci0",
    number: 541092,
    ticker: "ordi",
    amount: 1000,
    op: "mint",
    timestamp: "2026-07-10 14:32:05",
    txHash: "7b1c8c8d...df7f"
  },
  {
    id: "a7c2f0d9a6b104cde6c57ce52e1a3b8d9e068f8e06a30c5e940d055f940d055ai0",
    number: 541890,
    ticker: "ordi",
    amount: 1000,
    op: "mint",
    timestamp: "2026-07-11 09:15:42",
    txHash: "4c9d7e6f...8a2b"
  },
  {
    id: "9c3f4e2b0a1d4c8e7b9a5f6e8c0d9a3b8e7f6e5d4c3b2a1e0f9d8c7b6a5e4d3ci0",
    number: 589412,
    ticker: "base",
    amount: 1000,
    op: "mint",
    timestamp: "2026-07-12 18:44:19",
    txHash: "9a2f1b4c...7d6e"
  }
];

const INITIAL_LEDGER: LedgerBalance[] = [
  {
    ticker: "ordi",
    overall: 2000,
    transferable: 0,
    available: 2000,
    lastUpdated: "2026-07-11 09:15:42"
  },
  {
    ticker: "base",
    overall: 1000,
    transferable: 0,
    available: 1000,
    lastUpdated: "2026-07-12 18:44:19"
  }
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<"tokens" | "inscriptions" | "ledger" | "b20_launchpad" | "b20_payments" | "airdrop" | "notifications" | "base_trading" | "base_verify">("tokens");
  const [searchQuery, setSearchQuery] = useState("");
  const [mintFilter, setMintFilter] = useState<"all" | "completed" | "inprogress">("all");
  const [themeMode, setThemeMode] = useState<"slate" | "oled" | "cyber" | "emerald" | "light">("slate");

  // Farcaster Auth & MiniApp States
  const [farcasterUser, setFarcasterUser] = useState<FarcasterUser | null>(null);
  const [isFcModalOpen, setIsFcModalOpen] = useState(false);
  const [isInMiniAppFrame, setIsInMiniAppFrame] = useState(false);
  const [fcSearchQuery, setFcSearchQuery] = useState("");
  const [isFcSearching, setIsFcSearching] = useState(false);
  const [fcToast, setFcToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Initialize Farcaster MiniApp SDK & load persistent user
  useEffect(() => {
    try {
      const storedFc = localStorage.getItem("brc20_farcaster_user");
      if (storedFc) {
        setFarcasterUser(JSON.parse(storedFc));
      }
    } catch (e) {
      console.error("Failed to parse stored Farcaster user:", e);
    }

    const initFcSdk = async () => {
      try {
        if (sdk && sdk.actions && typeof sdk.actions.ready === "function") {
          await sdk.actions.ready();
        }
        if (sdk && sdk.context) {
          const ctx = await sdk.context;
          if (ctx && ctx.user) {
            setIsInMiniAppFrame(true);
            const autoUser: FarcasterUser = {
              fid: ctx.user.fid || 9152,
              username: ctx.user.username || "base_miniapp_user",
              displayName: ctx.user.displayName || "Base MiniApp User",
              pfpUrl: ctx.user.pfpUrl || "https://i.imgur.com/39wH8y2.jpg",
              bio: "In-App Farcaster / Base MiniApp User",
              custodyAddress: (ctx.user as any)?.custodyAddress || "0x71C7656EC7ab88b098defB751B7401B5f6d8976F"
            };
            setFarcasterUser(autoUser);
          }
        }
      } catch (err) {
        console.log("Farcaster SDK frame check:", err);
      }
    };
    initFcSdk();
  }, []);

  // Sync farcasterUser to localStorage
  useEffect(() => {
    if (farcasterUser) {
      localStorage.setItem("brc20_farcaster_user", JSON.stringify(farcasterUser));
    } else {
      localStorage.removeItem("brc20_farcaster_user");
    }
  }, [farcasterUser]);

  const handleFarcasterLogin = (user: FarcasterUser) => {
    setFarcasterUser(user);
    setIsFcModalOpen(false);
    setFcToast({
      message: `Logged in as @${user.username} (FID: ${user.fid}) via Farcaster!`,
      type: "success"
    });
    setTimeout(() => setFcToast(null), 4000);
  };

  const handleFarcasterLogout = () => {
    setFarcasterUser(null);
    setFcToast({ message: "Signed out of Farcaster account.", type: "success" });
    setTimeout(() => setFcToast(null), 3000);
  };

  const handleSearchCustomFarcasterUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fcSearchQuery.trim()) return;
    setIsFcSearching(true);

    setTimeout(() => {
      setIsFcSearching(false);
      const cleanInput = fcSearchQuery.trim().replace(/^@/, "");
      const isNum = /^\d+$/.test(cleanInput);
      const fidVal = isNum ? parseInt(cleanInput) : Math.floor(1000 + Math.random() * 900000);

      const customUser: FarcasterUser = {
        fid: fidVal,
        username: cleanInput.toLowerCase(),
        displayName: cleanInput.charAt(0).toUpperCase() + cleanInput.slice(1),
        pfpUrl: `https://api.dicebear.com/7.x/identicon/svg?seed=${cleanInput}`,
        bio: `Verified Farcaster user @${cleanInput.toLowerCase()} on Base.`,
        custodyAddress: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
        followerCount: Math.floor(100 + Math.random() * 5000),
        followingCount: Math.floor(50 + Math.random() * 1000)
      };

      handleFarcasterLogin(customUser);
      setFcSearchQuery("");
    }, 600);
  };

  const handleShareToWarpcast = (text: string) => {
    const encoded = encodeURIComponent(text);
    const warpcastUrl = `https://warpcast.com/~/compose?text=${encoded}`;
    if (sdk && sdk.actions && typeof sdk.actions.openUrl === "function") {
      sdk.actions.openUrl(warpcastUrl);
    } else {
      window.open(warpcastUrl, "_blank", "noopener,noreferrer");
    }
  };

  // Main Persistent State
  const [tokens, setTokens] = useState<BRC20Token[]>(INITIAL_TOKENS);
  const [inscriptions, setInscriptions] = useState<Inscription[]>(INITIAL_INSCRIPTIONS);
  const [ledger, setLedger] = useState<LedgerBalance[]>(INITIAL_LEDGER);

  // Base B20 Standard States
  const [b20Tokens, setB20Tokens] = useState<B20Token[]>(INITIAL_B20_TOKENS);
  const [b20Orders, setB20Orders] = useState<B20OrderPayment[]>(INITIAL_B20_ORDERS);

  // Inscriptions Sorting State
  const [inscSortField, setInscSortField] = useState<"number" | "ticker" | "op" | "amount" | "timestamp">("number");
  const [inscSortOrder, setInscSortOrder] = useState<"asc" | "desc">("desc");

  const toggleInscSort = (field: "number" | "ticker" | "op" | "amount" | "timestamp") => {
    if (inscSortField === field) {
      setInscSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setInscSortField(field);
      setInscSortOrder(field === "ticker" || field === "op" ? "asc" : "desc");
    }
  };

  const sortedInscriptions = React.useMemo(() => {
    return [...inscriptions].sort((a, b) => {
      let aVal: string | number = a[inscSortField];
      let bVal: string | number = b[inscSortField];

      if (inscSortField === "number" || inscSortField === "amount") {
        aVal = Number(aVal) || 0;
        bVal = Number(bVal) || 0;
      } else {
        aVal = String(aVal).toLowerCase();
        bVal = String(bVal).toLowerCase();
      }

      if (aVal < bVal) return inscSortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return inscSortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [inscriptions, inscSortField, inscSortOrder]);

  // Reconciled Orders Sorting State
  const [orderSortField, setOrderSortField] = useState<"orderId" | "tokenSymbol" | "amount" | "payerAddress" | "status" | "timestamp">("timestamp");
  const [orderSortOrder, setOrderSortOrder] = useState<"asc" | "desc">("desc");

  const toggleOrderSort = (field: "orderId" | "tokenSymbol" | "amount" | "payerAddress" | "status" | "timestamp") => {
    if (orderSortField === field) {
      setOrderSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setOrderSortField(field);
      setOrderSortOrder(field === "amount" || field === "timestamp" ? "desc" : "asc");
    }
  };

  const sortedB20Orders = React.useMemo(() => {
    return [...b20Orders].sort((a, b) => {
      let aVal: string | number = a[orderSortField];
      let bVal: string | number = b[orderSortField];

      if (orderSortField === "amount") {
        aVal = Number(aVal) || 0;
        bVal = Number(bVal) || 0;
      } else {
        aVal = String(aVal).toLowerCase();
        bVal = String(bVal).toLowerCase();
      }

      if (aVal < bVal) return orderSortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return orderSortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [b20Orders, orderSortField, orderSortOrder]);

  // Airdrop Suite States
  const [airdropCampaigns, setAirdropCampaigns] = useState<AirdropCampaign[]>(INITIAL_AIRDROP_CAMPAIGNS);
  const [airdropTokenType, setAirdropTokenType] = useState<"BRC-20" | "Base B20">("BRC-20");
  const [airdropSelectedCoin, setAirdropSelectedCoin] = useState<string>("ordi");
  const [airdropRecipientsRaw, setAirdropRecipientsRaw] = useState<string>("");
  const [airdropAmountPerWallet, setAirdropAmountPerWallet] = useState<number>(500);
  const [airdropMemo, setAirdropMemo] = useState<string>("Genesis Community Airdrop");
  const [isExecutingAirdrop, setIsExecutingAirdrop] = useState(false);
  const [airdropStep, setAirdropStep] = useState<number>(0);
  const [airdropToast, setAirdropToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Base Notifications API States
  const [notifTitle, setNotifTitle] = useState("🎉 B20 Token Airdrop Claimed!");
  const [notifMessage, setNotifMessage] = useState("You have received 1,000 $BASE B20 tokens in your Base App wallet.");
  const [notifTargetPath, setNotifTargetPath] = useState("/airdrop");
  const [notifRecipients, setNotifRecipients] = useState("0x71C7656EC7ab88b098defB751B7401B5f6d8976F");
  const [notifApiKey, setNotifApiKey] = useState("");
  const [notifAppUrl, setNotifAppUrl] = useState("https://brc20-base-explorer.vercel.app");
  const [notifSending, setNotifSending] = useState(false);
  const [notifLogs, setNotifLogs] = useState<Array<{ id: string; timestamp: string; title: string; message: string; targetPath: string; sentCount: number; failedCount: number; simulated: boolean }>>([]);
  const [notifCheckAddr, setNotifCheckAddr] = useState("0x71C7656EC7ab88b098defB751B7401B5f6d8976F");
  const [notifStatusResult, setNotifStatusResult] = useState<Record<string, unknown> | null>(null);
  const [notifCheckingStatus, setNotifCheckingStatus] = useState(false);
  const [notifAudienceList, setNotifAudienceList] = useState<Array<{ address: string; notificationsEnabled: boolean }> | null>(null);
  const [notifFetchingAudience, setNotifFetchingAudience] = useState(false);
  const [notifToast, setNotifToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Notification API Handlers
  const handleCheckUserNotifStatus = async () => {
    if (!notifCheckAddr) return;
    setNotifCheckingStatus(true);
    setNotifStatusResult(null);
    try {
      const res = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "user_status",
          walletAddress: notifCheckAddr,
          apiKey: notifApiKey,
          appUrl: notifAppUrl
        })
      });
      const data = await res.json().catch(() => ({ error: "Failed to parse API response" }));
      setNotifStatusResult(data);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Failed to check user notification status";
      setNotifStatusResult({ error: errMsg });
    } finally {
      setNotifCheckingStatus(false);
    }
  };

  const handleFetchNotifAudience = async () => {
    setNotifFetchingAudience(true);
    try {
      const res = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "get_users",
          notificationEnabled: true,
          apiKey: notifApiKey,
          appUrl: notifAppUrl
        })
      });
      const data = await res.json().catch(() => ({ users: [] }));
      if (data.users) {
        setNotifAudienceList(data.users);
      } else {
        setNotifAudienceList([]);
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Error";
      setNotifToast({ message: "Failed to fetch audience list: " + errMsg, type: "error" });
    } finally {
      setNotifFetchingAudience(false);
    }
  };

  const handleSendNotification = async () => {
    if (!notifTitle || !notifMessage) {
      setNotifToast({ message: "Title and message are required.", type: "error" });
      return;
    }
    const rawAddrs = notifRecipients.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean);
    const addresses = rawAddrs.length > 0 ? rawAddrs : ["0x71C7656EC7ab88b098defB751B7401B5f6d8976F"];

    setNotifSending(true);
    try {
      const res = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "send_notification",
          title: notifTitle,
          message: notifMessage,
          targetPath: notifTargetPath,
          walletAddresses: addresses,
          apiKey: notifApiKey,
          appUrl: notifAppUrl
        })
      });
      const data = await res.json().catch(() => ({ error: "Failed to parse API response" }));

      if (data.success || data.simulated) {
        setNotifToast({
          message: data.simulated
            ? `📲 Simulated push notification sent to ${data.sentCount || addresses.length} address(es)!`
            : `✅ Successfully dispatched Base App push notification to ${data.sentCount} wallet(s)!`,
          type: "success"
        });
        const newLog = {
          id: Date.now().toString(),
          timestamp: new Date().toLocaleTimeString(),
          title: notifTitle,
          message: notifMessage,
          targetPath: notifTargetPath,
          sentCount: data.sentCount || addresses.length,
          failedCount: data.failedCount || 0,
          simulated: Boolean(data.simulated)
        };
        setNotifLogs((prev) => [newLog, ...prev]);
      } else {
        setNotifToast({ message: data.error || "Notification delivery failed.", type: "error" });
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Error";
      setNotifToast({ message: "Failed to send notification: " + errMsg, type: "error" });
    } finally {
      setNotifSending(false);
    }
  };

  // Base DEX Trading Suite States & Handlers
  const [tradingPayToken, setTradingPayToken] = useState<string>("ETH");
  const [tradingReceiveToken, setTradingReceiveToken] = useState<string>("bORDI");
  const [tradingPayAmount, setTradingPayAmount] = useState<string>("0.05");
  const [tradingSlippage, setTradingSlippage] = useState<number>(0.5);
  const [tradingUsePaymaster, setTradingUsePaymaster] = useState<boolean>(true);
  const [tradingSubTab, setTradingSubTab] = useState<"swap" | "limit" | "orderbook" | "chart" | "wallet">("swap");
  const [tradingLimitPrice, setTradingLimitPrice] = useState<string>("0.0088");
  const [tradingLimitSide, setTradingLimitSide] = useState<"buy" | "sell">("buy");
  const [tradingLimitAmount, setTradingLimitAmount] = useState<string>("100");
  const [tradingLimitOrders, setTradingLimitOrders] = useState<BaseLimitOrder[]>(INITIAL_LIMIT_ORDERS);
  const [tradingHistory, setTradingHistory] = useState<BaseTradeItem[]>(INITIAL_BASE_TRADES);
  const [isExecutingTrade, setIsExecutingTrade] = useState(false);
  const [tradeStep, setTradeStep] = useState<number>(0);
  const [tradeTxHash, setTradeTxHash] = useState<string>("");
  const [tradeToast, setTradeToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [isQuickTradeModalOpen, setIsQuickTradeModalOpen] = useState(false);
  const [quickTradeToken, setQuickTradeToken] = useState<string>("bORDI");

  // Swap Execution Handler
  const handleExecuteSwap = async (payTok?: string, recTok?: string, payAmtStr?: string) => {
    const pay = payTok || tradingPayToken;
    const rec = recTok || tradingReceiveToken;
    const amtStr = payAmtStr || tradingPayAmount;
    const amt = parseFloat(amtStr);

    if (isNaN(amt) || amt <= 0) {
      setTradeToast({ message: "Please enter a valid swap amount.", type: "error" });
      return;
    }

    if (pay === rec) {
      setTradeToast({ message: "Pay token and Receive token cannot be identical.", type: "error" });
      return;
    }

    setIsExecutingTrade(true);
    setTradeStep(1); // Estimating liquidity route

    await new Promise((r) => setTimeout(r, 500));
    setTradeStep(2); // Requesting Base Smart Wallet signature (EIP-712)

    await new Promise((r) => setTimeout(r, 600));
    setTradeStep(3); // Submitting to Base Paymaster (Gasless)

    await new Promise((r) => setTimeout(r, 700));
    setTradeStep(4); // Confirmed in Base Block

    const payUsd = BASE_TOKEN_PRICES[pay]?.usd || 1;
    const recUsd = BASE_TOKEN_PRICES[rec]?.usd || 1;
    const rate = payUsd / recUsd;
    const recAmt = Math.round(amt * rate * 1000000) / 1000000;
    const txHash = "0x" + Array.from({ length: 20 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    const nowStr = new Date().toISOString().replace("T", " ").substring(0, 19);

    const newTrade: BaseTradeItem = {
      id: `trade-${Date.now().toString().slice(-5)}`,
      txHash,
      payToken: pay,
      receiveToken: rec,
      payAmount: amt,
      receiveAmount: recAmt,
      rate: Math.round(rate * 100) / 100,
      route: "Aerodrome Slipstream (Base Paymaster Sponsored)",
      paymasterSponsored: tradingUsePaymaster,
      timestamp: nowStr,
      status: "Confirmed"
    };

    setTradingHistory((prev) => [newTrade, ...prev]);
    setIsExecutingTrade(false);
    setTradeStep(0);
    setTradeTxHash(txHash);
    setTradeToast({
      message: `🎉 Swap Executed! Swapped ${amt} ${pay} for ${recAmt.toLocaleString()} ${rec} on Base L2!`,
      type: "success"
    });

    if (isQuickTradeModalOpen) {
      setTimeout(() => setIsQuickTradeModalOpen(false), 1500);
    }
  };

  const handlePlaceLimitOrder = () => {
    const amt = parseFloat(tradingLimitAmount);
    const price = parseFloat(tradingLimitPrice);
    if (isNaN(amt) || amt <= 0 || isNaN(price) || price <= 0) {
      setTradeToast({ message: "Please enter valid limit price and order amount.", type: "error" });
      return;
    }

    const totalEth = Math.round(amt * price * 10000) / 10000;
    const nowStr = new Date().toISOString().replace("T", " ").substring(0, 19);
    const newOrder: BaseLimitOrder = {
      id: `limit-${Date.now().toString().slice(-4)}`,
      side: tradingLimitSide,
      token: tradingReceiveToken,
      targetPriceEth: price,
      amount: amt,
      totalEth,
      filled: 0,
      status: "Open",
      timestamp: nowStr
    };

    setTradingLimitOrders((prev) => [newOrder, ...prev]);
    setTradeToast({
      message: `✅ Limit ${tradingLimitSide.toUpperCase()} Order placed for ${amt} ${tradingReceiveToken} @ ${price} ETH!`,
      type: "success"
    });
  };

  const handleCancelLimitOrder = (orderId: string) => {
    setTradingLimitOrders((prev) => prev.filter((o) => o.id !== orderId));
    setTradeToast({ message: "Limit order cancelled.", type: "success" });
  };

  const handleOpenQuickTrade = (symbol: string) => {
    const uppercaseSymbol = symbol.toUpperCase();
    const matched = Object.keys(BASE_TOKEN_PRICES).find(
      (k) => k.toUpperCase() === uppercaseSymbol || k.toUpperCase() === `B${uppercaseSymbol}` || uppercaseSymbol.includes(k.toUpperCase())
    );
    const recTok = matched || "bORDI";
    setTradingReceiveToken(recTok);
    setQuickTradeToken(recTok);
    setIsQuickTradeModalOpen(true);
  };

  // B20 Launchpad Form States
  const [launchName, setLaunchName] = useState("");
  const [launchSymbol, setLaunchSymbol] = useState("");
  const [launchDecimals, setLaunchDecimals] = useState<number>(18);
  const [launchCap, setLaunchCap] = useState<number>(10000000);
  const [launchPolicy, setLaunchPolicy] = useState<"Open" | "Allowlist" | "KYC Restricted">("Open");
  const [launchLogoUrl, setLaunchLogoUrl] = useState<string>("");
  const [isDeployingB20, setIsDeployingB20] = useState(false);
  const [deployStep, setDeployStep] = useState(0);
  const [b20DeployToast, setB20DeployToast] = useState<string | null>(null);

  // Handle Token Logo Image Upload
  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        alert("Image size must be less than 3MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setLaunchLogoUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // B20 Payment Form States
  const [payTokenAddress, setPayTokenAddress] = useState<string>("0xB200a891f7c22e20b2f9104e129bc83a12901402");
  const [payOrderId, setPayOrderId] = useState("order-101");
  const [payAmount, setPayAmount] = useState<number>(10.0);
  const [payMerchant, setPayMerchant] = useState("0x71C7656EC7ab88b098defB751B7401B5f6d8976F");
  const [payPayer, setPayPayer] = useState("0x324082901a87b9c0214a1f9028a019e840129bc2");
  const [simRevertMode, setSimRevertMode] = useState<"none" | "policy" | "paused">("none");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentToast, setPaymentToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Code Modal / Snippet Viewer State
  const [codeModalOpen, setCodeModalOpen] = useState(false);
  const [codeSnippetType, setCodeSnippetType] = useState<"viem_pay" | "solidity_b20" | "viem_airdrop">("viem_pay");
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  // Airdrop Execution Handlers
  const loadSampleRecipients = () => {
    const sampleAddresses = [
      "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
      "0x324082901a87b9c0214a1f9028a019e840129bc2",
      "0x892a014920194b0291a0293019a820391092a01f",
      "bc1q9y282x81928371289371289371289371285f2k",
      "bc1p7a123981293812938129381293812938122h5n"
    ];
    setAirdropRecipientsRaw(sampleAddresses.join("\n"));
  };

  const handleCsvImport = () => {
    const mockCsvAddresses = [
      "0xa92f01982a0194820391092a019a820391092100",
      "0xb20194820391092a019a820391092a0194820211",
      "0xc391092a019a820391092a0194820391092a0322",
      "0xd4820391092a019a820391092a01948203910433"
    ];
    setAirdropRecipientsRaw(mockCsvAddresses.join("\n"));
    setAirdropToast({ message: "Imported 4 recipient addresses from CSV file.", type: "success" });
  };

  const handleExecuteAirdrop = async (e: React.FormEvent) => {
    e.preventDefault();
    setAirdropToast(null);

    const addresses = airdropRecipientsRaw
      .split(/[\n,;\s]+/)
      .map((a) => a.trim())
      .filter((a) => a.length > 0);

    if (addresses.length === 0) {
      setAirdropToast({ message: "Please enter or import at least one recipient wallet address.", type: "error" });
      return;
    }

    const totalCoins = addresses.length * airdropAmountPerWallet;

    if (airdropTokenType === "BRC-20") {
      const selectedTokenObj = tokens.find((t) => t.ticker === airdropSelectedCoin);
      if (!selectedTokenObj) {
        setAirdropToast({ message: "Selected BRC-20 token not found.", type: "error" });
        return;
      }
      if (selectedTokenObj.minted < totalCoins) {
        setAirdropToast({
          message: `Insufficient minted coins! Token has ${selectedTokenObj.minted.toLocaleString()} minted, but campaign requires ${totalCoins.toLocaleString()}.`,
          type: "error"
        });
        return;
      }
    } else {
      const selectedB20Obj = b20Tokens.find((t) => t.symbol === airdropSelectedCoin);
      if (!selectedB20Obj) {
        setAirdropToast({ message: "Selected B20 token not found.", type: "error" });
        return;
      }
      if (selectedB20Obj.paused) {
        setAirdropToast({ message: `Cannot airdrop ${selectedB20Obj.symbol}: Contract transfers are PAUSED!`, type: "error" });
        return;
      }
      if (selectedB20Obj.currentSupply < totalCoins) {
        setAirdropToast({
          message: `Insufficient minted supply! ${selectedB20Obj.symbol} has ${selectedB20Obj.currentSupply.toLocaleString()} minted, but campaign requires ${totalCoins.toLocaleString()}.`,
          type: "error"
        });
        return;
      }
    }

    setIsExecutingAirdrop(true);
    setAirdropStep(1);

    await new Promise((r) => setTimeout(r, 600));
    setAirdropStep(2);

    await new Promise((r) => setTimeout(r, 700));
    setAirdropStep(3);

    await new Promise((r) => setTimeout(r, 800));

    const randomTxHash = "0x" + Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    const nowStr = new Date().toISOString().replace("T", " ").substring(0, 19);

    const newCampaign: AirdropCampaign = {
      id: `airdrop-${Date.now().toString().slice(-4)}`,
      tokenType: airdropTokenType,
      tickerOrSymbol: airdropSelectedCoin,
      totalAmount: totalCoins,
      recipientCount: addresses.length,
      perRecipientAmount: airdropAmountPerWallet,
      memo: airdropMemo || "Community Airdrop",
      txHash: randomTxHash,
      timestamp: nowStr,
      status: "Completed"
    };

    setAirdropCampaigns((prev) => [newCampaign, ...prev]);

    if (airdropTokenType === "BRC-20") {
      setTokens((prev) =>
        prev.map((t) => {
          if (t.ticker === airdropSelectedCoin) {
            return {
              ...t,
              holders: t.holders + addresses.length,
              transactions: t.transactions + addresses.length
            };
          }
          return t;
        })
      );

      const newInsc: Inscription = {
        id: `${randomTxHash}i0`,
        number: 542000 + inscriptions.length,
        ticker: airdropSelectedCoin,
        amount: totalCoins,
        op: "transfer",
        timestamp: nowStr,
        txHash: randomTxHash
      };
      setInscriptions((prev) => [newInsc, ...prev]);
    } else {
      setB20Tokens((prev) =>
        prev.map((b) => {
          if (b.symbol === airdropSelectedCoin) {
            return {
              ...b,
              memosCount: b.memosCount + addresses.length
            };
          }
          return b;
        })
      );
    }

    setIsExecutingAirdrop(false);
    setAirdropStep(0);
    setAirdropToast({
      message: `🎉 Airdrop successful! Distributed ${totalCoins.toLocaleString()} $${airdropSelectedCoin.toUpperCase()} across ${addresses.length} recipient wallets.`,
      type: "success"
    });
    setAirdropRecipientsRaw("");
  };

  // Inscribe simulator fields
  const [simTicker, setSimTicker] = useState("base");
  const [simAmount, setSimAmount] = useState<number>(1000);
  const [simOp, setSimOp] = useState<"mint" | "transfer">("mint");
  const [simSuccessMsg, setSimSuccessMsg] = useState<string | null>(null);

  // QR Code Modal State
  const [qrModalInscription, setQrModalInscription] = useState<Inscription | null>(null);
  const [qrDataType, setQrDataType] = useState<"protocol" | "txhash" | "full">("protocol");
  const [qrActiveTab, setQrActiveTab] = useState<"generator" | "history">("generator");
  const [qrHistory, setQrHistory] = useState<QrHistoryItem[]>([]);
  const [qrHistorySortBy, setQrHistorySortBy] = useState<"timestamp" | "ticker">("timestamp");
  const [selectedHistoryItemId, setSelectedHistoryItemId] = useState<string | null>(null);
  const [copiedSelectedPayload, setCopiedSelectedPayload] = useState(false);
  const [copiedHistoryId, setCopiedHistoryId] = useState<string | null>(null);

  // Memoized sorted QR history list
  const sortedQrHistory = useMemo(() => {
    const items = [...qrHistory];
    if (qrHistorySortBy === "ticker") {
      return items.sort((a, b) => a.ticker.localeCompare(b.ticker));
    }
    return items.sort((a, b) => {
      const timeA = parseInt(a.id.split("-").pop() || "0", 10);
      const timeB = parseInt(b.id.split("-").pop() || "0", 10);
      if (!isNaN(timeA) && !isNaN(timeB) && timeA > 0 && timeB > 0) {
        return timeB - timeA;
      }
      return b.timestamp.localeCompare(a.timestamp);
    });
  }, [qrHistory, qrHistorySortBy]);

  // Derived selected history item
  const selectedHistoryItem = useMemo(() => {
    if (sortedQrHistory.length === 0) return null;
    if (selectedHistoryItemId) {
      const found = sortedQrHistory.find((item) => item.id === selectedHistoryItemId);
      if (found) return found;
    }
    return sortedQrHistory[0];
  }, [sortedQrHistory, selectedHistoryItemId]);
  const [qrFgColor, setQrFgColor] = useState("#000000");
  const [qrBgColor, setQrBgColor] = useState("#ffffff");
  const [qrTransparentBg, setQrTransparentBg] = useState(false);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [qrPattern, setQrPattern] = useState<"standard" | "dots" | "rounded" | "cyber" | "circuit" | "mesh">("standard");
  const [enablePatternOverlays, setEnablePatternOverlays] = useState(true);
  const [qrErrorLevel, setQrErrorLevel] = useState<"L" | "M" | "Q" | "H">("H");
  const [copiedQrData, setCopiedQrData] = useState(false);
  const [copiedMinifiedJson, setCopiedMinifiedJson] = useState(false);
  const [autoSaveQr, setAutoSaveQr] = useState(false);

  // Helper to copy minified BRC-20 JSON payload
  const handleCopyMinifiedJson = () => {
    if (!qrModalInscription) return;
    const rawPayload = getQrPayload(qrModalInscription, qrDataType);
    let minified = rawPayload;
    try {
      const parsed = JSON.parse(rawPayload);
      minified = JSON.stringify(parsed);
    } catch (e) {
      minified = rawPayload.replace(/\s+/g, "");
    }
    navigator.clipboard.writeText(minified);
    setCopiedMinifiedJson(true);
    setTimeout(() => setCopiedMinifiedJson(false), 2000);
  };

  // Helper bytes32 converters
  const stringToBytes32 = (str: string) => {
    let hex = "0x";
    for (let i = 0; i < str.length && i < 32; i++) {
      hex += str.charCodeAt(i).toString(16).padStart(2, "0");
    }
    return hex.padEnd(66, "0");
  };

  const bytes32ToString = (bytes32: string) => {
    if (!bytes32.startsWith("0x")) return bytes32;
    let hex = bytes32.slice(2);
    let str = "";
    for (let i = 0; i < hex.length; i += 2) {
      const code = parseInt(hex.substr(i, 2), 16);
      if (code === 0) break;
      str += String.fromCharCode(code);
    }
    return str;
  };

  // Deploy B20 Token Handler
  const handleLaunchB20Token = (e: React.FormEvent) => {
    e.preventDefault();
    if (!launchName.trim() || !launchSymbol.trim()) return;

    setIsDeployingB20(true);
    setDeployStep(1);

    setTimeout(() => setDeployStep(2), 1000);
    setTimeout(() => setDeployStep(3), 2000);
    setTimeout(() => {
      setDeployStep(4);
      const cleanSymbol = launchSymbol.trim().toUpperCase();
      const randomHex = Math.random().toString(16).substring(2, 12);
      const contractAddress = `0xB200${cleanSymbol.slice(0, 4).padEnd(4, "0").toLowerCase()}${randomHex}01a8`;
      const nowStr = new Date().toISOString().replace("T", " ").substring(0, 19);

      const newB20: B20Token = {
        id: `b20-${Date.now()}`,
        name: launchName.trim(),
        symbol: cleanSymbol,
        decimals: launchDecimals,
        totalSupplyCap: launchCap,
        currentSupply: 0,
        contractAddress,
        paused: false,
        policy: launchPolicy,
        deployer: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
        launchedAt: nowStr,
        supportsMemo: true,
        memosCount: 0,
        logoUrl: launchLogoUrl.trim() || `https://api.dicebear.com/7.x/identicon/svg?seed=${cleanSymbol}`
      };

      setB20Tokens((prev) => [newB20, ...prev]);
      setIsDeployingB20(false);
      setDeployStep(0);
      setLaunchName("");
      setLaunchSymbol("");
      setLaunchLogoUrl("");
      setB20DeployToast(`B20 Token ${cleanSymbol} deployed on Base at ${contractAddress.slice(0, 10)}...!`);
      setTimeout(() => setB20DeployToast(null), 5000);
    }, 3000);
  };

  // Toggle Pause on B20 Token
  const handleTogglePauseB20Token = (address: string) => {
    setB20Tokens((prev) =>
      prev.map((t) => {
        if (t.contractAddress.toLowerCase() === address.toLowerCase()) {
          return { ...t, paused: !t.paused };
        }
        return t;
      })
    );
  };

  // Execute Accept B20 Payment with Memo
  const handleExecuteB20Payment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payOrderId.trim() || payAmount <= 0) return;

    const matchedToken = b20Tokens.find(
      (t) => t.contractAddress.toLowerCase() === payTokenAddress.toLowerCase()
    );

    const tokenSymbol = matchedToken ? matchedToken.symbol : "B20";
    setIsProcessingPayment(true);
    setPaymentToast(null);

    setTimeout(() => {
      setIsProcessingPayment(false);

      // Check Revert Conditions
      if (simRevertMode === "paused" || (matchedToken && matchedToken.paused)) {
        const revertReason = "TransferFailed: Token transfers are currently paused by issuer (TRANSFER feature disabled)";
        const newOrder: B20OrderPayment = {
          id: `pay-${Date.now()}`,
          orderId: payOrderId.trim(),
          tokenSymbol,
          tokenAddress: payTokenAddress,
          merchantAddress: payMerchant,
          payerAddress: payPayer,
          amount: payAmount,
          memoBytes32: stringToBytes32(payOrderId.trim()),
          status: "reverted_paused",
          revertReason,
          txHash: `0x${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}`,
          blockNumber: 18944100 + b20Orders.length,
          timestamp: new Date().toISOString().replace("T", " ").substring(0, 19)
        };
        setB20Orders((prev) => [newOrder, ...prev]);
        setPaymentToast({
          message: `Transaction Reverted: ${revertReason}`,
          type: "error"
        });
        return;
      }

      if (simRevertMode === "policy" || (matchedToken && matchedToken.policy !== "Open")) {
        const revertReason = "PolicyForbids: Sender or recipient address is not authorized under token transfer policy";
        const newOrder: B20OrderPayment = {
          id: `pay-${Date.now()}`,
          orderId: payOrderId.trim(),
          tokenSymbol,
          tokenAddress: payTokenAddress,
          merchantAddress: payMerchant,
          payerAddress: payPayer,
          amount: payAmount,
          memoBytes32: stringToBytes32(payOrderId.trim()),
          status: "reverted_policy",
          revertReason,
          txHash: `0x${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}`,
          blockNumber: 18944100 + b20Orders.length,
          timestamp: new Date().toISOString().replace("T", " ").substring(0, 19)
        };
        setB20Orders((prev) => [newOrder, ...prev]);
        setPaymentToast({
          message: `Transaction Reverted: ${revertReason}`,
          type: "error"
        });
        return;
      }

      // Success Payment
      const memoHex = stringToBytes32(payOrderId.trim());
      const txHash = `0x${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}`;
      const nowStr = new Date().toISOString().replace("T", " ").substring(0, 19);

      const confirmedOrder: B20OrderPayment = {
        id: `pay-${Date.now()}`,
        orderId: payOrderId.trim(),
        tokenSymbol,
        tokenAddress: payTokenAddress,
        merchantAddress: payMerchant,
        payerAddress: payPayer,
        amount: payAmount,
        memoBytes32: memoHex,
        status: "confirmed",
        txHash,
        blockNumber: 18944100 + b20Orders.length,
        timestamp: nowStr
      };

      setB20Orders((prev) => [confirmedOrder, ...prev]);

      // Increment token memo count & current supply
      setB20Tokens((prev) =>
        prev.map((t) => {
          if (t.contractAddress.toLowerCase() === payTokenAddress.toLowerCase()) {
            return {
              ...t,
              memosCount: t.memosCount + 1,
              currentSupply: t.currentSupply + payAmount
            };
          }
          return t;
        })
      );

      setPaymentToast({
        message: `Payment Confirmed! Read Memo event log for order "${payOrderId.trim()}". Tx: ${txHash.slice(0, 10)}...`,
        type: "success"
      });

      // Increment default order ID for easy consecutive testing
      const orderNum = parseInt(payOrderId.replace(/\D/g, "")) || 100;
      setPayOrderId(`order-${orderNum + 1}`);
    }, 1500);
  };

  // Base Verify & Base Developer Docs State
  const [bvProvider, setBvProvider] = useState<"coinbase" | "x" | "instagram" | "tiktok">("coinbase");
  const [bvCondition, setBvCondition] = useState("coinbase_one_active eq true");
  const [bvConsumerContract, setBvConsumerContract] = useState("0x3ccD255C67a129e780F945Fa1773441Ec100059f");
  const [bvSiweMessage, setBvSiweMessage] = useState("");
  const [bvSigned, setBvSigned] = useState(false);
  const [bvStep, setBvStep] = useState<number>(1);
  const [bvIsLoading, setBvIsLoading] = useState(false);
  const [bvResponse, setBvResponse] = useState<{
    status: number;
    identityHash?: string;
    expiration?: number;
    signature?: string;
    error?: string;
    message?: string;
  } | null>(null);
  const [bvCodeTab, setBvCodeTab] = useState<"solidity" | "typescript" | "api" | "errors">("solidity");
  const [bvCopiedDocsIndex, setBvCopiedDocsIndex] = useState(false);
  const [bvCopiedCode, setBvCopiedCode] = useState(false);
  const [bvSimulateErrorMode, setBvSimulateErrorMode] = useState<"none" | "404_unverified" | "400_conditions" | "404_no_contract">("none");

  // Handler to update default contract and condition based on provider selection
  const handleSelectBvProvider = (provider: "coinbase" | "x" | "instagram" | "tiktok") => {
    setBvProvider(provider);
    setBvSigned(false);
    setBvResponse(null);
    setBvStep(1);
    if (provider === "coinbase") {
      setBvCondition("coinbase_one_active eq true");
      setBvConsumerContract("0x3ccD255C67a129e780F945Fa1773441Ec100059f");
    } else if (provider === "x") {
      setBvCondition("followers gte 1000");
      setBvConsumerContract("0x691fedA6dfCd10082b195b2453EBC7c87ff31678");
    } else if (provider === "instagram") {
      setBvCondition("followers_count gte 5000");
      setBvConsumerContract("0x917fB125c11099a8bC7721A041d5E192f1b40201");
    } else if (provider === "tiktok") {
      setBvCondition("follower_count gte 10000");
      setBvConsumerContract("0x5412A89Ea012a91280BC82012d12920230f82199");
    }
  };

  // Handler to generate SIWE Message
  const handleGenerateSiweMessage = () => {
    const userAddr = farcasterUser?.custodyAddress || "0x71C7656EC7ab88b098defB751B7401B5f6d8976F";
    const nonce = Math.random().toString(36).substring(2, 10);
    const domain = "app.baseverify.io";
    const uri = "https://app.baseverify.io";
    const contract = bvConsumerContract || "0x691fedA6dfCd10082b195b2453EBC7c87ff31678";
    
    const msg = `${domain} wants you to sign in with your Ethereum account:\n${userAddr}\n\nClaim eligibility for a Base Verify onchain benefit.\n\nURI: ${uri}\nVersion: 1\nChain ID: 84532\nNonce: ${nonce}\nIssued At: ${new Date().toISOString()}\nResources:\n- eip155:84532:${contract}`;
    setBvSiweMessage(msg);
    setBvStep(2);
  };

  // Handler to run Base Verify API simulation
  const handleRunBvSimulation = () => {
    if (!bvSiweMessage) handleGenerateSiweMessage();
    setBvIsLoading(true);
    setBvResponse(null);
    setBvStep(2);

    setTimeout(() => {
      setBvStep(3);
      setTimeout(() => {
        setBvIsLoading(false);
        setBvSigned(true);

        if (bvSimulateErrorMode === "404_unverified") {
          setBvResponse({
            status: 404,
            error: "verification_not_found",
            message: `User wallet has no verified ${bvProvider.toUpperCase()} credential on Base Verify. Please redirect user to https://verify.base.dev`
          });
          setBvStep(2);
          return;
        }

        if (bvSimulateErrorMode === "400_conditions") {
          setBvResponse({
            status: 400,
            error: "conditions_not_satisfied",
            message: `User wallet is verified on ${bvProvider.toUpperCase()} but does not satisfy policy condition: [${bvCondition}].`
          });
          setBvStep(2);
          return;
        }

        if (bvSimulateErrorMode === "404_no_contract") {
          setBvResponse({
            status: 404,
            error: "contract_not_found",
            message: `Contract ${bvConsumerContract} is not deployed on Base Sepolia (84532) or does not expose provider()/conditions().`
          });
          setBvStep(2);
          return;
        }

        // Success 200 OK
        const mockIdentityHash = `0x${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}`.padEnd(66, "0");
        const exp = Math.floor(Date.now() / 1000) + 300;
        const mockSig = `0x${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}`;

        setBvResponse({
          status: 200,
          identityHash: mockIdentityHash,
          expiration: exp,
          signature: mockSig,
          message: "Verification generated successfully! Passed BaseVerifyConsumer._verify() check on SignerRegistry."
        });
        setBvStep(4);
      }, 800);
    }, 800);
  };

  // Export Reconciled B20 Orders to CSV
  const handleExportOrdersCSV = () => {
    if (!b20Orders || b20Orders.length === 0) return;

    const headers = [
      "Order ID",
      "Token Symbol",
      "Token Address",
      "Amount",
      "Payer Address",
      "Merchant Address",
      "Bytes32 Memo",
      "Status",
      "Revert Reason",
      "Tx Hash",
      "Block Number",
      "Timestamp"
    ];

    const escapeCSV = (val: string | number | undefined | null) => {
      if (val === undefined || val === null) return '""';
      const clean = String(val).replace(/"/g, '""');
      return `"${clean}"`;
    };

    const rows = b20Orders.map((order) => [
      escapeCSV(order.orderId),
      escapeCSV(order.tokenSymbol),
      escapeCSV(order.tokenAddress),
      escapeCSV(order.amount),
      escapeCSV(order.payerAddress),
      escapeCSV(order.merchantAddress),
      escapeCSV(order.memoBytes32),
      escapeCSV(order.status),
      escapeCSV(order.revertReason || ""),
      escapeCSV(order.txHash),
      escapeCSV(order.blockNumber),
      escapeCSV(order.timestamp)
    ].join(","));

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `b20_reconciled_orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Helper to format payload for QR Code
  const getQrPayload = (insc: Inscription, type: "protocol" | "txhash" | "full") => {
    if (type === "protocol") {
      return JSON.stringify({
        p: "brc-20",
        op: insc.op,
        tick: insc.ticker,
        amt: String(insc.amount)
      }, null, 2);
    }
    if (type === "txhash") {
      return `bitcoin:${insc.txHash}?inscription=${insc.id}`;
    }
    return JSON.stringify({
      p: "brc-20",
      op: insc.op,
      tick: insc.ticker,
      amt: String(insc.amount),
      id: insc.id,
      number: insc.number,
      txHash: insc.txHash,
      timestamp: insc.timestamp
    }, null, 2);
  };

  // Record QR code generations into history (keeping last 5 items)
  useEffect(() => {
    if (qrModalInscription) {
      const payload = getQrPayload(qrModalInscription, qrDataType);
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

      const newItem: QrHistoryItem = {
        id: `${qrModalInscription.id}-${qrDataType}-${now.getTime()}`,
        inscriptionId: qrModalInscription.id,
        number: qrModalInscription.number,
        ticker: qrModalInscription.ticker,
        dataType: qrDataType,
        payload,
        timestamp: timeStr,
        inscription: qrModalInscription
      };

      setQrHistory((prev) => {
        if (prev.length > 0 && prev[0].payload === payload) {
          return prev;
        }
        const filtered = prev.filter((item) => item.payload !== payload);
        return [newItem, ...filtered].slice(0, 5);
      });
    }
  }, [qrModalInscription, qrDataType]);

  // Helper to trigger PNG download of the generated QR code
  const handleDownloadPng = useCallback(() => {
    if (!qrModalInscription) return;
    const svg = document.getElementById("inscription-qr-code-svg") as SVGSVGElement | null;
    if (!svg) return;
    try {
      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
      const URLObj = window.URL || window.webkitURL || window;
      const svgUrl = URLObj.createObjectURL(svgBlob);

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const scale = 4; // High DPI rasterization for crisp PNG output
        const width = (svg.clientWidth || 200) * scale;
        const height = (svg.clientHeight || 200) * scale;
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          if (!blob) return;
          const pngUrl = URLObj.createObjectURL(blob);
          const downloadLink = document.createElement("a");
          downloadLink.href = pngUrl;
          downloadLink.download = `brc20_inscription_${qrModalInscription.number}_qr.png`;
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
          URLObj.revokeObjectURL(pngUrl);
          URLObj.revokeObjectURL(svgUrl);
        }, "image/png");
      };
      img.src = svgUrl;
    } catch (err) {
      console.error("Auto-save QR PNG error:", err);
    }
  }, [qrModalInscription]);

  // Helper to share QR code image or payload link via Web Share API
  const handleShareQr = async () => {
    if (!qrModalInscription) return;
    const payload = getQrPayload(qrModalInscription, qrDataType);
    const title = `BRC-20 Inscription #${qrModalInscription.number} (${qrModalInscription.ticker.toUpperCase()})`;
    const text = `BRC-20 Inscription #${qrModalInscription.number} (${qrModalInscription.ticker.toUpperCase()}) - ${
      qrDataType === "protocol" ? "BRC-20 Payload" : qrDataType === "txhash" ? "Bitcoin URI" : "Full Metadata"
    }:\n${payload}`;
    const url = typeof window !== "undefined" ? window.location.href : undefined;

    const svg = document.getElementById("inscription-qr-code-svg") as SVGSVGElement | null;
    let fileToShare: File | null = null;

    if (svg) {
      try {
        const svgData = new XMLSerializer().serializeToString(svg);
        const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
        const URLObj = window.URL || window.webkitURL || window;
        const svgUrl = URLObj.createObjectURL(svgBlob);

        const img = new Image();
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = svgUrl;
        });

        const canvas = document.createElement("canvas");
        canvas.width = 600;
        canvas.height = 600;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.fillStyle = qrBgColor;
          ctx.fillRect(0, 0, 600, 600);
          ctx.drawImage(img, 0, 0, 600, 600);
          URLObj.revokeObjectURL(svgUrl);

          const pngBlob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
          if (pngBlob) {
            fileToShare = new File([pngBlob], `brc20_inscription_${qrModalInscription.number}_qr.png`, {
              type: "image/png",
            });
          }
        }
      } catch (err) {
        console.warn("Could not attach QR PNG image for share, sending text payload:", err);
      }
    }

    const shareData: ShareData = {
      title,
      text,
      url,
    };

    if (fileToShare && typeof navigator !== "undefined" && navigator.canShare && navigator.canShare({ files: [fileToShare] })) {
      shareData.files = [fileToShare];
    }

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          navigator.clipboard.writeText(payload);
          setCopiedQrData(true);
          setTimeout(() => setCopiedQrData(false), 2000);
        }
      }
    } else {
      navigator.clipboard.writeText(payload);
      setCopiedQrData(true);
      setTimeout(() => setCopiedQrData(false), 2000);
    }
  };

  // Auto-save effect: Trigger PNG download automatically whenever a new QR code is rendered if autoSaveQr is checked
  useEffect(() => {
    if (!autoSaveQr || !qrModalInscription) return;
    const timer = setTimeout(() => {
      handleDownloadPng();
    }, 200);
    return () => clearTimeout(timer);
  }, [autoSaveQr, qrModalInscription, qrDataType, qrFgColor, qrBgColor, qrErrorLevel, handleDownloadPng]);

  // Stats Counters
  const [stats, setStats] = useState({
    totalInscriptions: INITIAL_INSCRIPTIONS.length,
    activeBalances: INITIAL_LEDGER.length,
    totalVolume: 3000
  });

  // Hydration & Storage sync
  useEffect(() => {
    try {
      const storedTokens = localStorage.getItem("brc20_tokens");
      const storedInscriptions = localStorage.getItem("brc20_inscriptions");
      const storedLedger = localStorage.getItem("brc20_ledger");
      const storedTheme = localStorage.getItem("brc20_theme_mode");

      if (storedTokens) setTokens(JSON.parse(storedTokens));
      if (storedInscriptions) setInscriptions(JSON.parse(storedInscriptions));
      if (storedLedger) setLedger(JSON.parse(storedLedger));
      if (storedTheme && ["slate", "oled", "cyber", "emerald", "light"].includes(storedTheme)) {
        setThemeMode(storedTheme as any);
      }
    } catch (err) {
      console.error("Failed to parse stored JSON from localStorage:", err);
    }
  }, []);

  // Update theme in localStorage on change
  useEffect(() => {
    localStorage.setItem("brc20_theme_mode", themeMode);
  }, [themeMode]);

  // Update stats & localStorage on state change
  useEffect(() => {
    localStorage.setItem("brc20_tokens", JSON.stringify(tokens));
    localStorage.setItem("brc20_inscriptions", JSON.stringify(inscriptions));
    localStorage.setItem("brc20_ledger", JSON.stringify(ledger));

    const totalVol = ledger.reduce((acc, curr) => acc + curr.overall, 0);
    setStats({
      totalInscriptions: inscriptions.length,
      activeBalances: ledger.length,
      totalVolume: totalVol
    });
  }, [tokens, inscriptions, ledger]);

  // Handler for exporting Inscriptions list to JSON
  const handleExportInscriptions = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(inscriptions, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `brc20_inscriptions_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Handler for exporting Ledger to JSON
  const handleExportLedger = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(ledger, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `brc20_ledger_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Handler for simulation inscribing
  const handleSimulateInscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simTicker || simAmount <= 0) return;

    const formattedTicker = simTicker.toLowerCase().trim();
    const matchedToken = tokens.find((t) => t.ticker === formattedTicker);

    if (!matchedToken) {
      alert(`Token $${formattedTicker} does not exist. Please use an existing ticker like "base", "spark", "farc", etc.`);
      return;
    }

    // Verify Mint Limit
    if (simOp === "mint" && simAmount > matchedToken.mintLimit) {
      alert(`Mint amount exceeds the limit of ${matchedToken.mintLimit} per mint for $${formattedTicker}.`);
      return;
    }

    // Verify Supply cap for Mint
    if (simOp === "mint" && matchedToken.minted + simAmount > matchedToken.totalSupply) {
      alert(`Mint amount exceeds remaining supply of ${matchedToken.totalSupply - matchedToken.minted} for $${formattedTicker}.`);
      return;
    }

    // Verify Available Balance for Transfer
    if (simOp === "transfer") {
      const userBalance = ledger.find((b) => b.ticker === formattedTicker);
      if (!userBalance || userBalance.available < simAmount) {
        alert(`Insufficient available balance of $${formattedTicker} to transfer. Available: ${userBalance?.available || 0}`);
        return;
      }
    }

    // Generate deterministic tx hash & inscription ID
    const randomHex = () => Math.random().toString(16).substring(2, 10);
    const newTxHash = `${randomHex()}${randomHex()}...${randomHex()}`;
    const newInscriptionId = `${randomHex()}${randomHex()}${randomHex()}${randomHex()}i0`;
    const newInscriptionNumber = inscriptions.length > 0 ? Math.max(...inscriptions.map(i => i.number)) + 1 : 100001;

    const nowStr = new Date().toISOString().replace("T", " ").substring(0, 19);

    const newInsc: Inscription = {
      id: newInscriptionId,
      number: newInscriptionNumber,
      ticker: formattedTicker,
      amount: simAmount,
      op: simOp,
      timestamp: nowStr,
      txHash: newTxHash
    };

    // Update Inscriptions list
    setInscriptions((prev) => [newInsc, ...prev]);

    // Update Balances
    setLedger((prevLedger) => {
      const existing = prevLedger.find((b) => b.ticker === formattedTicker);
      if (existing) {
        return prevLedger.map((b) => {
          if (b.ticker === formattedTicker) {
            const overallDiff = simOp === "mint" ? simAmount : -simAmount;
            const availableDiff = simOp === "mint" ? simAmount : -simAmount;
            return {
              ...b,
              overall: Math.max(0, b.overall + overallDiff),
              available: Math.max(0, b.available + availableDiff),
              lastUpdated: nowStr
            };
          }
          return b;
        });
      } else {
        if (simOp === "transfer") return prevLedger; // should not happen due to check
        return [
          ...prevLedger,
          {
            ticker: formattedTicker,
            overall: simAmount,
            transferable: 0,
            available: simAmount,
            lastUpdated: nowStr
          }
        ];
      }
    });

    // Update Token minted status
    if (simOp === "mint") {
      setTokens((prevTokens) =>
        prevTokens.map((t) => {
          if (t.ticker === formattedTicker) {
            const nextMinted = Math.min(t.totalSupply, t.minted + simAmount);
            // Append value to sparkline
            const progressPercent = (nextMinted / t.totalSupply) * 100;
            const nextSparkline = [...t.sparklineData.slice(1), { value: progressPercent }];
            return {
              ...t,
              minted: nextMinted,
              sparklineData: nextSparkline,
              holders: t.holders + (ledger.some(l => l.ticker === formattedTicker) ? 0 : 1),
              transactions: t.transactions + 1
            };
          }
          return t;
        })
      );
    }

    setSimSuccessMsg(`Successfully inscribed ${simOp.toUpperCase()} for ${simAmount} $${formattedTicker}!`);
    setTimeout(() => setSimSuccessMsg(null), 4000);
  };

  // Search and Filter Tokens
  const filteredTokens = tokens.filter((t) => {
    const matchesSearch = t.ticker.toLowerCase().includes(searchQuery.toLowerCase());
    const isCompleted = t.minted >= t.totalSupply;
    if (mintFilter === "completed") return matchesSearch && isCompleted;
    if (mintFilter === "inprogress") return matchesSearch && !isCompleted;
    return matchesSearch;
  });

  // Search and Filter Ledger Balances
  const filteredLedger = ledger.filter((b) =>
    b.ticker.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Dynamic container class based on active theme
  const getThemeContainerClass = () => {
    switch (themeMode) {
      case "oled":
        return "bg-black text-neutral-100";
      case "cyber":
        return "bg-[#080614] text-purple-100";
      case "emerald":
        return "bg-[#040e0b] text-emerald-100";
      case "light":
        return "bg-slate-100 text-slate-900";
      case "slate":
      default:
        return "bg-slate-950 text-slate-100";
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 flex flex-col ${getThemeContainerClass()}`} id="app_root_container">
      {/* Top Navigation / Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50 px-4 py-4 md:px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4" id="app_header">
        <div className="flex items-center gap-3">
          <div className="bg-amber-500 text-slate-950 p-2 rounded-xl font-bold flex items-center justify-center shadow-lg shadow-amber-500/10" id="brand_icon">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              BRC-20 Explorer & Ledger <span className="text-xs font-mono px-2 py-0.5 bg-amber-500/10 text-amber-500 rounded border border-amber-500/20">Alpha</span>
            </h1>
            <p className="text-xs text-slate-400">Inscribe, mint, and track Bitcoin BRC-20 experimental standard</p>
          </div>
        </div>

        {/* Global Controls & Live Stats bar */}
        <div className="flex flex-wrap items-center gap-3" id="header_right_controls">
          {/* Theme Selector */}
          <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-800 rounded-xl p-1 text-xs shadow-md" id="theme_switcher_group">
            <button
              type="button"
              onClick={() => setThemeMode("slate")}
              className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                themeMode === "slate"
                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
              title="Midnight Slate (Default Dark Mode)"
              id="theme_btn_slate"
            >
              <Moon className="w-3 h-3 text-amber-400" />
              <span>Slate</span>
            </button>

            <button
              type="button"
              onClick={() => setThemeMode("oled")}
              className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                themeMode === "oled"
                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
              title="OLED Pitch Black (AMOLED Dark Mode)"
              id="theme_btn_oled"
            >
              <span className="w-2 h-2 rounded-full bg-neutral-950 border border-neutral-700"></span>
              <span>OLED</span>
            </button>

            <button
              type="button"
              onClick={() => setThemeMode("cyber")}
              className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                themeMode === "cyber"
                  ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
              title="Cyberpunk Neon Dark Mode"
              id="theme_btn_cyber"
            >
              <Zap className="w-3 h-3 text-cyan-400" />
              <span>Cyber</span>
            </button>

            <button
              type="button"
              onClick={() => setThemeMode("emerald")}
              className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                themeMode === "emerald"
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
              title="Obsidian Emerald Dark Mode"
              id="theme_btn_emerald"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Emerald</span>
            </button>

            <button
              type="button"
              onClick={() => setThemeMode("light")}
              className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                themeMode === "light"
                  ? "bg-amber-500 text-slate-950 font-extrabold shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
              title="Switch to Daylight Light Mode"
              id="theme_btn_light"
            >
              <Sun className="w-3 h-3" />
              <span>Light</span>
            </button>
          </div>

          {/* Farcaster Login Button / Profile Pill */}
          <button
            type="button"
            onClick={() => setIsFcModalOpen(true)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all border shadow-md cursor-pointer ${
              farcasterUser
                ? "bg-purple-950/80 border-purple-500/50 text-purple-200 hover:bg-purple-900/80 shadow-purple-900/20"
                : "bg-purple-600 hover:bg-purple-500 border-purple-400/40 text-white shadow-purple-600/30"
            }`}
            id="farcaster_login_header_btn"
            title={farcasterUser ? `Connected as @${farcasterUser.username}` : "Sign in with Farcaster"}
          >
            {farcasterUser ? (
              <>
                <img
                  src={farcasterUser.pfpUrl || "https://i.imgur.com/39wH8y2.jpg"}
                  alt={farcasterUser.username}
                  className="w-5 h-5 rounded-full object-cover border border-purple-400/50"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/identicon/svg?seed=${farcasterUser.username}`;
                  }}
                />
                <span className="font-semibold text-purple-100">@{farcasterUser.username}</span>
                <span className="bg-purple-800/80 text-purple-200 text-[10px] px-1.5 py-0.2 rounded-full font-mono border border-purple-500/30">
                  FID:{farcasterUser.fid}
                </span>
              </>
            ) : (
              <>
                <div className="w-5 h-5 rounded-full bg-purple-100/20 flex items-center justify-center font-extrabold text-[10px] text-white">
                  FC
                </div>
                <span>Farcaster Login</span>
              </>
            )}
          </button>

          {/* Global Live Stats bar */}
          <div className="flex items-center gap-4 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-300" id="global_status_widget">
            <div className="flex items-center gap-1.5 border-r border-slate-800 pr-4">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-mono text-slate-400">BTC Height:</span>
              <span className="font-bold font-mono text-white">854,228</span>
            </div>
            <div className="flex items-center gap-1.5 border-r border-slate-800 pr-4">
              <Activity className="w-3.5 h-3.5 text-amber-500" />
              <span>Inscriptions:</span>
              <span className="font-bold font-mono text-white">{stats.totalInscriptions}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Wallet className="w-3.5 h-3.5 text-sky-500" />
              <span>Balance overall:</span>
              <span className="font-bold font-mono text-white">{stats.totalVolume.toLocaleString()} units</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container Layout */}
      <main className="flex-grow max-w-7xl w-full mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8" id="app_main_layout">
        
        {/* Left column - Simulator Panel (lg:col-span-4) */}
        <div className="lg:col-span-4 flex flex-col gap-6" id="left_side_panel">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl" id="simulator_card">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h2 className="text-base font-semibold text-white">Inscribe Simulator</h2>
            </div>
            
            <p className="text-xs text-slate-400 mb-4">
              Simulate standard BRC-20 operations directly in your client sandbox. Operations instantly update the ledger balances and inscription logs.
            </p>

            <form onSubmit={handleSimulateInscribe} className="flex flex-col gap-4" id="simulation_form">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Operation Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSimOp("mint")}
                    className={`py-2 px-3 rounded-lg text-xs font-medium border transition-all ${
                      simOp === "mint"
                        ? "bg-amber-500/10 border-amber-500 text-amber-500"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                    id="sim_op_mint"
                  >
                    MINT
                  </button>
                  <button
                    type="button"
                    onClick={() => setSimOp("transfer")}
                    className={`py-2 px-3 rounded-lg text-xs font-medium border transition-all ${
                      simOp === "transfer"
                        ? "bg-amber-500/10 border-amber-500 text-amber-500"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                    id="sim_op_transfer"
                  >
                    TRANSFER
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="ticker_select" className="block text-xs font-medium text-slate-400 mb-1">Select Token</label>
                <select
                  id="ticker_select"
                  value={simTicker}
                  onChange={(e) => {
                    setSimTicker(e.target.value);
                    const matched = tokens.find(t => t.ticker === e.target.value);
                    if (matched) setSimAmount(simOp === "mint" ? matched.mintLimit : 100);
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-xs text-slate-300 focus:outline-none focus:border-amber-500 font-mono"
                >
                  {tokens.map((t) => (
                    <option key={t.ticker} value={t.ticker}>
                      {t.ticker.toUpperCase()} (Limit: {t.mintLimit})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="amount_input" className="block text-xs font-medium text-slate-400 mb-1">Amount</label>
                <div className="relative">
                  <input
                    id="amount_input"
                    type="number"
                    value={simAmount}
                    onChange={(e) => setSimAmount(parseInt(e.target.value) || 0)}
                    placeholder="Enter amount"
                    min="1"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 pl-3 pr-16 text-xs text-slate-300 focus:outline-none focus:border-amber-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const matched = tokens.find(t => t.ticker === simTicker);
                      if (matched) setSimAmount(simOp === "mint" ? matched.mintLimit : (ledger.find(l => l.ticker === simTicker)?.available || 100));
                    }}
                    className="absolute right-2 top-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-[10px] text-amber-500 rounded font-semibold transition-all"
                  >
                    MAX
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10 transition-all"
                id="btn_submit_inscribe"
              >
                <PlusCircle className="w-4 h-4" />
                Inscribe {simOp.toUpperCase()}
              </button>
            </form>

            <AnimatePresence>
              {simSuccessMsg && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl flex items-start gap-2"
                  id="simulation_success_toast"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span>{simSuccessMsg}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Quick Help Box */}
          <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5" id="help_box">
            <h3 className="text-xs font-semibold text-white mb-2 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-amber-500" />
              What is BRC-20?
            </h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              BRC-20 is an experimental token standard for Bitcoin using ordinal inscriptions. 
              Tokens are deployed, minted, and transferred utilizing JSON payloads inscribed directly onto satoshis.
            </p>
          </div>
        </div>

        {/* Right column - Main Dashboard Tabs & Lists (lg:col-span-8) */}
        <div className="lg:col-span-8 flex flex-col gap-6" id="dashboard_panel">
          
          {/* Navigation Tab bar & Search controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-2 rounded-2xl" id="tab_control_container">
            <div className="flex flex-wrap items-center gap-1" id="tab_buttons_group">
              <button
                onClick={() => setActiveTab("tokens")}
                className={`flex items-center gap-2 py-2 px-3 rounded-xl text-xs font-medium transition-all ${
                  activeTab === "tokens"
                    ? "bg-slate-800 text-white shadow"
                    : "text-slate-400 hover:text-slate-200"
                }`}
                id="tab_btn_tokens"
              >
                <TrendingUp className="w-4 h-4" />
                BRC-20 Tokens
              </button>
              <button
                onClick={() => setActiveTab("inscriptions")}
                className={`flex items-center gap-2 py-2 px-3 rounded-xl text-xs font-medium transition-all ${
                  activeTab === "inscriptions"
                    ? "bg-slate-800 text-white shadow"
                    : "text-slate-400 hover:text-slate-200"
                }`}
                id="tab_btn_inscriptions"
              >
                <FileText className="w-4 h-4" />
                Inscriptions
              </button>
              <button
                onClick={() => setActiveTab("ledger")}
                className={`flex items-center gap-2 py-2 px-3 rounded-xl text-xs font-medium transition-all ${
                  activeTab === "ledger"
                    ? "bg-slate-800 text-white shadow"
                    : "text-slate-400 hover:text-slate-200"
                }`}
                id="tab_btn_ledger"
              >
                <Database className="w-4 h-4" />
                Ledger
              </button>
              <button
                onClick={() => setActiveTab("b20_launchpad")}
                className={`flex items-center gap-2 py-2 px-3 rounded-xl text-xs font-medium transition-all ${
                  activeTab === "b20_launchpad"
                    ? "bg-blue-600 text-white font-semibold shadow-lg shadow-blue-500/20"
                    : "text-blue-400 hover:text-blue-300 hover:bg-blue-950/40"
                }`}
                id="tab_btn_b20_launchpad"
              >
                <Rocket className="w-4 h-4 text-blue-300" />
                Base B20 Launchpad
              </button>
              <button
                onClick={() => setActiveTab("b20_payments")}
                className={`flex items-center gap-2 py-2 px-3 rounded-xl text-xs font-medium transition-all ${
                  activeTab === "b20_payments"
                    ? "bg-emerald-600 text-white font-semibold shadow-lg shadow-emerald-500/20"
                    : "text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/40"
                }`}
                id="tab_btn_b20_payments"
              >
                <Receipt className="w-4 h-4 text-emerald-300" />
                B20 Payments & Memos
              </button>
              <button
                onClick={() => setActiveTab("airdrop")}
                className={`flex items-center gap-2 py-2 px-3 rounded-xl text-xs font-medium transition-all ${
                  activeTab === "airdrop"
                    ? "bg-purple-600 text-white font-semibold shadow-lg shadow-purple-500/20"
                    : "text-purple-400 hover:text-purple-300 hover:bg-purple-950/40"
                }`}
                id="tab_btn_airdrop"
              >
                <Gift className="w-4 h-4 text-purple-300" />
                Airdrop Suite
              </button>
              <button
                onClick={() => setActiveTab("notifications")}
                className={`flex items-center gap-2 py-2 px-3 rounded-xl text-xs font-medium transition-all ${
                  activeTab === "notifications"
                    ? "bg-amber-600 text-white font-semibold shadow-lg shadow-amber-500/20"
                    : "text-amber-400 hover:text-amber-300 hover:bg-amber-950/40"
                }`}
                id="tab_btn_notifications"
              >
                <Bell className="w-4 h-4 text-amber-300" />
                Base Notifications
              </button>
              <button
                onClick={() => setActiveTab("base_trading")}
                className={`flex items-center gap-2 py-2 px-3 rounded-xl text-xs font-medium transition-all relative ${
                  activeTab === "base_trading"
                    ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold shadow-lg shadow-cyan-500/20"
                    : "text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/40"
                }`}
                id="tab_btn_base_trading"
              >
                <Zap className="w-4 h-4 text-cyan-300" />
                Base Swap & Trading
                <span className="text-[9px] px-1.5 py-0.2 bg-cyan-400 text-slate-950 rounded-full font-bold uppercase tracking-wider">
                  HOT
                </span>
              </button>
              <button
                onClick={() => setActiveTab("base_verify")}
                className={`flex items-center gap-2 py-2 px-3 rounded-xl text-xs font-medium transition-all relative ${
                  activeTab === "base_verify"
                    ? "bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 text-white font-semibold shadow-lg shadow-indigo-500/20"
                    : "text-indigo-400 hover:text-indigo-300 hover:bg-indigo-950/40"
                }`}
                id="tab_btn_base_verify"
              >
                <ShieldCheck className="w-4 h-4 text-indigo-300" />
                Base Verify & Docs
                <span className="text-[9px] px-1.5 py-0.2 bg-indigo-500 text-white rounded-full font-bold uppercase tracking-wider">
                  VERIFY
                </span>
              </button>
            </div>

            {/* Render conditional actions inside tab controls (like search or exports) */}
            <div className="flex items-center gap-2" id="conditional_controls">
              {(activeTab === "tokens" || activeTab === "ledger") && (
                <div className="relative w-full sm:w-48" id="search_input_container">
                  <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search ticker..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg py-1.5 pl-8 pr-3 text-xs text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-amber-500 font-mono"
                    id="header_search_input"
                  />
                </div>
              )}

              {activeTab === "inscriptions" && (
                <button
                  onClick={handleExportInscriptions}
                  className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs py-1.5 px-3 rounded-lg flex items-center gap-1.5 transition-all text-white font-medium"
                  id="btn_export_inscriptions"
                >
                  <Download className="w-3.5 h-3.5 text-amber-500" />
                  Export to JSON
                </button>
              )}

              {activeTab === "ledger" && (
                <button
                  onClick={handleExportLedger}
                  className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs py-1.5 px-3 rounded-lg flex items-center gap-1.5 transition-all text-white font-medium"
                  id="btn_export_ledger"
                >
                  <Download className="w-3.5 h-3.5 text-amber-500" />
                  Export to JSON
                </button>
              )}

              {(activeTab === "b20_launchpad" || activeTab === "b20_payments") && (
                <button
                  onClick={() => {
                    setCodeSnippetType(activeTab === "b20_launchpad" ? "solidity_b20" : "viem_pay");
                    setCodeModalOpen(true);
                  }}
                  className="bg-blue-950/80 hover:bg-blue-900 border border-blue-800/80 text-blue-300 text-xs py-1.5 px-3 rounded-lg flex items-center gap-1.5 transition-all font-medium cursor-pointer"
                  id="btn_view_b20_code"
                >
                  <Code className="w-3.5 h-3.5 text-blue-400" />
                  Integration Code
                </button>
              )}
            </div>
          </div>

          {/* Tab Content Display */}
          <div id="tab_content_wrapper">
            
            {/* 1. TOKENS TAB */}
            {activeTab === "tokens" && (
              <div className="flex flex-col gap-4" id="tokens_tab_content">
                {/* Mint Progress Filter buttons */}
                <div className="flex items-center gap-2 mb-2" id="filter_buttons">
                  <button
                    onClick={() => setMintFilter("all")}
                    className={`px-3 py-1 rounded-full text-[10px] font-semibold border ${
                      mintFilter === "all"
                        ? "bg-amber-500/10 border-amber-500 text-amber-500"
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    ALL
                  </button>
                  <button
                    onClick={() => setMintFilter("inprogress")}
                    className={`px-3 py-1 rounded-full text-[10px] font-semibold border ${
                      mintFilter === "inprogress"
                        ? "bg-amber-500/10 border-amber-500 text-amber-500"
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    MINTING IN PROGRESS
                  </button>
                  <button
                    onClick={() => setMintFilter("completed")}
                    className={`px-3 py-1 rounded-full text-[10px] font-semibold border ${
                      mintFilter === "completed"
                        ? "bg-amber-500/10 border-amber-500 text-amber-500"
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    COMPLETED
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="tokens_grid">
                  {filteredTokens.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-2xl" id="no_tokens_found">
                      No BRC-20 tokens match your filter.
                    </div>
                  ) : (
                    filteredTokens.map((t) => {
                      const mintProgressPercent = Math.min(100, (t.minted / t.totalSupply) * 100);
                      const isComplete = mintProgressPercent >= 100;
                      return (
                        <div
                          key={t.ticker}
                          className="bg-slate-900 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700 transition-all shadow-md flex flex-col gap-4 relative overflow-hidden"
                          id={`token_card_${t.ticker}`}
                        >
                          {/* Banner background status accent */}
                          <div className={`absolute top-0 left-0 right-0 h-1 ${isComplete ? "bg-emerald-500" : "bg-amber-500"}`} />

                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-lg font-bold text-white font-mono uppercase">${t.ticker}</span>
                                {isComplete ? (
                                  <span className="text-[9px] font-bold px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded uppercase">
                                    Mint Completed
                                  </span>
                                ) : (
                                  <span className="text-[9px] font-bold px-1.5 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded uppercase animate-pulse">
                                    In Progress
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] font-mono text-slate-500">Deploy block: {t.createdBlock}</span>
                            </div>

                            {/* Mini Sparkline Chart utilizing Recharts */}
                            <div className="flex flex-col items-end" id={`sparkline_wrapper_${t.ticker}`}>
                              <span className="text-[9px] text-slate-500 uppercase tracking-wider mb-1">Mint Trend</span>
                              <Sparkline data={t.sparklineData} color={isComplete ? "#10b981" : "#f59e0b"} />
                            </div>
                          </div>

                          {/* Progress bar */}
                          <div>
                            <div className="flex justify-between text-[11px] mb-1 font-mono text-slate-400">
                              <span>Mint progress</span>
                              <span className="font-bold text-white">{mintProgressPercent.toFixed(1)}%</span>
                            </div>
                            <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${isComplete ? "bg-emerald-500" : "bg-amber-500"}`}
                                style={{ width: `${mintProgressPercent}%` }}
                              />
                            </div>
                          </div>

                          {/* Parameter details list */}
                          <div className="grid grid-cols-2 gap-y-2 gap-x-4 border-t border-slate-800/60 pt-3 text-xs" id={`token_params_${t.ticker}`}>
                            <div>
                              <span className="text-[10px] text-slate-500 block uppercase">Total Supply</span>
                              <span className="font-mono text-white font-semibold">{t.totalSupply.toLocaleString()}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-500 block uppercase">Limit Per Mint</span>
                              <span className="font-mono text-white font-semibold">{t.mintLimit.toLocaleString()}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-500 block uppercase">Holders</span>
                              <span className="font-mono text-white font-semibold">{t.holders.toLocaleString()}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-500 block uppercase">Transactions</span>
                              <span className="font-mono text-white font-semibold">{t.transactions.toLocaleString()}</span>
                            </div>
                          </div>

                          <div className="pt-3 border-t border-slate-800/60">
                            <button
                              onClick={() => handleOpenQuickTrade(t.ticker)}
                              className="w-full py-2 px-3 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-mono font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
                              id={`btn_trade_card_${t.ticker}`}
                            >
                              <Zap className="w-3.5 h-3.5 text-cyan-400" />
                              Swap & Trade ${t.ticker} on Base
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* 2. MY INSCRIPTIONS TAB */}
            {activeTab === "inscriptions" && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl" id="inscriptions_tab_content">
                <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between" id="inscriptions_header">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-amber-500" />
                    <h3 className="font-semibold text-white">Your Inscription Logs</h3>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-950 text-slate-400 border border-slate-800 rounded">
                    Total: {inscriptions.length} logs
                  </span>
                </div>

                <div className="overflow-x-auto" id="inscriptions_table_container">
                  {inscriptions.length === 0 ? (
                    <div className="py-12 text-center text-slate-500 text-xs" id="no_inscriptions_found">
                      You haven&apos;t inscribed any operations yet. Use the Simulator on the left!
                    </div>
                  ) : (
                    <table className="w-full text-left border-collapse" id="inscriptions_table">
                      <thead>
                        <tr className="border-b border-slate-800 text-[10px] text-slate-500 uppercase font-mono bg-slate-950/40">
                          <th className="py-3 px-6 cursor-pointer select-none hover:text-white transition-colors" onClick={() => toggleInscSort("number")} title="Click to sort by Inscription Number">
                            <div className="flex items-center gap-1.5">
                              <span>Number / ID</span>
                              {inscSortField === "number" ? (
                                inscSortOrder === "asc" ? <ArrowUp className="w-3.5 h-3.5 text-amber-400 font-bold" /> : <ArrowDown className="w-3.5 h-3.5 text-amber-400 font-bold" />
                              ) : (
                                <ArrowUpDown className="w-3.5 h-3.5 opacity-40 hover:opacity-100 transition-opacity" />
                              )}
                            </div>
                          </th>
                          <th className="py-3 px-6 cursor-pointer select-none hover:text-white transition-colors" onClick={() => toggleInscSort("ticker")} title="Click to sort by Ticker">
                            <div className="flex items-center gap-1.5">
                              <span>Ticker</span>
                              {inscSortField === "ticker" ? (
                                inscSortOrder === "asc" ? <ArrowUp className="w-3.5 h-3.5 text-amber-400 font-bold" /> : <ArrowDown className="w-3.5 h-3.5 text-amber-400 font-bold" />
                              ) : (
                                <ArrowUpDown className="w-3.5 h-3.5 opacity-40 hover:opacity-100 transition-opacity" />
                              )}
                            </div>
                          </th>
                          <th className="py-3 px-6 cursor-pointer select-none hover:text-white transition-colors" onClick={() => toggleInscSort("op")} title="Click to sort by Operation">
                            <div className="flex items-center gap-1.5">
                              <span>Op / Payload</span>
                              {inscSortField === "op" ? (
                                inscSortOrder === "asc" ? <ArrowUp className="w-3.5 h-3.5 text-amber-400 font-bold" /> : <ArrowDown className="w-3.5 h-3.5 text-amber-400 font-bold" />
                              ) : (
                                <ArrowUpDown className="w-3.5 h-3.5 opacity-40 hover:opacity-100 transition-opacity" />
                              )}
                            </div>
                          </th>
                          <th className="py-3 px-6 cursor-pointer select-none hover:text-white transition-colors" onClick={() => toggleInscSort("amount")} title="Click to sort by Amount">
                            <div className="flex items-center gap-1.5">
                              <span>Amount</span>
                              {inscSortField === "amount" ? (
                                inscSortOrder === "asc" ? <ArrowUp className="w-3.5 h-3.5 text-amber-400 font-bold" /> : <ArrowDown className="w-3.5 h-3.5 text-amber-400 font-bold" />
                              ) : (
                                <ArrowUpDown className="w-3.5 h-3.5 opacity-40 hover:opacity-100 transition-opacity" />
                              )}
                            </div>
                          </th>
                          <th className="py-3 px-6 cursor-pointer select-none hover:text-white transition-colors" onClick={() => toggleInscSort("timestamp")} title="Click to sort by Timestamp">
                            <div className="flex items-center gap-1.5">
                              <span>Timestamp</span>
                              {inscSortField === "timestamp" ? (
                                inscSortOrder === "asc" ? <ArrowUp className="w-3.5 h-3.5 text-amber-400 font-bold" /> : <ArrowDown className="w-3.5 h-3.5 text-amber-400 font-bold" />
                              ) : (
                                <ArrowUpDown className="w-3.5 h-3.5 opacity-40 hover:opacity-100 transition-opacity" />
                              )}
                            </div>
                          </th>
                          <th className="py-3 px-6">Tx Hash</th>
                          <th className="py-3 px-6 text-right">QR Code</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/55 text-xs text-slate-300">
                        {sortedInscriptions.map((i) => (
                          <tr key={i.id} className="hover:bg-slate-950/20 transition-all" id={`insc_row_${i.number}`}>
                            <td className="py-3 px-6 font-mono">
                              <div className="text-amber-500 font-bold">#{i.number}</div>
                              <div className="text-[10px] text-slate-500 max-w-[120px] truncate" title={i.id}>{i.id}</div>
                            </td>
                            <td className="py-3 px-6 uppercase font-mono font-bold text-white">${i.ticker}</td>
                            <td className="py-3 px-6">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                                i.op === "deploy"
                                  ? "bg-purple-500/10 border border-purple-500/20 text-purple-400"
                                  : i.op === "mint"
                                  ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                                  : "bg-blue-500/10 border border-blue-500/20 text-blue-400"
                              }`}>
                                {i.op}
                              </span>
                            </td>
                            <td className="py-3 px-6 font-mono font-semibold text-white">{i.amount.toLocaleString()}</td>
                            <td className="py-3 px-6 font-mono text-slate-400 text-[11px]">{i.timestamp}</td>
                            <td className="py-3 px-6 font-mono text-slate-400 text-[11px]">{i.txHash}</td>
                            <td className="py-3 px-6 text-right">
                              <button
                                onClick={() => setQrModalInscription(i)}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono font-medium text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg transition-all shadow-sm hover:shadow-amber-500/10 cursor-pointer"
                                id={`btn_qr_${i.number}`}
                                title="Generate QR code for transaction"
                              >
                                <QrCode className="w-3.5 h-3.5" />
                                <span>Generate QR</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}

            {/* 3. LEDGER BALANCES TAB */}
            {activeTab === "ledger" && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl" id="ledger_tab_content">
                <div className="px-6 py-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3" id="ledger_header">
                  <div className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-amber-500" />
                    <h3 className="font-semibold text-white">Your Account Balances</h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative w-full sm:w-52" id="ledger_search_container">
                      <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
                      <input
                        type="text"
                        placeholder="Filter by ticker..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg py-1.5 pl-8 pr-3 text-xs text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-amber-500 font-mono"
                        id="ledger_search_input"
                      />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-950 text-slate-400 border border-slate-800 rounded whitespace-nowrap">
                      Total: {filteredLedger.length} / {ledger.length} assets
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto" id="ledger_table_container">
                  {filteredLedger.length === 0 ? (
                    <div className="py-12 text-center text-slate-500 text-xs" id="no_ledger_found">
                      {searchQuery ? `No active token balances matching "${searchQuery}".` : "No active balances in your account. Mint some tokens!"}
                    </div>
                  ) : (
                    <table className="w-full text-left border-collapse" id="ledger_table">
                      <thead>
                        <tr className="border-b border-slate-800 text-[10px] text-slate-500 uppercase font-mono bg-slate-950/40">
                          <th className="py-3 px-6">Ticker</th>
                          <th className="py-3 px-6 text-right">Available Balance</th>
                          <th className="py-3 px-6 text-right">Transferable</th>
                          <th className="py-3 px-6 text-right">Overall Balance</th>
                          <th className="py-3 px-6 text-right">Last Updated</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/55 text-xs text-slate-300 font-mono">
                        {filteredLedger.map((b) => (
                          <tr key={b.ticker} className="hover:bg-slate-950/20 transition-all" id={`ledger_row_${b.ticker}`}>
                            <td className="py-4 px-6 uppercase font-bold text-white text-sm">${b.ticker}</td>
                            <td className="py-4 px-6 text-right font-semibold text-emerald-400">{b.available.toLocaleString()}</td>
                            <td className="py-4 px-6 text-right text-slate-400">{b.transferable.toLocaleString()}</td>
                            <td className="py-4 px-6 text-right font-bold text-white text-sm">{b.overall.toLocaleString()}</td>
                            <td className="py-4 px-6 text-right text-slate-500 text-[10px]">{b.lastUpdated}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}

            {/* 4. BASE B20 LAUNCHPAD TAB */}
            {activeTab === "b20_launchpad" && (
              <div className="flex flex-col gap-6" id="b20_launchpad_tab_content">
                {/* Hero Feature Banner */}
                <div className="bg-gradient-to-r from-blue-950/80 via-slate-900 to-indigo-950/80 border border-blue-800/50 rounded-2xl p-6 shadow-xl relative overflow-hidden" id="b20_launchpad_hero">
                  <div className="absolute right-0 top-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="flex items-start gap-4 relative z-10">
                    <div className="p-3 bg-blue-600/20 border border-blue-500/30 rounded-xl text-blue-400 shrink-0">
                      <Rocket className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        Launch a B20 Token on Base
                        <span className="text-[10px] font-mono px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded-full border border-blue-500/30">ERC-20 Superset</span>
                      </h2>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        B20 extends standard ERC-20 with built-in onchain memos (<code className="font-mono text-blue-300">transferWithMemo</code>), customizable transfer policies, pausing controls, supply caps, and EIP-2612 permits. Any app accepting ERC-20 accepts B20 with zero code changes.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Deploy Toast Notification */}
                <AnimatePresence>
                  {b20DeployToast && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl flex items-center justify-between shadow-lg"
                      id="b20_deploy_toast"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                        <span className="font-semibold">{b20DeployToast}</span>
                      </div>
                      <button
                        onClick={() => {
                          setCodeSnippetType("viem_pay");
                          setCodeModalOpen(true);
                        }}
                        className="px-3 py-1 bg-emerald-500 text-slate-950 font-bold rounded-lg text-[11px] hover:bg-emerald-400 transition-all cursor-pointer"
                      >
                        Accept Payments Now
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Create B20 Token Form Card */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col gap-5" id="b20_launch_form_card">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                      <PlusCircle className="w-4 h-4 text-blue-400" />
                      Configure & Deploy B20 Token
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        setCodeSnippetType("solidity_b20");
                        setCodeModalOpen(true);
                      }}
                      className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-mono cursor-pointer"
                    >
                      <Code className="w-3.5 h-3.5" />
                      View Smart Contract Code
                    </button>
                  </div>

                  <form onSubmit={handleLaunchB20Token} className="grid grid-cols-1 md:grid-cols-2 gap-4" id="b20_launch_form">
                    <div>
                      <label htmlFor="b20_name_input" className="block text-xs font-medium text-slate-400 mb-1">Token Name</label>
                      <input
                        id="b20_name_input"
                        type="text"
                        placeholder="e.g. Base Cash"
                        value={launchName}
                        onChange={(e) => setLaunchName(e.target.value)}
                        required
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-sans"
                      />
                    </div>

                    <div>
                      <label htmlFor="b20_symbol_input" className="block text-xs font-medium text-slate-400 mb-1">Token Symbol</label>
                      <input
                        id="b20_symbol_input"
                        type="text"
                        placeholder="e.g. BCASH"
                        value={launchSymbol}
                        onChange={(e) => setLaunchSymbol(e.target.value.toUpperCase())}
                        required
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-mono uppercase"
                      />
                    </div>

                    <div>
                      <label htmlFor="b20_decimals_select" className="block text-xs font-medium text-slate-400 mb-1">Decimals (Range: 6 to 18)</label>
                      <select
                        id="b20_decimals_select"
                        value={launchDecimals}
                        onChange={(e) => setLaunchDecimals(parseInt(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                      >
                        <option value={18}>18 (Standard ERC-20 Default)</option>
                        <option value={8}>8 (Bitcoin Precision)</option>
                        <option value={6}>6 (USDC/Stablecoin Style)</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="b20_cap_input" className="block text-xs font-medium text-slate-400 mb-1">Supply Cap (Max Cap)</label>
                      <input
                        id="b20_cap_input"
                        type="number"
                        placeholder="10000000"
                        value={launchCap}
                        onChange={(e) => setLaunchCap(parseInt(e.target.value) || 0)}
                        min="1"
                        required
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-slate-400 mb-1">Transfer Policy</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: "Open", label: "Open Policy", desc: "Unrestricted transfers" },
                          { id: "Allowlist", label: "Allowlist Policy", desc: "Approved addresses only" },
                          { id: "KYC Restricted", label: "KYC Restricted", desc: "Regulated compliance" },
                        ].map((p) => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => setLaunchPolicy(p.id as any)}
                            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                              launchPolicy === p.id
                                ? "bg-blue-600/10 border-blue-500 text-white"
                                : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                            }`}
                          >
                            <div className="text-xs font-bold">{p.label}</div>
                            <div className="text-[10px] text-slate-500 mt-0.5">{p.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Token Logo / Icon Input Section */}
                    <div className="md:col-span-2 flex flex-col gap-2 p-3.5 bg-slate-950 border border-slate-800 rounded-xl" id="b20_logo_input_container">
                      <div className="flex items-center justify-between">
                        <label htmlFor="b20_logo_url_input" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                          <Upload className="w-3.5 h-3.5 text-blue-400" />
                          Token Logo / Icon Metadata
                          <span className="text-[10px] text-slate-500 font-mono font-normal">(File upload or Image URL)</span>
                        </label>
                        {launchLogoUrl && (
                          <button
                            type="button"
                            onClick={() => setLaunchLogoUrl("")}
                            className="text-[10px] text-rose-400 hover:text-rose-300 font-mono flex items-center gap-1 cursor-pointer"
                            id="btn_clear_token_logo"
                          >
                            Reset Custom Logo
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                        {/* File Upload Button / Hidden File Input */}
                        <div className="relative">
                          <input
                            type="file"
                            id="b20_logo_file_input"
                            accept="image/*"
                            onChange={handleLogoFileUpload}
                            className="hidden"
                          />
                          <label
                            htmlFor="b20_logo_file_input"
                            className="flex items-center justify-center gap-2 py-2 px-3 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-xl text-xs font-mono text-slate-200 cursor-pointer transition-all w-full text-center shadow-sm"
                            id="lbl_upload_token_logo"
                          >
                            <Upload className="w-3.5 h-3.5 text-blue-400" />
                            <span>Upload Logo Image</span>
                          </label>
                        </div>

                        {/* URL Input */}
                        <div className="sm:col-span-2 relative">
                          <input
                            id="b20_logo_url_input"
                            type="url"
                            placeholder="Or paste image URL (e.g. https://...)"
                            value={launchLogoUrl}
                            onChange={(e) => setLaunchLogoUrl(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-mono truncate"
                          />
                        </div>
                      </div>

                      {/* Logo Preview & Presets */}
                      <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-900/80">
                        <div className="flex items-center gap-2.5">
                          <span className="text-[11px] text-slate-400 font-mono">Preview:</span>
                          <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700/80 p-0.5 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                            <img
                              src={launchLogoUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${launchSymbol.trim() || "B20"}`}
                              alt="Token Logo Preview"
                              className="w-full h-full object-cover rounded-md"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/identicon/svg?seed=${launchSymbol.trim() || "B20"}`;
                              }}
                            />
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono truncate max-w-[200px]">
                            {launchLogoUrl ? "Custom Logo Attached" : "Auto Generated Avatar"}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const seed = launchSymbol.trim() || launchName.trim() || `token-${Date.now()}`;
                            setLaunchLogoUrl(`https://api.dicebear.com/7.x/identicon/svg?seed=${seed}`);
                          }}
                          className="text-[10px] text-blue-400 hover:text-blue-300 font-mono underline cursor-pointer"
                          id="btn_auto_generate_logo"
                        >
                          Auto Generate Icon
                        </button>
                      </div>
                    </div>

                    {/* Features checklist */}
                    <div className="md:col-span-2 flex flex-wrap gap-4 pt-2 border-t border-slate-800/60 text-xs text-slate-300">
                      <div className="flex items-center gap-1.5 font-mono text-[11px] text-blue-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                        <span>transferWithMemo Enabled</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-mono text-[11px] text-blue-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                        <span>ERC-2612 Permit Support</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-mono text-[11px] text-blue-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                        <span>Issuer Pause Control</span>
                      </div>
                    </div>

                    <div className="md:col-span-2 pt-2">
                      <button
                        type="submit"
                        disabled={isDeployingB20}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition-all cursor-pointer disabled:opacity-50"
                        id="btn_deploy_b20"
                      >
                        {isDeployingB20 ? (
                          <>
                            <Activity className="w-4 h-4 animate-spin" />
                            Deploying to Base Network (Step {deployStep}/3)...
                          </>
                        ) : (
                          <>
                            <Rocket className="w-4 h-4 text-blue-200" />
                            Deploy B20 Token to Base
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Deployed B20 Tokens List */}
                <div className="flex flex-col gap-4" id="deployed_b20_tokens_section">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Coins className="w-4 h-4 text-blue-400" />
                      Active Base B20 Tokens ({b20Tokens.length})
                    </h3>
                    <span className="text-[11px] font-mono text-slate-400">
                      Connected Network: <span className="text-blue-400 font-bold">Base Sepolia / Mainnet</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="b20_tokens_grid">
                    {b20Tokens.map((token) => (
                      <div
                        key={token.id}
                        className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between gap-4 relative overflow-hidden shadow-md hover:border-blue-500/40 transition-all"
                        id={`b20_card_${token.symbol}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-3">
                            {token.logoUrl ? (
                              <img
                                src={token.logoUrl}
                                alt={`${token.symbol} logo`}
                                className="w-10 h-10 rounded-xl object-cover bg-slate-950 border border-slate-700/80 p-0.5 shrink-0 shadow-sm"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/identicon/svg?seed=${token.symbol}`;
                                }}
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-xl bg-blue-950 border border-blue-800 text-blue-300 font-bold text-xs flex items-center justify-center shrink-0 font-mono">
                                {token.symbol.slice(0, 2)}
                              </div>
                            )}
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-base font-bold text-white">{token.name}</h4>
                                <span className="text-xs font-bold font-mono px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded">
                                  ${token.symbol}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                                {token.decimals} Decimals • Cap: {token.totalSupplyCap.toLocaleString()} {token.symbol}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                              token.paused
                                ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                                : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                            }`}>
                              {token.paused ? "PAUSED" : "ACTIVE"}
                            </span>
                            <span className="text-[10px] font-mono text-slate-500">
                              {token.policy} Policy
                            </span>
                          </div>
                        </div>

                        {/* Contract Details */}
                        <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-[11px] font-mono text-slate-400">
                          <span className="truncate pr-2">Contract: {token.contractAddress}</span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(token.contractAddress);
                              alert(`Copied contract address: ${token.contractAddress}`);
                            }}
                            className="p-1 hover:text-white transition-all text-slate-500 shrink-0 cursor-pointer"
                            title="Copy Contract Address"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-300 border-t border-slate-800/80 pt-3">
                          <div>
                            <span className="text-[10px] text-slate-500 block">Circulating Supply</span>
                            <span className="font-bold text-white">{token.currentSupply.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 block">Memo Transactions</span>
                            <span className="font-bold text-emerald-400">{token.memosCount} reconciled</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={() => handleOpenQuickTrade(token.symbol)}
                            className="flex-1 py-2 px-3 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
                          >
                            <Zap className="w-3.5 h-3.5 text-cyan-400" />
                            Trade on Base
                          </button>
                          <button
                            onClick={() => {
                              setPayTokenAddress(token.contractAddress);
                              setActiveTab("b20_payments");
                            }}
                            className="py-2 px-3 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                          >
                            <Receipt className="w-3.5 h-3.5" />
                            Payments
                          </button>
                          <button
                            onClick={() => handleTogglePauseB20Token(token.contractAddress)}
                            className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                              token.paused
                                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                                : "bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20"
                            }`}
                            title={token.paused ? "Unpause Token Transfers" : "Pause Token Transfers"}
                          >
                            {token.paused ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                            {token.paused ? "Unpause" : "Pause"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 5. ACCEPT B20 PAYMENTS (MEMO CHECKOUT) TAB */}
            {activeTab === "b20_payments" && (
              <div className="flex flex-col gap-6" id="b20_payments_tab_content">
                {/* Hero Header */}
                <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/80 border border-emerald-800/50 rounded-2xl p-6 shadow-xl relative overflow-hidden" id="b20_payments_hero">
                  <div className="flex items-start gap-4 relative z-10">
                    <div className="p-3 bg-emerald-600/20 border border-emerald-500/30 rounded-xl text-emerald-400 shrink-0">
                      <Receipt className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        Accept B20 Token Payments
                        <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/30">transferWithMemo</span>
                      </h2>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        Tag every payment with a <code className="font-mono text-emerald-300">bytes32</code> order ID memo using B20&apos;s <code className="font-mono text-emerald-300">transferWithMemo</code> function. Parse the emitted <code className="font-mono text-emerald-300">Memo</code> event to automatically reconcile payments with orders onchain.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Toast Notification */}
                <AnimatePresence>
                  {paymentToast && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`p-4 rounded-xl text-xs flex items-center justify-between shadow-lg border ${
                        paymentToast.type === "success"
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                          : "bg-rose-500/10 border-rose-500/30 text-rose-400"
                      }`}
                      id="payment_toast_banner"
                    >
                      <div className="flex items-start gap-2">
                        {paymentToast.type === "success" ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                        ) : (
                          <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <p className="font-bold">{paymentToast.message}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setPaymentToast(null)}
                        className="text-slate-400 hover:text-white text-xs p-1 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Interactive Payment & Memo Verifier Card */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col gap-5" id="checkout_simulator_card">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                      <Play className="w-4 h-4 text-emerald-400" />
                      Order Checkout & Memo Event Verifier
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        setCodeSnippetType("viem_pay");
                        setCodeModalOpen(true);
                      }}
                      className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-mono cursor-pointer"
                    >
                      <Code className="w-3.5 h-3.5" />
                      Copy Viem Code Snippet
                    </button>
                  </div>

                  <form onSubmit={handleExecuteB20Payment} className="grid grid-cols-1 md:grid-cols-2 gap-4" id="b20_checkout_form">
                    <div>
                      <label htmlFor="pay_token_select" className="block text-xs font-medium text-slate-400 mb-1">Select B20 Token</label>
                      <select
                        id="pay_token_select"
                        value={payTokenAddress}
                        onChange={(e) => setPayTokenAddress(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                      >
                        {b20Tokens.map((t) => (
                          <option key={t.contractAddress} value={t.contractAddress}>
                            {t.name} (${t.symbol}) - {t.contractAddress.slice(0, 12)}... {t.paused ? "[PAUSED]" : ""}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="order_id_input" className="block text-xs font-medium text-slate-400 mb-1">Order ID Memo (Attached as bytes32)</label>
                      <input
                        id="order_id_input"
                        type="text"
                        placeholder="e.g. order-42"
                        value={payOrderId}
                        onChange={(e) => setPayOrderId(e.target.value)}
                        required
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                      />
                    </div>

                    <div>
                      <label htmlFor="pay_amount_input" className="block text-xs font-medium text-slate-400 mb-1">Payment Amount</label>
                      <input
                        id="pay_amount_input"
                        type="number"
                        placeholder="10.0"
                        value={payAmount}
                        onChange={(e) => setPayAmount(parseFloat(e.target.value) || 0)}
                        step="0.01"
                        min="0.01"
                        required
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                      />
                    </div>

                    <div>
                      <label htmlFor="merchant_address_input" className="block text-xs font-medium text-slate-400 mb-1">Merchant Address (Recipient)</label>
                      <input
                        id="merchant_address_input"
                        type="text"
                        value={payMerchant}
                        onChange={(e) => setPayMerchant(e.target.value)}
                        required
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-mono text-[11px]"
                      />
                    </div>

                    {/* Revert Simulation Mode Tester */}
                    <div className="md:col-span-2 bg-slate-950 border border-slate-800/80 rounded-xl p-3 flex flex-col gap-2">
                      <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                        B20 Revert Testing Simulator (<code className="font-mono text-amber-300">simulateContract</code> validation)
                      </span>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => setSimRevertMode("none")}
                          className={`py-1.5 px-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                            simRevertMode === "none"
                              ? "bg-emerald-500/10 border-emerald-500 text-emerald-400"
                              : "bg-slate-900 border-slate-800 text-slate-400"
                          }`}
                        >
                          Normal Success
                        </button>
                        <button
                          type="button"
                          onClick={() => setSimRevertMode("policy")}
                          className={`py-1.5 px-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                            simRevertMode === "policy"
                              ? "bg-amber-500/10 border-amber-500 text-amber-400"
                              : "bg-slate-900 border-slate-800 text-slate-400"
                          }`}
                        >
                          Simulate PolicyForbids Revert
                        </button>
                        <button
                          type="button"
                          onClick={() => setSimRevertMode("paused")}
                          className={`py-1.5 px-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                            simRevertMode === "paused"
                              ? "bg-rose-500/10 border-rose-500 text-rose-400"
                              : "bg-slate-900 border-slate-800 text-slate-400"
                          }`}
                        >
                          Simulate Paused Revert
                        </button>
                      </div>
                    </div>

                    {/* Encoded bytes32 Memo Preview */}
                    <div className="md:col-span-2 p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs font-mono text-slate-400">
                      <span>Encoded Memo (bytes32): <span className="text-emerald-400">{stringToBytes32(payOrderId || "order-42")}</span></span>
                    </div>

                    <div className="md:col-span-2">
                      <button
                        type="submit"
                        disabled={isProcessingPayment}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer disabled:opacity-50"
                        id="btn_pay_with_memo"
                      >
                        {isProcessingPayment ? (
                          <>
                            <Activity className="w-4 h-4 animate-spin" />
                            Transacting on Base & Reading Memo Event...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 text-emerald-200" />
                            Execute Pay with Memo (<code className="font-mono">transferWithMemo</code>)
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Reconciled Payments Table */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col gap-4" id="reconciled_payments_card">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <History className="w-4 h-4 text-emerald-400" />
                        Reconciled Order Payments ({b20Orders.length})
                      </h3>
                      <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
                        Matched via <code className="text-emerald-400 font-bold">parseEventLogs(Memo)</code>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleExportOrdersCSV}
                        disabled={b20Orders.length === 0}
                        className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 disabled:opacity-40 disabled:hover:bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-mono font-bold cursor-pointer transition-all flex items-center gap-1.5 shadow-sm"
                        id="export_b20_orders_csv_btn"
                        title="Download reconciled payment history as CSV"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Export as CSV</span>
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto" id="orders_table_container">
                    <table className="w-full text-left border-collapse" id="orders_table">
                      <thead>
                        <tr className="border-b border-slate-800 text-[10px] text-slate-500 uppercase font-mono bg-slate-950/40">
                          <th className="py-3 px-4 cursor-pointer select-none hover:text-white transition-colors" onClick={() => toggleOrderSort("orderId")} title="Click to sort by Order ID">
                            <div className="flex items-center gap-1.5">
                              <span>Order ID Memo</span>
                              {orderSortField === "orderId" ? (
                                orderSortOrder === "asc" ? <ArrowUp className="w-3.5 h-3.5 text-emerald-400 font-bold" /> : <ArrowDown className="w-3.5 h-3.5 text-emerald-400 font-bold" />
                              ) : (
                                <ArrowUpDown className="w-3.5 h-3.5 opacity-40 hover:opacity-100 transition-opacity" />
                              )}
                            </div>
                          </th>
                          <th className="py-3 px-4 cursor-pointer select-none hover:text-white transition-colors" onClick={() => toggleOrderSort("amount")} title="Click to sort by Amount">
                            <div className="flex items-center gap-1.5">
                              <span>Token & Amount</span>
                              {orderSortField === "amount" ? (
                                orderSortOrder === "asc" ? <ArrowUp className="w-3.5 h-3.5 text-emerald-400 font-bold" /> : <ArrowDown className="w-3.5 h-3.5 text-emerald-400 font-bold" />
                              ) : (
                                <ArrowUpDown className="w-3.5 h-3.5 opacity-40 hover:opacity-100 transition-opacity" />
                              )}
                            </div>
                          </th>
                          <th className="py-3 px-4 cursor-pointer select-none hover:text-white transition-colors" onClick={() => toggleOrderSort("payerAddress")} title="Click to sort by Payer Wallet">
                            <div className="flex items-center gap-1.5">
                              <span>Payer Wallet</span>
                              {orderSortField === "payerAddress" ? (
                                orderSortOrder === "asc" ? <ArrowUp className="w-3.5 h-3.5 text-emerald-400 font-bold" /> : <ArrowDown className="w-3.5 h-3.5 text-emerald-400 font-bold" />
                              ) : (
                                <ArrowUpDown className="w-3.5 h-3.5 opacity-40 hover:opacity-100 transition-opacity" />
                              )}
                            </div>
                          </th>
                          <th className="py-3 px-4">Bytes32 Memo</th>
                          <th className="py-3 px-4 cursor-pointer select-none hover:text-white transition-colors text-center" onClick={() => toggleOrderSort("status")} title="Click to sort by Status">
                            <div className="flex items-center justify-center gap-1.5">
                              <span>Status</span>
                              {orderSortField === "status" ? (
                                orderSortOrder === "asc" ? <ArrowUp className="w-3.5 h-3.5 text-emerald-400 font-bold" /> : <ArrowDown className="w-3.5 h-3.5 text-emerald-400 font-bold" />
                              ) : (
                                <ArrowUpDown className="w-3.5 h-3.5 opacity-40 hover:opacity-100 transition-opacity" />
                              )}
                            </div>
                          </th>
                          <th className="py-3 px-4 cursor-pointer select-none hover:text-white transition-colors text-right" onClick={() => toggleOrderSort("timestamp")} title="Click to sort by Timestamp">
                            <div className="flex items-center justify-end gap-1.5">
                              <span>Timestamp</span>
                              {orderSortField === "timestamp" ? (
                                orderSortOrder === "asc" ? <ArrowUp className="w-3.5 h-3.5 text-emerald-400 font-bold" /> : <ArrowDown className="w-3.5 h-3.5 text-emerald-400 font-bold" />
                              ) : (
                                <ArrowUpDown className="w-3.5 h-3.5 opacity-40 hover:opacity-100 transition-opacity" />
                              )}
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 text-xs font-mono text-slate-300">
                        {sortedB20Orders.map((order) => (
                          <tr key={order.id} className="hover:bg-slate-950/30 transition-all" id={`order_row_${order.id}`}>
                            <td className="py-3 px-4 font-bold text-white">
                              <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded">
                                {order.orderId}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-semibold text-white">
                              {order.amount} ${order.tokenSymbol}
                            </td>
                            <td className="py-3 px-4 text-slate-400 text-[11px]">
                              {order.payerAddress.slice(0, 8)}...{order.payerAddress.slice(-4)}
                            </td>
                            <td className="py-3 px-4 text-[10px] text-slate-500 truncate max-w-[140px]" title={order.memoBytes32}>
                              {order.memoBytes32.slice(0, 14)}...
                            </td>
                            <td className="py-3 px-4 text-center">
                              {order.status === "confirmed" && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full font-bold">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                  Confirmed
                                </span>
                              )}
                              {order.status === "reverted_policy" && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full font-bold" title={order.revertReason}>
                                  <ShieldAlert className="w-3 h-3 text-amber-400" />
                                  PolicyForbids
                                </span>
                              )}
                              {order.status === "reverted_paused" && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded-full font-bold" title={order.revertReason}>
                                  <Lock className="w-3 h-3 text-rose-400" />
                                  Token Paused
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-right text-[10px] text-slate-500">
                              {order.timestamp}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* AIRDROP SUITE TAB CONTENT */}
            {activeTab === "airdrop" && (
              <div className="flex flex-col gap-6" id="airdrop_suite_panel">
                {/* Hero Header Card */}
                <div className="bg-gradient-to-r from-purple-900/40 via-slate-900 to-indigo-900/40 border border-purple-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6" id="airdrop_hero_card">
                  <div className="flex items-start gap-4 z-10">
                    <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-xl text-purple-400 shrink-0">
                      <Gift className="w-7 h-7" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-lg font-bold text-white">Minted Coin Airdrop Suite</h2>
                        <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-mono rounded-full font-bold">
                          Batch Distribution
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                        Airdrop minted BRC-20 coins or Base B20 tokens to holder lists in bulk. Features automatic balance checking, optional memo attachment, and live onchain ledger reconciliation.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setCodeSnippetType("viem_airdrop");
                      setCodeModalOpen(true);
                    }}
                    className="z-10 self-start md:self-auto px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold font-mono flex items-center gap-2 transition-all shadow-lg shadow-purple-500/20 cursor-pointer"
                  >
                    <Code className="w-4 h-4" />
                    <span>View Airdrop Code</span>
                  </button>
                </div>

                {/* Top Metrics Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4" id="airdrop_metrics_grid">
                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col gap-1">
                    <span className="text-[10px] text-slate-400 font-mono">Campaigns Launched</span>
                    <span className="text-lg font-bold text-white font-mono">{airdropCampaigns.length}</span>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col gap-1">
                    <span className="text-[10px] text-slate-400 font-mono">Total Coins Airdropped</span>
                    <span className="text-lg font-bold text-purple-400 font-mono">
                      {airdropCampaigns.reduce((acc, c) => acc + c.totalAmount, 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col gap-1">
                    <span className="text-[10px] text-slate-400 font-mono">Wallets Rewarded</span>
                    <span className="text-lg font-bold text-emerald-400 font-mono">
                      {airdropCampaigns.reduce((acc, c) => acc + c.recipientCount, 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col gap-1">
                    <span className="text-[10px] text-slate-400 font-mono">Eligible Minted Pools</span>
                    <span className="text-lg font-bold text-amber-400 font-mono">
                      {tokens.length + b20Tokens.length} Tokens
                    </span>
                  </div>
                </div>

                {/* Toast Notification */}
                <AnimatePresence>
                  {airdropToast && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`p-4 rounded-xl text-xs font-medium border flex items-center justify-between ${
                        airdropToast.type === "success"
                          ? "bg-emerald-950/80 border-emerald-500/50 text-emerald-200"
                          : "bg-rose-950/80 border-rose-500/50 text-rose-200"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {airdropToast.type === "success" ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                        )}
                        <span>{airdropToast.message}</span>
                      </div>
                      <button
                        onClick={() => setAirdropToast(null)}
                        className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Main 2-Column Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Column: Form (lg:col-span-6) */}
                  <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col gap-5" id="airdrop_form_card">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Send className="w-4 h-4 text-purple-400" />
                        Launch New Airdrop Campaign
                      </h3>
                      <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                        Multi-Wallet Batch
                      </span>
                    </div>

                    <form onSubmit={handleExecuteAirdrop} className="flex flex-col gap-4" id="airdrop_form">
                      {/* Token Standard Toggle */}
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Standard Type</label>
                        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono">
                          <button
                            type="button"
                            onClick={() => {
                              setAirdropTokenType("BRC-20");
                              setAirdropSelectedCoin(tokens[0]?.ticker || "ordi");
                            }}
                            className={`py-2 px-3 rounded-lg font-bold transition-all cursor-pointer ${
                              airdropTokenType === "BRC-20"
                                ? "bg-amber-500 text-slate-950 shadow-md"
                                : "text-slate-400 hover:text-white"
                            }`}
                          >
                            BRC-20 Minted Coins
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setAirdropTokenType("Base B20");
                              setAirdropSelectedCoin(b20Tokens[0]?.symbol || "BCASH");
                            }}
                            className={`py-2 px-3 rounded-lg font-bold transition-all cursor-pointer ${
                              airdropTokenType === "Base B20"
                                ? "bg-blue-600 text-white shadow-md"
                                : "text-slate-400 hover:text-white"
                            }`}
                          >
                            Base B20 Tokens
                          </button>
                        </div>
                      </div>

                      {/* Select Minted Coin Dropdown */}
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">
                          Select {airdropTokenType} Token
                        </label>
                        <select
                          value={airdropSelectedCoin}
                          onChange={(e) => setAirdropSelectedCoin(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-xs text-slate-200 focus:outline-none focus:border-purple-500 font-mono"
                        >
                          {airdropTokenType === "BRC-20"
                            ? tokens.map((t) => (
                                <option key={t.ticker} value={t.ticker}>
                                  ${t.ticker.toUpperCase()} — Minted: {t.minted.toLocaleString()} / Max: {t.totalSupply.toLocaleString()}
                                </option>
                              ))
                            : b20Tokens.map((b) => (
                                <option key={b.symbol} value={b.symbol}>
                                  ${b.symbol} — Supply: {b.currentSupply.toLocaleString()} / Cap: {b.totalSupplyCap.toLocaleString()} {b.paused ? "(PAUSED)" : ""}
                                </option>
                              ))}
                        </select>
                      </div>

                      {/* Token Summary Box */}
                      <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl flex items-center justify-between text-xs font-mono">
                        <span className="text-slate-400">Minted Supply Pool:</span>
                        <span className="text-white font-bold">
                          {airdropTokenType === "BRC-20"
                            ? `${tokens.find((t) => t.ticker === airdropSelectedCoin)?.minted.toLocaleString() || 0} $${airdropSelectedCoin.toUpperCase()}`
                            : `${b20Tokens.find((b) => b.symbol === airdropSelectedCoin)?.currentSupply.toLocaleString() || 0} $${airdropSelectedCoin}`}
                        </span>
                      </div>

                      {/* Recipient Addresses Textarea */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-purple-400" />
                            Recipient Wallet Addresses
                          </label>
                          <span className="text-[10px] font-mono text-slate-500">
                            {airdropRecipientsRaw.split(/[\n,;\s]+/).filter((a) => a.length > 0).length} Detected
                          </span>
                        </div>
                        <textarea
                          rows={4}
                          value={airdropRecipientsRaw}
                          onChange={(e) => setAirdropRecipientsRaw(e.target.value)}
                          placeholder="Paste addresses line-by-line or comma separated (e.g. 0x71C7...976F)"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-purple-500 leading-relaxed"
                        />
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            type="button"
                            onClick={loadSampleRecipients}
                            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-purple-300 rounded-lg text-[11px] font-mono transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <Zap className="w-3 h-3 text-purple-400" />
                            Load 5 Community Wallets
                          </button>
                          <button
                            type="button"
                            onClick={handleCsvImport}
                            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[11px] font-mono transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <Upload className="w-3 h-3 text-slate-400" />
                            Import CSV List
                          </button>
                          {airdropRecipientsRaw && (
                            <button
                              type="button"
                              onClick={() => setAirdropRecipientsRaw("")}
                              className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 text-slate-500 hover:text-slate-300 rounded-lg text-[11px] font-mono transition-all ml-auto cursor-pointer"
                            >
                              Clear
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Amount Per Wallet & Quick Presets */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-medium text-slate-400">Amount Per Wallet</label>
                          <div className="flex gap-1">
                            {[100, 500, 1000, 5000].map((preset) => (
                              <button
                                key={preset}
                                type="button"
                                onClick={() => setAirdropAmountPerWallet(preset)}
                                className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all cursor-pointer ${
                                  airdropAmountPerWallet === preset
                                    ? "bg-purple-600 text-white font-bold"
                                    : "bg-slate-800 text-slate-400 hover:text-white"
                                }`}
                              >
                                {preset}
                              </button>
                            ))}
                          </div>
                        </div>
                        <input
                          type="number"
                          value={airdropAmountPerWallet}
                          onChange={(e) => setAirdropAmountPerWallet(Math.max(1, parseInt(e.target.value) || 0))}
                          min="1"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-purple-500"
                        />
                      </div>

                      {/* Airdrop Memo Tag */}
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">
                          Campaign Memo Tag
                        </label>
                        <input
                          type="text"
                          value={airdropMemo}
                          onChange={(e) => setAirdropMemo(e.target.value)}
                          placeholder="e.g. Genesis Community Season 1 Airdrop"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-purple-500"
                        />
                      </div>

                      {/* Real-time Calculation Summary Box */}
                      {(() => {
                        const recCount = airdropRecipientsRaw.split(/[\n,;\s]+/).filter((a) => a.length > 0).length;
                        const reqTotal = recCount * airdropAmountPerWallet;
                        return (
                          <div className="p-3 bg-purple-950/20 border border-purple-500/30 rounded-xl flex items-center justify-between text-xs font-mono">
                            <div>
                              <span className="text-slate-400 block text-[10px]">Total Airdrop Requirement:</span>
                              <span className="text-purple-300 font-bold text-sm">
                                {reqTotal.toLocaleString()} ${airdropSelectedCoin.toUpperCase()}
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="text-slate-400 block text-[10px]">Recipients:</span>
                              <span className="text-white font-bold">{recCount} Wallets</span>
                            </div>
                          </div>
                        );
                      })()}

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isExecutingAirdrop}
                        className="w-full mt-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 transition-all cursor-pointer disabled:opacity-50"
                        id="btn_execute_airdrop"
                      >
                        {isExecutingAirdrop ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            <span>
                              {airdropStep === 1 && "Validating wallets & supply pool..."}
                              {airdropStep === 2 && "Signing batch transaction memos..."}
                              {airdropStep === 3 && "Broadcasting onchain transfers..."}
                            </span>
                          </>
                        ) : (
                          <>
                            <Gift className="w-4 h-4" />
                            <span>Broadcast Minted Coin Airdrop</span>
                          </>
                        )}
                      </button>
                    </form>
                  </div>

                  {/* Right Column: Campaign History Table (lg:col-span-6) */}
                  <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col gap-4" id="airdrop_history_card">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <History className="w-4 h-4 text-purple-400" />
                        Campaign History & Ledger Logs ({airdropCampaigns.length})
                      </h3>
                      <button
                        onClick={() => {
                          const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(airdropCampaigns, null, 2));
                          const downloadAnchor = document.createElement("a");
                          downloadAnchor.setAttribute("href", dataStr);
                          downloadAnchor.setAttribute("download", `airdrop_campaigns_${Date.now()}.json`);
                          document.body.appendChild(downloadAnchor);
                          downloadAnchor.click();
                          downloadAnchor.remove();
                        }}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[11px] font-mono transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <Download className="w-3 h-3 text-purple-400" />
                        Export JSON
                      </button>
                    </div>

                    <div className="overflow-x-auto" id="airdrop_history_table_container">
                      <table className="w-full text-left border-collapse" id="airdrop_history_table">
                        <thead>
                          <tr className="border-b border-slate-800 text-[10px] text-slate-500 uppercase font-mono bg-slate-950/40">
                            <th className="py-3 px-3">Coin & Type</th>
                            <th className="py-3 px-3">Total Airdropped</th>
                            <th className="py-3 px-3">Recipients</th>
                            <th className="py-3 px-3">Memo Tag</th>
                            <th className="py-3 px-3 text-center">Status</th>
                            <th className="py-3 px-3 text-right">Timestamp</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 text-xs font-mono text-slate-300">
                          {airdropCampaigns.map((campaign) => (
                            <tr key={campaign.id} className="hover:bg-slate-950/30 transition-all">
                              <td className="py-3 px-3">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-bold text-white">${campaign.tickerOrSymbol.toUpperCase()}</span>
                                  <span className={`px-1.5 py-0.2 text-[9px] rounded font-bold border ${
                                    campaign.tokenType === "BRC-20"
                                      ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                      : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                  }`}>
                                    {campaign.tokenType}
                                  </span>
                                </div>
                              </td>
                              <td className="py-3 px-3 font-semibold text-purple-300">
                                {campaign.totalAmount.toLocaleString()}
                              </td>
                              <td className="py-3 px-3 text-slate-400">
                                {campaign.recipientCount} wallets ({campaign.perRecipientAmount}/ea)
                              </td>
                              <td className="py-3 px-3 text-slate-400 text-[11px] truncate max-w-[120px]" title={campaign.memo}>
                                {campaign.memo}
                              </td>
                              <td className="py-3 px-3 text-center">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full font-bold">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                  Confirmed
                                </span>
                              </td>
                              <td className="py-3 px-3 text-right text-[10px] text-slate-500">
                                {campaign.timestamp}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 7. BASE NOTIFICATIONS TAB */}
            {activeTab === "notifications" && (
              <div className="flex flex-col gap-6" id="base_notifications_tab_content">
                {/* Notification Toast Alert */}
                {notifToast && (
                  <div
                    className={`p-4 rounded-xl border text-xs font-mono flex items-center justify-between ${
                      notifToast.type === "success"
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                        : "bg-rose-500/10 border-rose-500/30 text-rose-300"
                    }`}
                    id="notif_toast_alert"
                  >
                    <span>{notifToast.message}</span>
                    <button
                      onClick={() => setNotifToast(null)}
                      className="text-slate-400 hover:text-white"
                      id="close_notif_toast_btn"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Top Console Header Card */}
                <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden" id="notif_console_header">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-400 shadow-inner">
                        <Bell className="w-8 h-8" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-xl font-bold text-white tracking-tight">Base App Notifications Center</h2>
                          <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded text-[10px] font-mono font-bold">
                            REST API v1
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                          Dispatch native in-app notifications to Base App users who have saved/pinned your mini app. Receive instant user engagement when airdrops drop, payments resolve, or tokens mint!
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-xs font-mono">
                      <Zap className="w-4 h-4 text-amber-400" />
                      <div className="flex flex-col">
                        <span className="text-slate-400 text-[10px]">API Rate Limit</span>
                        <span className="text-amber-300 font-bold">20 req/min per IP</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* API Credentials & Settings Panel */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-4 shadow-xl" id="notif_credentials_card">
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                    <Megaphone className="w-4 h-4 text-amber-400" />
                    <h3 className="font-semibold text-white text-sm">Base Dashboard Project Credentials</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                    <div className="flex flex-col gap-1.5" id="notif_app_url_container">
                      <label className="text-slate-400 text-[11px] font-medium flex items-center justify-between">
                        <span>App URL (Registered in Base Dashboard)</span>
                        <span className="text-[10px] text-amber-400/80">app_url</span>
                      </label>
                      <input
                        type="text"
                        value={notifAppUrl}
                        onChange={(e) => setNotifAppUrl(e.target.value)}
                        placeholder="https://your-app.com"
                        className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                        id="notif_app_url_input"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5" id="notif_api_key_container">
                      <label className="text-slate-400 text-[11px] font-medium flex items-center justify-between">
                        <span>Base Dashboard API Key (x-api-key)</span>
                        <span className="text-[10px] text-slate-500">Optional (Simulates if empty)</span>
                      </label>
                      <input
                        type="password"
                        value={notifApiKey}
                        onChange={(e) => setNotifApiKey(e.target.value)}
                        placeholder="Paste BASE_DASHBOARD_API_KEY..."
                        className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-amber-300 focus:outline-none focus:border-amber-500"
                        id="notif_api_key_input"
                      />
                    </div>
                  </div>
                </div>

                {/* 3 Main Action Columns / Grids */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="notif_actions_grid">
                  {/* Panel 1: Dispatch Notification Form */}
                  <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-4 shadow-xl" id="notif_dispatch_form_card">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2">
                        <Send className="w-4 h-4 text-amber-400" />
                        <h3 className="font-semibold text-white text-sm">Send In-App Push Notification</h3>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded font-bold">
                        POST /v1/notifications/send
                      </span>
                    </div>

                    <div className="flex flex-col gap-4 text-xs font-mono">
                      {/* Title input */}
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-slate-400 text-[11px]">
                          <label className="font-medium">Notification Title</label>
                          <span className={`${notifTitle.length > 30 ? "text-rose-400 font-bold" : "text-slate-500"}`}>
                            {notifTitle.length}/30 chars
                          </span>
                        </div>
                        <input
                          type="text"
                          maxLength={30}
                          value={notifTitle}
                          onChange={(e) => setNotifTitle(e.target.value)}
                          placeholder="e.g. 🎉 Airdrop Received!"
                          className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-semibold focus:outline-none focus:border-amber-500"
                          id="notif_title_input"
                        />
                      </div>

                      {/* Message input */}
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-slate-400 text-[11px]">
                          <label className="font-medium">Notification Message Body</label>
                          <span className={`${notifMessage.length > 200 ? "text-rose-400 font-bold" : "text-slate-500"}`}>
                            {notifMessage.length}/200 chars
                          </span>
                        </div>
                        <textarea
                          rows={3}
                          maxLength={200}
                          value={notifMessage}
                          onChange={(e) => setNotifMessage(e.target.value)}
                          placeholder="e.g. You have received 1,000 $BASE B20 tokens in your Base App wallet."
                          className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-amber-500 resize-none"
                          id="notif_message_input"
                        />
                      </div>

                      {/* Target Path */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-slate-400 text-[11px] font-medium flex items-center justify-between">
                          <span>Target App Route Path (opens on tap)</span>
                          <span className="text-[10px] text-slate-500">e.g. /airdrop, /ledger</span>
                        </label>
                        <input
                          type="text"
                          value={notifTargetPath}
                          onChange={(e) => setNotifTargetPath(e.target.value)}
                          placeholder="/airdrop"
                          className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 focus:outline-none focus:border-amber-500"
                          id="notif_target_path_input"
                        />
                      </div>

                      {/* Recipient Addresses */}
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-slate-400 text-[11px]">
                          <label className="font-medium">Target Wallet Addresses (comma or line separated)</label>
                          <button
                            type="button"
                            onClick={() => {
                              const unique = Array.from(new Set(["0x71C7656EC7ab88b098defB751B7401B5f6d8976F", "0x324082901a87b9c0214a1f9028a019e840129bc2", "0x892a014920194b0291a0293019a820391092a01f"]));
                              setNotifRecipients(unique.join("\n"));
                            }}
                            className="text-amber-400 hover:underline cursor-pointer"
                            id="autofill_notif_addrs_btn"
                          >
                            + Autofill Sample Addresses
                          </button>
                        </div>
                        <textarea
                          rows={3}
                          value={notifRecipients}
                          onChange={(e) => setNotifRecipients(e.target.value)}
                          placeholder="0x71C7656EC7ab88b098defB751B7401B5f6d8976F..."
                          className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-300 focus:outline-none focus:border-amber-500 resize-none text-[11px]"
                          id="notif_recipients_input"
                        />
                      </div>

                      {/* Send Button */}
                      <button
                        onClick={handleSendNotification}
                        disabled={notifSending}
                        className="mt-2 w-full py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-xs font-mono transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer"
                        id="dispatch_notif_submit_btn"
                      >
                        {notifSending ? (
                          <>
                            <Activity className="w-4 h-4 animate-spin" />
                            Dispatching Notification via Base API...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            Dispatch Base App Push Notification
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Panel 2: User Status & Audience Tools */}
                  <div className="flex flex-col gap-6" id="notif_secondary_tools_col">
                    {/* Check Single User Status Card */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-3 shadow-xl" id="notif_user_status_card">
                      <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
                        <Users className="w-4 h-4 text-amber-400" />
                        <h3 className="font-semibold text-white text-sm">Check User Opt-In Status</h3>
                      </div>
                      <p className="text-[11px] text-slate-400 font-mono">
                        Verify if a single wallet has pinned your app and enabled notifications.
                      </p>

                      <div className="flex flex-col gap-2 font-mono text-xs">
                        <input
                          type="text"
                          value={notifCheckAddr}
                          onChange={(e) => setNotifCheckAddr(e.target.value)}
                          placeholder="0x..."
                          className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 text-xs focus:outline-none focus:border-amber-500"
                          id="check_user_status_addr_input"
                        />
                        <button
                          onClick={handleCheckUserNotifStatus}
                          disabled={notifCheckingStatus}
                          className="py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-mono font-bold transition-all border border-slate-700 cursor-pointer flex items-center justify-center gap-2"
                          id="check_user_status_btn"
                        >
                          {notifCheckingStatus ? (
                            <Activity className="w-3.5 h-3.5 animate-spin text-amber-400" />
                          ) : (
                            "Check Wallet Status"
                          )}
                        </button>
                      </div>

                      {/* Status Result Display */}
                      {notifStatusResult && (
                        <div className="mt-2 p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono flex flex-col gap-2" id="user_status_result_box">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400">App Pinned:</span>
                            <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                              notifStatusResult.appPinned
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                                : "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                            }`}>
                              {notifStatusResult.appPinned ? "YES (Saved)" : "NO"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400">Notifications Enabled:</span>
                            <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                              notifStatusResult.notificationsEnabled
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                                : "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                            }`}>
                              {notifStatusResult.notificationsEnabled ? "ACTIVE 🔔" : "DISABLED"}
                            </span>
                          </div>
                          {Boolean(notifStatusResult.simulated) && (
                            <span className="text-[10px] text-amber-400/80 italic mt-1">
                              * Simulated response (configure API Key for live checks)
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Audience List Fetcher Card */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-3 shadow-xl" id="notif_audience_card">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                        <div className="flex items-center gap-2">
                          <Database className="w-4 h-4 text-amber-400" />
                          <h3 className="font-semibold text-white text-sm">Audience Opt-In List</h3>
                        </div>
                        <button
                          onClick={handleFetchNotifAudience}
                          disabled={notifFetchingAudience}
                          className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded text-[10px] font-mono font-bold cursor-pointer transition-all flex items-center gap-1"
                          id="fetch_audience_btn"
                        >
                          {notifFetchingAudience ? <Activity className="w-3 h-3 animate-spin" /> : "Fetch List"}
                        </button>
                      </div>

                      {notifAudienceList === null ? (
                        <p className="text-[11px] text-slate-500 font-mono py-2">
                          Click &quot;Fetch List&quot; to retrieve all wallet addresses opted in for push alerts.
                        </p>
                      ) : notifAudienceList.length === 0 ? (
                        <p className="text-[11px] text-slate-400 font-mono py-2">
                          No users found. Ensure users have pinned your mini app.
                        </p>
                      ) : (
                        <div className="flex flex-col gap-1.5 max-h-40 overflow-y-auto pr-1 text-[11px] font-mono" id="audience_list_container">
                          {notifAudienceList.map((user, idx) => (
                            <div key={idx} className="p-2 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between text-slate-300">
                              <span className="truncate max-w-[150px]">{user.address}</span>
                              <span className="text-[9px] px-1.5 py-0.2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded font-bold">
                                Enabled
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Dispatch Logs Table */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl" id="notif_logs_card">
                  <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between" id="notif_logs_header">
                    <div className="flex items-center gap-2">
                      <History className="w-5 h-5 text-amber-500" />
                      <h3 className="font-semibold text-white">Base App Push Notification History</h3>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-950 text-slate-400 border border-slate-800 rounded">
                      Total Dispatched: {notifLogs.length}
                    </span>
                  </div>

                  <div className="overflow-x-auto" id="notif_logs_table_container">
                    {notifLogs.length === 0 ? (
                      <div className="py-10 text-center text-slate-500 text-xs font-mono" id="no_notif_logs">
                        No notifications sent yet in this session. Dispatch your first broadcast above!
                      </div>
                    ) : (
                      <table className="w-full text-left border-collapse" id="notif_logs_table">
                        <thead>
                          <tr className="border-b border-slate-800 text-[10px] text-slate-400 uppercase font-mono bg-slate-950/40">
                            <th className="py-3 px-6">Timestamp</th>
                            <th className="py-3 px-6">Title & Message</th>
                            <th className="py-3 px-6">Target Route</th>
                            <th className="py-3 px-6 text-center">Audience Delivered</th>
                            <th className="py-3 px-6 text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 text-xs font-mono text-slate-300">
                          {notifLogs.map((log) => (
                            <tr key={log.id} className="hover:bg-slate-950/30 transition-all">
                              <td className="py-3 px-6 text-slate-400 text-[11px] whitespace-nowrap">{log.timestamp}</td>
                              <td className="py-3 px-6">
                                <div className="flex flex-col">
                                  <span className="font-bold text-amber-300">{log.title}</span>
                                  <span className="text-[11px] text-slate-400 line-clamp-1">{log.message}</span>
                                </div>
                              </td>
                              <td className="py-3 px-6 text-slate-400 font-mono text-[11px]">{log.targetPath}</td>
                              <td className="py-3 px-6 text-center font-bold text-white">
                                {log.sentCount} wallet(s)
                              </td>
                              <td className="py-3 px-6 text-right">
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] rounded-full font-bold border ${
                                  log.simulated
                                    ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                                    : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                                }`}>
                                  <CheckCircle2 className="w-3 h-3" />
                                  {log.simulated ? "Simulated API" : "Delivered"}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Base L2 Swap & Trading Desk Tab */}
            {activeTab === "base_trading" && (
              <div className="flex flex-col gap-6" id="base_trading_container">
                {/* Header Banner */}
                <div className="bg-gradient-to-br from-blue-950/80 via-slate-900 to-cyan-950/80 border border-cyan-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden" id="base_trading_header">
                  <div className="absolute top-0 right-0 -mt-6 -mr-6 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <span className="p-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-slate-950 font-bold rounded-xl shadow-lg">
                          <Zap className="w-5 h-5 text-white" />
                        </span>
                        <div>
                          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                            Base L2 Onchain Trading Desk & AMM Swap
                            <span className="text-[10px] px-2 py-0.5 bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded-full font-mono font-bold uppercase">
                              Base Mainnet (8453)
                            </span>
                          </h2>
                          <p className="text-xs text-slate-300 font-mono mt-0.5">
                            Instant Token Swaps • Aerodrome & Base Swap Routers • Gasless Paymaster (EIP-5792)
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="p-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-left font-mono">
                        <div className="text-[10px] text-slate-400 uppercase">Base L2 Gas Price</div>
                        <div className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                          <Zap className="w-3.5 h-3.5 text-cyan-400" />
                          0.002 gwei (~$0.0001)
                        </div>
                      </div>
                      <div className="p-2.5 bg-slate-950/80 border border-cyan-500/30 rounded-xl text-left font-mono">
                        <div className="text-[10px] text-cyan-400/80 uppercase">Base Paymaster</div>
                        <div className="text-xs font-bold text-cyan-300 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                          100% Free Sponsored
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sub Navigation Bar */}
                  <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto" id="trading_subtabs">
                    <button
                      onClick={() => setTradingSubTab("swap")}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                        tradingSubTab === "swap"
                          ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                          : "bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800"
                      }`}
                      id="subtab_swap"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      Swap Desk
                    </button>
                    <button
                      onClick={() => setTradingSubTab("limit")}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                        tradingSubTab === "limit"
                          ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                          : "bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800"
                      }`}
                      id="subtab_limit"
                    >
                      <ArrowUpDown className="w-3.5 h-3.5" />
                      Limit Orders ({tradingLimitOrders.filter((o) => o.status === "Open").length})
                    </button>
                    <button
                      onClick={() => setTradingSubTab("orderbook")}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                        tradingSubTab === "orderbook"
                          ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                          : "bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800"
                      }`}
                      id="subtab_orderbook"
                    >
                      <Grid className="w-3.5 h-3.5" />
                      Live Orderbook
                    </button>
                    <button
                      onClick={() => setTradingSubTab("chart")}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                        tradingSubTab === "chart"
                          ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                          : "bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800"
                      }`}
                      id="subtab_chart"
                    >
                      <TrendingUp className="w-3.5 h-3.5" />
                      Pair Analytics & Chart
                    </button>
                    <button
                      onClick={() => setTradingSubTab("wallet")}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                        tradingSubTab === "wallet"
                          ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                          : "bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800"
                      }`}
                      id="subtab_wallet"
                    >
                      <Wallet className="w-3.5 h-3.5" />
                      Smart Wallet & Paymaster
                    </button>
                  </div>
                </div>

                {/* Toast Notification */}
                {tradeToast && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-3.5 rounded-xl text-xs font-mono font-semibold flex items-center justify-between border shadow-xl ${
                      tradeToast.type === "success"
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                        : "bg-rose-500/10 border-rose-500/30 text-rose-300"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{tradeToast.message}</span>
                    </div>
                    {tradeTxHash && (
                      <button
                        onClick={() => {
                          const castText = `Just swapped on Base L2! Check out my txn: https://basescan.org/tx/${tradeTxHash}`;
                          window.open(`https://warpcast.com/~/compose?text=${encodeURIComponent(castText)}`, "_blank");
                        }}
                        className="px-2.5 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 rounded text-[10px] flex items-center gap-1 cursor-pointer"
                      >
                        <Share2 className="w-3 h-3" />
                        Share to Base Feed
                      </button>
                    )}
                  </motion.div>
                )}

                {/* Sub Tab Content 1: Swap Desk */}
                {tradingSubTab === "swap" && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="swap_desk_view">
                    {/* Swap Form Card (lg:col-span-5) */}
                    <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col gap-4" id="swap_form_card">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-cyan-400" />
                          <h3 className="font-bold text-white text-sm">Base Instant AMM Router</h3>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded">
                          Slippage: {tradingSlippage}%
                        </div>
                      </div>

                      {/* Pay Token Section */}
                      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col gap-2" id="pay_token_box">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span>You Pay</span>
                          <span className="font-mono">
                            Balance: 0.45 ETH (${(0.45 * (BASE_TOKEN_PRICES[tradingPayToken]?.usd || 3250)).toLocaleString()})
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <input
                            type="number"
                            value={tradingPayAmount}
                            onChange={(e) => setTradingPayAmount(e.target.value)}
                            className="w-full bg-transparent text-2xl font-mono font-bold text-white focus:outline-none"
                            placeholder="0.00"
                            id="pay_amount_input"
                          />
                          <select
                            value={tradingPayToken}
                            onChange={(e) => setTradingPayToken(e.target.value)}
                            className="bg-slate-900 border border-slate-700 text-white font-mono font-bold text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500 cursor-pointer shrink-0"
                            id="pay_token_select"
                          >
                            {Object.keys(BASE_TOKEN_PRICES).map((tok) => (
                              <option key={tok} value={tok}>
                                {BASE_TOKEN_PRICES[tok].icon} {tok}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-[10px] font-mono text-slate-500">
                          <span>≈ ${(parseFloat(tradingPayAmount || "0") * (BASE_TOKEN_PRICES[tradingPayToken]?.usd || 1)).toLocaleString()} USD</span>
                          <div className="flex items-center gap-1">
                            {["0.01", "0.05", "0.1", "0.5"].map((preset) => (
                              <button
                                key={preset}
                                onClick={() => setTradingPayAmount(preset)}
                                className="px-1.5 py-0.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded border border-slate-800 cursor-pointer"
                              >
                                {preset}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Swap Direction Reverse Button */}
                      <div className="flex justify-center -my-2 relative z-10">
                        <button
                          onClick={() => {
                            const temp = tradingPayToken;
                            setTradingPayToken(tradingReceiveToken);
                            setTradingReceiveToken(temp);
                          }}
                          className="p-2.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 rounded-full shadow-lg transition-all transform hover:rotate-180 cursor-pointer"
                          title="Reverse Swap Direction"
                          id="reverse_swap_btn"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Receive Token Section */}
                      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col gap-2" id="receive_token_box">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span>You Receive (Estimated)</span>
                          <span className="font-mono">
                            Rate: 1 {tradingPayToken} = {(
                              (BASE_TOKEN_PRICES[tradingPayToken]?.usd || 1) / (BASE_TOKEN_PRICES[tradingReceiveToken]?.usd || 1)
                            ).toLocaleString()} {tradingReceiveToken}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-full text-2xl font-mono font-bold text-cyan-300 truncate">
                            {(
                              (parseFloat(tradingPayAmount || "0") * (BASE_TOKEN_PRICES[tradingPayToken]?.usd || 1)) /
                              (BASE_TOKEN_PRICES[tradingReceiveToken]?.usd || 1)
                            ).toLocaleString(undefined, { maximumFractionDigits: 6 })}
                          </div>
                          <select
                            value={tradingReceiveToken}
                            onChange={(e) => setTradingReceiveToken(e.target.value)}
                            className="bg-slate-900 border border-slate-700 text-white font-mono font-bold text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500 cursor-pointer shrink-0"
                            id="receive_token_select"
                          >
                            {Object.keys(BASE_TOKEN_PRICES).map((tok) => (
                              <option key={tok} value={tok}>
                                {BASE_TOKEN_PRICES[tok].icon} {tok}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-[10px] font-mono text-slate-500">
                          <span>
                            ≈ ${(
                              parseFloat(tradingPayAmount || "0") * (BASE_TOKEN_PRICES[tradingPayToken]?.usd || 1)
                            ).toLocaleString()} USD
                          </span>
                          <span className="text-emerald-400">Price Impact &lt; 0.05%</span>
                        </div>
                      </div>

                      {/* Base Paymaster Gas Sponsor Toggle */}
                      <div className="p-3 bg-cyan-950/30 border border-cyan-500/20 rounded-xl flex items-center justify-between" id="paymaster_toggle_box">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-white">Base Paymaster Gasless Trade</span>
                            <span className="text-[10px] text-slate-400 font-mono">EIP-5792 Sponsored (0 ETH gas fee)</span>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={tradingUsePaymaster}
                          onChange={(e) => setTradingUsePaymaster(e.target.checked)}
                          className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
                          id="chk_use_paymaster"
                        />
                      </div>

                      {/* Execution Progress Stepper */}
                      {isExecutingTrade && (
                        <div className="p-3.5 bg-slate-950 border border-cyan-500/40 rounded-xl flex flex-col gap-2 font-mono text-xs" id="trade_stepper">
                          <div className="flex items-center justify-between text-cyan-300 font-bold">
                            <span>Executing Base L2 Swap...</span>
                            <span>Step {tradeStep}/4</span>
                          </div>
                          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <motion.div
                              className="bg-cyan-400 h-full"
                              initial={{ width: "0%" }}
                              animate={{ width: `${(tradeStep / 4) * 100}%` }}
                            />
                          </div>
                          <p className="text-[10px] text-slate-400">
                            {tradeStep === 1 && "🔍 Step 1: Querying Aerodrome & Base Swap AMM pools..."}
                            {tradeStep === 2 && "✍️ Step 2: Requesting EIP-712 Smart Wallet authorization..."}
                            {tradeStep === 3 && "🚀 Step 3: Submitting user call bundle to Base Paymaster..."}
                            {tradeStep === 4 && "✅ Step 4: Transaction confirmed in Base block!"}
                          </p>
                        </div>
                      )}

                      {/* Swap Button */}
                      <button
                        onClick={() => handleExecuteSwap()}
                        disabled={isExecutingTrade}
                        className="w-full py-3.5 bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                        id="btn_execute_swap"
                      >
                        {isExecutingTrade ? (
                          <>
                            <Activity className="w-4 h-4 animate-spin" />
                            Swapping on Base L2...
                          </>
                        ) : (
                          <>
                            <Zap className="w-4 h-4" />
                            Swap {tradingPayToken} for {tradingReceiveToken} (Base L2)
                          </>
                        )}
                      </button>
                    </div>

                    {/* Trade History & Live Activity (lg:col-span-7) */}
                    <div className="lg:col-span-7 flex flex-col gap-4" id="swap_history_panel">
                      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <History className="w-4 h-4 text-cyan-400" />
                            <h3 className="font-bold text-white text-sm">Recent Base Swaps</h3>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                            Total Swaps: {tradingHistory.length}
                          </span>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse" id="swap_history_table">
                            <thead>
                              <tr className="border-b border-slate-800 text-[10px] text-slate-400 uppercase font-mono bg-slate-950/40">
                                <th className="py-3 px-4">Timestamp</th>
                                <th className="py-3 px-4">Pay & Receive</th>
                                <th className="py-3 px-4">Route</th>
                                <th className="py-3 px-4 text-right">Gas</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/60 text-xs font-mono text-slate-300">
                              {tradingHistory.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-950/30 transition-all">
                                  <td className="py-3 px-4 text-[11px] text-slate-400 whitespace-nowrap">{item.timestamp}</td>
                                  <td className="py-3 px-4">
                                    <div className="flex flex-col">
                                      <span className="font-bold text-white">
                                        {item.payAmount} {item.payToken} → {item.receiveAmount.toLocaleString()} {item.receiveToken}
                                      </span>
                                      <span className="text-[10px] text-slate-500">
                                        Rate: 1 {item.payToken} = {item.rate.toLocaleString()} {item.receiveToken}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="py-3 px-4 text-[11px] text-slate-400 line-clamp-1">{item.route}</td>
                                  <td className="py-3 px-4 text-right">
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded font-bold">
                                      Free (Paymaster)
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Sub Tab Content 2: Limit Orders */}
                {tradingSubTab === "limit" && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="limit_orders_view">
                    <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col gap-4">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <h3 className="font-bold text-white text-sm flex items-center gap-2">
                          <ArrowUpDown className="w-4 h-4 text-cyan-400" />
                          Place Base Limit Order
                        </h3>
                        <div className="flex items-center p-0.5 bg-slate-950 rounded-lg border border-slate-800">
                          <button
                            onClick={() => setTradingLimitSide("buy")}
                            className={`px-3 py-1 rounded text-xs font-bold font-mono transition-all ${
                              tradingLimitSide === "buy" ? "bg-emerald-500 text-slate-950" : "text-slate-400"
                            }`}
                          >
                            BUY
                          </button>
                          <button
                            onClick={() => setTradingLimitSide("sell")}
                            className={`px-3 py-1 rounded text-xs font-bold font-mono transition-all ${
                              tradingLimitSide === "sell" ? "bg-rose-500 text-white" : "text-slate-400"
                            }`}
                          >
                            SELL
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 font-mono text-xs">
                        <div>
                          <label className="text-slate-400 text-[10px] uppercase block mb-1">Select Token</label>
                          <select
                            value={tradingReceiveToken}
                            onChange={(e) => setTradingReceiveToken(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded-xl focus:outline-none focus:border-cyan-500 font-bold"
                          >
                            {Object.keys(BASE_TOKEN_PRICES).map((tok) => (
                              <option key={tok} value={tok}>
                                {BASE_TOKEN_PRICES[tok].name} (${tok})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="text-slate-400 text-[10px] uppercase block mb-1">Target Price (in ETH)</label>
                          <input
                            type="number"
                            value={tradingLimitPrice}
                            onChange={(e) => setTradingLimitPrice(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded-xl font-bold focus:outline-none focus:border-cyan-500"
                            placeholder="0.0085"
                          />
                        </div>

                        <div>
                          <label className="text-slate-400 text-[10px] uppercase block mb-1">Amount</label>
                          <input
                            type="number"
                            value={tradingLimitAmount}
                            onChange={(e) => setTradingLimitAmount(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded-xl font-bold focus:outline-none focus:border-cyan-500"
                            placeholder="100"
                          />
                        </div>

                        <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                          <span className="text-slate-400">Total Order Value:</span>
                          <span className="font-bold text-cyan-300">
                            {(parseFloat(tradingLimitAmount || "0") * parseFloat(tradingLimitPrice || "0")).toFixed(4)} ETH
                          </span>
                        </div>

                        <button
                          onClick={handlePlaceLimitOrder}
                          className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold rounded-xl transition-all cursor-pointer shadow-lg shadow-cyan-500/20"
                        >
                          Submit Limit Order on Base
                        </button>
                      </div>
                    </div>

                    <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                      <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
                        <h3 className="font-bold text-white text-sm">Active Limit Orders</h3>
                        <span className="text-xs font-mono text-slate-400">Total: {tradingLimitOrders.length}</span>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse" id="limit_orders_table">
                          <thead>
                            <tr className="border-b border-slate-800 text-[10px] text-slate-400 uppercase font-mono bg-slate-950/40">
                              <th className="py-3 px-4">Side & Token</th>
                              <th className="py-3 px-4">Target Price</th>
                              <th className="py-3 px-4">Amount</th>
                              <th className="py-3 px-4">Status</th>
                              <th className="py-3 px-4 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/60 text-xs font-mono text-slate-300">
                            {tradingLimitOrders.map((ord) => (
                              <tr key={ord.id} className="hover:bg-slate-950/30">
                                <td className="py-3 px-4">
                                  <span
                                    className={`px-2 py-0.5 rounded font-bold text-[10px] uppercase mr-2 ${
                                      ord.side === "buy" ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"
                                    }`}
                                  >
                                    {ord.side}
                                  </span>
                                  <span className="font-bold text-white">{ord.token}</span>
                                </td>
                                <td className="py-3 px-4">{ord.targetPriceEth} ETH</td>
                                <td className="py-3 px-4">{ord.amount.toLocaleString()}</td>
                                <td className="py-3 px-4">
                                  <span className="text-cyan-400 font-bold">{ord.status}</span>
                                </td>
                                <td className="py-3 px-4 text-right">
                                  <button
                                    onClick={() => handleCancelLimitOrder(ord.id)}
                                    className="px-2 py-1 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 rounded text-[10px] cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* Sub Tab Content 3: Live Orderbook */}
                {tradingSubTab === "orderbook" && (
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col gap-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2">
                        <Grid className="w-4 h-4 text-cyan-400" />
                        <h3 className="font-bold text-white text-sm">Real-time Base Orderbook Depth</h3>
                      </div>
                      <span className="text-xs font-mono text-emerald-400">Live Spread: 0.02%</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
                      {/* Asks (Sells) */}
                      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                        <h4 className="text-rose-400 font-bold mb-3 text-xs uppercase flex items-center justify-between">
                          <span>Asks (Sell Orders)</span>
                          <span>Price (ETH)</span>
                        </h4>
                        <div className="flex flex-col gap-1.5">
                          {[
                            { price: 0.00892, qty: 1520, fill: 80 },
                            { price: 0.00888, qty: 940, fill: 50 },
                            { price: 0.00885, qty: 450, fill: 25 }
                          ].map((ask, idx) => (
                            <div key={idx} className="relative p-2 rounded bg-rose-500/5 flex items-center justify-between">
                              <div className="absolute left-0 top-0 bottom-0 bg-rose-500/10 rounded" style={{ width: `${ask.fill}%` }} />
                              <span className="text-slate-300 relative z-10">{ask.qty} $bORDI</span>
                              <span className="text-rose-400 font-bold relative z-10">{ask.price}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Bids (Buys) */}
                      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                        <h4 className="text-emerald-400 font-bold mb-3 text-xs uppercase flex items-center justify-between">
                          <span>Bids (Buy Orders)</span>
                          <span>Price (ETH)</span>
                        </h4>
                        <div className="flex flex-col gap-1.5">
                          {[
                            { price: 0.00875, qty: 850, fill: 40 },
                            { price: 0.00870, qty: 1890, fill: 90 },
                            { price: 0.00865, qty: 2400, fill: 100 }
                          ].map((bid, idx) => (
                            <div key={idx} className="relative p-2 rounded bg-emerald-500/5 flex items-center justify-between">
                              <div className="absolute right-0 top-0 bottom-0 bg-emerald-500/10 rounded" style={{ width: `${bid.fill}%` }} />
                              <span className="text-emerald-400 font-bold relative z-10">{bid.price}</span>
                              <span className="text-slate-300 relative z-10">{bid.qty} $bORDI</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Sub Tab Content 4: Pair Chart */}
                {tradingSubTab === "chart" && (
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col gap-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-cyan-400" />
                        <h3 className="font-bold text-white text-sm">bORDI / ETH 24h Price Action</h3>
                      </div>
                      <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
                        <span>24h High: $31.20</span>
                        <span>24h Low: $26.40</span>
                        <span className="text-emerald-400 font-bold">+8.4%</span>
                      </div>
                    </div>
                    <div className="h-64 w-full bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center justify-center">
                      <Sparkline data={[{ value: 26.4 }, { value: 27.1 }, { value: 26.8 }, { value: 28.5 }, { value: 29.2 }, { value: 31.2 }]} color="#06b6d4" />
                    </div>
                  </div>
                )}

                {/* Sub Tab Content 5: Smart Wallet & Paymaster */}
                {tradingSubTab === "wallet" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col gap-4">
                      <h3 className="font-bold text-white text-sm flex items-center gap-2 border-b border-slate-800 pb-3">
                        <Wallet className="w-4 h-4 text-cyan-400" />
                        Base Smart Wallet Status
                      </h3>
                      <div className="flex flex-col gap-2 font-mono text-xs">
                        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between">
                          <span className="text-slate-400">Custody Address:</span>
                          <span className="text-cyan-300 font-bold truncate max-w-[180px]">
                            {farcasterUser?.custodyAddress || "0x71C7656EC7ab88b098defB751B7401B5f6d8976F"}
                          </span>
                        </div>
                        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between">
                          <span className="text-slate-400">Connected FID:</span>
                          <span className="text-white font-bold">{farcasterUser?.fid || 9152}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col gap-4">
                      <h3 className="font-bold text-white text-sm flex items-center gap-2 border-b border-slate-800 pb-3">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                        Base Paymaster Gas Credits
                      </h3>
                      <div className="p-4 bg-cyan-950/40 border border-cyan-500/30 rounded-xl flex flex-col gap-2 font-mono text-xs">
                        <div className="flex justify-between items-center text-cyan-300 font-bold">
                          <span>Free Sponsored Txns Remaining:</span>
                          <span className="text-sm">100 / 100</span>
                        </div>
                        <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                          <div className="bg-cyan-400 h-full w-full" />
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">
                          Total Gas Fees Saved on Base L2: <span className="text-emerald-400 font-bold">0.0142 ETH (~$46.15 USD)</span>
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab Content 9: Base Verify Onchain & Base Developer Documentation Index */}
            {activeTab === "base_verify" && (
              <div className="flex flex-col gap-6" id="base_verify_tab_content">
                {/* Top Documentation Index & Overview Banner */}
                <div className="bg-gradient-to-r from-blue-950/80 via-slate-900 to-indigo-950/80 border border-indigo-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                  <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                  
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-indigo-500/20 pb-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <ShieldCheck className="w-6 h-6 text-indigo-400" />
                        <h2 className="text-lg font-bold text-white">Verify Users Onchain & Base Documentation Index</h2>
                        <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full text-[10px] font-mono font-bold">
                          Base Sepolia 84532
                        </span>
                      </div>
                      <p className="text-xs text-slate-300">
                        Enforce Sybil resistance (&quot;one real person, once&quot;) and policy gating directly inside Base smart contracts using short-lived EIP-712 verifications.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-start md:self-auto">
                      <a
                        href="https://base-verify-onchain-demo.vercel.app/"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-all shadow-md shadow-indigo-600/20"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Live Demo
                      </a>
                      <a
                        href="https://forms.gle/WTcuWyKkvUV6gGik6"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-medium transition-all"
                      >
                        Reach Out
                      </a>
                    </div>
                  </div>

                  {/* Documentation Index Link Card */}
                  <div className="bg-slate-950/80 border border-blue-500/30 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
                    <div className="flex items-start gap-2.5">
                      <BookOpen className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-blue-300 flex items-center gap-2">
                          <span>Documentation Index:</span>
                          <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded font-mono">llms.txt</span>
                        </div>
                        <div className="text-slate-400 text-[11px] mt-0.5 select-all">
                          Fetch full documentation index at: <span className="text-white underline font-bold">https://docs.base.org/llms.txt</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText("https://docs.base.org/llms.txt");
                          setBvCopiedDocsIndex(true);
                          setTimeout(() => setBvCopiedDocsIndex(false), 2000);
                        }}
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-900/40 hover:bg-blue-900/60 text-blue-200 border border-blue-700/50 rounded-lg text-xs font-medium transition-all cursor-pointer"
                        id="btn_copy_docs_index"
                      >
                        {bvCopiedDocsIndex ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-blue-400" />}
                        {bvCopiedDocsIndex ? "Copied Index URL!" : "Copy Index URL"}
                      </button>
                      <a
                        href="https://docs.base.org/llms.txt"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg"
                        title="Open llms.txt in new tab"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  {/* Base Sepolia Specifications Bar */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4 text-xs font-mono">
                    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 flex flex-col gap-1">
                      <span className="text-[10px] text-slate-500 uppercase font-bold">SignerRegistry (Base Sepolia)</span>
                      <span className="text-indigo-300 font-bold text-[11px] truncate select-all" title="0x4f15593fbF7e3491d15080e1610E7AF8deBA1a02">
                        0x4f15593f...a02
                      </span>
                    </div>
                    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 flex flex-col gap-1">
                      <span className="text-[10px] text-slate-500 uppercase font-bold">API Base URL</span>
                      <span className="text-cyan-300 font-bold text-[11px]">https://verify.base.dev/v1</span>
                    </div>
                    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 flex flex-col gap-1">
                      <span className="text-[10px] text-slate-500 uppercase font-bold">Chain ID</span>
                      <span className="text-emerald-300 font-bold text-[11px]">Base Sepolia (84532)</span>
                    </div>
                    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 flex flex-col gap-1">
                      <span className="text-[10px] text-slate-500 uppercase font-bold">Consumer Base Contract</span>
                      <span className="text-amber-300 font-bold text-[11px]">BaseVerifyConsumer.sol</span>
                    </div>
                  </div>
                </div>

                {/* Core 3 Architectural Pillars */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                      <ShieldAlert className="w-4 h-4" />
                      <span>1. Sybil Resistance (`identityHash`)</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Deterministic one-way dedupe key generated per identity and per contract. The same real person produces the same hash across any number of wallets, blocking duplicate claims.
                    </p>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                      <Lock className="w-4 h-4" />
                      <span>2. Policy Gating</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Declare an immutable policy (`provider` + `conditions`) in your contract. Base Verify reads it onchain via `eth_call` and signs verifications only if credentials pass.
                    </p>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>3. Zero Claim Backend</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Verification signed as EIP-712 typed data and validated inside your smart contract by `SignerRegistry.verifyVerification()`. No user privacy data exposed.
                    </p>
                  </div>
                </div>

                {/* Interactive Verification & SIWE Playground */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col gap-6" id="base_verify_playground">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-5 h-5 text-indigo-400" />
                      <div>
                        <h3 className="font-bold text-white text-base">Interactive Onchain Verification Playground</h3>
                        <p className="text-xs text-slate-400">Simulate SIWE auth, Base Verify API signing, and contract verification flow.</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-xs">
                      <span className="text-slate-400">Simulate Response Mode:</span>
                      <select
                        value={bvSimulateErrorMode}
                        onChange={(e) => setBvSimulateErrorMode(e.target.value as any)}
                        className="bg-slate-950 border border-slate-800 text-slate-300 rounded-lg px-2 py-1 text-xs font-mono focus:outline-none focus:border-indigo-500"
                      >
                        <option value="none">200 OK (Verified)</option>
                        <option value="404_unverified">404 verification_not_found</option>
                        <option value="400_conditions">400 conditions_not_satisfied</option>
                        <option value="404_no_contract">404 contract_not_found</option>
                      </select>
                    </div>
                  </div>

                  {/* Step Selector & Configuration Inputs */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Provider Selector */}
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5 font-mono">1. Select Credential Provider</label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: "coinbase", label: "Coinbase One", color: "text-blue-400" },
                          { id: "x", label: "X / Twitter", color: "text-sky-400" },
                          { id: "instagram", label: "Instagram", color: "text-pink-400" },
                          { id: "tiktok", label: "TikTok", color: "text-emerald-400" }
                        ].map((p) => (
                          <button
                            key={p.id}
                            onClick={() => handleSelectBvProvider(p.id as any)}
                            className={`p-2.5 rounded-xl text-xs font-bold font-mono border text-left transition-all flex items-center justify-between cursor-pointer ${
                              bvProvider === p.id
                                ? "bg-indigo-950/60 border-indigo-500 text-white shadow-md shadow-indigo-500/10"
                                : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                            }`}
                          >
                            <span className={p.color}>{p.label}</span>
                            {bvProvider === p.id && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Policy Conditions Display */}
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5 font-mono">2. Contract Policy Conditions</label>
                      <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl flex flex-col gap-1 text-xs font-mono">
                        <div className="flex justify-between text-slate-400 text-[11px]">
                          <span>provider():</span>
                          <span className="text-indigo-300 font-bold">&quot;{bvProvider}&quot;</span>
                        </div>
                        <div className="flex justify-between text-slate-400 text-[11px]">
                          <span>conditions():</span>
                          <span className="text-emerald-300 font-bold">[{bvCondition}]</span>
                        </div>
                        <div className="mt-1 pt-1 border-t border-slate-900 text-[10px] text-slate-500">
                          Read onchain via eth_call by Base Verify
                        </div>
                      </div>
                    </div>

                    {/* Consumer Contract Address */}
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5 font-mono">3. Target Consumer Contract</label>
                      <input
                        type="text"
                        value={bvConsumerContract}
                        onChange={(e) => setBvConsumerContract(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-indigo-300 font-mono focus:outline-none focus:border-indigo-500"
                        placeholder="0x..."
                      />
                      <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                        Base Sepolia consumer contract address
                      </span>
                    </div>
                  </div>

                  {/* Execution Steps & Action Trigger */}
                  <div className="flex flex-col gap-4 bg-slate-950 border border-slate-800 rounded-xl p-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2 font-mono text-xs flex-wrap">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${bvStep >= 1 ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-500"}`}>1</span>
                        <span className={bvStep >= 1 ? "text-white font-bold" : "text-slate-500"}>SIWE Message</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
                        
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${bvStep >= 2 ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-500"}`}>2</span>
                        <span className={bvStep >= 2 ? "text-white font-bold" : "text-slate-500"}>POST /v1/onchain_verifications</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-600" />

                        <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${bvStep >= 4 ? "bg-emerald-600 text-white" : "bg-slate-800 text-slate-500"}`}>3</span>
                        <span className={bvStep >= 4 ? "text-emerald-400 font-bold" : "text-slate-500"}>_verify()</span>
                      </div>

                      <button
                        onClick={handleRunBvSimulation}
                        disabled={bvIsLoading}
                        className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-500/20 disabled:opacity-50 cursor-pointer w-full sm:w-auto justify-center"
                        id="btn_run_bv_simulation"
                      >
                        {bvIsLoading ? (
                          <>
                            <Activity className="w-4 h-4 animate-spin text-white" />
                            Processing SIWE & Verifying...
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 text-white fill-white" />
                            Run Onchain Verification Simulation
                          </>
                        )}
                      </button>
                    </div>

                    {/* SIWE Message Output */}
                    {bvSiweMessage && (
                      <div className="flex flex-col gap-1.5 font-mono text-xs">
                        <div className="flex items-center justify-between text-slate-400 text-[11px]">
                          <span>SIWE Message Payload:</span>
                          <span className="text-slate-500">Statement: &quot;Claim eligibility for a Base Verify onchain benefit.&quot;</span>
                        </div>
                        <pre className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 text-[11px] overflow-x-auto whitespace-pre-wrap select-all">
                          {bvSiweMessage}
                        </pre>
                      </div>
                    )}

                    {/* API & Contract Verification Response Box */}
                    {bvResponse && (
                      <div className={`p-4 rounded-xl border flex flex-col gap-2 font-mono text-xs ${
                        bvResponse.status === 200
                          ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-200"
                          : "bg-rose-950/40 border-rose-500/30 text-rose-200"
                      }`}>
                        <div className="flex items-center justify-between font-bold border-b border-white/10 pb-2">
                          <div className="flex items-center gap-2">
                            {bvResponse.status === 200 ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <AlertTriangle className="w-4 h-4 text-rose-400" />
                            )}
                            <span>Status: {bvResponse.status} {bvResponse.status === 200 ? "OK" : bvResponse.error}</span>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-black/30">
                            {bvResponse.status === 200 ? "SignerRegistry Verified" : "API Error Response"}
                          </span>
                        </div>

                        <p className="text-xs leading-relaxed opacity-90">{bvResponse.message}</p>

                        {bvResponse.status === 200 && (
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2 pt-2 border-t border-white/10 text-[11px]">
                            <div className="bg-black/30 p-2 rounded">
                              <span className="text-slate-400 block text-[10px]">identityHash (Dedupe Key):</span>
                              <span className="text-emerald-300 font-bold truncate block select-all">{bvResponse.identityHash}</span>
                            </div>
                            <div className="bg-black/30 p-2 rounded">
                              <span className="text-slate-400 block text-[10px]">expiration (Unix Sec):</span>
                              <span className="text-cyan-300 font-bold block">{bvResponse.expiration}</span>
                            </div>
                            <div className="bg-black/30 p-2 rounded">
                              <span className="text-slate-400 block text-[10px]">EIP-712 Signature:</span>
                              <span className="text-indigo-300 font-bold truncate block select-all">{bvResponse.signature}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Supported Providers and Conditions Table */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col gap-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <Layers className="w-5 h-5 text-indigo-400" />
                      <h3 className="font-bold text-white text-base">Supported Providers & Conditions Reference</h3>
                    </div>
                    <span className="text-xs font-mono text-slate-400">All conditions evaluated with AND logic</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono text-slate-300 border-collapse">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/60 uppercase text-[10px]">
                          <th className="py-2.5 px-3">Provider</th>
                          <th className="py-2.5 px-3">Condition Name</th>
                          <th className="py-2.5 px-3">Type</th>
                          <th className="py-2.5 px-3">Allowed Operators</th>
                          <th className="py-2.5 px-3">Example Condition</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        <tr className="hover:bg-slate-800/30">
                          <td className="py-2.5 px-3 font-bold text-sky-400">x</td>
                          <td className="py-2.5 px-3 text-white">followers</td>
                          <td className="py-2.5 px-3 text-slate-400">int</td>
                          <td className="py-2.5 px-3 text-amber-300">eq, gt, gte, lt, lte</td>
                          <td className="py-2.5 px-3 text-emerald-400 font-bold">followers gte 1000</td>
                        </tr>
                        <tr className="hover:bg-slate-800/30">
                          <td className="py-2.5 px-3 font-bold text-sky-400">x</td>
                          <td className="py-2.5 px-3 text-white">verified</td>
                          <td className="py-2.5 px-3 text-slate-400">bool</td>
                          <td className="py-2.5 px-3 text-amber-300">eq</td>
                          <td className="py-2.5 px-3 text-emerald-400 font-bold">verified eq true</td>
                        </tr>
                        <tr className="hover:bg-slate-800/30">
                          <td className="py-2.5 px-3 font-bold text-sky-400">x</td>
                          <td className="py-2.5 px-3 text-white">verified_type</td>
                          <td className="py-2.5 px-3 text-slate-400">string</td>
                          <td className="py-2.5 px-3 text-amber-300">eq</td>
                          <td className="py-2.5 px-3 text-emerald-400 font-bold">verified_type eq blue</td>
                        </tr>
                        <tr className="hover:bg-slate-800/30">
                          <td className="py-2.5 px-3 font-bold text-blue-400">coinbase</td>
                          <td className="py-2.5 px-3 text-white">coinbase_one_active</td>
                          <td className="py-2.5 px-3 text-slate-400">bool</td>
                          <td className="py-2.5 px-3 text-amber-300">eq</td>
                          <td className="py-2.5 px-3 text-emerald-400 font-bold">coinbase_one_active eq true</td>
                        </tr>
                        <tr className="hover:bg-slate-800/30">
                          <td className="py-2.5 px-3 font-bold text-blue-400">coinbase</td>
                          <td className="py-2.5 px-3 text-white">coinbase_one_billed</td>
                          <td className="py-2.5 px-3 text-slate-400">bool</td>
                          <td className="py-2.5 px-3 text-amber-300">eq</td>
                          <td className="py-2.5 px-3 text-emerald-400 font-bold">coinbase_one_billed eq true</td>
                        </tr>
                        <tr className="hover:bg-slate-800/30">
                          <td className="py-2.5 px-3 font-bold text-pink-400">instagram</td>
                          <td className="py-2.5 px-3 text-white">followers_count</td>
                          <td className="py-2.5 px-3 text-slate-400">int</td>
                          <td className="py-2.5 px-3 text-amber-300">eq, gt, gte, lt, lte</td>
                          <td className="py-2.5 px-3 text-emerald-400 font-bold">followers_count gte 5000</td>
                        </tr>
                        <tr className="hover:bg-slate-800/30">
                          <td className="py-2.5 px-3 font-bold text-emerald-400">tiktok</td>
                          <td className="py-2.5 px-3 text-white">follower_count</td>
                          <td className="py-2.5 px-3 text-slate-400">int</td>
                          <td className="py-2.5 px-3 text-amber-300">eq, gt, gte, lt, lte</td>
                          <td className="py-2.5 px-3 text-emerald-400 font-bold">follower_count gte 10000</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Code Snippets & Developer Integration Guide */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <Code2 className="w-5 h-5 text-indigo-400" />
                      <h3 className="font-bold text-white text-base">Integration Code & API Reference</h3>
                    </div>

                    <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 font-mono text-xs flex-wrap">
                      {[
                        { id: "solidity", label: "IncentiveProgram.sol" },
                        { id: "typescript", label: "fetch-verification.ts" },
                        { id: "api", label: "POST API Payload" },
                        { id: "errors", label: "Error Handling Matrix" }
                      ].map((t) => (
                        <button
                          key={t.id}
                          onClick={() => setBvCodeTab(t.id as any)}
                          className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                            bvCodeTab === t.id
                              ? "bg-indigo-600 text-white font-bold"
                              : "text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Solidity Tab */}
                  {bvCodeTab === "solidity" && (
                    <div className="flex flex-col gap-2 font-mono text-xs">
                      <div className="flex items-center justify-between text-slate-400 text-[11px]">
                        <span>Extend BaseVerifyConsumer to define immutable policy and dedupe on identityHash</span>
                        <button
                          onClick={() => {
                            const code = `// SPDX-License-Identifier: MIT\npragma solidity 0.8.28;\nimport {BaseVerifyConsumer} from "@baseverify/BaseVerifyConsumer.sol";\n\ncontract IncentiveProgram is BaseVerifyConsumer {\n    mapping(bytes32 identityHash => bool enrolled) public enrolled;\n    mapping(address wallet => bool active) public isParticipant;\n    error AlreadyEnrolled();\n\n    constructor(address registry_) BaseVerifyConsumer(registry_) {}\n\n    function provider() external pure override returns (string memory) {\n        return "coinbase";\n    }\n\n    function conditions() external pure override returns (Condition[] memory) {\n        Condition[] memory c = new Condition[](1);\n        c[0] = Condition({name: "coinbase_one_active", op: "eq", value: "true"});\n        return c;\n    }\n\n    function enroll(bytes32 identityHash, uint40 expiration, bytes calldata signature) external {\n        if (enrolled[identityHash]) revert AlreadyEnrolled();\n        _verify(identityHash, expiration, signature);\n        enrolled[identityHash] = true;\n        isParticipant[msg.sender] = true;\n    }\n}`;
                            navigator.clipboard.writeText(code);
                            setBvCopiedCode(true);
                            setTimeout(() => setBvCopiedCode(false), 2000);
                          }}
                          className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 cursor-pointer"
                        >
                          {bvCopiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          {bvCopiedCode ? "Copied!" : "Copy Code"}
                        </button>
                      </div>
                      <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 text-xs overflow-x-auto whitespace-pre">
{`// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {BaseVerifyConsumer} from "@baseverify/BaseVerifyConsumer.sol";

contract IncentiveProgram is BaseVerifyConsumer {
    mapping(bytes32 identityHash => bool enrolled) public enrolled;
    mapping(address wallet => bool active) public isParticipant;

    error AlreadyEnrolled();

    // Pass the SignerRegistry address for your chain (0x4f15593fbF7e3491d15080e1610E7AF8deBA1a02 on Base Sepolia)
    constructor(address registry_) BaseVerifyConsumer(registry_) {}

    // Your eligibility policy. Both MUST be immutable (constant / pure).
    function provider() external pure override returns (string memory) {
        return "coinbase";
    }

    function conditions() external pure override returns (Condition[] memory) {
        Condition[] memory c = new Condition[](1);
        c[0] = Condition({name: "coinbase_one_active", op: "eq", value: "true"});
        return c;
    }

    function enroll(bytes32 identityHash, uint40 expiration, bytes calldata signature) external {
        // One enrollment per real identity across every wallet they control.
        if (enrolled[identityHash]) revert AlreadyEnrolled();

        // Binds msg.sender as the verified wallet; reverts on bad or expired verification.
        _verify(identityHash, expiration, signature);

        enrolled[identityHash] = true;
        isParticipant[msg.sender] = true;
    }
}`}
                      </pre>
                    </div>
                  )}

                  {/* TypeScript Tab */}
                  {bvCodeTab === "typescript" && (
                    <div className="flex flex-col gap-2 font-mono text-xs">
                      <div className="flex items-center justify-between text-slate-400 text-[11px]">
                        <span>Client SIWE signing and POST request to Base Verify API</span>
                        <button
                          onClick={() => {
                            const code = `import { createSiweMessage, generateSiweNonce } from 'viem/siwe';\nconst MY_CONTRACT_ADDRESS = '0x3ccD255C67a129e780F945Fa1773441Ec100059f';\nconst CHAIN_ID = 84532;\n\nexport async function fetchVerification(userAddress, signMessageAsync) {\n  const message = createSiweMessage({\n    domain: window.location.host,\n    address: userAddress,\n    statement: 'Claim eligibility for a Base Verify onchain benefit.',\n    uri: window.location.origin,\n    version: '1',\n    chainId: CHAIN_ID,\n    nonce: generateSiweNonce(),\n    resources: [\`eip155:\${CHAIN_ID}:\${MY_CONTRACT_ADDRESS}\`],\n  });\n\n  const signature = await signMessageAsync({ message });\n  const res = await fetch('https://verify.base.dev/v1/onchain_verifications', {\n    method: 'POST',\n    headers: { 'Content-Type': 'application/json' },\n    body: JSON.stringify({ message, signature }),\n  });\n  if (!res.ok) throw new Error(\`Verification failed: \${res.status}\`);\n  return res.json();\n}`;
                            navigator.clipboard.writeText(code);
                            setBvCopiedCode(true);
                            setTimeout(() => setBvCopiedCode(false), 2000);
                          }}
                          className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 cursor-pointer"
                        >
                          {bvCopiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          {bvCopiedCode ? "Copied!" : "Copy Code"}
                        </button>
                      </div>
                      <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 text-xs overflow-x-auto whitespace-pre">
{`import { createSiweMessage, generateSiweNonce } from 'viem/siwe';

const MY_CONTRACT_ADDRESS = '0x3ccD255C67a129e780F945Fa1773441Ec100059f'; // your deployed consumer
const CHAIN_ID = 84532; // Base Sepolia

export async function fetchVerification(
  userAddress: \`0x\${string}\`,
  signMessageAsync: (args: { message: string }) => Promise<string>,
) {
  // Statement and Resources line required by Base Verify API
  const message = createSiweMessage({
    domain: window.location.host,
    address: userAddress,
    statement: 'Claim eligibility for a Base Verify onchain benefit.',
    uri: window.location.origin,
    version: '1',
    chainId: CHAIN_ID,
    nonce: generateSiweNonce(),
    resources: [\`eip155:\${CHAIN_ID}:\${MY_CONTRACT_ADDRESS}\`],
  });

  const signature = await signMessageAsync({ message });

  const res = await fetch('https://verify.base.dev/v1/onchain_verifications', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, signature }),
  });

  if (!res.ok) {
    throw new Error(\`Verification failed: \${res.status}\`);
  }

  // Returns { identityHash, expiration, signature }
  return res.json();
}`}
                      </pre>
                    </div>
                  )}

                  {/* API Tab */}
                  {bvCodeTab === "api" && (
                    <div className="flex flex-col gap-2 font-mono text-xs">
                      <div className="flex items-center justify-between text-slate-400 text-[11px]">
                        <span>POST /v1/onchain_verifications Request & 200 OK Response Schema</span>
                      </div>
                      <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 text-xs overflow-x-auto whitespace-pre">
{`// Endpoint: POST https://verify.base.dev/v1/onchain_verifications
// Request Headers: Content-Type: application/json (No Authorization header needed)

// Request Body:
{
  "message": "app.example.com wants you to sign in with your Ethereum account:... Resources: - eip155:84532:0x3ccD...",
  "signature": "0x1234567890abcdef..."
}

// 200 OK Response Payload:
{
  "identityHash": "0x88c9f0a1b2c3d4e5f60718293a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
  "expiration": 1723497600,
  "signature": "0x4d3c2b1a098877665544332211..."
}`}
                      </pre>
                    </div>
                  )}

                  {/* Error Handling Matrix Tab */}
                  {bvCodeTab === "errors" && (
                    <div className="overflow-x-auto font-mono text-xs">
                      <table className="w-full text-left text-slate-300 border-collapse">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/60 uppercase text-[10px]">
                            <th className="py-2.5 px-3">Status Code</th>
                            <th className="py-2.5 px-3">Error Code</th>
                            <th className="py-2.5 px-3">Description</th>
                            <th className="py-2.5 px-3">Recommended Client Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                          <tr className="hover:bg-slate-800/30">
                            <td className="py-2.5 px-3 text-rose-400 font-bold">404</td>
                            <td className="py-2.5 px-3 text-amber-300">contract_not_found</td>
                            <td className="py-2.5 px-3 text-slate-300">Contract not deployed on chain or missing policy</td>
                            <td className="py-2.5 px-3 text-slate-400">Verify contract address and Base Sepolia deployment</td>
                          </tr>
                          <tr className="hover:bg-slate-800/30">
                            <td className="py-2.5 px-3 text-rose-400 font-bold">404</td>
                            <td className="py-2.5 px-3 text-amber-300">verification_not_found</td>
                            <td className="py-2.5 px-3 text-slate-300">Wallet has no credential for provider</td>
                            <td className="py-2.5 px-3 text-indigo-300 font-bold">Redirect to https://verify.base.dev?providers={`\${provider}`}</td>
                          </tr>
                          <tr className="hover:bg-slate-800/30">
                            <td className="py-2.5 px-3 text-rose-400 font-bold">404</td>
                            <td className="py-2.5 px-3 text-amber-300">needs_reauth</td>
                            <td className="py-2.5 px-3 text-slate-300">Credential older than contract cutoffBlock</td>
                            <td className="py-2.5 px-3 text-indigo-300 font-bold">Redirect user to Base Verify to re-authenticate</td>
                          </tr>
                          <tr className="hover:bg-slate-800/30">
                            <td className="py-2.5 px-3 text-amber-400 font-bold">400</td>
                            <td className="py-2.5 px-3 text-amber-300">conditions_not_satisfied</td>
                            <td className="py-2.5 px-3 text-slate-300">Verified but does not meet policy conditions</td>
                            <td className="py-2.5 px-3 text-slate-400">Display UI notification (do not retry)</td>
                          </tr>
                          <tr className="hover:bg-slate-800/30">
                            <td className="py-2.5 px-3 text-emerald-400 font-bold">200</td>
                            <td className="py-2.5 px-3 text-emerald-300">OK</td>
                            <td className="py-2.5 px-3 text-slate-300">Signed verification returned</td>
                            <td className="py-2.5 px-3 text-emerald-300 font-bold">Submit identityHash, expiration, signature to contract</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>

        </div>

        {/* QR Code Modal Overlay */}
        <AnimatePresence>
          {qrModalInscription && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md" id="qr_modal_backdrop">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                id="qr_modal_card"
              >
                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50" id="qr_modal_header">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400">
                      <QrCode className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-sm">Inscription Transaction QR Code</h3>
                      <p className="text-[11px] text-slate-400 font-mono">
                        Inscription #{qrModalInscription.number} (${qrModalInscription.ticker.toUpperCase()})
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setQrModalInscription(null)}
                    className="p-1.5 text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 rounded-lg transition-all cursor-pointer"
                    id="qr_modal_close_btn"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Top Main Navigation Tabs (QR Generator vs History) */}
                <div className="flex items-center border-b border-slate-800 bg-slate-950/80 px-6 pt-2 gap-2" id="qr_modal_main_tabs">
                  <button
                    onClick={() => setQrActiveTab("generator")}
                    className={`flex items-center gap-2 py-2 px-4 border-b-2 font-mono text-xs font-semibold transition-all cursor-pointer ${
                      qrActiveTab === "generator"
                        ? "border-amber-500 text-amber-400"
                        : "border-transparent text-slate-400 hover:text-white"
                    }`}
                    id="qr_main_tab_generator"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>QR Generator</span>
                  </button>
                  <button
                    onClick={() => setQrActiveTab("history")}
                    className={`flex items-center gap-2 py-2 px-4 border-b-2 font-mono text-xs font-semibold transition-all cursor-pointer relative ${
                      qrActiveTab === "history"
                        ? "border-amber-500 text-amber-400"
                        : "border-transparent text-slate-400 hover:text-white"
                    }`}
                    id="qr_main_tab_history"
                  >
                    <History className="w-3.5 h-3.5" />
                    <span>History</span>
                    {qrHistory.length > 0 && (
                      <span className="px-1.5 py-0.2 bg-amber-500/20 text-amber-300 text-[10px] rounded-full border border-amber-500/30">
                        {qrHistory.length}
                      </span>
                    )}
                  </button>
                </div>

                {/* Modal Body: Generator Tab */}
                {qrActiveTab === "generator" && (
                  <div className="p-6 flex flex-col gap-5" id="qr_modal_body">
                    {/* Mode Selector */}
                    <div className="flex items-center p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono" id="qr_type_selector">
                      <button
                        onClick={() => setQrDataType("protocol")}
                        className={`flex-1 py-1.5 px-3 rounded-lg font-medium transition-all cursor-pointer ${
                          qrDataType === "protocol"
                            ? "bg-amber-500 text-slate-950 font-bold shadow-md"
                            : "text-slate-400 hover:text-white"
                        }`}
                        id="qr_tab_protocol"
                      >
                        BRC-20 Payload
                      </button>
                      <button
                        onClick={() => setQrDataType("txhash")}
                        className={`flex-1 py-1.5 px-3 rounded-lg font-medium transition-all cursor-pointer ${
                          qrDataType === "txhash"
                            ? "bg-amber-500 text-slate-950 font-bold shadow-md"
                            : "text-slate-400 hover:text-white"
                        }`}
                        id="qr_tab_txhash"
                      >
                        Bitcoin URI
                      </button>
                      <button
                        onClick={() => setQrDataType("full")}
                        className={`flex-1 py-1.5 px-3 rounded-lg font-medium transition-all cursor-pointer ${
                          qrDataType === "full"
                            ? "bg-amber-500 text-slate-950 font-bold shadow-md"
                            : "text-slate-400 hover:text-white"
                        }`}
                        id="qr_tab_full"
                      >
                        Full JSON
                      </button>
                    </div>

                    {/* QR Visual Container */}
                    <div className="flex flex-col items-center justify-center p-6 bg-slate-950/80 border border-slate-800/80 rounded-xl gap-3" id="qr_display_container">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={`${qrModalInscription.id}-${qrDataType}`}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className={`p-4 rounded-xl shadow-lg border-4 border-amber-500/30 flex items-center justify-center transition-all relative overflow-hidden ${
                            qrTransparentBg ? "bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:8px_8px]" : ""
                          }`}
                          style={{ backgroundColor: qrTransparentBg ? "transparent" : (isHighContrast ? "#ffffff" : qrBgColor) }}
                          id="qr_canvas_wrapper"
                        >
                          {/* Geometric Pattern & Dot-Matrix Density Overlay Layers */}
                          {enablePatternOverlays && qrPattern === "cyber" && (
                            <div className="absolute inset-0 pointer-events-none opacity-25 bg-[radial-gradient(#d97706_1.5px,transparent_1.5px)] [background-size:8px_8px]" />
                          )}
                          {enablePatternOverlays && qrPattern === "circuit" && (
                            <div className="absolute inset-0 pointer-events-none opacity-20 border border-amber-500/40 bg-[linear-gradient(to_right,#d97706_1px,transparent_1px),linear-gradient(to_bottom,#d97706_1px,transparent_1px)] [background-size:12px_12px]" />
                          )}
                          {enablePatternOverlays && qrPattern === "mesh" && (
                            <div className="absolute inset-0 pointer-events-none opacity-30 bg-[radial-gradient(#059669_1.5px,transparent_1.5px)] [background-size:6px_6px]" />
                          )}
                          {enablePatternOverlays && qrPattern === "dots" && (
                            <div className="absolute inset-0 pointer-events-none opacity-35 bg-[radial-gradient(#000000_1.5px,transparent_1.5px)] [background-size:5px_5px] mix-blend-multiply" />
                          )}

                          <QRCodeSVG
                            id="inscription-qr-code-svg"
                            value={getQrPayload(qrModalInscription, qrDataType)}
                            size={190}
                            level={qrErrorLevel}
                            fgColor={isHighContrast ? "#000000" : qrFgColor}
                            bgColor={qrTransparentBg ? "transparent" : (isHighContrast ? "#ffffff" : qrBgColor)}
                            includeMargin={false}
                            style={{
                              filter:
                                qrPattern === "rounded"
                                  ? "drop-shadow(0 0 1px rgba(0,0,0,0.4))"
                                  : qrPattern === "dots"
                                  ? "contrast(115%)"
                                  : qrPattern === "cyber"
                                  ? "drop-shadow(0 0 2px rgba(217,119,6,0.35))"
                                  : "none",
                              strokeLinejoin: qrPattern === "rounded" || qrPattern === "dots" ? "round" : "miter",
                              strokeWidth: qrPattern === "rounded" ? "0.35px" : "0px",
                              stroke: qrPattern === "rounded" ? (isHighContrast ? "#000000" : qrFgColor) : "none"
                            }}
                          />
                        </motion.div>
                      </AnimatePresence>

                      {/* Color & Density Control Panel */}
                      <div className="flex flex-col gap-2 w-full max-w-sm" id="qr_color_controls_panel">
                        {/* High Contrast Mode Toggle Bar */}
                        <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl" id="qr_high_contrast_bar">
                          <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                            <Contrast className="w-3.5 h-3.5 text-amber-400" />
                            <span>High Contrast Mode:</span>
                          </div>
                          <button
                            onClick={() => setIsHighContrast(!isHighContrast)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer border ${
                              isHighContrast
                                ? "bg-amber-500 text-slate-950 border-amber-400 shadow-md ring-2 ring-amber-500/30"
                                : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700"
                            }`}
                            id="btn_toggle_high_contrast"
                            title="Override colors with pure high contrast black (#000000) on white (#ffffff)"
                          >
                            <Contrast className="w-3.5 h-3.5" />
                            <span>{isHighContrast ? "ACTIVE (#000 / #FFF)" : "Enable B&W"}</span>
                          </button>
                        </div>

                        {/* Theme Palette Presets Bar */}
                        <div className="flex flex-col gap-1.5 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl" id="qr_theme_presets_bar">
                          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                            <div className="flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                              <span>Palette Presets:</span>
                            </div>
                            <button
                              onClick={() => {
                                setQrFgColor("#000000");
                                setQrBgColor("#ffffff");
                                setIsHighContrast(false);
                                setQrPattern("standard");
                                setQrTransparentBg(false);
                              }}
                              className="inline-flex items-center gap-1 text-[10px] text-slate-400 hover:text-amber-300 px-2 py-0.5 rounded bg-slate-950 border border-slate-800 hover:border-amber-500/40 transition-all cursor-pointer font-mono"
                              id="btn_reset_qr_colors"
                              title="Reset foreground & background colors to default (#000000 / #ffffff), turn off High Contrast, and reset pattern to Standard"
                            >
                              <RotateCcw className="w-3 h-3 text-amber-400" />
                              <span>Reset Default</span>
                            </button>
                          </div>
                          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 pt-0.5">
                            {[
                              { name: "Classic", fg: "#000000", bg: "#ffffff" },
                              { name: "Amber", fg: "#d97706", bg: "#020617" },
                              { name: "Base Blue", fg: "#ffffff", bg: "#0052ff" },
                              { name: "Matrix", fg: "#059669", bg: "#0f172a" },
                              { name: "Cream", fg: "#1e293b", bg: "#fef3c7" },
                              { name: "Inverse", fg: "#ffffff", bg: "#000000" },
                            ].map((preset) => {
                              const isActive =
                                !isHighContrast &&
                                qrFgColor.toLowerCase() === preset.fg.toLowerCase() &&
                                qrBgColor.toLowerCase() === preset.bg.toLowerCase();

                              return (
                                <button
                                  key={`preset_${preset.name}`}
                                  onClick={() => {
                                    setQrFgColor(preset.fg);
                                    setQrBgColor(preset.bg);
                                    setIsHighContrast(false);
                                  }}
                                  className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border text-[10px] font-mono transition-all cursor-pointer ${
                                    isActive
                                      ? "bg-amber-500/20 border-amber-500 text-amber-300 font-bold shadow-sm"
                                      : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                                  }`}
                                  title={`Apply ${preset.name} Theme (FG: ${preset.fg}, BG: ${preset.bg})`}
                                  id={`qr_preset_${preset.name.toLowerCase().replace(/\s+/g, "_")}`}
                                >
                                  <div className="flex items-center -space-x-1">
                                    <span className="w-2.5 h-2.5 rounded-full border border-slate-600 shrink-0" style={{ backgroundColor: preset.fg }} />
                                    <span className="w-2.5 h-2.5 rounded-full border border-slate-600 shrink-0" style={{ backgroundColor: preset.bg }} />
                                  </div>
                                  <span className="truncate">{preset.name}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Error Correction Level Dropdown Bar */}
                        <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl" id="qr_error_correction_bar">
                          <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                            <Sliders className="w-3.5 h-3.5 text-amber-400" />
                            <span>Error Correction:</span>
                          </div>
                          <select
                            value={qrErrorLevel}
                            onChange={(e) => setQrErrorLevel(e.target.value as "L" | "M" | "Q" | "H")}
                            className="bg-slate-950 border border-slate-700 hover:border-amber-500/50 text-amber-300 rounded-lg text-xs font-mono py-1 px-2 focus:outline-none focus:border-amber-500 cursor-pointer"
                            id="qr_error_correction_select"
                          >
                            <option value="L">L - Low (7% recover, max density)</option>
                            <option value="M">M - Medium (15% recover, balanced)</option>
                            <option value="Q">Q - Quartile (25% recover, high)</option>
                            <option value="H">H - High (30% recover, max reliability)</option>
                          </select>
                        </div>

                        {/* Foreground Color Picker Bar */}
                        <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl" id="qr_fg_color_picker_bar">
                          <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                            <Palette className="w-3.5 h-3.5 text-amber-400" />
                            <span>Foreground:</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            {/* Preset FG Swatches */}
                            {[
                              { name: "Black", hex: "#000000" },
                              { name: "Amber", hex: "#d97706" },
                              { name: "Emerald", hex: "#059669" },
                              { name: "Indigo", hex: "#4f46e5" },
                              { name: "Crimson", hex: "#dc2626" },
                              { name: "White", hex: "#ffffff" },
                            ].map((swatch) => (
                              <button
                                key={`fg_${swatch.hex}`}
                                onClick={() => {
                                  setQrFgColor(swatch.hex);
                                  setIsHighContrast(false);
                                }}
                                className={`w-4 h-4 rounded-full transition-all border cursor-pointer ${
                                  !isHighContrast && qrFgColor.toLowerCase() === swatch.hex.toLowerCase()
                                    ? "scale-125 border-white ring-2 ring-amber-500/60 shadow-md"
                                    : "border-slate-700 hover:scale-110 opacity-80 hover:opacity-100"
                                }`}
                                style={{ backgroundColor: swatch.hex }}
                                title={`FG: ${swatch.name} (${swatch.hex})`}
                                id={`qr_fg_swatch_${swatch.name.toLowerCase().replace(/\s+/g, "_")}`}
                              />
                            ))}
                            {/* Custom FG Input */}
                            <div className="relative flex items-center border-l border-slate-800 pl-1.5">
                              <label className="relative flex items-center justify-center w-5 h-5 rounded-md bg-slate-800 border border-slate-700 hover:border-amber-500/50 cursor-pointer transition-all" title="Custom Foreground Color">
                                <input
                                  type="color"
                                  value={qrFgColor}
                                  onChange={(e) => {
                                    setQrFgColor(e.target.value);
                                    setIsHighContrast(false);
                                  }}
                                  className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                                  id="qr_fg_custom_color_input"
                                />
                                <div className="w-3 h-3 rounded-full border border-slate-500" style={{ backgroundColor: isHighContrast ? "#000000" : qrFgColor }} />
                              </label>
                            </div>
                          </div>
                        </div>

                        {/* Background Color Picker Bar */}
                        <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl" id="qr_bg_color_picker_bar">
                          <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                            <Palette className="w-3.5 h-3.5 text-slate-400" />
                            <span>Background:</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            {/* Preset BG Swatches */}
                            {[
                              { name: "White", hex: "#ffffff" },
                              { name: "Dark Slate", hex: "#0f172a" },
                              { name: "Amber Cream", hex: "#fef3c7" },
                              { name: "Pure Black", hex: "#000000" },
                              { name: "Midnight", hex: "#020617" },
                            ].map((swatch) => (
                              <button
                                key={`bg_${swatch.hex}`}
                                onClick={() => {
                                  setQrBgColor(swatch.hex);
                                  setIsHighContrast(false);
                                }}
                                className={`w-4 h-4 rounded-full transition-all border cursor-pointer ${
                                  !isHighContrast && !qrTransparentBg && qrBgColor.toLowerCase() === swatch.hex.toLowerCase()
                                    ? "scale-125 border-white ring-2 ring-amber-500/60 shadow-md"
                                    : "border-slate-700 hover:scale-110 opacity-80 hover:opacity-100"
                                }`}
                                style={{ backgroundColor: swatch.hex }}
                                title={`BG: ${swatch.name} (${swatch.hex})`}
                                id={`qr_bg_swatch_${swatch.name.toLowerCase().replace(/\s+/g, "_")}`}
                              />
                            ))}
                            {/* Custom BG Input */}
                            <div className="relative flex items-center border-l border-slate-800 pl-1.5">
                              <label className="relative flex items-center justify-center w-5 h-5 rounded-md bg-slate-800 border border-slate-700 hover:border-amber-500/50 cursor-pointer transition-all" title="Custom Background Color">
                                <input
                                  type="color"
                                  value={qrBgColor}
                                  onChange={(e) => {
                                    setQrBgColor(e.target.value);
                                    setIsHighContrast(false);
                                  }}
                                  className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                                  id="qr_bg_custom_color_input"
                                />
                                <div className="w-3 h-3 rounded-full border border-slate-500" style={{ backgroundColor: qrTransparentBg ? "transparent" : (isHighContrast ? "#ffffff" : qrBgColor) }} />
                              </label>
                            </div>
                          </div>
                        </div>

                        {/* Transparent Background Checkbox Bar */}
                        <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl" id="qr_transparent_bg_bar">
                          <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                            <Layers className="w-3.5 h-3.5 text-amber-400" />
                            <span>Transparent Background:</span>
                          </div>
                          <label
                            className="flex items-center gap-2 cursor-pointer text-[11px] font-mono text-slate-300 hover:text-amber-300 transition-colors"
                            id="qr_transparent_bg_checkbox_wrapper"
                          >
                            <input
                              type="checkbox"
                              checked={qrTransparentBg}
                              onChange={(e) => setQrTransparentBg(e.target.checked)}
                              className="w-3.5 h-3.5 rounded border-slate-700 text-amber-500 focus:ring-amber-500/50 focus:ring-offset-slate-900 bg-slate-950 cursor-pointer"
                              id="qr_transparent_bg_checkbox"
                            />
                            <span className={qrTransparentBg ? "text-amber-300 font-bold" : "text-slate-400"}>
                              {qrTransparentBg ? "Enabled (Overrides BG)" : "Disabled"}
                            </span>
                          </label>
                        </div>

                        {/* Geometric Pattern & Dot-Matrix Density Grid Panel */}
                        <div className="flex flex-col gap-1.5 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl" id="qr_pattern_grid_panel">
                          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 flex-wrap gap-2">
                            <div className="flex items-center gap-1.5">
                              <Grid className="w-3.5 h-3.5 text-amber-400" />
                              <span>Pattern & Overlay Grid:</span>
                            </div>
                            <label className="flex items-center gap-1.5 cursor-pointer text-[11px] font-mono hover:text-amber-300 transition-colors" id="enable_pattern_overlays_wrapper">
                              <input
                                type="checkbox"
                                checked={enablePatternOverlays}
                                onChange={(e) => setEnablePatternOverlays(e.target.checked)}
                                className="w-3.5 h-3.5 rounded border-slate-700 text-amber-500 focus:ring-amber-500/50 focus:ring-offset-slate-900 bg-slate-950 cursor-pointer"
                                id="enable_pattern_overlays_checkbox"
                              />
                              <span className={enablePatternOverlays ? "text-amber-300 font-bold" : "text-slate-400"}>
                                Enable Pattern Overlays
                              </span>
                            </label>
                          </div>
                          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 pt-0.5">
                            {[
                              { id: "standard", name: "Standard", desc: "Classic 1:1 Square Vector Modules", icon: Square },
                              { id: "dots", name: "Dot Matrix", desc: "Circular Dot Density Overlay", icon: CircleDot },
                              { id: "rounded", name: "Rounded", desc: "Smooth Curved Module Corners", icon: Disc },
                              { id: "cyber", name: "Cyber Mesh", desc: "Geometric Grid Mesh Overlay", icon: Grid },
                              { id: "circuit", name: "Circuit Line", desc: "Tech Trace & Node Overlay", icon: Cpu },
                              { id: "mesh", name: "Micro Dot", desc: "High Density Pixel Matrix Overlay", icon: LayoutGrid },
                            ].map((pat) => {
                              const IconComp = pat.icon;
                              const isActive = qrPattern === pat.id;
                              return (
                                <button
                                  key={`pat_${pat.id}`}
                                  onClick={() => setQrPattern(pat.id as any)}
                                  className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border text-[10px] font-mono transition-all cursor-pointer ${
                                    isActive
                                      ? "bg-amber-500/20 border-amber-500 text-amber-300 font-bold shadow-sm ring-1 ring-amber-500/30"
                                      : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                                  }`}
                                  title={`${pat.name}: ${pat.desc}`}
                                  id={`qr_pattern_${pat.id}`}
                                >
                                  <IconComp className="w-3 h-3 text-amber-400 shrink-0" />
                                  <span className="truncate">{pat.name}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-400 text-center font-mono">
                        {qrDataType === "protocol" && "Scan to read BRC-20 JSON inscription protocol payload"}
                        {qrDataType === "txhash" && "Scan to open Bitcoin transaction URI reference"}
                        {qrDataType === "full" && "Scan to read full inscription metadata record"}
                      </p>
                    </div>

                    {/* Code Payload Preview */}
                    <div className="flex flex-col gap-1.5" id="qr_payload_preview">
                      <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono flex-wrap gap-2">
                        <span className="flex items-center gap-1">
                          <Code2 className="w-3.5 h-3.5 text-amber-500" />
                          Encoded Content:
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={handleCopyMinifiedJson}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-900/60 hover:bg-purple-800/80 text-purple-200 border border-purple-500/40 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer shadow-sm"
                            id="btn_copy_minified_json"
                            title="Copy minified single-line JSON string without whitespace"
                          >
                            {copiedMinifiedJson ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-300">Minified Copied!</span>
                              </>
                            ) : (
                              <>
                                <Code className="w-3 h-3 text-purple-300" />
                                <span>Copy JSON (Minified)</span>
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(getQrPayload(qrModalInscription, qrDataType));
                              setCopiedQrData(true);
                              setTimeout(() => setCopiedQrData(false), 2000);
                            }}
                            className="inline-flex items-center gap-1 text-slate-400 hover:text-white font-sans cursor-pointer text-[11px]"
                            id="btn_copy_qr_payload"
                          >
                            {copiedQrData ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400 font-semibold">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy Raw</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                      <pre className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-[11px] font-mono text-amber-300/90 overflow-x-auto max-h-28 whitespace-pre-wrap break-all select-all" id="qr_raw_data_pre">
                        {getQrPayload(qrModalInscription, qrDataType)}
                      </pre>
                    </div>
                  </div>
                )}

                {/* Modal Body: History Tab */}
                {qrActiveTab === "history" && (
                  <div className="p-6 flex flex-col gap-4 max-h-[480px] overflow-y-auto" id="qr_modal_history_view">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <History className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-bold text-white font-mono">
                          Last 5 Generated QR Codes
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Sort Dropdown */}
                        <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1" id="qr_history_sort_wrapper">
                          <ArrowUpDown className="w-3 h-3 text-amber-400 shrink-0" />
                          <span className="text-[10px] text-slate-400 font-mono">Sort:</span>
                          <select
                            value={qrHistorySortBy}
                            onChange={(e) => setQrHistorySortBy(e.target.value as "timestamp" | "ticker")}
                            className="bg-transparent text-[11px] font-mono text-amber-300 focus:outline-none cursor-pointer"
                            id="qr_history_sort_dropdown"
                          >
                            <option value="timestamp" className="bg-slate-900 text-slate-200">Timestamp</option>
                            <option value="ticker" className="bg-slate-900 text-slate-200">Ticker Label</option>
                          </select>
                        </div>

                        {/* Copy Selected Payload Button */}
                        <button
                          onClick={() => {
                            if (selectedHistoryItem) {
                              navigator.clipboard.writeText(selectedHistoryItem.payload);
                              setCopiedSelectedPayload(true);
                              setTimeout(() => setCopiedSelectedPayload(false), 2000);
                            }
                          }}
                          disabled={!selectedHistoryItem}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition-all border cursor-pointer ${
                            copiedSelectedPayload
                              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                              : "bg-amber-500 hover:bg-amber-400 text-slate-950 border-amber-400 shadow-sm"
                          } disabled:opacity-40 disabled:cursor-not-allowed`}
                          id="btn_copy_selected_history_payload"
                          title={
                            selectedHistoryItem
                              ? `Copy payload for #${selectedHistoryItem.number} ($${selectedHistoryItem.ticker.toUpperCase()})`
                              : "No history item available"
                          }
                        >
                          {copiedSelectedPayload ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-slate-950 shrink-0" />
                              <span>Copy Payload</span>
                            </>
                          )}
                        </button>

                        {qrHistory.length > 0 && (
                          <button
                            onClick={() => {
                              setQrHistory([]);
                              setSelectedHistoryItemId(null);
                            }}
                            className="text-[11px] text-rose-400 hover:text-rose-300 font-mono underline cursor-pointer"
                            id="btn_clear_qr_history"
                          >
                            Clear History
                          </button>
                        )}
                      </div>
                    </div>

                    {qrHistory.length === 0 ? (
                      <div className="flex flex-col items-center justify-center p-8 bg-slate-950/60 border border-slate-800 rounded-xl text-center gap-2">
                        <History className="w-8 h-8 text-slate-600 mb-1" />
                        <p className="text-xs font-semibold text-slate-300">No QR Code History Yet</p>
                        <p className="text-[11px] text-slate-500 max-w-xs font-mono">
                          QR code payloads you view or customize will automatically be saved here (up to 5 recent items).
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        {sortedQrHistory.map((item, idx) => {
                          const isCurrentActive =
                            qrModalInscription?.id === item.inscriptionId && qrDataType === item.dataType;
                          const isSelected = selectedHistoryItem?.id === item.id;

                          return (
                            <div
                              key={item.id}
                              onClick={() => setSelectedHistoryItemId(item.id)}
                              className={`p-3.5 rounded-xl border transition-all flex flex-col gap-2.5 cursor-pointer ${
                                isSelected
                                  ? "bg-amber-950/30 border-amber-500/80 ring-1 ring-amber-500/40 shadow-md"
                                  : isCurrentActive
                                  ? "bg-amber-950/20 border-amber-500/40"
                                  : "bg-slate-950/80 border-slate-800 hover:border-slate-700"
                              }`}
                              id={`qr_history_item_${idx}`}
                            >
                              <div className="flex items-center justify-between flex-wrap gap-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-white font-mono">
                                    #{item.number} (${item.ticker.toUpperCase()})
                                  </span>
                                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-amber-500/20 font-semibold">
                                    {item.dataType === "protocol"
                                      ? "BRC-20 Payload"
                                      : item.dataType === "txhash"
                                      ? "Bitcoin URI"
                                      : "Full JSON"}
                                  </span>
                                  {isCurrentActive && (
                                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                      Active
                                    </span>
                                  )}
                                  {isSelected && (
                                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                                      Selected
                                    </span>
                                  )}
                                </div>
                                <span className="text-[10px] font-mono text-slate-500">
                                  {item.timestamp}
                                </span>
                              </div>

                              {/* Payload code snippet */}
                              <pre className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-[10px] font-mono text-amber-200/90 overflow-x-auto max-h-20 whitespace-pre-wrap break-all select-all">
                                {item.payload}
                              </pre>

                              {/* Actions */}
                              <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-900 flex-wrap">
                                <button
                                  onClick={() => {
                                    setQrModalInscription(item.inscription);
                                    setQrDataType(item.dataType);
                                    setQrActiveTab("generator");
                                  }}
                                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-[11px] font-bold font-mono transition-all cursor-pointer shadow-sm"
                                  id={`btn_regenerate_qr_${idx}`}
                                >
                                  <QrCode className="w-3 h-3 text-slate-950" />
                                  <span>Regenerate / Load QR</span>
                                </button>

                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => {
                                      let minified = item.payload;
                                      try {
                                        minified = JSON.stringify(JSON.parse(item.payload));
                                      } catch (e) {
                                        minified = item.payload.replace(/\s+/g, "");
                                      }
                                      navigator.clipboard.writeText(minified);
                                      setCopiedHistoryId(`${item.id}-min`);
                                      setTimeout(() => setCopiedHistoryId(null), 2000);
                                    }}
                                    className="inline-flex items-center gap-1 text-[10px] font-mono text-purple-300 hover:text-purple-200 bg-purple-950/40 hover:bg-purple-900/60 px-2 py-1 rounded border border-purple-500/30 transition-all cursor-pointer"
                                    id={`btn_copy_minified_history_${idx}`}
                                  >
                                    {copiedHistoryId === `${item.id}-min` ? (
                                      <>
                                        <Check className="w-3 h-3 text-emerald-400" />
                                        <span className="text-emerald-300">Minified Copied</span>
                                      </>
                                    ) : (
                                      <>
                                        <Code className="w-3 h-3" />
                                        <span>Copy Minified</span>
                                      </>
                                    )}
                                  </button>

                                  <button
                                    onClick={() => {
                                      navigator.clipboard.writeText(item.payload);
                                      setCopiedHistoryId(`${item.id}-raw`);
                                      setTimeout(() => setCopiedHistoryId(null), 2000);
                                    }}
                                    className="inline-flex items-center gap-1 text-[10px] font-mono text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 transition-all cursor-pointer"
                                    id={`btn_copy_raw_history_${idx}`}
                                  >
                                    {copiedHistoryId === `${item.id}-raw` ? (
                                      <>
                                        <Check className="w-3 h-3 text-emerald-400" />
                                        <span className="text-emerald-400">Copied!</span>
                                      </>
                                    ) : (
                                      <>
                                        <Copy className="w-3 h-3" />
                                        <span>Copy Raw</span>
                                      </>
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Modal Footer Actions */}
                <div className="px-6 py-4 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between gap-3 flex-wrap" id="qr_modal_footer">
                  <div className="flex items-center gap-3 flex-wrap">
                    <button
                      onClick={handleCopyMinifiedJson}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold font-mono transition-all shadow-md shadow-purple-600/30 cursor-pointer"
                      id="copy_minified_json_footer_btn"
                      title="Minify BRC-20 payload and copy to clipboard"
                    >
                      {copiedMinifiedJson ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-300" />
                          <span className="text-emerald-200">Copied Minified JSON!</span>
                        </>
                      ) : (
                        <>
                          <Code className="w-4 h-4 text-purple-200" />
                          <span>Copy JSON</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleDownloadPng}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold font-mono transition-all shadow-md shadow-amber-500/10 cursor-pointer"
                      id="download_png_btn"
                    >
                      <Download className="w-4 h-4 text-slate-950" />
                      Download PNG
                    </button>
                    <button
                      onClick={handleShareQr}
                      className="inline-flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold font-mono transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
                      id="share_qr_btn"
                      title="Share QR code image or payload link via Web Share API"
                    >
                      <Share2 className="w-3.5 h-3.5 text-white" />
                      <span>Share</span>
                    </button>
                    <button
                      onClick={() => {
                        const svg = document.getElementById("inscription-qr-code-svg");
                        if (!svg) return;
                        const svgData = new XMLSerializer().serializeToString(svg);
                        const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
                        const svgUrl = URL.createObjectURL(svgBlob);
                        const downloadLink = document.createElement("a");
                        downloadLink.href = svgUrl;
                        downloadLink.download = `brc20_inscription_${qrModalInscription.number}_qr.svg`;
                        document.body.appendChild(downloadLink);
                        downloadLink.click();
                        document.body.removeChild(downloadLink);
                      }}
                      className="inline-flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-medium font-mono transition-all border border-slate-700 cursor-pointer"
                      id="download_qr_svg_btn"
                    >
                      <Download className="w-3.5 h-3.5 text-amber-400" />
                      SVG
                    </button>
                    <label
                      className="inline-flex items-center gap-2 text-xs font-mono text-slate-300 cursor-pointer select-none pl-2 border-l border-slate-800 hover:text-white transition-colors"
                      id="auto_save_qr_label"
                    >
                      <input
                        type="checkbox"
                        checked={autoSaveQr}
                        onChange={(e) => setAutoSaveQr(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-amber-500/50 cursor-pointer accent-amber-500"
                        id="auto_save_qr_checkbox"
                      />
                      <span>Auto-save on generate</span>
                    </label>
                  </div>
                  <button
                    onClick={() => setQrModalInscription(null)}
                    className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs font-mono transition-all border border-slate-700 cursor-pointer"
                    id="close_qr_modal_btn"
                  >
                    Done
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Code Modal Overlay for B20 Integrations */}
        <AnimatePresence>
          {codeModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md" id="code_modal_backdrop">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                id="code_modal_card"
              >
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
                  <div className="flex items-center gap-2">
                    <Code className="w-5 h-5 text-blue-400" />
                    <h3 className="font-bold text-white text-sm">
                      {codeSnippetType === "viem_pay" ? "Accept B20 Payments with Memos (Viem)" : "Base B20 Smart Contract (Solidity)"}
                    </h3>
                  </div>
                  <button
                    onClick={() => setCodeModalOpen(false)}
                    className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Tab Switcher */}
                <div className="px-6 pt-4 flex gap-2 flex-wrap">
                  <button
                    onClick={() => setCodeSnippetType("viem_pay")}
                    className={`py-1.5 px-3 rounded-lg text-xs font-mono transition-all border cursor-pointer ${
                      codeSnippetType === "viem_pay"
                        ? "bg-blue-600 text-white border-blue-500 font-bold"
                        : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
                    }`}
                  >
                    pay-with-memo.js (Viem + B20)
                  </button>
                  <button
                    onClick={() => setCodeSnippetType("solidity_b20")}
                    className={`py-1.5 px-3 rounded-lg text-xs font-mono transition-all border cursor-pointer ${
                      codeSnippetType === "solidity_b20"
                        ? "bg-blue-600 text-white border-blue-500 font-bold"
                        : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
                    }`}
                  >
                    BaseB20Token.sol (Solidity)
                  </button>
                  <button
                    onClick={() => setCodeSnippetType("viem_airdrop")}
                    className={`py-1.5 px-3 rounded-lg text-xs font-mono transition-all border cursor-pointer ${
                      codeSnippetType === "viem_airdrop"
                        ? "bg-purple-600 text-white border-purple-500 font-bold"
                        : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
                    }`}
                  >
                    batch-airdrop.js (Viem)
                  </button>
                </div>

                {/* Code Content */}
                <div className="p-6 flex flex-col gap-3">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-mono text-[11px] text-slate-500">
                      {codeSnippetType === "viem_pay" && "Client-side / Node.js payment reconciliation"}
                      {codeSnippetType === "solidity_b20" && "OpenZeppelin derived ERC-20 superset contract"}
                      {codeSnippetType === "viem_airdrop" && "Batch transfer script with memo logging & event verification"}
                    </span>
                    <button
                      onClick={() => {
                        const codeText = codeSnippetType === "viem_pay"
                          ? VIEM_PAYMENT_CODE_SNIPPET
                          : codeSnippetType === "solidity_b20"
                          ? SOLIDITY_B20_CODE_SNIPPET
                          : VIEM_AIRDROP_CODE_SNIPPET;
                        navigator.clipboard.writeText(codeText);
                        setCopiedSnippet(true);
                        setTimeout(() => setCopiedSnippet(false), 2000);
                      }}
                      className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-mono flex items-center gap-1.5 border border-slate-700 transition-all cursor-pointer"
                    >
                      {copiedSnippet ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-300" />
                          <span>Copy Code</span>
                        </>
                      )}
                    </button>
                  </div>

                  <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-emerald-300/90 overflow-x-auto max-h-96 whitespace-pre leading-relaxed select-all">
                    {codeSnippetType === "viem_pay" && VIEM_PAYMENT_CODE_SNIPPET}
                    {codeSnippetType === "solidity_b20" && SOLIDITY_B20_CODE_SNIPPET}
                    {codeSnippetType === "viem_airdrop" && VIEM_AIRDROP_CODE_SNIPPET}
                  </pre>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-slate-950/60 border-t border-slate-800 flex justify-end">
                  <button
                    onClick={() => setCodeModalOpen(false)}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs font-mono transition-all cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Farcaster Login & Profile Modal Overlay */}
        <AnimatePresence>
          {isFcModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md" id="farcaster_modal_backdrop">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="bg-slate-900 border border-purple-900/60 w-full max-w-xl rounded-2xl shadow-2xl shadow-purple-950/40 overflow-hidden flex flex-col"
                id="farcaster_modal_card"
              >
                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-purple-900/40 flex items-center justify-between bg-purple-950/30">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-purple-600 flex items-center justify-center text-white font-black text-xs shadow-md shadow-purple-600/30">
                      FC
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm flex items-center gap-2">
                        Farcaster Authentication
                        <span className="text-[10px] bg-purple-900/80 text-purple-200 border border-purple-500/30 px-2 py-0.5 rounded-full font-mono">
                          Base MiniApp
                        </span>
                      </h3>
                      <p className="text-[11px] text-purple-300/70">
                        {isInMiniAppFrame ? "Detected in Base MiniApp Frame" : "Connect your Farcaster identity & social graph"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsFcModalOpen(false)}
                    className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
                    id="close_fc_modal_btn"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="p-6 flex flex-col gap-6 max-h-[80vh] overflow-y-auto">
                  {farcasterUser ? (
                    /* Connected User View */
                    <div className="flex flex-col gap-5">
                      {/* User Header Profile Card */}
                      <div className="p-4 bg-purple-950/40 border border-purple-800/40 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3.5">
                          <img
                            src={farcasterUser.pfpUrl || "https://i.imgur.com/39wH8y2.jpg"}
                            alt={farcasterUser.username}
                            className="w-14 h-14 rounded-2xl object-cover border-2 border-purple-500/50 shadow-md"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/identicon/svg?seed=${farcasterUser.username}`;
                            }}
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-white text-base">{farcasterUser.displayName}</h4>
                              <span className="text-xs text-purple-300 font-mono">@{farcasterUser.username}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[11px] font-mono bg-purple-900/60 text-purple-200 px-2 py-0.5 rounded-md border border-purple-700/50">
                                FID #{farcasterUser.fid}
                              </span>
                              {farcasterUser.verifications && farcasterUser.verifications.length > 0 && (
                                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                  Verified Address
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={handleFarcasterLogout}
                          className="px-3.5 py-2 bg-rose-950/60 hover:bg-rose-900/80 border border-rose-800/50 text-rose-300 hover:text-white text-xs font-bold font-mono rounded-xl transition-all flex items-center gap-1.5 cursor-pointer self-end sm:self-center"
                          id="fc_logout_btn"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Disconnect</span>
                        </button>
                      </div>

                      {/* Bio & Details */}
                      {farcasterUser.bio && (
                        <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800/80 leading-relaxed font-sans">
                          {farcasterUser.bio}
                        </p>
                      )}

                      {/* Stats & Custody Address */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col gap-0.5">
                          <span className="text-[10px] text-slate-400">Followers</span>
                          <span className="font-bold text-purple-300 text-sm">
                            {(farcasterUser.followerCount || 1420).toLocaleString()}
                          </span>
                        </div>
                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col gap-0.5">
                          <span className="text-[10px] text-slate-400">Following</span>
                          <span className="font-bold text-purple-300 text-sm">
                            {(farcasterUser.followingCount || 450).toLocaleString()}
                          </span>
                        </div>
                        <div className="col-span-2 sm:col-span-1 bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col gap-0.5">
                          <span className="text-[10px] text-slate-400">Custody Wallet</span>
                          <span className="font-bold text-purple-200 text-xs truncate" title={farcasterUser.custodyAddress}>
                            {farcasterUser.custodyAddress
                              ? `${farcasterUser.custodyAddress.slice(0, 6)}...${farcasterUser.custodyAddress.slice(-4)}`
                              : "0x71C...976F"}
                          </span>
                        </div>
                      </div>

                      {/* Share Portfolio to Warpcast CTA */}
                      <div className="p-4 bg-gradient-to-r from-purple-950/80 to-indigo-950/80 border border-purple-500/30 rounded-2xl flex flex-col gap-3">
                        <div className="flex items-center gap-2 text-purple-200 text-xs font-bold">
                          <Sparkles className="w-4 h-4 text-purple-400" />
                          <span>Cast BRC-20 Highlights on Warpcast</span>
                        </div>
                        <p className="text-[11px] text-purple-300/80 leading-snug">
                          Share your active BRC-20 inscriptions, token balances, and Base B20 payment orders directly to your Farcaster feed.
                        </p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              handleShareToWarpcast(
                                `🚀 Tracking BRC-20 & Base B20 tokens on Base MiniApp!\n\nOverall Balance: ${stats.totalVolume.toLocaleString()} units\nInscriptions Logged: ${stats.totalInscriptions}\n\nBuilt on Base with @farcaster/miniapp-sdk!`
                              )
                            }
                            className="flex-1 py-2 px-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold font-mono transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                            id="fc_cast_portfolio_btn"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Share Activity on Warpcast</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Login Options View */
                    <div className="flex flex-col gap-6">
                      {/* One-Click Quick Login */}
                      <div className="flex flex-col gap-2.5">
                        <label className="text-xs font-mono font-bold text-slate-300 flex items-center justify-between">
                          <span>Quick Sign-In (Select Farcaster Profile)</span>
                          <span className="text-[10px] text-purple-400 font-normal">Farcaster Auth standard</span>
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {SAMPLE_FARCASTER_PROFILES.map((profile) => (
                            <button
                              key={`fc_sample_${profile.fid}`}
                              onClick={() => handleFarcasterLogin(profile)}
                              className="p-3 bg-slate-950 hover:bg-purple-950/40 border border-slate-800 hover:border-purple-500/50 rounded-xl transition-all flex items-center gap-3 text-left group cursor-pointer"
                              id={`fc_login_btn_${profile.username}`}
                            >
                              <img
                                src={profile.pfpUrl}
                                alt={profile.username}
                                className="w-10 h-10 rounded-xl object-cover border border-slate-700 group-hover:border-purple-400"
                              />
                              <div className="overflow-hidden">
                                <p className="font-bold text-white text-xs truncate group-hover:text-purple-200">
                                  {profile.displayName}
                                </p>
                                <p className="text-[11px] text-slate-400 font-mono truncate">@{profile.username}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Custom Search Form */}
                      <form onSubmit={handleSearchCustomFarcasterUser} className="flex flex-col gap-2">
                        <label className="text-xs font-mono font-bold text-slate-300">
                          Or Lookup Custom Farcaster Handle or FID
                        </label>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <AtSign className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                            <input
                              type="text"
                              value={fcSearchQuery}
                              onChange={(e) => setFcSearchQuery(e.target.value)}
                              placeholder="e.g. jessepollak or FID 9152..."
                              className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl pl-9 pr-3 py-2.5 text-xs font-mono text-white placeholder-slate-500 outline-none transition-all"
                              id="fc_custom_username_input"
                            />
                          </div>
                          <button
                            type="submit"
                            disabled={isFcSearching || !fcSearchQuery.trim()}
                            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold font-mono text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer"
                            id="fc_custom_search_btn"
                          >
                            {isFcSearching ? (
                              <span className="animate-pulse">Loading...</span>
                            ) : (
                              <>
                                <Search className="w-3.5 h-3.5" />
                                <span>Sign In</span>
                              </>
                            )}
                          </button>
                        </div>
                      </form>

                      {/* MiniApp Frame Info Card */}
                      <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-400 flex items-start gap-3">
                        <Info className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                        <p className="leading-relaxed">
                          When running inside the Base App or Warpcast MiniApp client, Farcaster authentication and wallet context are resolved automatically via the <code className="text-purple-300 font-mono">@farcaster/miniapp-sdk</code> context.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-4 bg-purple-950/20 border-t border-purple-900/40 flex justify-end">
                  <button
                    onClick={() => setIsFcModalOpen(false)}
                    className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs font-mono transition-all cursor-pointer"
                    id="fc_modal_close_footer_btn"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Farcaster Toast Alerts */}
        <AnimatePresence>
          {fcToast && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-2xl border text-xs font-mono flex items-center gap-3 ${
                fcToast.type === "success"
                  ? "bg-purple-950/90 border-purple-500/60 text-purple-100 shadow-purple-950/50"
                  : "bg-rose-950/90 border-rose-500/60 text-rose-100 shadow-rose-950/50"
              }`}
              id="fc_toast_notification"
            >
              <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-white text-[11px] font-bold">
                FC
              </div>
              <span>{fcToast.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950 py-6 px-4 md:px-8 text-center text-xs text-slate-600" id="app_footer">
        <p>© 2026 BRC-20 Ledger Dashboard. Experimental Bitcoin Token Standard Client Sandboxed Sandbox Environment.</p>
      </footer>
    </div>
  );
}
