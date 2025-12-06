
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Accessibility, Type, Eye, Link2, Sun, RotateCcw, X } from 'lucide-react';

export const AccessibilityWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState({
    largeText: false,
    grayscale: false,
    highContrast: false,
    underlineLinks: false
  });

  useEffect(() => {
    const body = document.body;
    
    if (settings.largeText) body.classList.add('access-large-text');
    else body.classList.remove('access-large-text');

    if (settings.grayscale) body.classList.add('access-grayscale');
    else body.classList.remove('access-grayscale');

    if (settings.highContrast) body.classList.add('access-high-contrast');
    else body.classList.remove('access-high-contrast');

    if (settings.underlineLinks) body.classList.add('access-links-underline');
    else body.classList.remove('access-links-underline');

  }, [settings]);

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const resetSettings = () => {
    setSettings({
      largeText: false,
      grayscale: false,
      highContrast: false,
      underlineLinks: false
    });
  };

  return (
    <div className="fixed bottom-4 left-4 z-[9999] font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            className="absolute bottom-16 left-0 bg-white rounded-xl shadow-2xl border border-nature-200 w-64 overflow-hidden"
          >
            <div className="bg-nature-900 p-4 flex justify-between items-center text-white">
              <h3 className="font-bold flex items-center gap-2">
                <Accessibility size={20} /> נגישות אתר
              </h3>
              <button onClick={() => setIsOpen(false)}><X size={18} /></button>
            </div>
            
            <div className="p-2 grid gap-1">
              <button 
                onClick={() => toggleSetting('largeText')}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors w-full text-right hover:bg-gray-100 ${settings.largeText ? 'bg-nature-100 text-nature-darkSage font-bold' : 'text-gray-700'}`}
              >
                <Type size={20} /> הגדלת טקסט
              </button>
              
              <button 
                onClick={() => toggleSetting('grayscale')}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors w-full text-right hover:bg-gray-100 ${settings.grayscale ? 'bg-nature-100 text-nature-darkSage font-bold' : 'text-gray-700'}`}
              >
                <Eye size={20} /> גווני אפור
              </button>
              
              <button 
                onClick={() => toggleSetting('highContrast')}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors w-full text-right hover:bg-gray-100 ${settings.highContrast ? 'bg-nature-100 text-nature-darkSage font-bold' : 'text-gray-700'}`}
              >
                <Sun size={20} /> ניגודיות גבוהה
              </button>
              
              <button 
                onClick={() => toggleSetting('underlineLinks')}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors w-full text-right hover:bg-gray-100 ${settings.underlineLinks ? 'bg-nature-100 text-nature-darkSage font-bold' : 'text-gray-700'}`}
              >
                <Link2 size={20} /> הדגשת קישורים
              </button>
              
              <div className="border-t border-gray-100 mt-2 pt-2">
                <button 
                  onClick={resetSettings}
                  className="flex items-center justify-center gap-2 p-2 w-full text-red-500 hover:bg-red-50 rounded text-sm font-bold"
                >
                  <RotateCcw size={16} /> איפוס הגדרות
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 bg-nature-darkSage hover:bg-nature-900 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 focus:outline-none focus:ring-4 focus:ring-nature-sage/50"
        aria-label="פתח תפריט נגישות"
        title="נגישות"
      >
        <Accessibility size={24} />
      </button>
    </div>
  );
};