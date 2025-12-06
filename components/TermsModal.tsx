
import React from 'react';
import { motion } from 'framer-motion';
import { X, ShieldAlert, FileText, Lock } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-white w-full max-w-4xl max-h-[85vh] rounded-xl shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2 text-nature-900 font-serif">
              <ShieldAlert className="text-nature-darkSage" />
              תנאי שימוש, הצהרת בריאות ומדיניות פרטיות
            </h2>
            <div className="mt-2 bg-red-50 border border-red-100 text-red-800 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
               <ShieldAlert size={16} />
               <span>הבהרה: עצם השימוש באתר זה מהווה הסכמה מלאה ובלתי מסויגת לתנאי השימוש, להצהרת הבריאות ולמדיניות הפרטיות המפורטים להלן.</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors mt-1">
            <X size={24} />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-8 overflow-y-auto text-gray-700 space-y-8 leading-relaxed text-sm md:text-base custom-scrollbar bg-white">
          
          {/* Health Disclaimer - Most Important */}
          <section className="bg-nature-50 p-6 rounded-xl border border-nature-100">
            <h3 className="font-bold text-lg text-nature-900 mb-3 flex items-center gap-2">
              <FileText size={20} /> הצהרת בריאות והסרת אחריות
            </h3>
            <p className="font-bold text-nature-darkSage mb-2">
              המידע המופיע באתר זה הינו למטרות אינפורמטיביות בלבד ואינו מהווה עצה רפואית, חוות דעת מקצועית, אבחנה או תחליף להתייעצות עם רופא מוסמך.
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>אין להסתמך על המידע באתר לצורך אבחון או טיפול בבעיה רפואית כלשהי.</li>
              <li>השימוש במידע, במוצרים או בפורמולות המוזכרים באתר הוא על אחריות המשתמש בלבד.</li>
              <li>נשים בהריון, נשים מניקות, אנשים הנוטלים תרופות מרשם וילדים - <strong>יש להיוועץ ברופא לפני השימוש בצמחי מרפא.</strong></li>
            </ul>
          </section>

          {/* Privacy Policy Full Text */}
          <section className="space-y-6">
             <div className="border-b border-gray-100 pb-2 mb-4">
               <h3 className="font-bold text-xl text-nature-900 flex items-center gap-2">
                 <Lock size={20} /> מדיניות פרטיות
               </h3>
               <p className="text-xs text-gray-500">מעודכן לחודש אוגוסט 2025</p>
             </div>

             <div className="space-y-4">
                <p>
                  מסמך זה, מדיניות הפרטיות (להלן: "המדיניות"), מהווה חלק אינטגרלי מתנאי השימוש באתר, ויש לקרוא אותו יחד עימם.
                  המפעיל רואה חשיבות רבה בשמירה על פרטיותם של המשתמשים באתר.
                </p>

                <div>
                   <h4 className="font-bold text-nature-900 mb-1">תקציר (הצהרת יידוע):</h4>
                   <p>הפרטים האישיים שהינך מוסר דרושים לנו לטיפול בפנייתך ולספק לך את השירות המתאים. המידע האישי במאגרי המידע אצל המפעיל ישמש למטרות שהוגדרו – כגון יצירת קשר, חיוב ותיעוד. מסירת המידע היא מרצונך בלבד, אך ללא מסירתו ייתכן שלא נוכל לספק את השירות.</p>
                </div>

                <div>
                  <h4 className="font-bold text-nature-900 mb-1">1. איסוף מידע</h4>
                  <p>במסגרת השימוש באתר, ייתכן שתתבקש למסור פרטים אישיים כגון: שם מלא, מספר טלפון וכתובת דוא"ל. מידע זה יישמר במאגר הלקוחות לצרכים תפעוליים. בנוסף, נאסף מידע סטטיסטי אנונימי (Google Analytics וכד') אודות דפוסי השימוש באתר.</p>
                </div>

                <div>
                  <h4 className="font-bold text-nature-900 mb-1">2. שימוש במידע</h4>
                  <p>המידע ישמש ליצירת קשר, מתן שירות, שיפור חווית המשתמש, ופעילות שיווקית (בכפוף להוראות הדין). המפעיל רשאי למסור מידע אנונימי/סטטיסטי לצדדים שלישיים.</p>
                </div>

                <div>
                  <h4 className="font-bold text-nature-900 mb-1">3. העברת מידע לצד ג'</h4>
                  <p>המפעיל לא יעביר את פרטיך האישיים לצד שלישי אלא במקרים המותרים על פי דין, כגון: דרישה חוקית, צורך באכיפת תנאי השימוש, הגנה על זכויות המפעיל, או בהסכמתך.</p>
                </div>

                <div>
                  <h4 className="font-bold text-nature-900 mb-1">4. Cookies וטכנולוגיות מעקב</h4>
                  <p>האתר עושה שימוש ב"עוגיות" (Cookies) ובכלי ניטור (כגון פיקסל של פייסבוק, גוגל אנליטיקס) לצורך תפעולו השוטף והתקין, ובכלל זה כדי לאסוף נתונים סטטיסטיים, לאמת פרטים, ולהתאים את האתר להעדפותיך האישיות. באפשרותך לשנות את הגדרות הדפדפן ולחסום קבלת Cookies.</p>
                </div>

                <div>
                  <h4 className="font-bold text-nature-900 mb-1">5. אבטחת מידע</h4>
                  <p>המפעיל נוקט באמצעים מקובלים לאבטחת המידע. עם זאת, לא ניתן להבטיח חסינות מוחלטת מפני חדירות למחשבים או חשיפת מידע בלתי מורשית.</p>
                </div>

                <div>
                  <h4 className="font-bold text-nature-900 mb-1">6. זכויות המשתמש</h4>
                  <p>על פי חוק הגנת הפרטיות, כל אדם זכאי לעיין במידע שעליו המוחזק במאגר מידע. אם מצאת שהמידע אינו נכון או מעודכן, הינך רשאי לפנות בבקשה לתקנו או למחקו.</p>
                </div>
             </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 text-center sticky bottom-0 z-10">
          <button 
            onClick={onClose}
            className="bg-nature-darkSage text-white px-12 py-3 rounded-full font-bold hover:bg-nature-800 transition-colors shadow-lg text-lg"
          >
            סגור
          </button>
        </div>
      </motion.div>
    </div>
  );
};
