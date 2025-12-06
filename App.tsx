
import React, { useState, useMemo, useEffect, ReactNode, Component } from 'react';
import { Navbar } from './components/Navbar';
import { HeroCarousel } from './components/HeroCarousel';
import { ArticleViewer } from './components/ArticleViewer';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
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
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
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
      className="sticky top-0 z-[60] w-full py-2 px-4 text-center text-sm md:text-base font-bold flex items-center justify-center gap-2 shadow-sm"
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
  
  // Calculate announcement height for offset is now handled by sticky stack automatically
  const announcementHeight = 0; 

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
    
    // Pick 2 from each
    const picks = [
        ...shuffledPlants.slice(0, 2),
        ...shuffledGeneral.slice(0, 2),
        ...shuffledCases.slice(0, 2)
    ];

    // Fill remaining 2 spots with randoms from what's left
    const remaining = allItems.filter(item => !picks.includes(item));
    const randomFill = shuffle(remaining).slice(0, 2);

    return [...picks, ...randomFill];

  }, [allItems, activeFilter, searchQuery]);

  const handleSelectArticle = (id: string, type: 'plant' | 'general' | 'case') => {
    setSelectedItem({ id, type });
  };

  const selectedArticleData = useMemo(() => {
    if (!selectedItem) return null;
    const list = selectedItem.type === 'plant' ? articles : selectedItem.type === 'general' ? generalArticles : caseStudies;
    return list.find(a => a.id === selectedItem.id);
  }, [selectedItem, articles, generalArticles, caseStudies]);

  const handleLogoClick = () => {
    if (isAdminLoggedIn) {
      setIsAdminDashboardOpen(true);
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  const handleLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    setIsAdminDashboardOpen(true);
  };

  return (
    <div className="min-h-screen bg-nature-50 font-sans text-nature-900 selection:bg-nature-sage selection:text-white">
      <AnnouncementBar />
      <Navbar onLogoClick={handleLogoClick} announcementHeight={announcementHeight} />
      
      <main className="relative">
        <HeroCarousel />
        <AboutSection />
        
        {/* Knowledge Center */}
        <section id="knowledge-center" className="min-h-screen py-20 px-4 md:px-8 bg-nature-50 relative scroll-mt-24">
           <div className="container mx-auto max-w-7xl">
             <div className="text-center mb-12">
               <h3 className="text-nature-sage font-bold uppercase tracking-wider mb-2 flex items-center justify-center gap-2">
                 <Sprout size={20} /> מאגר הידע
               </h3>
               <h2 className="text-4xl md:text-5xl font-serif text-nature-900">צמחים, מאמרים ומקרי בוחן</h2>
             </div>

             {/* Sticky Filter Bar */}
             <div className="sticky top-[76px] z-40 bg-nature-50/95 backdrop-blur-md py-4 mb-8 shadow-sm border-b border-nature-200 -mx-4 px-4 md:-mx-8 md:px-8 transition-all duration-300">
               <div className="absolute -top-6 left-0 right-0 h-6 bg-nature-50"></div> {/* Visual bridge to prevent gaps */}
               <div className="container mx-auto max-w-7xl flex flex-col md:flex-row gap-4 justify-between items-center">
                 
                 {/* Filter Tabs */}
                 <div className="flex p-1 bg-white rounded-full border border-nature-200 shadow-sm overflow-x-auto max-w-full no-scrollbar">
                   <button onClick={() => setActiveFilter('all')} className={`px-6 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${activeFilter === 'all' ? 'bg-nature-darkSage text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>הכל</button>
                   <button onClick={() => setActiveFilter('plant')} className={`px-6 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 ${activeFilter === 'plant' ? 'bg-white text-nature-darkSage border border-nature-darkSage shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}><Sprout size={14}/> צמחי מרפא</button>
                   <button onClick={() => setActiveFilter('general')} className={`px-6 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 ${activeFilter === 'general' ? 'bg-white text-nature-darkSage border border-nature-darkSage shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}><BookOpen size={14}/> מאמרים</button>
                   <button onClick={() => setActiveFilter('case')} className={`px-6 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 ${activeFilter === 'case' ? 'bg-white text-nature-darkSage border border-nature-darkSage shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}><Briefcase size={14}/> מקרי אירוע</button>
                 </div>

                 {/* Search */}
                 <div className="relative w-full md:w-96 group">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-nature-sage transition-colors" size={20} />
                    <input 
                      type="text"
                      placeholder="חפשי נושא, צמח או תגית..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white border border-nature-200 rounded-full py-3 pr-12 pl-4 text-sm focus:outline-none focus:border-nature-sage focus:ring-4 focus:ring-nature-sage/10 transition-all shadow-sm"
                    />
                 </div>
               </div>
             </div>

             {/* Content Grid */}
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <AnimatePresence mode="popLayout">
                  {displayItems.map((item) => (
                    <motion.div
                      layout
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => handleSelectArticle(item.id, item.type)}
                      className="group bg-white rounded-2xl overflow-hidden border border-nature-100 hover:border-nature-300 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col h-full"
                    >
                      <div className="h-48 overflow-hidden relative">
                         <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                         <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-nature-900 shadow-sm flex items-center gap-1">
                            {item.type === 'plant' ? <Sprout size={12}/> : item.type === 'general' ? <BookOpen size={12}/> : <Briefcase size={12}/>}
                            {item.type === 'plant' ? 'צמח מרפא' : item.type === 'general' ? 'מאמר' : 'מקרה בוחן'}
                         </div>
                      </div>
                      <div className="p-5 flex-1 flex flex-col">
                         <h3 className="text-xl font-bold font-serif mb-1 group-hover:text-nature-darkSage transition-colors">{item.title}</h3>
                         <p className="text-sm text-nature-sage font-medium mb-3">{item.subtitle}</p>
                         <p className="text-gray-500 text-sm line-clamp-3 mb-4 flex-1">{item.description}</p>
                         <div className="flex flex-wrap gap-2 mt-auto">
                            {item.tabs?.[0]?.tags?.slice(0,2).map(tag => (
                              <span key={tag} className="text-[10px] bg-nature-50 text-nature-800 px-2 py-1 rounded-md border border-nature-100">#{tag}</span>
                            ))}
                         </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
             </div>
             
             {displayItems.length === 0 && (
               <div className="text-center py-20 opacity-60">
                 <Sprout size={48} className="mx-auto mb-4 text-gray-300" />
                 <p className="text-xl">לא נמצאו תוצאות לחיפוש זה.</p>
               </div>
             )}
           </div>
        </section>

        <ContactSection />
      </main>

      {/* Fixed Footer */}
      <footer className="bg-nature-900 text-white py-4 border-t border-white/10 relative z-30">
        <div className="container mx-auto px-6 text-center">
           <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm opacity-60 hover:opacity-100 transition-opacity">
             <p>© 2024 HerbalC - רפואה טבעית בהתאמה אישית.</p>
             <button onClick={() => setIsTermsOpen(true)} className="hover:text-white underline decoration-white/30 hover:decoration-white">תנאי שימוש והצהרת בריאות</button>
           </div>
        </div>
      </footer>

      {/* Modals & Overlays */}
      <AnimatePresence>
        {selectedItem && selectedArticleData && (
          <ArticleViewer 
            article={selectedArticleData} 
            onSelectArticle={handleSelectArticle}
            onClose={() => setSelectedItem(null)} 
          />
        )}
      </AnimatePresence>

      <AdminLoginModal 
        isOpen={isAdminLoginOpen} 
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {isAdminLoggedIn && isAdminDashboardOpen && (
        <AdminDashboard onClose={() => setIsAdminDashboardOpen(false)} />
      )}

      <TermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
      
      <AccessibilityWidget />

    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <DataProvider>
        <MainApp />
      </DataProvider>
    </ErrorBoundary>
  );
}