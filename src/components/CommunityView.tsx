import React, { useState } from 'react';
import { MessageSquare, Send, CheckCircle2, Plus, ThumbsUp, Eye, UserCheck, ShieldCheck } from 'lucide-react';
import { COMMUNITY_DISCUSSIONS } from '../data/civilData';
import { CommunityDiscussion } from '../types';

export const CommunityView: React.FC = () => {
  const [discussions, setDiscussions] = useState<CommunityDiscussion[]>(COMMUNITY_DISCUSSIONS);
  const [showAskModal, setShowAskModal] = useState(false);
  const [doubtTitle, setDoubtTitle] = useState('');
  const [doubtUnit, setDoubtUnit] = useState('Unit 1 • L3');
  const [doubtDetails, setDoubtDetails] = useState('');
  const [copiedChannel, setCopiedChannel] = useState(false);
  const [copiedWhatsApp, setCopiedWhatsApp] = useState(false);

  const handleSubmitDoubt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doubtTitle.trim() || !doubtDetails.trim()) return;

    const newDisc: CommunityDiscussion = {
      id: `disc-${Date.now()}`,
      author: 'You (Student)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      unitTag: doubtUnit,
      title: doubtTitle,
      excerpt: doubtDetails,
      replies: 0,
      views: 1,
      timeAgo: 'Just now',
      verifiedByTutor: false
    };

    setDiscussions([newDisc, ...discussions]);
    setDoubtTitle('');
    setDoubtDetails('');
    setShowAskModal(false);
  };

  return (
    <div className="py-4 space-y-6">
      {/* Community Banner */}
      <div className="bg-gradient-to-br from-slate-900 to-emerald-950 text-white p-5 rounded-2xl border border-slate-800 shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
            15,420 Active Civil Students
          </span>
        </div>
        <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-white mb-2">
          BTEC Civil Engineering Student Hub
        </h2>
        <p className="text-xs text-slate-300 leading-relaxed mb-4">
          Connect with UK college students, HNC/HND cohorts, and qualified civil engineering tutors for coursework IV prep, calculation queries, and distinction portfolio checks.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <button
            onClick={() => {
              setCopiedChannel(true);
              setTimeout(() => setCopiedChannel(false), 2000);
            }}
            className="py-2.5 px-3.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer border border-slate-700"
          >
            <Send className="w-4 h-4 text-sky-400" />
            <span>{copiedChannel ? 'Link: t.me/BTECCivilNotes' : 'Join Telegram Group'}</span>
          </button>
          <button
            onClick={() => {
              setCopiedWhatsApp(true);
              setTimeout(() => setCopiedWhatsApp(false), 2000);
            }}
            className="py-2.5 px-3.5 bg-[#185a36] hover:bg-[#13492c] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{copiedWhatsApp ? 'Opening Tutor WhatsApp...' : 'WhatsApp Tutor Desk'}</span>
          </button>
        </div>
      </div>

      {/* Discussion List Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Coursework Q&amp;A &amp; IV Discussion
          </h3>
          <p className="text-xs text-slate-500">
            Recent queries reviewed by tutors and top scoring students
          </p>
        </div>

        <button
          onClick={() => setShowAskModal(true)}
          className="px-3.5 py-1.5 bg-[#185a36] hover:bg-[#13492c] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Ask Doubt</span>
        </button>
      </div>

      {/* Discussions Feed */}
      <div className="space-y-3">
        {discussions.map((item) => (
          <div
            key={item.id}
            className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-2.5 hover:border-slate-300 transition-all"
          >
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900">{item.author}</span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-400">{item.timeAgo}</span>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-bold text-slate-700 border border-slate-200/60">
                {item.unitTag}
              </span>
            </div>

            <h4 className="text-sm font-bold text-slate-900 leading-snug">
              {item.title}
            </h4>

            <p className="text-xs text-slate-600 leading-relaxed">
              {item.excerpt}
            </p>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                  <span>{item.replies} replies</span>
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-slate-400" />
                  <span>{item.views}</span>
                </span>
              </div>

              {item.verifiedByTutor && (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                  <span>Tutor Verified</span>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Ask Doubt Modal */}
      {showAskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>Post Coursework / Calculation Query</span>
              </h3>
              <button
                onClick={() => setShowAskModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitDoubt} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Related Unit
                </label>
                <select
                  value={doubtUnit}
                  onChange={(e) => setDoubtUnit(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:border-slate-400"
                >
                  <option value="Unit 1 • L3">Unit 1: Construction Principles (Structural Mechanics)</option>
                  <option value="Unit 2 - L3">Unit 2: Construction Design &amp; Surveying</option>
                  <option value="Unit 3 • L3">Unit 3: Construction Technology &amp; Substructures</option>
                  <option value="Unit 4 • L3">Unit 4: Health, Safety &amp; Welfare in Construction</option>
                  <option value="Unit 29 • HND">Unit 29: Further Mathematics in Civil Engineering</option>
                  <option value="Unit 30 • HNC">Unit 30: Geotechnics &amp; Soil Mechanics</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Question Summary
                </label>
                <input
                  type="text"
                  required
                  value={doubtTitle}
                  onChange={(e) => setDoubtTitle(e.target.value)}
                  placeholder="e.g. How to verify cantilever beam deflection limit under SLS?"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Detailed Calculation / Brief Context
                </label>
                <textarea
                  required
                  rows={4}
                  value={doubtDetails}
                  onChange={(e) => setDoubtDetails(e.target.value)}
                  placeholder="Mention your calculations, formula used, or assessor feedback so our tutors can review accurately..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-slate-400 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAskModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#185a36] hover:bg-[#13492c] text-white text-xs font-semibold rounded-lg cursor-pointer"
                >
                  Submit Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
