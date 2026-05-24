import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  FileText,
  Video,
  Instagram,
  Mail,
  ShoppingBag,
  BookOpen,
  Megaphone,
  Clock,
  Check,
  Copy,
  ChevronDown,
  Wand2,
  List,
  Heading,
  Bold,
  Italic,
  Link,
  RotateCcw,
  Gauge,
  TrendingUp,
  FileCheck2,
  Trash2,
  Plus,
  Compass,
} from "lucide-react";
import {
  ContentType,
  ToneType,
  LengthType,
  BrandProfile,
  GeneratedPiece,
  SeoKeyword,
} from "../types";

interface WritingWorkspaceProps {
  brandProfiles: BrandProfile[];
  onOpenBrandProfiles: () => void;
  activePiece: GeneratedPiece | null;
  onSavePiece: (piece: GeneratedPiece) => void;
  onClearActive: () => void;
}

const CONTENT_TYPES = [
  {
    id: "blog" as ContentType,
    label: "Blog Post",
    description: "Highly engaging, SEO-optimized articles with structured sections.",
    placeholder: "e.g. 10 Remote Work Wellness Habits for High Performers",
    icon: BookOpen,
    iconColor: "text-blue-500 bg-blue-50",
  },
  {
    id: "caption" as ContentType,
    label: "Social Instagram/FB",
    description: "Punchy, scroll-stopping social captions complete with relevant hashtags.",
    placeholder: "e.g. Announcing our new eco-friendly bamboo thermal mugs",
    icon: Instagram,
    iconColor: "text-pink-500 bg-pink-50",
  },
  {
    id: "script" as ContentType,
    label: "YouTube Video Script",
    description: "Detailed video timeline: Hook, intro body, visual guidelines, and CTA.",
    placeholder: "e.g. Why most software engineering startups fail in the first 6 months",
    icon: Video,
    iconColor: "text-red-500 bg-red-50",
  },
  {
    id: "productDescription" as ContentType,
    label: "Product Description",
    description: "Sensory, benefits-driven product copy that drives purchases.",
    placeholder: "e.g. Matte Black Ergonomic Standing Desk Pro Max",
    icon: ShoppingBag,
    iconColor: "text-purple-500 bg-purple-50",
  },
  {
    id: "email" as ContentType,
    label: "Email Newsletter/Sales",
    description: "Attention-grabbing subject lines with personalized, conversational body copy.",
    placeholder: "e.g. Offering a 20% loyalty discount to early adopters",
    icon: Mail,
    iconColor: "text-amber-500 bg-amber-50",
  },
  {
    id: "essay" as ContentType,
    label: "Essay / Authority Article",
    description: "Professional, structured, well-argued insights for research or columns.",
    placeholder: "e.g. The Socio-Economic Impact of Decentralized Energy Systems",
    icon: FileText,
    iconColor: "text-emerald-500 bg-emerald-50",
  },
  {
    id: "adCopy" as ContentType,
    label: "Direct Response Ad Copy",
    description: "Conversion-optimized ad headlines, primary texts, with urgent call-to-actions.",
    placeholder: "e.g. Dynamic Facebook ads for local physical therapy studio",
    icon: Megaphone,
    iconColor: "text-indigo-500 bg-indigo-50",
  },
];

const TONE_OPTIONS: { id: ToneType; label: string; emoji: string; desc: string }[] = [
  { id: "Persuasive", label: "Persuasive", emoji: "⚡", desc: "For selling & conversions" },
  { id: "Casual", label: "Casual & Friendly", emoji: "👋", desc: "Warm, peer-to-peer peers" },
  { id: "Professional", label: "Professional", emoji: "💼", desc: "Polished corporate voice" },
  { id: "Formal", label: "Formal & Scholarly", emoji: "📜", desc: "Academic and precise" },
  { id: "Emotional", label: "Emotional / Human", emoji: "❤️", desc: "Empathetic storyline style" },
  { id: "Bold", label: "Bold & Edgy", emoji: "🔥", desc: "Contrarian, energetic, raw" },
  { id: "Inspiring", label: "Inspiring", emoji: "🌟", desc: "Visionary, motivational style" },
  { id: "Technical", label: "Technical", emoji: "⚙️", desc: "Detail-heavy documentation" },
];

