import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  CreditCard, 
  Smartphone, 
  QrCode, 
  Download, 
  Sparkles, 
  FileText,
  FileCheck,
  Zap,
  ArrowRight
} from 'lucide-react';
import { BTECUnit } from '../types';
import { recordPdfPurchase, downloadUnlockedPDFDocument, PDFPaymentTransaction } from '../utils/pdfPaymentHelper';

interface PDFPaywallModalProps {
  unit: BTECUnit | null;
  onClose: () => void;
  onPaymentSuccess: (unit: BTECUnit, txn: PDFPaymentTransaction) => void;
  onOpenDemo?: (unit: BTECUnit) => void;
}

export const PDFPaywallModal: React.FC<PDFPaywallModalProps> = ({
  unit,
  onClose,
  onPaymentSuccess,
  onOpenDemo
}) => {
  const [selectedPlan, setSelectedPlan] = useState<'single' | 'all_access'>('single');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'qr'>('upi');
  const [upiApp, setUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'id'>('gpay');
  const [customUpiId, setCustomUpiId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successTxn, setSuccessTxn] = useState<PDFPaymentTransaction | null>(null);

  if (!unit) return null;

  const singlePrice = unit.priceINR || 49;
  const allAccessPrice = 199;
  const activePrice = selectedPlan === 'single' ? singlePrice : allAccessPrice;

  const handleSimulatePayment = (method: 'upi' | 'card' | 'netbanking') => {
    setIsProcessing(true);

    setTimeout(() => {
      const upiDetails = method === 'upi' ? {
        app: upiApp === 'gpay' ? 'Google Pay' : upiApp === 'phonepe' ? 'PhonePe' : upiApp === 'paytm' ? 'Paytm' : 'UPI ID',
        upiId: customUpiId || 'civilnotes.btec@okaxis'
      } : undefined;

      const isAllAccess = selectedPlan === 'all_access';
      const txn = recordPdfPurchase(unit, method, upiDetails, isAllAccess);
      
      setIsProcessing(false);
      setSuccessTxn(txn);

      // Auto trigger download for user convenience
      setTimeout(() => {
        downloadUnlockedPDFDocument(unit, txn.txnId);
      }, 700);

      onPaymentSuccess(unit, txn);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl w-full max-w-lg max-h-[94vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500 text-slate-950 uppercase tracking-wider">
                  PDF Paywall
                </span>
                <span className="text-xs text-emerald-300 font-medium">
                  {unit.totalPages || 6} Pages • Complete Pack
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white leading-tight mt-0.5">
                Unlock Pearson BTEC PDF Pack
              </h3>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-slate-800">
          {successTxn ? (
            /* SUCCESS STATE */
            <div className="text-center py-4 space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
              </div>

              <div>
                <h4 className="text-lg font-black text-slate-900">
                  Payment Verified • PDF Unlocked!
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Transaction Reference: <span className="font-mono font-semibold text-slate-700">{successTxn.txnId}</span>
                </p>
                <p className="text-xs text-emerald-700 font-semibold mt-1">
                  All {unit.totalPages || 6} pages (including worked calculations &amp; IV stamp) are now fully unlocked.
                </p>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-left text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-600">Document:</span>
                  <span className="font-bold text-slate-900">{unit.unitCodeTag}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Amount Paid:</span>
                  <span className="font-bold text-emerald-800">₹{successTxn.amountINR}.00 INR</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">License:</span>
                  <span className="font-semibold text-slate-800">Lifetime Educational Access</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={() => downloadUnlockedPDFDocument(unit, successTxn.txnId)}
                  className="w-full py-3 bg-[#185a36] hover:bg-[#13492c] text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Full PDF Again</span>
                </button>

                {onOpenDemo && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenDemo(unit);
                    }}
                    className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition cursor-pointer"
                  >
                    Open Unlocked Interactive Reader
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* PAYMENT SELECTION STATE */
            <>
              {/* Document Info Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-start gap-3">
                <div className="w-10 h-12 bg-red-100 text-red-700 rounded-lg flex flex-col items-center justify-center shrink-0 border border-red-200 font-black text-[11px] leading-tight">
                  <FileText className="w-4 h-4 text-red-600 mb-0.5" />
                  PDF
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-bold text-emerald-800 bg-emerald-100/70 px-1.5 py-0.5 rounded">
                      {unit.unitCodeTag}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {unit.totalPages || 6} Pages Total
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate mt-0.5">
                    {unit.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                    Includes distinction calculations, Eurocode sizing, and internal verifier sign-off.
                  </p>
                </div>
              </div>

              {/* Free Demo Teaser Link */}
              {onOpenDemo && (
                <div className="flex items-center justify-between px-3 py-2 bg-blue-50/80 border border-blue-200/80 rounded-xl text-xs text-blue-900">
                  <span className="font-medium">
                    Want to inspect first? 2 pages are free in demo mode.
                  </span>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenDemo(unit);
                    }}
                    className="text-xs font-bold text-blue-700 hover:text-blue-900 underline cursor-pointer shrink-0 ml-2"
                  >
                    View Demo Pages →
                  </button>
                </div>
              )}

              {/* Plan Selector: Single vs All-Access */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Select Access Option
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Single PDF Plan */}
                  <div 
                    onClick={() => setSelectedPlan('single')}
                    className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer relative ${
                      selectedPlan === 'single'
                        ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900">
                        This Unit PDF Pack
                      </span>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 line-through mr-1">₹299</span>
                        <span className="text-sm font-black text-emerald-800">₹{singlePrice}</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      Unlocks all {unit.totalPages || 6} pages for {unit.unitCodeTag} permanently.
                    </p>
                  </div>

                  {/* All Access Pass */}
                  <div 
                    onClick={() => setSelectedPlan('all_access')}
                    className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer relative ${
                      selectedPlan === 'all_access'
                        ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="absolute -top-2 right-2 px-1.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-[9px] font-black text-white uppercase tracking-wider shadow-xs">
                      Best Value • Save 80%
                    </div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900">
                        BTEC All-Access Pass
                      </span>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 line-through mr-1">₹999</span>
                        <span className="text-sm font-black text-emerald-800">₹{allAccessPrice}</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      Unlocks ALL current &amp; future BTEC Civil unit PDF notes &amp; exemplars!
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setPaymentMethod('upi')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition cursor-pointer ${
                      paymentMethod === 'upi'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-2xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-emerald-700" />
                    <span>UPI Apps</span>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('qr')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition cursor-pointer ${
                      paymentMethod === 'qr'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-2xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <QrCode className="w-4 h-4 text-emerald-700" />
                    <span>QR Code</span>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-2xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-emerald-700" />
                    <span>Card / NetBanking</span>
                  </button>
                </div>
              </div>

              {/* UPI App Options */}
              {paymentMethod === 'upi' && (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2.5">
                  <div className="flex gap-2">
                    {[
                      { id: 'gpay', name: 'Google Pay' },
                      { id: 'phonepe', name: 'PhonePe' },
                      { id: 'paytm', name: 'Paytm' }
                    ].map(app => (
                      <button
                        key={app.id}
                        onClick={() => setUpiApp(app.id as any)}
                        className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold border transition cursor-pointer ${
                          upiApp === app.id
                            ? 'bg-white text-emerald-800 border-emerald-500 shadow-xs'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        {app.name}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <input 
                      type="text" 
                      placeholder="Enter UPI ID (e.g. name@okhdfcbank)"
                      value={customUpiId}
                      onChange={(e) => setCustomUpiId(e.target.value)}
                      className="w-full text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-emerald-600 font-mono"
                    />
                  </div>
                </div>
              )}

              {/* QR Code view */}
              {paymentMethod === 'qr' && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center space-y-2">
                  <div className="w-36 h-36 bg-white p-2 rounded-xl border border-slate-300 mx-auto flex items-center justify-center shadow-xs">
                    <div className="w-full h-full bg-slate-900 rounded-lg flex flex-col items-center justify-center text-white p-2">
                      <QrCode className="w-14 h-14 text-emerald-400 mb-1" />
                      <span className="text-[10px] font-mono text-emerald-300 font-bold">UPI QR SCAN</span>
                      <span className="text-[9px] text-slate-300">₹{activePrice}.00 INR</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Scan with any UPI app (GPay, PhonePe, Paytm, CRED) to unlock instantly.
                  </p>
                </div>
              )}

              {/* Card option */}
              {paymentMethod === 'card' && (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2 text-xs">
                  <div className="bg-white p-2 rounded-lg border border-slate-200 font-mono text-slate-700 flex justify-between items-center">
                    <span>•••• •••• •••• 4242</span>
                    <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded font-sans text-slate-600">Visa / RuPay</span>
                  </div>
                  <p className="text-[10px] text-slate-500">
                    Secure 256-bit SSL encrypted transaction gateway.
                  </p>
                </div>
              )}

              {/* Guarantee info */}
              <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Instant PDF download + lifetime browser access. 100% money-back guarantee.</span>
              </div>

              {/* Instant Simulation Action */}
              <button
                onClick={() => handleSimulatePayment(paymentMethod === 'card' ? 'card' : 'upi')}
                disabled={isProcessing}
                className="w-full py-3.5 px-4 bg-[#185a36] hover:bg-[#13492c] disabled:opacity-70 text-white rounded-xl text-xs sm:text-sm font-extrabold shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing Secure Payment...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-white" />
                    <span>
                      Pay ₹{activePrice}.00 &amp; Unlock Full {selectedPlan === 'all_access' ? 'BTEC Suite' : 'PDF'} Now
                    </span>
                  </>
                )}
              </button>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 px-5 py-2.5 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <span>CivilNotes Verified Pearson BTEC Portal</span>
          <button 
            onClick={onClose}
            className="text-slate-600 hover:text-slate-900 font-semibold cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
