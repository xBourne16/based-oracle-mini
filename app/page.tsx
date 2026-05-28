/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"; 

import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ethers } from "ethers";
import { oracleDrops } from "./quotes";
import "./globals.css";
import {
  useAccount,
  useDisconnect,
  useWalletClient,
  useSwitchChain,
} from "wagmi";
import html2canvas from "html2canvas";
import { sdk } from "@farcaster/miniapp-sdk";

export default function Home() {
const [oracleDrop, setOracleDrop] =
  useState<(typeof oracleDrops)[number] | null>(null);
  const [quote, setQuote] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
  sdk.actions.ready().catch((err) => {
    console.log("Farcaster ready failed:", err);
  });
}, []);

  const [glowIntensity, setGlowIntensity] = useState(
    "opacity-20 scale-100"
  );

  const shareCardRef = useRef<HTMLDivElement | null>(null);

  const { address } =
  useAccount();

const connectModal = useConnectModal();

const openConnectModal =
  connectModal?.openConnectModal;

const { disconnect } =
  useDisconnect();
const { data: walletClient } =
  useWalletClient();

const { switchChainAsync } =
  useSwitchChain();


    const [baseName, setBaseName] =
  useState<string | null>(null);

  const [txHash, setTxHash] =
    useState<string | null>(null);

 const [greeting, setGreeting] =
  useState("The Great Awakening");

  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isMiniFrame, setIsMiniFrame] = useState(false);

  useEffect(() => {
    const detectMiniFrame = () => {
      const ua = navigator.userAgent.toLowerCase();
      const referrer = document.referrer.toLowerCase();
      const search = window.location.search.toLowerCase();

      let ancestor = "";

      try {
        ancestor = Array.from(window.location.ancestorOrigins || [])
          .join(" ")
          .toLowerCase();
      } catch {
        ancestor = "";
      }

      const isEmbedded = window.self !== window.top;
      const looksLikeFarcaster =
        ua.includes("farcaster") ||
        ua.includes("warpcast") ||
        referrer.includes("farcaster") ||
        referrer.includes("warpcast") ||
        ancestor.includes("farcaster") ||
        ancestor.includes("warpcast");

const forcedByQuery =
  window.location.search.includes("mini=1");
      const smallIframe =
        isEmbedded &&
        window.innerWidth <= 760;

      setIsMiniFrame(
        forcedByQuery ||
          looksLikeFarcaster ||
          smallIframe
      );
    };

    detectMiniFrame();
    window.addEventListener("resize", detectMiniFrame);

    return () => {
      window.removeEventListener("resize", detectMiniFrame);
    };
  }, []);

  // DROPDOWN
  const [isDropdownOpen, setIsDropdownOpen] =
    useState(false);

  const openWalletModal = () => {
    if (address) {
      setIsDropdownOpen((prev) => !prev);
    } else {
      openConnectModal?.();
    }
  };

  // COOLDOWN TIMER
  const [cooldown, setCooldown] =
    useState<number>(0);

  // DAILY LUCKY NUMBER
  const [luckyNumber, setLuckyNumber] =
    useState<number | null>(null);
    const [shareUrl, setShareUrl] =
  useState("");
  const [siteOrigin, setSiteOrigin] =
  useState("");
  useEffect(() => {
  if (!address) return;

  const today = new Date().toISOString().split("T")[0];

  const savedShare = localStorage.getItem(
    `oracle_share_${address}_${today}`
  );

  if (savedShare) {
    setShareUrl(savedShare);
  }
}, [address]);
  const [streak, setStreak] =
  useState<number>(0);
  const [oracleHistory, setOracleHistory] = useState<
  {
    quote: string;
    luckyNumber: number;
    txHash: string;
    date: string;
  }[]
