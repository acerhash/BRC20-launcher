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
  Info
} from "lucide-react";
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
  const [activeTab, setActiveTab] = useState<"tokens" | "inscriptions" | "ledger">("tokens");
  const [searchQuery, setSearchQuery] = useState("");
  const [mintFilter, setMintFilter] = useState<"all" | "completed" | "inprogress">("all");

  // Main Persistent State
  const [tokens, setTokens] = useState<BRC20Token[]>(INITIAL_TOKENS);
  const [inscriptions, setInscriptions] = useState<Inscription[]>(INITIAL_INSCRIPTIONS);
  const [ledger, setLedger] = useState<LedgerBalance[]>(INITIAL_LEDGER);

  // Inscribe simulator fields
  const [simTicker, setSimTicker] = useState("base");
  const [simAmount, setSimAmount] = useState<number>(1000);
  const [simOp, setSimOp] = useState<"mint" | "transfer">("mint");
  const [simSuccessMsg, setSimSuccessMsg] = useState<string | null>(null);

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
                      You haven't inscribed any operations yet. Use the Simulator on the left!
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

          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950 py-6 px-4 md:px-8 text-center text-xs text-slate-600" id="app_footer">
        <p>© 2026 BRC-20 Ledger Dashboard. Experimental Bitcoin Token Standard Client Sandboxed Sandbox Environment.</p>
      </footer>
    </div>
  );
}
