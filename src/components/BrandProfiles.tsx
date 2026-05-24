import React, { useState } from "react";
import { Plus, Trash2, Edit2, ShieldCheck, X, Briefcase, Users, FileText, Ban } from "lucide-react";
import { BrandProfile } from "../types";

interface BrandProfilesProps {
  profiles: BrandProfile[];
  onAddProfile: (profile: Omit<BrandProfile, "id">) => void;
  onUpdateProfile: (profile: BrandProfile) => void;
  onDeleteProfile: (id: string) => void;
  selectedProfileId: string | null;
  onSelectProfile: (id: string | null) => void;
  onClose: () => void;
}

export default function BrandProfiles({
  profiles,
  onAddProfile,
  onUpdateProfile,
  onDeleteProfile,
  selectedProfileId,
  onSelectProfile,
  onClose,
}: BrandProfilesProps) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [audience, setAudience] = useState("");
  const [toneNotes, setToneNotes] = useState("");
  const [rules, setRules] = useState("");
  const [wordsToAvoid, setWordsToAvoid] = useState("");

  const resetForm = () => {
    setName("");
    setAudience("");
    setToneNotes("");
    setRules("");
    setWordsToAvoid("");
    setEditingId(null);
    setIsEditing(false);
  };

  const handleEditClick = (profile: BrandProfile) => {
    setEditingId(profile.id);
    setName(profile.name);
    setAudience(profile.audience);
    setToneNotes(profile.toneNotes);
    setRules(profile.rules);
    setWordsToAvoid(profile.wordsToAvoid || "");
    setIsEditing(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const data = {
      name: name.trim(),
      audience: audience.trim(),
      toneNotes: toneNotes.trim(),
      rules: rules.trim(),
      wordsToAvoid: wordsToAvoid.trim(),
    };

    if (editingId) {
      onUpdateProfile({ id: editingId, ...data });
    } else {
      onAddProfile(data);
    }
    resetForm();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
          <div>
            <h3 className="font-semibold text-lg text-neutral-900">Brand Voice Profiles</h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Maintain consistent brand personalities, target audiences, and vocabulary rules.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-600 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h4 className="font-medium text-sm text-neutral-800 border-b pb-2 border-neutral-100">
                {editingId ? "Edit Brand Details" : "Create New Brand Profile"}
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-600 mb-1">
                    Brand/Client Name *
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-400">
                      <Briefcase size={14} />
                    </span>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Acme Tech Corp"
                      className="w-full pl-9 pr-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-hidden focus:border-neutral-400 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-600 mb-1">
                    Target Audience / Niche
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-400">
                      <Users size={14} />
                    </span>
                    <input
                      type="text"
                      value={audience}
                      onChange={(e) => setAudience(e.target.value)}
                      placeholder="e.g. B2B SaaS startup founders"
                      className="w-full pl-9 pr-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-hidden focus:border-neutral-400 focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-600 mb-1">
                  Tone Notes & Personality (How does the brand sound?)
                </label>
                <div className="relative">
                  <span className="absolute top-2.5 left-3 text-neutral-400">
                    <FileText size={14} />
                  </span>
                  <textarea
                    rows={2}
                    value={toneNotes}
                    onChange={(e) => setToneNotes(e.target.value)}
                    placeholder="e.g. Friendly and witty yet authoritative. We speak like a smart peer, not a corporate textbook."
                    className="w-full pl-9 pr-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-hidden focus:border-neutral-400 focus:bg-white transition-all resize-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-600 mb-1">
                  Creative Direction & Writing Rules
                </label>
                <textarea
                  rows={3}
                  value={rules}
                  onChange={(e) => setRules(e.target.value)}
                  placeholder="e.g. Always write in the active voice. Use bullet points for complex topics. Close each piece of copy with an actionable next step rather than a generic summary."
                  className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-hidden focus:border-neutral-400 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-600 mb-1">
                  Words or Jargon to Avoid (Comma-separated)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-400">
                    <Ban size={14} />
                  </span>
                  <input
                    type="text"
                    value={wordsToAvoid}
                    onChange={(e) => setWordsToAvoid(e.target.value)}
                    placeholder="e.g., leverage, innovate, synergy, next-generation, revolutionize"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-hidden focus:border-neutral-400 focus:bg-white transition-all"
                  />
                </div>
                <p className="text-[10px] text-neutral-400 mt-1">
                  These words will be specifically avoided in the generated copy to prevent overused AI tropes.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-xs font-medium text-neutral-600 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg shadow-xs transition-colors"
                >
                  {editingId ? "Save Changes" : "Create Profile"}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-neutral-50 p-3 rounded-xl border border-neutral-100">
                <span className="text-xs font-medium text-neutral-600">
                  {profiles.length} profile{profiles.length !== 1 ? "s" : ""} saved locally
                </span>
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-1 text-xs font-medium text-neutral-900 bg-white border border-neutral-200 px-3 py-1.5 rounded-lg shadow-2xs hover:bg-neutral-50 transition-colors"
                >
                  <Plus size={14} />
                  Add Profile
                </button>
              </div>

              {profiles.length === 0 ? (
                <div className="text-center py-8 text-neutral-400">
                  <Briefcase className="mx-auto text-neutral-300 mb-2" size={32} />
                  <p className="text-sm">No custom brand profiles created yet</p>
                  <p className="text-xs text-neutral-500 mt-1">
                    Add a profile to capture specific audience personas and wording limits automatically.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {profiles.map((profile) => (
                    <div
                      key={profile.id}
                      onClick={() => onSelectProfile(profile.id === selectedProfileId ? null : profile.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        selectedProfileId === profile.id
                          ? "border-neutral-900 bg-neutral-50 shadow-2xs"
                          : "border-neutral-100 hover:border-neutral-300 hover:bg-neutral-50/50"
                      }`}
                    >
                      <div className="flex justify-between p-1">
                        <div className="flex items-center gap-2">
                          <h5 className="font-semibold text-sm text-neutral-900">{profile.name}</h5>
                          {selectedProfileId === profile.id && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] bg-neutral-900 text-white px-2 py-0.5 rounded-full font-medium">
                              <ShieldCheck size={10} /> Active Draft Guide
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditClick(profile);
                            }}
                            className="p-1 px-1.5 text-xs text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 rounded-md transition-colors"
                            title="Edit Profile"
                          >
                            <Edit2 size={12} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteProfile(profile.id);
                            }}
                            className="p-1 px-1.5 text-xs text-red-500 hover:bg-red-50 rounded-md transition-colors"
                            title="Delete Profile"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>

                      <div className="mt-2 text-xs text-neutral-600 grid grid-cols-1 sm:grid-cols-2 gap-2 border-t border-neutral-100/70 pt-2 font-sans">
                        <div>
                          <span className="font-medium text-neutral-800">Target Audience:</span>{" "}
                          {profile.audience || "N/A"}
                        </div>
                        <div>
                          <span className="font-medium text-neutral-800">Tone Concept:</span>{" "}
                          {profile.toneNotes || "N/A"}
                        </div>
                      </div>

                      {profile.wordsToAvoid && (
                        <div className="mt-2 text-[10px] text-neutral-500 font-mono flex items-center gap-1">
                          <span className="text-red-500 font-medium">Forbidden Words:</span>
                          <span className="truncate max-w-lg bg-neutral-100 px-1.5 py-0.5 rounded-sm">
                            {profile.wordsToAvoid}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-100/80 flex justify-end gap-2">
          {!isEditing && (
            <button
              onClick={onClose}
              className="px-5 py-2 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 rounded-lg transition-colors"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