>([]);

  // CONTRACT ADDRESS
  const CONTRACT_ADDRESS =
    "0x10d57710D44e56A76D8CC3Be57879A0131879e3b";

  // ABI
  const abi = [
    "function consult() public",
    "function getRemainingTime(address user) view returns (uint256)",
  ];

  useEffect(() => {
    setSiteOrigin(window.location.origin);

    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      setGreeting("The Great Awakening");
    } else if (hour >= 12 && hour < 18) {
      setGreeting("The High Noon Cycle");
    } else if (hour >= 18 && hour < 22) {
      setGreeting("The Twilight Shift");
    } else {
      setGreeting("The Midnight Watch");
    }

    // Ses Hazırlığı
    const audio = new Audio("/mystic-temple.mp3");
    audio.loop = true;
    audio.volume = 0.15;
    audioRef.current = audio;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // SHARE URL RESTORE
useEffect(() => {
  if (!address) return;

  const today =
    new Date()
      .toISOString()
      .split("T")[0];

  const savedShare = localStorage.getItem(
    `oracle_share_${address}_${today}`
  );

  if (savedShare) {
    setShareUrl(savedShare);
  }
}, [address]);

  // Ses Durumu Değiştiğinde Elementi Güncelle
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // DAILY DATA LOAD
  useEffect(() => {
  if (!address) return;

    const today =
      new Date().toISOString().split("T")[0];

    const savedQuote =
      localStorage.getItem(
        `oracle_quote_${address}_${today}`
      );

    const savedLucky =
      localStorage.getItem(
        `oracle_lucky_${address}_${today}`
      );
      const savedShareUrl =
  localStorage.getItem(
    `oracle_share_${address}_${today}`
  );

    if (savedQuote) {
      setQuote(savedQuote);
    }

    if (savedLucky) {
      setLuckyNumber(Number(savedLucky));
    }
    if (savedShareUrl) {
  setShareUrl(savedShareUrl);
}
  }, [address]);
  // ORACLE HISTORY LOAD
useEffect(() => {
  if (!address) return;

  const history = JSON.parse(
    localStorage.getItem(
      `oracle_history_${address}`
    ) || "[]"
  );

  setOracleHistory(history);
}, [address]);
// BASENAME RESOLVE
useEffect(() => {
  if (!address) return;

  const fetchBasename = async () => {
    try {
      const provider =
        new ethers.JsonRpcProvider(
          "https://ethereum-rpc.publicnode.com"
        );

      const name =
        await provider.lookupAddress(
          address
        );

      if (name) {
        setBaseName(name);
      } else {
        setBaseName(null);
      }
    } catch (err) {
      console.log(
        "Basename lookup failed"
      );
    }
  };

  fetchBasename();
}, [address]);
  // LIVE BLOCKCHAIN COOLDOWN TIMER
  useEffect(() => {
    if (!address) return;

    const fetchCooldown = async () => {
      try {
const provider =
  new ethers.JsonRpcProvider(
    "https://mainnet.base.org"
  );

        const contract =
          new ethers.Contract(
            CONTRACT_ADDRESS,
            abi,
            provider
          );

        const remaining =
          await contract.getRemainingTime(
            address
          );

        setCooldown(
          Number(remaining) * 1000
        );
      } catch (err) {
        console.error(
          "Cooldown fetch error:",
          err
        );
      }
    };

    fetchCooldown();

    const interval = setInterval(
      fetchCooldown,
      1000
    );

    return () => clearInterval(interval);
  }, [address]);

  const getUniqueQuoteIndex = (
  address: string,
  hash: string
) => {
  const today =
    new Date().toISOString().split("T")[0];

  const seed =
    address + hash + today;

  let hashValue = 0;

  for (let i = 0; i < seed.length; i++) {
    hashValue =
      (hashValue << 5) -
      hashValue +
      seed.charCodeAt(i);

    hashValue |= 0;
  }

  return (
    Math.abs(hashValue) %
    oracleDrops.length
  );
};

const getUnusedOracleDrop = (
  address: string,
  drops: typeof oracleDrops
) => {
  const usedKey = `oracle_used_drops_${address}`;

  const usedIndexes: number[] = JSON.parse(
    localStorage.getItem(usedKey) || "[]"
  );

  const availableDrops = drops
    .map((drop, index) => ({
      drop,
      index,
    }))
    .filter(
      (item) =>
        !usedIndexes.includes(item.index)
    );

  const pool =
    availableDrops.length > 0
      ? availableDrops
      : drops.map((drop, index) => ({
          drop,
          index,
        }));

  const selected =
    pool[
      Math.floor(
        Math.random() * pool.length
      )
    ];

  const nextUsed =
    availableDrops.length > 0
      ? [...usedIndexes, selected.index]
      : [selected.index];

  localStorage.setItem(
    usedKey,
    JSON.stringify(nextUsed)
  );

  return selected.drop;
};

  // DAILY LUCKY NUMBER
  const generateLuckyNumber = (
    address: string
  ) => {
    const today =
      new Date().toISOString().split("T")[0];

    const combinedSeed =
      address + today;

    const charSum = combinedSeed
      .split("")
      .reduce(
        (acc, char) =>
          acc + char.charCodeAt(0),
        0
      );

    return (charSum % 999) + 1;
  };

  const getStreakBadge = (days: number) => {
  if (days >= 30) return "ORACLE PRIME";
  if (days >= 14) return "ASCENDED";
  if (days >= 7) return "PROPHET";
  if (days >= 3) return "DISCIPLE";
  return "INITIATE";
};

const getStreakGlow = (days: number) => {
  if (days >= 30)
    return "text-red-400 shadow-[0_0_25px_rgba(248,113,113,0.9)]";

  if (days >= 14)
    return "text-yellow-300 shadow-[0_0_25px_rgba(253,224,71,0.9)]";

  if (days >= 7)
    return "text-purple-300 shadow-[0_0_25px_rgba(216,180,254,0.9)]";

  if (days >= 3)
    return "text-cyan-300 shadow-[0_0_25px_rgba(103,232,249,0.9)]";

  return "text-blue-300 shadow-[0_0_20px_rgba(96,165,250,0.8)]";
};

 const disconnectWallet = () => {
  disconnect();

  setTxHash(null);
  setQuote("");
  setCooldown(0);
  setLuckyNumber(null);
  setIsDropdownOpen(false);
};


const downloadShareCard = async () => {
  if (!shareCardRef.current) return;

  const canvas = await html2canvas(
    shareCardRef.current,
    {
      backgroundColor: "#020204",
      scale: 2,
    }
  );

  const image = canvas.toDataURL("image/png");

  const link = document.createElement("a");
  link.href = image;
  link.download = "based-oracle-prophecy.png";
  link.click();
};

  const handleAction = async () => {
    if (isAnimating) return;

    // Ses Başlatma (Mistik hava başlasın)
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.play().catch(() => console.log("Audio play blocked"));
    }

    if (!address) {
      openConnectModal?.();
      return;
    }

    // BLOCKCHAIN COOLDOWN CHECK
    if (cooldown > 0) {
      return;
    }

    try {
      setIsAnimating(true);
      setQuote("");
setLuckyNumber(null);

      setGlowIntensity(
        "opacity-60 scale-110"
      );

if (!walletClient) {
  openConnectModal?.();
  return;
}

if (walletClient.chain.id !== 8453) {
  await switchChainAsync({
    chainId: 8453,
  });
}

const provider =
  new ethers.BrowserProvider(
    walletClient.transport
  );

const signer =
  await provider.getSigner();
 

      const contract =
        new ethers.Contract(
          CONTRACT_ADDRESS,
          abi,
          signer
        );

      const tx =
        await contract.consult();

      setTxHash(tx.hash);
    const randomEnergy = Math.floor(
  Math.random() * 4
);

const todaySeed = new Date()
  .toISOString()
  .slice(0, 10);

const rarityWeights = {
  COMMON: 45,
  RARE: 30,
  EPIC: 15,
  LEGENDARY: 8,
  MYTHIC: 2,
};

const random =
  Math.floor(Math.random() * 100);

let selectedRarity = "COMMON";

if (random >= 98) {
  selectedRarity = "MYTHIC";
} else if (random >= 90) {
  selectedRarity = "LEGENDARY";
} else if (random >= 75) {
  selectedRarity = "EPIC";
} else if (random >= 45) {
  selectedRarity = "RARE";
}

const filteredDrops =
  oracleDrops.filter(
    (drop) =>
      drop.rarity ===
      selectedRarity
  );

const safeDrops =
  filteredDrops.length > 0
    ? filteredDrops
    : oracleDrops;

const prophecyQuote =
  getUnusedOracleDrop(
    address,
    safeDrops
  );
  setQuote(prophecyQuote.text);
  setOracleDrop(prophecyQuote);

const prophecyNumber =
  generateLuckyNumber(address);

const tweet = encodeURIComponent(
  `🔮 ORACLE TRANSMISSION 🔮\n\n` +

  `“${prophecyQuote.text}”\n\n` +

  `✦ ${prophecyQuote.category}\n` +
  `✦ ${prophecyQuote.rarity}\n` +
  `✦ ${prophecyQuote.source}\n\n` +

  `✦ Lucky Number: ${prophecyNumber}\n\n` +

  `✦ Oracle TX:\nhttps://basescan.org/tx/${tx.hash}\n\n` +

  `Consult your fate:\n${siteOrigin}`
);

const finalShareUrl =
  `https://twitter.com/intent/tweet?text=${tweet}`;

setShareUrl(finalShareUrl);

const today =
  new Date()
    .toISOString()
    .split("T")[0];

localStorage.setItem(
  `oracle_share_${address}_${today}`,
  finalShareUrl
);

      // DAILY QUOTE
const dailyDrop =
  oracleDrops[
    getUniqueQuoteIndex(address, tx.hash)
  ];

setOracleDrop(dailyDrop);

      // DAILY LUCKY NUMBER
      const number =
        generateLuckyNumber(
          address
        );

      setLuckyNumber(number);
      // UPDATE STREAK
const todayKey =
  new Date().toISOString().split("T")[0];

const yesterdayKey =
  new Date(Date.now() - 86400000)
    .toISOString()
    .split("T")[0];

const lastConsult =
  localStorage.getItem(
    `oracle_last_consult_${address}`
  );

let newStreak = streak;

if (lastConsult === todayKey) {
  newStreak = streak;
} else if (lastConsult === yesterdayKey) {
  newStreak = streak + 1;
} else {
  newStreak = 1;
}

localStorage.setItem(
  `oracle_last_consult_${address}`,
  todayKey
);

localStorage.setItem(
  `oracle_streak_${address}`,
  newStreak.toString()
);

setStreak(newStreak);
      // SAVE HISTORY
const historyItem = {
  quote: prophecyQuote.text,
  luckyNumber: number,
  txHash: tx.hash,
  date: new Date().toLocaleDateString(),
};

const existingHistory = JSON.parse(
  localStorage.getItem(
    `oracle_history_${address}`
  ) || "[]"
);

const updatedHistory = [
  historyItem,
  ...existingHistory,
].slice(0, 10);

localStorage.setItem(
  `oracle_history_${address}`,
  JSON.stringify(updatedHistory)
);

setOracleHistory(updatedHistory);

      // SAVE DAILY DATA
     
      localStorage.setItem(
        `oracle_quote_${address}_${today}`,
        prophecyQuote.text
      );

      localStorage.setItem(
        `oracle_lucky_${address}_${today}`,
        number.toString()
      );

      await tx.wait();

      // REFRESH COOLDOWN
      const remaining =
        await contract.getRemainingTime(
          address
        );

      setCooldown(
        Number(remaining) * 1000
      );
    } catch (error: any) {
      console.error("TX Error:", error);

      // USER REJECT
      if (error.code === 4001) {
        return;
      }

      // SILENT FAIL
      console.log(
        "Cooldown active or tx failed."
      );
    } finally {
      setIsAnimating(false);

      setGlowIntensity(
        "opacity-20 scale-100"
      );
    }
  };

  // TIMER FORMAT
  const formatCooldown = (
    ms: number
  ) => {
    const hours = Math.floor(
      ms / (1000 * 60 * 60)
    );

    const minutes = Math.floor(
      (ms % (1000 * 60 * 60)) /
        (1000 * 60)
    );

    const seconds = Math.floor(
      (ms % (1000 * 60)) / 1000
    );

    return `${hours
      .toString()
      .padStart(2, "0")}H ${minutes
      .toString()
      .padStart(2, "0")}M ${seconds
      .toString()
      .padStart(2, "0")}S`;
  };

