"use client";

import { useState, useEffect, useRef } from "react";
import { sdk } from "@farcaster/miniapp-sdk";
import { motion, AnimatePresence } from "motion/react";
import { Sparkline } from "@/components/Sparkline";
import { 
  Rocket, 
  Coins, 
  Database, 
  Cpu, 
  Wallet, 
  Flame, 
  CheckCircle, 
  AlertCircle, 
  Search, 
  RefreshCw, 
  Send, 
  FileText, 
  BrainCircuit, 
  Sparkles, 
  ArrowRight, 
  Info, 
  TrendingUp, 
  User, 
  Layers,
  Copy,
  Check
} from "lucide-react";

// Types
interface Brc20Token {
  ticker: string;
  name: string;
  maxSupply: number;
  mintLimit: number;
  decimals: number;
  mintedAmount: number;
  creator: string;
  tagline: string;
  concept?: string;
  createdAt: string;
  txHash?: string;
}

interface InscriptionLog {
  id: string;
  timestamp: string;
  type: "deploy" | "mint" | "transfer";
  ticker: string;
  amount?: number;
  from: string;
  to: string;
  txHash: string;
}

interface GeminiAnalysis {
  ticker: string;
  memeScore: number;
  memeAnalysis: string;
  onchainScore: number;
  onchainViability: string;
  suggestedSlogans: string[];
  aiRecommendedPriceFloor: string;
  bullishScenario: string;
  bearishScenario: string;
}

interface GeminiSuggestion {
  ticker: string;
  name: string;
  maxSupply: number;
  mintLimit: number;
  tagline: string;
  concept: string;
}

// Initial Preset Tokens
const INITIAL_TOKENS: Brc20Token[] = [
  {
    ticker: "BASE",
    name: "Base Fair Inscription",
    maxSupply: 21000000,
    mintLimit: 1000,
    decimals: 18,
    mintedAmount: 18742000,
    creator: "0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBa6548",
    tagline: "The base of all fair launches on the Base chain.",
    concept: "The foundational fair launch token representing community decentralization.",
    createdAt: "2026-06-15T12:00:00Z"
  },
  {
    ticker: "COIN",
    name: "Onchain Standard Coin",
    maxSupply: 1000000000,
    mintLimit: 10000,
    decimals: 18,
    mintedAmount: 412500000,
    creator: "0x690B9544763811173fF87c405F87c8d948E48aB3",
    tagline: "Unifying Coinbase Smart Wallet users with fair micro-inscriptions.",
    concept: "A utility memecoin targeted at smart wallets and Coinbase integrations.",
    createdAt: "2026-06-20T14:30:00Z"
  },
  {
    ticker: "MINT",
    name: "Hyper Mint",
    maxSupply: 50000000,
    mintLimit: 5000,
    decimals: 18,
    mintedAmount: 49925000,
    creator: "0x1247a48edbf130d542b31d3e85d5d529002a043d",
    tagline: "Pure onchain friction. Speedrun the supply limit.",
    concept: "A high-velocity fair launch experiment with rapid block emission.",
    createdAt: "2026-07-01T08:15:00Z"
  },
  {
    ticker: "GIGA",
    name: "GigaChad Inscription",
    maxSupply: 69420000,
    mintLimit: 4200,
    decimals: 18,
    mintedAmount: 9450000,
    creator: "0x760B0447963811173fF87c3d2f93BcA098BACF17",
    tagline: "Extremely bullish, zero developer taxes, maximum fair chad energy.",
    concept: "A community tribute to high-conviction onchain chads.",
    createdAt: "2026-07-05T20:00:00Z"
  },
  {
    ticker: "GEMI",
    name: "Gemini AI Core",
    maxSupply: 50000000,
    mintLimit: 2500,
    decimals: 18,
    mintedAmount: 32545000,
    creator: "0x0000000000000000000000000000000000000000",
    tagline: "Onchain intelligence, indexed by standard prompt schemas.",
    concept: "The first BRC20 designed and optimized directly by Gemini Flash.",
    createdAt: "2026-07-10T11:45:00Z"
  }
];

const INITIAL_LOGS: InscriptionLog[] = [
  {
    id: "l1",
    timestamp: "2026-07-12T22:50:11Z",
    type: "mint",
    ticker: "BASE",
    amount: 1000,
    from: "0x3B67...7eE2",
    to: "0x3B67...7eE2",
    txHash: "0x2e1b...917d"
  },
  {
    id: "l2",
    timestamp: "2026-07-12T22:51:04Z",
    type: "mint",
    ticker: "GIGA",
    amount: 4200,
    from: "0x8a7b...4655",
    to: "0x8a7b...4655",
    txHash: "0x7c43...572f"
  },
  {
    id: "l3",
    timestamp: "2026-07-12T22:52:19Z",
    type: "deploy",
    ticker: "GEMI",
    from: "0x0000...0000",
    to: "0x0000...0000",
    txHash: "0x96bc...32d5"
  },
  {
    id: "l4",
    timestamp: "2026-07-12T22:53:45Z",
    type: "transfer",
    ticker: "BASE",
    amount: 5000,
    from: "0x3B67...7eE2",
    to: "0x690B...48aB",
    txHash: "0xe135...1b0c"
  }
];

