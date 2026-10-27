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
import { DocumentPreviewModal } from './components/DocumentPreviewModal';
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
import { BTEC_UNITS } from './data/civilData';
import { CIVIL_VIDEOS } from './data/videoData';
import { BTECUnit, CourseworkToolkit, PYQResource, CivilVideo } from './types';
import { downloadUnitPortfolio } from './utils/downloadHelper';
import { isVideoPaid } from './utils/videoPaymentHelper';
import { CheckCircle2, Search, Smartphone, Monitor, Sliders, Video } from 'lucide-react';

const CATEGORIES = [
  'All Units',
  'Construction Principles',
  'Construction Tech',
  'Site & Surveying',
  'Geotechnics & Math'
];

export default function App() {
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
  
  // Video Paywall Modal state (Universal ₹49 paywall for any video)
  const [activePaywallVideo, setActivePaywallVideo] = useState<CivilVideo | null>(null);

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

  // Trigger unit download
  const handleDownloadUnit = (unit: BTECUnit) => {
    downloadUnitPortfolio(unit);
    showToast(`Downloaded ${unit.unitCodeTag} Distinction Pack!`);
  };

  // Trigger ₹49 Video Paywall for a unit
  const handleOpenVideoPaywallForUnit = (unit: BTECUnit) => {
    const matchingVideo = CIVIL_VIDEOS.find(v => 
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
        'Distinction Criteria Sign-off Guidance'
      ]
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
      // Category filter
      if (selectedCategory !== 'All Units' && unit.category !== selectedCategory) {
        return false;
      }

      // Programme filter
      if (selectedProgramme === 'BTEC Level 3' && !unit.level.includes('Level 3')) {
        return false;
      }
      if (selectedProgramme === 'BTEC Level 4 HNC' && !unit.level.includes('Level 4')) {
        return false;
      }
      if (selectedProgramme === 'BTEC Level 5 HND' && !unit.level.includes('Level 5')) {
        return false;
      }
      if (selectedProgramme === 'SSC JE Civil' && !unit.category.includes('Principles') && !unit.category.includes('Tech')) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = unit.title.toLowerCase().includes(q);
        const matchDesc = unit.description.toLowerCase().includes(q);
        const matchTag = unit.tag.toLowerCase().includes(q);
        const matchCode = unit.unitCodeTag.toLowerCase().includes(q);
        return matchTitle || matchDesc || matchTag || matchCode;
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

      {/* Frame Container: allows toggling between mobile device screen and expanded view */}
      <div className={`relative z-10 mx-auto transition-all duration-300 ${
        isMobileFrame 
          ? 'max-w-[490px] my-0 sm:my-4 sm:rounded-3xl sm:shadow-2xl sm:border sm:border-slate-300/80 overflow-hidden bg-white/95 backdrop-blur-xl' 
          : 'max-w-4xl bg-white/95 backdrop-blur-xl min-h-screen shadow-2xl'
      }`}>
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
          isMobileFrame={isMobileFrame}
          onToggleFrame={() => setIsMobileFrame(prev => !prev)}
          onVideosClick={() => {
            setActiveTab('videos');
            showToast('Showing ₹49 Video Masterclasses');
          }}
        />

        {/* Viewport Content */}
        <main className="px-3.5 sm:px-4 pb-20">
          {/* TAB 1: NOTES (Exact UI from screenshot) */}
          {activeTab === 'notes' && (
            <div>
              {/* Search Bar & Programme Pills */}
              <SearchBarAndProgrammes
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedProgramme={selectedProgramme}
                onSelectProgramme={setSelectedProgramme}
              />

              {/* Hero Banner Section */}
              <HeroBanner
                onLearnMore={() => {
                  setSelectedCategory('All Units');
                  showToast('Viewing full specification units');
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
                    Showing all core units ({filteredUnits.length})
                  </span>
                </div>

                {/* Horizontal Filter Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                  {CATEGORIES.map((cat) => {
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
                    <p className="text-xs text-slate-500">
                      Try searching for "Structural", "Surveying", "Geotechnics", or clear filters.
                    </p>
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
                  filteredUnits.map((unit) => {
                    const matchingVideo = CIVIL_VIDEOS.find(v => 
                      v.unitCodeTag.toLowerCase().includes(unit.unitCodeTag.toLowerCase().slice(0, 6)) ||
                      v.title.toLowerCase().includes(`unit ${unit.unitNumber}`)
                    );
                    const isPaid = matchingVideo ? isVideoPaid(matchingVideo.id) : false;

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
                      />
                    );
                  })
                )}
              </div>

              {/* Featured Video Masterclasses (₹49) Section on Notes Page */}
              <VideoLibrarySection
                onSelectVideoForPaywall={(vid) => setActivePaywallVideo(vid)}
              />

              {/* Community Callout Box ("Join 15,000+ BTEC Civil Students") */}
              <CommunitySection
                onJoinTelegram={() => {
                  showToast('Telegram invite: @BTECCivilNotes');
                }}
                onJoinWhatsApp={() => {
                  showToast('Connecting to Tutor Support on WhatsApp...');
                }}
              />

              {/* Popular BTEC Coursework Toolkits & PYQ Resources Grid */}
              <ToolkitsSection
                onSelectToolkit={(toolkit) => setSelectedToolkit(toolkit)}
                onSelectPYQ={(pyq) => setSelectedToolkit(pyq)}
              />

              {/* Footer matching screenshot */}
              <Footer
                onOpenPrivacy={() => showToast('CivilNotes Privacy Policy: Student privacy protected.')}
                onOpenTerms={() => showToast('CivilNotes Terms: For educational and coursework guidance use.')}
                onOpenSupport={() => showToast('Telegram & WhatsApp help desk active.')}
              />
            </div>
          )}

          {/* TAB 2: RESPONSIVE DECK BOARD */}
          {activeTab === 'deck' && (
            <DeckBoard
              onPreviewUnit={(u) => setPreviewUnit(u)}
              onDownloadUnit={handleDownloadUnit}
            />
          )}

          {/* TAB 3: VIDEOS MASTERCLASSES (₹49) */}
          {activeTab === 'videos' && (
            <div className="py-2">
              <VideoLibrarySection
                onSelectVideoForPaywall={(vid) => setActivePaywallVideo(vid)}
              />
            </div>
          )}

          {/* TAB 4: SUBJECTS DIRECTORY */}
          {activeTab === 'subjects' && (
            <SubjectsView
              units={BTEC_UNITS}
              onSelectUnit={(title) => {
                setActiveTab('notes');
                setSearchQuery(title);
              }}
              onPreviewUnit={(u) => setPreviewUnit(u)}
            />
          )}

          {/* TAB 5: SAVED PORTFOLIOS & CHECKLIST */}
          {activeTab === 'saved' && (
            <SavedView
              savedUnits={savedUnits}
              onRemoveSaved={handleToggleSave}
              onPreviewUnit={(u) => setPreviewUnit(u)}
              onDownloadUnit={handleDownloadUnit}
              onExploreMore={() => setActiveTab('notes')}
              onOpenVideoPaywall={(vid) => setActivePaywallVideo(vid)}
            />
          )}

          {/* TAB 6: COMMUNITY & TUTOR HELP */}
          {activeTab === 'community' && (
            <CommunityView />
          )}
        </main>

        {/* Bottom Navigation Bar */}
        <BottomNav
          activeTab={activeTab}
          onTabChange={setActiveTab}
          savedCount={savedUnitIds.length}
        />
      </div>

      {/* Background Customizer Theme Switcher */}
      <BackgroundCustomizer
        currentTheme={bgTheme}
        onThemeChange={(newTheme) => {
          setBgTheme(newTheme);
          showToast(`Switched theme to ${newTheme.replace('_', ' ')}`);
        }}
      />

      {/* Floating Device Toggle for easy view switching on Desktop */}
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

      {/* Document Preview Modal */}
      <DocumentPreviewModal
        unit={previewUnit}
        onClose={() => setPreviewUnit(null)}
        onDownload={handleDownloadUnit}
        onOpenVideoPaywall={(vid) => setActivePaywallVideo(vid)}
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
        onRemoveItem={(index) => setCartItems(prev => prev.filter((_, i) => i !== index))}
        onClearCart={() => setCartItems([])}
        onDownloadAll={handleDownloadAllCart}
      />

      {/* Student Profile Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </div>
  );
}
