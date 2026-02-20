import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Wallet, 
  History, 
  LayoutDashboard, 
  GraduationCap, 
  Dumbbell, 
  TrendingUp, 
  Plus, 
  X, 
  CheckCircle2,
  Menu,
  ChevronRight,
  Search,
  Zap,
  Clock
} from 'lucide-react';

// --- CONFIGURAZIONE E DATI INIZIALI ---
const CATEGORIES = [
  { id: 'exams', name: 'Appelli & Esami', icon: GraduationCap },
  { id: 'sports', name: 'Tornei CUS', icon: Dumbbell },
  { id: 'events', name: 'Eventi UNIPA', icon: Zap },
  { id: 'politics', name: 'Elezioni Studentesche', icon: TrendingUp },
];

const INITIAL_EVENTS = [
  {
    id: 1,
    category: 'exams',
    title: 'Analisi Matematica 1 (Prof. Rossi)',
    description: 'Percentuale di promossi > 30%',
    odds: { win: 1.85, lose: 2.10 },
    startTime: 'Domani, 09:00',
    location: 'Edificio 8'
  },
  {
    id: 2,
    category: 'sports',
    title: 'Ingegneria vs Medicina',
    description: 'Torneo Interfacoltà Calcio a 5',
    odds: { home: 2.40, draw: 3.10, away: 1.95 },
    startTime: 'Stasera, 21:00',
    location: 'CUS Palermo'
  },
  {
    id: 3,
    category: 'exams',
    title: 'Fisica Tecnica (Appello Straordinario)',
    description: 'N. Studenti con voto > 28',
    odds: { high: 3.50, medium: 1.90, low: 1.45 },
    startTime: 'Venerdì, 10:00',
    location: 'Viale delle Scienze'
  },
  {
    id: 4,
    category: 'events',
    title: 'Cerimonia di Laurea - Ingegneria',
    description: 'Durata discorso del Rettore > 15 min',
    odds: { yes: 1.70, no: 2.15 },
    startTime: 'Lunedì, 11:00',
    location: 'Aula Magna'
  }
];

