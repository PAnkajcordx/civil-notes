/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { SearchBarAndProgrammes } from './components/SearchBarAndProgrammes';
import { HeroBanner } from './components/HeroBanner';
import { UnitCard } from './components/UnitCard';
import { CommunitySection } from './components/CommunitySection';
import { ToolkitsSection } from './components/ToolkitsSection';
import { Footer } from './components/Footer';
import { BottomNav, TabType } from './components/BottomNav';
import { PDFViewerModal } from './components/PDFViewerModal';
import { PDFPaywallModal } from './components/PDFPaywallModal';
import { ToolkitModal } from './components/ToolkitModal';
import { CartDrawer } from './components/CartDrawer';
import { ProfileModal } from './components/ProfileModal';
import { SubjectsView } from './components/SubjectsView';
import { SavedView } from './components/SavedView';
import { CommunityView } from './components/CommunityView';
import { DeckBoard } from './components/DeckBoard';
import { VideoLibrarySection } from './components/VideoLibrarySection';
import { VideoPaywallModal } from './components/VideoPaywallModal';
import { BackgroundCustomizer, BackgroundCanvas, BackgroundTheme } from './components/BackgroundCustomizer';
import { DashboardAutoResponder } from './components/DashboardAutoResponder';

// Paid PDF Platform & Razorpay Components
import { PDFPaymentTable, CatalogProduct } from './components/PDFPaymentTable';
import { RazorpayCheckoutModal } from './components/RazorpayCheckoutModal';
import { ProtectedPDFViewerModal } from './components/ProtectedPDFViewerModal';
import { MyPurchasesView } from './components/MyPurchasesView';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { useAuth } from './context/AuthContext';

import { BTEC_UNITS } from './data/civilData';
import { CIVIL_VIDEOS } from './data/videoData';
import { BTECUnit, CourseworkToolkit, PYQResource, CivilVideo } from './types';
import { isVideoPaid } from './utils/videoPaymentHelper';
import { isPdfPaid, downloadUnlockedPDFDocument } from './utils/pdfPaymentHelper';
import {
  CheckCircle2,
  Search,
  Smartphone,
  Monitor,
  Video,
  Bot,
  ArrowRight,
  X,
  Lock,
  FileText,
  DollarSign,
  ShieldCheck,
  ShoppingBag,
} from 'lucide-react';

const CATEGORIES = [
  'All Units',
  'Construction Principles',
  'Construction Tech',
  'Site & Surveying',
  'Geotechnics & Math',
];

