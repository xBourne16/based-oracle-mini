"use client";

import "@rainbow-me/rainbowkit/styles.css";

import {
  useConnectModal,
  ConnectButton,
} from "@rainbow-me/rainbowkit";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ethers } from "ethers";
import { quotes } from "./quotes";
import "./globals.css";
import {
  useAccount,
  useDisconnect,
  useWalletClient,
  useSwitchChain,
} from "wagmi";

export default function Home() {


  const [quote, setQuote] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [glowIntensity, setGlowIntensity] = useState(
    "opacity-20 scale-100"
  );

  const { address } =
  useAccount();

  const { openConnectModal } =
    useConnectModal();


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
    useState("GM");

  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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
}, [address, walletClient]);
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
 if (!walletClient) return;

const provider =
  new ethers.BrowserProvider(
    walletClient.transport as any
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

    const combinedSeed =
      address + hash + today;

    const charSum = combinedSeed
      .split("")
      .reduce(
        (acc, char) =>
          acc + char.charCodeAt(0),
        0
      );

    return charSum % quotes.length;
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
  return "SEEKER";
};

 const disconnectWallet = () => {
  disconnect();

  setTxHash(null);
  setQuote("");
  setCooldown(0);
  setLuckyNumber(null);
  setIsDropdownOpen(false);
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
  alert("Wallet not connected.");
  return;
}

const chainId = walletClient.chain.id;

if (chainId !== 8453) {
  try {
    await switchChainAsync({
      chainId: 8453,
    });
  } catch {
    return;
  }
}

const provider =
  new ethers.BrowserProvider(
    walletClient.transport as any
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

const prophecyQuote =
  quotes[
    getUniqueQuoteIndex(
      address,
      todaySeed
    )
  ];

const prophecyNumber =
  generateLuckyNumber(address);

const tweet = encodeURIComponent(
  `🔮 BASED ORACLE PROPHECY 🔮\n\n` +

  `“${prophecyQuote}”\n\n` +

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
      const dailyQuote =
        quotes[
          getUniqueQuoteIndex(
            address,
            tx.hash
          )
        ];

      setQuote(dailyQuote);

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
  quote: dailyQuote,
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
        dailyQuote
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

return (
  <main className="min-h-screen bg-black">
<button
  type="button"
  onClick={() => alert("CLICK")}
  onTouchStart={() => alert("TOUCH START")}
  onPointerDown={() => alert("POINTER DOWN")}
  className="fixed top-10 left-10 z-[999999999] bg-white text-black p-5"
>
  TEST
</button>
</main>
);
}