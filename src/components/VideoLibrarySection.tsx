import React, { useState } from 'react';
import { 
  Video, 
  Download, 
  Play, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ShieldCheck, 
  ExternalLink, 
  PlusCircle, 
  FileCheck,
  Search,
  BookOpen
} from 'lucide-react';
import { CivilVideo, PaymentTransaction } from '../types';
import { CIVIL_VIDEOS } from '../data/videoData';
import { isVideoPaid } from '../utils/videoPaymentHelper';

interface VideoLibrarySectionProps {
  onSelectVideoForPaywall: (video: CivilVideo) => void;
}

export const VideoLibrarySection: React.FC<VideoLibrarySectionProps> = ({
  onSelectVideoForPaywall
}) => {
  const [customVideoTitle, setCustomVideoTitle] = useState('');
  const [customVideoTopic, setCustomVideoTopic] = useState('');
  const [previewingVideo, setPreviewingVideo] = useState<CivilVideo | null>(null);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);

  const handleCustomVideoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customVideoTitle.trim()) return;

    const customVideo: CivilVideo = {
      id: 'custom-' + Date.now().toString(36),
      title: customVideoTitle.trim(),
      unitCodeTag: customVideoTopic ? customVideoTopic : 'Custom Request',
      duration: '45+ min Full Masterclass',
      quality: '1080p Full HD • High Bitrate',
      fileSize: '350 - 500 MB',
      tutorName: 'CivilNotes Accredited Engineering Faculty',
      description: `Custom requested civil engineering coursework video & lecture recording for: "${customVideoTitle}". Includes full calculation steps, assignment guide, and offline download package.`,
      priceINR: 49,
      thumbnailColor: 'from-emerald-700 to-slate-900',
      topicsCovered: [
        'Dedicated Lecture Walkthrough for ' + customVideoTitle,
        'Step-by-step Numerical Problems & Formula Application',
        'British & European Code Guidelines',
        'Downloadable Calculation Sheets & Companion Notes'
      ]
    };

    onSelectVideoForPaywall(customVideo);
    setCustomVideoTitle('');
    setCustomVideoTopic('');
  };

  return (
    <section className="mt-8 space-y-6">
      {/* Section Header */}
      <div className="bg-gradient-to-r from-slate-900 via-[#123d24] to-slate-900 rounded-2xl p-5 sm:p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Universal ₹49 Video Masterclasses</span>
          </div>
          
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Download Any Civil Engineering Video for ₹49
          </h2>
          
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            High-definition video lectures, field surveying procedures, and laboratory demonstrations. 
            Pay ₹49 once via UPI / Card for lifetime offline download access.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-emerald-200">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Direct High-Speed MP4
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Pearson BTEC Aligned
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Tax Receipt &amp; Token
            </span>
          </div>
        </div>
      </div>

      {/* Universal "Download Any Custom Video" Box */}
      <div className="bg-white rounded-2xl p-5 border-2 border-emerald-600/30 shadow-md">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
            <PlusCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Universal Video Downloader • Any Video for ₹49
            </h3>
            <p className="text-xs text-slate-500">
              Need a video that is not listed below? Paste any YouTube, NPTEL, lecture URL or civil topic title here:
            </p>
          </div>
        </div>

        <form onSubmit={handleCustomVideoSubmit} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="e.g. Concrete Mix Design Lab Video, or paste any video link..."
                value={customVideoTitle}
                onChange={(e) => setCustomVideoTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition"
              />
            </div>
            <div className="sm:w-44">
              <input
                type="text"
                placeholder="Unit/Tag (e.g. Unit 3)"
                value={customVideoTopic}
                onChange={(e) => setCustomVideoTopic(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition"
              />
            </div>
            <button
              type="submit"
              disabled={!customVideoTitle.trim()}
              className="py-2.5 px-5 bg-[#185a36] hover:bg-[#13492c] disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shrink-0 shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Unlock for ₹49</span>
            </button>
          </div>
        </form>
      </div>

      {/* Video Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Video className="w-4 h-4 text-emerald-700" />
            <span>Featured BTEC Civil Masterclasses (₹49 each)</span>
          </h3>
          <span className="text-xs text-slate-500">
            {CIVIL_VIDEOS.length} Lectures Available
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CIVIL_VIDEOS.map((video) => {
            const isPaid = isVideoPaid(video.id);

            return (
              <div 
                key={video.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col"
              >
                {/* Video Card Header / Mock Thumbnail */}
                <div className={`p-4 bg-gradient-to-br ${video.thumbnailColor} text-white relative`}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-xs text-[11px] font-bold text-white">
                      {video.unitCodeTag}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500 text-[10px] font-bold text-white uppercase tracking-wider">
                      {isPaid ? 'Unlocked' : '₹49 Only'}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white mt-2 leading-snug line-clamp-2">
                    {video.title}
                  </h4>

                  <div className="mt-3 flex items-center gap-3 text-[11px] text-white/80">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {video.duration}
                    </span>
                    <span>•</span>
                    <span>{video.quality}</span>
                    <span>•</span>
                    <span>{video.fileSize}</span>
                  </div>

                  {/* Play Simulation Button */}
                  <button
                    onClick={() => {
                      setPreviewingVideo(video);
                      setIsPlayingPreview(true);
                    }}
                    className="absolute right-4 bottom-4 w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md flex items-center justify-center text-white cursor-pointer transition transform hover:scale-105"
                    title="Watch Preview Trailer"
                  >
                    <Play className="w-4 h-4 fill-white ml-0.5" />
                  </button>
                </div>

                {/* Video Card Body */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <p className="text-xs text-slate-600 line-clamp-2">
                      {video.description}
                    </p>

                    <div className="mt-2.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Topics Covered:
                      </span>
                      <ul className="space-y-1">
                        {video.topicsCovered.slice(0, 2).map((topic, i) => (
                          <li key={i} className="text-[11px] text-slate-700 flex items-start gap-1.5">
                            <span className="text-emerald-600 font-bold shrink-0">✓</span>
                            <span className="truncate">{topic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Tutor info & Download Button */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                    <div className="truncate">
                      <span className="text-[10px] text-slate-400 block">Instructor</span>
                      <span className="text-xs font-semibold text-slate-800 truncate block">
                        {video.tutorName}
                      </span>
                    </div>

                    <button
                      onClick={() => onSelectVideoForPaywall(video)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
                        isPaid
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-[#185a36] text-white hover:bg-[#13492c] shadow-xs'
                      }`}
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{isPaid ? 'Re-Download' : 'Download (₹49)'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Video Trailer / Preview Modal */}
      {previewingVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
          <div 
            className="bg-slate-900 text-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                  Lecture Trailer Preview
                </span>
                <h3 className="text-sm font-bold text-white truncate max-w-md">
                  {previewingVideo.title}
                </h3>
              </div>
              <button
                onClick={() => setPreviewingVideo(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Video Player Mock */}
            <div className="aspect-video bg-black relative flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />
              
              <div className="text-center p-6 z-10 max-w-md">
                <div className="w-16 h-16 rounded-full bg-emerald-600/90 hover:bg-emerald-500 text-white flex items-center justify-center mx-auto mb-3 shadow-lg cursor-pointer transform hover:scale-105 transition">
                  <Play className="w-7 h-7 fill-white ml-1" />
                </div>
                <h4 className="text-base font-bold text-white">{previewingVideo.title}</h4>
                <p className="text-xs text-slate-300 mt-1">
                  Full 1080p 60fps walkthrough available with complete distinction calculation templates.
                </p>
                <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs text-emerald-300">
                  <span>Duration: {previewingVideo.duration}</span>
                  <span>•</span>
                  <span>Size: {previewingVideo.fileSize}</span>
                </div>
              </div>

              {/* Player scrub bar mock */}
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent flex items-center gap-3 text-xs text-slate-300">
                <Play className="w-3.5 h-3.5 fill-current" />
                <div className="flex-1 h-1 bg-slate-700 rounded-full overflow-hidden">
                  <div className="w-1/3 h-full bg-emerald-500" />
                </div>
                <span className="text-[10px] font-mono">15:20 / {previewingVideo.duration}</span>
              </div>
            </div>

            {/* Modal Footer with ₹49 Download CTA */}
            <div className="p-4 bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-center sm:text-left">
                <div className="text-xs text-slate-400">Unlock the complete HD lecture offline</div>
                <div className="text-sm font-bold text-emerald-400">₹49 INR • Lifetime Single License</div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => {
                    const v = previewingVideo;
                    setPreviewingVideo(null);
                    onSelectVideoForPaywall(v);
                  }}
                  className="flex-1 sm:flex-none py-2.5 px-5 bg-[#185a36] hover:bg-[#13492c] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Full Video (₹49)</span>
                </button>
                <button
                  onClick={() => setPreviewingVideo(null)}
                  className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