const PROGRESS_STAGES = [
  "Structuring custom system writing guardrails...",
  "Molding tone coordinates to your selection...",
  "Applying vocabulary exclusions (no generic AI filler)...",
  "Improving topic phrasing with magnetic alternative titles...",
  "Injecting high-potential semantic search SEO keywords...",
  "Simulating human writer logic passes...",
  "Assembling final editorial copy layout...",
];

export default function WritingWorkspace({
  brandProfiles,
  onOpenBrandProfiles,
  activePiece,
  onSavePiece,
  onClearActive,
}: WritingWorkspaceProps) {
  // Input State
  const [topic, setTopic] = useState("");
  const [contentType, setContentType] = useState<ContentType>("blog");
  const [tone, setTone] = useState<ToneType>("Persuasive");
  const [length, setLength] = useState<LengthType>("medium");
  const [selectedProfileId, setSelectedProfileId] = useState<string>("");
  const [additionalInstructions, setAdditionalInstructions] = useState("");

  // Editor and Workflow State
  const [isLoading, setIsLoading] = useState(false);
  const [progressIndex, setProgressIndex] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Active viewing panels
  const [activeTab, setActiveTab] = useState<"editor" | "titles" | "seo" | "analytics">("editor");
  const [editedBody, setEditedBody] = useState("");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load activePiece if provided
  useEffect(() => {
    if (activePiece) {
      setEditedBody(activePiece.generatedContent);
      setActiveTab("editor");
      // Load attributes back into settings in case they want a rewrite
      setTopic(activePiece.topic);
      setContentType(activePiece.contentType);
      setTone(activePiece.tone);
      setLength(activePiece.length);
      setSelectedProfileId(activePiece.brandProfileId || "");
    } else {
      setEditedBody("");
    }
  }, [activePiece]);

  // Loading milestone cycle loop
  useEffect(() => {
    let interval: any;
    if (isLoading) {
      setProgressIndex(0);
      interval = setInterval(() => {
        setProgressIndex((prev) => (prev < PROGRESS_STAGES.length - 1 ? prev + 1 : prev));
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleCreateCopy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsLoading(true);
    setErrorMsg(null);

    const activeProfile = brandProfiles.find((p) => p.id === selectedProfileId);
    let brandVoiceString = "";
    if (activeProfile) {
      brandVoiceString = `Brand/Client: ${activeProfile.name}. Audience: ${activeProfile.audience}. Tone Notes: ${activeProfile.toneNotes}. Directives: ${activeProfile.rules}. Forbidden words to skip: ${activeProfile.wordsToAvoid || "None"}.`;
    }

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topic.trim(),
          contentType,
          tone,
          length,
          brandVoice: brandVoiceString,
          additionalInstructions: additionalInstructions.trim(),
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server responded with ${response.status}`);
      }

      const data = await response.json();

      const newPiece: GeneratedPiece = {
        id: activePiece?.id || Date.now().toString(),
        topic: topic.trim(),
        contentType,
        tone,
        brandProfileId: activeProfile?.id,
        brandProfileName: activeProfile?.name,
        length,
        generatedContent: data.generatedContent,
        improvedTitles: data.improvedTitles || [],
        improvedHooks: data.improvedHooks || [],
        seoKeywords: data.seoKeywords || [],
        metadata: data.metadata || {
          wordCount: data.generatedContent.split(/\s+/).filter(Boolean).length,
          readingTimeMinutes: Math.max(1, Math.round(data.generatedContent.split(/\s+/).filter(Boolean).length / 225)),
          readabilityGrade: "Grade 9",
          toneSentiment: tone,
        },
        timestamp: new Date().toISOString(),
      };

      onSavePiece(newPiece);
      setEditedBody(data.generatedContent);
      setActiveTab("editor");
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "An error occurred during copy generation. Please verify your server connection.");
    } finally {
      setIsLoading(false);
    }
  };

  // Markdown helper buttons
  const applyMarkdown = (prefix: string, suffix: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    const originalText = textarea.value;
    const selectedText = originalText.substring(startPos, endPos);

    const replacement = prefix + selectedText + suffix;
    const updatedText =
      originalText.substring(0, startPos) +
      replacement +
      originalText.substring(endPos);

    setEditedBody(updatedText);

    // Save edited changes directly to active item if present
    if (activePiece) {
      onSavePiece({
        ...activePiece,
        generatedContent: updatedText,
      });
    }

    // Refocus & select
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        startPos + prefix.length,
        startPos + prefix.length + selectedText.length
      );
    }, 50);
  };

  const handleEditorChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newVal = e.target.value;
    setEditedBody(newVal);

    if (activePiece) {
      onSavePiece({
        ...activePiece,
        generatedContent: newVal,
      });
    }
  };

  // Auto-improved topic highlights
  const applySuggestedTitle = (title: string) => {
    setTopic(title);
    if (activePiece) {
      // Prompt user option
    }
  };

  const selectedTypeObj = CONTENT_TYPES.find((c) => c.id === contentType);

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-transparent px-4 md:px-8 py-6 overflow-y-auto">
      {/* Upper Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            AI Content Writing Workspace
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Adapt brand voice parameters, request copy variants, and polish output seamlessly.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onOpenBrandProfiles}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-200 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all font-medium cursor-pointer shadow-sm"
          >
            <Compass size={14} className="text-indigo-400" />
            Brand Voices ({brandProfiles.length})
          </button>

          {activePiece && (
            <button
              onClick={onClearActive}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs text-slate-200 bg-indigo-500/20 border border-indigo-500/30 hover:bg-indigo-500/35 rounded-lg transition-all"
            >
              <Plus size={14} /> Write New
            </button>
          )}
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-300 flex flex-col gap-2">
          <p className="font-semibold">Generation Interrupted</p>
          <p>{errorMsg}</p>
        </div>
      )}

      {/* Main Grid: Form Left, Output Workspace Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start relative z-10">
        {/* CONFIG COLUMN */}
        <div className="lg:col-span-5 bg-white/5 backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-2xl space-y-5">
          <h3 className="font-semibold text-white text-sm border-b border-white/10 pb-3 flex items-center gap-1.5">
            <Wand2 size={15} className="text-indigo-400" />
            Configure Generation
          </h3>

          <form onSubmit={handleCreateCopy} className="space-y-4">
            {/* Topic Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300 select-none">
                Core Topic / Prompt *
              </label>
              <textarea
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder={selectedTypeObj?.placeholder || "Describe the core topic..."}
                rows={3}
                className="w-full px-3 py-2 text-sm bg-white/5 border border-white/10 rounded-lg focus:outline-hidden focus:border-indigo-400/50 focus:bg-white/10 transition-all font-sans italic text-white placeholder-slate-400"
              />
              <p className="text-[10px] text-slate-400">
                Provide a basic, raw topic. We will improve titles, hooks, and keywords automatically.
              </p>
            </div>

            {/* Content Type Picker */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300 select-none">
                Copy Format Template
              </label>
              <div className="relative">
                <select
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value as ContentType)}
                  className="w-full appearance-none pl-3 pr-10 py-2.5 text-xs bg-white/5 border border-white/10 rounded-lg focus:outline-hidden focus:border-indigo-400/50 focus:bg-white/10 transition-all font-medium text-white [&>option]:bg-[#0c0e14] [&>option]:text-white"
                >
                  {CONTENT_TYPES.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="absolute right-3 top-3.5 text-slate-400 pointer-events-none"
                  size={14}
                />
              </div>
              <p className="text-[10px] text-slate-400 leading-normal bg-white/2 border border-white/5 p-2 rounded-md">
                {selectedTypeObj?.description}
              </p>
            </div>

            {/* Brand Profile selector */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-semibold text-slate-300 select-none">
                  Apply Brand Voice Instructions
                </label>
                <button
                  type="button"
                  onClick={onOpenBrandProfiles}
                  className="text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-0.5 cursor-pointer"
                >
                  <Plus size={10} /> Brand voice
                </button>
              </div>
              <div className="relative">
                <select
                  value={selectedProfileId}
                  onChange={(e) => setSelectedProfileId(e.target.value)}
                  className="w-full appearance-none pl-3 pr-10 py-2.5 text-xs bg-white/5 border border-white/10 rounded-lg focus:outline-hidden focus:border-indigo-400/50 focus:bg-white/10 transition-all font-medium text-white [&>option]:bg-[#0c0e14] [&>option]:text-white"
                >
                  <option value="">Matches raw tone selection only</option>
                  {brandProfiles.map((p) => (
                    <option key={p.id} value={p.id}>
                      ✨ Brand Style: {p.name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="absolute right-3 top-3.5 text-slate-400 pointer-events-none"
                  size={14}
                />
              </div>
            </div>

            {/* Twin row: Tone and Length */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300 select-none">
                  Core Persuasion Tone
                </label>
                <div className="relative">
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value as ToneType)}
                    className="w-full appearance-none pl-3 pr-10 py-2.5 text-xs bg-white/5 border border-white/10 rounded-lg focus:outline-hidden focus:border-indigo-400/50 focus:bg-white/10 transition-all font-medium text-white [&>option]:bg-[#0c0e14] [&>option]:text-white"
                  >
                    {TONE_OPTIONS.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.emoji} {t.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="absolute right-3 top-3.5 text-slate-400 pointer-events-none"
                    size={14}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300 select-none">
                  Estimated Length
                </label>
                <div className="relative">
                  <select
                    value={length}
                    onChange={(e) => setLength(e.target.value as LengthType)}
                    className="w-full appearance-none pl-3 pr-10 py-2.5 text-xs bg-white/5 border border-white/10 rounded-lg focus:outline-hidden focus:border-indigo-400/50 focus:bg-white/10 transition-all font-medium text-white [&>option]:bg-[#0c0e14] [&>option]:text-white"
                  >
                    <option value="short">Short & Punchy (~150-250 words)</option>
                    <option value="medium">Medium Master (~400-600 words)</option>
                    <option value="long">Deep Dive Blog (~800-1200 words)</option>
                  </select>
                  <ChevronDown
                    className="absolute right-3 top-3.5 text-slate-400 pointer-events-none"
                    size={14}
                  />
                </div>
              </div>
            </div>

            {/* Custom Instructions */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300 select-none">
                Additional Framing Directives (Optional)
              </label>
              <input
                type="text"
                value={additionalInstructions}
                onChange={(e) => setAdditionalInstructions(e.target.value)}
                placeholder="e.g. Include a short joke, use statistical examples, etc."
                className="w-full px-3 py-2 text-xs bg-white/5 border border-white/10 text-white placeholder-slate-400 rounded-lg focus:outline-hidden focus:border-indigo-400/50 focus:bg-white/10 transition-all"
              />
            </div>

            {/* Trigger Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 hover:shadow-indigo-500/40 transition-all font-sans tracking-wide cursor-pointer disabled:bg-white/5 disabled:text-slate-500 disabled:border-white/5 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
            >
              <Sparkles size={14} className="animate-pulse text-indigo-200" />
              {activePiece ? "Rewrite/Update Core Work" : "Draft Professional Copy"}
            </button>
          </form>
        </div>

        {/* WORKSPACE PREVIEW COLUMN */}
        <div className="lg:col-span-7 flex flex-col min-h-[500px]">
          {isLoading ? (
            /* Loading Container block */
            <div className="flex-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-2xl">
              <div className="relative mb-6">
                <div className="w-16 h-16 rounded-full border-t-2 border-r-2 border-indigo-500 animate-spin" />
                <Sparkles className="absolute inset-0 m-auto text-indigo-400 fill-indigo-400/20 animate-bounce" size={24} />
              </div>
              <h4 className="font-semibold text-white text-sm antialiased font-mono tracking-widest uppercase">
                COMPOSING ORIGINAL COPY
              </h4>
              <p className="text-xs text-slate-400 mt-1 max-w-sm leading-normal">
                Generating rich copy conforming strictly to content structure guidelines.
              </p>

              {/* Rolling Milestone stage list */}
              <div className="mt-8 border border-white/10 bg-white/5 p-4 rounded-xl max-w-md w-full">
                <span className="text-[10px] font-mono tracking-widest text-slate-400 block uppercase mb-2">
                  Status Log
                </span>
                <p className="text-xs text-indigo-300 font-medium font-sans">
                  {PROGRESS_STAGES[progressIndex]}
                </p>
                <div className="w-full bg-white/10 h-1 rounded-full mt-3 overflow-hidden">
                  <div
                    className="bg-indigo-500 h-1 transition-all duration-500"
                    style={{ width: `${((progressIndex + 1) / PROGRESS_STAGES.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ) : !editedBody ? (
            /* Empty Workspace Placeholder */
            <div className="flex-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-10 flex flex-col items-center justify-center text-center shadow-2xl">
              <div className="inline-flex p-3 bg-white/5 rounded-full border border-white/10 text-slate-400 mb-4 animate-pulse">
                <FileText size={42} />
              </div>
              <h4 className="font-semibold text-white text-sm">Workspace Ready</h4>
              <p className="text-xs text-slate-400 max-w-xs mt-1.5 leading-relaxed font-sans">
                Type your topic, select your templates, and click "Draft Copy" to let Gemini build high-performing drafts.
              </p>
              <div className="mt-6 flex flex-wrap gap-2 justify-center max-w-md select-none">
                <span className="px-2 py-1 text-[10px] text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 rounded-md">
                  ✓ SEO Strategy Keywords
                </span>
                <span className="px-2 py-1 text-[10px] text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 rounded-md">
                  ✓ 3 Magnetic Titles
                </span>
                <span className="px-2 py-1 text-[10px] text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 rounded-md">
                  ✓ 3 Scroll-Stopping Hooks
                </span>
                <span className="px-2 py-1 text-[10px] text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 rounded-md">
                  ✓ Custom Brand Voices
                </span>
              </div>
            </div>
          ) : (
            /* Completed/Loaded Work preview area */
            <div className="flex-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden flex flex-col shadow-2xl">
              {/* Header Tab panel */}
              <div className="flex border-b border-white/10 overflow-x-auto bg-white/5 select-none">
                <button
                  type="button"
                  onClick={() => setActiveTab("editor")}
                  className={`px-5 py-3.5 text-xs font-semibold border-b-2 transition-all cursor-pointer inline-flex items-center gap-1.5 shrink-0 ${
                    activeTab === "editor"
                      ? "border-indigo-500 text-white bg-white/5"
                      : "border-transparent text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <FileText size={13} />
                  Main Copy Editor
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("titles")}
                  className={`px-5 py-3.5 text-xs font-semibold border-b-2 transition-all cursor-pointer inline-flex items-center gap-1.5 shrink-0 ${
                    activeTab === "titles"
                      ? "border-indigo-500 text-white bg-white/5"
                      : "border-transparent text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Sparkles size={13} />
                  Improved Topics ({activePiece?.improvedTitles.length || 0})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("seo")}
                  className={`px-5 py-3.5 text-xs font-semibold border-b-2 transition-all cursor-pointer inline-flex items-center gap-1.5 shrink-0 relative ${
                    activeTab === "seo"
                      ? "border-indigo-500 text-white bg-white/5"
                      : "border-transparent text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <TrendingUp size={13} />
                  SEO Optimization
                  {activePiece?.seoKeywords && activePiece.seoKeywords.length > 0 && (
                    <span className="absolute top-2.5 right-1.5 w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("analytics")}
                  className={`px-5 py-3.5 text-xs font-semibold border-b-2 transition-all cursor-pointer inline-flex items-center gap-1.5 shrink-0 ${
                    activeTab === "analytics"
                      ? "border-indigo-500 text-white bg-white/5"
                      : "border-transparent text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Gauge size={13} />
                  Metrics & Insight
                </button>
              </div>

              {/* Tab views content */}
              <div className="p-5 flex-1 flex flex-col min-h-[420px] bg-transparent">
                {activeTab === "editor" && (
                  <div className="flex-1 flex flex-col space-y-3">
                    {/* Markdowns helpers format panel */}
                    <div className="flex items-center justify-between border-b border-white/10 pb-2 flex-wrap gap-2.5">
                      <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/5">
                        <button
                          type="button"
                          onClick={() => applyMarkdown("### ", "")}
                          className="p-1 px-1.5 hover:bg-white/10 text-slate-300 hover:text-white rounded-md transition-colors cursor-pointer"
                          title="Heading"
                        >
                          <Heading size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => applyMarkdown("**", "**")}
                          className="p-1 px-1.5 hover:bg-white/10 text-slate-300 hover:text-white rounded-md transition-colors cursor-pointer"
                          title="Bold Text"
                        >
                          <Bold size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => applyMarkdown("*", "*")}
                          className="p-1 px-1.5 hover:bg-white/10 text-slate-300 hover:text-white rounded-md transition-colors cursor-pointer"
                          title="Italic"
                        >
                          <Italic size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => applyMarkdown("- ", "")}
                          className="p-1 px-1.5 hover:bg-white/10 text-slate-300 hover:text-white rounded-md transition-colors cursor-pointer"
                          title="Unordered list"
                        >
                          <List size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => applyMarkdown("[", "](url)")}
                          className="p-1 px-1.5 hover:bg-white/10 text-slate-300 hover:text-white rounded-md transition-colors cursor-pointer"
                          title="Insert link anchor"
                        >
                          <Link size={14} />
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <span className="font-mono bg-white/5 border border-white/5 px-2 py-0.5 rounded-sm">
                          {editedBody.split(/\s+/).filter(Boolean).length} words
                        </span>
                        <span>•</span>
                        <span className="font-mono bg-white/5 border border-white/5 px-2 py-0.5 rounded-sm">
                          {editedBody.length} chars
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm("Are you sure you want to revert changes? This restores the generated source.")) {
                              setEditedBody(activePiece?.generatedContent || "");
                            }
                          }}
                          className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors ml-1 cursor-pointer"
                          title="Restore Original Content"
                        >
                          <RotateCcw size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCopyText(editedBody, "main_body")}
                          className="inline-flex items-center gap-1 bg-indigo-500 hover:bg-indigo-600 text-white px-2.5 py-1.5 rounded-md text-[11px] font-semibold transition-colors cursor-pointer shadow-md shadow-indigo-500/10"
                        >
                          {copiedField === "main_body" ? <Check size={11} /> : <Copy size={11} />}
                          {copiedField === "main_body" ? "Copied" : "Copy Content"}
                        </button>
                      </div>
                    </div>

                    {/* Styled textarea */}
                    <textarea
                      ref={textareaRef}
                      value={editedBody}
                      onChange={handleEditorChange}
                      rows={14}
                      className="w-full flex-1 p-3.5 text-sm bg-white/3 border border-white/10 rounded-xl focus:outline-hidden focus:border-indigo-400/50 focus:bg-white/5 font-sans leading-relaxed tracking-wide placeholder-slate-500 text-white resize-y"
                    />
                    <p className="text-[10px] text-slate-500 text-right">
                      💡 Tip: Use the formatting toolbar above, or edit Markdown directly. Changes are auto-saved!
                    </p>
                  </div>
                )}

                {activeTab === "titles" && (
                  <div className="space-y-6">
                    {/* Alternate Heading suggestions */}
                    <div>
                      <h4 className="text-xs font-semibold text-white tracking-widest uppercase mb-3 flex items-center gap-2 select-none">
                        <span className="w-1 h-3 bg-indigo-500 rounded-full"></span>
                        🎯 Automatic Topic Improvement Titles
                      </h4>
                      <p className="text-xs text-slate-400 mb-4">
                        We refined your topic into these headlines. Click any headline to insert it as your active prompt!
                      </p>
                      <div className="space-y-2">
                        {activePiece?.improvedTitles && activePiece.improvedTitles.length > 0 ? (
                          activePiece.improvedTitles.map((title, id) => (
                            <div
                              key={id}
                              onClick={() => applySuggestedTitle(title)}
                              className="p-3 bg-white/5 border border-white/10 rounded-xl hover:border-indigo-500/50 hover:bg-white/10 cursor-pointer flex justify-between items-center group transition-all"
                            >
                              <span className="text-xs font-semibold text-slate-200 pr-4 group-hover:text-white">
                                {title}
                              </span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopyText(title, `title_${id}`);
                                }}
                                className="p-1 px-1.5 text-[10px] text-slate-300 bg-white/5 border border-white/10 rounded-md hover:text-white hover:bg-[#0c0e14] transition-all font-mono cursor-pointer"
                              >
                                {copiedField === `title_${id}` ? "Copied!" : "Copy"}
                              </button>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-slate-500 italic">No alternative headlines available.</p>
                        )}
                      </div>
                    </div>

                    {/* Opening Hooks cards */}
                    <div>
                      <h4 className="text-xs font-semibold text-white tracking-widest uppercase mb-3 flex items-center gap-2 select-none">
                        <span className="w-1 h-3 bg-indigo-500 rounded-full"></span>
                        🔗 Magnetic Opening Hooks
                      </h4>
                      <p className="text-xs text-slate-400 mb-4">
                        Grab attention in social posts, articles, or scripts with these high-converting hooks:
                      </p>
                      <div className="space-y-3">
                        {activePiece?.improvedHooks && activePiece.improvedHooks.length > 0 ? (
                          activePiece.improvedHooks.map((hook, id) => (
                            <div
                              key={id}
                              className="p-3 bg-white/2 border border-white/15 rounded-xl relative group hover:border-[#ffffff20] transition-colors"
                            >
                              <p className="text-xs leading-relaxed text-slate-300 italic pr-8">
                                "{hook}"
                              </p>
                              <button
                                type="button"
                                onClick={() => handleCopyText(hook, `hook_${id}`)}
                                className="absolute right-3 top-3 p-1 text-slate-400 hover:text-white rounded-md transition-colors cursor-pointer"
                                title="Copy Hook"
                              >
                                {copiedField === `hook_${id}` ? (
                                  <Check size={11} className="text-indigo-400" />
                                ) : (
                                  <Copy size={11} />
                                )}
                              </button>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-slate-500 italic">No alternative hooks generated.</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "seo" && (
                  <div className="space-y-5">
                    <div>
                      <h4 className="text-xs font-semibold text-white tracking-widest uppercase mb-1.5 flex items-center gap-2 select-none">
                        <span className="w-1 h-3 bg-indigo-500 rounded-full"></span>
                        🔑 Auto-Generated SEO Keyword Pool
                      </h4>
                      <p className="text-xs text-slate-400 mb-4">
                        High-performing semantic terms to weave into your text to capture relevant search traffic.
                      </p>

                      <div className="border border-white/10 rounded-xl overflow-hidden shadow-2xl bg-white/3">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-white/5 text-slate-300 font-semibold border-b border-white/10 select-none">
                              <th className="p-3">Target Keyword Term</th>
                              <th className="p-3 text-center">Rank Difficulty</th>
                              <th className="p-3 text-center">Search Intent Category</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {activePiece?.seoKeywords && activePiece.seoKeywords.length > 0 ? (
                              activePiece.seoKeywords.map((item, id) => (
                                <tr key={id} className="hover:bg-white/5 transition-colors">
                                  <td className="p-3 font-semibold text-slate-200 font-mono text-[11px] flex items-center justify-between group">
                                    <span>{item.keyword}</span>
                                    <button
                                      type="button"
                                      onClick={() => handleCopyText(item.keyword, `seo_${id}`)}
                                      className="p-1 px-1.5 text-[9px] bg-white/10 text-slate-300 hover:bg-indigo-500 hover:text-white rounded-md font-sans opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all font-medium cursor-pointer"
                                    >
                                      {copiedField === `seo_${id}` ? "Copied" : "Copy"}
                                    </button>
                                  </td>
                                  <td className="p-3 text-center text-[11px]">
                                    <span
                                      className={`inline-block px-2.5 py-0.5 rounded-full font-medium border ${
                                        item.difficulty?.toLowerCase() === "low"
                                          ? "bg-green-500/15 text-green-300 border-green-500/20"
                                          : item.difficulty?.toLowerCase() === "medium"
                                          ? "bg-amber-500/15 text-amber-300 border-amber-500/20"
                                          : "bg-red-500/15 text-red-300 border-red-500/20"
                                      }`}
                                    >
                                      {item.difficulty || "Medium"}
                                    </span>
                                  </td>
                                  <td className="p-3 text-center text-[11px] font-sans font-medium text-slate-400 font-sans">
                                    {item.intent || "Informational"}
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={3} className="p-4 text-center text-slate-500 italic">
                                  No semantic keywords registered.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="bg-indigo-500/10 p-4 rounded-xl border border-indigo-500/20">
                      <h5 className="font-semibold text-xs text-indigo-300 mb-1">
                        💡 How To Optimize This Copy:
                      </h5>
                      <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                        Ensure you weave the generated terms naturally within the first 100 words of the text,
                        inside at least one secondary subheading (H2/H3), and in the meta title structure.
                        Avoid bulk-stuffing. Make readability a priority!
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === "analytics" && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xs font-semibold text-white tracking-widest uppercase mb-1.5 flex items-center gap-2 select-none">
                        <span className="w-1 h-3 bg-indigo-500 rounded-full"></span>
                        📊 Written Copy Demographics & Insights
                      </h4>
                      <p className="text-xs text-slate-400 mb-4 font-sans">
                        Critical scores highlighting structural health, user accessibility, and tone accuracy.
                      </p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 select-none">
                        {/* Word count block */}
                        <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex flex-col justify-between">
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                            Word Count
                          </span>
                          <span className="text-2xl font-bold text-indigo-400 font-mono mt-2 block">
                            {activePiece?.metadata.wordCount || 0}
                          </span>
                        </div>

                        {/* Reading Time block */}
                        <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex flex-col justify-between">
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                            Est. Reading Time
                          </span>
                          <span className="text-2xl font-bold text-indigo-400 font-mono mt-2 block flex items-baseline gap-1">
                            {activePiece?.metadata.readingTimeMinutes || 1}
                            <span className="text-xs text-slate-500 font-normal font-sans">min</span>
                          </span>
                        </div>

                        {/* Readability level block */}
                        <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex flex-col justify-between">
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                            Readability Grade
                          </span>
                          <span className="text-sm font-semibold text-slate-200 mt-2 block">
                            {activePiece?.metadata.readabilityGrade || "Grade 8"}
                          </span>
                        </div>

                        {/* Tone Analysis block */}
                        <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex flex-col justify-between">
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                            Estimated Cadence
                          </span>
                          <span className="text-xs font-semibold text-slate-200 mt-2 block">
                            {activePiece?.metadata.toneSentiment || "Enthusiastic"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-indigo-500/10 p-4 rounded-xl border border-indigo-500/20 text-slate-300">
                      <h5 className="font-semibold text-xs text-indigo-300 mb-1.5 flex items-center gap-1">
                        <FileCheck2 size={14} className="text-indigo-400" />
                        Tone Sentiment Quality Audit
                      </h5>
                      <p className="text-[11px] font-sans leading-relaxed text-slate-300">
                        The current phrasing conforms to the <strong>{activePiece?.tone}</strong> style. Brand Voice limits
                        were successfully referenced, focusing on crisp clarity that reads like authentic human voice!
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
