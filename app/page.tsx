"use client"; 

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ethers } from "ethers";
import { quotes } from "./quotes";
import "./globals.css";
import {
  useAccount,
  useConnect,
  useDisconnect,
} from "wagmi";

export default function Home() {
  const [quote, setQuote] = useState("");
  const [displayedQuote, setDisplayedQuote] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);

  const [glowIntensity, setGlowIntensity] = useState(
    "opacity-20 scale-100"
  );

  const openWalletModal = () => {
  if (address) {
    setIsDropdownOpen(!isDropdownOpen);
  } else {
    setIsModalOpen(true);
  }
};

  const { address, isConnected } =
  useAccount();

const { connectAsync, connectors } =
  useConnect();

const { disconnect } =
  useDisconnect();


    const [baseName, setBaseName] =
  useState<string | null>(null);

  const [txHash, setTxHash] =
    useState<string | null>(null);

  const [greeting, setGreeting] =
    useState("GM");

  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [activeProvider, setActiveProvider] =
    useState<any>(null);

  // DROPDOWN
  const [isDropdownOpen, setIsDropdownOpen] =
    useState(false);

  // COOLDOWN TIMER
  const [cooldown, setCooldown] =
    useState<number>(0);

  // DAILY LUCKY NUMBER
  const [luckyNumber, setLuckyNumber] =
    useState<number | null>(null);
    const [shareUrl, setShareUrl] =
  useState("");
  useEffect(() => {
  

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
        const injectedProvider =
          activeProvider ||
          (window as any).ethereum;

        if (!injectedProvider) return;

        const provider =
          new ethers.BrowserProvider(
            injectedProvider
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
  }, [address, activeProvider]);

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

  const connectWallet = async (
    walletType:
      | "metamask"
      | "rabby"
      | "coinbase"
  ) => {
    if (typeof window === "undefined")
      return;

   const eth = (window as any).ethereum;

if (!eth) {
  const currentUrl = window.location.href;

  if (walletType === "coinbase") {
    window.location.href =
      `https://go.cb-w.com/dapp?cb_url=${encodeURIComponent(currentUrl)}`;
    return;
  }

  if (walletType === "metamask") {
    window.location.href =
      `https://metamask.app.link/dapp/${currentUrl.replace(/^https?:\/\//, "")}`;
    return;
  }

  alert("Open this site inside Base App / Coinbase Wallet browser.");
  return;
}
    let provider: any = null;

    if (eth.providers?.length) {
      if (walletType === "rabby") {
        provider = eth.providers.find(
          (p: any) => p.isRabby
        );
      } else if (
        walletType === "coinbase"
      ) {
        provider = eth.providers.find(
          (p: any) =>
            p.isCoinbaseWallet
        );
      } else {
        provider = eth.providers.find(
          (p: any) =>
            p.isMetaMask &&
            !p.isRabby &&
            !p.isCoinbaseWallet
        );
      }
    } else {
      if (
        walletType === "rabby" &&
        eth.isRabby
      ) {
        provider = eth;
      } else if (
        walletType === "coinbase" &&
        eth.isCoinbaseWallet
      ) {
        provider = eth;
      } else if (
        walletType === "metamask" &&
        eth.isMetaMask &&
        !eth.isCoinbaseWallet
      ) {
        provider = eth;
      } else {
        provider = eth;
      }
    }

    if (provider) {
      try {
     await provider.request({
  method: "eth_requestAccounts",
});

setActiveProvider(provider);

const injectedConnector =
  connectors.find(
    (c) => c.type === "injected"
  );

if (injectedConnector) {
  await connectAsync({
    connector: injectedConnector,
  });
}

setIsModalOpen(false);

setIsModalOpen(false);
      } catch (err) {
        console.error(
          "Connection rejected"
        );
      }
    }
  };

 const disconnectWallet = () => {
  disconnect();

  setActiveProvider(null);
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
      setIsModalOpen(true);
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

      const injectedProvider =
        activeProvider ||
        (window as any).ethereum;

      if (!injectedProvider) {
        alert(
          "Wallet provider not found."
        );
        return;
      }

      // BASE MAINNET CHECK
      const chainId =
        await injectedProvider.request({
          method: "eth_chainId",
        });

      // BASE MAINNET
      if (chainId !== "0x2105") {
        try {
          await injectedProvider.request({
            method:
              "wallet_switchEthereumChain",
            params: [
              { chainId: "0x2105" },
            ],
          });
        } catch (switchError: any) {
          // ADD BASE NETWORK
          if (
            switchError.code === 4902
          ) {
            await injectedProvider.request(
              {
                method:
                  "wallet_addEthereumChain",
                params: [
                  {
                    chainId: "0x2105",
                    chainName: "Base",
                    nativeCurrency: {
                      name: "Ethereum",
                      symbol: "ETH",
                      decimals: 18,
                    },
                    rpcUrls: [
                      "https://mainnet.base.org",
                    ],
                    blockExplorerUrls:
                      [
                        "https://basescan.org",
                      ],
                  },
                ],
              }
            );
          } else {
            return;
          }
        }
      }

      const provider =
        new ethers.BrowserProvider(
          injectedProvider
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

  `Consult your fate:\n${window.location.origin}`
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
<main className="relative flex min-h-screen overflow-hidden flex-col items-center justify-start pt-24 p-4 bg-[#020204] overflow-y-auto overflow-x-hidden selection:bg-blue-600/40">
    
      {/* WALLET MODAL */}
     <div
  id="wallet-modal"
  className="fixed inset-0 z-[9999999] hidden items-center justify-center p-4 bg-black/90 backdrop-blur-xl target:flex"
>
  <div className="w-full max-w-sm bg-[#0a0a0c] border border-white/10 rounded-[32px] p-8 shadow-2xl relative transition-all duration-500 hover:-translate-y-4 hover:scale-[1.03] hover:border-blue-500/40 hover:shadow-[0_0_80px_rgba(37,99,235,0.35)]">
            
              <a
  href="#"
  className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors z-[99999999]"
>
  ✕
</a>

            <h2 className="text-[12px] font-black text-white uppercase tracking-[0.4em] mb-10 text-center italic">
              Connect Soul
            </h2>

            <div className="flex flex-col gap-3">
              {/* METAMASK */}
<a
  href="https://metamask.app.link/dapp/mini.basedoracle.space"
  className="flex items-center justify-between px-6 py-5 bg-white/[0.03] border border-white/5 rounded-2xl hover:bg-white/10 transition-all group active:scale-95"
>
  <span className="text-[11px] font-bold text-white/70 group-hover:text-white uppercase tracking-widest">
    MetaMask
  </span>

  <span className="text-xl">
    🦊
  </span>
</a>

{/* RABBY */}
<button
  onClick={() => connectWallet("rabby")}
  className="w-full flex items-center justify-between px-6 py-5 bg-white/[0.03] border border-white/5 rounded-2xl hover:bg-white/10 transition-all group active:scale-95"
>
  <span className="text-[11px] font-bold text-white/70 group-hover:text-white uppercase tracking-widest">
    Rabby Wallet
  </span>

  <div className="relative w-6 h-6">
    <Image
      src="/rabby_logo.png"
      alt="Rabby"
      fill
      className="object-contain"
    />
  </div>
</button>

{/* COINBASE */}
<a
  href="https://go.cb-w.com/dapp?cb_url=https%3A%2F%2Fmini.basedoracle.space"
  className="flex items-center justify-between px-6 py-5 bg-white/[0.03] border border-white/5 rounded-2xl hover:bg-white/10 transition-all group active:scale-95"
>
  <span className="text-[11px] font-bold text-white/70 group-hover:text-white uppercase tracking-widest">
    Base App / Coinbase Wallet
  </span>

  <div className="relative w-6 h-6">
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <circle
        cx="12"
        cy="12"
        r="12"
        fill="#0052FF"
      />

      <circle
        cx="12"
        cy="12"
        r="5"
        fill="white"
      />
    </svg>
  </div>
</a>
            </div>
          </div>
        </div>
    

      {/* NAV */}
     <nav className="fixed top-0 left-0 w-full p-8 flex justify-between items-start z-[999999] pointer-events-auto">
        <div className="flex flex-col group text-left">
          <div className="text-[11px] text-blue-500 tracking-[0.5em] font-black uppercase italic transition-all group-hover:tracking-[0.6em]">
            {txHash
              ? "✦ Oracle Synchronized ✦"
              : `◈ ${greeting}`}
          </div>

          <div className="flex items-center gap-2 mt-1.5 text-[9px] text-white/40 font-mono uppercase tracking-[0.3em]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>

              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500"></span>
            </span>

            {address
              ? "Timeline Encrypted"
              : "Scanning Souls..."}
          </div>
        </div>

        <div className="relative z-[999999] pointer-events-auto">
<a href="#wallet-modal"
  type="button"
onClick={() => {

  if (address) {
    setIsDropdownOpen(true);
  } else {
    setIsModalOpen(true);
  }

}}
  className="group flex items-center gap-3 px-7 py-3 bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-full active:scale-95 cursor-pointer"
>

            <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)] animate-pulse"></div>

            <span className="text-[11px] font-black text-white uppercase tracking-[0.25em]">
{address
  ? baseName ||
    `${address.substring(
      0,
      6
    )}...${address.slice(
      -4
    )}`
  : "Connect Wallet"}
            </span>
          </a>

          {/* NEW DROPDOWN DESIGN */}
          {address && isDropdownOpen && (
            <div className="absolute right-0 mt-4 w-[280px] rounded-3xl p-[1px] bg-gradient-to-r from-blue-500/40 via-white/10 to-blue-500/20 shadow-2xl animate-in fade-in zoom-in duration-200 origin-top-right">
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

                {/* ACTIONS */}
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
        </div>
      </nav>

    Connect Wallet

      {/* BG */}
      <div className="absolute inset-0 z-0 opacity-[0.06] select-none">
        <Image
          src="/always_has_been.png"
          alt="BG"
          fill
          className="object-cover contrast-125"
          priority
        />
      </div>

      {/* GLOW */}
      <div
        className={`absolute right-[8%] top-[15%] w-[600px] h-[550px] z-[5] transition-all duration-1000 ${glowIntensity} pointer-events-none select-none`}
      >
        <Image
          src="/crypto_scribble.png"
          alt="Oracle"
          fill
          className="object-contain grayscale brightness-125 contrast-110"
        />
      </div>

      {/* MAIN */}
      <div
        className={`relative z-[50] w-full max-w-6xl flex flex-col items-center xl:scale-90 origin-top transition-all lg:pr-32 ${
          isAnimating
            ? "scale-95 blur-sm"
            : ""
        }`}
      >
        <h1 className="text-[54px] sm:text-7xl md:text-[115px] font-black text-white leading-none tracking-tighter uppercase italic mb-16 drop-shadow-2xl select-none">
          BASED
          <span className="text-blue-600">
            .
          </span>
          ORACLE
        </h1>

        <div
  className={`relative w-full max-w-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[50px] p-7 md:p-10 shadow-2xl md:-translate-x-12 transition-all duration-700 animate-[float_6s_ease-in-out_infinite] hover:-translate-y-4 hover:scale-[1.02] hover:border-blue-500/40 hover:shadow-[0_0_80px_rgba(37,99,235,0.35)] ${
    isAnimating
      ? "scale-95 border-blue-500/40 shadow-[0_0_50px_rgba(37,99,235,0.18)]"
      : ""
  }`}
>
  <div className="absolute inset-0 rounded-[50px] bg-blue-500/10 blur-3xl animate-pulse pointer-events-none" />


          <div className="absolute top-10 left-12 w-10 h-[2px] bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,1)]"></div>

          <div className="min-h-[220px] flex flex-col items-center justify-center text-center">
            {/* DAILY TITLE */}
            {quote && (
              <span className="mb-6 text-[11px] uppercase tracking-[0.45em] text-blue-400 font-black italic">
                Your Quote Of The Day
              </span>
            )}

            {/* QUOTE */}
          <p
  key={quote || isAnimating ? "active" : "empty"}
  className={`text-2xl sm:text-3xl md:text-5xl text-white italic text-center leading-[1.1] font-medium transition-all duration-700 ${
    quote
      ? "opacity-100 translate-y-0"
      : "opacity-80 translate-y-2"
  }`}
>
              {quote
  ? `"${quote}"`
  : isAnimating
  ? "Decrypting your onchain prophecy..."
  : cooldown > 0
  ? "The Oracle sleeps..."
  : "Authorize the transaction to decrypt your fate."}
            </p>

            {/* LUCKY NUMBER */}
            {/* DAILY STREAK */}
{quote && streak > 0 && (
  <div className="mt-8 flex flex-col items-center">
    <span className="text-[10px] uppercase tracking-[0.4em] text-white/30 mb-3 italic">
      Oracle Streak
    </span>

    <div className="px-7 py-3 rounded-full border border-blue-500/30 bg-blue-500/10 backdrop-blur-xl shadow-[0_0_30px_rgba(37,99,235,0.2)]">
      <span className="text-[13px] font-black text-blue-400 tracking-[0.25em] uppercase">
        ✦ {streak} Day — {getStreakBadge(streak)}
      </span>
    </div>

</div>
)}
            {/* SHARE PROPHECY */}
{quote && (shareUrl || oracleHistory[0]?.txHash) && (
  <a
    href={
  shareUrl ||
  `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    `🔮 BASED ORACLE PROPHECY 🔮\n\n“${quote}”\n\n✦ Lucky Number: ${luckyNumber}\n\n✦ Oracle TX:\nhttps://basescan.org/tx/${oracleHistory[0]?.txHash}\n\nConsult your fate:\n${window.location.origin}`
  )}`
}
    target="_blank"
    rel="noopener noreferrer"
    className="
      mt-8 inline-flex items-center gap-3
      px-6 py-3
      rounded-full
      bg-white/[0.04]
      border border-white/10
      hover:border-blue-500/40
      hover:bg-blue-500/10
      transition-all duration-300
      group
    "
  >
    <span className="text-[10px] uppercase tracking-[0.3em] text-white/50 group-hover:text-blue-400 font-black">
      Share Prophecy
    </span>

    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#3b82f6"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 4l16 16"></path>
      <path d="M20 4L9 15"></path>
    </svg>
  </a>
)}
            {quote &&
              luckyNumber && (
                <div className="mt-6 flex flex-col items-center relative z-[60]">
                  <span className="text-[10px] uppercase tracking-[0.4em] text-white/30 mb-3 italic">
                    Your Lucky Number Today
                  </span>

                  <div className="px-8 py-3 rounded-full border border-blue-500/30 bg-blue-500/10 backdrop-blur-xl shadow-[0_0_30px_rgba(37,99,235,0.2)]">
                    <span className="text-3xl md:text-4xl font-black text-blue-400 tracking-[0.15em]">
                      {luckyNumber}
                    </span>
                  </div>
                </div>
              )}
          </div>

          {/* COOL TIMER */}
          {cooldown > 0 && (
            <div className="flex flex-col items-center justify-center mb-10 animate-pulse">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-lg"></div>

                <div className="relative px-10 py-5 rounded-full border border-blue-500/40 bg-blue-500/10 backdrop-blur-2xl shadow-[0_0_40px_rgba(37,99,235,0.35)]">
                  <span className="text-blue-400 font-black tracking-[0.35em] uppercase text-[13px] md:text-[16px]">
                    {formatCooldown(
                      cooldown
                    )}
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
              disabled={
                isAnimating ||
                cooldown > 0
              }
              className={`group overflow-hidden relative z-[70] px-14 py-6 font-black rounded-full transition-all text-[10px] uppercase tracking-[0.3em] shadow-xl

              ${
                cooldown > 0
                  ? "bg-blue-950/40 text-blue-300 border border-blue-500/20 cursor-not-allowed"
                  : "bg-white text-black hover:bg-blue-600 hover:text-white hover:scale-105 active:scale-95 hover:shadow-[0_0_35px_rgba(37,99,235,0.55)]"
              }
        
              ${
                isAnimating
                  ? "opacity-50"
                  : ""
              }`}

          
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
           <div className="mt-10 flex justify-center animate-float">
  <div className="flex items-center gap-1 bg-white/[0.05] px-5 py-3.5 rounded-full border border-white/10 backdrop-blur-xl shadow-xl">
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
        </div>
      </div>

      {/* FOOTER */}
<footer className="absolute left-1/2 -translate-x-1/2 top-[760px] z-50">

</footer>
    </main>
  );
}