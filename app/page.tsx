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
  Rocket,
  Receipt,
  ShieldAlert,
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
  Megaphone
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import Sparkline from "@/components/Sparkline";

// Interface Definitions
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
    memosCount: 142
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
    memosCount: 89
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
    memosCount: 18
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
  const [activeTab, setActiveTab] = useState<"tokens" | "inscriptions" | "ledger" | "b20_launchpad" | "b20_payments" | "airdrop" | "notifications">("tokens");
  const [searchQuery, setSearchQuery] = useState("");
  const [mintFilter, setMintFilter] = useState<"all" | "completed" | "inprogress">("all");

  // Main Persistent State
  const [tokens, setTokens] = useState<BRC20Token[]>(INITIAL_TOKENS);
  const [inscriptions, setInscriptions] = useState<Inscription[]>(INITIAL_INSCRIPTIONS);
  const [ledger, setLedger] = useState<LedgerBalance[]>(INITIAL_LEDGER);

  // Base B20 Standard States
  const [b20Tokens, setB20Tokens] = useState<B20Token[]>(INITIAL_B20_TOKENS);
  const [b20Orders, setB20Orders] = useState<B20OrderPayment[]>(INITIAL_B20_ORDERS);

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

  // B20 Launchpad Form States
  const [launchName, setLaunchName] = useState("");
  const [launchSymbol, setLaunchSymbol] = useState("");
  const [launchDecimals, setLaunchDecimals] = useState<number>(18);
  const [launchCap, setLaunchCap] = useState<number>(10000000);
  const [launchPolicy, setLaunchPolicy] = useState<"Open" | "Allowlist" | "KYC Restricted">("Open");
  const [isDeployingB20, setIsDeployingB20] = useState(false);
  const [deployStep, setDeployStep] = useState(0);
  const [b20DeployToast, setB20DeployToast] = useState<string | null>(null);

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
  const [qrFgColor, setQrFgColor] = useState("#000000");
  const [qrBgColor, setQrBgColor] = useState("#ffffff");
  const [qrErrorLevel, setQrErrorLevel] = useState<"L" | "M" | "Q" | "H">("H");
  const [copiedQrData, setCopiedQrData] = useState(false);

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
        memosCount: 0
      };

      setB20Tokens((prev) => [newB20, ...prev]);
      setIsDeployingB20(false);
      setDeployStep(0);
      setLaunchName("");
      setLaunchSymbol("");
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
    try {
      const storedTokens = localStorage.getItem("brc20_tokens");
      const storedInscriptions = localStorage.getItem("brc20_inscriptions");
      const storedLedger = localStorage.getItem("brc20_ledger");

      if (storedTokens) setTokens(JSON.parse(storedTokens));
      if (storedInscriptions) setInscriptions(JSON.parse(storedInscriptions));
      if (storedLedger) setLedger(JSON.parse(storedLedger));
    } catch (err) {
      console.error("Failed to parse stored JSON from localStorage:", err);
    }
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

  // Search and Filter Ledger Balances
  const filteredLedger = ledger.filter((b) =>
    b.ticker.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                            onClick={() => {
                              setPayTokenAddress(token.contractAddress);
                              setActiveTab("b20_payments");
                            }}
                            className="flex-1 py-2 px-3 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                          >
                            <Receipt className="w-3.5 h-3.5" />
                            Accept Payments
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
                              const ledgerAddrs = ledger.map(() => "0x71C7656EC7ab88b098defB751B7401B5f6d8976F");
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
                          Click "Fetch List" to retrieve all wallet addresses opted in for push alerts.
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
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <History className="w-4 h-4 text-emerald-400" />
                      Reconciled Order Payments ({b20Orders.length})
                    </h3>
                    <span className="text-[10px] font-mono text-slate-400">
                      Matched via <code className="text-emerald-400 font-bold">parseEventLogs(Memo)</code>
                    </span>
                  </div>

                  <div className="overflow-x-auto" id="orders_table_container">
                    <table className="w-full text-left border-collapse" id="orders_table">
                      <thead>
                        <tr className="border-b border-slate-800 text-[10px] text-slate-500 uppercase font-mono bg-slate-950/40">
                          <th className="py-3 px-4">Order ID Memo</th>
                          <th className="py-3 px-4">Token & Amount</th>
                          <th className="py-3 px-4">Payer Wallet</th>
                          <th className="py-3 px-4">Bytes32 Memo</th>
                          <th className="py-3 px-4 text-center">Status</th>
                          <th className="py-3 px-4 text-right">Timestamp</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 text-xs font-mono text-slate-300">
                        {b20Orders.map((order) => (
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
                          Click "Fetch List" to retrieve all wallet addresses opted in for push alerts.
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
                        level={qrErrorLevel}
                        fgColor={qrFgColor}
                        bgColor={qrBgColor}
                        includeMargin={false}
                      />
                    </div>

                    {/* Color & Density Control Panel */}
                    <div className="flex flex-col gap-2 w-full max-w-sm" id="qr_color_controls_panel">
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
                <div className="px-6 py-4 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between gap-3 flex-wrap" id="qr_modal_footer">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const svg = document.getElementById("inscription-qr-code-svg") as SVGSVGElement | null;
                        if (!svg) return;
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
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold font-mono transition-all shadow-md shadow-amber-500/10 cursor-pointer"
                      id="save_qr_png_btn"
                    >
                      <Download className="w-4 h-4 text-slate-950" />
                      Save as PNG
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

      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950 py-6 px-4 md:px-8 text-center text-xs text-slate-600" id="app_footer">
        <p>© 2026 BRC-20 Ledger Dashboard. Experimental Bitcoin Token Standard Client Sandboxed Sandbox Environment.</p>
      </footer>
    </div>
  );
}
