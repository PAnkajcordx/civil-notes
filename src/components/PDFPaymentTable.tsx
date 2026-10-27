import React, { useState, useEffect } from 'react';
import {
  FileText,
  Lock,
  CheckCircle2,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  Search,
  Filter,
  Eye,
  Layers,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export interface CatalogProduct {
  id: string;
  serialNumber: number;
  title: string;
  subject: string;
  category: string;
  description: string;
  pageCount: number;
  originalPriceINR: number;
  discountPriceINR: number;
  finalPriceINR: number;
  fileSizeBytes: number;
  coverGradient: string;
  isPurchased: boolean;
  demoPagesAvailable: number;
}

interface PDFPaymentTableProps {
  onBuyProduct: (product: CatalogProduct) => void;
  onOpenViewer: (product: CatalogProduct) => void;
  onOpenDemo: (product: CatalogProduct) => void;
  onRequireLogin: () => void;
}

export const PDFPaymentTable: React.FC<PDFPaymentTableProps> = ({
  onBuyProduct,
  onOpenViewer,
  onOpenDemo,
  onRequireLogin,
}) => {
  const { user, token, hasPurchased } = useAuth();
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const res = await fetch('/api/products', { headers });
      if (!res.ok) {
        throw new Error('Failed to load PDF catalog.');
      }
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err: any) {
      setError(err.message || 'Error loading PDF catalog.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [token, user]);

  // Extract unique categories
  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  // Filter products
  const filteredProducts = products.filter(p => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const q = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.subject.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  return (
    <div className="w-full space-y-4">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 p-4 sm:p-5 text-white border border-emerald-500/30 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold tracking-wider uppercase flex items-center gap-1 border border-emerald-400/30">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                Verified Razorpay Gateway (INR ₹)
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                {products.length} Official Syllabi Notes
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
              CivilNotes Official PDF Coursework Catalog &amp; Pricing
            </h2>
            <p className="text-xs text-slate-300 mt-0.5 max-w-xl leading-relaxed">
              Transparent, upfront course prices. Inspect 2 demo preview pages for free or unlock the full, authenticated distinction portfolios via UPI, QR, cards, or net banking.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={fetchProducts}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer border border-slate-700/80"
              title="Refresh pricing"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <div className="flex items-center rounded-xl bg-slate-900/90 p-1 border border-slate-700 text-xs">
              <button
                onClick={() => setViewMode('table')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                  viewMode === 'table' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                Table
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                  viewMode === 'cards' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                Cards
              </button>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="mt-4 pt-3 border-t border-slate-700/60 flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by topic, unit, or title (e.g. Surveying, Mechanics, Eurocodes)..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-950/60 border border-slate-700 text-white placeholder-slate-400 text-xs focus:outline-hidden focus:border-emerald-400 transition-colors"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading & Error States */}
      {isLoading && products.length === 0 && (
        <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-semibold text-slate-600">Loading verified PDF price table from server...</p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={fetchProducts}
            className="px-2.5 py-1 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      {/* TABLE VIEW */}
      {viewMode === 'table' && !isLoading && (
        <div className="overflow-x-auto rounded-2xl border border-slate-200/90 bg-white shadow-sm">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white text-[11px] uppercase tracking-wider font-extrabold border-b border-slate-800">
                <th className="py-3 px-3 w-10 text-center">#</th>
                <th className="py-3 px-3 w-12 text-center">Cover</th>
                <th className="py-3 px-3">Title &amp; Subject</th>
                <th className="py-3 px-3 hidden md:table-cell">Category</th>
                <th className="py-3 px-3 text-center">Pages</th>
                <th className="py-3 px-3 text-right">Original</th>
                <th className="py-3 px-3 text-right">Discount</th>
                <th className="py-3 px-3 text-right text-emerald-300 font-extrabold">Final Price</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-500">
                    No matching PDF products found for "{searchTerm}".
                  </td>
                </tr>
              ) : (
                filteredProducts.map(product => {
                  const isOwned = hasPurchased(product.id) || product.isPurchased;
                  const discountPercent = Math.round(
                    (product.discountPriceINR / product.originalPriceINR) * 100
                  );

                  return (
                    <tr
                      key={product.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isOwned ? 'bg-emerald-50/30' : ''
                      }`}
                    >
                      {/* Serial Number */}
                      <td className="py-3 px-3 text-center font-mono font-bold text-slate-500">
                        {product.serialNumber.toString().padStart(2, '0')}
                      </td>

                      {/* PDF Thumbnail / Cover */}
                      <td className="py-3 px-3 text-center">
                        <div
                          className={`w-9 h-11 rounded-md bg-gradient-to-br ${product.coverGradient} shadow-xs flex flex-col items-center justify-center p-1 text-white border border-white/20 mx-auto`}
                        >
                          <FileText className="w-3.5 h-3.5 text-white/90 shrink-0" />
                          <span className="text-[8px] font-mono font-black mt-0.5">PDF</span>
                        </div>
                      </td>

                      {/* Title & Subject */}
                      <td className="py-3 px-3 min-w-[180px]">
                        <div className="font-bold text-slate-900 leading-snug">{product.title}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <span className="font-medium text-emerald-700">{product.subject}</span>
                          <span className="text-slate-300">•</span>
                          <span className="text-slate-400 truncate max-w-[200px]">
                            {product.description}
                          </span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-3 hidden md:table-cell">
                        <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold">
                          {product.category}
                        </span>
                      </td>

                      {/* Pages */}
                      <td className="py-3 px-3 text-center font-mono text-slate-600 font-semibold">
                        {product.pageCount} pgs
                      </td>

                      {/* Original Price */}
                      <td className="py-3 px-3 text-right text-slate-400 line-through font-mono">
                        ₹{product.originalPriceINR}
                      </td>

                      {/* Discount */}
                      <td className="py-3 px-3 text-right">
                        <span className="inline-block px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px] font-mono">
                          -₹{product.discountPriceINR} ({discountPercent}%)
                        </span>
                      </td>

                      {/* Final Payable Price */}
                      <td className="py-3 px-3 text-right">
                        <div className="font-extrabold text-slate-900 text-sm font-mono flex items-center justify-end gap-0.5">
                          <span className="text-emerald-600 font-bold">₹</span>
                          <span>{product.finalPriceINR}</span>
                        </div>
                      </td>

                      {/* Purchase Status */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        {isOwned ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Verified &amp; Owned
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 font-medium text-[10px] border border-amber-200">
                            <Lock className="w-3 h-3 text-amber-600" />
                            Payable PDF
                          </span>
                        )}
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          {isOwned ? (
                            <button
                              onClick={() => onOpenViewer(product)}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>Open PDF</span>
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={() => onOpenDemo(product)}
                                className="px-2 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] transition-colors flex items-center gap-1 cursor-pointer"
                                title="Read 2 free sample pages"
                              >
                                <Eye className="w-3.5 h-3.5 text-slate-500" />
                                <span>Demo (2 pgs)</span>
                              </button>

                              {user ? (
                                <button
                                  onClick={() => onBuyProduct(product)}
                                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                                >
                                  <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
                                  <span>Buy ₹{product.finalPriceINR}</span>
                                </button>
                              ) : (
                                <button
                                  onClick={onRequireLogin}
                                  className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                                >
                                  <Lock className="w-3 h-3 text-amber-400" />
                                  <span>Login to Buy (₹{product.finalPriceINR})</span>
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* CARDS VIEW (Mobile optimized) */}
      {viewMode === 'cards' && !isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredProducts.map(product => {
            const isOwned = hasPurchased(product.id) || product.isPurchased;
            return (
              <div
                key={product.id}
                className={`rounded-2xl p-4 border transition-all ${
                  isOwned
                    ? 'bg-emerald-50/40 border-emerald-300 shadow-xs'
                    : 'bg-white border-slate-200 shadow-sm hover:shadow-md'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-12 h-16 rounded-xl bg-gradient-to-br ${product.coverGradient} shadow-md flex flex-col items-center justify-center p-1.5 text-white shrink-0 border border-white/20`}
                  >
                    <FileText className="w-5 h-5 text-white/95" />
                    <span className="text-[9px] font-mono font-black mt-1">PDF</span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[10px] font-mono font-bold text-slate-500">
                        #{product.serialNumber.toString().padStart(2, '0')}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-semibold">
                        {product.pageCount} Pages
                      </span>
                    </div>

                    <h3 className="font-extrabold text-slate-900 text-sm leading-snug line-clamp-1">
                      {product.title}
                    </h3>
                    <p className="text-[11px] font-semibold text-emerald-700 mt-0.5">
                      {product.subject}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                </div>

                {/* Price and status strip */}
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400 line-through text-xs font-mono">
                        ₹{product.originalPriceINR}
                      </span>
                      <span className="text-base font-black text-slate-900 font-mono">
                        ₹{product.finalPriceINR}
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-600 font-bold">
                      Save ₹{product.discountPriceINR}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {isOwned ? (
                      <button
                        onClick={() => onOpenViewer(product)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-xs hover:bg-emerald-500 flex items-center gap-1 cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Open PDF</span>
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => onOpenDemo(product)}
                          className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs cursor-pointer"
                        >
                          Demo
                        </button>
                        {user ? (
                          <button
                            onClick={() => onBuyProduct(product)}
                            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs flex items-center gap-1 cursor-pointer"
                          >
                            <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Buy ₹{product.finalPriceINR}</span>
                          </button>
                        ) : (
                          <button
                            onClick={onRequireLogin}
                            className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] cursor-pointer"
                          >
                            Login to Buy
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
