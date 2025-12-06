
import React, { useState } from 'react';
import { Send, Phone, MessageCircle, Mail, CheckCircle, Video } from 'lucide-react';
import { useData } from './DataProvider';

export const ContactSection: React.FC = () => {
  const { contactData, addMessage } = useData();
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Create combined content with phone number
    const finalMessage = `
      טלפון לחזרה: ${formState.phone}
      
      ${formState.message}
    `;

    // Add to Inbox
    addMessage({
      name: formState.name,
      contact: formState.email, // Email is primary ID
      type: 'contact',
      subject: formState.subject,
      content: finalMessage
    });

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormState({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setIsSuccess(false), 5000);
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  return (
    // Added pb-16 to allow space for the fixed footer
    <section id="contact" className="min-h-screen py-16 pb-24 bg-nature-100 border-t border-nature-200 snap-start flex flex-col justify-center">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-serif text-nature-900 mb-2">יצירת קשר</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            יש לך שאלה? רוצה לקבוע תור? אני כאן לכל שאלה והתייעצות.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          
          {/* Contact Details Column */}
          <div className="flex flex-col gap-4 h-full">
             {/* WhatsApp Card */}
             <a 
                href={`https://wa.me/${contactData.whatsapp}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white p-5 rounded-2xl shadow-sm border border-nature-200 flex items-center gap-5 hover:border-nature-sage transition-colors group cursor-pointer"
             >
                <div className="w-12 h-12 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform shrink-0">
                  <MessageCircle size={24} />
                </div>
                <div>
                   <h4 className="text-nature-900 font-bold text-lg">וואטסאפ ישיר</h4>
                   <p className="text-[#25D366] text-sm font-medium">זמינה להודעות - למענה מהיר</p>
                </div>
             </a>

             {/* Info Card */}
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-nature-200 flex-1 flex flex-col justify-center gap-6">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-nature-50 text-nature-darkSage rounded-full flex items-center justify-center shrink-0 border border-nature-100">
                     <Phone size={20} />
                   </div>
                   <div>
                     <h4 className="font-bold text-nature-900 text-lg">טלפון</h4>
                     <p className="text-gray-600 ltr text-right font-medium">{contactData.phone}</p>
                   </div>
                </div>
                
                <div className="w-full h-px bg-gray-100"></div>

                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-nature-50 text-nature-darkSage rounded-full flex items-center justify-center shrink-0 border border-nature-100">
                     <Mail size={20} />
                   </div>
                   <div>
                     <h4 className="font-bold text-nature-900 text-lg">אימייל</h4>
                     <p className="text-gray-600 ltr text-right font-medium">{contactData.email}</p>
                   </div>
                </div>
             </div>

             {/* Location Banner */}
             <div className="bg-nature-sage/10 p-4 rounded-xl border border-nature-sage/20 text-center text-nature-900">
                 <p className="mb-2 font-bold flex justify-center items-center gap-2 text-sm">
                    <span className="w-2 h-2 rounded-full bg-nature-sage"></span>
                    קליניקה ב{contactData.address}
                 </p>
                 {contactData.zoomAvailable && (
                   <p className="flex items-center justify-center gap-2 text-nature-darkSage font-bold text-xs bg-white/50 py-1 px-3 rounded-full mx-auto w-fit">
                     <Video size={12} /> זמין גם בזום (אונליין)
                   </p>
                 )}
             </div>
          </div>

          {/* Contact Form Column */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-nature-200 h-full flex flex-col justify-center">
            <h3 className="text-xl font-serif text-nature-900 mb-4 text-center">השארת הודעה</h3>
            
            {isSuccess ? (
              <div className="flex flex-col items-center justify-center py-8 text-center animate-in fade-in duration-500 flex-1">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle size={32} />
                </div>
                <h4 className="text-xl font-bold text-nature-900 mb-2">תודה רבה!</h4>
                <p className="text-gray-600">ההודעה נשלחה בהצלחה.</p>
                <button 
                  onClick={() => setIsSuccess(false)}
                  className="mt-6 text-nature-darkSage hover:underline font-bold"
                >
                  שלח הודעה נוספת
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3 flex-1">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500">שם מלא</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formState.name}
                      onChange={handleChange}
                      className="w-full bg-nature-50 border border-nature-200 rounded-lg p-2 text-sm focus:border-nature-darkSage focus:ring-1 focus:ring-nature-darkSage/20 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500">טלפון</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formState.phone}
                      onChange={handleChange}
                      placeholder="050..."
                      className="w-full bg-nature-50 border border-nature-200 rounded-lg p-2 text-sm focus:border-nature-darkSage focus:ring-1 focus:ring-nature-darkSage/20 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500">אימייל</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formState.email}
                    onChange={handleChange}
                    className="w-full bg-nature-50 border border-nature-200 rounded-lg p-2 text-sm focus:border-nature-darkSage focus:ring-1 focus:ring-nature-darkSage/20 outline-none transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500">נושא הפנייה</label>
                  <input
                    type="text"
                    name="subject"
                    required
                    value={formState.subject}
                    onChange={handleChange}
                    className="w-full bg-nature-50 border border-nature-200 rounded-lg p-2 text-sm focus:border-nature-darkSage focus:ring-1 focus:ring-nature-darkSage/20 outline-none transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500">תוכן ההודעה</label>
                  <textarea
                    name="message"
                    required
                    rows={3}
                    value={formState.message}
                    onChange={handleChange}
                    className="w-full bg-nature-50 border border-nature-200 rounded-lg p-2 text-sm focus:border-nature-darkSage focus:ring-1 focus:ring-nature-darkSage/20 outline-none resize-none transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-nature-darkSage text-white py-3 rounded-lg font-bold hover:bg-nature-900 transition-all flex items-center justify-center gap-2 mt-2 shadow-sm hover:shadow-md"
                >
                  {isSubmitting ? 'שולח...' : 'שלח הודעה'}
                  {!isSubmitting && <Send size={16} />}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};