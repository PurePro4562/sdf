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
  name: "LUXEBLACK",
  tagline: "The World's Most Refined Social Gaming Simulation",
  description: "Experience the pinnacle of virtual gaming with LuxeBlack. Our platform offers high-performance RNG simulations designed for entertainment and strategic mastery in a zero-risk environment.",
  disclaimer: "LuxeBlack is a strictly social simulation platform. Virtual tokens have no real-world value and cannot be exchanged for currency or prizes. Participation is intended for those 18+.",
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
    id: 'luxe-mega-5', 
    type: 'luxe-mega-5', 
    name: 'LUXEBLACK MEGA 5', 
    colors: 'from-black via-zinc-900 via-purple-950 to-black', 
    symbols: ['💎', '⭐', '👑', '🎰', '💰', '🚀', '🎆', '💫', '🔥', '⚡'], 
    minBet: 30, 
    icon: <Crown className="text-yellow-400" size={32} />,
    guide: "PREMIUM 5-COLUMN MEGA SLOTS! Match 3-5 symbols for massive wins up to 500x! Exclusive LuxeBlack experience!"
  },
  { 
    id: 'ocean-slots', 
    type: 'ocean-slots', 
    name: 'Ocean Depths', 
    colors: 'from-blue-950 via-cyan-950 to-teal-950', 
    symbols: ['🐚', '💎', '🐙', '🌟', '🌊', '🐟', '⚓', '💠'], 
    minBet: 15, 
    icon: <CircleDot className="text-cyan-400" size={32} />,
    guide: "Dive deep! Triple matches pay up to 150x! Special symbols can trigger BONUS ROUNDS with free spins!"
  },
  { 
    id: 'cosmic-slots', 
    type: 'cosmic-slots', 
    name: 'Cosmic Void', 
    colors: 'from-purple-950 via-indigo-950 to-black', 
    symbols: ['⭐', '🌌', '🚀', '💫', '🌠', '🪐', '🌙', '✨'], 
    minBet: 20, 
    icon: <Sparkles className="text-purple-400" size={32} />,
    guide: "Journey through space! Triple matches pay up to 200x! Stars can unlock BONUS FREE SPINS!"
  },
  { 
    id: 'pharaoh-slots', 
    type: 'pharaoh-slots', 
    name: 'Pharaoh\'s Fortune', 
    colors: 'from-amber-950 via-yellow-900 to-orange-950', 
    symbols: ['👑', '💎', '⚱️', '🏺', '🏛️', '🐍', '📜', '🔱'], 
    minBet: 18, 
    icon: <Crown className="text-yellow-400" size={32} />,
    guide: "Unlock ancient treasures! Triple matches pay up to 180x! Pharaoh symbols trigger BONUS ROUNDS!"
  },
  { 
    id: 'cyber-slots', 
    type: 'cyber-slots', 
    name: 'Neon Cyber', 
    colors: 'from-fuchsia-950 via-purple-950 to-indigo-950', 
    symbols: ['💎', '⚡', '🎮', '🔮', '💜', '🌐', '🤖', '💿'], 
    minBet: 22, 
    icon: <Zap className="text-fuchsia-400" size={32} />,
    guide: "Hack the matrix! Triple matches pay up to 190x! Cyber symbols activate HACK MODE BONUS!"
  },
  { 
    id: 'forest-slots', 
    type: 'forest-slots', 
    name: 'Forest Magic', 
    colors: 'from-green-950 via-emerald-950 to-teal-950', 
    symbols: ['🍀', '🌿', '🌸', '🌺', '🌳', '🦋', '🌲', '🍄'], 
    minBet: 16, 
    icon: <CircleDot className="text-green-400" size={32} />,
    guide: "Nature's blessing! Triple matches pay up to 170x! Lucky clovers trigger FOREST BLESSING BONUS!"
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
  const step = Math.max(1, minBet || 1);

  const addBet = (val) => {
    setBet(prev => {
      const base = Number.isFinite(prev) ? prev : 0;
      return Math.max(minBet, Math.min(maxTokens, base + val));
    });
  };

  const changeBy = (delta) => {
    setBet(prev => {
      const base = Number.isFinite(prev) ? prev : 0;
      const next = Math.round(base + delta);
      return Math.max(minBet, Math.min(maxTokens, next));
    });
  };

  const onInputChange = (e) => {
    // Allow only digits while typing
    const digits = e.target.value.replace(/[^0-9]/g, '');
    setBet(digits === '' ? 0 : parseInt(digits, 10));
  };

  const onInputBlur = () => {
    if (!Number.isFinite(currentBet) || currentBet === 0) setBet(minBet);
    else if (currentBet < minBet) setBet(minBet);
    else if (currentBet > maxTokens) setBet(maxTokens);
  };

  const isUnderMin = currentBet < minBet;
  const isOver = currentBet > maxTokens;

  return (
    <div className={`flex flex-col gap-6 items-center w-full max-w-lg ${disabled ? 'opacity-40 pointer-events-none' : ''}`}>
      <div className="flex items-center gap-4 w-full">
        <button onClick={() => setBet(minBet)} disabled={disabled} className="bg-white/5 hover:bg-white/10 px-6 py-4 rounded-2xl border border-white/10 text-[10px] font-black text-white/40 uppercase tracking-[0.2em] transition-all">Clear</button>

        <div className={`flex-1 bg-gradient-to-b from-zinc-900 to-black border-2 border-zinc-800 rounded-3xl p-5 flex flex-col items-center shadow-2xl ${isOver ? 'ring-2 ring-red-500' : isUnderMin ? 'ring-2 ring-yellow-400' : ''}`}>
           <span className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.4em] mb-1">Current Stakes</span>
           <div className="flex items-center gap-3">
             <Coins size={20} className="text-yellow-500" />
             <span className="text-4xl font-mono font-black tracking-tighter text-white">{(Number.isFinite(currentBet) ? currentBet : 0).toLocaleString()}</span>
           </div>

           <div className="mt-3 flex items-center gap-3 justify-center w-full">
             <button onClick={() => changeBy(-step)} disabled={disabled || (Number.isFinite(currentBet) && currentBet <= minBet)} className="bg-white/5 hover:bg-white/10 px-3 py-2 rounded-xl border border-white/10 text-sm font-black text-white/60">
               <Minus size={16} />
             </button>

             <input
               type="text"
               inputMode="numeric"
               value={Number.isFinite(currentBet) ? currentBet : ''}
               onChange={onInputChange}
               onBlur={onInputBlur}
               disabled={disabled}
               className="bg-transparent text-2xl font-mono font-black tracking-tighter text-white text-center w-36 outline-none border-b border-white/10 py-2"
               aria-label="Bet amount"
             />

             <button onClick={() => changeBy(step)} disabled={disabled || (Number.isFinite(currentBet) && currentBet >= maxTokens)} className="bg-white/5 hover:bg-white/10 px-3 py-2 rounded-xl border border-white/10 text-sm font-black text-white/60">
               <Plus size={16} />
             </button>
           </div>

           <div className="mt-2 text-xs flex justify-between w-full px-4">
             <div className={`${isUnderMin ? 'text-yellow-300' : 'text-zinc-500'}`}>Min: {minBet.toLocaleString()}</div>
             <div className={`${isOver ? 'text-red-300' : 'text-zinc-500'}`}>Balance: {maxTokens.toLocaleString()}</div>
           </div>

           {isOver && (
             <div className="mt-2 text-sm font-black text-red-400">Insufficient funds</div>
           )}
           {isUnderMin && (
             <div className="mt-2 text-sm font-black text-yellow-400">Below minimum bet</div>
           )}
        </div>

        <button onClick={() => setBet(maxTokens)} disabled={disabled} className="bg-white/5 hover:bg-white/10 px-6 py-4 rounded-2xl border border-white/10 text-[10px] font-black text-white/40 uppercase tracking-[0.2em] transition-all">Max</button>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        {chips.map(chip => (
          <button key={chip} onClick={() => addBet(chip)} disabled={disabled} className="group relative flex flex-col items-center">
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

// --- GAME LOGIC (ENHANCED ROULETTE) ---

const RouletteTable = ({ initialMinBet, tokens, setTokens }) => {
  const [bet, setBet] = useState(initialMinBet);
  const [betType, setBetType] = useState('red');
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [showNumberPicker, setShowNumberPicker] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [message, setMessage] = useState('');
  const [wheelRotation, setWheelRotation] = useState(0);

  // European roulette wheel order (0 first) — used for realistic segment layout/animation
  const wheelOrder = [0,32,15,19,4,21,2,25,17,34,6,27,13,36,11,30,8,23,10,5,24,16,33,1,20,14,31,9,22,18,29,7,28,12,35,3,26];
  const segmentAngle = 360 / wheelOrder.length;
  const redNumbers = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];

  const colorFor = (n) => {
    if (n === 0) return '#10B981'; // emerald
    return redNumbers.includes(n) ? '#EF4444' : '#0F172A'; // red or dark (brand-friendly)
  };

  // Build a conic-gradient string for the wheel's background
  const wheelGradient = wheelOrder.map((n, i) => `${colorFor(n)} ${i * segmentAngle}deg ${ (i + 1) * segmentAngle }deg`).join(',');

  const highlightClass = (n) => (n === 0 ? 'bg-emerald-500 text-black' : redNumbers.includes(n) ? 'bg-red-600 text-white' : 'bg-zinc-900/80 text-white');

  const spin = () => {
    if (spinning) return;
    if (bet > tokens) { setMessage('INSUFFICIENT FUNDS'); createClick(600, 0.12); setTimeout(() => setMessage(''), 2200); return; }
    if (bet < initialMinBet) { setMessage(`MINIMUM BET ${initialMinBet}`); createClick(400, 0.08); setTimeout(() => setMessage(''), 2200); return; }
    setSpinning(true); setMessage(''); setTokens(t => t - bet);

    // small spin sound
    createClick(700, 0.12);

    // choose result
    const result = Math.floor(Math.random() * 37);
    setLastResult(null);

    // Calculate target rotation so the wheel lands with the result under the top pointer
    const targetIndex = wheelOrder.indexOf(result);
    const rotations = 6; // full rotations for dramatic effect
    const targetAngle = rotations * 360 + (targetIndex * segmentAngle);

    // animate rotation by updating state; framer-motion will handle smoothing
    setWheelRotation(w => w + targetAngle);

    // wait for animation duration then resolve result
    const durationMs = 3000;
    setTimeout(() => {
      setSpinning(false);
      setLastResult(result);

      // evaluate win
      let won = false; let multiplier = 0;
      if (typeof betType === 'number') {
        if (result === betType) { won = true; multiplier = 36; }
      } else if (betType === 'red' && redNumbers.includes(result)) { won = true; multiplier = 2; }
      else if (betType === 'black' && !redNumbers.includes(result) && result !== 0) { won = true; multiplier = 2; }
      else if (betType === 'even' && result % 2 === 0 && result !== 0) { won = true; multiplier = 2; }
      else if (betType === 'odd' && result % 2 !== 0) { won = true; multiplier = 2; }
      else if (betType === '1st-dozen' && result >= 1 && result <= 12) { won = true; multiplier = 3; }
      else if (betType === '2nd-dozen' && result >= 13 && result <= 24) { won = true; multiplier = 3; }
      else if (betType === '3rd-dozen' && result >= 25 && result <= 36) { won = true; multiplier = 3; }
      else if (betType === '1-18' && result >= 1 && result <= 18) { won = true; multiplier = 2; }
      else if (betType === '19-36' && result >= 19 && result <= 36) { won = true; multiplier = 2; }
      else if (betType && betType.startsWith('col-')) {
        // columns (1,2,3) — numbers arranged into three vertical columns on table
        const col = parseInt(betType.split('-')[1], 10);
        if (result !== 0) {
          const columnIndex = ((result - 1) % 3) + 1; // 1,2,3
          if (columnIndex === col) { won = true; multiplier = 3; }
        }
      }

      if (won) { setTokens(t => t + bet * multiplier); setMessage(`VICTORY +${(bet * multiplier).toLocaleString()}`); createChord([440,660], 0.35, 'sine', 0.18, true); }
      else { setMessage('HOUSE WINS'); }
    }, durationMs + 120);
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full">
      <div className="relative w-80 h-80 md:w-[420px] md:h-[420px] rounded-full border-[12px] border-zinc-900 bg-[radial-gradient(ellipse_at_center,#0b1220,rgba(0,0,0,0.8))] flex items-center justify-center shadow-[0_0_120px_rgba(0,0,0,0.9)]">
        {/* Pointer */}
        <div className="absolute -top-4 w-full flex items-start justify-center pointer-events-none z-30">
          <div className="w-0 h-0 border-l-8 border-r-8 border-b-16 border-l-transparent border-r-transparent border-b-white shadow-sm" />
        </div>

        {/* Wheel */}
        <motion.div animate={{ rotate: wheelRotation }} transition={{ duration: 3, ease: [0.22, 1, 0.36, 1] }} className="absolute inset-4 rounded-full overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 rounded-full" style={{ background: `conic-gradient(${wheelGradient})`, transform: 'rotate(0deg)' }} />

          {/* separators and numbers overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            {wheelOrder.map((n, i) => {
              const angle = i * segmentAngle;
              return (
                <div key={n} style={{ position: 'absolute', width: '100%', height: '100%', transform: `rotate(${angle}deg)` }}>
                  <div style={{ position: 'absolute', top: '8%', left: '50%', transform: 'translateX(-50%) rotate(-' + angle + 'deg)', fontSize: 10 }} className={`font-black ${n === 0 ? 'text-black' : redNumbers.includes(n) ? 'text-white' : 'text-white'}`}>
                    {n}
                  </div>
                  {/* thin separator */}
                  <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 4, height: '6%', background: 'rgba(255,255,255,0.06)' }} />
                </div>
              );
            })}
          </div>

          {/* inner wheel center */}
          <div className="w-32 h-32 rounded-full bg-gradient-to-b from-black/40 to-black/80 border border-white/5 flex items-center justify-center z-20">
            <div className="text-center">
              <div className="text-4xl font-black text-white">Luxe</div>
              <div className="text-xs uppercase tracking-widest text-zinc-400">Prestige</div>
            </div>
          </div>
        </motion.div>

        {/* wheel rim */}
        <div className="absolute inset-0 rounded-full pointer-events-none" style={{ boxShadow: 'inset 0 16px 25px rgba(0,0,0,0.6), 0 10px 40px rgba(16,24,39,0.6)' }} />
      </div>

      {/* Display result prominently */}
      <div className="text-center">
        <AnimatePresence mode="wait"><motion.div key={lastResult} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center">
          <span className={`text-6xl md:text-7xl font-black mb-1 tracking-tighter ${lastResult !== null ? (lastResult === 0 ? 'text-emerald-500' : redNumbers.includes(lastResult) ? 'text-red-500' : 'text-white') : 'text-zinc-800'}`}>
            {spinning ? '...' : (lastResult ?? '--')}
          </span>
          <span className="text-[10px] font-black uppercase tracking-[0.8em] text-zinc-500">{spinning ? 'SPINNING' : 'RESULT'}</span>
        </motion.div></AnimatePresence>
      </div>

      {/* Bet type controls */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 w-full max-w-3xl">
        {['red','black','even','odd','1-18','19-36','1st-dozen','2nd-dozen','3rd-dozen','col-1','col-2','col-3'].map(type => (
          <button key={type} onClick={() => { setBetType(type); setSelectedNumber(null); setShowNumberPicker(false); }} className={`py-3 rounded-2xl font-black uppercase text-xs tracking-widest border transition-all ${betType === type ? 'bg-white text-black border-white scale-105' : 'bg-black/40 border-zinc-800 text-zinc-300 hover:border-zinc-700'}`}>
            {type.replace('-', ' ').toUpperCase()}
          </button>
        ))}
      </div>

      {/* Number picker toggle and grid */}
      <div className="w-full max-w-3xl flex flex-col items-center gap-4">
        <div className="w-full flex items-center justify-between">
          <button onClick={() => { setShowNumberPicker(s => !s); setSelectedNumber(null); setBetType('red'); }} className="py-2 px-4 rounded-lg bg-black/50 border border-white/5 text-sm font-black">{showNumberPicker ? 'Hide Numbers' : 'Pick Specific Number'}</button>
          {selectedNumber !== null && <div className="text-sm font-black">Selected: <span className={`px-3 py-1 rounded-full ${highlightClass(selectedNumber)}`}>{selectedNumber}</span></div>}
        </div>

        {showNumberPicker && (
          <div className="grid grid-cols-7 gap-2 w-full">
            {Array.from({ length: 37 }).map((_, n) => (
              <button key={n} onClick={() => { setSelectedNumber(n); setBetType(n); }} disabled={spinning} className={`py-2 rounded-lg font-black text-sm ${n === 0 ? 'bg-emerald-500 text-black' : redNumbers.includes(n) ? 'bg-red-600 text-white' : 'bg-zinc-900/80 text-white'}`}>{n}</button>
            ))}
          </div>
        )}
      </div>

      <BetSelector currentBet={bet} setBet={setBet} minBet={initialMinBet} maxTokens={tokens} disabled={spinning} />

      <button onClick={spin} disabled={spinning} className="group w-full max-w-md bg-white text-black py-5 rounded-[1.6rem] font-black text-xl uppercase tracking-[0.2em] shadow-2xl disabled:opacity-50 transition-all hover:bg-zinc-100">
        {spinning ? 'Spinning...' : 'Spin the Wheel'}
      </button>

      {message && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-2xl font-black italic tracking-tight text-white">{message}</motion.div>}
    </div>
  );
};

