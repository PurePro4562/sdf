import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGoogleLogin } from '@react-oauth/google';
import { 
  Coins, Sparkles, ChevronLeft, Plus, Minus, Zap, Play, Spade, Club, Heart, Diamond, 
  CircleDot, Crown, Trophy, Users, Info, ShieldCheck, Mail, BookOpen, Tv, 
  RotateCcw, HandMetal, Layers, ArrowUpCircle, TrendingUp, Flame, Skull,
  Scale, ShieldAlert, FileText, Globe, MapPin, ExternalLink, Shield, Lock, 
  UserCheck, HelpCircle, ChevronRight, Menu, X, LogIn, LogOut, User
} from 'lucide-react';

// --- CONFIGURATION ---
const INITIAL_TOKENS = 2500;
const SITE_CONFIG = {
  name: "LUXE PREMIER",
  tagline: "The World's Most Refined Social Gaming Simulation",
  description: "Experience the pinnacle of virtual gaming with Luxe Premier. Our platform offers high-performance RNG simulations designed for entertainment and strategic mastery in a zero-risk environment.",
  disclaimer: "Luxe Premier is a strictly social simulation platform. Virtual tokens have no real-world value and cannot be exchanged for currency or prizes. Participation is intended for those 18+.",
};

const GAMES = [
  { 
    id: 'blackjack', 
    type: 'blackjack', 
    name: 'Royal Blackjack', 
    colors: 'from-emerald-950 via-slate-900 to-black', 
    minBet: 10, 
    icon: <Spade className="text-emerald-400" size={32} />,
    guide: "Objective: Get closer to 21 than the dealer. Aces are 1 or 11. Dealer stands on 17."
  },
  { 
    id: 'neon-slots', 
    type: 'slots', 
    name: 'Midnight Neon', 
    colors: 'from-purple-950 via-indigo-950 to-black', 
    symbols: ['💎', '⚡️', '🌙', '💜', '7️⃣', '🍀', '🍒'], 
    minBet: 5, 
    icon: <Zap className="text-purple-400" size={32} />,
    guide: "Match 3 symbols in the center. Triple 7s pay 50x."
  },
  { 
    id: 'inferno-slots', 
    type: 'slots', 
    name: 'Inferno Reels', 
    colors: 'from-orange-950 via-red-950 to-black', 
    symbols: ['🔥', '💀', '🔔', '7️⃣', '💰', '🎲'], 
    minBet: 50, 
    icon: <Flame className="text-orange-400" size={32} />,
    guide: "High volatility machine. Skulls pay low, Fire pays 100x."
  },
  { 
    id: 'mega-slots', 
    type: 'mega-slots', 
    name: 'MEGA WIN ULTRA', 
    colors: 'from-cyan-950 via-blue-950 via-purple-950 to-pink-950', 
    symbols: ['💎', '⭐', '👑', '🎰', '💰', '🚀', '🎆', '💫'], 
    minBet: 25, 
    icon: <Sparkles className="text-cyan-400" size={32} />,
    guide: "ULTRA MEGA SLOTS! Triple matches pay up to 200x! Jackpot symbols trigger MEGA WIN celebrations!"
  },
  { 
    id: 'roulette', 
    type: 'roulette', 
    name: 'Prestige Roulette', 
    colors: 'from-red-950 via-slate-900 to-black', 
    minBet: 10, 
    icon: <CircleDot className="text-red-500" size={32} />,
    guide: "Bet on Red/Black for 2x, or specific numbers for 36x return."
  }
];

// --- UTILS ---
const createDeck = () => {
  const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
  const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const deck = [];
  suits.forEach(suit => values.forEach(value => {
    let weight = parseInt(value) || (value === 'A' ? 11 : 10);
    deck.push({ suit, value, weight, id: Math.random() });
  }));
  return deck.sort(() => Math.random() - 0.5);
};

const calcHand = (hand) => {
  let score = hand.reduce((sum, c) => sum + c.weight, 0);
  let aces = hand.filter(c => c.value === 'A').length;
  while (score > 21 && aces > 0) { score -= 10; aces--; }
  return score;
};

// --- REUSABLE COMPONENTS ---

const Card = ({ card, hidden, index }) => (
  <motion.div
    initial={{ y: -50, opacity: 0, rotate: -15 }}
    animate={{ y: 0, opacity: 1, rotate: 0 }}
    className={`relative w-24 h-36 md:w-28 md:h-40 rounded-2xl border-2 shadow-2xl flex flex-col justify-between p-3 ${
      hidden ? 'bg-gradient-to-br from-zinc-800 to-black border-zinc-700' : 'bg-white border-zinc-200'
    }`}
  >
    {hidden ? (
      <div className="h-full w-full flex items-center justify-center opacity-30">
        <Crown size={48} className="text-zinc-500" />
      </div>
    ) : (
      <>
        <div className={`text-xl font-bold ${['hearts', 'diamonds'].includes(card.suit) ? 'text-red-600' : 'text-zinc-900'}`}>{card.value}</div>
        <div className="flex justify-center">
          {card.suit === 'hearts' && <Heart className="text-red-600" fill="currentColor" size={32} />}
          {card.suit === 'diamonds' && <Diamond className="text-red-600" fill="currentColor" size={32} />}
          {card.suit === 'spades' && <Spade className="text-zinc-900" fill="currentColor" size={32} />}
          {card.suit === 'clubs' && <Club className="text-zinc-900" fill="currentColor" size={32} />}
        </div>
        <div className={`text-xl font-bold rotate-180 ${['hearts', 'diamonds'].includes(card.suit) ? 'text-red-600' : 'text-zinc-900'}`}>{card.value}</div>
      </>
    )}
  </motion.div>
);

