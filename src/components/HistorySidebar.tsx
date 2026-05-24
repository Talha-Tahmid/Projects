import React, { useState } from "react";
import { Search, Calendar, Trash2, FileText, Sparkles, X, ChevronRight, Hash } from "lucide-react";
import { GeneratedPiece, ContentType } from "../types";

interface HistorySidebarProps {
  currentId: string | null;
  history: GeneratedPiece[];
  onSelectPiece: (piece: GeneratedPiece) => void;
  onDeletePiece: (id: string, e: React.MouseEvent) => void;
  isOpen: boolean;
  onClose: () => void;
}

const CONTENT_TYPE_LABELS: Record<ContentType, { label: string; bg: string; text: string; border: string }> = {
  blog: { label: "Blog Post", bg: "bg-blue-500/10", text: "text-blue-300", border: "border-blue-500/20" },
  caption: { label: "Caption", bg: "bg-pink-500/10", text: "text-pink-300", border: "border-pink-500/20" },
  script: { label: "YT Script", bg: "bg-red-500/10", text: "text-red-300", border: "border-red-500/20" },
  email: { label: "Email Write", bg: "bg-amber-500/10", text: "text-amber-300", border: "border-amber-500/20" },
  productDescription: { label: "Product Desc", bg: "bg-purple-500/10", text: "text-purple-300", border: "border-purple-500/20" },
  essay: { label: "Essay/Article", bg: "bg-emerald-500/10", text: "text-emerald-300", border: "border-emerald-500/20" },
  adCopy: { label: "Ad Copy", bg: "bg-indigo-500/10", text: "text-indigo-300", border: "border-indigo-500/20" },
};

export default function HistorySidebar({
  currentId,
  history,
  onSelectPiece,
  onDeletePiece,
  isOpen,
  onClose,
}: HistorySidebarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<ContentType | "all">("all");

  const filteredHistory = history.filter((p) => {
    const matchesSearch = p.topic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || p.contentType === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden"
        />
      )}

      <div
        className={`fixed top-0 bottom-0 left-0 z-40 w-80 bg-[#0f121d]/85 backdrop-blur-2xl border-r border-white/10 flex flex-col transition-transform duration-300 transform md:static md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/2">
          <div className="flex items-center gap-2">
            <Sparkles className="text-indigo-400 fill-indigo-400/20" size={17} />
            <h3 className="font-semibold text-white text-sm tracking-wide">Saved Copy Desk</h3>
          </div>
          <button
            onClick={onClose}
            className="md:hidden p-1 text-slate-400 hover:text-white hover:bg-white/10 rounded-md transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Filter controls */}
        <div className="p-4 border-b border-white/10 space-y-3 bg-white/[0.01]">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search topic keywords..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white/5 border border-white/10 text-white placeholder-slate-400 rounded-lg focus:outline-hidden focus:border-indigo-400/50 focus:bg-white/10 transition-all font-sans"
            />
          </div>

          {/* Type quick-badges */}
          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => setTypeFilter("all")}
              className={`px-2 py-0.5 text-[10px] font-medium rounded-full transition-all cursor-pointer ${
                typeFilter === "all"
                  ? "bg-indigo-500 text-white shadow-xs shadow-indigo-500/20"
                  : "bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10"
              }`}
            >
              All Types
            </button>
            {Object.entries(CONTENT_TYPE_LABELS).map(([key, value]) => (
              <button
                key={key}
                onClick={() => setTypeFilter(key as ContentType)}
                className={`px-2 py-0.5 text-[10px] font-medium rounded-full transition-all cursor-pointer ${
                  typeFilter === key
                    ? "bg-indigo-500 text-white shadow-xs shadow-indigo-500/20"
                    : `${value.bg} ${value.text} border ${value.border} hover:bg-white/10`
                }`}
              >
                {value.label}
              </button>
            ))}
          </div>
        </div>

        {/* List of saved articles */}
        <div className="flex-1 overflow-y-auto divide-y divide-white/5">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-12 px-4 text-slate-400">
              <FileText className="mx-auto text-slate-500 mb-2" size={28} />
              <p className="text-xs font-medium text-slate-300">No copy works found</p>
              <p className="text-[10px] text-slate-500 mt-1 max-w-[180px] mx-auto">
                Generate content on the dashboard. They will automatically be cached here!
              </p>
            </div>
          ) : (
            filteredHistory.map((piece) => {
              const info = CONTENT_TYPE_LABELS[piece.contentType] || {
                label: "Content",
                bg: "bg-white/5",
                text: "text-slate-300",
                border: "border-white/10",
              };
              const dateStr = new Date(piece.timestamp).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });
              const isSelected = currentId === piece.id;

              return (
                <div
                  key={piece.id}
                  onClick={() => onSelectPiece(piece)}
                  className={`p-3.5 pr-2 flex items-start gap-2.5 cursor-pointer transition-all border-l-2 select-none group ${
                    isSelected
                      ? "bg-white/10 border-indigo-500 text-white"
                      : "border-transparent text-slate-300 hover:bg-white/5"
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span
                        className={`inline-flex px-1.5 py-0.5 text-[9px] font-medium rounded-sm border ${info.bg} ${info.text} ${info.border}`}
                      >
                        {info.label}
                      </span>
                      {piece.brandProfileName && (
                        <span className="inline-flex items-center gap-0.5 text-[9px] text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.5 rounded-sm">
                          {piece.brandProfileName}
                        </span>
                      )}
                    </div>

                    <h4 className="font-medium text-xs text-slate-200 truncate mt-1.5 group-hover:text-white">
                      {piece.topic}
                    </h4>

                    {/* Metadata line */}
                    <div className="flex items-center gap-2 mt-1.5 text-[9px] text-slate-400 font-sans">
                      <span className="flex items-center gap-0.5">
                        <Calendar size={10} />
                        {dateStr}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5">
                        <Hash size={10} />
                        {piece.metadata.wordCount} words
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => onDeletePiece(piece.id, e)}
                    className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-all self-center opacity-0 group-hover:opacity-100 focus:opacity-100"
                    title="Delete item"
                  >
                    <Trash2 size={12} />
                  </button>

                  <ChevronRight
                    size={14}
                    className={`self-center text-slate-400 transition-transform ${
                      isSelected ? "translate-x-0 text-white" : "-translate-x-1 group-hover:translate-x-0"
                    }`}
                  />
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