if (isMiniFrame) {
  return (
    <main className="fixed inset-0 z-[999999] h-[100dvh] w-screen overflow-y-auto bg-[#020204] text-white px-4 pt-3 pb-5">
      <div className="mx-auto flex w-full max-w-[390px] flex-col items-center">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2">
          <Image
            src="/base_logo.png"
            alt="Base"
            width={18}
            height={18}
            className="brightness-200"
          />
          <span className="text-[9px] font-black uppercase tracking-[0.32em] text-blue-200">
            Farcaster Mini App
          </span>
        </div>

        <h1 className="mb-3 text-center text-[38px] font-black uppercase italic leading-none tracking-tighter text-white">
          BASED<span className="text-blue-600">.</span>ORACLE
        </h1>

        <section className="w-full rounded-[30px] border border-white/10 bg-white/[0.045] p-4 shadow-[0_0_45px_rgba(37,99,235,0.18)] backdrop-blur-xl">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="truncate text-[10px] font-black uppercase tracking-[0.22em] text-blue-200">
                ◈ {greeting}
              </div>
              <div className="mt-1 text-[8px] uppercase tracking-[0.28em] text-white/35">
                Scanning souls...
              </div>
            </div>

            <button
              type="button"
              onClick={openWalletModal}
              className="shrink-0 rounded-full border border-white/10 bg-white/[0.07] px-4 py-3 text-[9px] font-black uppercase tracking-[0.18em] text-white active:scale-95"
            >
              {address
                ? `${address.slice(0, 4)}...${address.slice(-4)}`
                : "Wallet"}
            </button>
          </div>

          <div className="flex min-h-[185px] flex-col items-center justify-center text-center">
            <p className="text-[24px] font-semibold italic leading-[1.08] text-white">
              {quote
                ? `“${quote}”`
                : isAnimating
                ? "Decrypting your onchain transmission..."
                : cooldown > 0
                ? "The Oracle sleeps..."
                : "Authorize the transaction to reveal your transmission."}
            </p>

            {oracleDrop && quote && (
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <span className="rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-[8px] font-black uppercase tracking-[0.18em] text-blue-200">
                  {oracleDrop.category}
                </span>
                <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[8px] font-black uppercase tracking-[0.18em] text-white/60">
                  {oracleDrop.rarity}
                </span>
              </div>
            )}

            {luckyNumber && (
              <div className="mt-4 rounded-full border border-blue-500/30 bg-blue-500/10 px-6 py-2">
                <span className="text-2xl font-black tracking-[0.2em] text-blue-300">
                  {luckyNumber}
                </span>
              </div>
            )}

            <div className="mt-4 rounded-full border border-blue-500/30 bg-blue-500/10 px-5 py-2">
              <span className="text-[10px] font-black uppercase tracking-[0.22em] text-blue-300">
                ✦ {Math.max(streak, 1)} DAY — {getStreakBadge(streak)}
              </span>
            </div>
          </div>

          {cooldown > 0 && (
            <div className="mt-3 text-center text-[11px] font-black uppercase tracking-[0.25em] text-blue-300">
              {formatCooldown(cooldown)}
            </div>
          )}

          <button
            onClick={handleAction}
            disabled={isAnimating || cooldown > 0}
            className={`mt-5 w-full rounded-full px-6 py-4 text-[10px] font-black uppercase tracking-[0.3em] transition-all ${
              cooldown > 0
                ? "border border-blue-500/20 bg-blue-950/40 text-blue-300"
                : "bg-white text-black active:scale-95"
            }`}
          >
            {isAnimating
              ? "Consulting..."
              : cooldown > 0
              ? "Oracle Sleeping"
              : txHash
              ? "Fate Decrypted"
              : "Consult Fate"}
          </button>
        </section>

        <div className="mt-3 text-center text-[9px] font-black uppercase tracking-[0.28em] text-white/30">
          MINI.BASEDORACLE.SPACE
        </div>
      </div>
    </main>
  );
}

