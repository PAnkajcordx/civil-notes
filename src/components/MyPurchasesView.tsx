import React, { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  Eye,
  CheckCircle2,
  Calendar,
  CreditCard,
  Hash,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CatalogProduct } from './PDFPaymentTable';

interface PurchaseItem {
  orderId: string;
  orderNumber: string;
  productId: string;
  productTitle: string;
  subject: string;
  pageCount: number;
  amountINR: number;
  paidAt: string;
  paymentMethod: string;
  status: string;
}

interface MyPurchasesViewProps {
  onOpenViewer: (product: CatalogProduct) => void;
  onExploreCatalog: () => void;
}

export const MyPurchasesView: React.FC<MyPurchasesViewProps> = ({
  onOpenViewer,
  onExploreCatalog,
}) => {
  const { user, token } = useAuth();
  const [purchases, setPurchases] = useState<PurchaseItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPurchases = async () => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/payment/my-purchases', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to load purchases.');
      }

      const data = await res.json();
      setPurchases(data.purchases || []);
    } catch (err: any) {
      setError(err.message || 'Error fetching purchase history.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, [token]);

  const handleDownload = (productId: string, title: string) => {
    if (!token) return;
    fetch(`/api/pdfs/${productId}/download`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error('Download failed.');
        return res.blob();
      })
      .then(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      })
      .catch(err => {
        alert('Could not download PDF: ' + err.message);
      });
  };

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white border border-emerald-500/30 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold tracking-wider uppercase flex items-center gap-1 border border-emerald-400/30">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              Verified Entitlements Hub
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-black tracking-tight text-white">
            My Purchased Civil Engineering PDFs
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Logged in as <strong className="text-white">{user?.email}</strong>. All verified purchases remain permanently unlocked on your account.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={fetchPurchases}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer border border-slate-700"
            title="Refresh purchases"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={onExploreCatalog}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Browse Catalog</span>
          </button>
        </div>
      </div>

      {/* Loading & Error */}
      {isLoading && (
        <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
          <div className="w-7 h-7 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-500 font-semibold">Retrieving your verified purchases from server...</p>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex justify-between items-center">
          <span>{error}</span>
          <button
            onClick={fetchPurchases}
            className="px-2 py-1 bg-red-600 text-white rounded font-bold"
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && purchases.length === 0 && (
        <div className="p-10 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <FileText className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">No Purchased PDFs Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You haven't purchased any notes or unit portfolios yet. Explore our transparent pricing catalog to unlock distinction-grade civil engineering packs.
          </p>
          <button
            onClick={onExploreCatalog}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span>View Complete PDF Pricing Table</span>
            <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
          </button>
        </div>
      )}

      {/* Purchased List */}
      {!isLoading && purchases.length > 0 && (
        <div className="space-y-3">
          {purchases.map(item => (
            <div
              key={item.orderId}
              className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-13 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-800 shadow-xs flex flex-col items-center justify-center text-white shrink-0 p-1 border border-emerald-400/30">
                  <FileText className="w-4 h-4" />
                  <span className="text-[7px] font-mono font-bold mt-0.5">PDF</span>
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[9px] flex items-center gap-1">
                      <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                      Lifetime Unlocked
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      Order: {item.orderNumber}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-slate-900 text-sm leading-snug mt-0.5">
                    {item.productTitle}
                  </h3>
                  <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className="text-emerald-700 font-semibold">{item.subject}</span>
                    <span>•</span>
                    <span>{item.pageCount} Pages</span>
                    <span>•</span>
                    <span className="font-mono font-bold text-slate-800">Paid ₹{item.amountINR}</span>
                    <span>•</span>
                    <span className="text-slate-400 text-[10px]">
                      {new Date(item.paidAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                <button
                  onClick={() =>
                    onOpenViewer({
                      id: item.productId,
                      serialNumber: 1,
                      title: item.productTitle,
                      subject: item.subject,
                      category: 'My Purchases',
                      description: 'Purchased document',
                      pageCount: item.pageCount,
                      originalPriceINR: item.amountINR,
                      discountPriceINR: 0,
                      finalPriceINR: item.amountINR,
                      fileSizeBytes: 1024 * 1024,
                      coverGradient: 'from-emerald-700 to-slate-900',
                      isPurchased: true,
                      demoPagesAvailable: 2,
                    })
                  }
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Open Full PDF</span>
                </button>

                <button
                  onClick={() => handleDownload(item.productId, item.productTitle)}
                  className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                  title="Download PDF to Device"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
