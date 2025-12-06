
import React, { useState, useMemo, useEffect, ReactNode } from 'react';
import { Navbar } from './components/Navbar';
import { HeroCarousel } from './components/HeroCarousel';
import { ArticleViewer } from './components/ArticleViewer';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { TermsModal } from './components/TermsModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminDashboard } from './components/AdminDashboard';
import { DataProvider, useData } from './components/DataProvider';
import { AccessibilityWidget } from './components/AccessibilityWidget';
import { Search, Sprout, BookOpen, Briefcase, Megaphone, AlertTriangle } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

// --- Error Boundary Component ---
interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  // Explicitly declare state and props to avoid TypeScript errors
  public state: ErrorBoundaryState = { hasError: false };
  public props: ErrorBoundaryProps;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.props = props;
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("App Crash:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 text-center p-4">
          <div>
            <AlertTriangle size={48} className="mx-auto text-red-500 mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">משהו השתבש...</h1>
            <p className="text-gray-600 mb-4">אנא רענן את העמוד ונסה שוב.</p>
            <button onClick={() => window.location.reload()} className="bg-nature-darkSage text-white px-6 py-2 rounded-full">רענן עמוד</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const AnnouncementBar: React.FC = () => {
  const { globalSettings } = useData();
  if (!globalSettings?.announcementBar?.enabled) return null;

  const { text, bgColor, textColor } = globalSettings.announcementBar;
  return (
    <div 
      className="fixed top-0 left-0 right-0 z-[60] w-full py-2 px-4 text-center text-sm md:text-base font-bold flex items-center justify-center gap-2 shadow-sm"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
       <Megaphone size={18} className="animate-pulse" />
       <span>{text}</span>
    </div>
  );
};

const MainApp: React.FC = () => {
  const { articles, generalArticles, caseStudies, logVisit, globalSettings } = useData();
  
  useEffect(() => {
    logVisit();
  }, []);

  const [selectedItem, setSelectedItem] = useState<{type: 'plant' | 'general' | 'case', id: string} | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'plant' | 'general' | 'case'>('all');
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Calculate announcement height for offset
  const announcementHeight = globalSettings?.announcementBar?.enabled ? 40 : 0; 

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    const collectTags = (list: any[]) => {
      if (!list) return;
      list.forEach(item => {
        item.tabs?.forEach((tab: any) => tab.tags?.forEach((t: string) => tags.add(t)));
      });
    };
    collectTags(articles);
    collectTags(generalArticles);
    collectTags(caseStudies);
    return Array.from(tags).sort();
  }, [articles, generalArticles, caseStudies]);

  const allItems = useMemo(() => {
    const p = (articles || []).map(i => ({ ...i, type: 'plant' as const }));
    const g = (generalArticles || []).map(i => ({ ...i, type: 'general' as const }));
    const c = (caseStudies || []).map(i => ({ ...i, type: 'case' as const }));
    return [...p, ...g, ...c];
  }, [articles, generalArticles, caseStudies]);

  const displayItems = useMemo(() => {
    // 1. If actively searching or filtering by category, show ALL matching results
    if (activeFilter !== 'all' || searchQuery) {
      let filtered = allItems;
      if (activeFilter !== 'all') {
        filtered = filtered.filter(item => item.type === activeFilter);
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter(item => {
          if (item.title?.toLowerCase().includes(q)) return true;
          return item.tabs?.some((tab: any) => 
            tab.tags?.some((tag: string) => tag.toLowerCase().includes(q))
          ) ?? false;
        });
      }
      return filtered;
    }

    // 2. Default View (No Search, All Categories): Show curated random mix of 8 items
    
    const shuffle = (array: any[]) => [...array].sort(() => 0.5 - Math.random());

    const plants = allItems.filter(i => i.type === 'plant');
    const general = allItems.filter(i => i.type === 'general');
    const cases = allItems.filter(i => i.type === 'case');

    // Shuffle each category independently
    const shuffledPlants = shuffle(plants);
    const shuffledGeneral = shuffle(general);
    const shuffledCases = shuffle(cases);

    // Pick 2 from each (if available)
    const selectedPlants = shuffledPlants.slice(0, 2);
    const selectedGeneral = shuffledGeneral.slice(0, 2);
    const selectedCases = shuffledCases.slice(0, 2);

    // Create a pool of remaining items
    const remainingItems = [
      ...shuffledPlants.slice(2),
      ...shuffledGeneral.slice(2),
      ...shuffledCases.slice(2)
    ];

    // Pick 2 random items from the remaining pool
    const randomExtras = shuffle(remainingItems).slice(0, 2);

    // Combine all selected items and shuffle final result
    const finalSelection = [
      ...selectedPlants,
      ...selectedGeneral,
      ...selectedCases,
      ...randomExtras
    ];

    return shuffle(finalSelection).slice(0, 8); // Ensure max 8 just in case

  }, [allItems, activeFilter, searchQuery]);

  const activeViewerItem = useMemo(() => {
    if (!selectedItem) return null;
    return allItems.find(i => i.id === selectedItem.id && i.type === selectedItem.type) || null;
  }, [selectedItem, allItems]);

  const handleAdminAccess = () => {
    if (isAdminLoggedIn) {
      setIsAdminDashboardOpen(true);
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'plant': return <Sprout size={16} />;
      case 'case': return <Briefcase size={16} />;
      default: return <BookOpen size={16} />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch(type) {
      case 'plant': return 'צמח מרפא';
      case 'case': return 'מקרה אירוע';
      default: return 'מאמר מקצועי';
    }
  };

  return (
    <div className="bg-nature-50 text-nature-900 font-sans selection:bg-nature-sage selection:text-white relative pb-16">
      
      {/* 1. Announcement Bar (Fixed) */}
      <AnnouncementBar />
      
      {/* 2. Navbar (Fixed) */}
      <Navbar onLogoClick={handleAdminAccess} announcementHeight={announcementHeight} />
      
      <AdminLoginModal 
        isOpen={isAdminLoginOpen} 
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={() => {
          setIsAdminLoggedIn(true);
          setIsAdminDashboardOpen(true);
        }}
      />
      
      {isAdminDashboardOpen && (
        <AdminDashboard onClose={() => setIsAdminDashboardOpen(false)} />
      )}
      
      {/* SCROLL SECTIONS */}
      {/* Added pt to first section to account for fixed header */}
      <HeroCarousel />
      <AboutSection />

      {/* --- KNOWLEDGE CENTER --- */}
      <section id="knowledge-center" className="min-h-screen relative pb-20 bg-nature-50 snap-start pt-24">
        
        <div className="pb-8 text-center px-4 bg-nature-50">
          <h2 className="text-4xl font-serif font-bold text-nature-900 mb-2">מרכז הידע</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            מאגר מידע מקיף הכולל צמחי מרפא, מאמרים וניתוחי מקרה מהקליניקה
          </p>
        </div>

        {/* STICKY CONTROL BAR */}
        <div 
           className="sticky z-40 bg-nature-100/95 backdrop-blur-md border-b border-nature-200 shadow-sm py-4 transition-all"
           style={{ top: announcementHeight + 60 }} // Adjust based on navbar height
        >
          
          {/* Visual Bridge */}
          <div className="absolute -top-10 left-0 right-0 h-10 bg-nature-100/95"></div>

          <div className="container mx-auto px-4 max-w-7xl flex flex-col md:flex-row gap-4 items-center justify-between relative z-10">
            
            {/* Search Input */}
            <div className="relative w-full md:w-1/3">
              <input 
                type="text" 
                list="tags-list"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="חפשי נושא, צמח או תגית..."
                className="w-full bg-white border border-gray-200 rounded-full py-3 px-10 text-gray-800 focus:border-nature-sage focus:ring-2 focus:ring-nature-sage/20 outline-none shadow-sm text-base transition-all"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <datalist id="tags-list">
                {allTags.map(tag => (
                  <option key={tag} value={tag} />
                ))}
              </datalist>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 w-full md:w-auto no-scrollbar scroll-smooth px-2">
               {[
                 { id: 'all', label: 'הכל' },
                 { id: 'plant', label: 'צמחי מרפא' },
                 { id: 'general', label: 'מאמרים' },
                 { id: 'case', label: 'מקרי אירוע' },
               ].map(tab => (
                 <button
                   key={tab.id}
                   onClick={() => setActiveFilter(tab.id as any)}
                   className={`px-6 py-2 rounded-full font-bold text-sm transition-all duration-300 whitespace-nowrap shadow-sm ${
                     activeFilter === tab.id 
                       ? 'bg-nature-darkSage text-white scale-105' 
                       : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200 hover:border-nature-sage'
                   }`}
                 >
                   {tab.label}
                 </button>
               ))}
            </div>
          </div>
        </div>

        {/* Grid Content */}
        <div className="container mx-auto max-w-7xl px-4 py-12">
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <AnimatePresence>
              {displayItems.map((item) => (
                <motion.div
                  layout
                  layoutId={`card-${item.id}`}
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -8 }}
                  onClick={() => setSelectedItem({ id: item.id, type: item.type })}
                  className="bg-white rounded-xl shadow-sm hover:shadow-2xl overflow-hidden border border-gray-100 cursor-pointer group flex flex-col h-full transition-all duration-300"
                >
                  <div className="relative h-56 overflow-hidden bg-gray-100">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      loading="lazy"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-nature-900 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                       {getIcon(item.type)}
                       <span>{getTypeLabel(item.type)}</span>
                    </div>
                  </div>
                  
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-nature-900 mb-2 font-serif group-hover:text-nature-darkSage transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-500 text-sm line-clamp-3 mb-4 flex-1 leading-relaxed">
                      {item.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-gray-100">
                      {item.tabs?.[0]?.tags?.slice(0, 3).map((tag: string) => (
                        <span key={tag} className="text-[10px] bg-nature-100 text-nature-darkSage px-2 py-1 rounded font-bold uppercase tracking-wide">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {displayItems.length === 0 && (
            <div className="text-center py-20 opacity-50">
              <Sprout size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-xl text-gray-500">לא נמצאו תוצאות לחיפוש זה</p>
            </div>
          )}
        </div>
      </section>

      <TestimonialsSection />
      <ContactSection />

      {/* FIXED FOOTER */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 bg-nature-900/95 backdrop-blur-md py-3 border-t border-nature-800 text-gray-400 text-sm shadow-[0_-5px_15px_rgba(0,0,0,0.3)]">
        <div className="container mx-auto px-6 flex justify-between items-center">
           <div className="flex gap-4 items-center">
             <button onClick={() => setIsTermsOpen(true)} className="hover:text-white transition-colors underline text-xs md:text-sm">
               תנאי שימוש והצהרת בריאות
             </button>
             <span className="hidden md:inline">|</span>
             <p className="hidden md:block">© 2024 כל הזכויות שמורות</p>
           </div>
           <p className="font-serif text-xl text-white font-bold">HerbalC</p>
        </div>
      </footer>

      {/* Floating Accessibility Widget - Adjusted position to be above footer */}
      <div className="mb-12">
        <AccessibilityWidget />
      </div>

      <AnimatePresence>
        {activeViewerItem && (
          <ArticleViewer 
            article={activeViewerItem}
            onSelectArticle={(id, type) => setSelectedItem({ id, type })}
            onClose={() => setSelectedItem(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isTermsOpen && <TermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />}
      </AnimatePresence>

    </div>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <DataProvider>
        <MainApp />
      </DataProvider>
    </ErrorBoundary>
  );
};

export default App;