export default function App() {
  const [balance, setBalance] = useState(500);
  const [betSlip, setBetSlip] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [betAmount, setBetAmount] = useState(10);
  const [history, setHistory] = useState([]);
  const [notification, setNotification] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Calcolo potenziale vincita
  const totalOdds = betSlip.reduce((acc, item) => acc * item.odd, 1);
  const potentialWin = (totalOdds * betAmount).toFixed(2);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const addToSlip = (event, selection, odd) => {
    if (betSlip.find(item => item.eventId === event.id)) {
      showNotification("Hai già una scommessa per questo evento nella schedina!");
      return;
    }
    setBetSlip([...betSlip, { 
      eventId: event.id, 
      title: event.title, 
      selection, 
      odd 
    }]);
  };

  const removeFromSlip = (id) => {
    setBetSlip(betSlip.filter(item => item.eventId !== id));
  };

  const placeBet = () => {
    if (betSlip.length === 0) return;
    if (balance < betAmount) {
      showNotification("Saldo insufficiente!");
      return;
    }

    const newBet = {
      id: Date.now(),
      events: [...betSlip],
      amount: betAmount,
      totalOdds: totalOdds.toFixed(2),
      potentialWin,
      date: new Date().toLocaleString(),
      status: 'In corso'
    };

    setBalance(prev => prev - betAmount);
    setHistory([newBet, ...history]);
    setBetSlip([]);
    showNotification("Scommessa piazzata con successo! Forza UNIPA!");
  };

  const filteredEvents = activeCategory === 'all' 
    ? INITIAL_EVENTS 
    : INITIAL_EVENTS.filter(e => e.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#0f1115] text-white font-sans">
      {/* --- TOP BAR --- */}
      <header className="sticky top-0 z-50 bg-[#1a1d23] border-b border-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-pink-600 p-1.5 rounded-lg shadow-lg shadow-pink-900/20">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">
                UNI<span className="text-pink-500">BET</span>
              </h1>
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest leading-none">Palermo</p>
            </div>
          </div>

          <div className="hidden md:flex bg-[#121418] rounded-full px-4 py-1.5 border border-gray-800 items-center gap-3">
            <Wallet className="w-4 h-4 text-green-500" />
            <span className="font-mono font-bold">{balance.toFixed(2)} UC</span>
            <button className="bg-pink-600 hover:bg-pink-700 p-1 rounded-full transition-colors">
              <Plus className="w-3 h-3" />
            </button>
          </div>

          <button 
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="w-6 h-6 text-gray-400" />
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 p-4 md:p-6">
        
        {/* --- SIDEBAR NAV --- */}
        <aside className="w-full md:w-64 shrink-0 space-y-2">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest px-2 mb-4">Palinsesto</h2>
          <button 
            onClick={() => setActiveCategory('all')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeCategory === 'all' ? 'bg-pink-600 text-white shadow-lg shadow-pink-900/30' : 'bg-transparent text-gray-400 hover:bg-[#1a1d23]'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium text-sm">Tutti gli Eventi</span>
          </button>
          
          {CATEGORIES.map(cat => (
            <button 
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeCategory === cat.id ? 'bg-pink-600 text-white shadow-lg shadow-pink-900/30' : 'bg-transparent text-gray-400 hover:bg-[#1a1d23]'
              }`}
            >
              <cat.icon className="w-5 h-5" />
              <span className="font-medium text-sm">{cat.name}</span>
            </button>
          ))}

          <div className="pt-8">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest px-2 mb-4">Strumenti</h2>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-[#1a1d23]">
              <History className="w-5 h-5" />
              <span className="font-medium text-sm">Cronologia Giocate</span>
            </button>
          </div>
        </aside>

        {/* --- MAIN CONTENT: EVENT LIST --- */}
        <main className="flex-1 space-y-4">
          <div className="bg-gradient-to-r from-pink-900/40 to-[#1a1d23] p-6 rounded-3xl border border-pink-500/20 mb-6">
            <h2 className="text-2xl font-bold mb-1">Benvenuto su UniBet, Studente!</h2>
            <p className="text-gray-400 text-sm">Piazza le tue scommesse virtuali sugli eventi più caldi di Viale delle Scienze.</p>
          </div>

          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Clock className="w-5 h-5 text-pink-500" />
              Eventi in Primo Piano
            </h3>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input 
                type="text" 
                placeholder="Cerca evento..." 
                className="bg-[#1a1d23] border border-gray-800 rounded-full py-1.5 pl-10 pr-4 text-xs focus:outline-none focus:border-pink-500"
              />
            </div>
          </div>

          <div className="grid gap-4">
            {filteredEvents.map(event => (
              <div key={event.id} className="bg-[#1a1d23] border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-700 transition-colors">
                <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] bg-gray-800 text-gray-300 px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                        {event.startTime}
                      </span>
                      <span className="text-[10px] text-pink-500 font-bold uppercase tracking-wider">
                        {event.location}
                      </span>
                    </div>
                    <h4 className="font-bold text-lg leading-tight">{event.title}</h4>
                    <p className="text-gray-500 text-sm italic">{event.description}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    {Object.entries(event.odds).map(([key, value]) => (
                      <button 
                        key={key}
                        onClick={() => addToSlip(event, key, value)}
                        className="flex-1 md:flex-none flex flex-col items-center justify-center min-w-[80px] h-16 bg-[#121418] hover:bg-pink-600/20 border border-gray-800 hover:border-pink-500 rounded-xl transition-all group"
                      >
                        <span className="text-[10px] text-gray-500 uppercase font-bold group-hover:text-pink-400">{key}</span>
                        <span className="text-lg font-bold text-pink-500 group-hover:text-white">{value.toFixed(2)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* --- RIGHT SIDEBAR: BET SLIP --- */}
        <aside className="w-full md:w-80 shrink-0">
          <div className="bg-[#1a1d23] border border-gray-800 rounded-3xl overflow-hidden sticky top-24">
            <div className="bg-pink-600 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <h3 className="font-bold uppercase tracking-tighter">La tua Schedina</h3>
              </div>
              <span className="bg-white/20 px-2 py-0.5 rounded text-xs font-bold">{betSlip.length}</span>
            </div>

            <div className="p-4 min-h-[150px]">
              {betSlip.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 py-10 text-center">
                  <Search className="w-10 h-10 mb-2 opacity-20" />
                  <p className="text-sm">Seleziona una quota per iniziare la tua giocata</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {betSlip.map(item => (
                    <div key={item.eventId} className="bg-[#121418] p-3 rounded-xl border border-gray-800 relative group">
                      <button 
                        onClick={() => removeFromSlip(item.eventId)}
                        className="absolute -top-2 -right-2 bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <p className="text-xs font-bold text-gray-300 pr-4 truncate">{item.title}</p>
                      <div className="flex justify-between items-end mt-2">
                        <span className="text-[10px] text-pink-500 font-bold uppercase">Esito: {item.selection}</span>
                        <span className="text-lg font-mono font-bold">@{item.odd.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {betSlip.length > 0 && (
              <div className="p-4 bg-[#121418] border-t border-gray-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Quota Totale:</span>
                  <span className="text-xl font-mono font-bold text-pink-500">{totalOdds.toFixed(2)}</span>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Importo Scommessa (UC)</label>
                  <div className="flex gap-2">
                    {[10, 50, 100].map(amt => (
                      <button 
                        key={amt}
                        onClick={() => setBetAmount(amt)}
                        className={`flex-1 py-2 rounded-lg border text-xs font-bold transition-all ${
                          betAmount === amt ? 'bg-pink-600 border-pink-500' : 'bg-[#1a1d23] border-gray-800'
                        }`}
                      >
                        {amt}
                      </button>
                    ))}
                    <input 
                      type="number" 
                      value={betAmount}
                      onChange={(e) => setBetAmount(Number(e.target.value))}
                      className="w-20 bg-[#1a1d23] border border-gray-800 rounded-lg text-center font-bold text-sm"
                    />
                  </div>
                </div>

                <div className="bg-pink-600/10 p-3 rounded-xl border border-pink-500/30">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-pink-200">Possibile Vincita:</span>
                    <span className="text-lg font-mono font-bold text-pink-400">{potentialWin} UC</span>
                  </div>
                </div>

                <button 
                  onClick={placeBet}
                  className="w-full bg-pink-600 hover:bg-pink-700 py-4 rounded-2xl font-bold uppercase tracking-widest shadow-xl shadow-pink-900/20 active:scale-[0.98] transition-all"
                >
                  Piazza Giocata
                </button>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* --- NOTIFICATIONS --- */}
      {notification && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white text-black px-6 py-3 rounded-2xl shadow-2xl font-bold flex items-center gap-3 z-[100] animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          {notification}
        </div>
      )}

      {/* --- FOOTER --- */}
      <footer className="border-t border-gray-800 mt-20 py-10 bg-[#0a0c10]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex justify-center gap-4 mb-6">
            <span className="bg-gray-800 text-gray-400 px-3 py-1 rounded text-xs font-bold">18+ Gioco Responsabile</span>
            <span className="bg-gray-800 text-gray-400 px-3 py-1 rounded text-xs font-bold">Solo Studenti UNIPA</span>
          </div>
          <p className="text-gray-600 text-xs">
            © 2024 UniBet Palermo. Questa è una piattaforma di simulazione a scopo educativo.<br/>
            Nessun denaro reale viene utilizzato. Le quote sono generate casualmente per simulare un ambiente di betting.
          </p>
        </div>
      </footer>
    </div>
  );
}