return (
  <main className="relative z-10 min-h-[100dvh] overflow-y-auto bg-[#020204] flex flex-col items-center justify-start pt-6 md:pt-24 px-3 md:px-4">
    
{/* NEW DROPDOWN DESIGN */}
          {address && isDropdownOpen && (
            <div className="fixed top-24 left-4 right-4 z-[999999999] rounded-3xl p-[1px] bg-gradient-to-r from-blue-500/40 via-white/10 to-blue-500/20 shadow-2xl animate-in fade-in zoom-in duration-200">
              <div className="bg-[#0a0a0c]/95 backdrop-blur-2xl rounded-3xl p-5 border border-white/10 text-left">
                
                {/* HEADER */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-white/20 flex items-center justify-center font-bold text-black text-xs">
                    {address.slice(2, 4).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] text-white/40 uppercase tracking-[0.2em]">Connected Wallet</span>
                    <span className="text-[12px] text-white font-mono">
                      {baseName ||
  `${address.slice(0, 6)}...${address.slice(-4)}`}
                    </span>
                  </div>
                </div>

                {/* STATUS / NETWORK */}
                <div className="flex items-center justify-between mb-4 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="text-[9px] text-white/40 uppercase tracking-[0.2em]">Network</span>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_#4ade80]"></span>
                    <span className="text-[9px] text-green-400 uppercase tracking-widest font-bold">Base Mainnet</span>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-4 px-3 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
  <span className="text-[9px] text-white/40 uppercase tracking-[0.2em]">
    Oracle Rank
  </span>

<span
  className={`
    text-[9px]
    uppercase
    tracking-widest
    font-black
    px-3 py-1 rounded-full
    border border-white/10
    bg-white/[0.03]
    ${getStreakGlow(streak)}
  `}
>
  {getStreakBadge(streak)}
</span>
</div>

                {/* ACTIONS */}
<button
  onClick={() => setIsDropdownOpen(false)}
  className="
    absolute top-4 right-4
    w-8 h-8 rounded-full
    border border-white/10
    bg-white/[0.04]
    hover:bg-red-500/10
    hover:border-red-500/40
    transition-all duration-300
    text-white/50 hover:text-red-400
    text-sm font-bold
  "
>
  ✕
</button>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(address);
                      setIsDropdownOpen(false);
                    }}

                    
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 transition-all text-[10px] uppercase tracking-[0.2em] text-white/70 hover:text-white text-center"
                  >
                    Copy Address
                  </button>
                  <button
                    onClick={disconnectWallet}
                    className="w-full px-4 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 transition-all text-[10px] uppercase tracking-[0.2em] text-red-300 hover:text-red-200 text-center font-bold"
                  >
                    Disconnect Wallet
                  </button>
                </div>
              </div>
            </div>
          )}

