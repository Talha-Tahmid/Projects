import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Menu,
  FileText,
  Briefcase,
  History,
  ArrowUpRight,
  ShieldAlert,
} from "lucide-react";
import { BrandProfile, GeneratedPiece } from "./types";
import HistorySidebar from "./components/HistorySidebar";
import WritingWorkspace from "./components/WritingWorkspace";
import BrandProfiles from "./components/BrandProfiles";

export default function App() {
  // Local storage management
  const [history, setHistory] = useState<GeneratedPiece[]>([]);
  const [profiles, setProfiles] = useState<BrandProfile[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);

  // Active workplace focus
  const [activePiece, setActivePiece] = useState<GeneratedPiece | null>(null);

  // Layout states
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isBrandModalOpen, setIsBrandModalOpen] = useState<boolean>(false);

  // Initial Boot loader
  useEffect(() => {
    try {
      const savedHist = localStorage.getItem("copy_assistant_history");
      if (savedHist) {
        setHistory(JSON.parse(savedHist));
      }

      const savedProfiles = localStorage.getItem("copy_assistant_brand_profiles");
      if (savedProfiles) {
        setProfiles(JSON.parse(savedProfiles));
      } else {
        // Hydrate with a pristine default template for Acme Corp
        const defaultProfile: BrandProfile = {
          id: "acme-premium-default",
          name: "SaaS Premium Starter",
          audience: "Founders, Developers, and Digital Creators",
          toneNotes: "Innovative, authoritative yet friendly.",
          rules: "Always use active voice, back arguments with real-world examples, and close each piece with a single logical next action.",
          wordsToAvoid: "leverage, disrupt, revolutionary, paradigm shift",
        };
        setProfiles([defaultProfile]);
        localStorage.setItem("copy_assistant_brand_profiles", JSON.stringify([defaultProfile]));
      }
    } catch (e) {
      console.error("Local storage restoration error:", e);
    }
  }, []);

  // Sync helpers
  const saveHistoryToDisk = (updatedHistory: GeneratedPiece[]) => {
    setHistory(updatedHistory);
    localStorage.setItem("copy_assistant_history", JSON.stringify(updatedHistory));
  };

  const saveProfilesToDisk = (updatedProfiles: BrandProfile[]) => {
    setProfiles(updatedProfiles);
    localStorage.setItem("copy_assistant_brand_profiles", JSON.stringify(updatedProfiles));
  };

  // Profiles Callbacks
  const handleAddProfile = (newProf: Omit<BrandProfile, "id">) => {
    const fresh: BrandProfile = {
      id: "profile_" + Date.now().toString(),
      ...newProf,
    };
    const updated = [fresh, ...profiles];
    saveProfilesToDisk(updated);
    setSelectedProfileId(fresh.id);
  };

  const handleUpdateProfile = (updated: BrandProfile) => {
    const list = profiles.map((p) => (p.id === updated.id ? updated : p));
    saveProfilesToDisk(list);
  };

  const handleDeleteProfile = (id: string) => {
    if (window.confirm("Are you sure you want to delete this brand voice template?")) {
      const list = profiles.filter((p) => p.id !== id);
      saveProfilesToDisk(list);
      if (selectedProfileId === id) setSelectedProfileId(null);
    }
  };

  // Core generated draft managers
  const handleSavePiece = (piece: GeneratedPiece) => {
    const exists = history.some((p) => p.id === piece.id);
    let updated: GeneratedPiece[];
    if (exists) {
      updated = history.map((p) => (p.id === piece.id ? piece : p));
    } else {
      updated = [piece, ...history];
    }
    saveHistoryToDisk(updated);
    setActivePiece(piece);
  };

  const handleDeletePiece = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Delete this content draft from your local desk?")) {
      const updated = history.filter((p) => p.id !== id);
      saveHistoryToDisk(updated);
      if (activePiece?.id === id) {
        setActivePiece(null);
      }
    }
  };

  const handleSelectPiece = (piece: GeneratedPiece) => {
    setActivePiece(piece);
    setSelectedProfileId(piece.brandProfileId || null);
    // On mobile screens, automatically fold sidebar on item load
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div id="app_frame" className="min-h-screen bg-[#0c0e14] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Mesh Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/15 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-purple-600/15 blur-[150px]" />
        <div className="absolute top-[20%] right-[10%] w-[35%] h-[40%] rounded-full bg-pink-500/8 blur-[100px]" />
      </div>

      {/* Dynamic Navigation Top bar */}
      <header className="bg-white/3 backdrop-blur-md border-b border-white/10 px-4 md:px-6 py-3.5 sticky top-0 z-30 flex items-center justify-between shadow-lg relative">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            className="p-2 -ml-1 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            title="Toggle Sidebar History"
          >
            <Menu size={18} />
          </button>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white font-bold text-sm tracking-tighter hover:scale-105 transition-transform shadow-lg shadow-indigo-500/20">
              W
            </div>
            <div>
              <h1 className="font-bold text-white text-sm tracking-tight flex items-center gap-1.5 leading-none">
                AI Content Writing Assistant
                <span className="inline-flex items-center gap-0.5 text-[9px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded-full font-semibold border border-indigo-500/30">
                  <Sparkles size={8} className="fill-indigo-400 text-indigo-400" /> Professional
                </span>
              </h1>
              <p className="text-[10px] text-slate-400 mt-0.5 font-sans">
                Human-Grade Marketing Copy & SEO Strategy Desk
              </p>
            </div>
          </div>
        </div>

        {/* Global actions banner */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsBrandModalOpen(true)}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-200 hover:text-white hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-lg font-medium transition-all shadow-3xs cursor-pointer bg-white/5"
          >
            <Briefcase size={13} className="text-slate-400" />
            Configure Brand Guides
          </button>

          <span className="text-[11px] font-mono font-medium text-slate-400 bg-white/2 border border-white/10 px-2.5 py-1 rounded-md hidden lg:inline-block">
            Tone: Selective
          </span>
        </div>
      </header>

      {/* Main Content Workspace section */}
      <main className="flex-1 flex overflow-hidden relative z-10">
        {/* Sidebar History panel */}
        <HistorySidebar
          currentId={activePiece?.id || null}
          history={history}
          onSelectPiece={handleSelectPiece}
          onDeletePiece={handleDeletePiece}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Content generation area */}
        <WritingWorkspace
          brandProfiles={profiles}
          onOpenBrandProfiles={() => setIsBrandModalOpen(true)}
          activePiece={activePiece}
          onSavePiece={handleSavePiece}
          onClearActive={() => {
            setActivePiece(null);
            setSelectedProfileId(null);
          }}
        />
      </main>

      {/* Brand Voice modal over-screen dial */}
      {isBrandModalOpen && (
        <BrandProfiles
          profiles={profiles}
          onAddProfile={handleAddProfile}
          onUpdateProfile={handleUpdateProfile}
          onDeleteProfile={handleDeleteProfile}
          selectedProfileId={selectedProfileId}
          onSelectProfile={(id) => setSelectedProfileId(id)}
          onClose={() => setIsBrandModalOpen(false)}
        />
      )}
    </div>
  );
}
