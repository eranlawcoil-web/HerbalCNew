
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useData } from './DataProvider';
import { QuestionnaireModal } from './QuestionnaireModal';

export const HeroCarousel: React.FC = () => {
  const { slides } = useData();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!isModalOpen && slides.length > 0) {
      const timer = setInterval(() => {
        nextSlide();
      }, 6000);
      return () => clearInterval(timer);
    }
  }, [currentIndex, isModalOpen, slides.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  if (!slides.length) return null;

  return (
    <>
      <div id="home" className="relative h-screen w-full overflow-hidden bg-nature-900 snap-start shrink-0">
        <AnimatePresence mode='wait'>
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
          >
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slides[currentIndex].image})` }}
            />
            <div className="absolute inset-0 bg-black/30" />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 z-10">
          <AnimatePresence mode='wait'>
            <motion.div
              key={`content-${currentIndex}`}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <h2 className="text-earth-accent text-xl md:text-2xl font-sans tracking-widest uppercase mb-4 drop-shadow-md">
                {slides[currentIndex].subtitle}
              </h2>
              <h1 className="text-5xl md:text-8xl font-serif text-white font-bold mb-8 drop-shadow-lg">
                {slides[currentIndex].title}
              </h1>
              <motion.button 
                onClick={() => setIsModalOpen(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-nature-900 transition-colors duration-300 text-lg rounded-none uppercase tracking-wider"
              >
                גלי את הטיפול
              </motion.button>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="absolute bottom-12 left-12 flex gap-4 z-20">
          <button 
            onClick={prevSlide}
            className="p-3 border border-white/30 text-white hover:bg-white hover:text-nature-900 rounded-full transition-all backdrop-blur-sm"
          >
            <ArrowRight size={24} />
          </button>
          <button 
            onClick={nextSlide}
            className="p-3 border border-white/30 text-white hover:bg-white hover:text-nature-900 rounded-full transition-all backdrop-blur-sm"
          >
            <ArrowLeft size={24} />
          </button>
        </div>

        <div className="absolute bottom-12 right-12 flex gap-3 z-20">
          {slides.map((_, idx) => (
            <div 
              key={idx}
              className={`h-1 transition-all duration-500 ${idx === currentIndex ? 'w-12 bg-earth-accent' : 'w-6 bg-white/40'}`}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <QuestionnaireModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
};