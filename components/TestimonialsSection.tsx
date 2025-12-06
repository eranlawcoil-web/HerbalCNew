
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageCircle, X, CheckCircle, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { useData } from './DataProvider';
import { Testimonial } from '../types';

export const TestimonialsSection: React.FC = () => {
  const { testimonials, addTestimonial } = useData();
  const [isViewAllOpen, setIsViewAllOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filter approved AND non-expired testimonials
  const approvedTestimonials = testimonials.filter(t => {
    if (!t.approved) return false;
    if (t.expirationDate) {
      const today = new Date().toISOString().split('T')[0];
      if (t.expirationDate < today) return false;
    }
    return true;
  });
  
  // Show random 4 or first 4
  const featuredTestimonials = approvedTestimonials.slice(0, 4);

  const nextSlide = () => {
    if (featuredTestimonials.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % featuredTestimonials.length);
  };

  const prevSlide = () => {
    if (featuredTestimonials.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + featuredTestimonials.length) % featuredTestimonials.length);
  };

  const TestimonialCard: React.FC<{ testimonial: Testimonial }> = ({ testimonial }) => (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-nature-100 flex flex-col h-full relative">
      <Quote className="text-nature-sage/20 absolute top-4 left-4" size={40} />
      <p className="text-gray-600 mb-6 italic relative z-10 flex-1 line-clamp-4">"{testimonial.content}"</p>
      <div className="flex items-center gap-4 mt-auto">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 shrink-0">
           {testimonial.image ? (
             <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
           ) : (
             <div className="w-full h-full flex items-center justify-center bg-nature-darkSage text-white font-bold text-xl">
               {testimonial.name[0]}
             </div>
           )}
        </div>
        <div>
          <h4 className="font-bold text-nature-900">{testimonial.name}</h4>
          <p className="text-xs text-gray-500">{testimonial.city}</p>
        </div>
      </div>
    </div>
  );

  return (
    <section id="testimonials" className="min-h-screen py-16 bg-nature-50 border-t border-nature-200 snap-start flex flex-col justify-center">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
          <div>
            <h3 className="text-nature-sage font-bold uppercase tracking-wider mb-2">ממליצים</h3>
            <h2 className="text-4xl font-serif text-nature-900">סיפורי הצלחה מהקליניקה</h2>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => setIsFormOpen(true)}
              className="bg-nature-darkSage text-white px-6 py-2 rounded-full hover:bg-nature-800 transition-colors flex items-center gap-2"
            >
              <MessageCircle size={18} />
              הוסף המלצה
            </button>
            <button 
              onClick={() => setIsViewAllOpen(true)}
              className="bg-white text-nature-900 border border-nature-200 px-6 py-2 rounded-full hover:bg-nature-100 transition-colors"
            >
              לכל ההמלצות
            </button>
          </div>
        </div>

        {/* Desktop Grid (Show 4) */}
        {featuredTestimonials.length > 0 ? (
          <div className="hidden md:grid grid-cols-4 gap-6">
            {featuredTestimonials.map(t => (
              <TestimonialCard key={t.id} testimonial={t} />
            ))}
          </div>
        ) : (
          <div className="hidden md:block text-center text-gray-400 py-10">אין המלצות להצגה כרגע.</div>
        )}

        {/* Mobile Carousel */}
        <div className="md:hidden relative min-h-[300px]">
           <AnimatePresence mode="wait">
             <motion.div
               key={currentIndex}
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               className="h-full"
             >
                {featuredTestimonials[currentIndex] && (
                  <TestimonialCard testimonial={featuredTestimonials[currentIndex]} />
                )}
             </motion.div>
           </AnimatePresence>
           {featuredTestimonials.length > 1 && (
             <div className="flex justify-center gap-4 mt-6">
               <button onClick={prevSlide} className="p-2 bg-white rounded-full shadow-sm"><ChevronRight size={20} /></button>
               <button onClick={nextSlide} className="p-2 bg-white rounded-full shadow-sm"><ChevronLeft size={20} /></button>
             </div>
           )}
        </div>
      </div>

      {/* View All Modal */}
      <AnimatePresence>
        {isViewAllOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               onClick={() => setIsViewAllOpen(false)}
               className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />
            <motion.div 
               initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
               className="bg-nature-50 w-full max-w-6xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col relative z-10"
            >
               <div className="p-6 bg-white border-b border-gray-200 flex justify-between items-center sticky top-0 z-10">
                 <h2 className="text-2xl font-serif text-nature-900 font-bold">כל ההמלצות</h2>
                 <button onClick={() => setIsViewAllOpen(false)} className="p-2 hover:bg-gray-100 rounded-full"><X /></button>
               </div>
               <div className="p-8 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 custom-scrollbar">
                  {approvedTestimonials.map(t => (
                    <TestimonialCard key={t.id} testimonial={t} />
                  ))}
                  {approvedTestimonials.length === 0 && <p className="text-gray-500 col-span-full text-center">אין המלצות להצגה.</p>}
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Review Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <ReviewFormModal onClose={() => setIsFormOpen(false)} onSubmit={addTestimonial} />
        )}
      </AnimatePresence>
    </section>
  );
};

const ReviewFormModal: React.FC<{ onClose: () => void, onSubmit: (t: Testimonial) => void }> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({ name: '', city: '', content: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTestimonial: Testimonial = {
      id: `t-${Date.now()}`,
      name: formData.name,
      city: formData.city,
      content: formData.content,
      date: new Date().toISOString().split('T')[0],
      approved: false, // Pending approval
      image: undefined
    };
    onSubmit(newTestimonial);
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
       <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
       />
       <motion.div 
          initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
          className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden relative z-10"
       >
          {submitted ? (
            <div className="p-12 text-center flex flex-col items-center">
               <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                 <CheckCircle size={32} />
               </div>
               <h3 className="text-xl font-bold text-nature-900">תודה על ההמלצה!</h3>
               <p className="text-gray-500 mt-2">ההמלצה נשלחה לאישור המערכת ותפורסם בקרוב.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-8">
               <div className="flex justify-between items-center mb-6">
                 <h3 className="text-xl font-bold font-serif text-nature-900">הוספת המלצה חדשה</h3>
                 <button type="button" onClick={onClose}><X size={20} className="text-gray-400 hover:text-gray-600" /></button>
               </div>
               <div className="space-y-4">
                 <div>
                   <label className="block text-sm font-bold text-gray-700 mb-1">שם מלא</label>
                   <input 
                     required
                     value={formData.name}
                     onChange={e => setFormData({...formData, name: e.target.value})}
                     className="w-full border border-gray-300 rounded-lg p-2 focus:border-nature-sage outline-none"
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-bold text-gray-700 mb-1">עיר מגורים</label>
                   <input 
                     required
                     value={formData.city}
                     onChange={e => setFormData({...formData, city: e.target.value})}
                     className="w-full border border-gray-300 rounded-lg p-2 focus:border-nature-sage outline-none"
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-bold text-gray-700 mb-1">תוכן ההמלצה</label>
                   <textarea 
                     required
                     rows={4}
                     value={formData.content}
                     onChange={e => setFormData({...formData, content: e.target.value})}
                     className="w-full border border-gray-300 rounded-lg p-2 focus:border-nature-sage outline-none resize-none"
                     placeholder="ספר/י על חווית הטיפול..."
                   />
                 </div>
                 <button 
                   type="submit"
                   className="w-full bg-nature-darkSage text-white font-bold py-3 rounded-lg hover:bg-nature-800 transition-colors mt-2"
                 >
                   שלח המלצה
                 </button>
               </div>
            </form>
          )}
       </motion.div>
    </div>
  );
};