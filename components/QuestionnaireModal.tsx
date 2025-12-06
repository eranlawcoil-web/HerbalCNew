
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle, ChevronLeft } from 'lucide-react';
import { useData } from './DataProvider';

interface QuestionnaireModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuestionnaireModal: React.FC<QuestionnaireModalProps> = ({ isOpen, onClose }) => {
  const { addMessage } = useData();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    mainGoal: '',
    energyLevel: '',
    sleepQuality: '',
    notes: ''
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Create Summary Content
    const summary = `
      Goal: ${formData.mainGoal}
      Energy: ${formData.energyLevel}
      Sleep: ${formData.sleepQuality}
      Phone: ${formData.phone}
      Notes: ${formData.notes}
    `;

    // Add to Inbox
    addMessage({
      name: formData.name,
      contact: formData.email,
      type: 'questionnaire',
      content: summary
    });
    
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  const handleClose = () => {
    setIsSuccess(false);
    setStep(1);
    setFormData({
      name: '',
      email: '',
      phone: '',
      mainGoal: '',
      energyLevel: '',
      sleepQuality: '',
      notes: ''
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />

      {/* Modal Content */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-2xl bg-earth-900 border border-earth-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-6 border-b border-earth-800 flex justify-between items-center bg-earth-950/50">
          <div>
            <h2 className="text-2xl font-serif text-earth-accent font-bold">שאלון אבחון ראשוני</h2>
            <p className="text-gray-400 text-sm">צעד ראשון בדרך לריפוי טבעי</p>
          </div>
          <button onClick={handleClose} className="text-gray-500 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 overflow-y-auto custom-scrollbar">
          {isSuccess ? (
            <div className="text-center py-12 flex flex-col items-center">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-20 h-20 bg-green-900/30 rounded-full flex items-center justify-center text-green-500 mb-6"
              >
                <CheckCircle size={40} />
              </motion.div>
              <h3 className="text-3xl font-serif text-white mb-4">הפרטים התקבלו בהצלחה!</h3>
              <p className="text-gray-300 max-w-md mx-auto mb-8">
                תודה שפנית אלינו. עברתי על הפרטים שלך ואחזור אליך בהקדם לקביעת שיחת ייעוץ והמשך תהליך.
              </p>
              <button 
                onClick={handleClose}
                className="bg-earth-accent text-earth-900 px-8 py-3 rounded-full font-bold hover:bg-white transition-all"
              >
                חזרה לאתר
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Contact Info Section */}
              <div className="space-y-4">
                <h3 className="text-lg text-white font-bold border-b border-earth-800 pb-2 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-earth-accent text-earth-900 flex items-center justify-center text-xs">1</span>
                  פרטים אישיים
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">שם מלא</label>
                    <input 
                      required
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-earth-800 border border-earth-700 rounded-lg p-3 text-white focus:border-earth-accent outline-none focus:ring-1 focus:ring-earth-accent"
                      placeholder="ישראל ישראלי"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">מספר טלפון</label>
                    <input 
                      required
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-earth-800 border border-earth-700 rounded-lg p-3 text-white focus:border-earth-accent outline-none focus:ring-1 focus:ring-earth-accent"
                      placeholder="050-0000000"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">כתובת אימייל</label>
                  <input 
                    required
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-earth-800 border border-earth-700 rounded-lg p-3 text-white focus:border-earth-accent outline-none focus:ring-1 focus:ring-earth-accent"
                    placeholder="example@email.com"
                  />
                </div>
              </div>

              {/* Health Questions Section */}
              <div className="space-y-4 pt-4">
                <h3 className="text-lg text-white font-bold border-b border-earth-800 pb-2 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-earth-accent text-earth-900 flex items-center justify-center text-xs">2</span>
                  מצב בריאותי
                </h3>

                <div className="space-y-2">
                  <label className="text-sm text-gray-400">מהי המטרה העיקרית לטיפול?</label>
                  <select 
                    name="mainGoal"
                    value={formData.mainGoal}
                    onChange={handleChange}
                    className="w-full bg-earth-800 border border-earth-700 rounded-lg p-3 text-white focus:border-earth-accent outline-none"
                  >
                    <option value="">בחר/י אפשרות...</option>
                    <option value="digestion">בעיות עיכול ותזונה</option>
                    <option value="stress">לחץ, חרדה ושינה</option>
                    <option value="hormonal">איזון הורמונלי</option>
                    <option value="immune">חיזוק מערכת החיסון</option>
                    <option value="skin">בעיות עור</option>
                    <option value="energy">עייפות וחוסר אנרגיה</option>
                    <option value="other">אחר</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="space-y-2">
                    <label className="text-sm text-gray-400">רמת אנרגיה יומית</label>
                    <select 
                      name="energyLevel"
                      value={formData.energyLevel}
                      onChange={handleChange}
                      className="w-full bg-earth-800 border border-earth-700 rounded-lg p-3 text-white focus:border-earth-accent outline-none"
                    >
                      <option value="">בחר/י...</option>
                      <option value="high">גבוהה ויציבה</option>
                      <option value="moderate">בינונית</option>
                      <option value="low">נמוכה / עייפות כרונית</option>
                      <option value="crash">נפילות אנרגיה במהלך היום</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">איכות שינה</label>
                    <select 
                      name="sleepQuality"
                      value={formData.sleepQuality}
                      onChange={handleChange}
                      className="w-full bg-earth-800 border border-earth-700 rounded-lg p-3 text-white focus:border-earth-accent outline-none"
                    >
                      <option value="">בחר/י...</option>
                      <option value="good">טובה ורציפה</option>
                      <option value="difficulty">קושי להירדם</option>
                      <option value="waking">התעוררויות מרובות</option>
                      <option value="light">שינה קלה ולא מרעננת</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-400">הערות נוספות / תרופות קבועות</label>
                  <textarea 
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
                    className="w-full bg-earth-800 border border-earth-700 rounded-lg p-3 text-white focus:border-earth-accent outline-none resize-none"
                    placeholder="פרט/י כאן אם יש רגישויות, תרופות או כל דבר אחר שחשוב לדעת..."
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-earth-accent text-earth-900 py-4 rounded-lg font-bold text-lg hover:bg-white transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    'שולח...'
                  ) : (
                    <>
                      <span>שלח שאלון לאבחון</span>
                      <Send size={18} />
                    </>
                  )}
                </button>
                <p className="text-center text-gray-500 text-xs mt-3">
                  * הפרטים נשמרים בדיסקרטיות מלאה ולא יועברו לצד שלישי.
                </p>
              </div>

            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};