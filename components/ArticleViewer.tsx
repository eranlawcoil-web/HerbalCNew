
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Article } from '../types';
import { useData } from './DataProvider';
import { BookOpen, Sprout, Briefcase, FileText, X, Calendar, Clock } from 'lucide-react';

interface ArticleViewerProps {
  article: Article;
  onSelectArticle: (id: string, type: 'plant' | 'general' | 'case') => void;
  onClose: () => void;
}

export const ArticleViewer: React.FC<ArticleViewerProps> = ({ article, onSelectArticle, onClose }) => {
  const { articles, generalArticles, caseStudies } = useData();
  const [activeTabId, setActiveTabId] = useState<string>('');

  useEffect(() => {
    if (article && article.tabs && article.tabs.length > 0) {
      setActiveTabId(article.tabs[0].id);
    }
  }, [article]);

  const activeTab = useMemo(() => {
     if (!article?.tabs) return null;
     return article.tabs.find(t => t.id === activeTabId) || article.tabs[0];
  }, [article, activeTabId]);

  // Generates a deterministic date within the last year based on the article ID
  const dynamicDate = useMemo(() => {
    if (!article?.id) return '';
    const today = new Date();
    // Create a simple hash from the ID
    const hash = article.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    // Determine days to subtract (between 0 and 365)
    const daysToSubtract = hash % 365;
    
    const date = new Date(today);
    date.setDate(date.getDate() - daysToSubtract);
    
    return date.toLocaleDateString('he-IL', { day: 'numeric', month: 'long', year: 'numeric' });
  }, [article?.id]);

  const relatedItems = useMemo(() => {
    if (!activeTab || !activeTab.tags) return [];
    
    const currentTags = activeTab.tags;
    
    const allItems = [
      ...(articles || []).map(a => ({ ...a, type: 'plant' as const })),
      ...(generalArticles || []).map(a => ({ ...a, type: 'general' as const })),
      ...(caseStudies || []).map(a => ({ ...a, type: 'case' as const }))
    ];

    return allItems
      .filter(item => item.id !== article.id) 
      .map(otherItem => {
        const matchCount = (otherItem.tabs || []).reduce((acc, tab) => {
          const intersection = (tab.tags || []).filter(tag => currentTags.includes(tag));
          return acc + intersection.length;
        }, 0);
        return { item: otherItem, score: matchCount };
      })
      .filter(entry => entry.score > 0)
      .sort((a, b) => b.score - a.score) 
      .slice(0, 3) 
      .map(entry => entry.item);
  }, [article?.id, activeTab, articles, generalArticles, caseStudies]);

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'plant': return <Sprout size={12} />;
      case 'case': return <Briefcase size={12} />;
      default: return <FileText size={12} />;
    }
  };

  const getTypeName = (type: string) => {
    switch(type) {
      case 'plant': return 'צמח מרפא';
      case 'case': return 'מקרה אירוע';
      default: return 'מאמר';
    }
  };

  if (!article) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-6">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal Content */}
      <motion.div 
        layoutId={`card-${article.id}`}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-5xl h-full md:h-[90vh] bg-white md:rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
      >
        {/* Close Button - High Contrast & Visible */}
        <button 
          onClick={onClose} 
          className="absolute top-4 left-4 z-50 p-3 bg-black/60 hover:bg-black text-white rounded-full transition-all shadow-lg backdrop-blur-sm group"
          title="סגור חלונית"
        >
          <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>

        {/* Left Side: Image & Title (Desktop: 40% width) */}
        <div className="w-full md:w-2/5 h-64 md:h-full relative shrink-0">
          <img 
            src={article.image} 
            alt={article.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          <div className="absolute bottom-0 p-8 text-white">
             <div className="flex items-center gap-2 text-earth-accent mb-2 text-sm font-bold uppercase tracking-wider">
                <Calendar size={14} />
                <span>עודכן לאחרונה: {dynamicDate}</span>
             </div>
             <h2 className="text-3xl font-serif font-bold mb-2 text-white">{article.title}</h2>
             <p className="text-lg opacity-90 font-light">{article.subtitle}</p>
             <p className="mt-4 text-sm opacity-80 leading-relaxed border-t border-white/20 pt-4 line-clamp-4">
               {article.description}
             </p>
          </div>
        </div>

        {/* Right Side: Content (Desktop: 60% width) */}
        <div className="flex-1 flex flex-col h-full bg-white overflow-hidden relative">
          
          {/* Tabs Header - Redesigned as Pills */}
          <div className="px-6 pt-6 pb-2 border-b border-gray-100 flex-shrink-0 bg-white sticky top-0 z-10">
             {article.tabs && article.tabs.length > 0 && (
              <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                {article.tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTabId(tab.id)}
                    className={`px-5 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap shadow-sm border ${
                      activeTabId === tab.id 
                        ? 'bg-nature-darkSage text-white border-nature-darkSage shadow-md scale-105' 
                        : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100 hover:text-gray-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Tab Content Body */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-nature-50">
             <AnimatePresence mode='wait'>
                {activeTab && (
                  <motion.div
                    key={activeTab.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div 
                      className="text-nature-900 leading-loose text-lg whitespace-pre-line prose prose-stone max-w-none"
                      dangerouslySetInnerHTML={{ __html: activeTab.content }} 
                    />
                    
                    {/* Tags */}
                    <div className="mt-8 flex gap-2 flex-wrap pt-6 border-t border-gray-200">
                      {activeTab.tags?.map(tag => (
                        <span key={tag} className="text-xs uppercase tracking-wider text-nature-darkSage bg-nature-100 px-3 py-1 rounded-full font-bold">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}
             </AnimatePresence>
          </div>

          {/* Related Items Footer */}
          {relatedItems.length > 0 && (
             <div className="p-6 bg-white border-t border-gray-100 shrink-0 shadow-[0_-5px_15px_rgba(0,0,0,0.02)] z-10">
                <div className="flex items-center gap-2 mb-4 text-gray-400">
                  <BookOpen size={16} />
                  <h3 className="uppercase tracking-widest text-xs font-bold">
                    אולי יעניין אותך גם
                  </h3>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {relatedItems.map((rel) => (
                    <div 
                      key={rel.id}
                      onClick={() => onSelectArticle(rel.id, rel.type)}
                      className="cursor-pointer group"
                    >
                      <div className="aspect-video rounded-lg overflow-hidden mb-2 relative">
                         <img src={rel.image} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                         <div className="absolute top-1 right-1 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                            {getTypeIcon(rel.type)}
                            <span>{getTypeName(rel.type)}</span>
                         </div>
                      </div>
                      <h4 className="text-sm font-bold text-gray-800 group-hover:text-nature-sage transition-colors line-clamp-1">
                        {rel.title}
                      </h4>
                    </div>
                  ))}
                </div>
             </div>
          )}

        </div>
      </motion.div>
    </div>
  );
};