const SlotMachine = ({ symbols, tokens, setTokens, minBet: initialMinBet, showNotification }) => {
  const [reels, setReels] = useState([symbols[0], symbols[1], symbols[2]]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winMsg, setWinMsg] = useState('');
  const [bet, setBet] = useState(initialMinBet);
  const spin = () => {
    if (isSpinning) return;
    if (bet > tokens) { setWinMsg('INSUFFICIENT FUNDS'); createClick(600, 0.12); setTimeout(() => setWinMsg(''), 2200); return; }
    if (bet < initialMinBet) { setWinMsg(`MINIMUM BET ${initialMinBet}`); createClick(400, 0.08); setTimeout(() => setWinMsg(''), 2200); return; }
    setIsSpinning(true); setWinMsg(''); setTokens(t => t - bet);
    playSpinSound('default');
    const results = [symbols[Math.floor(Math.random() * symbols.length)], symbols[Math.floor(Math.random() * symbols.length)], symbols[Math.floor(Math.random() * symbols.length)]];
    [700, 1200, 1700].forEach((d, i) => {
      setTimeout(() => {
        setReels(prev => { const n = [...prev]; n[i] = results[i]; return n; });
        playReelStopSound('default');
        if (i === 2) setTimeout(() => finalize(results), 150);
      }, d);
    });
  };
  const finalize = (res) => {
    setIsSpinning(false);
    let mult = 0;
    let message = '';
    if (res[0] === res[1] && res[1] === res[2]) {
      mult = (res[0] === '7️⃣' || res[0] === '🔥' || res[0] === '💎') ? 50 : 25;
      setTokens(t => t + bet * mult);
      message = `PREMIER JACKPOT! +${(bet * mult).toLocaleString()}`;
      setWinMsg(message);
    } else if (res[0] === res[1] || res[1] === res[2] || res[0] === res[2]) {
      mult = 2;
      setTokens(t => t + bet * mult);
      message = 'MATCH WIN! +2x';
      setWinMsg(message);
    }
    if (mult > 0) {
      playWinSound(mult, 'default');
      if (typeof showNotification === 'function') showNotification(message || `WIN +${(bet * mult).toLocaleString()}`);
    }
  };
  return (
    <div className="flex flex-col items-center gap-10 p-12 bg-gradient-to-b from-zinc-900 to-black rounded-[4rem] border border-white/5 relative shadow-[0_0_100px_rgba(0,0,0,0.8)]">
      <div className="flex gap-4 md:gap-8 bg-black/40 p-4 rounded-[2.5rem] border border-white/5">
        {reels.map((symbol, i) => (
          <div key={i} className="relative w-28 h-48 md:w-36 md:h-56 bg-gradient-to-b from-zinc-900 to-black rounded-[2rem] overflow-hidden border border-white/10 flex items-center justify-center">
            <motion.div key={isSpinning ? `spin-${i}` : symbol} initial={isSpinning ? { y: -400 } : { y: -50 }} animate={{ y: 0 }} transition={{ repeat: isSpinning ? Infinity : 0, duration: isSpinning ? 0.06 : 0.4, ease: isSpinning ? "linear" : "backOut" }} className={`text-6xl md:text-8xl ${isSpinning ? 'blur-xl opacity-20' : 'drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]'}`}>
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
      <AnimatePresence>
        {winMsg && (
          <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }} className={`absolute -top-16 z-50 px-12 py-5 rounded-full font-black text-2xl ${winMsg && (winMsg.includes('INSUFFICIENT') || winMsg.startsWith('MINIMUM')) ? 'bg-red-500 text-white shadow-[0_0_30px_rgba(239,68,68,0.5)]' : 'bg-emerald-500 text-black shadow-[0_0_30px_rgba(16,185,129,0.5)]'}`}>
            {winMsg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// PROFESSIONAL ENHANCED SOUND SYSTEM - Ultra Polished & Addicting
let audioContext = null;
const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  return audioContext;
};

// Create sound with reverb and multiple layers for depth
const createSound = (frequency, duration, type = 'sine', volume = 0.3, detune = 0, reverb = false) => {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const masterGain = ctx.createGain();
    
    if (reverb) {
      // Add reverb effect using delay
      const delay = ctx.createDelay();
      const delayGain = ctx.createGain();
      const feedbackGain = ctx.createGain();
      
      delay.delayTime.value = 0.1;
      delayGain.gain.value = 0.3;
      feedbackGain.gain.value = 0.2;
      
      oscillator.connect(gainNode);
      gainNode.connect(masterGain);
      gainNode.connect(delay);
      delay.connect(delayGain);
      delayGain.connect(feedbackGain);
      feedbackGain.connect(delay);
      delayGain.connect(masterGain);
    } else {
      oscillator.connect(gainNode);
      gainNode.connect(masterGain);
    }
    
    masterGain.connect(ctx.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = type;
    if (detune) oscillator.detune.value = detune;
    
    // Smooth attack and release
    const now = ctx.currentTime;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(volume, now + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);
    
    masterGain.gain.value = 0.8;
    
    oscillator.start(now);
    oscillator.stop(now + duration);
  } catch (e) {
    // Silently fail if audio context not available
  }
};

// Create rich, layered chord with harmonics
const createChord = (frequencies, duration, type = 'sine', volume = 0.25, addHarmonics = false) => {
  frequencies.forEach((freq, i) => {
    setTimeout(() => {
      createSound(freq, duration, type, volume);
      if (addHarmonics) {
        // Add harmonics for richness
        setTimeout(() => createSound(freq * 2, duration * 0.6, type, volume * 0.4), 10);
        setTimeout(() => createSound(freq * 3, duration * 0.4, type, volume * 0.2), 20);
      }
    }, i * 25);
  });
};

// Create satisfying click/pop sound
const createClick = (frequency = 800, volume = 0.15) => {
  createSound(frequency, 0.05, 'square', volume);
  createSound(frequency * 1.5, 0.03, 'sine', volume * 0.6);
};

const playSpinSound = (theme = 'default') => {
  const ctx = getAudioContext();
  // Add satisfying click at start
  createClick(1000, 0.2);
  
  if (theme === 'ocean') {
    // Layered underwater sounds
    createSound(150, 0.12, 'sine', 0.18, 0, true);
    setTimeout(() => createSound(200, 0.12, 'sine', 0.18, 0, true), 50);
    setTimeout(() => createSound(250, 0.12, 'sine', 0.18, 0, true), 100);
    setTimeout(() => createSound(180, 0.08, 'sine', 0.12), 150);
  } else if (theme === 'cosmic') {
    // Spacey ethereal sounds
    createSound(200, 0.15, 'sine', 0.22, -50, true);
    setTimeout(() => createSound(300, 0.15, 'sine', 0.22, 50, true), 60);
    setTimeout(() => createSound(400, 0.12, 'sine', 0.18, 0), 120);
  } else if (theme === 'egyptian') {
    // Rich ancient sounds
    createSound(220, 0.14, 'sawtooth', 0.24);
    setTimeout(() => createSound(330, 0.14, 'sawtooth', 0.24), 70);
    setTimeout(() => createSound(440, 0.1, 'sawtooth', 0.2), 140);
  } else if (theme === 'cyber') {
    // Sharp digital sounds
    createClick(1200, 0.25);
    createSound(300, 0.08, 'square', 0.28);
    setTimeout(() => createClick(1500, 0.25), 30);
    setTimeout(() => createSound(400, 0.08, 'square', 0.28), 40);
    setTimeout(() => createClick(1800, 0.25), 60);
    setTimeout(() => createSound(500, 0.08, 'square', 0.28), 70);
  } else if (theme === 'forest') {
    // Natural organic sounds
    createSound(180, 0.13, 'sine', 0.2, 0, true);
    setTimeout(() => createSound(240, 0.13, 'sine', 0.2, 0, true), 60);
    setTimeout(() => createSound(300, 0.1, 'sine', 0.16), 120);
  } else {
    // Default - Premium casino sound
    createClick(900, 0.22);
    createSound(200, 0.12, 'sawtooth', 0.24);
    setTimeout(() => createClick(1100, 0.2), 50);
    setTimeout(() => createSound(300, 0.12, 'sawtooth', 0.24), 60);
    setTimeout(() => createClick(1300, 0.18), 100);
    setTimeout(() => createSound(400, 0.12, 'sawtooth', 0.24), 110);
    // Add subtle low end
    setTimeout(() => createSound(100, 0.15, 'sine', 0.12), 30);
  }
};

const playWinSound = (multiplier, theme = 'default') => {
  // Add satisfying impact sound first
  createClick(600, 0.25);
  
  if (multiplier >= 200) {
    // ULTRA MEGA WIN - Epic cinematic progression with harmonics
    createChord([261.63, 329.63, 392.00, 523.25], 0.5, 'sine', 0.4, true);
    setTimeout(() => {
      createClick(700, 0.3);
      createChord([293.66, 369.99, 440.00, 587.33], 0.5, 'sine', 0.4, true);
    }, 250);
    setTimeout(() => {
      createClick(800, 0.35);
      createChord([329.63, 415.30, 493.88, 659.25], 0.6, 'sine', 0.45, true);
    }, 500);
    // Add triumphant ending
    setTimeout(() => {
      createChord([392.00, 493.88, 587.33, 783.99], 0.4, 'sine', 0.5, true);
    }, 800);
  } else if (multiplier >= 100) {
    // MEGA WIN - Rich satisfying progression
    createChord([261.63, 329.63, 392.00], 0.35, 'sine', 0.35, true);
    setTimeout(() => {
      createClick(650, 0.28);
      createChord([329.63, 415.30, 493.88], 0.35, 'sine', 0.35, true);
    }, 180);
    setTimeout(() => {
      createClick(750, 0.3);
      createChord([392.00, 493.88, 587.33], 0.4, 'sine', 0.4, true);
    }, 360);
  } else if (multiplier >= 50) {
    // BIG WIN - Pleasant rich chord
    createChord([261.63, 329.63, 392.00], 0.3, 'sine', 0.32, true);
    setTimeout(() => {
      createClick(600, 0.25);
      createChord([329.63, 415.30, 493.88], 0.3, 'sine', 0.32, true);
    }, 150);
  } else if (multiplier >= 10) {
    // MEDIUM WIN - Satisfying two-tone
    createSound(523.25, 0.25, 'sine', 0.28, 0, true);
    setTimeout(() => {
      createClick(550, 0.2);
      createSound(659.25, 0.25, 'sine', 0.28, 0, true);
    }, 120);
    setTimeout(() => createSound(783.99, 0.2, 'sine', 0.24), 240);
  } else {
    // SMALL WIN - Quick satisfying pop
    createSound(523.25, 0.18, 'sine', 0.24, 0, true);
    setTimeout(() => {
      createClick(500, 0.18);
      createSound(659.25, 0.18, 'sine', 0.24, 0, true);
    }, 100);
  }
};

const playReelStopSound = (theme = 'default') => {
  // Satisfying click-pop on reel stop
  if (theme === 'ocean') {
    createClick(400, 0.15);
    createSound(120, 0.08, 'sine', 0.14, 0, true);
  } else if (theme === 'cyber') {
    createClick(600, 0.22);
    createSound(200, 0.06, 'square', 0.24);
  } else {
    createClick(500, 0.18);
    createSound(150, 0.07, 'square', 0.18);
    // Add subtle harmonic
    setTimeout(() => createSound(300, 0.05, 'sine', 0.1), 20);
  }
};

const playBonusSound = () => {
  // EPIC BONUS ROUND - Cinematic fanfare
  createClick(800, 0.3);
  createChord([261.63, 329.63, 392.00, 523.25], 0.6, 'sine', 0.45, true);
  setTimeout(() => {
    createClick(900, 0.35);
    createChord([329.63, 415.30, 493.88, 659.25], 0.6, 'sine', 0.45, true);
  }, 350);
  setTimeout(() => {
    createClick(1000, 0.4);
    createChord([392.00, 493.88, 587.33, 783.99], 0.7, 'sine', 0.5, true);
  }, 700);
  // Triumphant ending
  setTimeout(() => {
    createChord([523.25, 659.25, 783.99, 1046.50], 0.5, 'sine', 0.55, true);
  }, 1100);
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
    if (isSpinning) return;
    if (bet > tokens) { setWinMsg('INSUFFICIENT FUNDS'); createClick(600, 0.12); setTimeout(() => setWinMsg(''), 2200); return; }
    if (bet < initialMinBet) { setWinMsg(`MINIMUM BET ${initialMinBet}`); createClick(400, 0.08); setTimeout(() => setWinMsg(''), 2200); return; }
    setIsSpinning(true);
    setWinMsg(''); 
    setMultiplier(0);
    setShowConfetti(false);
    setGlowEffect(false);
    setTokens(t => t - bet);
    playSpinSound('default');
    
    const results = [
      symbols[Math.floor(Math.random() * symbols.length)], 
      symbols[Math.floor(Math.random() * symbols.length)], 
      symbols[Math.floor(Math.random() * symbols.length)]
    ];
    
    [600, 1200, 2000].forEach((d, i) => {
      setTimeout(() => {
        setReels(prev => { 
          const n = [...prev]; 
          n[i] = results[i]; 
          return n; 
        });
        playReelStopSound('default');
        if (i === 2) {
          setTimeout(() => finalize(results), 150);
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
      playWinSound(mult, 'default');
      
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
      className={`flex flex-col items-center gap-10 p-12 bg-gradient-to-br from-cyan-900/30 via-blue-900/30 via-purple-900/30 to-pink-900/30 rounded-[4rem] border-2 border-white/10 relative shadow-[0_0_200px_rgba(0,0,0,0.8)] overflow-visible ${
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
              initial={isSpinning ? { y: -800, rotate: 0 } : { y: 0, scale: 1 }}
              animate={isSpinning ? {
                y: [0, 800],
                rotate: [0, 720],
                scale: [1, 1.1, 1]
              } : {
                y: 0,
                scale: [1, 1.3, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={isSpinning ? {
                duration: 0.06,
                repeat: Infinity,
                ease: "linear"
              } : {
                duration: 0.5,
                ease: "backOut"
              }}
              className={`text-7xl md:text-9xl ${
                isSpinning 
                  ? 'opacity-40' 
                  : 'drop-shadow-[0_0_30px_rgba(255,255,255,0.5)] filter brightness-110'
              }`}
              style={{
                filter: isSpinning ? 'blur(8px) brightness(1.5)' : 'none',
                textShadow: isSpinning ? 'none' : '0 0 20px currentColor, 0 0 40px currentColor',
                willChange: isSpinning ? 'transform' : 'auto',
                transform: isSpinning ? 'translateZ(0)' : 'none'
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
      {/** precompute error state to avoid complex inline expressions that confused the parser */}
      {(() => {
        const winIsError = winMsg && (winMsg.includes('INSUFFICIENT') || winMsg.startsWith('MINIMUM'));
        const winClass = winIsError ? 'bg-red-600 text-white shadow-[0_0_30px_rgba(239,68,68,0.5)]' : 'bg-gradient-to-r from-yellow-400 via-pink-400 to-cyan-400 text-black shadow-[0_0_50px_rgba(255,215,0,0.8)]';
        return (
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
                className={`absolute -top-16 z-50 px-16 py-6 rounded-full font-black text-3xl md:text-4xl border-4 border-white/50 ${winClass}`}
                style={{
                  textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                  animation: 'pulse 0.7s infinite'
                }}
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.35, repeat: Infinity }}
                >
                  {winMsg}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        );
      })()}
    </div>
  );
};

// ========== THEMED SLOT MACHINES WITH BONUS ROUNDS ==========

// Ocean Depths Slot - Underwater theme with bubbles
const OceanSlotMachine = ({ symbols, tokens, setTokens, minBet: initialMinBet }) => {
  const [reels, setReels] = useState([symbols[0], symbols[1], symbols[2]]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winMsg, setWinMsg] = useState('');
  const [bet, setBet] = useState(initialMinBet);
  const [multiplier, setMultiplier] = useState(0);
  const [inBonus, setInBonus] = useState(false);
  const [bonusSpins, setBonusSpins] = useState(0);
  const [bubbles, setBubbles] = useState([]);
  const containerRef = useRef(null);

  const createBubble = () => {
    const newBubbles = [];
    for (let i = 0; i < 30; i++) {
      newBubbles.push({
        id: Date.now() + i,
        x: Math.random() * 100,
        size: Math.random() * 20 + 10,
        delay: Math.random() * 2
      });
    }
    setBubbles(prev => [...prev, ...newBubbles]);
    setTimeout(() => setBubbles([]), 3000);
  };

  const spin = () => {
    if (isSpinning) return;
    if (bet > tokens) { setWinMsg('INSUFFICIENT FUNDS'); createClick(600, 0.12); setTimeout(() => setWinMsg(''), 2200); return; }
    if (bet < initialMinBet) { setWinMsg(`MINIMUM BET ${initialMinBet}`); createClick(400, 0.08); setTimeout(() => setWinMsg(''), 2200); return; }
    setIsSpinning(true);
    setWinMsg('');
    setMultiplier(0);
    setTokens(t => t - bet);
    playSpinSound('ocean');
    createBubble();

    const results = [
      symbols[Math.floor(Math.random() * symbols.length)],
      symbols[Math.floor(Math.random() * symbols.length)],
      symbols[Math.floor(Math.random() * symbols.length)]
    ];

    [600, 1200, 2000].forEach((d, i) => {
      setTimeout(() => {
        setReels(prev => { const n = [...prev]; n[i] = results[i]; return n; });
        playReelStopSound('ocean');
        if (i === 2) setTimeout(() => finalize(results), 200);
      }, d);
    });
  };

  const finalize = (res) => {
    setIsSpinning(false);
    let mult = 0;
    let message = '';
    let triggerBonus = false;

    if (res[0] === res[1] && res[1] === res[2]) {
      if (res[0] === '🐚' || res[0] === '💎') {
        mult = 150;
        message = `🌊 TREASURE FOUND! 🌊 +${(bet * mult).toLocaleString()}`;
      } else if (res[0] === '🐙' || res[0] === '🌟') {
        mult = 100;
        message = `🐙 DEEP SEA WIN! 🐙 +${(bet * mult).toLocaleString()}`;
        triggerBonus = Math.random() < 0.3;
      } else {
        mult = 60;
        message = `🌊 TRIPLE MATCH! 🌊 +${(bet * mult).toLocaleString()}`;
      }
      setTokens(t => t + bet * mult);
    } else if (res[0] === res[1] || res[1] === res[2] || res[0] === res[2]) {
      mult = 4;
      message = `✨ DOUBLE WIN! ✨ +${(bet * mult).toLocaleString()}`;
      setTokens(t => t + bet * mult);
    }

    if (mult > 0) {
      setMultiplier(mult);
      setWinMsg(message);
      playWinSound(mult, 'ocean');
      createBubble();
    }

    if (triggerBonus) {
      setTimeout(() => startBonusRound(), 1500);
    }
  };

  const startBonusRound = () => {
    playBonusSound();
    setInBonus(true);
    setBonusSpins(5);
    setWinMsg('🎁 BONUS ROUND ACTIVATED! 🎁');
  };

  const bonusSpin = () => {
    if (bonusSpins <= 0) {
      setInBonus(false);
      return;
    }
    setIsSpinning(true);
    setWinMsg('');
    setBonusSpins(prev => prev - 1);
    playSpinSound('ocean');
    createBubble();

    const results = [
      symbols[Math.floor(Math.random() * symbols.length)],
      symbols[Math.floor(Math.random() * symbols.length)],
      symbols[Math.floor(Math.random() * symbols.length)]
    ];

    [600, 1200, 2000].forEach((d, i) => {
      setTimeout(() => {
        setReels(prev => { const n = [...prev]; n[i] = results[i]; return n; });
        playReelStopSound('ocean');
        if (i === 2) {
          setTimeout(() => {
            setIsSpinning(false);
            const bonusMult = 10;
            setTokens(t => t + bet * bonusMult);
            setWinMsg(`🎁 BONUS WIN! +${(bet * bonusMult).toLocaleString()} (${bonusSpins - 1} spins left)`);
            playWinSound(bonusMult, 'ocean');
            createBubble();
          }, 300);
        }
      }, d);
    });
  };

  return (
    <div ref={containerRef} className="flex flex-col items-center gap-10 p-12 bg-gradient-to-br from-blue-900/40 via-cyan-900/40 to-teal-900/40 rounded-[4rem] border-2 border-cyan-500/20 relative shadow-[0_0_200px_rgba(0,150,255,0.4)] overflow-hidden">
      {/* Animated bubbles */}
      <AnimatePresence>
        {bubbles.map(bubble => (
          <motion.div
            key={bubble.id}
            initial={{ y: '100%', x: `${bubble.x}%`, opacity: 0.6, scale: 0 }}
            animate={{ y: '-20%', opacity: [0.6, 1, 0], scale: [0, 1, 1.2] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 3, delay: bubble.delay, ease: "easeOut" }}
            className="absolute rounded-full border-2 border-cyan-400/50"
            style={{
              width: bubble.size,
              height: bubble.size,
              background: 'radial-gradient(circle, rgba(0,255,255,0.3), rgba(0,150,255,0.1))',
              boxShadow: '0 0 20px rgba(0,255,255,0.5)'
            }}
          />
        ))}
      </AnimatePresence>

      {/* Wave effect background */}
      <motion.div
        animate={{ x: [0, 100, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,255,255,0.1) 10px, rgba(0,255,255,0.1) 20px)'
        }}
      />

      <div className="relative flex gap-4 md:gap-8 bg-black/50 p-6 rounded-[2.5rem] border-2 border-cyan-400/30 backdrop-blur-xl">
        {reels.map((symbol, i) => (
          <motion.div
            key={`${symbol}-${i}-${isSpinning}`}
            className="relative w-32 h-52 md:w-40 md:h-64 bg-gradient-to-b from-blue-900 via-cyan-900 to-teal-900 rounded-[2rem] overflow-hidden border-2 border-cyan-400/40 flex items-center justify-center"
            animate={isSpinning ? {
              scale: [1, 1.05, 1],
              boxShadow: [
                '0 0 20px rgba(0,255,255,0.4)',
                '0 0 40px rgba(0,255,255,0.8)',
                '0 0 20px rgba(0,255,255,0.4)'
              ]
            } : {}}
            transition={{ duration: 0.15, repeat: isSpinning ? Infinity : 0 }}
          >
            <motion.div
              key={isSpinning ? `spin-${i}` : `stop-${i}`}
              initial={isSpinning ? { y: -600 } : { y: 0 }}
              animate={isSpinning ? { y: [0, 600], rotate: [0, 180] } : { y: 0, scale: [1, 1.2, 1] }}
              transition={isSpinning ? { duration: 0.08, repeat: Infinity, ease: "linear" } : { duration: 0.35 }}
              className={`text-7xl md:text-9xl ${isSpinning ? 'blur-sm opacity-40' : 'drop-shadow-[0_0_30px_rgba(0,255,255,0.6)]'}`}
            >
              {isSpinning ? symbols[Math.floor(Math.random() * symbols.length)] : symbol}
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-b from-blue-900/50 via-transparent to-teal-900/50 pointer-events-none" />
          </motion.div>
        ))}
      </div>

      {multiplier > 0 && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: [0, 1.5, 1], rotate: 0 }}
          className="absolute top-20 text-8xl font-black text-cyan-400"
          style={{ textShadow: '0 0 40px rgba(0,255,255,0.8)' }}
        >
          {multiplier}x
        </motion.div>
      )}

      {inBonus && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 0.35, repeat: Infinity }}
          className="absolute top-4 bg-gradient-to-r from-cyan-400 to-teal-400 text-black px-8 py-4 rounded-full font-black text-2xl shadow-[0_0_30px_rgba(0,255,255,0.8)]"
        >
          🎁 BONUS: {bonusSpins} SPINS 🎁
        </motion.div>
      )}

      <BetSelector currentBet={bet} setBet={setBet} minBet={initialMinBet} maxTokens={tokens} disabled={isSpinning} />
      
      <button
        onClick={inBonus ? bonusSpin : spin}
        disabled={isSpinning}
        className="group relative w-full h-32 rounded-[2.5rem] overflow-hidden shadow-2xl active:scale-95 transition-all"
      >
        <motion.div
          animate={isSpinning ? {
            background: [
              'linear-gradient(90deg, #00ffff, #0080ff, #00ffff)',
              'linear-gradient(90deg, #0080ff, #00ffff, #0080ff)'
            ]
          } : {}}
          transition={{ duration: 0.3, repeat: isSpinning ? Infinity : 0 }}
          className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-400 to-teal-400 group-hover:from-cyan-300 group-hover:via-blue-300 group-hover:to-teal-300"
        />
        <span className="relative z-10 text-black font-black text-5xl italic uppercase tracking-[0.3em]">
          {inBonus ? '🌊 BONUS SPIN 🌊' : isSpinning ? '🌊 SPINNING... 🌊' : '🌊 DIVE IN 🌊'}
        </span>
      </button>

      <AnimatePresence>
        {winMsg && (
          <motion.div
            initial={{ scale: 0, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className={`absolute -top-16 z-50 px-16 py-6 rounded-full font-black text-3xl border-4 border-white/50 ${winMsg && (winMsg.includes('INSUFFICIENT') || winMsg.startsWith('MINIMUM')) ? 'bg-red-600 text-white shadow-[0_0_30px_rgba(239,68,68,0.5)]' : 'bg-gradient-to-r from-cyan-400 to-teal-400 text-black shadow-[0_0_50px_rgba(0,255,255,0.8)]'}` }
          >
            {winMsg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Cosmic Void Slot - Space theme with stars and nebulas
const CosmicSlotMachine = ({ symbols, tokens, setTokens, minBet: initialMinBet }) => {
  const [reels, setReels] = useState([symbols[0], symbols[1], symbols[2]]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winMsg, setWinMsg] = useState('');
  const [bet, setBet] = useState(initialMinBet);
  const [multiplier, setMultiplier] = useState(0);
  const [inBonus, setInBonus] = useState(false);
  const [bonusSpins, setBonusSpins] = useState(0);
  const [stars, setStars] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    const newStars = [];
    for (let i = 0; i < 50; i++) {
      newStars.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        delay: Math.random() * 5
      });
    }
    setStars(newStars);
  }, []);

  const createStarBurst = () => {
    const bursts = [];
    for (let i = 0; i < 40; i++) {
      bursts.push({
        id: Date.now() + i,
        x: 50 + (Math.random() - 0.5) * 30,
        y: 50 + (Math.random() - 0.5) * 30,
        angle: (Math.PI * 2 * i) / 40,
        distance: Math.random() * 200 + 100
      });
    }
    return bursts;
  };

  const spin = () => {
    if (isSpinning) return;
    if (bet > tokens) { setWinMsg('INSUFFICIENT FUNDS'); createClick(600, 0.12); setTimeout(() => setWinMsg(''), 2200); return; }
    if (bet < initialMinBet) { setWinMsg(`MINIMUM BET ${initialMinBet}`); createClick(400, 0.08); setTimeout(() => setWinMsg(''), 2200); return; }
    setIsSpinning(true);
    setWinMsg('');
    setMultiplier(0);
    setTokens(t => t - bet);
    playSpinSound('cosmic');

    const results = [
      symbols[Math.floor(Math.random() * symbols.length)],
      symbols[Math.floor(Math.random() * symbols.length)],
      symbols[Math.floor(Math.random() * symbols.length)]
    ];

    [600, 1200, 2000].forEach((d, i) => {
      setTimeout(() => {
        setReels(prev => { const n = [...prev]; n[i] = results[i]; return n; });
        playReelStopSound('default');
        if (i === 2) setTimeout(() => finalize(results), 150);
      }, d);
    });
  };

  const finalize = (res) => {
    setIsSpinning(false);
    let mult = 0;
    let message = '';
    let triggerBonus = false;

    if (res[0] === res[1] && res[1] === res[2]) {
      if (res[0] === '⭐' || res[0] === '🌌') {
        mult = 200;
        message = `⭐ COSMIC JACKPOT! ⭐ +${(bet * mult).toLocaleString()}`;
        triggerBonus = Math.random() < 0.25;
      } else if (res[0] === '🚀' || res[0] === '💫') {
        mult = 120;
        message = `🚀 GALACTIC WIN! 🚀 +${(bet * mult).toLocaleString()}`;
      } else {
        mult = 70;
        message = `✨ TRIPLE MATCH! ✨ +${(bet * mult).toLocaleString()}`;
      }
      setTokens(t => t + bet * mult);
    } else if (res[0] === res[1] || res[1] === res[2] || res[0] === res[2]) {
      mult = 5;
      message = `🌟 DOUBLE WIN! 🌟 +${(bet * mult).toLocaleString()}`;
      setTokens(t => t + bet * mult);
    }

    if (mult > 0) {
      setMultiplier(mult);
      setWinMsg(message);
      playWinSound(mult, 'cosmic');
    }

    if (triggerBonus) {
      setTimeout(() => startBonusRound(), 1500);
    }
  };

  const startBonusRound = () => {
    playBonusSound();
    setInBonus(true);
    setBonusSpins(7);
    setWinMsg('🌌 BONUS ROUND: FREE SPINS! 🌌');
  };

  const bonusSpin = () => {
    if (bonusSpins <= 0) {
      setInBonus(false);
      return;
    }
    setIsSpinning(true);
    setWinMsg('');
    setBonusSpins(prev => prev - 1);
    playSpinSound('cosmic');

    const results = [
      symbols[Math.floor(Math.random() * symbols.length)],
      symbols[Math.floor(Math.random() * symbols.length)],
      symbols[Math.floor(Math.random() * symbols.length)]
    ];

    [600, 1200, 2000].forEach((d, i) => {
      setTimeout(() => {
        setReels(prev => { const n = [...prev]; n[i] = results[i]; return n; });
        playReelStopSound('default');
        if (i === 2) {
          setTimeout(() => {
            setIsSpinning(false);
            const bonusMult = 15;
            setTokens(t => t + bet * bonusMult);
            setWinMsg(`🌌 BONUS WIN! +${(bet * bonusMult).toLocaleString()} (${bonusSpins - 1} left)`);
            playWinSound(bonusMult, 'cosmic');
          }, 150);
        }
      }, d);
    });
  };

  return (
    <div ref={containerRef} className="flex flex-col items-center gap-10 p-12 bg-gradient-to-br from-purple-900/40 via-indigo-900/40 to-black/60 rounded-[4rem] border-2 border-purple-500/20 relative shadow-[0_0_200px_rgba(138,43,226,0.5)] overflow-hidden">
      {/* Animated stars */}
      {stars.map(star => (
        <motion.div
          key={star.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 3, delay: star.delay, repeat: Infinity }}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            boxShadow: '0 0 10px rgba(255,255,255,0.8)'
          }}
        />
      ))}

      {/* Nebula effect */}
      <motion.div
        animate={{ 
          backgroundPosition: ['0% 0%', '100% 100%'],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 30% 50%, rgba(138,43,226,0.4), transparent 50%), radial-gradient(ellipse at 70% 50%, rgba(75,0,130,0.4), transparent 50%)',
          backgroundSize: '200% 200%'
        }}
      />

      <div className="relative flex gap-4 md:gap-8 bg-black/60 p-6 rounded-[2.5rem] border-2 border-purple-400/30 backdrop-blur-xl">
        {reels.map((symbol, i) => (
          <motion.div
            key={`${symbol}-${i}-${isSpinning}`}
            className="relative w-32 h-52 md:w-40 md:h-64 bg-gradient-to-b from-purple-900 via-indigo-900 to-black rounded-[2rem] overflow-hidden border-2 border-purple-400/40 flex items-center justify-center"
            animate={isSpinning ? {
              scale: [1, 1.08, 1],
              boxShadow: [
                '0 0 30px rgba(138,43,226,0.5)',
                '0 0 60px rgba(138,43,226,0.9)',
                '0 0 30px rgba(138,43,226,0.5)'
              ]
            } : {}}
            transition={{ duration: 0.12, repeat: isSpinning ? Infinity : 0 }}
          >
            <motion.div
              key={isSpinning ? `spin-${i}` : `stop-${i}`}
              initial={isSpinning ? { y: -600, rotate: 0 } : { y: 0 }}
              animate={isSpinning ? { y: [0, 600], rotate: [0, 360] } : { y: 0, scale: [1, 1.3, 1] }}
              transition={isSpinning ? { duration: 0.08, repeat: Infinity, ease: "linear" } : { duration: 0.35 }}
              className={`text-7xl md:text-9xl ${isSpinning ? 'blur-md opacity-30' : 'drop-shadow-[0_0_40px_rgba(138,43,226,0.8)]'}`}
              style={{
                filter: isSpinning ? 'none' : 'brightness(1.2)',
                textShadow: isSpinning ? 'none' : '0 0 30px currentColor, 0 0 60px currentColor'
              }}
            >
              {isSpinning ? symbols[Math.floor(Math.random() * symbols.length)] : symbol}
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-b from-purple-900/40 via-transparent to-black/60 pointer-events-none" />
          </motion.div>
        ))}
      </div>

      {multiplier > 0 && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: [0, 1.5, 1], rotate: 0 }}
          className="absolute top-20 text-8xl font-black text-purple-400"
          style={{ textShadow: '0 0 50px rgba(138,43,226,0.9)' }}
        >
          {multiplier}x
        </motion.div>
      )}

      {inBonus && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 0.35, repeat: Infinity }}
          className="absolute top-4 bg-gradient-to-r from-purple-400 to-pink-400 text-black px-8 py-4 rounded-full font-black text-2xl shadow-[0_0_40px_rgba(138,43,226,0.9)]"
        >
          🌌 BONUS: {bonusSpins} FREE SPINS 🌌
        </motion.div>
      )}

      <BetSelector currentBet={bet} setBet={setBet} minBet={initialMinBet} maxTokens={tokens} disabled={isSpinning} />
      
      <button
        onClick={inBonus ? bonusSpin : spin}
        disabled={isSpinning}
        className="group relative w-full h-32 rounded-[2.5rem] overflow-hidden shadow-2xl active:scale-95 transition-all"
      >
        <motion.div
          animate={isSpinning ? {
            background: [
              'linear-gradient(90deg, #8a2be2, #ff00ff, #8a2be2)',
              'linear-gradient(90deg, #ff00ff, #8a2be2, #ff00ff)'
            ]
          } : {}}
          transition={{ duration: 0.3, repeat: isSpinning ? Infinity : 0 }}
          className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 group-hover:from-purple-300 group-hover:via-pink-300 group-hover:to-indigo-300"
        />
        <span className="relative z-10 text-black font-black text-5xl italic uppercase tracking-[0.3em]">
          {inBonus ? '🌌 BONUS SPIN 🌌' : isSpinning ? '🌌 SPINNING... 🌌' : '🌌 LAUNCH 🌌'}
        </span>
      </button>

      <AnimatePresence>
        {winMsg && (
          <motion.div
            initial={{ scale: 0, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className={`absolute -top-16 z-50 px-16 py-6 rounded-full font-black text-3xl ${winMsg && (winMsg.includes('INSUFFICIENT') || winMsg.startsWith('MINIMUM')) ? 'bg-red-600 text-white shadow-[0_0_30px_rgba(239,68,68,0.5)]' : 'bg-gradient-to-r from-purple-400 to-pink-400 text-black shadow-[0_0_60px_rgba(138,43,226,0.9)] border-4 border-white/50'}` }
          >
            {winMsg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Pharaoh's Fortune Slot - Egyptian theme
const PharaohSlotMachine = ({ symbols, tokens, setTokens, minBet: initialMinBet }) => {
  const [reels, setReels] = useState([symbols[0], symbols[1], symbols[2]]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winMsg, setWinMsg] = useState('');
  const [bet, setBet] = useState(initialMinBet);
  const [multiplier, setMultiplier] = useState(0);
  const [inBonus, setInBonus] = useState(false);
  const [bonusSpins, setBonusSpins] = useState(0);
  const [sandParticles, setSandParticles] = useState([]);
  const containerRef = useRef(null);

  const createSandStorm = () => {
    const particles = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        id: Date.now() + i,
        x: Math.random() * 100,
        y: -10,
        size: Math.random() * 4 + 2,
        speed: Math.random() * 3 + 2
      });
    }
    setSandParticles(particles);
    setTimeout(() => setSandParticles([]), 2000);
  };

  const spin = () => {
    if (isSpinning) return;
    if (bet > tokens) { setWinMsg('INSUFFICIENT FUNDS'); createClick(600, 0.12); setTimeout(() => setWinMsg(''), 2200); return; }
    if (bet < initialMinBet) { setWinMsg(`MINIMUM BET ${initialMinBet}`); createClick(400, 0.08); setTimeout(() => setWinMsg(''), 2200); return; }
    setIsSpinning(true);
    setWinMsg('');
    setMultiplier(0);
    setTokens(t => t - bet);
    playSpinSound('egyptian');
    createSandStorm();

    const results = [
      symbols[Math.floor(Math.random() * symbols.length)],
      symbols[Math.floor(Math.random() * symbols.length)],
      symbols[Math.floor(Math.random() * symbols.length)]
    ];

    [600, 1200, 2000].forEach((d, i) => {
      setTimeout(() => {
        setReels(prev => { const n = [...prev]; n[i] = results[i]; return n; });
        playReelStopSound('default');
        if (i === 2) setTimeout(() => finalize(results), 150);
      }, d);
    });
  };

  const finalize = (res) => {
    setIsSpinning(false);
    let mult = 0;
    let message = '';
    let triggerBonus = false;

    if (res[0] === res[1] && res[1] === res[2]) {
      if (res[0] === '👑' || res[0] === '💎') {
        mult = 180;
        message = `👑 PHARAOH'S TREASURE! 👑 +${(bet * mult).toLocaleString()}`;
        triggerBonus = Math.random() < 0.3;
      } else if (res[0] === '⚱️' || res[0] === '🏺') {
        mult = 110;
        message = `⚱️ ANCIENT RICHES! ⚱️ +${(bet * mult).toLocaleString()}`;
      } else {
        mult = 65;
        message = `🏛️ TRIPLE MATCH! 🏛️ +${(bet * mult).toLocaleString()}`;
      }
      setTokens(t => t + bet * mult);
    } else if (res[0] === res[1] || res[1] === res[2] || res[0] === res[2]) {
      mult = 4;
      message = `✨ DOUBLE WIN! ✨ +${(bet * mult).toLocaleString()}`;
      setTokens(t => t + bet * mult);
    }

    if (mult > 0) {
      setMultiplier(mult);
      setWinMsg(message);
      playWinSound(mult, 'egyptian');
      createSandStorm();
    }

    if (triggerBonus) {
      setTimeout(() => startBonusRound(), 1500);
    }
  };

  const startBonusRound = () => {
    playBonusSound();
    setInBonus(true);
    setBonusSpins(6);
    setWinMsg('🏺 BONUS ROUND: PHARAOH BLESSING! 🏺');
  };

  const bonusSpin = () => {
    if (bonusSpins <= 0) {
      setInBonus(false);
      return;
    }
    setIsSpinning(true);
    setWinMsg('');
    setBonusSpins(prev => prev - 1);
    playSpinSound('egyptian');
    createSandStorm();

    const results = [
      symbols[Math.floor(Math.random() * symbols.length)],
      symbols[Math.floor(Math.random() * symbols.length)],
      symbols[Math.floor(Math.random() * symbols.length)]
    ];

    [600, 1200, 2000].forEach((d, i) => {
      setTimeout(() => {
        setReels(prev => { const n = [...prev]; n[i] = results[i]; return n; });
        playReelStopSound('default');
        if (i === 2) {
          setTimeout(() => {
            setIsSpinning(false);
            const bonusMult = 12;
            setTokens(t => t + bet * bonusMult);
            setWinMsg(`🏺 BONUS WIN! +${(bet * bonusMult).toLocaleString()} (${bonusSpins - 1} left)`);
            playWinSound(bonusMult, 'egyptian');
          }, 300);
        }
      }, d);
    });
  };

  return (
    <div ref={containerRef} className="flex flex-col items-center gap-10 p-12 bg-gradient-to-br from-amber-900/40 via-yellow-800/40 to-orange-900/40 rounded-[4rem] border-2 border-yellow-500/20 relative shadow-[0_0_200px_rgba(255,215,0,0.4)] overflow-visible">
      {/* Sand particles */}
      <AnimatePresence>
        {sandParticles.map(particle => (
          <motion.div
            key={particle.id}
            initial={{ y: particle.y + '%', x: `${particle.x}%`, opacity: 0.7 }}
            animate={{ y: '110%', x: `${particle.x + (Math.random() - 0.5) * 20}%`, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: particle.speed, ease: "linear" }}
            className="absolute rounded-full bg-yellow-600/60"
            style={{ width: particle.size, height: particle.size }}
          />
        ))}
      </AnimatePresence>

      {/* Pyramid gradient effect */}
      <motion.div
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, transparent 0%, rgba(255,215,0,0.1) 50%, transparent 100%)',
          clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
        }}
      />

      <div className="relative flex gap-4 md:gap-8 bg-black/60 p-6 rounded-[2.5rem] border-2 border-yellow-500/30 backdrop-blur-xl">
        {reels.map((symbol, i) => (
          <motion.div
            key={`${symbol}-${i}-${isSpinning}`}
            className="relative w-32 h-52 md:w-40 md:h-64 bg-gradient-to-b from-amber-900 via-yellow-800 to-orange-900 rounded-[2rem] overflow-hidden border-2 border-yellow-500/40 flex items-center justify-center"
            animate={isSpinning ? {
              scale: [1, 1.1, 1],
              boxShadow: [
                '0 0 25px rgba(255,215,0,0.5)',
                '0 0 50px rgba(255,215,0,0.9)',
                '0 0 25px rgba(255,215,0,0.5)'
              ]
            } : {}}
            transition={{ duration: 0.1, repeat: isSpinning ? Infinity : 0 }}
          >
            <motion.div
              key={isSpinning ? `spin-${i}` : `stop-${i}`}
              initial={isSpinning ? { y: -600 } : { y: 0 }}
              animate={isSpinning ? { y: [0, 600], rotate: [0, -180] } : { y: 0, scale: [1, 1.25, 1] }}
              transition={isSpinning ? { duration: 0.08, repeat: Infinity, ease: "linear" } : { duration: 0.35 }}
              className={`text-7xl md:text-9xl ${isSpinning ? 'blur-sm opacity-40' : 'drop-shadow-[0_0_35px_rgba(255,215,0,0.7)]'}`}
            >
              {isSpinning ? symbols[Math.floor(Math.random() * symbols.length)] : symbol}
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-b from-amber-900/50 via-transparent to-orange-900/50 pointer-events-none" />
          </motion.div>
        ))}
      </div>

      {multiplier > 0 && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: [0, 1.5, 1], rotate: 0 }}
          className="absolute top-20 text-8xl font-black text-yellow-400"
          style={{ textShadow: '0 0 40px rgba(255,215,0,0.9)' }}
        >
          {multiplier}x
        </motion.div>
      )}

      {inBonus && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 0.35, repeat: Infinity }}
          className="absolute top-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-8 py-4 rounded-full font-black text-2xl shadow-[0_0_40px_rgba(255,215,0,0.9)]"
        >
          🏺 BONUS: {bonusSpins} SPINS 🏺
        </motion.div>
      )}

      <BetSelector currentBet={bet} setBet={setBet} minBet={initialMinBet} maxTokens={tokens} disabled={isSpinning} />
      
      <button
        onClick={inBonus ? bonusSpin : spin}
        disabled={isSpinning}
        className="group relative w-full h-32 rounded-[2.5rem] overflow-hidden shadow-2xl active:scale-95 transition-all"
      >
        <motion.div
          animate={isSpinning ? {
            background: [
              'linear-gradient(90deg, #ffd700, #ff8c00, #ffd700)',
              'linear-gradient(90deg, #ff8c00, #ffd700, #ff8c00)'
            ]
          } : {}}
          transition={{ duration: 0.3, repeat: isSpinning ? Infinity : 0 }}
          className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-400 to-amber-400 group-hover:from-yellow-300 group-hover:via-orange-300 group-hover:to-amber-300"
        />
        <span className="relative z-10 text-black font-black text-5xl italic uppercase tracking-[0.3em]">
          {inBonus ? '🏺 BONUS SPIN 🏺' : isSpinning ? '🏛️ SPINNING... 🏛️' : '🏺 UNLOCK 🏺'}
        </span>
      </button>

      <AnimatePresence>
        {winMsg && (
          <motion.div
            initial={{ scale: 0, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className={`absolute -top-16 z-50 px-16 py-6 rounded-full font-black text-3xl ${winMsg && (winMsg.includes('INSUFFICIENT') || winMsg.startsWith('MINIMUM')) ? 'bg-red-600 text-white shadow-[0_0_30px_rgba(239,68,68,0.5)]' : 'bg-gradient-to-r from-yellow-400 to-orange-400 text-black shadow-[0_0_50px_rgba(255,215,0,0.9)] border-4 border-white/50'}` }
          >
            {winMsg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Neon Cyber Slot - Cyberpunk theme
const CyberSlotMachine = ({ symbols, tokens, setTokens, minBet: initialMinBet }) => {
  const [reels, setReels] = useState([symbols[0], symbols[1], symbols[2]]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winMsg, setWinMsg] = useState('');
  const [bet, setBet] = useState(initialMinBet);
  const [multiplier, setMultiplier] = useState(0);
  const [inBonus, setInBonus] = useState(false);
  const [bonusSpins, setBonusSpins] = useState(0);
  const [glitchLines, setGlitchLines] = useState([]);
  const containerRef = useRef(null);

  const createGlitch = () => {
    const lines = [];
    for (let i = 0; i < 10; i++) {
      lines.push({
        id: Date.now() + i,
        y: Math.random() * 100,
        height: Math.random() * 5 + 2,
        delay: Math.random() * 0.3
      });
    }
    setGlitchLines(lines);
    setTimeout(() => setGlitchLines([]), 300);
  };

  const spin = () => {
    if (isSpinning) return;
    if (bet > tokens) { setWinMsg('INSUFFICIENT FUNDS'); createClick(600, 0.12); setTimeout(() => setWinMsg(''), 2200); return; }
    if (bet < initialMinBet) { setWinMsg(`MINIMUM BET ${initialMinBet}`); createClick(400, 0.08); setTimeout(() => setWinMsg(''), 2200); return; }
    setIsSpinning(true);
    setWinMsg('');
    setMultiplier(0);
    setTokens(t => t - bet);
    playSpinSound('cyber');
    createGlitch();

    const results = [
      symbols[Math.floor(Math.random() * symbols.length)],
      symbols[Math.floor(Math.random() * symbols.length)],
      symbols[Math.floor(Math.random() * symbols.length)]
    ];

    [600, 1200, 2000].forEach((d, i) => {
      setTimeout(() => {
        setReels(prev => { const n = [...prev]; n[i] = results[i]; return n; });
        playReelStopSound('cyber');
        createGlitch();
        if (i === 2) setTimeout(() => finalize(results), 150);
      }, d);
    });
  };

  const finalize = (res) => {
    setIsSpinning(false);
    let mult = 0;
    let message = '';
    let triggerBonus = false;

    if (res[0] === res[1] && res[1] === res[2]) {
      if (res[0] === '💎' || res[0] === '⚡') {
        mult = 190;
        message = `⚡ CYBER JACKPOT! ⚡ +${(bet * mult).toLocaleString()}`;
        triggerBonus = Math.random() < 0.35;
      } else if (res[0] === '🎮' || res[0] === '🔮') {
        mult = 115;
        message = `🎮 NEON WIN! 🎮 +${(bet * mult).toLocaleString()}`;
      } else {
        mult = 68;
        message = `💜 TRIPLE MATCH! 💜 +${(bet * mult).toLocaleString()}`;
      }
      setTokens(t => t + bet * mult);
    } else if (res[0] === res[1] || res[1] === res[2] || res[0] === res[2]) {
      mult = 4;
      message = `✨ DOUBLE WIN! ✨ +${(bet * mult).toLocaleString()}`;
      setTokens(t => t + bet * mult);
    }

    if (mult > 0) {
      setMultiplier(mult);
      setWinMsg(message);
      playWinSound(mult, 'cyber');
      createGlitch();
    }

    if (triggerBonus) {
      setTimeout(() => startBonusRound(), 1500);
    }
  };

  const startBonusRound = () => {
    playBonusSound();
    setInBonus(true);
    setBonusSpins(8);
    setWinMsg('🔮 BONUS ROUND: HACK MODE! 🔮');
  };

  const bonusSpin = () => {
    if (bonusSpins <= 0) {
      setInBonus(false);
      return;
    }
    setIsSpinning(true);
    setWinMsg('');
    setBonusSpins(prev => prev - 1);
    playSpinSound('cyber');
    createGlitch();

    const results = [
      symbols[Math.floor(Math.random() * symbols.length)],
      symbols[Math.floor(Math.random() * symbols.length)],
      symbols[Math.floor(Math.random() * symbols.length)]
    ];

    [600, 1200, 2000].forEach((d, i) => {
      setTimeout(() => {
        setReels(prev => { const n = [...prev]; n[i] = results[i]; return n; });
        createGlitch();
        if (i === 2) {
          setTimeout(() => {
            setIsSpinning(false);
            const bonusMult = 18;
            setTokens(t => t + bet * bonusMult);
            setWinMsg(`🔮 BONUS WIN! +${(bet * bonusMult).toLocaleString()} (${bonusSpins - 1} left)`);
            playWinSound(bonusMult, 'cyber');
          }, 300);
        }
      }, d);
    });
  };

  return (
    <div ref={containerRef} className="flex flex-col items-center gap-10 p-12 bg-gradient-to-br from-fuchsia-900/40 via-purple-900/40 to-indigo-900/40 rounded-[4rem] border-2 border-fuchsia-500/20 relative shadow-[0_0_200px_rgba(255,0,255,0.5)] overflow-visible">
      {/* Glitch lines */}
      <AnimatePresence>
        {glitchLines.map(line => (
          <motion.div
            key={line.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: [0, 1, 0], x: [0, 20, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, delay: line.delay }}
            className="absolute w-full bg-fuchsia-400/30"
            style={{
              top: `${line.y}%`,
              height: line.height,
              boxShadow: '0 0 10px rgba(255,0,255,0.5)'
            }}
          />
        ))}
      </AnimatePresence>

      {/* Scan line effect */}
      <motion.div
        animate={{ y: ['0%', '100%'] }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, rgba(255,0,255,0.1) 50%, transparent 100%)',
          height: '2px'
        }}
      />

      <div className="relative flex gap-4 md:gap-8 bg-black/70 p-6 rounded-[2.5rem] border-2 border-fuchsia-400/30 backdrop-blur-xl">
        {reels.map((symbol, i) => (
          <motion.div
            key={`${symbol}-${i}-${isSpinning}`}
            className="relative w-32 h-52 md:w-40 md:h-64 bg-gradient-to-b from-fuchsia-900 via-purple-900 to-indigo-900 rounded-[2rem] overflow-hidden border-2 border-fuchsia-400/40 flex items-center justify-center"
            animate={isSpinning ? {
              scale: [1, 1.12, 1],
              boxShadow: [
                '0 0 30px rgba(255,0,255,0.6)',
                '0 0 70px rgba(255,0,255,1)',
                '0 0 30px rgba(255,0,255,0.6)'
              ],
              filter: ['brightness(1)', 'brightness(1.5)', 'brightness(1)']
            } : {}}
            transition={{ duration: 0.08, repeat: isSpinning ? Infinity : 0 }}
          >
            <motion.div
              key={isSpinning ? `spin-${i}` : `stop-${i}`}
              initial={isSpinning ? { y: -600, x: 0 } : { y: 0 }}
              animate={isSpinning ? { 
                y: [0, 600], 
                rotate: [0, 360],
                x: [0, Math.random() * 10 - 5, 0]
              } : { y: 0, scale: [1, 1.3, 1] }}
              transition={isSpinning ? { duration: 0.08, repeat: Infinity, ease: "linear" } : { duration: 0.35 }}
              className={`text-7xl md:text-9xl ${isSpinning ? 'blur-[2px] opacity-35' : 'drop-shadow-[0_0_50px_rgba(255,0,255,0.9)]'}`}
              style={{
                filter: isSpinning ? 'none' : 'brightness(1.3) contrast(1.2)',
                textShadow: isSpinning ? 'none' : '0 0 30px currentColor, 0 0 70px currentColor'
              }}
            >
              {isSpinning ? symbols[Math.floor(Math.random() * symbols.length)] : symbol}
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-b from-fuchsia-900/50 via-transparent to-indigo-900/50 pointer-events-none" />
          </motion.div>
        ))}
      </div>

      {multiplier > 0 && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: [0, 1.5, 1], rotate: 0 }}
          className="absolute top-20 text-8xl font-black text-fuchsia-400"
          style={{ textShadow: '0 0 50px rgba(255,0,255,1)' }}
        >
          {multiplier}x
        </motion.div>
      )}

      {inBonus && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 0.35, repeat: Infinity }}
          className="absolute top-4 bg-gradient-to-r from-fuchsia-400 to-purple-400 text-black px-8 py-4 rounded-full font-black text-2xl shadow-[0_0_50px_rgba(255,0,255,1)]"
        >
          🔮 BONUS: {bonusSpins} SPINS 🔮
        </motion.div>
      )}

      <BetSelector currentBet={bet} setBet={setBet} minBet={initialMinBet} maxTokens={tokens} disabled={isSpinning} />
      
      <button
        onClick={inBonus ? bonusSpin : spin}
        disabled={isSpinning}
        className="group relative w-full h-32 rounded-[2.5rem] overflow-hidden shadow-2xl active:scale-95 transition-all"
      >
        <motion.div
          animate={isSpinning ? {
            background: [
              'linear-gradient(90deg, #ff00ff, #00ffff, #ff00ff)',
              'linear-gradient(90deg, #00ffff, #ff00ff, #00ffff)'
            ]
          } : {}}
          transition={{ duration: 0.2, repeat: isSpinning ? Infinity : 0 }}
          className="absolute inset-0 bg-gradient-to-r from-fuchsia-400 via-purple-400 to-cyan-400 group-hover:from-fuchsia-300 group-hover:via-purple-300 group-hover:to-cyan-300"
        />
        <span className="relative z-10 text-black font-black text-5xl italic uppercase tracking-[0.3em]">
          {inBonus ? '🔮 BONUS SPIN 🔮' : isSpinning ? '⚡ SPINNING... ⚡' : '⚡ HACK ⚡'}
        </span>
      </button>

      <AnimatePresence>
        {winMsg && (
          <motion.div
            initial={{ scale: 0, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className={`absolute -top-8 px-16 py-6 rounded-full font-black text-3xl ${winMsg && (winMsg.includes('INSUFFICIENT') || winMsg.startsWith('MINIMUM')) ? 'bg-red-600 text-white shadow-[0_0_30px_rgba(239,68,68,0.5)]' : 'bg-gradient-to-r from-fuchsia-400 to-purple-400 text-black shadow-[0_0_60px_rgba(255,0,255,1)] border-4 border-white/50'}` }
          >
            {winMsg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Forest Magic Slot - Nature theme
const ForestSlotMachine = ({ symbols, tokens, setTokens, minBet: initialMinBet }) => {
  const [reels, setReels] = useState([symbols[0], symbols[1], symbols[2]]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winMsg, setWinMsg] = useState('');
  const [bet, setBet] = useState(initialMinBet);
  const [multiplier, setMultiplier] = useState(0);
  const [inBonus, setInBonus] = useState(false);
  const [bonusSpins, setBonusSpins] = useState(0);
  const [leaves, setLeaves] = useState([]);
  const containerRef = useRef(null);

  const createLeafFall = () => {
    const newLeaves = [];
    for (let i = 0; i < 40; i++) {
      newLeaves.push({
        id: Date.now() + i,
        x: Math.random() * 100,
        y: -10,
        size: Math.random() * 15 + 10,
        rotation: Math.random() * 360,
        delay: Math.random() * 0.5
      });
    }
    setLeaves(newLeaves);
    setTimeout(() => setLeaves([]), 3000);
  };

  const spin = () => {
    if (isSpinning) return;
    if (bet > tokens) { setWinMsg('INSUFFICIENT FUNDS'); createClick(600, 0.12); setTimeout(() => setWinMsg(''), 2200); return; }
    if (bet < initialMinBet) { setWinMsg(`MINIMUM BET ${initialMinBet}`); createClick(400, 0.08); setTimeout(() => setWinMsg(''), 2200); return; }
    setIsSpinning(true);
    setWinMsg('');
    setMultiplier(0);
    setTokens(t => t - bet);
    playSpinSound('forest');
    createLeafFall();

    const results = [
      symbols[Math.floor(Math.random() * symbols.length)],
      symbols[Math.floor(Math.random() * symbols.length)],
      symbols[Math.floor(Math.random() * symbols.length)]
    ];

    [600, 1200, 2000].forEach((d, i) => {
      setTimeout(() => {
        setReels(prev => { const n = [...prev]; n[i] = results[i]; return n; });
        playReelStopSound('default');
        if (i === 2) setTimeout(() => finalize(results), 150);
      }, d);
    });
  };

  const finalize = (res) => {
    setIsSpinning(false);
    let mult = 0;
    let message = '';
    let triggerBonus = false;

    if (res[0] === res[1] && res[1] === res[2]) {
      if (res[0] === '🍀' || res[0] === '🌿') {
        mult = 170;
        message = `🍀 NATURE'S BLESSING! 🍀 +${(bet * mult).toLocaleString()}`;
        triggerBonus = Math.random() < 0.28;
      } else if (res[0] === '🌸' || res[0] === '🌺') {
        mult = 105;
        message = `🌸 FLOWER POWER! 🌸 +${(bet * mult).toLocaleString()}`;
      } else {
        mult = 62;
        message = `🌳 TRIPLE MATCH! 🌳 +${(bet * mult).toLocaleString()}`;
      }
      setTokens(t => t + bet * mult);
    } else if (res[0] === res[1] || res[1] === res[2] || res[0] === res[2]) {
      mult = 4;
      message = `✨ DOUBLE WIN! ✨ +${(bet * mult).toLocaleString()}`;
      setTokens(t => t + bet * mult);
    }

    if (mult > 0) {
      setMultiplier(mult);
      setWinMsg(message);
      playWinSound(mult, 'forest');
      createLeafFall();
    }

    if (triggerBonus) {
      setTimeout(() => startBonusRound(), 1500);
    }
  };

  const startBonusRound = () => {
    playBonusSound();
    setInBonus(true);
    setBonusSpins(6);
    setWinMsg('🌿 BONUS ROUND: FOREST BLESSING! 🌿');
  };

  const bonusSpin = () => {
    if (bonusSpins <= 0) {
      setInBonus(false);
      return;
    }
    setIsSpinning(true);
    setWinMsg('');
    setBonusSpins(prev => prev - 1);
    playSpinSound('forest');
    createLeafFall();

    const results = [
      symbols[Math.floor(Math.random() * symbols.length)],
      symbols[Math.floor(Math.random() * symbols.length)],
      symbols[Math.floor(Math.random() * symbols.length)]
    ];

    [600, 1200, 2000].forEach((d, i) => {
      setTimeout(() => {
        setReels(prev => { const n = [...prev]; n[i] = results[i]; return n; });
        playReelStopSound('default');
        if (i === 2) {
          setTimeout(() => {
            setIsSpinning(false);
            const bonusMult = 14;
            setTokens(t => t + bet * bonusMult);
            setWinMsg(`🌿 BONUS WIN! +${(bet * bonusMult).toLocaleString()} (${bonusSpins - 1} left)`);
            playWinSound(bonusMult, 'forest');
          }, 300);
        }
      }, d);
    });
  };

  return (
    <div ref={containerRef} className="flex flex-col items-center gap-10 p-12 bg-gradient-to-br from-green-900/40 via-emerald-900/40 to-teal-900/40 rounded-[4rem] border-2 border-green-500/20 relative shadow-[0_0_200px_rgba(0,255,0,0.4)] overflow-visible">
      {/* Falling leaves */}
      <AnimatePresence>
        {leaves.map(leaf => (
          <motion.div
            key={leaf.id}
            initial={{ y: leaf.y + '%', x: `${leaf.x}%`, rotate: leaf.rotation, opacity: 0.8 }}
            animate={{ 
              y: '110%', 
              x: `${leaf.x + (Math.random() - 0.5) * 30}%`, 
              rotate: leaf.rotation + 360,
              opacity: 0
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 3, delay: leaf.delay, ease: "easeInOut" }}
            className="absolute text-2xl"
            style={{ filter: 'drop-shadow(0 0 5px rgba(0,255,0,0.5))' }}
          >
            🍃
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Sunlight rays */}
      <motion.div
        animate={{ 
          rotate: [0, 360],
          opacity: [0.1, 0.3, 0.1]
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'conic-gradient(from 0deg, transparent, rgba(255,255,0,0.1), transparent)',
          clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
        }}
      />

      <div className="relative flex gap-4 md:gap-8 bg-black/60 p-6 rounded-[2.5rem] border-2 border-green-400/30 backdrop-blur-xl">
        {reels.map((symbol, i) => (
          <motion.div
            key={`${symbol}-${i}-${isSpinning}`}
            className="relative w-32 h-52 md:w-40 md:h-64 bg-gradient-to-b from-green-900 via-emerald-900 to-teal-900 rounded-[2rem] overflow-hidden border-2 border-green-400/40 flex items-center justify-center"
            animate={isSpinning ? {
              scale: [1, 1.1, 1],
              boxShadow: [
                '0 0 25px rgba(0,255,0,0.5)',
                '0 0 55px rgba(0,255,0,0.9)',
                '0 0 25px rgba(0,255,0,0.5)'
              ]
            } : {}}
            transition={{ duration: 0.1, repeat: isSpinning ? Infinity : 0 }}
          >
            <motion.div
              key={isSpinning ? `spin-${i}` : `stop-${i}`}
              initial={isSpinning ? { y: -600 } : { y: 0 }}
              animate={isSpinning ? { y: [0, 600], rotate: [0, 180] } : { y: 0, scale: [1, 1.2, 1] }}
              transition={isSpinning ? { duration: 0.08, repeat: Infinity, ease: "linear" } : { duration: 0.35 }}
              className={`text-7xl md:text-9xl ${isSpinning ? 'blur-sm opacity-40' : 'drop-shadow-[0_0_35px_rgba(0,255,0,0.7)]'}`}
            >
              {isSpinning ? symbols[Math.floor(Math.random() * symbols.length)] : symbol}
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-b from-green-900/50 via-transparent to-teal-900/50 pointer-events-none" />
          </motion.div>
        ))}
      </div>

      {multiplier > 0 && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: [0, 1.5, 1], rotate: 0 }}
          className="absolute top-20 text-8xl font-black text-green-400"
          style={{ textShadow: '0 0 40px rgba(0,255,0,0.9)' }}
        >
          {multiplier}x
        </motion.div>
      )}

      {inBonus && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 0.35, repeat: Infinity }}
          className="absolute top-4 bg-gradient-to-r from-green-400 to-emerald-400 text-black px-8 py-4 rounded-full font-black text-2xl shadow-[0_0_40px_rgba(0,255,0,0.9)]"
        >
          🌿 BONUS: {bonusSpins} SPINS 🌿
        </motion.div>
      )}

      <BetSelector currentBet={bet} setBet={setBet} minBet={initialMinBet} maxTokens={tokens} disabled={isSpinning} />
      
      <button
        onClick={inBonus ? bonusSpin : spin}
        disabled={isSpinning}
        className="group relative w-full h-32 rounded-[2.5rem] overflow-hidden shadow-2xl active:scale-95 transition-all"
      >
        <motion.div
          animate={isSpinning ? {
            background: [
              'linear-gradient(90deg, #00ff00, #00ff88, #00ff00)',
              'linear-gradient(90deg, #00ff88, #00ff00, #00ff88)'
            ]
          } : {}}
          transition={{ duration: 0.3, repeat: isSpinning ? Infinity : 0 }}
          className="absolute inset-0 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 group-hover:from-green-300 group-hover:via-emerald-300 group-hover:to-teal-300"
        />
        <span className="relative z-10 text-black font-black text-5xl italic uppercase tracking-[0.3em]">
          {inBonus ? '🌿 BONUS SPIN 🌿' : isSpinning ? '🌳 SPINNING... 🌳' : '🌿 SPIN 🌿'}
        </span>
      </button>

      <AnimatePresence>
        {winMsg && (
          <motion.div
            initial={{ scale: 0, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className={`absolute -top-8 px-16 py-6 rounded-full font-black text-3xl ${winMsg && (winMsg.includes('INSUFFICIENT') || winMsg.startsWith('MINIMUM')) ? 'bg-red-600 text-white shadow-[0_0_30px_rgba(239,68,68,0.5)]' : 'bg-gradient-to-r from-green-400 to-emerald-400 text-black shadow-[0_0_50px_rgba(0,255,0,0.9)] border-4 border-white/50'}` } 
          >
            {winMsg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// LUXEBLACK MEGA 5-COLUMN SLOT - Premium Professional Experience
const LuxeMega5Slot = ({ symbols, tokens, setTokens, minBet: initialMinBet }) => {
  const [reels, setReels] = useState([symbols[0], symbols[1], symbols[2], symbols[3], symbols[4]]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winMsg, setWinMsg] = useState('');
  const [bet, setBet] = useState(initialMinBet);
  const [multiplier, setMultiplier] = useState(0);
  const [inBonus, setInBonus] = useState(false);
  const [bonusSpins, setBonusSpins] = useState(0);
  const [screenShake, setScreenShake] = useState(false);
  const [glowEffect, setGlowEffect] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [particles, setParticles] = useState([]);
  const containerRef = useRef(null);

  const generateConfetti = () => {
    const colors = ['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b', '#6c5ce7'];
    const newParticles = [];
    for (let i = 0; i < 150; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * (containerRef.current?.offsetWidth || 1200),
        y: Math.random() * (containerRef.current?.offsetHeight || 800),
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.8
      });
    }
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 4000);
  };

  const spin = () => {
    if (isSpinning) return;
    if (bet > tokens) { setIsSpinning(false); setWinMsg('INSUFFICIENT FUNDS'); createClick(600, 0.12); setTimeout(() => setWinMsg(''), 2200); return; }
    if (bet < initialMinBet) { setIsSpinning(false); setWinMsg(`MINIMUM BET ${initialMinBet}`); createClick(400, 0.08); setTimeout(() => setWinMsg(''), 2200); return; }
    setIsSpinning(true);
    setWinMsg('');
    setMultiplier(0);
    setGlowEffect(false);
    setTokens(t => t - bet);
    playSpinSound('default');
    
    const results = [
      symbols[Math.floor(Math.random() * symbols.length)],
      symbols[Math.floor(Math.random() * symbols.length)],
      symbols[Math.floor(Math.random() * symbols.length)],
      symbols[Math.floor(Math.random() * symbols.length)],
      symbols[Math.floor(Math.random() * symbols.length)]
    ];
    
    // Staggered stops for dramatic effect
    [1000, 1800, 2600, 3400, 4200].forEach((d, i) => {
      setTimeout(() => {
        setReels(prev => { 
          const n = [...prev]; 
          n[i] = results[i]; 
          return n; 
        });
        playReelStopSound('default');
        if (i === 4) {
          setTimeout(() => finalize(results), 500);
        }
      }, d);
    });
  };

  const finalize = (res) => {
    setIsSpinning(false);
    let mult = 0;
    let message = '';
    let isMegaWin = false;
    let triggerBonus = false;

    // Check for 5-of-a-kind
    if (res[0] === res[1] && res[1] === res[2] && res[2] === res[3] && res[3] === res[4]) {
      if (res[0] === '💎' || res[0] === '👑' || res[0] === '⭐') {
        mult = 500;
        message = `💎💎💎 LUXEBLACK MEGA JACKPOT!!! 💎💎💎 +${(bet * mult).toLocaleString()}`;
        isMegaWin = true;
        triggerBonus = true;
      } else if (res[0] === '🎰' || res[0] === '💰') {
        mult = 300;
        message = `🎰🎰🎰 ULTRA JACKPOT!!! 🎰🎰🎰 +${(bet * mult).toLocaleString()}`;
        isMegaWin = true;
        triggerBonus = Math.random() < 0.4;
      } else {
        mult = 200;
        message = `🔥🔥🔥 MEGA WIN!!! 🔥🔥🔥 +${(bet * mult).toLocaleString()}`;
        isMegaWin = true;
      }
      setTokens(t => t + bet * mult);
    }
    // Check for 4-of-a-kind
    else if ((res[0] === res[1] && res[1] === res[2] && res[2] === res[3]) ||
             (res[1] === res[2] && res[2] === res[3] && res[3] === res[4])) {
      mult = 100;
      message = `✨✨✨ QUAD MATCH! ✨✨✨ +${(bet * mult).toLocaleString()}`;
      setTokens(t => t + bet * mult);
      isMegaWin = true;
    }
    // Check for 3-of-a-kind
    else if ((res[0] === res[1] && res[1] === res[2]) ||
             (res[1] === res[2] && res[2] === res[3]) ||
             (res[2] === res[3] && res[3] === res[4])) {
      mult = 50;
      message = `🎉 TRIPLE MATCH! 🎉 +${(bet * mult).toLocaleString()}`;
      setTokens(t => t + bet * mult);
    }
    // Check for 2 pairs
    else {
      const counts = {};
      res.forEach(s => counts[s] = (counts[s] || 0) + 1);
      const pairs = Object.values(counts).filter(c => c >= 2).length;
      if (pairs >= 2) {
        mult = 15;
        message = `✨ DOUBLE PAIR! ✨ +${(bet * mult).toLocaleString()}`;
        setTokens(t => t + bet * mult);
      } else if (pairs === 1) {
        mult = 5;
        message = `💫 PAIR WIN! 💫 +${(bet * mult).toLocaleString()}`;
        setTokens(t => t + bet * mult);
      }
    }

    if (mult > 0) {
      setMultiplier(mult);
      setWinMsg(message);
      playWinSound(mult, 'default');
      
      if (isMegaWin) {
        setShowConfetti(true);
        setScreenShake(true);
        setGlowEffect(true);
        generateConfetti();
        setTimeout(() => {
          setScreenShake(false);
          setGlowEffect(false);
        }, 2500);
        setTimeout(() => setShowConfetti(false), 4000);
      }
    }

    if (triggerBonus) {
      setTimeout(() => startBonusRound(), 2000);
    }
  };

  const startBonusRound = () => {
    playBonusSound();
    setInBonus(true);
    setBonusSpins(10);
    setWinMsg('🎁 LUXEBLACK BONUS ROUND ACTIVATED! 🎁');
  };

  const bonusSpin = () => {
    if (bonusSpins <= 0) {
      setInBonus(false);
      return;
    }
    setIsSpinning(true);
    setWinMsg('');
    setBonusSpins(prev => prev - 1);
    playSpinSound('default');

    const results = [
      symbols[Math.floor(Math.random() * symbols.length)],
      symbols[Math.floor(Math.random() * symbols.length)],
      symbols[Math.floor(Math.random() * symbols.length)],
      symbols[Math.floor(Math.random() * symbols.length)],
      symbols[Math.floor(Math.random() * symbols.length)]
    ];

    [800, 1500, 2200, 2900, 3600].forEach((d, i) => {
      setTimeout(() => {
        setReels(prev => { const n = [...prev]; n[i] = results[i]; return n; });
        if (i === 4) {
          setTimeout(() => {
            setIsSpinning(false);
            const bonusMult = 25;
            setTokens(t => t + bet * bonusMult);
            setWinMsg(`🎁 BONUS WIN! +${(bet * bonusMult).toLocaleString()} (${bonusSpins - 1} left)`);
            playWinSound(bonusMult, 'default');
          }, 400);
        }
      }, d);
    });
  };

  return (
    <div 
      ref={containerRef}
      className={`flex flex-col items-center gap-10 p-12 bg-gradient-to-br from-black via-zinc-900 via-purple-900/20 to-black rounded-[4rem] border-2 border-yellow-500/30 relative shadow-[0_0_300px_rgba(255,215,0,0.3)] overflow-visible ${
        screenShake ? 'animate-pulse' : ''
      }`}
      style={{
        boxShadow: glowEffect ? '0 0 300px rgba(255,215,0,0.8), 0 0 600px rgba(255,20,147,0.6), inset 0 0 200px rgba(255,215,0,0.2)' : undefined,
        transition: 'box-shadow 0.3s ease'
      }}
    >
      {/* LuxeBlack Branding */}
      <div className="absolute top-4 left-4 right-4 flex justify-center z-20">
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-400 text-black px-8 py-3 rounded-full font-black text-xl italic tracking-tighter shadow-[0_0_30px_rgba(255,215,0,0.6)]"
        >
          LUXEBLACK
        </motion.div>
      </div>

      {/* Animated background effects */}
      {glowEffect && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0, 1, 0],
            scale: [1, 1.3, 1]
          }}
          transition={{ duration: 2.5, repeat: Infinity }}
          className="absolute inset-0 bg-gradient-to-r from-yellow-500/30 via-pink-500/30 to-cyan-500/30 pointer-events-none"
        />
      )}

      {/* Confetti particles */}
      <AnimatePresence>
        {particles.map(particle => (
          <ConfettiParticle key={particle.id} {...particle} />
        ))}
      </AnimatePresence>

      {/* 5-Column Reels with Premium Motion Blur */}
      <div className="relative flex gap-3 md:gap-6 bg-black/70 p-8 rounded-[2.5rem] border-2 border-yellow-500/40 backdrop-blur-2xl mt-16">
        {reels.map((symbol, i) => (
          <motion.div
            key={`${symbol}-${i}-${isSpinning}`}
            className="relative w-24 h-56 md:w-32 md:h-72 bg-gradient-to-b from-zinc-900 via-black to-zinc-900 rounded-[1.5rem] overflow-hidden border-2 border-yellow-500/30 flex items-center justify-center"
            animate={isSpinning ? {
              scale: [1, 1.08, 1],
              boxShadow: [
                '0 0 25px rgba(255,215,0,0.4)',
                '0 0 60px rgba(255,215,0,0.8)',
                '0 0 25px rgba(255,215,0,0.4)'
              ]
            } : {}}
            transition={{ duration: 0.08, repeat: isSpinning ? Infinity : 0 }}
          >
            {/* Motion blur reel content */}
            <motion.div
              key={isSpinning ? `spin-${i}-${Date.now()}` : `stop-${i}`}
              initial={isSpinning ? { y: -1000 } : { y: 0 }}
              animate={isSpinning ? {
                y: [0, 1000],
                rotate: [0, 1080]
              } : {
                y: 0,
                scale: [1, 1.4, 1],
                rotate: [0, 15, -15, 0]
              }}
              transition={isSpinning ? {
                duration: 0.05,
                repeat: Infinity,
                ease: "linear"
              } : {
                duration: 0.6,
                ease: "backOut"
              }}
              className={`text-6xl md:text-8xl ${
                isSpinning 
                  ? 'opacity-50' 
                  : 'drop-shadow-[0_0_40px_rgba(255,215,0,0.6)] filter brightness-120'
              }`}
              style={{
                filter: isSpinning ? 'blur(10px) brightness(2) saturate(1.5)' : 'none',
                textShadow: isSpinning ? 'none' : '0 0 30px currentColor, 0 0 60px currentColor, 0 0 90px currentColor',
                willChange: isSpinning ? 'transform' : 'auto',
                transform: isSpinning ? 'translateZ(0)' : 'none',
                backfaceVisibility: 'hidden',
                perspective: '1000px'
              }}
            >
              {isSpinning ? symbols[Math.floor(Math.random() * symbols.length)] : symbol}
            </motion.div>
            
            {/* Speed lines effect during spin */}
            {isSpinning && (
              <motion.div
                animate={{ y: ['-100%', '200%'] }}
                transition={{ duration: 0.1, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(to bottom, transparent 0%, rgba(255,215,0,0.3) 50%, transparent 100%)',
                  height: '30%'
                }}
              />
            )}
            
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60 pointer-events-none" />
          </motion.div>
        ))}
      </div>

      {/* Multiplier display */}
      {multiplier > 0 && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: [0, 1.8, 1], rotate: 0 }}
          exit={{ scale: 0, rotate: 180 }}
          className="absolute top-32 text-9xl md:text-[12rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-400"
          style={{
            textShadow: '0 0 50px rgba(255,215,0,1), 0 0 100px rgba(255,215,0,0.8)',
            WebkitTextStroke: '3px rgba(255,215,0,0.8)',
            filter: 'drop-shadow(0 0 30px rgba(255,215,0,0.9))'
          }}
        >
          {multiplier}x
        </motion.div>
      )}

      {inBonus && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.35, repeat: Infinity }}
          className="absolute top-20 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-400 text-black px-10 py-5 rounded-full font-black text-3xl shadow-[0_0_50px_rgba(255,215,0,1)]"
        >
          🎁 LUXEBLACK BONUS: {bonusSpins} SPINS 🎁
        </motion.div>
      )}

      <BetSelector currentBet={bet} setBet={setBet} minBet={initialMinBet} maxTokens={tokens} disabled={isSpinning} />
      
      <button 
        onClick={inBonus ? bonusSpin : spin} 
        disabled={isSpinning} 
        className="group relative w-full h-36 rounded-[2.5rem] overflow-hidden shadow-2xl active:scale-95 transition-all"
      >
        <motion.div
          animate={isSpinning ? {
            background: [
              'linear-gradient(90deg, #ffd700, #ff8c00, #ffd700)',
              'linear-gradient(90deg, #ff8c00, #ffd700, #ff8c00)'
            ]
          } : {}}
          transition={{ duration: 0.2, repeat: isSpinning ? Infinity : 0 }}
          className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-400 group-hover:from-yellow-300 group-hover:via-amber-300 group-hover:to-yellow-300"
        />
        <span className="relative z-10 text-black font-black text-6xl italic uppercase tracking-[0.3em] flex items-center justify-center gap-4">
          {inBonus ? (
            <>
              <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}>
                🎁
              </motion.span>
              BONUS SPIN
              <motion.span animate={{ rotate: -360 }} transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}>
                🎁
              </motion.span>
            </>
          ) : isSpinning ? (
            <>
              <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.3, repeat: Infinity, ease: "linear" }}>
                ⚡
              </motion.span>
              SPINNING...
              <motion.span animate={{ rotate: -360 }} transition={{ duration: 0.3, repeat: Infinity, ease: "linear" }}>
                ⚡
              </motion.span>
            </>
          ) : (
            '🎰 LUXEBLACK SPIN 🎰'
          )}
        </span>
      </button>

      {/* Win message */}
      <AnimatePresence>
        {winMsg && (
          <motion.div
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            animate={{ 
              scale: [0, 1.3, 1],
              rotate: [0, 15, -15, 0],
              opacity: 1,
              y: [100, 0]
            }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute z-50 -top-12 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-400 text-black px-20 py-8 rounded-full font-black text-4xl md:text-5xl shadow-[0_0_80px_rgba(255,215,0,1)] border-4 border-white/60"
            style={{
              textShadow: '3px 3px 6px rgba(0,0,0,0.5)',
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 0.6, repeat: Infinity }}
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
  const startRound = () => { if (tokens < bet) { setMessage('INSUFFICIENT FUNDS'); createClick(600, 0.12); setTimeout(() => setMessage(''), 2200); return; } if (bet < initialMinBet) { setMessage(`MINIMUM BET ${initialMinBet}`); createClick(400, 0.08); setTimeout(() => setMessage(''), 2200); return; } setTokens(t => t - bet); const d = createDeck(); setPlayerHand([d[0], d[2]]); setDealerHand([d[1], d[3]]); setDeck(d.slice(4)); setStatus('playing'); setMessage(''); };
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

// Plinko removed.

export default function App() {  // Global notification state (fixed, always visible)
  const [notification, setNotification] = useState(null);
  const notifTimerRef = useRef(null);
  const showNotification = (msg, { duration = 3500, variant = 'success' } = {}) => {
    setNotification({ msg, variant });
    if (notifTimerRef.current) clearTimeout(notifTimerRef.current);
    notifTimerRef.current = setTimeout(() => setNotification(null), duration);
  };

  const GlobalNotification = ({ notification }) => {
    if (!notification) return null;
    return (
      <div className="fixed left-1/2 -translate-x-1/2 top-8 z-[9999] pointer-events-none">
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }} className="pointer-events-auto bg-gradient-to-r from-yellow-400 to-pink-400 text-black px-8 py-4 rounded-full font-black text-xl shadow-2xl border-2 border-white/30">
          {notification.msg}
        </motion.div>
      </div>
    );
  };

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

  // Load progress from localStorage with user ID. Returns the saved progress object or null.
  const loadProgress = useCallback((userId) => {
    if (!userId) return null;
    const saved = localStorage.getItem(`luxe_premier_progress_${userId}`);
    if (!saved) return null;
    try {
      const progress = JSON.parse(saved);
      return progress && typeof progress === 'object' ? progress : null;
    } catch (e) {
      console.error('Error loading progress:', e);
      return null;
    }
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

        // Merge/load/save progress for this user:
        // - If there's saved progress, use the greater balance between saved and current tokens and don't overwrite a larger saved balance.
        // - If there's no saved progress, save the current tokens for this account.
        try {
          const progress = loadProgress(profile.sub);
          if (progress && typeof progress === 'object' && progress.tokens !== undefined) {
            // Use the higher token value to avoid losing progress
            const merged = Math.max(tokens, progress.tokens);
            setTokens(merged);
            // If local current tokens is higher than saved, update saved progress
            if (tokens > progress.tokens) saveProgress(profile.sub, tokens);
          } else {
            // No saved progress — save current tokens to associate with this account
            saveProgress(profile.sub, tokens);
          }
        } catch (e) {
          console.error('Error merging progress on sign-in:', e);
        }
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
              <span className="text-2xl font-black italic tracking-tighter">LUXEBLACK</span>
              <span className="text-[8px] font-black uppercase tracking-[0.4em] text-zinc-500">Gaming Studio</span>
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
              {activeGame.type === 'blackjack' && <BlackjackTable initialMinBet={activeGame.minBet} tokens={tokens} setTokens={setTokens} showNotification={showNotification} />}
              {activeGame.type === 'slots' && <SlotMachine symbols={activeGame.symbols} tokens={tokens} setTokens={setTokens} minBet={activeGame.minBet} showNotification={showNotification} />}
              {activeGame.type === 'mega-slots' && <MegaSlotMachine symbols={activeGame.symbols} tokens={tokens} setTokens={setTokens} minBet={activeGame.minBet} showNotification={showNotification} />}
              {activeGame.type === 'ocean-slots' && <OceanSlotMachine symbols={activeGame.symbols} tokens={tokens} setTokens={setTokens} minBet={activeGame.minBet} showNotification={showNotification} />}
              {activeGame.type === 'cosmic-slots' && <CosmicSlotMachine symbols={activeGame.symbols} tokens={tokens} setTokens={setTokens} minBet={activeGame.minBet} showNotification={showNotification} />}
              {activeGame.type === 'pharaoh-slots' && <PharaohSlotMachine symbols={activeGame.symbols} tokens={tokens} setTokens={setTokens} minBet={activeGame.minBet} showNotification={showNotification} />}
              {activeGame.type === 'cyber-slots' && <CyberSlotMachine symbols={activeGame.symbols} tokens={tokens} setTokens={setTokens} minBet={activeGame.minBet} showNotification={showNotification} />}
              {activeGame.type === 'forest-slots' && <ForestSlotMachine symbols={activeGame.symbols} tokens={tokens} setTokens={setTokens} minBet={activeGame.minBet} showNotification={showNotification} />}
              {activeGame.type === 'luxe-mega-5' && <LuxeMega5Slot symbols={activeGame.symbols} tokens={tokens} setTokens={setTokens} minBet={activeGame.minBet} showNotification={showNotification} />}
              {activeGame.type === 'roulette' && <RouletteTable initialMinBet={activeGame.minBet} tokens={tokens} setTokens={setTokens} showNotification={showNotification} />}
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
                    "Entertainment should remain balanced and sophisticated. LuxeBlack encourages all guests to practice mindfulness during their stay.",
                    "While our platform involves no real money, the mechanics simulate real-world probability. We advise guests to view this strictly as a recreational strategy simulation.",
                    "Set time limits for your virtual sessions. If you find yourself spending excessive time in the simulation, we recommend taking an extended break.",
                    "LuxeBlack provides tools for token reset and session termination. We advocate for a healthy, social-first approach to all virtual floor games.",
                    "Remember: The objective of LuxeBlack is the appreciation of probability and refined social interaction, not financial gain."
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
              <span className="text-xl font-black italic tracking-tighter uppercase">LUXEBLACK</span>
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
              LUXEBLACK IS FOR ENTERTAINMENT PURPOSES ONLY. NO REAL MONEY WAGERING. SOCIAL SIMULATION CERTIFIED 2024.
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-10 flex flex-col md:flex-row justify-between items-center gap-4 text-zinc-600 text-[10px] font-black uppercase tracking-[0.3em]">
          <span>© 2024 LUXEBLACK GAMING STUDIO. ALL RIGHTS RESERVED.</span>
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