export default function App() {
  const { user, entitlements, hasPurchased } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('notes');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProgramme, setSelectedProgramme] = useState('All Programmes');
  const [selectedCategory, setSelectedCategory] = useState('All Units');

  // Bookmarks & Saved units state
  const [savedUnitIds, setSavedUnitIds] = useState<string[]>(['unit-1', 'unit-30']);

  // Modals & Drawers state
  const [previewUnit, setPreviewUnit] = useState<BTECUnit | null>(null);
  const [selectedToolkit, setSelectedToolkit] = useState<CourseworkToolkit | PYQResource | null>(null);
  const [cartItems, setCartItems] = useState<(CourseworkToolkit | PYQResource)[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAutoResponderOpen, setIsAutoResponderOpen] = useState(false);

  // Paid PDF Platform Modals
  const [checkoutProduct, setCheckoutProduct] = useState<CatalogProduct | null>(null);
  const [viewerProduct, setViewerProduct] = useState<CatalogProduct | null>(null);
  const [isDemoViewer, setIsDemoViewer] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);

  // Video Paywall Modal state
  const [activePaywallVideo, setActivePaywallVideo] = useState<CivilVideo | null>(null);

  // PDF Paywall Modal state
  const [activePdfPaywallUnit, setActivePdfPaywallUnit] = useState<BTECUnit | null>(null);

  // Mobile device frame preview toggle
  const [isMobileFrame, setIsMobileFrame] = useState(true);

  // Background Theme state for dynamic engineering backgrounds
  const [bgTheme, setBgTheme] = useState<BackgroundTheme>('blueprint');

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Toggle unit bookmark
  const handleToggleSave = (unitId: string) => {
    setSavedUnitIds(prev => {
      const isAlready = prev.includes(unitId);
      if (isAlready) {
        showToast('Removed unit from Saved Hub');
        return prev.filter(id => id !== unitId);
      } else {
        showToast('Saved to Coursework Hub');
        return [...prev, unitId];
      }
    });
  };

  // Trigger unit download or paywall
  const handleDownloadUnit = (unit: BTECUnit) => {
    if (isPdfPaid(unit.id) || hasPurchased(unit.id)) {
      downloadUnlockedPDFDocument(unit);
      showToast(`Downloaded full ${unit.unitCodeTag} Distinction Pack!`);
    } else {
      // Map unit to catalog product and open checkout
      const matchedCatalogProduct: CatalogProduct = {
        id: unit.id,
        serialNumber: unit.unitNumber,
        title: `${unit.unitCodeTag}: ${unit.title}`,
        subject: unit.category,
        category: unit.category,
        description: unit.description,
        pageCount: unit.pageCount || 88,
        originalPriceINR: 149,
        discountPriceINR: 100,
        finalPriceINR: unit.priceINR || 49,
        fileSizeBytes: 1024 * 1024 * 2,
        coverGradient: 'from-emerald-700 to-slate-900',
        isPurchased: false,
        demoPagesAvailable: 2,
      };
      setCheckoutProduct(matchedCatalogProduct);
    }
  };

  // Trigger ₹49 Video Paywall for a unit
  const handleOpenVideoPaywallForUnit = (unit: BTECUnit) => {
    const matchingVideo =
      CIVIL_VIDEOS.find(
        v =>
          v.unitCodeTag.toLowerCase().includes(unit.unitCodeTag.toLowerCase().slice(0, 6)) ||
          v.title.toLowerCase().includes(`unit ${unit.unitNumber}`)
      ) || {
        id: `vid-unit-${unit.unitNumber}`,
        title: `${unit.unitCodeTag}: ${unit.title} Distinction Masterclass`,
        unitCodeTag: unit.unitCodeTag,
        duration: '45:00 min',
        quality: '1080p Full HD',
        fileSize: '390 MB',
        tutorName: 'CivilNotes Accredited Faculty',
        description: `Complete numerical walkthrough and coursework step-by-step guidance for ${unit.title}.`,
        priceINR: 49,
        thumbnailColor: 'from-blue-700 to-indigo-900',
        topicsCovered: [
          `${unit.title} Overview & Learning Outcomes`,
          'Step-by-step Numerical Problems & Formula Application',
          'BS EN / Eurocode Specifications Walkthrough',
          'Distinction Criteria Sign-off Guidance',
        ],
      };
    setActivePaywallVideo(matchingVideo);
  };

  // Add toolkit/bundle to cart
  const handleAddToCart = (item: CourseworkToolkit | PYQResource) => {
    setCartItems(prev => [...prev, item]);
    showToast(`Added ${item.title} to Cart!`);
  };

  const handleDownloadAllCart = () => {
    showToast(`Initiating bulk download for ${cartItems.length} toolkits...`);
    setTimeout(() => {
      showToast('All toolkits verified and downloaded!');
      setIsCartOpen(false);
    }, 1500);
  };

  // Filter units based on category, programme, and search query
  const filteredUnits = useMemo(() => {
    return BTEC_UNITS.filter(unit => {
      if (selectedCategory !== 'All Units' && unit.category !== selectedCategory) {
        return false;
      }
      if (selectedProgramme === 'BTEC Level 3' && !unit.level.includes('Level 3')) {
        return false;
      }
      if (selectedProgramme === 'BTEC Level 4 HNC' && !unit.level.includes('Level 4')) {
        return false;
      }
      if (selectedProgramme === 'BTEC Level 5 HND' && !unit.level.includes('Level 5')) {
        return false;
      }
      if (
        selectedProgramme === 'SSC JE Civil' &&
        !unit.category.includes('Principles') &&
        !unit.category.includes('Tech')
      ) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          unit.title.toLowerCase().includes(q) ||
          unit.description.toLowerCase().includes(q) ||
          unit.tag.toLowerCase().includes(q) ||
          unit.unitCodeTag.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [selectedCategory, selectedProgramme, searchQuery]);

  const savedUnits = useMemo(() => {
    return BTEC_UNITS.filter(u => savedUnitIds.includes(u.id));
  }, [savedUnitIds]);

  return (
    <div className="min-h-screen relative overflow-x-hidden font-sans antialiased selection:bg-emerald-100 selection:text-emerald-900">
      {/* Dynamic Animated & Architectural Background Canvas */}
      <BackgroundCanvas theme={bgTheme} />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-white px-4 py-2.5 rounded-xl shadow-lg border border-slate-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Frame Container */}
      <div
        className={`relative z-10 mx-auto transition-all duration-300 ${
          isMobileFrame
            ? 'max-w-[490px] my-0 sm:my-4 sm:rounded-3xl sm:shadow-2xl sm:border sm:border-slate-300/80 overflow-hidden bg-white/95 backdrop-blur-xl'
            : 'max-w-4xl bg-white/95 backdrop-blur-xl min-h-screen shadow-2xl'
        }`}
      >
        {/* Top Header */}
        <Header
          onSearchClick={() => {
            setActiveTab('notes');
            try {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } catch {
              window.scrollTo(0, 0);
            }
          }}
          cartCount={cartItems.length}
          onCartClick={() => setIsCartOpen(true)}
          onProfileClick={() => setIsProfileOpen(true)}
          onAuthClick={() => setIsAuthOpen(true)}
          onAdminClick={() => setIsAdminOpen(true)}
          onPricingClick={() => {
            setActiveTab('pricing');
            showToast('Showing Complete PDF Payment Table');
          }}
          isMobileFrame={isMobileFrame}
          onToggleFrame={() => setIsMobileFrame(prev => !prev)}
          onVideosClick={() => {
            setActiveTab('videos');
            showToast('Showing ₹49 Video Masterclasses');
          }}
          onAutoResponderClick={() => {
            setIsAutoResponderOpen(true);
            showToast('Dashboard Auto-Responder Active');
          }}
        />

        {/* Viewport Content */}
        <main className="px-3.5 sm:px-4 pb-20 pt-2">
          {/* TAB 1: NOTES & UNITS */}
          {activeTab === 'notes' && (
            <div>
              {/* Search Bar & Programme Pills */}
              <SearchBarAndProgrammes
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedProgramme={selectedProgramme}
                onSelectProgramme={setSelectedProgramme}
              />

              {/* Callout Banner to Complete PDF Pricing Table */}
              <div className="mb-3 p-3 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 text-white border border-emerald-500/40 shadow-sm flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center shrink-0">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">
                      Razorpay Gateway Online (INR ₹)
                    </div>
                    <p className="text-[11px] text-slate-300 truncate">
                      Transparent PDF payment table with upfront discounts &amp; 2 free demo pages
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setActiveTab('pricing');
                    showToast('Opening Complete PDF Pricing Table');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shrink-0 shadow-xs"
                >
                  <span>View Pricing</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* Dynamic Auto-Responding to Dashboard Status Strip */}
              <div className="mb-3 p-2.5 rounded-xl bg-gradient-to-r from-slate-900 via-slate-900/95 to-emerald-950 border border-emerald-500/35 text-white flex items-center justify-between gap-2.5 shadow-sm">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative shrink-0">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
                      <Bot className="w-4 h-4" />
                    </div>
                    <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">
                        Automatically Responds to Dashboard
                      </span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                        Active
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 truncate">
                      Real-time reactions to beam parameters, BTEC grading &amp; {savedUnitIds.length} portfolios
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => setIsAutoResponderOpen(true)}
                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 shadow-xs"
                  >
                    <span>Auto-Ask</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('deck');
                      showToast('Opened Deck Board');
                    }}
                    className="hidden xs:flex px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[10px] font-semibold transition-all cursor-pointer"
                  >
                    Deck Board
                  </button>
                </div>
              </div>

              {/* Hero Banner Section */}
              <HeroBanner
                onLearnMore={() => {
                  setActiveTab('pricing');
                  showToast('Viewing PDF Pricing Catalog');
                }}
                onExemplarClick={() => {
                  const unit1 = BTEC_UNITS[0];
                  setPreviewUnit(unit1);
                }}
                onOpenDeck={() => {
                  setActiveTab('deck');
                  showToast('Opened Structural Deck Board');
                }}
                onOpenVideos={() => {
                  setActiveTab('videos');
                  showToast('Showing ₹49 Video Masterclasses');
                }}
              />

              {/* BTEC Unit Portfolios Section Header */}
              <div className="pt-3 pb-2">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                    BTEC Unit Portfolios
                  </h2>
                  <span className="text-[11px] font-medium text-slate-500">
                    Showing core units ({filteredUnits.length})
                  </span>
                </div>

                {/* Horizontal Filter Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                  {CATEGORIES.map(cat => {
                    const isActive = selectedCategory === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                          isActive
                            ? 'bg-[#185a36] text-white shadow-xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80 hover:text-slate-900'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Units List */}
              <div className="space-y-3.5 mt-2">
                {filteredUnits.length === 0 ? (
                  <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
                    <Search className="w-8 h-8 text-slate-400 mx-auto" />
                    <p className="text-sm font-semibold text-slate-800">No matching BTEC units found</p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('All Units');
                        setSelectedProgramme('All Programmes');
                      }}
                      className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold mt-2 cursor-pointer"
                    >
                      Reset Filters
                    </button>
                  </div>
                ) : (
                  filteredUnits.map(unit => {
                    const matchingVideo = CIVIL_VIDEOS.find(
                      v =>
                        v.unitCodeTag.toLowerCase().includes(unit.unitCodeTag.toLowerCase().slice(0, 6)) ||
                        v.title.toLowerCase().includes(`unit ${unit.unitNumber}`)
                    );
                    const isPaid = matchingVideo ? isVideoPaid(matchingVideo.id) : false;
                    const isPdfUnlocked = isPdfPaid(unit.id) || hasPurchased(unit.id);

                    return (
                      <UnitCard
                        key={unit.id}
                        unit={unit}
                        onPreview={setPreviewUnit}
                        onDownload={handleDownloadUnit}
                        isSaved={savedUnitIds.includes(unit.id)}
                        onToggleSave={handleToggleSave}
                        onOpenVideoPaywall={() => handleOpenVideoPaywallForUnit(unit)}
                        isVideoPaid={isPaid}
                        isPdfPaid={isPdfUnlocked}
                        onOpenPdfPaywall={u => setActivePdfPaywallUnit(u)}
                      />
                    );
                  })
                )}
              </div>

              {/* Featured Video Masterclasses Section */}
              <VideoLibrarySection onSelectVideoForPaywall={vid => setActivePaywallVideo(vid)} />

              {/* Community Callout Box */}
              <CommunitySection
                onJoinTelegram={() => showToast('Telegram invite: @BTECCivilNotes')}
                onJoinWhatsApp={() => showToast('Connecting to Tutor Support on WhatsApp...')}
              />

              {/* Toolkits & PYQ Resources Grid */}
              <ToolkitsSection
                onSelectToolkit={toolkit => setSelectedToolkit(toolkit)}
                onSelectPYQ={pyq => setSelectedToolkit(pyq)}
              />

              <Footer
                onOpenPrivacy={() => showToast('CivilNotes Privacy Policy: Student privacy protected.')}
                onOpenTerms={() => showToast('CivilNotes Terms: For educational use.')}
                onOpenSupport={() => showToast('Telegram & WhatsApp help desk active.')}
              />
            </div>
          )}

          {/* TAB 2: COMPLETE PDF PAYMENT TABLE (CORE REQUIREMENT) */}
          {activeTab === 'pricing' && (
            <div className="py-2">
              <PDFPaymentTable
                onBuyProduct={prod => setCheckoutProduct(prod)}
                onOpenViewer={prod => {
                  setViewerProduct(prod);
                  setIsDemoViewer(false);
                }}
                onOpenDemo={prod => {
                  setViewerProduct(prod);
                  setIsDemoViewer(true);
                }}
                onRequireLogin={() => setIsAuthOpen(true)}
              />
            </div>
          )}

          {/* TAB 3: CUSTOMER PURCHASES (MY PDFS) */}
          {activeTab === 'purchases' && (
            <div className="py-2">
              {user ? (
                <MyPurchasesView
                  onOpenViewer={prod => {
                    setViewerProduct(prod);
                    setIsDemoViewer(false);
                  }}
                  onExploreCatalog={() => setActiveTab('pricing')}
                />
              ) : (
                <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                    <Lock className="w-7 h-7" />
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    Login Required to Access Purchased PDFs
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Sign in to view and download all your previously purchased portfolios, study notes, and coursework packs.
                  </p>
                  <button
                    onClick={() => setIsAuthOpen(true)}
                    className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
                  >
                    <span>Sign In to Account</span>
                    <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: RESPONSIVE DECK BOARD */}
          {activeTab === 'deck' && (
            <DeckBoard
              onPreviewUnit={u => setPreviewUnit(u)}
              onDownloadUnit={handleDownloadUnit}
            />
          )}

          {/* TAB 5: VIDEOS MASTERCLASSES (₹49) */}
          {activeTab === 'videos' && (
            <div className="py-2">
              <VideoLibrarySection onSelectVideoForPaywall={vid => setActivePaywallVideo(vid)} />
            </div>
          )}

          {/* TAB 6: SAVED PORTFOLIOS & CHECKLIST */}
          {activeTab === 'saved' && (
            <SavedView
              savedUnits={savedUnits}
              onRemoveSaved={handleToggleSave}
              onPreviewUnit={u => setPreviewUnit(u)}
              onDownloadUnit={handleDownloadUnit}
              onExploreMore={() => setActiveTab('notes')}
              onOpenVideoPaywall={vid => setActivePaywallVideo(vid)}
              onOpenPdfPaywall={u => setActivePdfPaywallUnit(u)}
            />
          )}
        </main>

        {/* Bottom Navigation Bar */}
        <BottomNav
          activeTab={activeTab}
          onTabChange={setActiveTab}
          savedCount={savedUnitIds.length}
          purchasedCount={entitlements.length}
        />
      </div>

      {/* Background Customizer Theme Switcher */}
      <BackgroundCustomizer
        currentTheme={bgTheme}
        onThemeChange={newTheme => {
          setBgTheme(newTheme);
          showToast(`Switched theme to ${newTheme.replace('_', ' ')}`);
        }}
      />

      {/* Floating Device Toggle for Desktop */}
      <div className="fixed bottom-20 right-4 z-40 hidden md:block">
        <button
          onClick={() => setIsMobileFrame(prev => !prev)}
          className="flex items-center gap-2 px-3.5 py-2 bg-slate-900/90 text-white rounded-full text-xs font-semibold shadow-lg hover:bg-slate-800 transition-all border border-slate-700 cursor-pointer backdrop-blur-md"
        >
          {isMobileFrame ? (
            <>
              <Monitor className="w-3.5 h-3.5" />
              <span>Full Screen View</span>
            </>
          ) : (
            <>
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Mobile Phone Frame</span>
            </>
          )}
        </button>
      </div>

      {/* Razorpay Official Checkout Modal */}
      <RazorpayCheckoutModal
        product={checkoutProduct}
        onClose={() => setCheckoutProduct(null)}
        onPaymentSuccess={prod => {
          showToast(`Payment confirmed! ${prod.title} unlocked.`);
          setViewerProduct(prod);
          setIsDemoViewer(false);
        }}
      />

      {/* Protected PDF Viewer Modal */}
      <ProtectedPDFViewerModal
        product={viewerProduct}
        isDemoMode={isDemoViewer}
        onClose={() => setViewerProduct(null)}
        onOpenCheckout={prod => {
          setViewerProduct(null);
          setCheckoutProduct(prod);
        }}
      />

      {/* Admin Dashboard */}
      {isAdminOpen && <AdminDashboard onClose={() => setIsAdminOpen(false)} />}

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={() => showToast('Signed in successfully!')}
      />

      {/* Interactive PDF Document Viewer */}
      <PDFViewerModal
        unit={previewUnit}
        onClose={() => setPreviewUnit(null)}
        onOpenPdfPaywall={u => setActivePdfPaywallUnit(u)}
        onOpenVideoPaywall={vid => setActivePaywallVideo(vid)}
      />

      {/* Dedicated PDF Paywall Modal */}
      <PDFPaywallModal
        unit={activePdfPaywallUnit}
        onClose={() => setActivePdfPaywallUnit(null)}
        onOpenDemo={u => setPreviewUnit(u)}
        onPaymentSuccess={(u, txn) => {
          showToast(`₹${txn.amountINR} Payment Confirmed! ${u.unitCodeTag} Full PDF Unlocked.`);
        }}
      />

      {/* Universal ₹49 Video Paywall & Download Modal */}
      <VideoPaywallModal
        video={activePaywallVideo}
        onClose={() => setActivePaywallVideo(null)}
        onSuccess={(vid, txn) => {
          showToast(`₹49 Payment Confirmed! ${vid.unitCodeTag} Video Download Started.`);
        }}
      />

      {/* Coursework Toolkit Modal */}
      <ToolkitModal
        item={selectedToolkit}
        onClose={() => setSelectedToolkit(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemoveItem={index => setCartItems(prev => prev.filter((_, i) => i !== index))}
        onClearCart={() => setCartItems([])}
        onDownloadAll={handleDownloadAllCart}
      />

      {/* Student Profile Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onViewPurchases={() => {
          setActiveTab('purchases');
        }}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Dedicated Dashboard Auto-Responder Modal */}
      {isAutoResponderOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl">
            <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Live Dashboard Auto-Responder
                </span>
              </div>
              <button
                onClick={() => setIsAutoResponderOpen(false)}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4">
              <DashboardAutoResponder
                savedUnitsCount={savedUnitIds.length}
                latestEventTrigger="Inspecting Auto-Responder from Hub"
                onApplyFix={(param, val) => {
                  showToast(`Applied parameter update: ${param}`);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
