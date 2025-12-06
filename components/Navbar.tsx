
import React, { useState, useEffect } from 'react';
import { Menu, X, Leaf } from 'lucide-react';
import { useData } from './DataProvider';

interface NavbarProps {
  onLogoClick?: () => void;
  announcementHeight?: number;
}

export const Navbar: React.FC<NavbarProps> = ({ onLogoClick, announcementHeight = 0 }) => {
  const { contactData } = useData();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      // With Fixed Navbar, we just scroll to element. 
      // The sections now have padding-top to account for the navbar.
      element.scrollIntoView({ behavior: 'smooth' });
    } else if (id === '#') {
       window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navLinks = [
    { name: 'ראשי', id: 'home' }, 
    { name: 'אודות', id: 'about' },
    { name: 'מרכז הידע', id: 'knowledge-center' },
    // Testimonials removed as requested
    { name: 'קליניקה', id: 'contact' },
  ];

  return (
    <nav 
      className={`fixed left-0 right-0 z-50 transition-all duration-300 border-b ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md py-2 shadow-sm border-nature-200 text-nature-900' 
          : 'bg-white/90 backdrop-blur-sm py-3 border-transparent text-nature-900 shadow-sm'
      }`}
      style={{ top: announcementHeight }}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo & Tagline */}
        <div 
          onClick={onLogoClick}
          className="flex flex-col xl:flex-row xl:items-center gap-1 xl:gap-6 cursor-pointer hover:opacity-80 transition-opacity"
          title="כניסת מנהל"
        >
          <div className={`flex items-center gap-2 ${isScrolled ? 'text-nature-darkSage' : 'text-earth-accent'}`}>
            <Leaf size={32} strokeWidth={2.5} />
            <span className="text-3xl font-serif font-bold leading-none tracking-tight">HerbalC</span>
          </div>
          
          {contactData.siteTagline && (
            <div className="flex items-center gap-4 hidden md:flex">
              <span className="hidden xl:inline-block w-[2px] h-8 bg-nature-200"></span>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-sans font-black tracking-tight text-nature-900 leading-none">
                {contactData.siteTagline}
              </h1>
            </div>
          )}
        </div>

        {/* Desktop Menu */}
        <div className="hidden xl:flex gap-8 items-center flex-nowrap">
          {navLinks.map((link) => (
            <button 
              key={link.name} 
              onClick={() => scrollToSection(link.id)}
              className="font-medium text-lg relative group text-nature-800 hover:text-nature-darkSage transition-colors whitespace-nowrap"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-nature-darkSage transition-all group-hover:w-full"></span>
            </button>
          ))}
          <button 
             onClick={() => scrollToSection('contact')}
             className="px-6 py-2 rounded-full font-bold transition-all transform hover:scale-105 bg-earth-accent text-earth-900 hover:bg-nature-900 hover:text-white shadow-sm whitespace-nowrap"
          >
            צור קשר
          </button>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-4 xl:hidden">
           {contactData.siteTagline && (
              <h1 className="text-sm font-black text-nature-900 leading-none md:hidden">
                {contactData.siteTagline}
              </h1>
           )}
           <button 
            className="text-nature-900"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`xl:hidden fixed inset-0 bg-nature-900 z-40 flex flex-col items-center justify-center gap-8 transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {navLinks.map((link) => (
          <button 
            key={link.name} 
            onClick={() => scrollToSection(link.id)}
            className="text-2xl text-white font-serif"
          >
            {link.name}
          </button>
        ))}
        <button 
             onClick={() => scrollToSection('contact')}
             className="px-8 py-3 bg-earth-accent text-earth-900 rounded-full font-bold text-xl mt-4"
          >
            צור קשר
          </button>
      </div>
    </nav>
  );
};
