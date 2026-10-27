import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  Download, 
  QrCode, 
  Smartphone, 
  CreditCard, 
  Copy, 
  Check, 
  Clock, 
  Video, 
  FileCheck, 
  Sparkles,
  ArrowRight,
  AlertCircle,
  Building2
} from 'lucide-react';
import { CivilVideo, PaymentTransaction } from '../types';
import { 
  isVideoPaid, 
  recordVideoPurchase, 
  downloadUnlockedVideoPackage 
} from '../utils/videoPaymentHelper';

interface VideoPaywallModalProps {
  video: CivilVideo | null;
  onClose: () => void;
  onSuccess?: (video: CivilVideo, txn: PaymentTransaction) => void;
}

export const VideoPaywallModal: React.FC<VideoPaywallModalProps> = ({
  video,
  onClose,
  onSuccess
}) => {
  const [activePaymentMethod, setActivePaymentMethod] = useState<'upi_qr' | 'upi_apps' | 'cards' | 'netbanking'>('upi_qr');
  const [selectedUpiApp, setSelectedUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'bhim'>('gpay');
  const [customUpiId, setCustomUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [selectedBank, setSelectedBank] = useState('sbi');
  const [isCopied, setIsCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState<string>('');
  const [completedTxn, setCompletedTxn] = useState<PaymentTransaction | null>(null);
  const [alreadyUnlocked, setAlreadyUnlocked] = useState(false);

  const merchantUpiId = 'civilnotes.btec@okaxis';
  const priceINR = video?.priceINR || 49;

  useEffect(() => {
    if (video) {
      const paid = isVideoPaid(video.id);
      setAlreadyUnlocked(paid);
    }
  }, [video]);

  if (!video) return null;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(merchantUpiId);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSimulatePayment = (methodType: 'upi' | 'card' | 'netbanking', appName?: string) => {
    setIsProcessing(true);
    setProcessStep('Connecting to Payment Gateway...');

    setTimeout(() => {
      setProcessStep('Verifying transaction for ₹' + priceINR + ' with NPCI...');
    }, 900);

    setTimeout(() => {
      setProcessStep('Generating secure download token & license...');
    }, 1800);

    setTimeout(() => {
      const txn = recordVideoPurchase(video, methodType, {
        app: appName || (methodType === 'upi' ? selectedUpiApp.toUpperCase() : undefined),
        upiId: customUpiId || merchantUpiId
      });

      setIsProcessing(false);
      setCompletedTxn(txn);
      setAlreadyUnlocked(true);

      // Auto trigger download
      downloadUnlockedVideoPackage(video, txn);

      if (onSuccess) {
        onSuccess(video, txn);
      }
    }, 2600);
  };

  const handleDownloadAgain = () => {
    downloadUnlockedVideoPackage(video);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl w-full max-w-xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-[#123d24] text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5 min-w-0 pr-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0">
              <Video className="w-4 h-4" />
            </span>
            <div className="truncate">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-600 text-white">
                  Pay &amp; Download
                </span>
                <span className="text-xs text-emerald-300 font-medium">Standard ₹49 Plan</span>
              </div>
              <h3 className="text-sm font-bold text-white truncate mt-0.5">
                {video.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* If already unlocked or just purchased */}
          {(alreadyUnlocked || completedTxn) ? (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-base font-bold text-emerald-900">
                  {completedTxn ? 'Payment of ₹49.00 Successful!' : 'Video Unlocked & Licensed!'}
                </h4>
                <p className="text-xs text-emerald-800 mt-1 max-w-md mx-auto">
                  You have full lifetime offline access to this Civil Engineering video masterclass and accompanying calculation guide.
                </p>

                {completedTxn && (
                  <div className="mt-3 py-2 px-3 bg-white rounded-lg border border-emerald-200 text-left font-mono text-[11px] text-slate-700 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Transaction ID:</span>
                      <span className="font-semibold text-emerald-800">{completedTxn.txnId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Amount Paid:</span>
                      <span className="font-semibold">₹{completedTxn.amountINR}.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Date &amp; Time:</span>
                      <span>{completedTxn.timestamp}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Gateway Status:</span>
                      <span className="text-emerald-600 font-bold">VERIFIED (NPCI)</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Video Details Card */}
              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                      {video.unitCodeTag}
                    </span>
                    <h5 className="font-semibold text-slate-900 text-xs mt-1.5">{video.title}</h5>
                    <p className="text-[11px] text-slate-500 mt-0.5">{video.tutorName}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {video.quality}
                    </span>
                    <p className="text-[11px] text-slate-400 mt-1">{video.duration} • {video.fileSize}</p>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-200 flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={handleDownloadAgain}
                    className="flex-1 py-2.5 px-4 bg-[#185a36] hover:bg-[#13492c] text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <Download className="w-4 h-4" />
                    Download Video Package (Free Re-Download)
                  </button>
                  <button
                    onClick={onClose}
                    className="py-2.5 px-4 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-semibold transition cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Video Info Summary Box */}
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-3.5 border border-slate-200">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-2 py-0.5 rounded bg-slate-900 text-white font-mono text-[10px] font-bold">
                        {video.unitCodeTag}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-semibold">
                        {video.quality}
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {video.duration} ({video.fileSize})
                      </span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 mt-1.5 line-clamp-2">
                      {video.title}
                    </h4>
                    <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2">
                      {video.description}
                    </p>
                  </div>

                  {/* Price Tag */}
                  <div className="text-right shrink-0 bg-white p-2.5 rounded-lg border border-slate-200 shadow-xs">
                    <span className="text-[10px] text-slate-400 line-through block">₹499</span>
                    <div className="flex items-baseline gap-0.5 justify-end">
                      <span className="text-xs font-bold text-[#185a36]">₹</span>
                      <span className="text-xl font-extrabold text-[#185a36] leading-none">{priceINR}</span>
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-tight text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded block mt-0.5">
                      90% OFF
                    </span>
                  </div>
                </div>

                {/* Features included */}
                <div className="mt-3 pt-2.5 border-t border-slate-200/80 grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Direct high-speed MP4 download</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Distinction calculation steps PDF</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Lifetime offline access</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Official Tax Receipt &amp; Token</span>
                  </div>
                </div>
              </div>

              {/* Payment Method Selector Tabs */}
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                  Select Payment Method (₹49)
                </label>
                <div className="grid grid-cols-4 gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-medium">
                  <button
                    onClick={() => setActivePaymentMethod('upi_qr')}
                    className={`py-2 px-1.5 rounded-lg flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      activePaymentMethod === 'upi_qr'
                        ? 'bg-white text-slate-900 shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <QrCode className="w-4 h-4 text-emerald-700" />
                    <span className="text-[10px] leading-tight">UPI QR Code</span>
                  </button>

                  <button
                    onClick={() => setActivePaymentMethod('upi_apps')}
                    className={`py-2 px-1.5 rounded-lg flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      activePaymentMethod === 'upi_apps'
                        ? 'bg-white text-slate-900 shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-blue-700" />
                    <span className="text-[10px] leading-tight">UPI Apps</span>
                  </button>

                  <button
                    onClick={() => setActivePaymentMethod('cards')}
                    className={`py-2 px-1.5 rounded-lg flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      activePaymentMethod === 'cards'
                        ? 'bg-white text-slate-900 shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-indigo-700" />
                    <span className="text-[10px] leading-tight">Debit/Card</span>
                  </button>

                  <button
                    onClick={() => setActivePaymentMethod('netbanking')}
                    className={`py-2 px-1.5 rounded-lg flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      activePaymentMethod === 'netbanking'
                        ? 'bg-white text-slate-900 shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-amber-700" />
                    <span className="text-[10px] leading-tight">NetBanking</span>
                  </button>
                </div>
              </div>

              {/* Tab 1: UPI QR Code */}
              {activePaymentMethod === 'upi_qr' && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center space-y-3">
                  <div className="inline-block p-3 bg-white rounded-xl border border-slate-300 shadow-sm">
                    {/* Simulated Clean Stylized QR Code with UPI Centerpiece */}
                    <div className="relative w-40 h-40 mx-auto bg-white p-2 flex flex-col items-center justify-center">
                      <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900">
                        {/* QR Corners */}
                        <rect x="5" y="5" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="4" />
                        <rect x="10" y="10" width="15" height="15" fill="currentColor" />
                        
                        <rect x="70" y="5" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="4" />
                        <rect x="75" y="10" width="15" height="15" fill="currentColor" />
                        
                        <rect x="5" y="70" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="4" />
                        <rect x="10" y="75" width="15" height="15" fill="currentColor" />

                        {/* QR Data Pattern Dots */}
                        <rect x="36" y="8" width="6" height="6" fill="currentColor" />
                        <rect x="46" y="8" width="8" height="6" fill="currentColor" />
                        <rect x="58" y="8" width="6" height="6" fill="currentColor" />
                        <rect x="36" y="18" width="8" height="8" fill="currentColor" />
                        <rect x="48" y="18" width="6" height="6" fill="currentColor" />

                        <rect x="8" y="36" width="6" height="6" fill="currentColor" />
                        <rect x="18" y="36" width="8" height="6" fill="currentColor" />
                        <rect x="8" y="46" width="8" height="8" fill="currentColor" />
                        <rect x="20" y="58" width="6" height="6" fill="currentColor" />

                        <rect x="70" y="36" width="6" height="8" fill="currentColor" />
                        <rect x="80" y="40" width="12" height="6" fill="currentColor" />
                        <rect x="70" y="52" width="8" height="8" fill="currentColor" />
                        <rect x="84" y="52" width="6" height="6" fill="currentColor" />

                        <rect x="36" y="70" width="8" height="6" fill="currentColor" />
                        <rect x="48" y="70" width="6" height="8" fill="currentColor" />
                        <rect x="38" y="82" width="6" height="10" fill="currentColor" />
                        <rect x="58" y="80" width="10" height="6" fill="currentColor" />
                        <rect x="70" y="76" width="8" height="6" fill="currentColor" />
                        <rect x="82" y="76" width="10" height="14" fill="currentColor" />

                        {/* Center UPI Badge */}
                        <rect x="33" y="33" width="34" height="34" rx="4" fill="#185a36" />
                        <text x="50" y="52" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">₹49</text>
                        <text x="50" y="60" fill="#a7f3d0" fontSize="5" fontWeight="bold" textAnchor="middle">UPI PAY</text>
                      </svg>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mt-1">
                      Scan with any UPI App
                    </span>
                  </div>

                  {/* Copy UPI ID */}
                  <div className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-slate-200 text-xs max-w-xs mx-auto">
                    <div className="truncate mr-2 text-left">
                      <span className="text-[9px] text-slate-400 block uppercase font-mono">UPI ID / VPA</span>
                      <span className="font-mono font-semibold text-slate-800">{merchantUpiId}</span>
                    </div>
                    <button
                      onClick={handleCopyUpi}
                      className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium transition flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      {isCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{isCopied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-500">
                    Supports Google Pay, PhonePe, Paytm, BHIM, CRED, Amazon Pay &amp; Any Bank UPI
                  </p>
                </div>
              )}

              {/* Tab 2: UPI Apps Direct */}
              {activePaymentMethod === 'upi_apps' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setSelectedUpiApp('gpay')}
                      className={`p-3 rounded-xl border text-left transition flex items-center gap-3 cursor-pointer ${
                        selectedUpiApp === 'gpay'
                          ? 'border-blue-600 bg-blue-50/70 ring-1 ring-blue-600'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                        GPay
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">Google Pay</div>
                        <div className="text-[10px] text-slate-500">Direct App Launch</div>
                      </div>
                    </button>

                    <button
                      onClick={() => setSelectedUpiApp('phonepe')}
                      className={`p-3 rounded-xl border text-left transition flex items-center gap-3 cursor-pointer ${
                        selectedUpiApp === 'phonepe'
                          ? 'border-purple-600 bg-purple-50/70 ring-1 ring-purple-600'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-purple-700 text-white flex items-center justify-center font-bold text-xs shrink-0">
                        Pe
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">PhonePe</div>
                        <div className="text-[10px] text-slate-500">Instant UPI Autopay</div>
                      </div>
                    </button>

                    <button
                      onClick={() => setSelectedUpiApp('paytm')}
                      className={`p-3 rounded-xl border text-left transition flex items-center gap-3 cursor-pointer ${
                        selectedUpiApp === 'paytm'
                          ? 'border-sky-600 bg-sky-50/70 ring-1 ring-sky-600'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                        Paytm
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">Paytm UPI</div>
                        <div className="text-[10px] text-slate-500">Wallet / UPI</div>
                      </div>
                    </button>

                    <button
                      onClick={() => setSelectedUpiApp('bhim')}
                      className={`p-3 rounded-xl border text-left transition flex items-center gap-3 cursor-pointer ${
                        selectedUpiApp === 'bhim'
                          ? 'border-emerald-600 bg-emerald-50/70 ring-1 ring-emerald-600'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shrink-0">
                        BHIM
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">BHIM UPI</div>
                        <div className="text-[10px] text-slate-500">Government NPCI</div>
                      </div>
                    </button>
                  </div>

                  {/* Or Enter Custom UPI ID */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                      Or Enter Your UPI ID (VPA):
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="yourname@okaxis or 9876543210@paytm"
                        value={customUpiId}
                        onChange={(e) => setCustomUpiId(e.target.value)}
                        className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Debit/Credit Cards */}
              {activePaymentMethod === 'cards' && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                      Card Number (RuPay, Visa, Mastercard):
                    </label>
                    <input
                      type="text"
                      maxLength={19}
                      placeholder="4532 •••• •••• 8892"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                        Expiry Date:
                      </label>
                      <input
                        type="text"
                        maxLength={5}
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                        CVV:
                      </label>
                      <input
                        type="password"
                        maxLength={4}
                        placeholder="•••"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>256-bit SSL Bank Encrypted • 3D Secure OTP</span>
                  </div>
                </div>
              )}

              {/* Tab 4: NetBanking */}
              {activePaymentMethod === 'netbanking' && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-3">
                  <label className="text-[11px] font-semibold text-slate-700 block">
                    Choose Your Bank:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'sbi', name: 'SBI Bank' },
                      { id: 'hdfc', name: 'HDFC Bank' },
                      { id: 'icici', name: 'ICICI Bank' },
                      { id: 'axis', name: 'Axis Bank' },
                      { id: 'pnb', name: 'PNB' },
                      { id: 'kotak', name: 'Kotak Bank' },
                    ].map(bank => (
                      <button
                        key={bank.id}
                        type="button"
                        onClick={() => setSelectedBank(bank.id)}
                        className={`p-2 rounded-lg border text-xs font-medium text-center transition cursor-pointer ${
                          selectedBank === bank.id
                            ? 'bg-emerald-50 border-emerald-600 text-emerald-900 font-bold'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {bank.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Processing Loader if active */}
              {isProcessing && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center space-y-2 animate-pulse">
                  <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs font-bold text-emerald-900">{processStep}</p>
                  <p className="text-[10px] text-emerald-700">Please do not close or refresh this window</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => handleSimulatePayment(
                    activePaymentMethod === 'cards' ? 'card' : activePaymentMethod === 'netbanking' ? 'netbanking' : 'upi',
                    activePaymentMethod === 'upi_apps' ? selectedUpiApp : undefined
                  )}
                  className="w-full py-3.5 px-4 bg-[#185a36] hover:bg-[#13492c] active:scale-[0.99] text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-300" />
                  <span>
                    Pay ₹{priceINR}.00 &amp; Unlock Video Download
                  </span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>

                <div className="mt-2 text-center flex items-center justify-center gap-2 text-[10px] text-slate-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>NPCI 100% Secure • Instant Token Generation • 24/7 Civil Support</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
