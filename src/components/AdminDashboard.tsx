import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldAlert,
  Upload,
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  FileText,
  DollarSign,
  Package,
  Layers,
  ArrowRight,
  TrendingUp,
  X,
  Play,
  RotateCcw,
  Sparkles,
  Eye,
  FileCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CatalogProduct } from './PDFPaymentTable';

export const AdminDashboard: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { token, user } = useAuth();
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'security'>('products');
  const [stats, setStats] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // New/Edit product form modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [newCategory, setNewCategory] = useState('Construction Principles');
  const [newDescription, setNewDescription] = useState('');
  const [newPageCount, setNewPageCount] = useState('120');
  const [newOriginalPrice, setNewOriginalPrice] = useState('249');
  const [newDiscountPrice, setNewDiscountPrice] = useState('150');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Quick Replace PDF state
  const [replacingProductId, setReplacingProductId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Security test results state
  const [securityReport, setSecurityReport] = useState<any | null>(null);
  const [isRunningSecurity, setIsRunningSecurity] = useState<boolean>(false);

  const fetchDashboardData = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const [statsRes, productsRes, ordersRes] = await Promise.all([
        fetch('/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/admin/products', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/admin/orders', { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (productsRes.ok) {
        const prodData = await productsRes.json();
        setProducts(prodData.products || []);
      }
      if (ordersRes.ok) {
        const ordData = await ordersRes.json();
        setOrders(ordData.orders || []);
      }
    } catch (err: any) {
      console.error('Error fetching admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [token]);

  const showNotice = (msg: string) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(null), 4000);
  };

  // Handle Save / Add / Edit Product (supports uploading/replacing the real PDF file)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      const formData = new FormData();
      formData.append('title', newTitle);
      formData.append('subject', newSubject);
      formData.append('category', newCategory);
      formData.append('description', newDescription);
      formData.append('pageCount', newPageCount);
      formData.append('originalPriceINR', newOriginalPrice);
      formData.append('discountPriceINR', newDiscountPrice);
      if (selectedFile) {
        formData.append('pdfFile', selectedFile);
      }

      if (editingProduct) {
        // Edit existing product and optionally replace real PDF
        const res = await fetch(`/api/admin/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (res.ok) {
          showNotice(`Updated product & PDF details for: ${newTitle}`);
          setIsAddModalOpen(false);
          setEditingProduct(null);
          setSelectedFile(null);
          fetchDashboardData();
        } else {
          const data = await res.json();
          alert(data.error || 'Failed to update product.');
        }
      } else {
        // Upload new product with PDF
        const res = await fetch('/api/admin/products', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (res.ok) {
          showNotice(`Successfully uploaded & published real PDF: ${newTitle}!`);
          setIsAddModalOpen(false);
          setSelectedFile(null);
          fetchDashboardData();
        } else {
          const data = await res.json();
          alert(data.error || 'Failed to create product.');
        }
      }
    } catch (err: any) {
      alert('Error saving product: ' + err.message);
    }
  };

  // Quick Replace PDF handler
  const handleTriggerFileSelect = (prodId: string) => {
    setReplacingProductId(prodId);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !replacingProductId || !token) return;

    try {
      const formData = new FormData();
      formData.append('pdfFile', file);

      showNotice(`Uploading real PDF file (${(file.size / 1024).toFixed(1)} KB)...`);
      const res = await fetch(`/api/admin/products/${replacingProductId}/replace-pdf`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        showNotice(data.message || 'Real PDF file successfully replaced!');
        fetchDashboardData();
      } else {
        alert(data.error || 'Failed to replace PDF.');
      }
    } catch (err: any) {
      alert('Upload error: ' + err.message);
    } finally {
      setReplacingProductId(null);
    }
  };

  // Regenerate Real High-Fidelity Technical PDF
  const handleRegeneratePdf = async (prodId: string, title: string) => {
    if (!token) return;
    try {
      showNotice(`Regenerating authentic civil engineering PDF for ${title}...`);
      const res = await fetch(`/api/admin/products/${prodId}/regenerate-pdf`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        showNotice(data.message || `Regenerated real PDF for ${title}!`);
        fetchDashboardData();
      } else {
        alert(data.error || 'Failed to regenerate PDF.');
      }
    } catch (err: any) {
      alert('Regeneration error: ' + err.message);
    }
  };

  // Handle Delete Product
  const handleDeleteProduct = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        showNotice(`Deleted ${title}`);
        fetchDashboardData();
      }
    } catch (err: any) {
      alert('Failed to delete product: ' + err.message);
    }
  };

  // Handle Refund Order
  const handleRefundOrder = async (orderId: string, orderNumber: string) => {
    if (!confirm(`Mark order ${orderNumber} as refunded and revoke student entitlement?`)) return;
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/refund`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        showNotice(`Order ${orderNumber} refunded and access revoked.`);
        fetchDashboardData();
      }
    } catch (err: any) {
      alert('Failed to refund order: ' + err.message);
    }
  };

  // Run Security Test Suite
  const handleRunSecurityTests = async () => {
    setIsRunningSecurity(true);
    try {
      const res = await fetch('/api/admin/run-security-tests', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setSecurityReport(data);
      showNotice('Security verification suite completed!');
    } catch (err: any) {
      alert('Failed to run security tests: ' + err.message);
    } finally {
      setIsRunningSecurity(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      {/* Hidden file input for quick PDF replace */}
      <input
        type="file"
        ref={fileInputRef}
        accept=".pdf"
        className="hidden"
        onChange={handleFileUpload}
      />

      <div className="relative w-full max-w-5xl h-[92vh] flex flex-col rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden text-white">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-900/95 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-white">CivilNotes Admin Command Center</h3>
                <span className="px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-mono font-bold">
                  ADMINISTRATOR
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                Upload &amp; Change Real PDFs, Manage Prices, Inspect Razorpay Orders &amp; Test Security
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchDashboardData}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Action notification toast */}
        {actionMessage && (
          <div className="bg-emerald-600/90 text-white px-4 py-2 text-xs font-semibold flex items-center gap-2 shadow-sm animate-in slide-in-from-top-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{actionMessage}</span>
          </div>
        )}

        {/* Navigation Tabs & KPI stats */}
        <div className="px-5 py-3 bg-slate-950/70 border-b border-slate-800 shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('products')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
              }`}
            >
              Real PDF Inventory ({products.length})
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
              }`}
            >
              Orders &amp; Payments ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'security'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span>Security Suite</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </button>
          </div>

          {/* Quick Metrics */}
          {stats && (
            <div className="flex items-center gap-3 text-xs font-mono">
              <div className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Total Revenue: </span>
                <strong className="text-emerald-400 font-bold">₹{stats.totalRevenueINR}</strong>
              </div>
              <div className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Active Purchases: </span>
                <strong className="text-white font-bold">{stats.activeEntitlementsCount}</strong>
              </div>
            </div>
          )}
        </div>

        {/* Tab Content Viewport */}
        <div className="flex-1 overflow-y-auto p-5">
          {/* TAB 1: PRODUCT MANAGEMENT & REAL PDF REPLACEMENT */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Real PDF Documents &amp; Pricing Management</h4>
                  <p className="text-xs text-slate-400">
                    Upload your real PDF files, replace existing files on disk, or regenerate high-fidelity civil engineering packs.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setNewTitle('');
                    setNewSubject('');
                    setNewDescription('');
                    setNewOriginalPrice('299');
                    setNewDiscountPrice('200');
                    setNewPageCount('120');
                    setSelectedFile(null);
                    setIsAddModalOpen(true);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Upload &amp; Add New Real PDF</span>
                </button>
              </div>

              {/* Table of products */}
              <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/60">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-900/90 text-slate-400 text-[10px] uppercase font-bold border-b border-slate-800">
                      <th className="py-2.5 px-3">#</th>
                      <th className="py-2.5 px-3">Product Title &amp; Subject</th>
                      <th className="py-2.5 px-3">PDF File on Storage</th>
                      <th className="py-2.5 px-3 text-center">Pages</th>
                      <th className="py-2.5 px-3 text-right">Original</th>
                      <th className="py-2.5 px-3 text-right">Discount</th>
                      <th className="py-2.5 px-3 text-right text-emerald-400">Final Price</th>
                      <th className="py-2.5 px-3 text-center">Manage Real PDF</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {products.map(p => (
                      <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-3 font-mono font-bold text-slate-500">
                          {p.serialNumber}
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-bold text-white">{p.title}</div>
                          <div className="text-[11px] text-emerald-400">{p.subject}</div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-mono text-[11px] text-slate-300 flex items-center gap-1">
                            <FileCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span className="truncate max-w-[140px]">{p.storageKey}</span>
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {(p.fileSizeBytes / 1024).toFixed(1)} KB
                          </div>
                        </td>
                        <td className="py-3 px-3 text-center font-mono text-slate-400">
                          {p.pageCount}
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-slate-400 line-through">
                          ₹{p.originalPriceINR}
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-emerald-400">
                          -₹{p.discountPriceINR}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-white text-sm">
                          ₹{p.finalPriceINR}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <div className="flex items-center justify-center gap-1.5 flex-wrap">
                            {/* Quick Replace PDF Button */}
                            <button
                              onClick={() => handleTriggerFileSelect(p.id)}
                              className="px-2 py-1 rounded-lg bg-emerald-950/70 hover:bg-emerald-900 text-emerald-300 text-[10px] font-bold border border-emerald-700/50 transition-colors flex items-center gap-1 cursor-pointer"
                              title="Replace with your own uploaded .pdf file"
                            >
                              <Upload className="w-3 h-3" />
                              <span>Replace PDF</span>
                            </button>

                            {/* Regenerate Real Technical PDF */}
                            <button
                              onClick={() => handleRegeneratePdf(p.id, p.title)}
                              className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                              title="Regenerate authentic Eurocode calculations & tables"
                            >
                              <Sparkles className="w-3 h-3 text-emerald-400" />
                              <span>Regenerate</span>
                            </button>

                            {/* Edit Details */}
                            <button
                              onClick={() => {
                                setEditingProduct(p);
                                setNewTitle(p.title);
                                setNewSubject(p.subject);
                                setNewCategory(p.category);
                                setNewDescription(p.description);
                                setNewPageCount(String(p.pageCount));
                                setNewOriginalPrice(String(p.originalPriceINR));
                                setNewDiscountPrice(String(p.discountPriceINR));
                                setSelectedFile(null);
                                setIsAddModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                              title="Edit Details, Pricing & PDF"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => handleDeleteProduct(p.id, p.title)}
                              className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-300 hover:text-white transition-colors cursor-pointer"
                              title="Remove Product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: ORDERS & PAYMENTS */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Razorpay Transactions &amp; Orders</h4>
                  <p className="text-xs text-slate-400">
                    Live audit log of all generated orders, captured payments, and refund controls.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/60">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-900/90 text-slate-400 text-[10px] uppercase font-bold border-b border-slate-800">
                      <th className="py-2.5 px-3">Order #</th>
                      <th className="py-2.5 px-3">Customer Email</th>
                      <th className="py-2.5 px-3">Product Title</th>
                      <th className="py-2.5 px-3 text-right">Amount (₹)</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-slate-500">
                          No orders created yet.
                        </td>
                      </tr>
                    ) : (
                      orders.map(o => (
                        <tr key={o.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3 px-3 font-mono font-bold text-slate-300">
                            {o.orderNumber}
                          </td>
                          <td className="py-3 px-3 text-slate-300">{o.userEmail}</td>
                          <td className="py-3 px-3 font-bold text-white max-w-[200px] truncate">
                            {o.productTitle}
                          </td>
                          <td className="py-3 px-3 text-right font-mono font-bold text-emerald-400">
                            ₹{o.amountINR}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span
                              className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                o.status === 'paid'
                                  ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/50'
                                  : o.status === 'refunded'
                                  ? 'bg-red-950/60 text-red-300 border border-red-700/50'
                                  : 'bg-amber-950/60 text-amber-300 border border-amber-700/50'
                              }`}
                            >
                              {o.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-[11px] text-slate-400 font-mono">
                            {new Date(o.createdAt).toLocaleDateString('en-IN')}
                          </td>
                          <td className="py-3 px-3 text-center">
                            {o.status === 'paid' && (
                              <button
                                onClick={() => handleRefundOrder(o.id, o.orderNumber)}
                                className="px-2 py-1 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-300 text-[10px] font-bold transition-colors cursor-pointer"
                              >
                                Refund &amp; Revoke
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: AUTOMATED SECURITY SUITE */}
          {activeTab === 'security' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-emerald-400" />
                    <span>Automated Security &amp; Authoritative Payment Verification Suite</span>
                  </h4>
                  <p className="text-xs text-slate-300 mt-1">
                    Directly executes server-side cryptographic checks, access control rules, webhook idempotency, and price-tampering resistance.
                  </p>
                </div>

                <button
                  onClick={handleRunSecurityTests}
                  disabled={isRunningSecurity}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0 disabled:opacity-50"
                >
                  {isRunningSecurity ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Executing Suite...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" />
                      <span>Run All Security Tests</span>
                    </>
                  )}
                </button>
              </div>

              {securityReport ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-1 text-xs">
                    <span className="text-slate-400 font-mono">
                      Timestamp: {new Date(securityReport.timestamp).toLocaleTimeString()}
                    </span>
                    <span className="font-bold text-emerald-400 font-mono">
                      Passed: {securityReport.passedTests} / {securityReport.totalTests} Tests
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-2.5">
                    {securityReport.results.map((r: any) => (
                      <div
                        key={r.id}
                        className={`p-3.5 rounded-2xl border flex items-start gap-3 ${
                          r.passed
                            ? 'bg-emerald-950/20 border-emerald-700/40 text-emerald-100'
                            : 'bg-red-950/20 border-red-700/40 text-red-100'
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                            r.passed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {r.passed ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : (
                            <AlertCircle className="w-4 h-4" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-xs text-white">
                              {r.id}: {r.name}
                            </span>
                            <span className="px-2 py-0.2 rounded-full bg-slate-800 text-[10px] font-mono font-semibold text-slate-300">
                              {r.category}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">{r.description}</p>
                          <div className="mt-1 text-[11px] font-mono text-emerald-300/90 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                            {r.details}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-950/40 rounded-2xl border border-slate-800 space-y-2">
                  <ShieldAlert className="w-8 h-8 text-slate-500 mx-auto" />
                  <p className="text-xs text-slate-400">
                    Click "Run All Security Tests" to verify all 7 critical attack vectors in real time.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal for adding/editing product and replacing PDF */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-5 text-white">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span>{editingProduct ? 'Edit Product & Change Real PDF' : 'Upload & Add New Real Coursework PDF'}</span>
                </h4>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-3 mt-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">
                    Document Title
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    placeholder="e.g. Surveying Notes & Fieldwork Toolkit"
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-hidden focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">
                      Subject / Discipline
                    </label>
                    <input
                      type="text"
                      required
                      value={newSubject}
                      onChange={e => setNewSubject(e.target.value)}
                      placeholder="e.g. Land Surveying"
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-hidden focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">
                      Category
                    </label>
                    <input
                      type="text"
                      required
                      value={newCategory}
                      onChange={e => setNewCategory(e.target.value)}
                      placeholder="e.g. Site & Surveying"
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-hidden focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">
                    Short Description
                  </label>
                  <textarea
                    rows={2}
                    value={newDescription}
                    onChange={e => setNewDescription(e.target.value)}
                    placeholder="Brief description of formulas, modules, and coursework guides included..."
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-hidden focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">
                      Page Count
                    </label>
                    <input
                      type="number"
                      value={newPageCount}
                      onChange={e => setNewPageCount(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">
                      Original Price (₹)
                    </label>
                    <input
                      type="number"
                      value={newOriginalPrice}
                      onChange={e => setNewOriginalPrice(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">
                      Discount (₹)
                    </label>
                    <input
                      type="number"
                      value={newDiscountPrice}
                      onChange={e => setNewDiscountPrice(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono"
                    />
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Final Student Payable Price:</span>
                  <strong className="text-emerald-400 font-bold">
                    ₹{Math.max(0, (Number(newOriginalPrice) || 0) - (Number(newDiscountPrice) || 0))}
                  </strong>
                </div>

                {/* File Uploader for creating or changing real PDF */}
                <div className="p-3 bg-slate-950/70 rounded-2xl border border-slate-800 space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-300 flex items-center justify-between">
                    <span>{editingProduct ? 'Change Real PDF File (Optional)' : 'Upload Real PDF File (.pdf)'}</span>
                    {editingProduct && (
                      <span className="text-[10px] text-slate-500 font-mono">Current: {editingProduct.storageKey}</span>
                    )}
                  </label>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={e => setSelectedFile(e.target.files?.[0] || null)}
                    className="w-full text-xs text-slate-400 file:mr-2 file:py-1 file:px-2.5 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-600 file:text-white cursor-pointer"
                  />
                  <p className="text-[10px] text-slate-400">
                    {selectedFile
                      ? `Selected replacement: ${selectedFile.name} (${(selectedFile.size / 1024).toFixed(1)} KB)`
                      : editingProduct
                      ? 'Leave empty to keep the existing PDF, or choose a new .pdf file to overwrite it.'
                      : 'If no file is selected, an authentic technical civil engineering PDF will be generated automatically.'}
                  </p>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                  >
                    {editingProduct ? 'Save & Update Real PDF' : 'Upload & Publish Real PDF'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
