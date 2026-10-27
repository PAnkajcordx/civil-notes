import React, { useState } from 'react';
import { Send, MessageSquare, Check, GraduationCap } from 'lucide-react';

interface CommunitySectionProps {
  onJoinTelegram?: () => void;
  onJoinWhatsApp?: () => void;
}

export const CommunitySection: React.FC<CommunitySectionProps> = ({
  onJoinTelegram,
  onJoinWhatsApp
}) => {
  const [telegramCopied, setTelegramCopied] = useState(false);
  const [whatsappCopied, setWhatsappCopied] = useState(false);

  const handleTelegramClick = () => {
    if (onJoinTelegram) {
      onJoinTelegram();
    } else {
      setTelegramCopied(true);
      setTimeout(() => setTelegramCopied(false), 2200);
    }
  };

  const handleWhatsAppClick = () => {
    if (onJoinWhatsApp) {
      onJoinWhatsApp();
    } else {
      setWhatsappCopied(true);
      setTimeout(() => setWhatsappCopied(false), 2200);
    }
  };

  return (
    <div className="my-6 rounded-2xl bg-white p-5 border border-slate-200/90 shadow-2xs relative overflow-hidden">
      {/* Decorative light green background glow */}
      <div className="absolute -right-8 -top-8 w-32 h-32 bg-emerald-50 rounded-full blur-2xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-start text-left">
        {/* Header Icon + Title */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <GraduationCap className="w-5 h-5 stroke-[2]" />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            Join 15,000+ BTEC Civil Students
          </h2>
        </div>

        {/* Subtitle */}
        <p className="text-xs text-slate-500 leading-relaxed mb-4">
          Peer coursework support, internal verification (IV) prep, Pearson distinction exemplars &amp; assignment doubt clearing directly with qualified tutors.
        </p>

        {/* Two Action Buttons */}
        <div className="w-full space-y-2.5">
          {/* Telegram Channel Button */}
          <button
            onClick={handleTelegramClick}
            className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
          >
            {telegramCopied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">Invite Link Copied: @BTECCivilNotes</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4 text-sky-600 -rotate-12" />
                <span>Join BTEC Civil Telegram Channel</span>
              </>
            )}
          </button>

          {/* WhatsApp Button */}
          <button
            onClick={handleWhatsAppClick}
            className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#185a36] hover:bg-[#13492c] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
          >
            {whatsappCopied ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>Opening Tutor Helpline...</span>
              </>
            ) : (
              <>
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Assignment Help &amp; Exemplars</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