{/* MAIN */}
<div
  className={`relative z-[50] w-full max-w-6xl flex flex-col items-center justify-start origin-top transition-all pointer-events-auto ${
    isAnimating ? "scale-95 blur-sm" : ""
  }`}
>
        <h1 className="text-[34px] sm:text-7xl md:text-[115px] font-black text-white leading-none tracking-tighter uppercase italic mt-0 md:mt-16 mb-1 md:mb-16 drop-shadow-2xl select-none">
          BASED
          <span className="text-blue-600">
            .
          </span>
          ORACLE
        </h1>

<div
  className={`relative w-full max-w-[660px] bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[50px] p-5 md:p-12 pb-16 md:pb-36 min-h-[390px] md:min-h-[620px] shadow-2xl md:-translate-x-12 transition-all duration-700 hover:-translate-y-4 hover:scale-[1.02] hover:border-blue-500/40 hover:shadow-[0_0_80px_rgba(37,99,235,0.35)] ${
    isAnimating
      ? "scale-95 border-blue-500/40 shadow-[0_0_50px_rgba(37,99,235,0.18)]"
      : ""
  } ${
    oracleDrop?.rarity === "MYTHIC"
      ? "animate-pulse border-red-500/50 shadow-[0_0_90px_rgba(239,68,68,0.35)]"
      : oracleDrop?.rarity === "LEGENDARY"
      ? "border-yellow-500/30 shadow-[0_0_70px_rgba(250,204,21,0.18)]"
      : oracleDrop?.rarity === "EPIC"
      ? "border-purple-500/30 shadow-[0_0_60px_rgba(168,85,247,0.18)]"
      : ""
  }`}
>

<div className="flex items-start justify-between gap-4 mb-10">
  <div>

    <div className="flex items-center gap-2">
      <div className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_14px_rgba(96,165,250,1)] animate-pulse"></div>

<div className="text-[16px] text-blue-200 tracking-[0.22em] font-black italic animate-pulse capitalize">
  ◈ {greeting}
</div>
    </div>