const BetSelector = ({ currentBet, setBet, minBet, maxTokens, disabled }) => {
  const chips = [10, 50, 100, 500, 1000];
  const addBet = (val) => {
    if (currentBet + val <= maxTokens) setBet(currentBet + val);
    else setBet(maxTokens);
  };
  return (
    <div className={`flex flex-col gap-6 items-center w-full max-w-lg ${disabled ? 'opacity-40 pointer-events-none' : ''}`}>
      <div className="flex items-center gap-4 w-full">
        <button onClick={() => setBet(minBet)} className="bg-white/5 hover:bg-white/10 px-6 py-4 rounded-2xl border border-white/10 text-[10px] font-black text-white/40 uppercase tracking-[0.2em] transition-all">Clear</button>
        <div className="flex-1 bg-gradient-to-b from-zinc-900 to-black border-2 border-zinc-800 rounded-3xl p-5 flex flex-col items-center shadow-2xl">
           <span className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.4em] mb-1">Current Stakes</span>
           <div className="flex items-center gap-3">
             <Coins size={20} className="text-yellow-500" />
             <span className="text-4xl font-mono font-black tracking-tighter text-white">{currentBet.toLocaleString()}</span>
           </div>
        </div>
        <button onClick={() => setBet(maxTokens)} className="bg-white/5 hover:bg-white/10 px-6 py-4 rounded-2xl border border-white/10 text-[10px] font-black text-white/40 uppercase tracking-[0.2em] transition-all">Max</button>
      </div>
      <div className="flex flex-wrap justify-center gap-4">
        {chips.map(chip => (
          <button key={chip} onClick={() => addBet(chip)} className="group relative flex flex-col items-center">
            <div className={`w-14 h-14 rounded-full border-4 flex items-center justify-center transition-all group-hover:scale-110 group-active:scale-95 shadow-xl
              ${chip === 10 ? 'border-blue-500/50 bg-blue-500/20' : 
                chip === 50 ? 'border-red-500/50 bg-red-500/20' : 
                chip === 100 ? 'border-emerald-500/50 bg-emerald-500/20' : 
                chip === 500 ? 'border-purple-500/50 bg-purple-500/20' : 
                'border-yellow-500/50 bg-yellow-500/20'}
            `}>
              <span className="text-xs font-black text-white">{chip}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

// --- GAME LOGIC (UNCHANGED) ---

const RouletteTable = ({ initialMinBet, tokens, setTokens }) => {
  const [bet, setBet] = useState(initialMinBet);
  const [betType, setBetType] = useState('red'); 
  const [spinning, setSpinning] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [message, setMessage] = useState('');
  const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
  const spin = () => {
    if (spinning || tokens < bet) return;
    setSpinning(true); setMessage(''); setTokens(t => t - bet);
    setTimeout(() => {
      const result = Math.floor(Math.random() * 37);
      setLastResult(result); setSpinning(false);
      let won = false; let multiplier = 0;
      if (typeof betType === 'number') { if (result === betType) { won = true; multiplier = 36; } }
      else {
        if (betType === 'red' && redNumbers.includes(result)) { won = true; multiplier = 2; }
        if (betType === 'black' && !redNumbers.includes(result) && result !== 0) { won = true; multiplier = 2; }
        if (betType === 'even' && result % 2 === 0 && result !== 0) { won = true; multiplier = 2; }
        if (betType === 'odd' && result % 2 !== 0) { won = true; multiplier = 2; }
      }
      if (won) { setTokens(t => t + bet * multiplier); setMessage(`VICTORY +${(bet * multiplier).toLocaleString()}`); }
      else { setMessage('HOUSE WINS'); }
    }, 2500);
  };
  return (
    <div className="flex flex-col items-center gap-12 w-full">
      <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-full border-[12px] border-zinc-800 bg-black flex items-center justify-center overflow-hidden shadow-[0_0_80px_rgba(255,0,0,0.15)]">
        <motion.div animate={spinning ? { rotate: [0, 3600] } : { rotate: 0 }} transition={{ duration: 2.5, ease: "circOut" }} className="absolute inset-2 border-[1px] border-zinc-700/50 rounded-full flex items-center justify-center">
            <div className="w-full h-full flex items-start justify-center pt-2"><div className="w-4 h-4 rounded-full bg-zinc-300 shadow-white shadow-sm" /></div>
        </motion.div>
        <div className="text-center z-10"><AnimatePresence mode="wait"><motion.div key={lastResult} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center">
          <span className={`text-8xl font-black mb-2 tracking-tighter ${lastResult !== null ? (lastResult === 0 ? 'text-emerald-500' : redNumbers.includes(lastResult) ? 'text-red-500' : 'text-white') : 'text-zinc-800'}`}>
            {spinning ? '...' : (lastResult ?? '--')}
          </span>
          <span className="text-[10px] font-black uppercase tracking-[0.8em] text-zinc-500">{spinning ? 'ORBITING' : 'POSITION'}</span>
        </motion.div></AnimatePresence></div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-lg">
        {['red', 'black', 'even', 'odd'].map(type => (
          <button key={type} onClick={() => setBetType(type)} className={`py-4 rounded-2xl font-black uppercase text-xs tracking-widest border transition-all ${betType === type ? 'bg-white text-black border-white scale-105' : 'bg-black/40 border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}>
            {type}
          </button>
        ))}
      </div>
      <BetSelector currentBet={bet} setBet={setBet} minBet={initialMinBet} maxTokens={tokens} disabled={spinning} />
      <button onClick={spin} disabled={spinning} className="group w-full max-w-md bg-white text-black py-8 rounded-[2rem] font-black text-2xl uppercase tracking-[0.2em] shadow-2xl disabled:opacity-50 transition-all hover:bg-zinc-200">
        {spinning ? 'In Orbit...' : 'Commit Wager'}
      </button>
      {message && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-2xl font-black italic tracking-tight text-white">{message}</motion.div>}
    </div>
  );
};

const SlotMachine = ({ symbols, tokens, setTokens, minBet: initialMinBet }) => {
  const [reels, setReels] = useState([symbols[0], symbols[1], symbols[2]]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winMsg, setWinMsg] = useState('');
  const [bet, setBet] = useState(initialMinBet);
  const spin = () => {
    if (isSpinning || tokens < bet) return;
    setIsSpinning(true); setWinMsg(''); setTokens(t => t - bet);
    const results = [symbols[Math.floor(Math.random() * symbols.length)], symbols[Math.floor(Math.random() * symbols.length)], symbols[Math.floor(Math.random() * symbols.length)]];
    [1200, 1800, 2400].forEach((d, i) => {
      setTimeout(() => {
        setReels(prev => { const n = [...prev]; n[i] = results[i]; return n; });
        if (i === 2) finalize(results);
      }, d);
    });
  };
  const finalize = (res) => {
    setIsSpinning(false);
    if (res[0] === res[1] && res[1] === res[2]) {
      const mult = (res[0] === '7️⃣' || res[0] === '🔥' || res[0] === '💎') ? 50 : 25;
      setTokens(t => t + bet * mult); setWinMsg(`PREMIER JACKPOT! +${(bet * mult).toLocaleString()}`);
    } else if (res[0] === res[1] || res[1] === res[2] || res[0] === res[2]) {
      setTokens(t => t + bet * 2); setWinMsg('MATCH WIN! +2x');
    }
  };
  return (
    <div className="flex flex-col items-center gap-10 p-12 bg-gradient-to-b from-zinc-900 to-black rounded-[4rem] border border-white/5 relative shadow-[0_0_100px_rgba(0,0,0,0.8)]">
      <div className="flex gap-4 md:gap-8 bg-black/40 p-4 rounded-[2.5rem] border border-white/5">
        {reels.map((symbol, i) => (
          <div key={i} className="relative w-28 h-48 md:w-36 md:h-56 bg-gradient-to-b from-zinc-900 to-black rounded-[2rem] overflow-hidden border border-white/10 flex items-center justify-center">
            <motion.div key={isSpinning ? `spin-${i}` : symbol} initial={isSpinning ? { y: -400 } : { y: -50 }} animate={{ y: 0 }} transition={{ repeat: isSpinning ? Infinity : 0, duration: isSpinning ? 0.08 : 0.6, ease: isSpinning ? "linear" : "backOut" }} className={`text-6xl md:text-8xl ${isSpinning ? 'blur-xl opacity-20' : 'drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]'}`}>
              {isSpinning ? symbols[Math.floor(Math.random() * symbols.length)] : symbol}
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none" />
          </div>
        ))}
      </div>
      <BetSelector currentBet={bet} setBet={setBet} minBet={initialMinBet} maxTokens={tokens} disabled={isSpinning} />
      <button onClick={spin} disabled={isSpinning} className="group relative w-full h-28 rounded-[2.5rem] overflow-hidden shadow-2xl active:scale-95 transition-all">
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-100 to-white group-hover:from-white group-hover:to-zinc-100 transition-all" />
        <span className="relative z-10 text-black font-black text-4xl italic uppercase tracking-[0.3em]">Ignite</span>
      </button>
      <AnimatePresence>{winMsg && (<motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }} className="absolute -top-12 bg-emerald-500 text-black px-12 py-5 rounded-full font-black text-2xl shadow-[0_0_30px_rgba(16,185,129,0.5)]">{winMsg}</motion.div>)}</AnimatePresence>
    </div>
  );
};

// Sound effects using Web Audio API
const createSound = (frequency, duration, type = 'sine', volume = 0.3) => {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.value = frequency;
  oscillator.type = type;
  gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration);
};

const playSpinSound = () => {
  createSound(200, 0.1, 'sawtooth', 0.2);
  setTimeout(() => createSound(300, 0.1, 'sawtooth', 0.2), 50);
  setTimeout(() => createSound(400, 0.1, 'sawtooth', 0.2), 100);
};

const playWinSound = (multiplier) => {
  if (multiplier >= 100) {
    // Mega win sound
    [440, 554, 659, 784].forEach((freq, i) => {
      setTimeout(() => createSound(freq, 0.3, 'sine', 0.4), i * 100);
    });
  } else if (multiplier >= 50) {
    // Big win sound
    [523, 659, 784].forEach((freq, i) => {
      setTimeout(() => createSound(freq, 0.2, 'sine', 0.3), i * 80);
    });
  } else {
    // Regular win sound
    createSound(523, 0.15, 'sine', 0.25);
    setTimeout(() => createSound(659, 0.15, 'sine', 0.25), 100);
  }
};

const playReelStopSound = () => {
  createSound(150, 0.05, 'square', 0.15);
};

// Confetti particle component
const ConfettiParticle = ({ x, y, color, delay }) => (
  <motion.div
    initial={{ x, y: y - 100, opacity: 1, scale: 1 }}
    animate={{ 
      y: y + 500,
      x: x + (Math.random() - 0.5) * 200,
      opacity: [1, 1, 0],
      scale: [1, 1.2, 0.5],
      rotate: [0, 360]
    }}
    transition={{ 
      duration: 2,
      delay,
      ease: "easeOut"
    }}
    className="absolute w-3 h-3 rounded-full"
    style={{ 
      background: color,
      boxShadow: `0 0 10px ${color}`
    }}
  />
);

// Ultra-entertaining slot machine with crazy effects
const MegaSlotMachine = ({ symbols, tokens, setTokens, minBet: initialMinBet }) => {
  const [reels, setReels] = useState([symbols[0], symbols[1], symbols[2]]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winMsg, setWinMsg] = useState('');
  const [bet, setBet] = useState(initialMinBet);
  const [multiplier, setMultiplier] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [screenShake, setScreenShake] = useState(false);
  const [glowEffect, setGlowEffect] = useState(false);
  const containerRef = useRef(null);
  const [particles, setParticles] = useState([]);

  const generateConfetti = () => {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ff8800', '#ff0088'];
    const newParticles = [];
    for (let i = 0; i < 100; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * (containerRef.current?.offsetWidth || 800),
        y: Math.random() * (containerRef.current?.offsetHeight || 600),
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.5
      });
    }
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 3000);
  };

  const spin = () => {
    if (isSpinning || tokens < bet) return;
    setIsSpinning(true); 
    setWinMsg(''); 
    setMultiplier(0);
    setShowConfetti(false);
    setGlowEffect(false);
    setTokens(t => t - bet);
    playSpinSound();
    
    const results = [
      symbols[Math.floor(Math.random() * symbols.length)], 
      symbols[Math.floor(Math.random() * symbols.length)], 
      symbols[Math.floor(Math.random() * symbols.length)]
    ];
    
    [800, 1600, 2800].forEach((d, i) => {
      setTimeout(() => {
        setReels(prev => { 
          const n = [...prev]; 
          n[i] = results[i]; 
          return n; 
        });
        playReelStopSound();
        if (i === 2) {
          setTimeout(() => finalize(results), 300);
        }
      }, d);
    });
  };

  const finalize = (res) => {
    setIsSpinning(false);
    let mult = 0;
    let message = '';
    let isMegaWin = false;

    if (res[0] === res[1] && res[1] === res[2]) {
      // Triple match
      if (res[0] === '💎' || res[0] === '👑' || res[0] === '⭐') {
        mult = 200;
        message = `💎💎💎 MEGA ULTRA JACKPOT!!! 💎💎💎 +${(bet * mult).toLocaleString()}`;
        isMegaWin = true;
      } else if (res[0] === '🎰' || res[0] === '💰') {
        mult = 100;
        message = `🎰🎰🎰 ULTRA JACKPOT!!! 🎰🎰🎰 +${(bet * mult).toLocaleString()}`;
        isMegaWin = true;
      } else if (res[0] === '🚀' || res[0] === '🎆') {
        mult = 75;
        message = `🚀🚀🚀 MEGA WIN!!! 🚀🚀🚀 +${(bet * mult).toLocaleString()}`;
        isMegaWin = true;
      } else {
        mult = 50;
        message = `🎉 TRIPLE MATCH! 🎉 +${(bet * mult).toLocaleString()}`;
      }
      setTokens(t => t + bet * mult);
    } else if (res[0] === res[1] || res[1] === res[2] || res[0] === res[2]) {
      // Double match
      mult = 3;
      message = `✨ DOUBLE WIN! ✨ +${(bet * mult).toLocaleString()}`;
      setTokens(t => t + bet * mult);
    }

    if (mult > 0) {
      setMultiplier(mult);
      setWinMsg(message);
      playWinSound(mult);
      
      if (isMegaWin) {
        setShowConfetti(true);
        setScreenShake(true);
        setGlowEffect(true);
        generateConfetti();
        setTimeout(() => {
          setScreenShake(false);
          setGlowEffect(false);
        }, 2000);
        setTimeout(() => setShowConfetti(false), 3000);
      }
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`flex flex-col items-center gap-10 p-12 bg-gradient-to-br from-cyan-900/30 via-blue-900/30 via-purple-900/30 to-pink-900/30 rounded-[4rem] border-2 border-white/10 relative shadow-[0_0_200px_rgba(0,0,0,0.8)] overflow-hidden ${
        screenShake ? 'animate-pulse' : ''
      }`}
      style={{
        boxShadow: glowEffect ? '0 0 200px rgba(255,215,0,0.8), 0 0 400px rgba(255,20,147,0.6)' : undefined,
        transition: 'box-shadow 0.3s ease'
      }}
    >
      {/* Animated background effects */}
      {glowEffect && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0, 1, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 via-pink-500/20 to-cyan-500/20 pointer-events-none"
        />
      )}

      {/* Confetti particles */}
      <AnimatePresence>
        {particles.map(particle => (
          <ConfettiParticle key={particle.id} {...particle} />
        ))}
      </AnimatePresence>

      {/* Reels with enhanced effects */}
      <div className="relative flex gap-4 md:gap-8 bg-black/60 p-6 rounded-[2.5rem] border-2 border-white/20 backdrop-blur-xl">
        {reels.map((symbol, i) => (
          <motion.div
            key={`${symbol}-${i}-${isSpinning}`}
            className="relative w-32 h-52 md:w-40 md:h-64 bg-gradient-to-b from-zinc-800 via-zinc-900 to-black rounded-[2rem] overflow-hidden border-2 border-white/20 flex items-center justify-center"
            animate={isSpinning ? {
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
              boxShadow: [
                '0 0 20px rgba(255,255,255,0.3)',
                '0 0 40px rgba(0,255,255,0.6)',
                '0 0 20px rgba(255,255,255,0.3)'
              ]
            } : {
              scale: 1,
              rotate: 0
            }}
            transition={{ duration: 0.1, repeat: isSpinning ? Infinity : 0 }}
          >
            <motion.div
              key={isSpinning ? `spin-${i}-${Date.now()}` : `stop-${i}`}
              initial={isSpinning ? { y: -600, rotate: 0 } : { y: 0, scale: 1 }}
              animate={isSpinning ? {
                y: [0, 600],
                rotate: [0, 360]
              } : {
                y: 0,
                scale: [1, 1.3, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={isSpinning ? {
                duration: 0.08,
                repeat: Infinity,
                ease: "linear"
              } : {
                duration: 0.5,
                ease: "backOut"
              }}
              className={`text-7xl md:text-9xl ${
                isSpinning 
                  ? 'blur-md opacity-30' 
                  : 'drop-shadow-[0_0_30px_rgba(255,255,255,0.5)] filter brightness-110'
              }`}
              style={{
                textShadow: isSpinning ? 'none' : '0 0 20px currentColor, 0 0 40px currentColor'
              }}
            >
              {isSpinning ? symbols[Math.floor(Math.random() * symbols.length)] : symbol}
            </motion.div>
            
            {/* Glowing overlay */}
            {!isSpinning && (reels[0] === reels[1] && reels[1] === reels[2]) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="absolute inset-0 bg-gradient-to-br from-yellow-400/30 via-pink-400/30 to-cyan-400/30 pointer-events-none"
              />
            )}
            
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50 pointer-events-none" />
          </motion.div>
        ))}
      </div>

      {/* Multiplier display */}
      {multiplier > 0 && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: [0, 1.5, 1], rotate: 0 }}
          exit={{ scale: 0, rotate: 180 }}
          className="absolute top-20 text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-400 to-cyan-400"
          style={{
            textShadow: '0 0 30px rgba(255,215,0,0.8), 0 0 60px rgba(255,20,147,0.6)',
            WebkitTextStroke: '2px rgba(255,255,255,0.5)'
          }}
        >
          {multiplier}x
        </motion.div>
      )}

      <BetSelector currentBet={bet} setBet={setBet} minBet={initialMinBet} maxTokens={tokens} disabled={isSpinning} />
      
      <button 
        onClick={spin} 
        disabled={isSpinning} 
        className="group relative w-full h-32 rounded-[2.5rem] overflow-hidden shadow-2xl active:scale-95 transition-all"
      >
        <motion.div
          animate={isSpinning ? {
            background: [
              'linear-gradient(90deg, #ff0000, #00ff00, #0000ff)',
              'linear-gradient(90deg, #00ff00, #0000ff, #ff0000)',
              'linear-gradient(90deg, #0000ff, #ff0000, #00ff00)'
            ]
          } : {}}
          transition={{ duration: 0.3, repeat: isSpinning ? Infinity : 0 }}
          className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 group-hover:from-cyan-300 group-hover:via-purple-300 group-hover:to-pink-300"
        />
        <span className="relative z-10 text-black font-black text-5xl italic uppercase tracking-[0.3em] flex items-center justify-center gap-4">
          {isSpinning ? (
            <>
              <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}>
                ⚡
              </motion.span>
              SPINNING...
              <motion.span animate={{ rotate: -360 }} transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}>
                ⚡
              </motion.span>
            </>
          ) : (
            '🎰 MEGA SPIN 🎰'
          )}
        </span>
      </button>

      {/* Win message with crazy effects */}
      <AnimatePresence>
        {winMsg && (
          <motion.div
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            animate={{ 
              scale: [0, 1.2, 1],
              rotate: [0, 10, -10, 0],
              opacity: 1,
              y: [100, 0]
            }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute -top-8 bg-gradient-to-r from-yellow-400 via-pink-400 to-cyan-400 text-black px-16 py-6 rounded-full font-black text-3xl md:text-4xl shadow-[0_0_50px_rgba(255,215,0,0.8)] border-4 border-white/50"
            style={{
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              animation: 'pulse 1s infinite'
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              {winMsg}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const BlackjackTable = ({ initialMinBet, tokens, setTokens }) => {
  const [deck, setDeck] = useState(createDeck());
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const [bet, setBet] = useState(initialMinBet);
  const startRound = () => { if (tokens < bet) return; setTokens(t => t - bet); const d = createDeck(); setPlayerHand([d[0], d[2]]); setDealerHand([d[1], d[3]]); setDeck(d.slice(4)); setStatus('playing'); setMessage(''); };
  const hit = () => { const card = deck[0]; const newHand = [...playerHand, card]; setPlayerHand(newHand); setDeck(deck.slice(1)); if (calcHand(newHand) > 21) { setStatus('result'); setMessage('BUST'); } };
  const stand = () => setStatus('dealer_turn');
  useEffect(() => {
    if (status === 'dealer_turn') {
      let dHand = [...dealerHand]; let dDeck = [...deck];
      while (calcHand(dHand) < 17) { dHand.push(dDeck[0]); dDeck = dDeck.slice(1); }
      setDealerHand(dHand); setDeck(dDeck); const pS = calcHand(playerHand); const dS = calcHand(dHand); setStatus('result');
      if (dS > 21 || pS > dS) { setMessage('PLAYER WINS'); setTokens(t => t + bet * 2); }
      else if (pS === dS) { setMessage('PUSH'); setTokens(t => t + bet); }
      else { setMessage('DEALER WINS'); }
    }
  }, [status]);
  return (
    <div className="w-full max-w-4xl flex flex-col items-center gap-14">
      <div className="flex flex-col items-center gap-6">
        <span className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.6em] bg-white/5 px-4 py-1 rounded-full border border-white/5">The House ({status === 'playing' ? '?' : calcHand(dealerHand)})</span>
        <div className="flex gap-4 min-h-[160px]">{dealerHand.map((c, i) => <Card key={c.id} card={c} hidden={status === 'playing' && i === 1} index={i} />)}</div>
      </div>
      <div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
      <div className="flex flex-col items-center gap-6">
        <div className="flex gap-4 min-h-[160px]">{playerHand.map((c, i) => <Card key={c.id} card={c} index={i} />)}</div>
        <span className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.6em] bg-white/5 px-4 py-1 rounded-full border border-white/5">Guest ({calcHand(playerHand)})</span>
      </div>
      <BetSelector currentBet={bet} setBet={setBet} minBet={initialMinBet} maxTokens={tokens} disabled={status === 'playing'} />
      <div className="flex gap-6">
        {status === 'idle' || status === 'result' ? (
          <button onClick={startRound} className="bg-white text-black px-24 py-6 rounded-3xl font-black text-2xl hover:bg-zinc-200 transition-all shadow-2xl tracking-widest">DEAL</button>
        ) : (
          <><button onClick={hit} className="bg-zinc-800 text-white px-16 py-6 rounded-3xl font-black text-xl border border-zinc-700 hover:bg-zinc-700 transition-all">HIT</button>
            <button onClick={stand} className="bg-white text-black px-16 py-6 rounded-3xl font-black text-xl hover:bg-zinc-200 transition-all shadow-xl">STAND</button></>
        )}
      </div>
      {message && <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-5xl font-black italic tracking-tighter text-white">{message}</motion.div>}
    </div>
  );
};

// --- NEW ADSENSE PAGES ---

const LandingPage = ({ onEnter }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6">
    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1 }} className="space-y-8">
      <div className="flex justify-center mb-10"><div className="bg-white p-6 rounded-[2rem] shadow-[0_0_50px_rgba(255,255,255,0.2)]"><Crown size={80} className="text-black" /></div></div>
      <h1 className="text-6xl md:text-9xl font-black italic tracking-tighter leading-[0.8] text-white">REFINEMENT <br/><span className="text-zinc-500">DEFINED.</span></h1>
      <p className="text-zinc-400 text-xl md:text-2xl max-w-2xl mx-auto italic font-medium leading-relaxed">Welcome to the world's most exclusive social gaming simulation. Where probability meets prestige.</p>
      <div className="pt-10">
        <button onClick={onEnter} className="group relative bg-white text-black px-16 py-8 rounded-full font-black text-2xl tracking-[0.2em] uppercase overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.3)]">
          <span className="relative z-10 flex items-center gap-4">Enter Members Lounge <ChevronRight /></span>
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-200 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      </div>
    </motion.div>
    <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl w-full">
      <div className="flex flex-col items-center gap-4 p-8 border border-white/5 rounded-[2rem] bg-white/5">
        <ShieldCheck className="text-zinc-500" size={40} />
        <h3 className="font-black text-lg">Fair Simulation</h3>
        <p className="text-zinc-500 text-sm">Advanced RNG algorithms ensuring truly random outcomes for every guest.</p>
      </div>
      <div className="flex flex-col items-center gap-4 p-8 border border-white/5 rounded-[2rem] bg-white/5">
        <Lock className="text-zinc-500" size={40} />
        <h3 className="font-black text-lg">Social Only</h3>
        <p className="text-zinc-500 text-sm">Strictly zero-risk play with virtual tokens. No real currency involved.</p>
      </div>
      <div className="flex flex-col items-center gap-4 p-8 border border-white/5 rounded-[2rem] bg-white/5">
        <UserCheck className="text-zinc-500" size={40} />
        <h3 className="font-black text-lg">Elite Support</h3>
        <p className="text-zinc-500 text-sm">24/7 technical assistance for all our premier club members.</p>
      </div>
    </div>
  </motion.div>
);

const LegalPage = ({ title, content, onBack }) => (
  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-4xl mx-auto py-20 px-6">
    <button onClick={onBack} className="flex items-center gap-2 text-zinc-500 hover:text-white mb-10 font-black uppercase tracking-widest text-xs transition-colors"><ChevronLeft /> Return</button>
    <div className="bg-gradient-to-br from-zinc-900/50 to-black/50 border border-white/5 rounded-[3rem] p-12 md:p-16 shadow-2xl">
      <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter mb-4 text-white">{title}</h1>
      <div className="h-px w-24 bg-gradient-to-r from-white/20 to-transparent mb-12"></div>
      <div className="space-y-10 text-zinc-400 leading-relaxed">
        {content.map((item, i) => {
          if (typeof item === 'string') {
            return <p key={i} className="text-lg italic">{item}</p>;
          } else if (item.type === 'heading') {
            return <h2 key={i} className="text-2xl font-black text-white mt-12 mb-6 uppercase tracking-wider">{item.text}</h2>;
          } else if (item.type === 'subheading') {
            return <h3 key={i} className="text-xl font-black text-zinc-300 mt-8 mb-4 uppercase tracking-widest text-xs">{item.text}</h3>;
          } else if (item.type === 'list') {
            return (
              <ul key={i} className="space-y-4 ml-6">
                {item.items.map((li, j) => (
                  <li key={j} className="flex items-start gap-3">
                    <span className="text-white mt-2">•</span>
                    <span className="text-lg italic flex-1">{li}</span>
                  </li>
                ))}
              </ul>
            );
          } else if (item.type === 'numbered') {
            return (
              <ol key={i} className="space-y-4 ml-6">
                {item.items.map((li, j) => (
                  <li key={j} className="flex items-start gap-3">
                    <span className="text-white mt-2 font-black">{j + 1}.</span>
                    <span className="text-lg italic flex-1">{li}</span>
                  </li>
                ))}
              </ol>
            );
          }
          return null;
        })}
      </div>
      <div className="mt-16 pt-8 border-t border-white/5 text-center">
        <p className="text-zinc-600 text-sm font-black uppercase tracking-[0.3em]">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>
    </div>
  </motion.div>
);

// --- MAIN APP COMPONENT ---

export default function App() {
  const [view, setView] = useState('landing'); // landing, lobby, game, privacy, terms, responsible
  const [tokens, setTokens] = useState(INITIAL_TOKENS);
  const [activeGame, setActiveGame] = useState(null);
  const [showAdModal, setShowAdModal] = useState(false);
  const [isAdLoading, setIsAdLoading] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  // Save progress to localStorage with user ID
  const saveProgress = useCallback((userId, tokensValue) => {
    if (userId) {
      const progress = {
        tokens: tokensValue,
        savedAt: new Date().toISOString()
      };
      localStorage.setItem(`luxe_premier_progress_${userId}`, JSON.stringify(progress));
    }
  }, []);

  // Load progress from localStorage with user ID
  const loadProgress = useCallback((userId) => {
    if (userId) {
      const saved = localStorage.getItem(`luxe_premier_progress_${userId}`);
      if (saved) {
        try {
          const progress = JSON.parse(saved);
          if (progress.tokens !== undefined) {
            setTokens(progress.tokens);
            return true;
          }
        } catch (e) {
          console.error('Error loading progress:', e);
        }
      }
    }
    return false;
  }, []);

  // Auto-save progress when tokens change and user is signed in
  useEffect(() => {
    if (user?.sub) {
      saveProgress(user.sub, tokens);
    }
  }, [tokens, user, saveProgress]);

  // Google Sign-In
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        });
        const profile = await response.json();
        setUser(tokenResponse);
        setUserProfile(profile);
        // Load saved progress for this user
        loadProgress(profile.sub);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    },
    onError: () => {
      console.error('Login failed');
    },
  });

  // Sign out
  const handleSignOut = () => {
    setUser(null);
    setUserProfile(null);
    setTokens(INITIAL_TOKENS);
  };

  const startPlaying = (game) => { setActiveGame(game); setView('game'); window.scrollTo(0,0); };
  const handleWatchAd = () => { setIsAdLoading(true); setTimeout(() => { setTokens(t => t + 1000); setIsAdLoading(false); setShowAdModal(false); }, 2000); };

  const navigateTo = (v) => { setView(v); setMobileMenu(false); window.scrollTo(0,0); };

  return (
    <div className="min-h-screen bg-[#020202] text-zinc-100 font-sans selection:bg-white selection:text-black">
      {/* Premium Header */}
      <nav className="sticky top-0 bg-black/80 backdrop-blur-2xl border-b border-white/5 px-8 py-6 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div onClick={() => navigateTo('landing')} className="flex items-center gap-3 cursor-pointer group">
            <div className="bg-white p-2 rounded-xl group-hover:scale-110 transition-transform"><Crown size={24} className="text-black" /></div>
            <div className="flex flex-col leading-none">
              <span className="text-2xl font-black italic tracking-tighter">LUXE</span>
              <span className="text-[8px] font-black uppercase tracking-[0.4em] text-zinc-500">Premier Studio</span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-12 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
            <button onClick={() => navigateTo('lobby')} className={`hover:text-white transition-colors ${view === 'lobby' ? 'text-white' : ''}`}>Floor Games</button>
            <a href="/privacy.html" target="_blank" className="hover:text-white transition-colors">Privacy</a>
            <a href="/terms.html" target="_blank" className="hover:text-white transition-colors">Terms</a>
            <button onClick={() => navigateTo('responsible')} className={`hover:text-white transition-colors ${view === 'responsible' ? 'text-white' : ''}`}>Safe Play</button>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-zinc-900 border border-zinc-800 px-6 py-3 rounded-full flex items-center gap-6 shadow-inner">
                <div className="flex items-center gap-2">
                <Coins size={20} className="text-yellow-500" />
                <span className="font-mono font-black text-2xl tracking-tighter">{tokens.toLocaleString()}</span>
                </div>
                <button onClick={() => setShowAdModal(true)} className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-all shadow-xl"><Plus size={20} /></button>
            </div>
            {userProfile ? (
              <div className="hidden md:flex items-center gap-3">
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                  {userProfile.picture ? (
                    <img src={userProfile.picture} alt={userProfile.name} className="w-8 h-8 rounded-full" />
                  ) : (
                    <User size={20} className="text-zinc-400" />
                  )}
                  <span className="text-sm font-black text-white/80 max-w-[120px] truncate">{userProfile.name}</span>
                </div>
                <button onClick={handleSignOut} className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-full flex items-center gap-2 transition-all border border-zinc-700">
                  <LogOut size={16} />
                  <span className="text-xs font-black uppercase tracking-wider">Sign Out</span>
                </button>
              </div>
            ) : (
              <button onClick={login} className="hidden md:flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-black text-sm uppercase tracking-wider hover:bg-zinc-200 transition-all shadow-xl">
                <LogIn size={18} />
                Sign In
              </button>
            )}
            <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden text-white"><Menu size={32} /></button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenu && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="fixed inset-0 z-[60] bg-black p-10 flex flex-col gap-10 text-3xl font-black italic uppercase tracking-tighter">
            <button onClick={() => setMobileMenu(false)} className="self-end"><X size={40} /></button>
            {userProfile ? (
              <>
                <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                  {userProfile.picture ? (
                    <img src={userProfile.picture} alt={userProfile.name} className="w-12 h-12 rounded-full" />
                  ) : (
                    <User size={32} className="text-zinc-400" />
                  )}
                  <span className="text-xl">{userProfile.name}</span>
                </div>
                <button onClick={() => { handleSignOut(); setMobileMenu(false); }}>Sign Out</button>
              </>
            ) : (
              <button onClick={() => { login(); setMobileMenu(false); }}>Sign In</button>
            )}
            <button onClick={() => navigateTo('lobby')}>Enter Casino</button>
            <a href="/privacy.html" target="_blank" className="block">Privacy Policy</a>
            <a href="/terms.html" target="_blank" className="block">Terms of Service</a>
            <button onClick={() => navigateTo('responsible')}>Responsible Gaming</button>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-7xl mx-auto p-8 md:p-16">
        <AnimatePresence mode="wait">
          {view === 'landing' && <LandingPage key="landing" onEnter={() => navigateTo('lobby')} />}
          
          {view === 'lobby' && (
            <motion.div key="lobby" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-24">
              <div className="text-center space-y-6">
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="inline-block px-4 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Established 2024</motion.div>
                <h1 className="text-7xl md:text-9xl font-black italic uppercase tracking-tighter leading-[0.8] mb-4">
                  Define Your <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-400 to-zinc-600">Fortune.</span>
                </h1>
                <p className="text-zinc-500 max-w-2xl mx-auto font-medium text-lg italic">"A premier collection of high-performance probability simulations for the sophisticated guest."</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {GAMES.map(g => (
                  <motion.div key={g.id} whileHover={{ y: -15, scale: 1.02 }} onClick={() => startPlaying(g)} className={`h-[450px] rounded-[3.5rem] p-12 cursor-pointer bg-gradient-to-br ${g.colors} border border-white/5 shadow-2xl relative overflow-hidden group transition-all`}>
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                    <div className="relative z-10 flex flex-col justify-between h-full">
                      <div className="w-20 h-20 bg-black/40 backdrop-blur-2xl rounded-3xl flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">{g.icon}</div>
                      <div className="space-y-2">
                        <h3 className="text-4xl font-black italic leading-none">{g.name}</h3>
                        <div className="flex items-center gap-3 text-white/40 text-[10px] font-black uppercase tracking-[0.3em]"><TrendingUp size={14} /> Wager Min: {g.minBet} </div>
                        <div className="pt-4 opacity-0 group-hover:opacity-100 transition-opacity"><span className="text-white bg-white/10 px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest">Enter Suite</span></div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {view === 'game' && (
            <motion.div key="game" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-20">
              <div className="w-full flex justify-between items-center border-b border-white/5 pb-10">
                <button onClick={() => navigateTo('lobby')} className="flex items-center gap-3 text-zinc-500 hover:text-white transition-colors font-black uppercase tracking-[0.3em] text-[10px]"><ChevronLeft size={20}/> Exit Suite</button>
                <div className="text-right">
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-600">Active Simulation</span>
                  <h2 className="text-5xl font-black italic tracking-tighter uppercase">{activeGame.name}</h2>
                </div>
              </div>
              {activeGame.type === 'blackjack' && <BlackjackTable initialMinBet={activeGame.minBet} tokens={tokens} setTokens={setTokens} />}
              {activeGame.type === 'slots' && <SlotMachine symbols={activeGame.symbols} tokens={tokens} setTokens={setTokens} minBet={activeGame.minBet} />}
              {activeGame.type === 'mega-slots' && <MegaSlotMachine symbols={activeGame.symbols} tokens={tokens} setTokens={setTokens} minBet={activeGame.minBet} />}
              {activeGame.type === 'roulette' && <RouletteTable initialMinBet={activeGame.minBet} tokens={tokens} setTokens={setTokens} />}
              <div className="w-full max-w-3xl bg-zinc-900/50 border border-white/5 p-12 rounded-[3rem] flex flex-col md:flex-row gap-10">
                <div className="w-20 h-20 bg-white/5 rounded-[1.5rem] flex items-center justify-center shrink-0 border border-white/5"><Info className="text-zinc-400" size={32} /></div>
                <div className="space-y-4">
                  <h4 className="font-black uppercase text-xs tracking-[0.4em] text-zinc-400">Guest Strategy Brief</h4>
                  <p className="text-zinc-500 text-lg italic leading-relaxed">"{activeGame.guide}"</p>
                </div>
              </div>
            </motion.div>
          )}


          {view === 'responsible' && (
            <LegalPage 
                title="Responsible Simulation" 
                onBack={() => navigateTo('landing')}
                content={[
                    "Entertainment should remain balanced and sophisticated. Luxe Premier encourages all guests to practice mindfulness during their stay.",
                    "While our platform involves no real money, the mechanics simulate real-world probability. We advise guests to view this strictly as a recreational strategy simulation.",
                    "Set time limits for your virtual sessions. If you find yourself spending excessive time in the simulation, we recommend taking an extended break.",
                    "Luxe Premier provides tools for token reset and session termination. We advocate for a healthy, social-first approach to all virtual floor games.",
                    "Remember: The objective of Luxe Premier is the appreciation of probability and refined social interaction, not financial gain."
                ]}
            />
          )}
        </AnimatePresence>
      </main>

      {/* Corporate Footer */}
      <footer className="mt-20 bg-zinc-950 border-t border-white/5 pt-20 pb-10 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-white/5 pb-20">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-lg"><Crown size={20} className="text-black" /></div>
              <span className="text-xl font-black italic tracking-tighter uppercase">LUXE PREMIER</span>
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed">{SITE_CONFIG.description}</p>
          </div>
          <div className="space-y-6">
            <h5 className="font-black uppercase text-xs tracking-widest flex items-center gap-2"><FileText size={14}/> Policies</h5>
            <ul className="space-y-3 text-sm text-zinc-500 font-medium italic">
              <li><a href="/terms.html" target="_blank" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="/privacy.html" target="_blank" className="hover:text-white transition-colors">Privacy Charter</a></li>
              <li className="hover:text-white cursor-pointer transition-colors">Fair Play Audit</li>
            </ul>
          </div>
          <div className="space-y-6">
            <h5 className="font-black uppercase text-xs tracking-widest flex items-center gap-2"><ShieldAlert size={14}/> Responsible</h5>
            <ul className="space-y-3 text-sm text-zinc-500 font-medium italic">
              <li onClick={() => navigateTo('responsible')} className="hover:text-white cursor-pointer transition-colors">Safe Play Charter</li>
              <li className="hover:text-white cursor-pointer transition-colors">Self-Exclusion</li>
              <li className="hover:text-white cursor-pointer transition-colors">Support Resources</li>
            </ul>
          </div>
          <div className="space-y-6">
            <h5 className="font-black uppercase text-xs tracking-widest flex items-center gap-2"><Scale size={14}/> Compliance</h5>
            <p className="text-zinc-500 text-[10px] font-black uppercase leading-loose tracking-widest">
              LUXE PREMIER IS FOR ENTERTAINMENT PURPOSES ONLY. NO REAL MONEY WAGERING. SOCIAL SIMULATION CERTIFIED 2024.
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-10 flex flex-col md:flex-row justify-between items-center gap-4 text-zinc-600 text-[10px] font-black uppercase tracking-[0.3em]">
          <span>© 2024 LUXE PREMIER GAMING STUDIO. ALL RIGHTS RESERVED.</span>
          <div className="flex gap-6">
            <span>Server: 0xLXP-ALPHA</span>
            <span className="flex items-center gap-1">Ad Transparency <ExternalLink size={10} /></span>
          </div>
        </div>
      </footer>

      {showAdModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-3xl">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-zinc-900 border border-white/5 w-full max-w-sm rounded-[4rem] p-12 text-center space-y-10 shadow-[0_0_100px_rgba(255,255,255,0.05)]">
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/10"><Coins size={48} className="text-yellow-500" /></div>
            <div className="space-y-4">
              <h3 className="text-4xl font-black italic tracking-tighter">REPLENISH</h3>
              <p className="text-zinc-500 text-sm italic font-medium">Allow us to grant a 1,000 token courtesy credit upon viewing a brief brand exhibition.</p>
            </div>
            <div className="space-y-4">
              <button onClick={handleWatchAd} disabled={isAdLoading} className="w-full bg-white text-black py-6 rounded-3xl font-black text-xl flex items-center justify-center gap-3 hover:bg-zinc-200 transition-all shadow-xl">
                {isAdLoading ? <div className="w-8 h-8 border-4 border-black/20 border-t-black rounded-full animate-spin" /> : <><Tv size={24} /> Begin Exhibition</>}
              </button>
              <button onClick={() => setShowAdModal(false)} className="text-zinc-600 font-black uppercase text-[10px] tracking-[0.4em] hover:text-white transition-colors">Decline Offer</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