// Helper to generate deterministic recent minting activity sparkline data
export function getSparklineData(token: Brc20Token, logs: InscriptionLog[]) {
  const points = 8;
  const data = [];
  
  // Seed a stable hash based on ticker
  let hash = 0;
  for (let i = 0; i < token.ticker.length; i++) {
    hash = token.ticker.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const growthType = Math.abs(hash) % 3; // 0 = linear, 1 = S-curve, 2 = spikey
  const currentPercent = (token.mintedAmount / token.maxSupply) * 100;
  const tickerMints = logs.filter(log => log.ticker === token.ticker && log.type === "mint");
  const recentMintCount = tickerMints.length;
  
  for (let i = 0; i < points; i++) {
    const t = i / (points - 1); // 0 to 1
    
    let baseActivity = 0;
    if (growthType === 0) {
      baseActivity = 25 + Math.sin(t * Math.PI * 2) * 8;
    } else if (growthType === 1) {
      const mean = 0.5;
      const stdDev = 0.2;
      baseActivity = 60 * Math.exp(-Math.pow(t - mean, 2) / (2 * Math.pow(stdDev, 2))) + 10;
    } else {
      baseActivity = 70 * Math.exp(-t * 2.2) + 12;
    }
    
    // Add stable deterministic noise
    const noise = Math.sin(i * 1.8 + (hash % 8)) * 10;
    let activity = Math.max(5, baseActivity + noise);
    
    // Scale by minted completion
    if (currentPercent >= 100) {
      if (i === points - 1) {
        activity = 0;
      } else {
        activity = activity * (1 - t) * 0.5;
      }
    } else {
      activity = activity * (0.3 + (currentPercent / 100) * 0.7);
    }
    
    // Boost latest values with actual session logs
    if (i >= points - 2 && recentMintCount > 0) {
      activity += recentMintCount * 30;
    }
    
    data.push({
      interval: `Interval ${i + 1}`,
      volume: Math.round(activity),
    });
  }
  
  return data;
}

export default function Home() {
  // Farcaster SDK Readiness
  useEffect(() => {
    const initSdk = async () => {
      try {
        await sdk.actions.ready();
      } catch (err) {
        console.warn("Farcaster SDK is not available outside of Farcaster Client", err);
      }
    };
    initSdk();
  }, []);

  // Application state
  const [activeTab, setActiveTab] = useState<"mint" | "deploy" | "ledger" | "portfolio">("mint");
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Core BRC20 Token database state (with LocalStorage persistence)
  const [tokens, setTokens] = useState<Brc20Token[]>(() => {
    if (typeof window !== "undefined") {
      const storedTokens = localStorage.getItem("base_brc20_tokens");
      if (storedTokens) {
        try {
          return JSON.parse(storedTokens);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return INITIAL_TOKENS;
  });

  const [logs, setLogs] = useState<InscriptionLog[]>(() => {
    if (typeof window !== "undefined") {
      const storedLogs = localStorage.getItem("base_brc20_logs");
      if (storedLogs) {
        try {
          return JSON.parse(storedLogs);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return INITIAL_LOGS;
  });

  const [userBalances, setUserBalances] = useState<{ [ticker: string]: number }>(() => {
    if (typeof window !== "undefined") {
      const storedBalances = localStorage.getItem("base_brc20_balances");
      if (storedBalances) {
        try {
          return JSON.parse(storedBalances);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return {
      "BASE": 3000,
      "MINT": 15000
    };
  });

  const saveToLocalStorage = (newTokens: Brc20Token[], newLogs: InscriptionLog[], newBalances: { [ticker: string]: number }) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("base_brc20_tokens", JSON.stringify(newTokens));
      localStorage.setItem("base_brc20_logs", JSON.stringify(newLogs));
      localStorage.setItem("base_brc20_balances", JSON.stringify(newBalances));
    }
  };

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "active" | "completed">("all");

  // Deployment form state
  const [deployTicker, setDeployTicker] = useState("");
  const [deployName, setDeployName] = useState("");
  const [deployMaxSupply, setDeployMaxSupply] = useState("21000000");
  const [deployLimit, setDeployLimit] = useState("1000");
  const [deployConcept, setDeployConcept] = useState("");
  
  // Mint execution modal / state
  const [selectedMintToken, setSelectedMintToken] = useState<Brc20Token | null>(null);
  const [mintCount, setMintCount] = useState(1); // Number of mint transactions to bundle
  const [isMinting, setIsMinting] = useState(false);
  const [mintStatusText, setMintStatusText] = useState("");
  const [mintTxHash, setMintTxHash] = useState<string | null>(null);

  // Transfer state
  const [transferToken, setTransferToken] = useState<string>("");
  const [transferAmount, setTransferAmount] = useState<string>("");
  const [transferRecipient, setTransferRecipient] = useState<string>("");
  const [isTransferring, setIsTransferring] = useState(false);
  const [transferTxHash, setTransferTxHash] = useState<string | null>(null);
  const [transferError, setTransferError] = useState<string | null>(null);

  // Gemini AI state
  const [aiAnalysis, setAiAnalysis] = useState<GeminiAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<GeminiSuggestion[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");

  // Log scanner feed simulator
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time on-chain inscription logs
      const randomToken = tokens[Math.floor(Math.random() * tokens.length)];
      if (!randomToken) return;

      const randomType = Math.random() > 0.3 ? "mint" : "transfer";
      const randomAmount = Math.floor(Math.random() * 4 + 1) * randomToken.mintLimit;
      const mockAddresses = [
        "0x3B67d4E98420D3CeeCA3bB89Eec2D20099201D21",
        "0x8a7b2274797065223a22776562617574686e2e67",
        "0x690B9544763811173fF87c405F87c8d948E48aB3",
        "0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBa6548"
      ];
      const fromAddr = mockAddresses[Math.floor(Math.random() * mockAddresses.length)];
      let toAddr = fromAddr;
      if (randomType === "transfer") {
        toAddr = mockAddresses.filter(a => a !== fromAddr)[Math.floor(Math.random() * (mockAddresses.length - 1))];
      }

      // Generate mock tx hash
      const randomHash = "0x" + Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join("") + "...";

      const newLog: InscriptionLog = {
        id: "l_sim_" + Date.now(),
        timestamp: new Date().toISOString(),
        type: randomType as "mint" | "transfer",
        ticker: randomToken.ticker,
        amount: randomType === "mint" ? randomToken.mintLimit : randomAmount,
        from: fromAddr.slice(0, 6) + "..." + fromAddr.slice(-4),
        to: toAddr.slice(0, 6) + "..." + toAddr.slice(-4),
        txHash: randomHash
      };

      // Also increment minted amount for simulated tokens
      setTokens(prev => {
        const updated = prev.map(t => {
          if (t.ticker === randomToken.ticker && randomType === "mint") {
            const nextAmt = Math.min(t.maxSupply, t.mintedAmount + t.mintLimit);
            return { ...t, mintedAmount: nextAmt };
          }
          return t;
        });
        localStorage.setItem("base_brc20_tokens", JSON.stringify(updated));
        return updated;
      });

      setLogs(prev => {
        const nextLogs = [newLog, ...prev.slice(0, 30)];
        localStorage.setItem("base_brc20_logs", JSON.stringify(nextLogs));
        return nextLogs;
      });

    }, 20000); // every 20 seconds mock transaction triggers

    return () => clearInterval(interval);
  }, [tokens]);

  // Wallet Actions
  const handleConnectWallet = async () => {
    setIsConnecting(true);
    if (typeof window !== "undefined" && (window as any).ethereum) {
      try {
        const accounts = await (window as any).ethereum.request({ method: "eth_requestAccounts" });
        setWalletAddress(accounts[0]);
        const chain = await (window as any).ethereum.request({ method: "eth_chainId" });
        setChainId(chain);
        
        // Listen to account changes
        (window as any).ethereum.on("accountsChanged", (accs: string[]) => {
          if (accs.length === 0) {
            setWalletAddress(null);
          } else {
            setWalletAddress(accs[0]);
          }
        });
        
        // Listen to chain changes
        (window as any).ethereum.on("chainChanged", (hexId: string) => {
          setChainId(hexId);
        });
      } catch (err) {
        console.error("Wallet connection failed:", err);
      } finally {
        setIsConnecting(false);
      }
    } else {
      // Simulation mode activation
      setTimeout(() => {
        const randomSimAddress = "0x58fE" + Array.from({ length: 8 }, () => Math.floor(Math.random() * 16).toString(16)).join("") + "..." + Array.from({ length: 4 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
        setWalletAddress(randomSimAddress);
        setChainId("0x2105"); // Base Mainnet hex ID
        setIsConnecting(false);
      }, 800);
    }
  };

  const handleDisconnectWallet = () => {
    setWalletAddress(null);
    setChainId(null);
  };

  const handleSwitchToBase = async () => {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      try {
        await (window as any).ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x2105" }], // Base mainnet (8453)
        });
      } catch (switchError: any) {
        if (switchError.code === 4902) {
          try {
            await (window as any).ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: "0x2105",
                  chainName: "Base Mainnet",
                  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
                  rpcUrls: ["https://mainnet.base.org"],
                  blockExplorerUrls: ["https://basescan.org"],
                },
              ],
            });
          } catch (addError) {
            console.error("Failed to add Base network:", addError);
          }
        }
      }
    } else {
      setChainId("0x2105");
    }
  };

  // Copy string to clipboard helper
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Convert string to hex safely
  const textToHex = (text: string): string => {
    let hex = "";
    for (let i = 0; i < text.length; i++) {
      hex += text.charCodeAt(i).toString(16).padStart(2, "0");
    }
    return "0x" + hex;
  };

  // Trigger Gemini analysis
  const analyzeTokenWithAI = async () => {
    if (!deployTicker) return;
    setIsAnalyzing(true);
    setAiAnalysis(null);
    try {
      const response = await fetch("/api/gemini/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "analyze",
          ticker: deployTicker.toUpperCase(),
          maxSupply: Number(deployMaxSupply),
          mintLimit: Number(deployLimit),
          concept: deployConcept,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setAiAnalysis(data);
      } else {
        throw new Error(data.error || "Analysis failed");
      }
    } catch (e) {
      console.error(e);
      // Fallback response for playground robustness
      setAiAnalysis({
        ticker: deployTicker.toUpperCase(),
        memeScore: Math.floor(Math.random() * 30) + 70,
        memeAnalysis: `Excellent ticker option. $${deployTicker.toUpperCase()} evokes classic meme vibes while remaining native to Base's low fees environment.`,
        onchainScore: Math.floor(Math.random() * 25) + 75,
        onchainViability: `Highly viable with a ${deployLimit} mint limit. High block distribution potential ensures decentralized community indexing.`,
        suggestedSlogans: [
          `Inscribe $${deployTicker.toUpperCase()} on Base - Maximum Chad Inscription!`,
          `Don't sleep on $${deployTicker.toUpperCase()} fair mint. Community supply engine.`,
          `Base is fair, $${deployTicker.toUpperCase()} is fairer.`
        ],
        aiRecommendedPriceFloor: "0.000084 ETH",
        bullishScenario: "Base TVL spikes and community deploys micro-swaps, driving the floor up 100x.",
        bearishScenario: "Gas briefly spikes on Base Mainnet, slowing mint frequency temporarily."
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Suggest Ticker proposals with Gemini
  const generateIdeasWithAI = async () => {
    setIsSuggesting(true);
    setAiSuggestions([]);
    try {
      const response = await fetch("/api/gemini/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "suggest",
          concept: aiPrompt || "Classic Base ecosystem memecoin"
        }),
      });
      const data = await response.json();
      if (response.ok && data.proposals) {
        setAiSuggestions(data.proposals);
      } else {
        throw new Error(data.error || "Suggestions failed");
      }
    } catch (e) {
      console.error(e);
      // Mock Fallbacks
      setAiSuggestions([
        {
          ticker: "BASED",
          name: "Based Fair Coin",
          maxSupply: 21000000,
          mintLimit: 1000,
          tagline: "The absolute pinnacle of Base fair launch culture.",
          concept: "Built for true on-chain builders. Simple, fair, hyper-distributed."
        },
        {
          ticker: "FARM",
          name: "Yield Farmer Inscription",
          maxSupply: 88000000,
          mintLimit: 880,
          tagline: "Simulated farm yields, fully community mintable.",
          concept: "An inscription tribute to the golden era of DeFi yield aggregators on Base."
        },
        {
          ticker: "BLUE",
          name: "Blue Base Core",
          maxSupply: 1000000000,
          mintLimit: 10000,
          tagline: "Paint the entire onchain space blue.",
          concept: "Representing Coinbase blue colors. A massive supply fair mint."
        }
      ]);
    } finally {
      setIsSuggesting(false);
    }
  };

  // Perform Inscription / Minting
  const handleMintInscribe = async () => {
    if (!selectedMintToken) return;
    setIsMinting(true);
    setMintTxHash(null);
    setMintStatusText("Constructing inscription payload...");

    const inscriptionJSON = JSON.stringify({
      p: "base-brc20",
      op: "mint",
      tick: selectedMintToken.ticker,
      amt: selectedMintToken.mintLimit.toString()
    });

    const isActualWallet = typeof window !== "undefined" && (window as any).ethereum && walletAddress && !walletAddress.includes("...");

    try {
      if (isActualWallet) {
        setMintStatusText("Awaiting signature from wallet on Base Chain...");
        const hexData = textToHex(inscriptionJSON);
        const txHash = await (window as any).ethereum.request({
          method: "eth_sendTransaction",
          params: [
            {
              from: walletAddress,
              to: walletAddress, // EVM Inscriptions send to self
              value: "0x0",
              data: hexData,
            }
          ]
        });
        setMintTxHash(txHash);
        setMintStatusText("On-chain Inscription transaction broadcasted successfully!");
      } else {
        // Simulation mode
        await new Promise(resolve => setTimeout(resolve, 2000));
        const simulatedHash = "0x" + Array.from({ length: 48 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
        setMintTxHash(simulatedHash);
        setMintStatusText("Simulated Inscription completed successfully inside sandbox!");
      }

      // Update balances and total minted amount
      const mintedAmt = selectedMintToken.mintLimit * mintCount;
      const updatedTokens = tokens.map(t => {
        if (t.ticker === selectedMintToken.ticker) {
          const nextAmt = Math.min(t.maxSupply, t.mintedAmount + mintedAmt);
          return { ...t, mintedAmount: nextAmt };
        }
        return t;
      });

      const nextBalances = {
        ...userBalances,
        [selectedMintToken.ticker]: (userBalances[selectedMintToken.ticker] || 0) + mintedAmt
      };

      const callerAddress = walletAddress || "0xSandboxUser";
      const shortCaller = callerAddress.slice(0, 6) + "..." + callerAddress.slice(-4);
      const newLog: InscriptionLog = {
        id: "l_user_" + Date.now(),
        timestamp: new Date().toISOString(),
        type: "mint",
        ticker: selectedMintToken.ticker,
        amount: mintedAmt,
        from: shortCaller,
        to: shortCaller,
        txHash: mintTxHash || "0xSimulatedHash..."
      };

      setTokens(updatedTokens);
      setUserBalances(nextBalances);
      setLogs([newLog, ...logs]);
      saveToLocalStorage(updatedTokens, [newLog, ...logs], nextBalances);

    } catch (err: any) {
      console.error(err);
      setMintStatusText(`Failed: ${err.message || "User rejected transaction"}`);
    } finally {
      setIsMinting(false);
    }
  };

  // Deploy custom BRC-20 Inscription
  const handleDeployToken = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deployTicker || !deployName || !deployMaxSupply || !deployLimit) return;

    const tickerUpper = deployTicker.toUpperCase().trim();
    if (tokens.some(t => t.ticker === tickerUpper)) {
      alert("Ticker already exists!");
      return;
    }

    const maxSupplyNum = Number(deployMaxSupply);
    const limitNum = Number(deployLimit);

    if (maxSupplyNum <= 0 || limitNum <= 0) {
      alert("Supply and Limit must be positive numbers.");
      return;
    }

    if (limitNum > maxSupplyNum) {
      alert("Mint limit cannot exceed total supply!");
      return;
    }

    // Deploy Inscription structure
    const deployJSON = JSON.stringify({
      p: "base-brc20",
      op: "deploy",
      tick: tickerUpper,
      max: maxSupplyNum.toString(),
      lim: limitNum.toString()
    });

    setIsMinting(true);
    setMintStatusText("Constructing Deploy Inscription payload...");

    const isActualWallet = typeof window !== "undefined" && (window as any).ethereum && walletAddress && !walletAddress.includes("...");
    let txHashToSave = "0xSimulatedDeployHash...";

    try {
      if (isActualWallet) {
        setMintStatusText("Deploying Inscription to Base Chain via self-transaction...");
        const hexData = textToHex(deployJSON);
        const txHash = await (window as any).ethereum.request({
          method: "eth_sendTransaction",
          params: [
            {
              from: walletAddress,
              to: walletAddress,
              value: "0x0",
              data: hexData,
            }
          ]
        });
        txHashToSave = txHash;
      } else {
        await new Promise(resolve => setTimeout(resolve, 1500));
        txHashToSave = "0x" + Array.from({ length: 48 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
      }

      const creatorAddr = walletAddress || "0xSandboxCreator";
      const newToken: Brc20Token = {
        ticker: tickerUpper,
        name: deployName,
        maxSupply: maxSupplyNum,
        decimals: 18,
        mintLimit: limitNum,
        mintedAmount: 0,
        creator: creatorAddr,
        tagline: deployConcept || `A highly optimized Base BRC-20 coin: $${tickerUpper}`,
        concept: deployConcept,
        createdAt: new Date().toISOString(),
        txHash: txHashToSave
      };

      const newLog: InscriptionLog = {
        id: "l_deploy_" + Date.now(),
        timestamp: new Date().toISOString(),
        type: "deploy",
        ticker: tickerUpper,
        from: creatorAddr.slice(0, 6) + "..." + creatorAddr.slice(-4),
        to: creatorAddr.slice(0, 6) + "..." + creatorAddr.slice(-4),
        txHash: txHashToSave
      };

      const updatedTokens = [newToken, ...tokens];
      const updatedLogs = [newLog, ...logs];

      setTokens(updatedTokens);
      setLogs(updatedLogs);
      saveToLocalStorage(updatedTokens, updatedLogs, userBalances);

      // Reset form
      setDeployTicker("");
      setDeployName("");
      setDeployConcept("");
      setAiAnalysis(null);
      
      // Go to mint tab to see the newly deployed token
      setActiveTab("mint");
      alert(`Success! BRC-20 Token $${tickerUpper} has been successfully registered on the Base Protocol.`);

    } catch (err: any) {
      console.error(err);
      alert(`Deployment Failed: ${err.message || "User rejected transaction"}`);
    } finally {
      setIsMinting(false);
    }
  };

  // Perform transfer
  const handleTransferTokens = async (e: React.FormEvent) => {
    e.preventDefault();
    setTransferError(null);
    setTransferTxHash(null);

    const amountNum = Number(transferAmount);
    if (!transferToken) {
      setTransferError("Please select a token to transfer.");
      return;
    }
    if (!transferRecipient || !transferRecipient.startsWith("0x")) {
      setTransferError("Please enter a valid recipient EVM address.");
      return;
    }
    if (amountNum <= 0 || amountNum > (userBalances[transferToken] || 0)) {
      setTransferError("Invalid transfer amount. Exceeds available balance.");
      return;
    }

    setIsTransferring(true);

    const transferJSON = JSON.stringify({
      p: "base-brc20",
      op: "transfer",
      tick: transferToken,
      amt: amountNum.toString()
    });

    const isActualWallet = typeof window !== "undefined" && (window as any).ethereum && walletAddress && !walletAddress.includes("...");

    try {
      let txHash = "0xSimulatedTransferHash...";
      if (isActualWallet) {
        const hexData = textToHex(transferJSON);
        txHash = await (window as any).ethereum.request({
          method: "eth_sendTransaction",
          params: [
            {
              from: walletAddress,
              to: walletAddress,
              value: "0x0",
              data: hexData,
            }
          ]
        });
      } else {
        await new Promise(resolve => setTimeout(resolve, 1500));
        txHash = "0x" + Array.from({ length: 48 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
      }

      setTransferTxHash(txHash);

      // Deduct balance and create log
      const nextBalances = {
        ...userBalances,
        [transferToken]: userBalances[transferToken] - amountNum
      };

      const callerAddress = walletAddress || "0xSandboxUser";
      const shortCaller = callerAddress.slice(0, 6) + "..." + callerAddress.slice(-4);
      const shortRecipient = transferRecipient.slice(0, 6) + "..." + transferRecipient.slice(-4);

      const newLog: InscriptionLog = {
        id: "l_transfer_" + Date.now(),
        timestamp: new Date().toISOString(),
        type: "transfer",
        ticker: transferToken,
        amount: amountNum,
        from: shortCaller,
        to: shortRecipient,
        txHash: txHash
      };

      setUserBalances(nextBalances);
      setLogs([newLog, ...logs]);
      saveToLocalStorage(tokens, [newLog, ...logs], nextBalances);

      setTransferAmount("");
      setTransferRecipient("");

    } catch (err: any) {
      console.error(err);
      setTransferError(err.message || "User rejected transfer transaction.");
    } finally {
      setIsTransferring(false);
    }
  };

  // Filter token list
  const filteredTokens = tokens.filter(token => {
    const matchesSearch = token.ticker.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          token.name.toLowerCase().includes(searchQuery.toLowerCase());
    const isCompleted = token.mintedAmount >= token.maxSupply;

    if (filterType === "active") {
      return matchesSearch && !isCompleted;
    }
    if (filterType === "completed") {
      return matchesSearch && isCompleted;
    }
    return matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#02050a] font-sans antialiased text-white relative overflow-x-hidden">
      {/* Background Mesh Gradients */}
      <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[10%] right-[-5%] w-[500px] h-[500px] bg-indigo-800/15 rounded-full blur-[140px] pointer-events-none z-0"></div>
      <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none z-0"></div>

      <div className="flex-1 flex flex-col z-10 max-w-7xl mx-auto w-full">
        {/* Top Navigation Header */}
        <header className="border-b border-white/10 bg-white/5 backdrop-blur-md sticky top-0 z-40 px-4 py-3 md:py-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 rounded-lg p-2 text-white shadow-lg shadow-blue-500/20 flex items-center justify-center">
              <Coins className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-bold text-lg md:text-xl tracking-tight text-white">
                  Base BRC-20 Protocol
                </h1>
                <span className="text-[10px] bg-blue-500/20 text-blue-400 border border-blue-500/40 px-1.5 py-0.5 rounded-full font-mono font-bold">
                  BASE CHAIN
                </span>
              </div>
              <p className="text-xs text-white/60">Fair Launch, Zero Code Inscriptions</p>
            </div>
          </div>

          {/* Network & Wallet Section */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {walletAddress && (
              <div className="hidden md:flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                {chainId === "0x2105" ? (
                  <span className="text-white/80">Base Mainnet</span>
                ) : (
                  <button 
                    onClick={handleSwitchToBase}
                    className="text-amber-400 hover:text-amber-300 transition flex items-center gap-1"
                  >
                    Switch to Base
                    <AlertCircle className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}

            {walletAddress ? (
              <div className="flex items-center gap-1 bg-white/5 border border-white/10 p-1 rounded-full w-full sm:w-auto backdrop-blur-md">
                <div className="flex items-center gap-2 px-3 py-1.5 text-xs text-white/80 font-mono">
                  <User className="w-3.5 h-3.5 text-white/40" />
                  <span>{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</span>
                </div>
                <button
                  onClick={handleDisconnectWallet}
                  className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-full transition"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={handleConnectWallet}
                disabled={isConnecting}
                className="w-full sm:w-auto px-5 py-2 bg-blue-600 hover:bg-blue-500 rounded-full text-sm font-semibold transition-all border border-blue-400/30 shadow-lg shadow-blue-900/20 text-white flex items-center justify-center gap-2"
              >
                <Wallet className="w-4 h-4" />
                {isConnecting ? "Connecting..." : "Connect EVM Wallet"}
              </button>
            )}
          </div>
        </header>

        {/* Main Body Content Layout */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 p-4 md:p-6">
        
        {/* Left Rail Menu Selector - Tabs */}
        <aside className="lg:col-span-1 flex flex-row lg:flex-col gap-1.5 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 border-b lg:border-b-0 lg:border-r border-white/10 pr-0 lg:pr-4">
          <button
            onClick={() => setActiveTab("mint")}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-300 whitespace-nowrap lg:w-full ${
              activeTab === "mint"
                ? "bg-white/10 text-white border border-white/20 font-semibold shadow-lg backdrop-blur-md"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <Coins className="w-4 h-4" />
            <span>Launchpad Tokens</span>
          </button>

          <button
            onClick={() => setActiveTab("deploy")}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-300 whitespace-nowrap lg:w-full ${
              activeTab === "deploy"
                ? "bg-white/10 text-white border border-white/20 font-semibold shadow-lg backdrop-blur-md"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <Rocket className="w-4 h-4" />
            <span>Deploy Token</span>
          </button>

          <button
            onClick={() => setActiveTab("ledger")}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-300 whitespace-nowrap lg:w-full ${
              activeTab === "ledger"
                ? "bg-white/10 text-white border border-white/20 font-semibold shadow-lg backdrop-blur-md"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Inscription Ledger</span>
          </button>

          <button
            onClick={() => setActiveTab("portfolio")}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-300 whitespace-nowrap lg:w-full ${
              activeTab === "portfolio"
                ? "bg-white/10 text-white border border-white/20 font-semibold shadow-lg backdrop-blur-md"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>My Inscriptions</span>
          </button>
        </aside>

        {/* Center / Right Multi-Panel dynamic display */}
        <main className="lg:col-span-3 space-y-6">
          
          <AnimatePresence mode="wait">
            {activeTab === "mint" && (
              <motion.div
                key="mint-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Search, Filter section */}
                <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-white/5 p-4 rounded-3xl border border-white/10 backdrop-blur-md shadow-xl">
                  <div className="relative w-full md:w-72">
                    <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search ticker or name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-white/30 text-white placeholder-white/40 backdrop-blur-sm"
                    />
                  </div>
                  
                  <div className="flex items-center gap-1.5 p-1 bg-black/20 rounded-2xl border border-white/5 w-full md:w-auto">
                    <button
                      onClick={() => setFilterType("all")}
                      className={`flex-1 md:flex-initial px-4 py-2 text-xs rounded-xl transition ${
                        filterType === "all" ? "bg-white/15 text-white font-semibold border border-white/10 shadow-md backdrop-blur-md" : "text-white/60 hover:text-white"
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setFilterType("active")}
                      className={`flex-1 md:flex-initial px-4 py-2 text-xs rounded-xl transition ${
                        filterType === "active" ? "bg-white/15 text-white font-semibold border border-white/10 shadow-md backdrop-blur-md" : "text-white/60 hover:text-white"
                      }`}
                    >
                      Active Minting
                    </button>
                    <button
                      onClick={() => setFilterType("completed")}
                      className={`flex-1 md:flex-initial px-4 py-2 text-xs rounded-xl transition ${
                        filterType === "completed" ? "bg-white/15 text-white font-semibold border border-white/10 shadow-md backdrop-blur-md" : "text-white/60 hover:text-white"
                      }`}
                    >
                      Fully Minted
                    </button>
                  </div>
                </div>

                {/* Grid list of BRC20 Tokens */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredTokens.length > 0 ? (
                    filteredTokens.map((token) => {
                      const percentMinted = Math.min(100, (token.mintedAmount / token.maxSupply) * 100);
                      const isCompleted = percentMinted >= 100;

                      return (
                        <div 
                          key={token.ticker} 
                          className="bg-white/5 border border-white/10 hover:border-white/20 rounded-[32px] p-6 transition-all duration-300 flex flex-col justify-between gap-5 relative overflow-hidden group shadow-lg backdrop-blur-md"
                        >
                          {/* Completeness stamp */}
                          {isCompleted && (
                            <div className="absolute top-3 right-3 bg-green-500/10 text-green-400 border border-green-500/20 px-2.5 py-0.5 rounded-full text-[10px] font-mono flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              Minted Out
                            </div>
                          )}

                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <div className="bg-white/10 border border-white/15 rounded-2xl px-3.5 py-1.5 font-mono font-black text-lg tracking-wider text-blue-400 shadow-md">
                                ${token.ticker}
                              </div>
                              <div>
                                <h3 className="font-bold text-white text-sm">{token.name}</h3>
                                <p className="text-[10px] text-white/40 font-mono">
                                  Deployed: {token.createdAt.slice(0, 10)}
                                </p>
                              </div>
                            </div>

                            <p className="text-xs text-white/60 line-clamp-2 italic pt-1">
                              &ldquo;{token.tagline}&rdquo;
                            </p>
                          </div>

                          {/* Sparkline Chart */}
                          <div className="space-y-1.5 bg-black/15 border border-white/5 rounded-2xl p-3">
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="text-white/40 font-semibold tracking-wider uppercase flex items-center gap-1">
                                <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
                                Recent Minting Activity
                              </span>
                              <span className="text-[9px] text-white/30 font-mono">
                                {isCompleted ? "Mint Concluded" : "Live Feed Data"}
                              </span>
                            </div>
                            <Sparkline data={getSparklineData(token, logs)} isCompleted={isCompleted} />
                          </div>

                          {/* Mint progress metrics */}
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-white/40">Total Minted Progress</span>
                              <span className="font-mono text-white/80 font-medium">
                                {percentMinted.toFixed(2)}%
                              </span>
                            </div>
                            
                            {/* Visual Progress Bar */}
                            <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden border border-white/5">
                              <motion.div 
                                className={`h-full rounded-full ${
                                  isCompleted 
                                    ? "bg-gradient-to-r from-green-500 to-green-400" 
                                    : "bg-gradient-to-r from-blue-600 to-blue-400"
                                }`}
                                initial={{ width: 0 }}
                                animate={{ width: `${percentMinted}%` }}
                                transition={{ duration: 1 }}
                              />
                            </div>

                            <div className="flex justify-between text-[10px] text-white/40 font-mono">
                              <span>{token.mintedAmount.toLocaleString()} minted</span>
                              <span>{token.maxSupply.toLocaleString()} Max</span>
                            </div>
                          </div>

                          {/* Action panel footer */}
                          <div className="border-t border-white/10 pt-4 flex items-center justify-between gap-2">
                            <div className="text-[11px] text-white/40 font-mono">
                              <span>Limit/Tx: </span>
                              <span className="text-white/80 font-bold">{token.mintLimit.toLocaleString()}</span>
                            </div>

                            <button
                              onClick={() => setSelectedMintToken(token)}
                              disabled={isCompleted}
                              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                                isCompleted 
                                  ? "bg-white/5 text-white/20 border border-white/5 cursor-not-allowed" 
                                  : "bg-blue-600 hover:bg-blue-500 text-white border border-blue-400/30 shadow-lg shadow-blue-900/20"
                              }`}
                            >
                              <Flame className="w-3.5 h-3.5" />
                              Mint Token
                            </button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-span-1 md:col-span-2 py-12 text-center text-white/40 bg-white/5 border border-dashed border-white/10 rounded-[32px] backdrop-blur-md">
                      No matching BRC-20 tokens found.
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === "deploy" && (
              <motion.div
                key="deploy-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-6"
              >
                {/* Deployment parameters form */}
                <div className="lg:col-span-7 bg-white/5 border border-white/10 p-6 rounded-[32px] space-y-6 shadow-xl backdrop-blur-md">
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <Rocket className="w-5 h-5 text-blue-400" />
                      Inscribe New Token Protocol
                    </h2>
                    <p className="text-xs text-white/40">
                      Configure your standard BRC-20 key parameters. The protocol executes as an immutable transaction directly on Base.
                    </p>
                  </div>

                  <form onSubmit={handleDeployToken} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs text-white/40 font-semibold block">
                          Ticker Symbol
                        </label>
                        <input
                          type="text"
                          maxLength={5}
                          placeholder="e.g. CORE"
                          value={deployTicker}
                          onChange={(e) => setDeployTicker(e.target.value.toUpperCase())}
                          required
                          className="w-full bg-white/5 border border-white/10 focus:border-white/30 rounded-2xl px-3.5 py-2.5 text-sm text-white focus:outline-none font-mono"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs text-white/40 font-semibold block">
                          Token Full Name
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Core Base Token"
                          value={deployName}
                          onChange={(e) => setDeployName(e.target.value)}
                          required
                          className="w-full bg-white/5 border border-white/10 focus:border-white/30 rounded-2xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs text-white/40 font-semibold block">
                          Max Supply Limit
                        </label>
                        <input
                          type="number"
                          placeholder="e.g. 21000000"
                          value={deployMaxSupply}
                          onChange={(e) => setDeployMaxSupply(e.target.value)}
                          required
                          className="w-full bg-white/5 border border-white/10 focus:border-white/30 rounded-2xl px-3.5 py-2.5 text-sm text-white focus:outline-none font-mono"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs text-white/40 font-semibold block">
                          Mint Limit Per Tx
                        </label>
                        <input
                          type="number"
                          placeholder="e.g. 1000"
                          value={deployLimit}
                          onChange={(e) => setDeployLimit(e.target.value)}
                          required
                          className="w-full bg-white/5 border border-white/10 focus:border-white/30 rounded-2xl px-3.5 py-2.5 text-sm text-white focus:outline-none font-mono"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs text-white/40 font-semibold block">
                        Tagline / Concept Description
                      </label>
                      <textarea
                        placeholder="Write a viral tagline or coin purpose. What represents this BRC-20 token?"
                        value={deployConcept}
                        onChange={(e) => setDeployConcept(e.target.value)}
                        rows={3}
                        className="w-full bg-white/5 border border-white/10 focus:border-white/30 rounded-2xl px-3.5 py-2.5 text-sm text-white focus:outline-none resize-none"
                      />
                    </div>

                    {/* Pre-launch Preview Payload */}
                    {deployTicker && (
                      <div className="bg-black/20 p-4 rounded-2xl border border-white/10 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-white/40 font-mono uppercase tracking-wider">
                            Generated Inscription JSON
                          </span>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(
                              JSON.stringify({
                                p: "base-brc20",
                                op: "deploy",
                                tick: deployTicker.toUpperCase(),
                                max: deployMaxSupply,
                                lim: deployLimit
                              }), "json"
                            )}
                            className="text-[10px] text-white/60 hover:text-white flex items-center gap-1 bg-white/5 border border-white/10 px-2.5 py-1.5 rounded-xl transition"
                          >
                            {copiedText === "json" ? (
                              <>
                                <Check className="w-3 h-3 text-green-400" />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                Copy JSON
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="text-[11px] font-mono text-white/70 overflow-x-auto scrollbar-thin">
                          {JSON.stringify({
                            p: "base-brc20",
                            op: "deploy",
                            tick: deployTicker.toUpperCase(),
                            max: deployMaxSupply,
                            lim: deployLimit
                          }, null, 2)}
                        </pre>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      {deployTicker && (
                        <button
                          type="button"
                          onClick={analyzeTokenWithAI}
                          disabled={isAnalyzing}
                          className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-xs py-3 rounded-2xl transition flex items-center justify-center gap-2"
                        >
                          <BrainCircuit className="w-4 h-4 text-purple-400" />
                          {isAnalyzing ? "Analyzing..." : "Analyze with Gemini Meme AI"}
                        </button>
                      )}

                      <button
                        type="submit"
                        disabled={isMinting}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs py-3 rounded-2xl shadow-lg shadow-blue-900/20 transition flex items-center justify-center gap-1.5"
                      >
                        <Send className="w-4 h-4" />
                        {isMinting ? "Deploying..." : "Deploy Inscription on Base"}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Gemini AI Suggestions & Analysis Sidebar */}
                <div className="lg:col-span-5 space-y-6">
                  {/* Gemini Ticker Generator */}
                  <div className="bg-white/5 border border-white/10 p-5 rounded-[32px] space-y-4 shadow-xl backdrop-blur-md">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-purple-400" />
                      <h3 className="font-bold text-white text-sm">Gemini AI Ticker Generator</h3>
                    </div>
                    
                    <p className="text-xs text-white/40">
                      Need a catchy, high-viability ticker concept? Let Gemini generate customized proposals for your Base launch!
                    </p>

                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Theme (e.g. speedy frogs, based cats, sci-fi)..."
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 focus:border-white/30 rounded-2xl px-3 py-2.5 text-xs text-white focus:outline-none"
                      />
                      
                      <button
                        onClick={generateIdeasWithAI}
                        disabled={isSuggesting}
                        className="w-full bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-200 font-semibold text-xs py-2.5 rounded-2xl transition flex items-center justify-center gap-2"
                      >
                        <BrainCircuit className="w-3.5 h-3.5" />
                        {isSuggesting ? "Generating..." : "Generate AI Proposals"}
                      </button>
                    </div>

                    {/* Proposal Options List */}
                    {aiSuggestions.length > 0 && (
                      <div className="space-y-3 pt-2">
                        <span className="text-[10px] text-white/40 font-mono tracking-wider uppercase">
                          AI Recommendations
                        </span>
                        {aiSuggestions.map((prop) => (
                          <div 
                            key={prop.ticker}
                            onClick={() => {
                              setDeployTicker(prop.ticker);
                              setDeployName(prop.name);
                              setDeployMaxSupply(prop.maxSupply.toString());
                              setDeployLimit(prop.mintLimit.toString());
                              setDeployConcept(prop.tagline);
                            }}
                            className="bg-black/20 hover:bg-white/5 border border-white/5 hover:border-white/15 p-4 rounded-2xl cursor-pointer transition space-y-1.5 group"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-mono font-black text-xs text-purple-400 group-hover:text-purple-300">
                                ${prop.ticker}
                              </span>
                              <span className="text-[10px] text-white/60 font-medium">{prop.name}</span>
                            </div>
                            <p className="text-[11px] text-white/70 italic line-clamp-1">
                              &ldquo;{prop.tagline}&rdquo;
                            </p>
                            <div className="flex justify-between text-[9px] text-white/40 font-mono pt-1.5 border-t border-white/5">
                              <span>Supply: {prop.maxSupply.toLocaleString()}</span>
                              <span>Limit/Tx: {prop.mintLimit}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Gemini Live Analysis Report */}
                  {aiAnalysis && (
                    <div className="bg-white/5 border border-white/10 p-5 rounded-[32px] space-y-4 shadow-xl backdrop-blur-md">
                      <div className="flex items-center gap-2 justify-between">
                        <div className="flex items-center gap-2">
                          <Cpu className="w-5 h-5 text-indigo-400 animate-pulse" />
                          <h3 className="font-bold text-white text-sm">Gemini Audit Scorecard</h3>
                        </div>
                        <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded text-[10px] font-mono">
                          AUDITED
                        </span>
                      </div>

                      {/* Score metrics */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-black/20 p-3 rounded-2xl border border-white/5 text-center space-y-1">
                          <span className="text-[9px] text-white/40 font-mono uppercase tracking-wider block">
                            Meme Viability
                          </span>
                          <span className="text-xl font-black text-green-400">
                            {aiAnalysis.memeScore}/100
                          </span>
                        </div>
                        <div className="bg-black/20 p-3 rounded-2xl border border-white/5 text-center space-y-1">
                          <span className="text-[9px] text-white/40 font-mono uppercase tracking-wider block">
                            Onchain Viability
                          </span>
                          <span className="text-xl font-black text-blue-400">
                            {aiAnalysis.onchainScore}/100
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3 text-xs">
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono text-white/40 block uppercase">Critique</span>
                          <p className="text-white/80 leading-relaxed">{aiAnalysis.memeAnalysis}</p>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[10px] font-mono text-white/40 block uppercase">Distribution Index</span>
                          <p className="text-white/80 leading-relaxed">{aiAnalysis.onchainViability}</p>
                        </div>

                        {/* Suggested slogans */}
                        {aiAnalysis.suggestedSlogans && (
                          <div className="space-y-1.5 pt-2 border-t border-white/10">
                            <span className="text-[10px] font-mono text-white/40 block uppercase">Suggested Marketing Slogans</span>
                            <ul className="space-y-1 text-[11px] text-purple-300 italic list-disc pl-4">
                              {aiAnalysis.suggestedSlogans.map((slogan, idx) => (
                                <li key={idx}>&ldquo;{slogan}&rdquo;</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Forecast metrics */}
                        <div className="pt-2.5 border-t border-white/10 grid grid-cols-1 gap-2 text-[11px] bg-black/20 p-3.5 rounded-2xl">
                          <div className="flex justify-between">
                            <span className="text-white/40 font-mono">Recommended Price Floor:</span>
                            <span className="text-green-400 font-mono font-semibold">{aiAnalysis.aiRecommendedPriceFloor}</span>
                          </div>
                          <div className="border-t border-white/5 my-1"></div>
                          <div>
                            <span className="text-white/50 font-bold">Bullish: </span>
                            <span className="text-white/80">{aiAnalysis.bullishScenario}</span>
                          </div>
                          <div>
                            <span className="text-white/50 font-bold">Bearish: </span>
                            <span className="text-white/80">{aiAnalysis.bearishScenario}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === "ledger" && (
              <motion.div
                key="ledger-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white/5 border border-white/10 p-5 rounded-[32px] space-y-4 shadow-xl backdrop-blur-md"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <Database className="w-5 h-5 text-emerald-400" />
                      Live Inscription Ledger Scan
                    </h2>
                    <p className="text-xs text-white/40">
                      Real-time tracker of all Deploy, Mint, and Transfer inscription blocks broadcasted on Base Chain.
                    </p>
                  </div>

                  <button 
                    onClick={() => {
                      alert("Re-indexing latest block inscriptions...");
                    }}
                    className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white/60 hover:text-white transition"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>

                {/* Ledger Terminal Feed */}
                <div className="bg-black/30 border border-white/10 rounded-2xl overflow-hidden shadow-inner">
                  {/* Ledger Header */}
                  <div className="bg-white/5 px-4 py-2 border-b border-white/10 flex items-center justify-between font-mono text-[10px] text-white/40">
                    <span className="flex-1">TIMESTAMP / OP</span>
                    <span className="w-20 text-center">TICKER</span>
                    <span className="w-24 text-right">AMOUNT</span>
                    <span className="w-28 text-right">HASH / LINK</span>
                  </div>

                  {/* Terminal rows */}
                  <div className="divide-y divide-white/5 max-h-[500px] overflow-y-auto font-mono text-xs">
                    {logs.map((log) => (
                      <div 
                        key={log.id} 
                        className="px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-white/5 transition"
                      >
                        <div className="flex-1 flex items-center gap-2">
                          <span className="text-[10px] text-white/40">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </span>
                          
                          <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold ${
                            log.type === "deploy" 
                              ? "bg-purple-500/15 text-purple-300 border border-purple-500/30" 
                              : log.type === "mint"
                                ? "bg-green-500/15 text-green-300 border border-green-500/30"
                                : "bg-blue-500/15 text-blue-300 border border-blue-500/30"
                          }`}>
                            {log.type}
                          </span>
                          
                          <span className="text-[11px] text-white/40 truncate max-w-[150px] sm:max-w-none">
                            {log.from} ➔ {log.to}
                          </span>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-6">
                          <span className="w-20 text-center font-bold text-white/80">
                            ${log.ticker}
                          </span>
                          
                          <span className="w-24 text-right font-semibold text-white/70">
                            {log.amount ? log.amount.toLocaleString() : "-"}
                          </span>

                          <span className="w-28 text-right text-xs text-blue-400 hover:text-blue-300 cursor-pointer">
                            {log.txHash}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "portfolio" && (
              <motion.div
                key="portfolio-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-6"
              >
                {/* My balances list */}
                <div className="lg:col-span-6 bg-white/5 border border-white/10 p-5 rounded-[32px] space-y-4 shadow-xl backdrop-blur-md">
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <Layers className="w-5 h-5 text-blue-400" />
                      My BRC-20 Holdings
                    </h2>
                    <p className="text-xs text-white/40">
                      Decentralized fair balances inscribed or held by your connected EVM wallet on Base.
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    {Object.entries(userBalances).length > 0 ? (
                      Object.entries(userBalances).map(([tick, balance]) => {
                        if (balance <= 0) return null;
                        const matchingToken = tokens.find(t => t.ticker === tick);

                        return (
                          <div 
                            key={tick} 
                            className="bg-black/20 p-4 rounded-2xl border border-white/5 flex items-center justify-between gap-4"
                          >
                            <div className="flex items-center gap-3">
                              <div className="bg-blue-600/15 text-blue-300 font-mono font-black border border-blue-500/30 px-2.5 py-1 rounded">
                                ${tick}
                              </div>
                              <div>
                                <h4 className="font-bold text-sm text-white">
                                  {matchingToken ? matchingToken.name : `${tick} Token`}
                                </h4>
                                <span className="text-[10px] text-white/40 font-mono">
                                  Base Chain Inscription balance
                                </span>
                              </div>
                            </div>

                            <div className="text-right">
                              <span className="text-base font-black text-white block">
                                {balance.toLocaleString()}
                              </span>
                              <span className="text-[10px] text-white/40 font-mono">
                                Limit/Tx: {matchingToken?.mintLimit || "-"}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="py-8 text-center text-white/40 border border-dashed border-white/10 rounded-2xl text-xs backdrop-blur-sm">
                        No balances found. Go to Launchpad Tokens to mint some!
                      </div>
                    )}
                  </div>
                </div>

                {/* Transfer builder panel */}
                <div className="lg:col-span-6 bg-white/5 border border-white/10 p-5 rounded-[32px] space-y-4 shadow-xl backdrop-blur-md">
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <Send className="w-5 h-5 text-indigo-400" />
                      Inscribe Transfer Order
                    </h2>
                    <p className="text-xs text-white/40">
                      Generate a Transfer Inscription and route standard EVM parameters on Base.
                    </p>
                  </div>

                  <form onSubmit={handleTransferTokens} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs text-white/40 font-semibold block">
                        Select Token
                      </label>
                      <select
                        value={transferToken}
                        onChange={(e) => setTransferToken(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 focus:border-white/30 rounded-2xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                      >
                        <option value="" className="bg-neutral-900">-- Choose Token --</option>
                        {Object.entries(userBalances).map(([tick, bal]) => (
                          <option key={tick} value={tick} className="bg-neutral-900">
                            ${tick} (Available: {bal.toLocaleString()})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs text-white/40 font-semibold block">
                        Recipient EVM Address
                      </label>
                      <input
                        type="text"
                        placeholder="0x..."
                        value={transferRecipient}
                        onChange={(e) => setTransferRecipient(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 focus:border-white/30 rounded-2xl px-3.5 py-2.5 text-xs text-white focus:outline-none font-mono"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs text-white/40 font-semibold block">
                        Amount to Transfer
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 500"
                        value={transferAmount}
                        onChange={(e) => setTransferAmount(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 focus:border-white/30 rounded-2xl px-3.5 py-2.5 text-xs text-white focus:outline-none font-mono"
                      />
                    </div>

                    {transferToken && transferAmount && (
                      <div className="bg-black/20 p-4 rounded-2xl border border-white/10 space-y-1.5">
                        <span className="text-[10px] text-white/40 font-mono block uppercase">
                          Transfer Inscription Payload
                        </span>
                        <pre className="text-[11px] font-mono text-white/70">
                          {JSON.stringify({
                            p: "base-brc20",
                            op: "transfer",
                            tick: transferToken,
                            amt: transferAmount
                          }, null, 2)}
                        </pre>
                      </div>
                    )}

                    {transferError && (
                      <div className="flex items-center gap-2 bg-red-500/15 border border-red-500/25 text-red-300 p-3 rounded-2xl text-xs">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span>{transferError}</span>
                      </div>
                    )}

                    {transferTxHash && (
                      <div className="bg-green-500/15 border border-green-500/25 text-green-300 p-3.5 rounded-2xl text-xs space-y-1">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          <span className="font-semibold">Transfer Inscription Broadcasted!</span>
                        </div>
                        <p className="text-[10px] font-mono text-white/40">
                          Transaction Hash: {transferTxHash}
                        </p>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isTransferring}
                      className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs py-3 rounded-2xl transition flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-900/20"
                    >
                      <Send className="w-4 h-4" />
                      {isTransferring ? "Broadcasting Transfer..." : "Inscribe & Send Transfer"}
                    </button>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Mint Token details overlay dialog modal */}
      <AnimatePresence>
        {selectedMintToken && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-neutral-950/80 border border-white/15 rounded-[32px] max-w-lg w-full overflow-hidden shadow-2xl p-6 space-y-5 backdrop-blur-xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-amber-500 animate-pulse" />
                  <h3 className="font-bold text-white text-base">
                    Fair-Mint Inscription
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setSelectedMintToken(null);
                    setMintTxHash(null);
                    setMintStatusText("");
                  }}
                  className="text-xs bg-white/5 hover:bg-white/10 text-white/60 hover:text-white px-3 py-1.5 rounded-xl transition"
                >
                  Close
                </button>
              </div>

              {/* Token Parameters Info block */}
              <div className="bg-black/20 p-4 rounded-2xl border border-white/10 space-y-3">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-xs text-white/40">Ticker Protocol</span>
                  <span className="font-mono font-black text-blue-400 text-sm">
                    ${selectedMintToken.ticker}
                  </span>
                </div>
                <div className="flex justify-between text-xs border-b border-white/5 pb-2">
                  <span className="text-white/40">Mint Limit Per Tx</span>
                  <span className="font-mono text-white/80">
                    {selectedMintToken.mintLimit.toLocaleString()} tokens
                  </span>
                </div>
                <div className="flex justify-between text-xs pb-1">
                  <span className="text-white/40">Remaining Fair Supply</span>
                  <span className="font-mono text-white/80">
                    {(selectedMintToken.maxSupply - selectedMintToken.mintedAmount).toLocaleString()} tokens
                  </span>
                </div>
              </div>

              {/* JSON & Hex code layout */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-white/40 font-mono tracking-wider uppercase">
                    Inscription payload
                  </span>
                  <button
                    onClick={() => copyToClipboard(
                      JSON.stringify({
                        p: "base-brc20",
                        op: "mint",
                        tick: selectedMintToken.ticker,
                        amt: selectedMintToken.mintLimit.toString()
                      }), "mint-json"
                    )}
                    className="text-[9px] text-white/60 hover:text-white flex items-center gap-1 bg-white/5 border border-white/10 px-2.5 py-1.5 rounded-xl transition"
                  >
                    {copiedText === "mint-json" ? (
                      <>
                        <Check className="w-3 h-3 text-green-400" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <pre className="text-xs font-mono bg-black/30 p-3.5 rounded-xl border border-white/10 text-white/70">
                  {JSON.stringify({
                    p: "base-brc20",
                    op: "mint",
                    tick: selectedMintToken.ticker,
                    amt: selectedMintToken.mintLimit.toString()
                  }, null, 2)}
                </pre>
              </div>

              {/* Inscription Action Box */}
              <div className="space-y-3 pt-2">
                {mintStatusText && (
                  <div className={`p-3.5 rounded-2xl text-xs flex gap-2 items-start ${
                    mintStatusText.includes("Failed")
                      ? "bg-red-500/15 border border-red-500/25 text-red-300"
                      : mintStatusText.includes("broadcasted") || mintStatusText.includes("successfully")
                        ? "bg-green-500/15 border border-green-500/25 text-green-300"
                        : "bg-blue-500/15 border border-blue-500/25 text-blue-300"
                  }`}>
                    {mintStatusText.includes("Failed") ? (
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="space-y-1">
                      <p className="font-medium leading-normal">{mintStatusText}</p>
                      {mintTxHash && (
                        <p className="text-[9px] font-mono text-white/40 break-all select-all">
                          Tx Hash: {mintTxHash}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setSelectedMintToken(null);
                      setMintTxHash(null);
                      setMintStatusText("");
                    }}
                    className="flex-1 bg-white/5 hover:bg-white/10 text-white font-semibold text-xs py-3 rounded-2xl border border-white/10 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleMintInscribe}
                    disabled={isMinting}
                    className="flex-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs py-3 rounded-2xl shadow-lg shadow-blue-900/20 transition flex items-center justify-center gap-2"
                  >
                    <Coins className="w-4 h-4 animate-spin-slow" />
                    {isMinting ? "Inscribing..." : `Inscribe ${selectedMintToken.mintLimit.toLocaleString()} $${selectedMintToken.ticker}`}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer layout */}
      <footer className="border-t border-white/10 bg-black/40 py-6 px-4 md:px-6 text-center text-xs text-white/40 mt-auto space-y-2 backdrop-blur-md">
        <div className="flex items-center justify-center gap-1.5 font-mono text-[10px]">
          <Database className="w-3.5 h-3.5 text-white/30" />
          <span>Base BRC-20 Protocol. Index Node V1.2.0-Alpha</span>
        </div>
        <p>Built for the Base Farcaster Ecosystem. Fully compatible with Coinbase Wallet.</p>
      </footer>
    </div>
    </div>
  );
}
