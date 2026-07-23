"use client";

import React, { useState, useEffect } from "react";
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
  X,
  Copy,
  Check,
  Code2,
  Palette,
  Blocks,
  Layers,
  Globe,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  RefreshCw,
  ExternalLink,
  Share2,
  ChevronRight,
  Cpu
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import Sparkline from "@/components/Sparkline";

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

interface BaseBlock {
  number: number;
  hash: string;
  txCount: number;
  gasUsed: string;
  gasLimit: string;
  timestamp: string;
  sequencer: string;
}

interface BaseTx {
  hash: string;
  blockNumber: number;
  from: string;
  fromBasename?: string;
  to: string;
  toBasename?: string;
  value: string;
  method: "swap" | "transfer" | "mint" | "wallet_sendCalls" | "paymaster_sponsor";
  status: "success" | "pending";
  gasFee: string;
  sponsored: boolean;
  timestamp: string;
}

interface BaseEcosystemToken {
  name: string;
  symbol: string;
  address: string;
  decimals: number;
  priceUsd: string;
  volume24h: string;
  holders: number;
  category: "DeFi" | "Meme" | "AI" | "Infra";
  logoColor: string;
}

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

const INITIAL_BASE_BLOCKS: BaseBlock[] = [
  {
    number: 20491832,
    hash: "0x89f2a410b8d34e9f012c87b4129e09d8e7c2a101",
    txCount: 42,
    gasUsed: "3.42 M (22.8%)",
    gasLimit: "15.00 M",
    timestamp: "1 sec ago",
    sequencer: "Base Sequencer Node 01"
  },
  {
    number: 20491831,
    hash: "0x12c4b8e90a1f2e3d4c5b6a7f8e9d0c1b2a3f98b0",
    txCount: 38,
    gasUsed: "2.95 M (19.6%)",
    gasLimit: "15.00 M",
    timestamp: "3 secs ago",
    sequencer: "Base Sequencer Node 01"
  },
  {
    number: 20491830,
    hash: "0x4e8d2c10a3f98b7c6d5e4f3a2b1c0d9e8f7a45a1",
    txCount: 56,
    gasUsed: "4.81 M (32.0%)",
    gasLimit: "15.00 M",
    timestamp: "5 secs ago",
    sequencer: "Base Sequencer Node 02"
  },
  {
    number: 20491829,
    hash: "0x7a3f9e01b2c4d5e6f7a8b9c0d1e2f3a4b5c612e8",
    txCount: 29,
    gasUsed: "2.10 M (14.0%)",
    gasLimit: "15.00 M",
    timestamp: "7 secs ago",
    sequencer: "Base Sequencer Node 01"
  },
  {
    number: 20491828,
    hash: "0x3b1c8e90f2a4b5c6d7e8f9a0b1c2d3e4f5a689d3",
    txCount: 64,
    gasUsed: "5.30 M (35.3%)",
    gasLimit: "15.00 M",
    timestamp: "9 secs ago",
    sequencer: "Base Sequencer Node 03"
  }
];

const INITIAL_BASE_TXS: BaseTx[] = [
  {
    hash: "0x9a8f2e1b4c7d6e5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f10",
    blockNumber: 20491832,
    from: "0x3a429f0a12b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7",
    fromBasename: "jesse.base",
    to: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    toBasename: "usdc.base",
    value: "250.00 USDC",
    method: "transfer",
    status: "success",
    gasFee: "$0.0001 (0.00000003 ETH)",
    sponsored: true,
    timestamp: "1 sec ago"
  },
  {
    hash: "0x4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a9b8c7d6e5f4a3b21",
    blockNumber: 20491832,
    from: "0x18b2209f89a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5",
    fromBasename: "buildonbase.base",
    to: "0xc30141B657f4216252dc59Af2e7CdB9D8792e1B0",
    toBasename: "aerodrome.base",
    value: "1.25 ETH",
    method: "swap",
    status: "success",
    gasFee: "$0.0003 (0.0000001 ETH)",
    sponsored: false,
    timestamp: "2 secs ago"
  },
  {
    hash: "0x7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e",
    blockNumber: 20491831,
    from: "0x892a1a11b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7",
    fromBasename: "coinbase.base",
    to: "0x0000000000770505b2628e83042079c657930928",
    toBasename: "paymaster.base",
    value: "0.00 ETH",
    method: "paymaster_sponsor",
    status: "success",
    gasFee: "$0.0000 (Gas Sponsored)",
    sponsored: true,
    timestamp: "3 secs ago"
  },
  {
    hash: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
    blockNumber: 20491830,
    from: "0x5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a",
    fromBasename: "alice.base",
    to: "0x532f27101965dd16442E59d40670FaF5eBB142E4",
    toBasename: "brett.base",
    value: "5,000 BRETT",
    method: "wallet_sendCalls",
    status: "success",
    gasFee: "$0.0002 (Batch Call)",
    sponsored: true,
    timestamp: "5 secs ago"
  },
  {
    hash: "0x8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a",
    blockNumber: 20491829,
    from: "0x2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f",
    fromBasename: "degen.base",
    to: "0x4ed4E862860beD51a9570b96d89af5E1B0Efefed",
    toBasename: "degentoken.base",
    value: "12,500 DEGEN",
    method: "mint",
    status: "success",
    gasFee: "$0.0001 (0.00000004 ETH)",
    sponsored: true,
    timestamp: "7 secs ago"
  }
];