<div className="mt-3 flex items-center gap-2 relative">
  <div className="absolute inset-0 bg-blue-500/10 blur-xl rounded-full"></div>

  <div className="relative w-2 h-2 rounded-full bg-blue-400 animate-pulse shadow-[0_0_14px_rgba(59,130,246,0.95)]"></div>

  <span
    className="
      relative
      text-[15px]
      text-white/55
      font-mono
      uppercase
      tracking-[0.35em]
      animate-pulse
    "
  >
    SCANNING SOULS...
  </span>
</div>
</div>

<div className="relative z-[999999999] pointer-events-auto isolate">
  <button
    type="button"
    onClick={openWalletModal}
    className="flex items-center gap-3 px-7 py-4 bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-full active:scale-95"
  >
    <div className="w-2 h-2 rounded-full bg-blue-500"></div>

    <span className="text-[11px] font-black text-white uppercase tracking-[0.25em]">
      {address
        ? `${address.slice(0, 6)}...${address.slice(-4)}`
        : "Connect Wallet"}
    </span>
  </button>
</div>
</div>
 
          <div className="absolute top-10 left-12 w-10 h-[2px] bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,1)]"></div>

          <div className="min-h-[220px] flex flex-col items-center justify-center text-center">

{/* ORACLE TITLE */}
{quote && oracleDrop && (
  <div className="mt-10 mb-6 flex flex-col items-center gap-4 relative z-[40]">

    {/* ORACLE TRANSMISSION */}
    <div className="relative">
      <div className="absolute inset-0 bg-purple-500/30 blur-2xl rounded-full animate-pulse"></div>

      <div
        className="
          relative overflow-hidden
          px-7 py-2.5
          rounded-full
          border border-purple-400/50
          bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20
          text-[12px]
          uppercase
          tracking-[0.5em]
          text-blue-100
          font-black
          italic
          shadow-[0_0_35px_rgba(168,85,247,0.75)]
        "
      >
        <div className="absolute inset-0 opacity-40 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shine_3s_linear_infinite]" />

        <span className="relative z-10">
          ✦ ORACLE TRANSMISSION ✦
        </span>
      </div>
    </div>

    {/* TAGS */}
    <div className="flex flex-wrap items-center justify-center gap-3">

      {/* SOURCE */}
      <span
        className="
          px-4 py-1.5
          rounded-full
          bg-blue-500/15
          border border-blue-400/40
          text-[10.5px]
          text-blue-200
          uppercase
          tracking-[0.22em]
          font-black
          shadow-[0_0_20px_rgba(59,130,246,0.55)]
          backdrop-blur-xl
        "
      >
        {oracleDrop.source}
      </span>

      {/* CATEGORY */}
      <span
        className="
          px-4 py-1.5
          rounded-full
          bg-white/[0.06]
          border border-white/15
          text-[10px]
          text-white/70
          uppercase
          tracking-[0.22em]
          font-black
          backdrop-blur-xl
        "
      >
        {oracleDrop.category}
      </span>

      {/* RARITY */}
      <span
        className={`
          relative overflow-hidden
          px-4 py-1.5
          rounded-full
          text-[10.5px]
          uppercase
          tracking-[0.3em]
          font-black
          border
          transition-all duration-500
          backdrop-blur-xl

          ${
            oracleDrop?.rarity === "COMMON"
              ? "bg-white/[0.04] text-white/50 border-white/10 shadow-[0_0_12px_rgba(255,255,255,0.08)]"

              : oracleDrop?.rarity === "RARE"
              ? "bg-blue-500/15 text-blue-200 border-blue-400/40 shadow-[0_0_28px_rgba(59,130,246,0.45)]"

              : oracleDrop?.rarity === "EPIC"
              ? "bg-purple-500/15 text-purple-200 border-purple-400/50 shadow-[0_0_35px_rgba(168,85,247,0.6)] animate-pulse"

              : oracleDrop?.rarity === "LEGENDARY"
              ? "bg-yellow-500/15 text-yellow-200 border-yellow-400/50 shadow-[0_0_40px_rgba(250,204,21,0.7)] animate-pulse"

              : "bg-red-500/15 text-red-200 border-red-400/50 shadow-[0_0_45px_rgba(239,68,68,0.8)] animate-pulse"
          }
        `}
      >
        <div className="absolute inset-0 opacity-40 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shine_3s_linear_infinite]" />

        <span className="relative z-10">
          ✦ {oracleDrop.rarity} ✦
        </span>
      </span>

    </div>
  </div>
)}

{/* ORACLE TEXT */}
<p
  key={quote || isAnimating ? "active" : "empty"}
  className={`mt-4 text-2xl sm:text-3xl md:text-[44px] text-white italic text-center leading-[1.1] font-medium transition-all duration-700 ${
    quote
      ? "opacity-100 translate-y-0"
      : "opacity-80 translate-y-2"
  }`}
>
  {quote
    ? `"${quote}"`
    : isAnimating
    ? "Decrypting your onchain transmission..."
    : cooldown > 0
    ? "The Oracle sleeps..."
    : "Authorize the transaction to reveal your transmission."}