const INITIAL_BASE_TOKENS: BaseEcosystemToken[] = [
  {
    name: "USD Coin",
    symbol: "USDC",
    address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    decimals: 6,
    priceUsd: "$1.00",
    volume24h: "$182,400,000",
    holders: 1240500,
    category: "DeFi",
    logoColor: "bg-blue-500"
  },
  {
    name: "Aerodrome Finance",
    symbol: "AERO",
    address: "0x940181a94A35A4569E4529A3CDfB74e38FD98631",
    decimals: 18,
    priceUsd: "$1.24",
    volume24h: "$42,100,000",
    holders: 184200,
    category: "DeFi",
    logoColor: "bg-sky-500"
  },
  {
    name: "BRETT",
    symbol: "BRETT",
    address: "0x532f27101965dd16442E59d40670FaF5eBB142E4",
    decimals: 18,
    priceUsd: "$0.142",
    volume24h: "$28,900,000",
    holders: 310500,
    category: "Meme",
    logoColor: "bg-emerald-500"
  },
  {
    name: "DEGEN",
    symbol: "DEGEN",
    address: "0x4ed4E862860beD51a9570b96d89af5E1B0Efefed",
    decimals: 18,
    priceUsd: "$0.0089",
    volume24h: "$15,800,000",
    holders: 245000,
    category: "Meme",
    logoColor: "bg-purple-500"
  },
  {
    name: "Virtual Protocol",
    symbol: "VIRTUAL",
    address: "0x0b3e328455c4059EEb9e3f84b5543F74E24e7E1b",
    decimals: 18,
    priceUsd: "$1.85",
    volume24h: "$34,200,000",
    holders: 98400,
    category: "AI",
    logoColor: "bg-indigo-500"
  },
  {
    name: "TOSHI",
    symbol: "TOSHI",
    address: "0xAC1Bd2486aAf3B5C0fc3Fd868558b082a531B2B4",
    decimals: 18,
    priceUsd: "$0.00031",
    volume24h: "$8,100,000",
    holders: 112000,
    category: "Meme",
    logoColor: "bg-blue-400"
  }
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<"tokens" | "inscriptions" | "ledger" | "base">("tokens");
  const [searchQuery, setSearchQuery] = useState("");
  const [mintFilter, setMintFilter] = useState<"all" | "completed" | "inprogress">("all");

  // Main Persistent State
  const [tokens, setTokens] = useState<BRC20Token[]>(INITIAL_TOKENS);
  const [inscriptions, setInscriptions] = useState<Inscription[]>(INITIAL_INSCRIPTIONS);
  const [ledger, setLedger] = useState<LedgerBalance[]>(INITIAL_LEDGER);

  // Base Blockchain Explorer state
  const [baseBlocks, setBaseBlocks] = useState<BaseBlock[]>(INITIAL_BASE_BLOCKS);
  const [baseTxs, setBaseTxs] = useState<BaseTx[]>(INITIAL_BASE_TXS);
  const [baseSubTab, setBaseSubTab] = useState<"txs" | "blocks" | "tokens" | "paymaster">("txs");
  const [baseSearchQuery, setBaseSearchQuery] = useState("");
  const [baseChainId, setBaseChainId] = useState<8453 | 84532>(8453); // 8453: Base Mainnet, 84532: Base Sepolia

  // Base Inspector Modals
  const [inspectTx, setInspectTx] = useState<BaseTx | null>(null);
  const [inspectBlock, setInspectBlock] = useState<BaseBlock | null>(null);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  // Real-time Base L2 Block & Tx ticker simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setBaseBlocks((prevBlocks) => {
        const topBlockNum = prevBlocks.length > 0 ? prevBlocks[0].number + 1 : 20491833;
        const randomHex = () => Math.random().toString(16).substring(2, 10);
        const newBlock: BaseBlock = {
          number: topBlockNum,
          hash: `0x${randomHex()}${randomHex()}${randomHex()}${randomHex()}`,
          txCount: Math.floor(Math.random() * 40) + 15,
          gasUsed: `${(Math.random() * 3 + 2).toFixed(2)} M (${(Math.random() * 15 + 15).toFixed(1)}%)`,
          gasLimit: "15.00 M",
          timestamp: "Just now",
          sequencer: `Base Sequencer Node 0${Math.floor(Math.random() * 3) + 1}`
        };
        return [newBlock, ...prevBlocks.slice(0, 9)];
      });

      setBaseTxs((prevTxs) => {
        const randomHex = () => Math.random().toString(16).substring(2, 10);
        const basenames = ["alex.base", "coinbase.base", "buildonbase.base", "jesse.base", "farcaster.base", "brian.base"];
        const methods: BaseTx["method"][] = ["swap", "transfer", "mint", "wallet_sendCalls", "paymaster_sponsor"];
        const pickMethod = methods[Math.floor(Math.random() * methods.length)];
        const pickFrom = basenames[Math.floor(Math.random() * basenames.length)];

        const newTx: BaseTx = {
          hash: `0x${randomHex()}${randomHex()}${randomHex()}${randomHex()}${randomHex()}`,
          blockNumber: baseBlocks.length > 0 ? baseBlocks[0].number : 20491833,
          from: `0x${randomHex()}${randomHex()}${randomHex()}`,
          fromBasename: pickFrom,
          to: `0x${randomHex()}${randomHex()}${randomHex()}`,
          toBasename: "contract.base",
          value: pickMethod === "swap" ? `${(Math.random() * 2 + 0.1).toFixed(2)} ETH` : `${Math.floor(Math.random() * 500 + 10)} USDC`,
          method: pickMethod,
          status: "success",
          gasFee: pickMethod === "paymaster_sponsor" ? "$0.0000 (Gas Sponsored)" : "$0.0001 (0.00000003 ETH)",
          sponsored: Math.random() > 0.3,
          timestamp: "Just now"
        };
        return [newTx, ...prevTxs.slice(0, 14)];
      });
    }, 6000);

    return () => clearInterval(interval);
  }, [baseBlocks]);

  // Inscribe simulator fields
  const [simTicker, setSimTicker] = useState("base");
  const [simAmount, setSimAmount] = useState<number>(1000);
  const [simOp, setSimOp] = useState<"mint" | "transfer">("mint");
  const [simSuccessMsg, setSimSuccessMsg] = useState<string | null>(null);

  // QR Code Modal State
  const [qrModalInscription, setQrModalInscription] = useState<Inscription | null>(null);
  const [qrDataType, setQrDataType] = useState<"protocol" | "txhash" | "full">("protocol");
  const [qrFgColor, setQrFgColor] = useState("#000000");
  const [qrBgColor, setQrBgColor] = useState("#ffffff");
  const [copiedQrData, setCopiedQrData] = useState(false);

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

  // Stats Counters
  const [stats, setStats] = useState({
    totalInscriptions: INITIAL_INSCRIPTIONS.length,
    activeBalances: INITIAL_LEDGER.length,
    totalVolume: 3000
  });

  // Hydration & Storage sync
  useEffect(() => {
    const storedTokens = localStorage.getItem("brc20_tokens");
    const storedInscriptions = localStorage.getItem("brc20_inscriptions");
    const storedLedger = localStorage.getItem("brc20_ledger");

    if (storedTokens) setTokens(JSON.parse(storedTokens));
    if (storedInscriptions) setInscriptions(JSON.parse(storedInscriptions));
    if (storedLedger) setLedger(JSON.parse(storedLedger));
  }, []);

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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col" id="app_root_container">
      {/* Top Navigation / Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50 px-4 py-4 md:px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4" id="app_header">
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

        {/* Global Live Stats bar */}
        <div className="flex flex-wrap items-center gap-4 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-300" id="global_status_widget">
          <div className="flex items-center gap-1.5 border-r border-slate-800 pr-4">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-mono text-slate-400">BTC Height:</span>
            <span className="font-bold font-mono text-white">854,228</span>
          </div>
          <div className="flex items-center gap-1.5 border-r border-slate-800 pr-4">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="font-mono text-slate-400">Base L2:</span>
            <span className="font-bold font-mono text-blue-400">#{baseBlocks[0]?.number || 20491832}</span>
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
            <div className="flex items-center gap-1" id="tab_buttons_group">
              <button
                onClick={() => setActiveTab("tokens")}
                className={`flex items-center gap-2 py-2 px-4 rounded-xl text-xs font-medium transition-all ${
                  activeTab === "tokens"
                    ? "bg-slate-800 text-white shadow"
                    : "text-slate-400 hover:text-slate-200"
                }`}
                id="tab_btn_tokens"
              >
                <TrendingUp className="w-4 h-4" />
                Tokens
              </button>
              <button
                onClick={() => setActiveTab("inscriptions")}
                className={`flex items-center gap-2 py-2 px-4 rounded-xl text-xs font-medium transition-all ${
                  activeTab === "inscriptions"
                    ? "bg-slate-800 text-white shadow"
                    : "text-slate-400 hover:text-slate-200"
                }`}
                id="tab_btn_inscriptions"
              >
                <FileText className="w-4 h-4" />
                My Inscriptions
              </button>
              <button
                onClick={() => setActiveTab("ledger")}
                className={`flex items-center gap-2 py-2 px-4 rounded-xl text-xs font-medium transition-all ${
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
                onClick={() => setActiveTab("base")}
                className={`flex items-center gap-2 py-2 px-4 rounded-xl text-xs font-medium transition-all ${
                  activeTab === "base"
                    ? "bg-blue-600 text-white shadow shadow-blue-600/30 font-bold"
                    : "text-blue-400 hover:text-blue-300 hover:bg-blue-950/40"
                }`}
                id="tab_btn_base"
              >
                <Blocks className="w-4 h-4 text-blue-400" />
                Base L2
                <span className="text-[9px] bg-blue-500/20 border border-blue-400/30 text-blue-300 font-bold px-1.5 py-0.5 rounded-full uppercase">
                  Explorer
                </span>
              </button>
            </div>

            {/* Render conditional actions inside tab controls (like search or exports) */}
            <div className="flex items-center gap-2" id="conditional_controls">
              {activeTab === "tokens" && (
                <div className="relative w-full sm:w-48" id="search_input_container">
                  <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search ticker..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg py-1.5 pl-8 pr-3 text-xs text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-amber-500 font-mono"
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
                          <th className="py-3 px-6">Number / ID</th>
                          <th className="py-3 px-6">Ticker</th>
                          <th className="py-3 px-6">Op / Payload</th>
                          <th className="py-3 px-6">Amount</th>
                          <th className="py-3 px-6">Timestamp</th>
                          <th className="py-3 px-6">Tx Hash</th>
                          <th className="py-3 px-6 text-right">QR Code</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/55 text-xs text-slate-300">
                        {inscriptions.map((i) => (
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
                <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between" id="ledger_header">
                  <div className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-amber-500" />
                    <h3 className="font-semibold text-white">Your Account Balances</h3>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-950 text-slate-400 border border-slate-800 rounded">
                    Total: {ledger.length} assets
                  </span>
                </div>

                <div className="overflow-x-auto" id="ledger_table_container">
                  {ledger.length === 0 ? (
                    <div className="py-12 text-center text-slate-500 text-xs" id="no_ledger_found">
                      No active balances in your account. Mint some tokens!
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
                        {ledger.map((b) => (
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

            {/* 4. BASE L2 BLOCKCHAIN EXPLORER TAB */}
            {activeTab === "base" && (
              <div className="flex flex-col gap-6" id="base_tab_content">
                {/* Base Banner & Chain Selector */}
                <div className="bg-gradient-to-r from-blue-950/60 via-slate-900 to-slate-900 border border-blue-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden" id="base_banner_card">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white text-lg shadow-lg shadow-blue-600/30">
                        🔵
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-white">Base Layer-2 Blockchain</h3>
                          <span className="text-[10px] font-mono px-2 py-0.5 bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded-full font-semibold">
                            OP Stack L2
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-1">
                          Incubated by Coinbase. Fast, secure, sub-cent Ethereum L2 with native Basenames & Paymaster support.
                        </p>
                      </div>
                    </div>

                    {/* Chain ID Selector */}
                    <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 rounded-xl p-1.5 self-start md:self-auto" id="base_chain_selector">
                      <button
                        onClick={() => setBaseChainId(8453)}
                        className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                          baseChainId === 8453
                            ? "bg-blue-600 text-white shadow"
                            : "text-slate-400 hover:text-white"
                        }`}
                        id="btn_chain_mainnet"
                      >
                        Mainnet (8453)
                      </button>
                      <button
                        onClick={() => setBaseChainId(84532)}
                        className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                          baseChainId === 84532
                            ? "bg-blue-600 text-white shadow"
                            : "text-slate-400 hover:text-white"
                        }`}
                        id="btn_chain_sepolia"
                      >
                        Sepolia (84532)
                      </button>
                    </div>
                  </div>

                  {/* Base Network Key Metrics Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-800/80" id="base_metrics_grid">
                    <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-3">
                      <span className="text-[10px] font-mono text-slate-400 uppercase block">Latest L2 Block</span>
                      <span className="text-sm font-bold font-mono text-blue-400">#{baseBlocks[0]?.number || 20491832}</span>
                    </div>
                    <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-3">
                      <span className="text-[10px] font-mono text-slate-400 uppercase block">Average Gas Fee</span>
                      <span className="text-sm font-bold font-mono text-emerald-400">~0.001 Gwei ($0.0002)</span>
                    </div>
                    <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-3">
                      <span className="text-[10px] font-mono text-slate-400 uppercase block">Throughput</span>
                      <span className="text-sm font-bold font-mono text-white">38.4 TPS</span>
                    </div>
                    <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-3">
                      <span className="text-[10px] font-mono text-slate-400 uppercase block">Paymaster Status</span>
                      <span className="text-sm font-bold font-mono text-blue-300 flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> Active
                      </span>
                    </div>
                  </div>
                </div>

                {/* Base Explorer Sub-navigation & Search */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col gap-4" id="base_subnav_wrapper">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    {/* Sub tabs */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0" id="base_subtabs_group">
                      <button
                        onClick={() => setBaseSubTab("txs")}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                          baseSubTab === "txs"
                            ? "bg-blue-600/20 text-blue-300 border border-blue-500/40"
                            : "text-slate-400 hover:text-white bg-slate-950 border border-slate-800"
                        }`}
                        id="base_subtab_txs"
                      >
                        <Activity className="w-3.5 h-3.5 text-blue-400" />
                        Transactions ({baseTxs.length})
                      </button>
                      <button
                        onClick={() => setBaseSubTab("blocks")}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                          baseSubTab === "blocks"
                            ? "bg-blue-600/20 text-blue-300 border border-blue-500/40"
                            : "text-slate-400 hover:text-white bg-slate-950 border border-slate-800"
                        }`}
                        id="base_subtab_blocks"
                      >
                        <Blocks className="w-3.5 h-3.5 text-blue-400" />
                        L2 Blocks ({baseBlocks.length})
                      </button>
                      <button
                        onClick={() => setBaseSubTab("tokens")}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                          baseSubTab === "tokens"
                            ? "bg-blue-600/20 text-blue-300 border border-blue-500/40"
                            : "text-slate-400 hover:text-white bg-slate-950 border border-slate-800"
                        }`}
                        id="base_subtab_tokens"
                      >
                        <Coins className="w-3.5 h-3.5 text-blue-400" />
                        Ecosystem Tokens ({INITIAL_BASE_TOKENS.length})
                      </button>
                      <button
                        onClick={() => setBaseSubTab("paymaster")}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                          baseSubTab === "paymaster"
                            ? "bg-blue-600/20 text-blue-300 border border-blue-500/40"
                            : "text-slate-400 hover:text-white bg-slate-950 border border-slate-800"
                        }`}
                        id="base_subtab_paymaster"
                      >
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        Paymaster & EIP-5792
                      </button>
                    </div>

                    {/* Unified Base Search Input */}
                    <div className="relative w-full md:w-64" id="base_search_container">
                      <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
                      <input
                        type="text"
                        placeholder="Tx Hash / Basename / Block..."
                        value={baseSearchQuery}
                        onChange={(e) => setBaseSearchQuery(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-1.5 pl-8 pr-3 text-xs text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 font-mono"
                        id="base_search_input"
                      />
                    </div>
                  </div>
                </div>

                {/* Sub-tab Content: Transactions */}
                {baseSubTab === "txs" && (
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl" id="base_txs_container">
                    <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
                      <h4 className="text-xs font-semibold text-white flex items-center gap-2">
                        <Activity className="w-4 h-4 text-blue-400" />
                        Live Base L2 Transactions Feed
                      </h4>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Network: {baseChainId === 8453 ? "Base Mainnet" : "Base Sepolia"}
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse" id="base_txs_table">
                        <thead>
                          <tr className="border-b border-slate-800 text-[10px] text-slate-500 uppercase font-mono bg-slate-950/60">
                            <th className="py-3 px-4">Tx Hash</th>
                            <th className="py-3 px-4">Method</th>
                            <th className="py-3 px-4">From (Basename)</th>
                            <th className="py-3 px-4">To</th>
                            <th className="py-3 px-4 text-right">Value</th>
                            <th className="py-3 px-4 text-right">Gas Fee</th>
                            <th className="py-3 px-4 text-center">Inspect</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50 text-xs font-mono text-slate-300">
                          {baseTxs
                            .filter((tx) =>
                              tx.hash.toLowerCase().includes(baseSearchQuery.toLowerCase()) ||
                              tx.fromBasename?.toLowerCase().includes(baseSearchQuery.toLowerCase()) ||
                              tx.toBasename?.toLowerCase().includes(baseSearchQuery.toLowerCase()) ||
                              tx.method.toLowerCase().includes(baseSearchQuery.toLowerCase())
                            )
                            .map((tx) => (
                              <tr key={tx.hash} className="hover:bg-slate-950/30 transition-all" id={`base_tx_row_${tx.hash.slice(0, 10)}`}>
                                <td className="py-3.5 px-4 font-mono text-blue-400 flex items-center gap-1">
                                  <span>{tx.hash.slice(0, 10)}...{tx.hash.slice(-6)}</span>
                                </td>
                                <td className="py-3.5 px-4">
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                                    tx.method === "swap"
                                      ? "bg-purple-500/10 border-purple-500/30 text-purple-400"
                                      : tx.method === "transfer"
                                      ? "bg-sky-500/10 border-sky-500/30 text-sky-400"
                                      : tx.method === "wallet_sendCalls"
                                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                                      : tx.method === "paymaster_sponsor"
                                      ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                                      : "bg-blue-500/10 border-blue-500/30 text-blue-400"
                                  }`}>
                                    {tx.method}
                                  </span>
                                </td>
                                <td className="py-3.5 px-4 text-slate-200">
                                  <span className="text-blue-300 font-semibold">{tx.fromBasename || tx.from.slice(0, 8) + "..."}</span>
                                </td>
                                <td className="py-3.5 px-4 text-slate-400">
                                  <span>{tx.toBasename || tx.to.slice(0, 8) + "..."}</span>
                                </td>
                                <td className="py-3.5 px-4 text-right font-bold text-white">{tx.value}</td>
                                <td className="py-3.5 px-4 text-right">
                                  {tx.sponsored ? (
                                    <span className="text-[10px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded inline-flex items-center gap-1">
                                      <Zap className="w-2.5 h-2.5 fill-amber-400" /> $0.00
                                    </span>
                                  ) : (
                                    <span className="text-slate-400 text-[10px]">{tx.gasFee.split(" ")[0]}</span>
                                  )}
                                </td>
                                <td className="py-3.5 px-4 text-center">
                                  <button
                                    onClick={() => setInspectTx(tx)}
                                    className="p-1.5 bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-300 rounded-lg transition-all cursor-pointer"
                                    title="Inspect Base Transaction Details"
                                  >
                                    <ArrowUpRight className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Sub-tab Content: Blocks */}
                {baseSubTab === "blocks" && (
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl" id="base_blocks_container">
                    <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
                      <h4 className="text-xs font-semibold text-white flex items-center gap-2">
                        <Blocks className="w-4 h-4 text-blue-400" />
                        Base L2 Block Stream
                      </h4>
                      <span className="text-[10px] text-slate-400 font-mono">Block Time: ~2.0 seconds</span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse" id="base_blocks_table">
                        <thead>
                          <tr className="border-b border-slate-800 text-[10px] text-slate-500 uppercase font-mono bg-slate-950/60">
                            <th className="py-3 px-4">Block #</th>
                            <th className="py-3 px-4">Block Hash</th>
                            <th className="py-3 px-4 text-center">Tx Count</th>
                            <th className="py-3 px-4">Gas Used / Limit</th>
                            <th className="py-3 px-4">Sequencer Node</th>
                            <th className="py-3 px-4 text-right">Age</th>
                            <th className="py-3 px-4 text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50 text-xs font-mono text-slate-300">
                          {baseBlocks.map((blk) => (
                            <tr key={blk.number} className="hover:bg-slate-950/30 transition-all" id={`base_blk_row_${blk.number}`}>
                              <td className="py-3.5 px-4 font-bold text-blue-400">#{blk.number}</td>
                              <td className="py-3.5 px-4 text-slate-400">{blk.hash.slice(0, 12)}...{blk.hash.slice(-6)}</td>
                              <td className="py-3.5 px-4 text-center font-bold text-white">{blk.txCount} txs</td>
                              <td className="py-3.5 px-4 text-slate-300">{blk.gasUsed}</td>
                              <td className="py-3.5 px-4 text-slate-400 text-[11px]">{blk.sequencer}</td>
                              <td className="py-3.5 px-4 text-right text-slate-500 text-[10px]">{blk.timestamp}</td>
                              <td className="py-3.5 px-4 text-center">
                                <button
                                  onClick={() => setInspectBlock(blk)}
                                  className="p-1.5 bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white rounded-lg transition-all cursor-pointer"
                                  title="View Block Summary"
                                >
                                  <ArrowUpRight className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Sub-tab Content: Ecosystem Tokens */}
                {baseSubTab === "tokens" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4" id="base_tokens_grid">
                    {INITIAL_BASE_TOKENS.map((token) => (
                      <div
                        key={token.symbol}
                        className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-blue-500/50 transition-all flex flex-col justify-between shadow-md"
                        id={`base_token_card_${token.symbol.toLowerCase()}`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <div className={`w-8 h-8 rounded-full ${token.logoColor} flex items-center justify-center font-bold text-white text-xs shadow`}>
                                {token.symbol.slice(0, 2)}
                              </div>
                              <div>
                                <h5 className="font-bold text-white text-sm">{token.name}</h5>
                                <span className="text-[10px] font-mono text-slate-500">${token.symbol}</span>
                              </div>
                            </div>
                            <span className="text-[10px] font-semibold px-2 py-0.5 bg-slate-950 border border-slate-800 rounded text-slate-400">
                              {token.category}
                            </span>
                          </div>

                          <div className="space-y-1.5 font-mono text-xs my-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                            <div className="flex justify-between">
                              <span className="text-slate-500 text-[10px] uppercase">Price (USD):</span>
                              <span className="font-bold text-emerald-400">{token.priceUsd}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500 text-[10px] uppercase">24h Volume:</span>
                              <span className="text-slate-300">{token.volume24h}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500 text-[10px] uppercase">Holders:</span>
                              <span className="text-slate-300">{token.holders.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
                          <span className="text-[10px] font-mono text-slate-500 truncate max-w-[140px]" title={token.address}>
                            {token.address.slice(0, 8)}...{token.address.slice(-4)}
                          </span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(token.address);
                              setCopiedAddress(token.symbol);
                              setTimeout(() => setCopiedAddress(null), 2000);
                            }}
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[10px] font-mono flex items-center gap-1 transition-all cursor-pointer"
                          >
                            {copiedAddress === token.symbol ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                            {copiedAddress === token.symbol ? "Copied" : "Copy"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Sub-tab Content: Paymaster & EIP-5792 Batch Calls */}
                {baseSubTab === "paymaster" && (
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col gap-6" id="base_paymaster_container">
                    <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <Zap className="w-5 h-5 text-amber-400 fill-amber-400" />
                          <h4 className="text-base font-bold text-white">Base Paymaster & EIP-5792 Batching</h4>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          Base sponsors gas fees for frictionless user onboarding. Combine token approve + swap actions into a single signature using <code className="text-blue-400 font-mono">wallet_sendCalls</code>.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                        <h5 className="text-xs font-bold text-white flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-emerald-400" /> Gas Sponsorship Paymaster Status
                        </h5>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          Base Paymaster provides 100% gas sponsorship for eligible smart contracts. Users execute onchain transactions without requiring initial ETH for gas.
                        </p>
                        <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 font-mono text-[11px] space-y-1">
                          <div className="text-slate-500">Paymaster Address:</div>
                          <div className="text-blue-300 font-bold truncate">0x0000000000770505b2628e83042079c657930928</div>
                          <div className="text-emerald-400 text-[10px] pt-1">✓ Active on Base Mainnet (8453)</div>
                        </div>
                      </div>

                      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
                        <div>
                          <h5 className="text-xs font-bold text-white flex items-center gap-2 mb-2">
                            <Layers className="w-4 h-4 text-blue-400" /> Interactive EIP-5792 Batch Simulator
                          </h5>
                          <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
                            Test executing a combined batch request: <code className="text-amber-400">Approve USDC</code> + <code className="text-amber-400">Swap to Base Token</code> in 1 batch call.
                          </p>
                        </div>

                        <button
                          onClick={() => {
                            const randomHex = () => Math.random().toString(16).substring(2, 10);
                            const newTx: BaseTx = {
                              hash: `0x${randomHex()}${randomHex()}${randomHex()}${randomHex()}${randomHex()}`,
                              blockNumber: baseBlocks[0]?.number || 20491832,
                              from: "0x3a429f0a12b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7",
                              fromBasename: "jesse.base",
                              to: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
                              toBasename: "aerodrome.base",
                              value: "100.00 USDC ➔ AERO",
                              method: "wallet_sendCalls",
                              status: "success",
                              gasFee: "$0.0000 (Sponsored by Base Paymaster)",
                              sponsored: true,
                              timestamp: "Just now"
                            };
                            setBaseTxs([newTx, ...baseTxs]);
                            setInspectTx(newTx);
                          }}
                          className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                          id="btn_simulate_batch_tx"
                        >
                          <Zap className="w-4 h-4 fill-white" />
                          Simulate Gasless Batch Tx (wallet_sendCalls)
                        </button>
                      </div>
                    </div>
                  </div>
                )}
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

                {/* Modal Body */}
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
                    <div
                      className="p-4 rounded-xl shadow-lg border-4 border-amber-500/30 flex items-center justify-center transition-all"
                      style={{ backgroundColor: qrBgColor }}
                      id="qr_canvas_wrapper"
                    >
                      <QRCodeSVG
                        id="inscription-qr-code-svg"
                        value={getQrPayload(qrModalInscription, qrDataType)}
                        size={190}
                        level="H"
                        fgColor={qrFgColor}
                        bgColor={qrBgColor}
                        includeMargin={false}
                      />
                    </div>

                    {/* Color Control Panel */}
                    <div className="flex flex-col gap-2 w-full max-w-sm" id="qr_color_controls_panel">
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
                              onClick={() => setQrFgColor(swatch.hex)}
                              className={`w-4 h-4 rounded-full transition-all border cursor-pointer ${
                                qrFgColor.toLowerCase() === swatch.hex.toLowerCase()
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
                                onChange={(e) => setQrFgColor(e.target.value)}
                                className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                                id="qr_fg_custom_color_input"
                              />
                              <div className="w-3 h-3 rounded-full border border-slate-500" style={{ backgroundColor: qrFgColor }} />
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
                              onClick={() => setQrBgColor(swatch.hex)}
                              className={`w-4 h-4 rounded-full transition-all border cursor-pointer ${
                                qrBgColor.toLowerCase() === swatch.hex.toLowerCase()
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
                                onChange={(e) => setQrBgColor(e.target.value)}
                                className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                                id="qr_bg_custom_color_input"
                              />
                              <div className="w-3 h-3 rounded-full border border-slate-500" style={{ backgroundColor: qrBgColor }} />
                            </label>
                          </div>
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
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span className="flex items-center gap-1">
                        <Code2 className="w-3.5 h-3.5 text-amber-500" />
                        Encoded Content:
                      </span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(getQrPayload(qrModalInscription, qrDataType));
                          setCopiedQrData(true);
                          setTimeout(() => setCopiedQrData(false), 2000);
                        }}
                        className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 font-sans cursor-pointer"
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
                            <span>Copy Raw Data</span>
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-[11px] font-mono text-amber-300/90 overflow-x-auto max-h-28 whitespace-pre-wrap break-all select-all" id="qr_raw_data_pre">
                      {getQrPayload(qrModalInscription, qrDataType)}
                    </pre>
                  </div>
                </div>

                {/* Modal Footer Actions */}
                <div className="px-6 py-4 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between" id="qr_modal_footer">
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
                    className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-medium font-mono transition-all border border-slate-700 shadow-sm cursor-pointer"
                    id="download_qr_btn"
                  >
                    <Download className="w-4 h-4 text-amber-400" />
                    Download QR (SVG)
                  </button>
                  <button
                    onClick={() => setQrModalInscription(null)}
                    className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs font-mono transition-all shadow-md shadow-amber-500/10 cursor-pointer"
                    id="close_qr_modal_btn"
                  >
                    Done
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Base Transaction Detail Modal Overlay */}
        <AnimatePresence>
          {inspectTx && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md" id="base_tx_modal_backdrop">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="bg-slate-900 border border-blue-500/30 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                id="base_tx_modal_card"
              >
                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70" id="base_tx_modal_header">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 border border-blue-500/30 rounded-xl text-blue-400">
                      🔵
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        Base Transaction
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded uppercase font-mono">
                          {inspectTx.status}
                        </span>
                      </h3>
                      <p className="text-[10px] font-mono text-blue-400 truncate max-w-[280px]">
                        {inspectTx.hash}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setInspectTx(null)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
                    id="btn_close_tx_modal"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-4 font-mono text-xs text-slate-300" id="base_tx_modal_body">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-800/80">
                      <span className="text-slate-500 uppercase text-[10px]">Method Call</span>
                      <span className="text-blue-300 font-bold bg-blue-500/10 border border-blue-500/30 px-2 py-0.5 rounded uppercase text-[10px]">
                        {inspectTx.method}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 uppercase text-[10px]">From (Sender)</span>
                      <span className="text-white font-semibold">
                        {inspectTx.fromBasename ? (
                          <span className="text-blue-400 font-bold">{inspectTx.fromBasename}</span>
                        ) : (
                          inspectTx.from.slice(0, 10) + "..."
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 uppercase text-[10px]">To (Target)</span>
                      <span className="text-white font-semibold">
                        {inspectTx.toBasename ? (
                          <span className="text-blue-400 font-bold">{inspectTx.toBasename}</span>
                        ) : (
                          inspectTx.to.slice(0, 10) + "..."
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 uppercase text-[10px]">Value</span>
                      <span className="text-emerald-400 font-bold">{inspectTx.value}</span>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-slate-800/80">
                      <span className="text-slate-500 uppercase text-[10px]">Gas Fee</span>
                      {inspectTx.sponsored ? (
                        <span className="text-amber-400 font-bold bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded text-[10px] flex items-center gap-1">
                          <Zap className="w-3 h-3 fill-amber-400" /> Sponsored ($0.00)
                        </span>
                      ) : (
                        <span className="text-slate-300">{inspectTx.gasFee}</span>
                      )}
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 uppercase text-[10px]">L2 Block #</span>
                      <span className="text-blue-400 font-bold">#{inspectTx.blockNumber}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 uppercase text-[10px]">Timestamp</span>
                      <span className="text-slate-400">{inspectTx.timestamp}</span>
                    </div>
                  </div>

                  {/* EIP-5792 / Paymaster Notice */}
                  {inspectTx.sponsored && (
                    <div className="bg-blue-950/40 border border-blue-500/30 p-3 rounded-xl text-[11px] text-blue-300 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>This transaction was fully sponsored via Base Paymaster API with zero user gas friction.</span>
                    </div>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between" id="base_tx_modal_footer">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setQrModalInscription({
                          number: inspectTx.blockNumber,
                          id: inspectTx.hash,
                          ticker: "BASE",
                          amount: 1,
                          op: "transfer",
                          txHash: inspectTx.hash,
                          timestamp: inspectTx.timestamp,
                        });
                      }}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-all cursor-pointer"
                      id="btn_tx_generate_qr"
                    >
                      <QrCode className="w-3.5 h-3.5" /> Generate QR
                    </button>
                    <a
                      href={`https://basescan.org/tx/${inspectTx.hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
                      id="btn_basescan_link"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Basescan ↗
                    </a>
                  </div>

                  <button
                    onClick={() => setInspectTx(null)}
                    className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                    id="btn_close_tx_modal_done"
                  >
                    Done
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Base Block Detail Modal Overlay */}
        <AnimatePresence>
          {inspectBlock && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md" id="base_block_modal_backdrop">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="bg-slate-900 border border-blue-500/30 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                id="base_block_modal_card"
              >
                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70" id="base_block_modal_header">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 border border-blue-500/30 rounded-xl text-blue-400">
                      <Blocks className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">Base L2 Block #{inspectBlock.number}</h3>
                      <p className="text-[10px] font-mono text-slate-400">{inspectBlock.timestamp}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setInspectBlock(null)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
                    id="btn_close_block_modal"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-3 font-mono text-xs text-slate-300" id="base_block_modal_body">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 uppercase text-[10px]">Block Hash</span>
                      <span className="text-blue-400 font-bold truncate max-w-[200px]">{inspectBlock.hash}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 uppercase text-[10px]">Transaction Count</span>
                      <span className="text-white font-bold">{inspectBlock.txCount} txs</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 uppercase text-[10px]">Gas Used</span>
                      <span className="text-slate-300">{inspectBlock.gasUsed}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 uppercase text-[10px]">Sequencer</span>
                      <span className="text-slate-300">{inspectBlock.sequencer}</span>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between" id="base_block_modal_footer">
                  <a
                    href={`https://basescan.org/block/${inspectBlock.number}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
                    id="btn_block_basescan"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> View on Basescan ↗
                  </a>
                  <button
                    onClick={() => setInspectBlock(null)}
                    className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                    id="btn_close_block_modal_done"
                  >
                    Done
                  </button>
                </div>
              </motion.div>
            </div>
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