</p>

    <div className="mt-8 px-7 py-3 rounded-full border border-blue-500/30 bg-blue-500/10 backdrop-blur-xl shadow-[0_0_30px_rgba(37,99,235,0.2)]">
      <span className="text-[13px] font-black text-blue-400 tracking-[0.25em] uppercase">
        ✦ {Math.max(streak, 1)} DAY — {getStreakBadge(streak)}
      </span>
    </div>

</div>

{/* SHARE PROPHECY */}
{quote && (shareUrl || oracleHistory[0]?.txHash) && (
  <div className="absolute bottom-2 left-0 right-0 px-8 z-[80]">
    <div className="w-full flex justify-between items-center gap-5">

      {/* SHARE BUTTON */}
      <a
        href={
          shareUrl ||
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            `🔮 BASED ORACLE PROPHECY 🔮\n\n“${quote}”\n\n✦ Lucky Number: ${luckyNumber}\n\n✦ Oracle TX:\nhttps://basescan.org/tx/${oracleHistory[0]?.txHash}\n\nConsult your fate:\n${siteOrigin}`
          )}`
        }
        target="_blank"
        rel="noopener noreferrer"
        className="
          group relative flex-1 overflow-hidden
          rounded-[24px]
          border border-blue-500/30
          bg-[#071120]
          px-5 py-4
          transition-all duration-300
          hover:scale-[1.03]
          hover:border-blue-400
          hover:bg-blue-500/[0.08]
          hover:shadow-[0_0_35px_rgba(59,130,246,0.35)]
        "
      >
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-blue-500/5"></div>

        <div className="relative flex items-center justify-between">

          <div className="flex items-center gap-4">

            <div
              className="
                w-11 h-11 rounded-2xl
                bg-blue-500/10
                border border-blue-500/20
                flex items-center justify-center
              "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#60a5fa"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="18" cy="5" r="3"></circle>
                <circle cx="6" cy="12" r="3"></circle>
                <circle cx="18" cy="19" r="3"></circle>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
              </svg>
            </div>

            <div className="flex flex-col">
              <span className="text-white font-black text-[12px] tracking-wide uppercase">
                Share Prophecy
              </span>

              <span className="text-blue-200/40 text-[9px] tracking-[0.25em] uppercase">
                Spread The Wisdom
              </span>
            </div>
          </div>

          <span className="text-blue-400 text-lg group-hover:translate-x-1 transition-transform">
            →
          </span>
        </div>
      </a>

      {/* DOWNLOAD BUTTON */}
      <button
        onClick={downloadShareCard}
        className="
          group relative flex-1 overflow-hidden
          rounded-[24px]
          border border-blue-500/30
          bg-[#071120]
          px-5 py-4
          transition-all duration-300
          hover:scale-[1.03]
          hover:border-blue-400
          hover:bg-blue-500/[0.08]
          hover:shadow-[0_0_35px_rgba(59,130,246,0.35)]
        "
      >
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-blue-500/5"></div>

        <div className="relative flex items-center justify-between">

          <div className="flex items-center gap-4">

            <div
              className="
                w-11 h-11 rounded-2xl
                bg-blue-500/10
                border border-blue-500/20
                flex items-center justify-center
              "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#60a5fa"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
            </div>

            <div className="flex flex-col">
              <span className="text-white font-black text-[12px] tracking-wide uppercase">
                Download Card
              </span>

              <span className="text-blue-200/40 text-[9px] tracking-[0.25em] uppercase">
                Save Your Fate
              </span>
            </div>
          </div>

          <span className="text-blue-400 text-lg group-hover:translate-x-1 transition-transform">
            →
          </span>
        </div>
      </button>
    </div>
  </div>
)}

{quote && luckyNumber && (
  <div className="mt-6 flex flex-col items-center relative z-[60]">
    
    <div className="relative mb-4">
      <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full animate-pulse"></div>

      <span
        className="
          relative
          text-[11px]
          uppercase
          tracking-[0.25em]
          text-blue-200
          font-black
          px-4 py-1.5
          rounded-full
          border border-blue-400/30
          bg-blue-500/10
          shadow-[0_0_30px_rgba(59,130,246,0.55)]
          animate-[pulse_1.8s_ease-in-out_infinite]
        "
      >
        ✦ YOUR LUCKY NUMBER TODAY ✦
      </span>
    </div>

                  <div className="px-8 py-3 rounded-full border border-blue-500/30 bg-blue-500/10 backdrop-blur-xl shadow-[0_0_30px_rgba(37,99,235,0.2)]">
                    <span className="text-3xl md:text-4xl font-black text-blue-400 tracking-[0.15em]">
                      {luckyNumber}
                    </span>
                  </div>
                </div>
              )}

          {/* COOL TIMER */}
          {cooldown > 0 && (
            <div className="flex flex-col items-center justify-center mb-10 animate-pulse">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-lg"></div>

                <div className="relative px-10 py-5 rounded-full border border-blue-500/40 bg-blue-500/10 backdrop-blur-2xl shadow-[0_0_40px_rgba(37,99,235,0.35)]">
                  <span className="text-blue-400 font-black tracking-[0.35em] uppercase text-[13px] md:text-[16px]">
                    {formatCooldown(cooldown)}
                  </span>
                </div>
              </div>

              <span className="mt-4 text-[10px] uppercase tracking-[0.4em] text-white/30 italic">
                Oracle Cooldown Active
              </span>
            </div>
          )}

          <div className="mt-6 flex flex-col items-center gap-5 relative z-[60] w-full">
            <button
              onClick={handleAction}
              disabled={isAnimating || cooldown > 0}
              className={`group overflow-hidden relative z-[70] px-14 py-6 font-black rounded-full transition-all text-[10px] uppercase tracking-[0.3em] shadow-xl ${
                cooldown > 0
                  ? "bg-blue-950/40 text-blue-300 border border-blue-500/20 cursor-not-allowed"
                  : "bg-white text-black hover:bg-blue-600 hover:text-white hover:scale-105 active:scale-95 hover:shadow-[0_0_35px_rgba(37,99,235,0.55)]"
              } ${isAnimating ? "opacity-50" : ""}`}
            >
              <span className="relative z-10">
                {isAnimating
                  ? "Consulting..."
                  : cooldown > 0
                  ? "Oracle Sleeping"
                  : txHash
                  ? "Fate Decrypted"
                  : "Consult Fate"}
              </span>
            </button>

            <div className="mt-1 mb-14 w-full flex justify-center animate-float">
              <div className="inline-flex items-center justify-center gap-1 bg-white/[0.05] px-5 py-3.5 rounded-full border border-white/10 backdrop-blur-xl shadow-xl">
                <span className="text-[11px] text-blue-500 font-black tracking-widest uppercase italic leading-none">
                  You&apos;re now based
                </span>

                <div className="relative w-5 h-4 flex items-center">
                  <Image
                    src="/base_logo.png"
                    alt="Base Logo"
                    fill
                    className="object-contain brightness-200"
                  />
                </div>
              </div>
            </div>
          </div>

<div className="fixed -left-[99999px] top-0">
<div
  ref={shareCardRef}
  className="
    w-[1200px] h-[630px]
    relative overflow-hidden
    flex flex-col items-start text-left
    px-20 py-10
    bg-cover bg-center
  "
  style={{
    backgroundImage: "url('/share-bg.png')",
  }}
>
  {/* DARK OVERLAY */}
  <div className="absolute inset-0 bg-black/35"></div>

  {/* LEFT READABILITY GRADIENT */}
  <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent"></div>

  {/* QUOTE */}
  <div
    className="
      relative z-10 mt-20
      ml-8
      max-w-[500px]
      px-8 py-4
      rounded-[30px]
      bg-black/10
      backdrop-blur-[1px]
      text-white
      text-[38px]
      font-black
      italic
      leading-[1.02]
      tracking-tight
      drop-shadow-[0_0_30px_rgba(255,255,255,0.25)]
    "
  >
    “{oracleDrop?.text || quote}”
  </div>

  {/* BADGES */}
  <div className="relative z-10 flex gap-4 mt-6 mb-6 ml-16">
    <div className="px-6 py-2.5 rounded-full border border-blue-400/40 bg-blue-500/20 text-blue-100 text-[18px] uppercase tracking-[0.22em] font-black shadow-[0_0_25px_rgba(59,130,246,0.45)]">
      {oracleDrop?.category}
    </div>

    <div className="px-6 py-2.5 rounded-full border border-white/15 bg-black/25 text-white/80 text-[18px] uppercase tracking-[0.22em] font-black">
      {oracleDrop?.source}
    </div>

    <div className="px-6 py-2.5 rounded-full border border-purple-400/50 bg-purple-500/25 text-purple-100 text-[18px] uppercase tracking-[0.22em] font-black shadow-[0_0_28px_rgba(168,85,247,0.65)]">
      {oracleDrop?.rarity}
    </div>
  </div>

  {/* LUCKY NUMBER */}
  <div className="relative z-10 mt-2 ml-20 flex flex-col items-center">
    <div className="text-[15px] uppercase tracking-[0.45em] text-blue-100 font-black mb-3 drop-shadow-[0_0_18px_rgba(96,165,250,0.45)]">
      ✦ YOUR LUCKY NUMBER TODAY ✦
    </div>

    <div className="relative flex items-center justify-center">
      <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full scale-90"></div>

      <div
        className="
          relative
          text-[58px]
          leading-none
          text-blue-200
          font-black
          tracking-[0.02em]
          drop-shadow-[0_0_28px_rgba(96,165,250,0.9)]
        "
      >
        {luckyNumber}
      </div>
    </div>
  </div>

  {/* FOOTER */}
  <div className="absolute z-10 right-10 bottom-10 text-blue-300/80 text-[16px] tracking-[0.28em] uppercase font-black drop-shadow-[0_0_20px_rgba(59,130,246,0.65)]">
    MINI.BASEDORACLE.SPACE
  </div>
</div>
</div>
        </div>
         </div>

      {/* FOOTER */}
    </main>
  );
}