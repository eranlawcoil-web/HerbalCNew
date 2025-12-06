
import React, { useState, useRef } from 'react';
import { X, Save, Plus, Trash2, Wand2, RefreshCw, Pencil, UserPlus, ShieldAlert, Check, FileText, Briefcase, Phone, MessageCircle, Calendar, Image as ImageIcon, Upload, Link as LinkIcon, Download, BarChart2, Eye, Clock, Search as SearchIcon, Mail, Settings, Bell, Megaphone } from 'lucide-react';
import { useData } from './DataProvider';
import { Article, TabContent, Testimonial } from '../types';
import { GoogleGenAI, Type } from '@google/genai';

interface AdminDashboardProps {
  onClose: () => void;
}

const TABS = ['סליידר ראשי', 'אודות', 'ספריית הצמחים', 'מאמרים מקצועיים', 'מקרי אירוע', 'המלצות', 'פרטי התקשרות', 'מנהלי מערכת', 'סטטיסטיקות', 'הודעות נכנסות', 'הגדרות אתר'];

interface ImageSelectionControlProps {
  currentImage: string;
  onImageSelect: (url: string) => void;
  contextString?: string;
}

const ImageSelectionControl: React.FC<ImageSelectionControlProps> = ({ currentImage, onImageSelect, contextString }) => {
  const [activeTab, setActiveTab] = useState<'url' | 'upload' | 'ai'>('url');
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState(contextString || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => onImageSelect(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAiGenerate = async () => {
    setIsGenerating(true);
    setGeneratedImages([]);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const model = 'gemini-2.5-flash';
      const systemPrompt = `
        Translate this concept: "${aiPrompt || contextString || 'Nature'}" into a single, short, descriptive ENGLISH sentence for an image generator. 
        Example: "A cinematic photography of a blooming lavender field at sunset, high quality."
        Return ONLY the sentence.
      `;
      
      const result = await ai.models.generateContent({ model, contents: systemPrompt });
      const visualPrompt = result.text.trim();
      
      const images = Array.from({ length: 9 }).map((_, i) => {
        const seed = Math.floor(Math.random() * 10000) + i;
        return `https://image.pollinations.ai/prompt/${encodeURIComponent(visualPrompt)}?width=800&height=600&nologo=true&seed=${seed}&model=flux`;
      });
      
      setGeneratedImages(images);
    } catch (error) {
      console.error("AI Image Error", error);
      alert("שגיאה ביצירת תמונות");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4 border border-earth-700 rounded-lg p-4 bg-earth-950/50">
      <div className="flex gap-2 border-b border-earth-800 pb-2">
        <button onClick={() => setActiveTab('url')} className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm rounded ${activeTab === 'url' ? 'bg-earth-800 text-white' : 'text-gray-400 hover:text-white'}`}><LinkIcon size={16} /> קישור</button>
        <button onClick={() => setActiveTab('upload')} className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm rounded ${activeTab === 'upload' ? 'bg-earth-800 text-white' : 'text-gray-400 hover:text-white'}`}><Upload size={16} /> העלאה</button>
        <button onClick={() => setActiveTab('ai')} className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm rounded ${activeTab === 'ai' ? 'bg-earth-accent text-earth-900 font-bold' : 'text-gray-400 hover:text-white'}`}><Wand2 size={16} /> AI Generator</button>
      </div>

      <div className="flex gap-4 items-start">
         <div className="w-24 h-24 bg-earth-900 border border-earth-700 rounded overflow-hidden flex-shrink-0 relative">
           {currentImage ? <img src={currentImage} alt="Preview" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-600"><ImageIcon /></div>}
         </div>

         <div className="flex-1">
            {activeTab === 'url' && (
              <div className="space-y-2">
                 <input type="text" value={currentImage} onChange={(e) => onImageSelect(e.target.value)} className="w-full bg-earth-900 border border-earth-700 rounded p-2 text-gray-300 text-sm ltr outline-none focus:border-earth-accent" placeholder="https://example.com/image.jpg" />
                 <p className="text-xs text-gray-500">הדבק קישור ישיר לתמונה מהאינטרנט</p>
              </div>
            )}

            {activeTab === 'upload' && (
              <div className="space-y-2">
                 <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
                 <button onClick={() => fileInputRef.current?.click()} className="w-full border-2 border-dashed border-earth-700 rounded-lg p-6 text-gray-400 hover:border-earth-accent hover:text-earth-accent transition-colors flex flex-col items-center gap-2">
                   <Upload size={24} /> <span>לחץ לבחירת קובץ מהמחשב</span>
                 </button>
              </div>
            )}

            {activeTab === 'ai' && (
              <div className="space-y-3">
                 <div className="flex gap-2">
                   <input value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} placeholder="נושא התמונה (לדוגמה: שדה לבנדר)" className="flex-1 bg-earth-900 border border-earth-700 rounded p-2 text-white text-sm outline-none" />
                   <button onClick={handleAiGenerate} disabled={isGenerating} className="bg-earth-accent text-earth-900 px-4 py-2 rounded text-sm font-bold hover:bg-white disabled:opacity-50">{isGenerating ? 'מייצר...' : 'צור'}</button>
                 </div>
                 {generatedImages.length > 0 && (
                   <div className="grid grid-cols-3 gap-2 mt-2">
                     {generatedImages.map((img, idx) => (
                       <div key={idx} onClick={() => onImageSelect(img)} className="aspect-square rounded border border-earth-700 overflow-hidden cursor-pointer hover:border-earth-accent hover:scale-105 transition-all relative group">
                         <img src={img} className="w-full h-full object-cover" loading="lazy" />
                       </div>
                     ))}
                   </div>
                 )}
              </div>
            )}
         </div>
      </div>
    </div>
  );
};

// Helper function to clean AI response (remove markdown code blocks)
const cleanJson = (text: string) => {
  return text.replace(/```json/g, '').replace(/```/g, '').trim();
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const { 
    slides, aboutData, articles, generalArticles, caseStudies, authorizedEmails, contactData, testimonials, analyticsData, messages, globalSettings,
    updateSlide, updateAbout, updateContact, addArticle, updateArticle, deleteArticle,
    addGeneralArticle, updateGeneralArticle, deleteGeneralArticle,
    addCaseStudy, updateCaseStudy, deleteCaseStudy,
    addAdmin, removeAdmin,
    addTestimonial, updateTestimonial, deleteTestimonial,
    markMessageRead, deleteMessage, updateGlobalSettings
  } = useData();
  const [activeTab, setActiveTab] = useState(0);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [editingType, setEditingType] = useState<'plant' | 'general' | 'case'>('plant');
  const [editForm, setEditForm] = useState<Partial<Article>>({});
  const [editingTestimonialId, setEditingTestimonialId] = useState<string | null>(null);
  const [testimonialForm, setTestimonialForm] = useState<Partial<Testimonial>>({});
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const unreadCount = messages.filter(m => !m.read).length;

  // --- API KEY SAFEGUARD ---
  const apiKey = process.env.API_KEY;
  if (!apiKey && activeTab >= 2 && activeTab <= 5) {
     console.warn("API Key is missing. AI features will be disabled.");
  }

  const handleAiGeneration = async (type: 'plant' | 'general' | 'case' | 'testimonial') => {
    if (!apiKey) {
      alert("חסר מפתח API. לא ניתן להשתמש ב-AI.");
      return;
    }
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey });
      const model = 'gemini-2.5-flash';
      
      let systemPrompt = '';
      let schema: any = {};

      const tabSchema = {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          label: { type: Type.STRING },
          content: { type: Type.STRING },
          tags: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ['id', 'label', 'content', 'tags']
      };

      if (type === 'plant' || type === 'general' || type === 'case') {
        const typeHebrew = type === 'plant' ? 'צמח מרפא' : type === 'general' ? 'מאמר' : 'מקרה בוחן';
        // Updated Prompt: Explicitly enforcing Hebrew tags
        systemPrompt = `Create a detailed ${typeHebrew} content about "${aiPrompt}" in Hebrew. Automatically generate 2-4 relevant tags for EACH tab. IMPORTANT: The tags MUST be in HEBREW only (e.g., 'שינה', 'עיכול'). Do not use English tags.`;
        schema = {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            subtitle: { type: Type.STRING },
            description: { type: Type.STRING },
            tabs: { type: Type.ARRAY, items: tabSchema },
          },
          required: ['id', 'title', 'subtitle', 'description', 'tabs']
        };
      } else if (type === 'testimonial') {
         systemPrompt = `Generate a realistic client recommendation in Hebrew about "${aiPrompt || 'general treatment'}".`;
         schema = {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              city: { type: Type.STRING },
              content: { type: Type.STRING },
            },
            required: ['name', 'city', 'content']
         };
      }

      const result = await ai.models.generateContent({
        model,
        contents: systemPrompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: schema
        }
      });
      
      const text = cleanJson(result.text);
      const newContent = JSON.parse(text);
      
      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(aiPrompt)}?width=800&height=600&nologo=true`;

      if (type === 'plant') addArticle({ ...newContent, image: imageUrl });
      else if (type === 'general') addGeneralArticle({ ...newContent, image: imageUrl });
      else if (type === 'case') addCaseStudy({ ...newContent, image: imageUrl });
      else if (type === 'testimonial') addTestimonial({ id: `gen-${Date.now()}`, approved: true, date: new Date().toISOString().split('T')[0], ...newContent });
      
      setAiPrompt('');
    } catch (error) {
      console.error("AI Error:", error);
      alert('שגיאה ביצירת התוכן. נסה שנית.');
    } finally {
      setIsGenerating(false);
    }
  };

  const startEdit = (article: Article, type: 'plant' | 'general' | 'case') => {
    setEditingArticleId(article.id);
    setEditingType(type);
    setEditForm({ ...article });
  };
  const saveEdit = () => {
    if (editingArticleId && editForm) {
      if (editingType === 'plant') updateArticle(editingArticleId, editForm);
      else if (editingType === 'general') updateGeneralArticle(editingArticleId, editForm);
      else updateCaseStudy(editingArticleId, editForm);
      setEditingArticleId(null);
      setEditForm({});
    }
  };
  const handleTabChange = (index: number, field: keyof TabContent, value: string) => {
    if (!editForm.tabs) return;
    const newTabs = [...editForm.tabs];
    newTabs[index] = { ...newTabs[index], [field]: value };
    setEditForm({ ...editForm, tabs: newTabs });
  };
  const handleTagsChange = (index: number, value: string) => {
    if (!editForm.tabs) return;
    const newTabs = [...editForm.tabs];
    newTabs[index] = { ...newTabs[index], tags: value.split(',').map(t => t.trim()).filter(Boolean) };
    setEditForm({ ...editForm, tabs: newTabs });
  };
  const deleteTab = (index: number) => {
    if (!editForm.tabs) return;
    const newTabs = editForm.tabs.filter((_, i) => i !== index);
    setEditForm({ ...editForm, tabs: newTabs });
  };
  const addNewTab = () => {
    const newTab: TabContent = { id: `new-tab-${Date.now()}`, label: 'טאב חדש', content: 'תוכן הטאב...', tags: [] };
    setEditForm({ ...editForm, tabs: [...(editForm.tabs || []), newTab] });
  };

  const startEditTestimonial = (testimonial: Testimonial) => {
    setEditingTestimonialId(testimonial.id);
    setTestimonialForm({ ...testimonial });
  };
  const saveTestimonialEdit = () => {
    if (editingTestimonialId && testimonialForm) {
      updateTestimonial(editingTestimonialId, testimonialForm);
      setEditingTestimonialId(null);
      setTestimonialForm({});
    }
  };

  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAdminEmail) {
      addAdmin(newAdminEmail);
      setNewAdminEmail('');
    }
  };

  return (
    <div className="fixed inset-0 z-[90] bg-earth-950 flex flex-col">
      <div className="bg-earth-900 border-b border-earth-800 p-4 flex justify-between items-center shadow-lg">
        <h2 className="text-xl text-white font-bold flex items-center gap-2">
          <span className="bg-earth-accent text-earth-900 text-xs px-2 py-1 rounded">ADMIN</span> מערכת ניהול תוכן
        </h2>
        <div className="flex gap-4 items-center">
           {unreadCount > 0 && <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">{unreadCount} הודעות חדשות</span>}
           <button onClick={onClose} className="bg-earth-800 p-2 rounded hover:bg-red-900/50 text-white transition-colors"><X size={20} /></button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-64 bg-earth-900 border-l border-earth-800 p-4 hidden md:block overflow-y-auto">
          <div className="space-y-2">
            {TABS.map((tab, idx) => (
              <button key={tab} onClick={() => setActiveTab(idx)} className={`w-full text-right p-3 rounded-lg transition-all flex justify-between items-center ${activeTab === idx ? 'bg-earth-accent text-earth-900 font-bold' : 'text-gray-400 hover:bg-earth-800'}`}>
                {tab}
                {idx === 9 && unreadCount > 0 && <span className="w-2 h-2 bg-red-500 rounded-full"></span>}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-earth-950 relative">
          <div className="md:hidden flex gap-2 mb-6 overflow-x-auto pb-2">
            {TABS.map((tab, idx) => (
              <button key={tab} onClick={() => setActiveTab(idx)} className={`whitespace-nowrap px-4 py-2 rounded-full text-sm ${activeTab === idx ? 'bg-earth-accent text-earth-900' : 'bg-earth-800 text-gray-300'}`}>{tab}</button>
            ))}
          </div>

          {activeTab === 0 && (
            <div className="space-y-8">
              <h3 className="text-2xl text-earth-accent mb-6 font-bold">עריכת סליידר ראשי</h3>
              {slides.map((slide) => (
                <div key={slide.id} className="bg-earth-900 p-6 rounded-xl border border-earth-800 grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="space-y-4">
                      <input type="text" value={slide.title} onChange={(e) => updateSlide(slide.id, { title: e.target.value })} className="w-full bg-earth-950 p-2 rounded text-white border border-earth-700 outline-none" />
                      <input type="text" value={slide.subtitle} onChange={(e) => updateSlide(slide.id, { subtitle: e.target.value })} className="w-full bg-earth-950 p-2 rounded text-white border border-earth-700 outline-none" />
                   </div>
                   <div className="space-y-1">
                      <label className="text-xs text-gray-500">תמונת רקע</label>
                      <ImageSelectionControl currentImage={slide.image} onImageSelect={(url) => updateSlide(slide.id, { image: url })} contextString={slide.title} />
                   </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 1 && (
            <div className="space-y-6 max-w-4xl bg-earth-900 p-6 rounded-xl border border-earth-800">
               <input type="text" value={aboutData.title} onChange={(e) => updateAbout({ title: e.target.value })} className="w-full bg-earth-950 p-3 rounded text-white border border-earth-700 outline-none" />
               <input type="text" value={aboutData.subtitle} onChange={(e) => updateAbout({ subtitle: e.target.value })} className="w-full bg-earth-950 p-3 rounded text-white border border-earth-700 outline-none" />
               <textarea rows={4} value={aboutData.paragraph1} onChange={(e) => updateAbout({ paragraph1: e.target.value })} className="w-full bg-earth-950 p-3 rounded text-white border border-earth-700 outline-none" />
               <textarea rows={4} value={aboutData.paragraph2} onChange={(e) => updateAbout({ paragraph2: e.target.value })} className="w-full bg-earth-950 p-3 rounded text-white border border-earth-700 outline-none" />
               <ImageSelectionControl currentImage={aboutData.image} onImageSelect={(url) => updateAbout({ image: url })} contextString="Herbalist portrait" />
            </div>
          )}

          {(activeTab >= 2 && activeTab <= 4) && (
            <div className="space-y-8">
              <div className="bg-earth-800 p-6 rounded-xl border border-earth-700 shadow-xl">
                 <textarea value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} placeholder="תאר את התוכן שברצונך ליצור..." rows={3} className="w-full bg-earth-950 border border-earth-700 rounded-lg p-3 text-white outline-none resize-none" />
                 <button onClick={() => handleAiGeneration(activeTab === 2 ? 'plant' : activeTab === 3 ? 'general' : 'case')} disabled={isGenerating || !aiPrompt} className="bg-earth-accent text-earth-900 px-6 py-3 rounded-lg font-bold w-full mt-2 hover:bg-white">{isGenerating ? 'יוצר...' : 'צור תוכן חדש עם AI'}</button>
              </div>
              <div className="grid gap-4">
                {(activeTab === 2 ? articles : activeTab === 3 ? generalArticles : caseStudies).map((item) => (
                  <div key={item.id} className="bg-earth-900 p-4 rounded-lg border border-earth-800 flex justify-between items-center">
                    <div className="flex gap-4 items-center">
                      <img src={item.image} className="w-12 h-12 rounded bg-earth-800 object-cover" />
                      <div><h4 className="text-white font-bold">{item.title}</h4></div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => startEdit(item, activeTab === 2 ? 'plant' : activeTab === 3 ? 'general' : 'case')} className="p-2 bg-earth-950 text-earth-accent rounded"><Pencil size={18} /></button>
                      <button onClick={() => { if(confirm('למחוק?')) { activeTab === 2 ? deleteArticle(item.id) : activeTab === 3 ? deleteGeneralArticle(item.id) : deleteCaseStudy(item.id) }}} className="p-2 bg-earth-950 text-red-400 rounded"><Trash2 size={18} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 5 && (
             <div className="space-y-4">
                <button onClick={() => handleAiGeneration('testimonial')} disabled={isGenerating} className="bg-earth-800 text-white px-4 py-2 rounded">צור המלצה פיקטיבית</button>
                {testimonials.map(t => (
                   <div key={t.id} className="p-4 bg-earth-900 rounded border border-earth-800 flex gap-4 items-center justify-between">
                      <div className="flex gap-4 items-center">
                        <img src={t.image || ''} className="w-10 h-10 rounded-full bg-gray-700" />
                        <div><h4 className="text-white font-bold">{t.name}</h4><p className="text-gray-400 text-xs">{t.content.substring(0,50)}...</p></div>
                      </div>
                      <div className="flex gap-2">
                         <button onClick={() => startEditTestimonial(t)} className="p-2 bg-earth-950 text-earth-accent rounded"><Pencil size={16} /></button>
                         <button onClick={() => updateTestimonial(t.id, { approved: !t.approved })} className={`px-2 rounded text-xs ${t.approved ? 'bg-green-900 text-green-400' : 'bg-yellow-900 text-yellow-400'}`}>{t.approved ? 'מאושר' : 'ממתין'}</button>
                         <button onClick={() => deleteTestimonial(t.id)} className="p-2 bg-earth-950 text-red-400 rounded"><Trash2 size={16} /></button>
                      </div>
                   </div>
                ))}
             </div>
          )}

          {activeTab === 6 && (
             <div className="bg-earth-900 p-6 rounded-xl border border-earth-800 space-y-4">
                <input type="text" value={contactData.phone} onChange={(e) => updateContact({ phone: e.target.value })} className="w-full bg-earth-950 p-3 rounded text-white border border-earth-700" placeholder="Phone" />
                <input type="text" value={contactData.whatsapp} onChange={(e) => updateContact({ whatsapp: e.target.value })} className="w-full bg-earth-950 p-3 rounded text-white border border-earth-700" placeholder="WhatsApp Number" />
                <input type="text" value={contactData.email} onChange={(e) => updateContact({ email: e.target.value })} className="w-full bg-earth-950 p-3 rounded text-white border border-earth-700" placeholder="Email" />
                <input type="text" value={contactData.address} onChange={(e) => updateContact({ address: e.target.value })} className="w-full bg-earth-950 p-3 rounded text-white border border-earth-700" placeholder="Address" />
                <input type="text" value={contactData.siteTagline} onChange={(e) => updateContact({ siteTagline: e.target.value })} className="w-full bg-earth-950 p-3 rounded text-white border border-earth-700" placeholder="כותרת האתר (ליד הלוגו)" />
             </div>
          )}

          {activeTab === 7 && (
            <div className="bg-earth-900 p-6 rounded-xl border border-earth-800 space-y-6">
              <h3 className="text-xl font-bold text-white">מנהלי מערכת מורשים</h3>
              <form onSubmit={handleAddAdmin} className="flex gap-2">
                <input type="email" value={newAdminEmail} onChange={e => setNewAdminEmail(e.target.value)} placeholder="הוסף אימייל למנהל חדש..." className="flex-1 bg-earth-950 p-3 rounded text-white border border-earth-700 outline-none ltr text-left" />
                <button type="submit" className="bg-earth-accent text-earth-900 px-6 rounded font-bold hover:bg-white"><UserPlus /></button>
              </form>
              <div className="space-y-2">
                {authorizedEmails.map(email => (
                  <div key={email} className="flex justify-between items-center p-3 bg-earth-950 rounded border border-earth-800">
                    <span className="text-gray-300 ltr">{email}</span>
                    {email !== 'hilatams@gmail.com' && (
                      <button onClick={() => removeAdmin(email)} className="text-red-400 hover:text-red-300"><Trash2 size={16} /></button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 8 && (
            <div className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-earth-900 p-6 rounded-xl border border-earth-800 text-center">
                     <h4 className="text-gray-400 text-sm">סה"כ כניסות</h4>
                     <p className="text-4xl text-white font-bold mt-2">{analyticsData.length}</p>
                  </div>
                  <div className="bg-earth-900 p-6 rounded-xl border border-earth-800 text-center">
                     <h4 className="text-gray-400 text-sm">זמן שהייה ממוצע</h4>
                     <p className="text-4xl text-earth-accent font-bold mt-2">2:14</p>
                  </div>
                  <div className="bg-earth-900 p-6 rounded-xl border border-earth-800 text-center">
                     <h4 className="text-gray-400 text-sm">מקור תנועה מוביל</h4>
                     <p className="text-4xl text-green-400 font-bold mt-2">Google</p>
                  </div>
               </div>
               <div className="bg-earth-900 rounded-xl border border-earth-800 overflow-hidden">
                 <table className="w-full text-right">
                    <thead className="bg-earth-950 text-gray-400 text-sm">
                       <tr>
                         <th className="p-4">תאריך</th>
                         <th className="p-4">מכשיר</th>
                         <th className="p-4">מקור</th>
                         <th className="p-4">חיפוש</th>
                         <th className="p-4">דף כניסה</th>
                       </tr>
                    </thead>
                    <tbody className="text-gray-300">
                       {analyticsData.slice(0, 10).map((session, i) => (
                         <tr key={i} className="border-t border-earth-800 hover:bg-earth-800/50">
                            <td className="p-4 ltr text-right">{session.date}</td>
                            <td className="p-4">{session.device}</td>
                            <td className="p-4">{session.source}</td>
                            <td className="p-4">{session.searchTerm || '-'}</td>
                            <td className="p-4">{session.page}</td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
               </div>
            </div>
          )}

          {activeTab === 9 && (
            <div className="bg-earth-900 rounded-xl border border-earth-800 overflow-hidden">
               {messages.length === 0 ? (
                 <div className="p-12 text-center text-gray-500">אין הודעות חדשות.</div>
               ) : (
                 <div className="divide-y divide-earth-800">
                    {messages.map(msg => (
                      <div key={msg.id} className={`p-4 hover:bg-earth-800/50 transition-colors ${!msg.read ? 'bg-earth-800/30' : ''}`}>
                         <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                               {!msg.read && <span className="w-2 h-2 bg-earth-accent rounded-full"></span>}
                               <h4 className="text-white font-bold">{msg.name}</h4>
                               <span className={`text-xs px-2 py-0.5 rounded ${msg.type === 'contact' ? 'bg-blue-900 text-blue-300' : 'bg-purple-900 text-purple-300'}`}>
                                 {msg.type === 'contact' ? 'צור קשר' : 'שאלון'}
                               </span>
                            </div>
                            <span className="text-xs text-gray-500">{msg.date}</span>
                         </div>
                         <div className="text-sm text-gray-300 mb-2">
                            <span className="text-gray-500">פרטי קשר:</span> {msg.contact}
                         </div>
                         {msg.subject && <div className="text-sm font-bold text-gray-200 mb-1">{msg.subject}</div>}
                         <p className="text-sm text-gray-400 bg-earth-950 p-3 rounded whitespace-pre-line">{msg.content}</p>
                         <div className="flex gap-2 mt-3 justify-end">
                            {!msg.read && <button onClick={() => markMessageRead(msg.id)} className="text-xs text-earth-accent hover:underline">סמן כנקרא</button>}
                            <button onClick={() => deleteMessage(msg.id)} className="text-xs text-red-400 hover:underline">מחק</button>
                         </div>
                      </div>
                    ))}
                 </div>
               )}
            </div>
          )}

          {activeTab === 10 && (
             <div className="bg-earth-900 p-6 rounded-xl border border-earth-800 space-y-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2"><Megaphone size={20} /> הודעות מתפרצות (בר עליון)</h3>
                
                <div className="flex items-center gap-4 bg-earth-950 p-4 rounded border border-earth-700">
                   <div className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${globalSettings.announcementBar.enabled ? 'bg-green-600' : 'bg-gray-600'}`} onClick={() => updateGlobalSettings({ announcementBar: { ...globalSettings.announcementBar, enabled: !globalSettings.announcementBar.enabled } })}>
                      <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${globalSettings.announcementBar.enabled ? 'translate-x-0' : '-translate-x-6'}`}></div>
                   </div>
                   <span className="text-gray-300">{globalSettings.announcementBar.enabled ? 'פעיל' : 'כבוי'}</span>
                </div>

                <div className="space-y-2">
                   <label className="text-sm text-gray-400">תוכן ההודעה</label>
                   <input type="text" value={globalSettings.announcementBar.text} onChange={(e) => updateGlobalSettings({ announcementBar: { ...globalSettings.announcementBar, text: e.target.value } })} className="w-full bg-earth-950 p-3 rounded text-white border border-earth-700 outline-none" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <label className="text-sm text-gray-400">צבע רקע</label>
                      <div className="flex gap-2">
                         <input type="color" value={globalSettings.announcementBar.bgColor} onChange={(e) => updateGlobalSettings({ announcementBar: { ...globalSettings.announcementBar, bgColor: e.target.value } })} className="h-10 w-10 rounded cursor-pointer bg-transparent border-none" />
                         <input type="text" value={globalSettings.announcementBar.bgColor} onChange={(e) => updateGlobalSettings({ announcementBar: { ...globalSettings.announcementBar, bgColor: e.target.value } })} className="flex-1 bg-earth-950 p-2 rounded text-white border border-earth-700 ltr" />
                      </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-sm text-gray-400">צבע טקסט</label>
                      <div className="flex gap-2">
                         <input type="color" value={globalSettings.announcementBar.textColor} onChange={(e) => updateGlobalSettings({ announcementBar: { ...globalSettings.announcementBar, textColor: e.target.value } })} className="h-10 w-10 rounded cursor-pointer bg-transparent border-none" />
                         <input type="text" value={globalSettings.announcementBar.textColor} onChange={(e) => updateGlobalSettings({ announcementBar: { ...globalSettings.announcementBar, textColor: e.target.value } })} className="flex-1 bg-earth-950 p-2 rounded text-white border border-earth-700 ltr" />
                      </div>
                   </div>
                </div>
             </div>
          )}
          
          {editingArticleId && (
            <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4">
              <div className="bg-earth-900 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl border border-earth-700 p-6 space-y-6">
                <div className="flex justify-between"><h3 className="text-white font-bold">עריכה</h3><button onClick={() => setEditingArticleId(null)}><X className="text-white" /></button></div>
                <input value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})} className="w-full bg-earth-950 p-2 text-white border border-earth-700 rounded" />
                <ImageSelectionControl currentImage={editForm.image || ''} onImageSelect={(url) => setEditForm({...editForm, image: url})} contextString={editForm.title} />
                <div className="space-y-4">
                  {editForm.tabs?.map((tab, idx) => (
                     <div key={idx} className="bg-earth-950/50 p-4 rounded border border-earth-800 space-y-2 relative">
                        <button onClick={() => deleteTab(idx)} className="absolute top-2 left-2 text-red-400"><Trash2 size={16} /></button>
                        <input value={tab.label} onChange={e => handleTabChange(idx, 'label', e.target.value)} className="bg-earth-900 text-white p-2 rounded border border-earth-700 w-1/3" />
                        <textarea value={tab.content} onChange={e => handleTabChange(idx, 'content', e.target.value)} className="w-full bg-earth-900 text-white p-2 rounded border border-earth-700" rows={4} />
                        <input value={tab.tags?.join(', ')} onChange={e => handleTagsChange(idx, e.target.value)} className="w-full bg-earth-900 text-white p-2 rounded border border-earth-700" placeholder="Tags" />
                     </div>
                  ))}
                  <button onClick={addNewTab} className="text-earth-accent border border-earth-accent/50 px-4 py-2 rounded">+ טאב</button>
                </div>
                <button onClick={saveEdit} className="bg-earth-accent text-earth-900 px-6 py-2 rounded font-bold w-full">שמור</button>
              </div>
            </div>
          )}

          {editingTestimonialId && (
             <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4">
               <div className="bg-earth-900 w-full max-w-lg rounded-xl border border-earth-700 p-6 space-y-4">
                  <h3 className="text-white font-bold">עריכת המלצה</h3>
                  <input value={testimonialForm.name} onChange={e => setTestimonialForm({...testimonialForm, name: e.target.value})} className="w-full bg-earth-950 p-2 rounded text-white border border-earth-700" placeholder="שם מלא" />
                  <input value={testimonialForm.city} onChange={e => setTestimonialForm({...testimonialForm, city: e.target.value})} className="w-full bg-earth-950 p-2 rounded text-white border border-earth-700" placeholder="עיר" />
                  <textarea value={testimonialForm.content} onChange={e => setTestimonialForm({...testimonialForm, content: e.target.value})} className="w-full bg-earth-950 p-2 rounded text-white border border-earth-700" rows={4} placeholder="תוכן ההמלצה" />
                  
                  <div className="space-y-1">
                     <label className="text-xs text-gray-500 block mb-1">תמונת ממליץ (אופציונלי)</label>
                     <ImageSelectionControl currentImage={testimonialForm.image || ''} onImageSelect={(url) => setTestimonialForm({...testimonialForm, image: url})} contextString={testimonialForm.name} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="text-xs text-gray-500 block mb-1">תאריך יצירה</label>
                        <input type="date" value={testimonialForm.date} onChange={e => setTestimonialForm({...testimonialForm, date: e.target.value})} className="w-full bg-earth-950 p-2 rounded text-white border border-earth-700" />
                     </div>
                     <div>
                        <label className="text-xs text-gray-500 block mb-1">תאריך תפוגה (אופציונלי)</label>
                        <input type="date" value={testimonialForm.expirationDate || ''} onChange={e => setTestimonialForm({...testimonialForm, expirationDate: e.target.value})} className="w-full bg-earth-950 p-2 rounded text-white border border-earth-700" />
                     </div>
                  </div>

                  <div className="flex items-center gap-2 text-white">
                     <input type="checkbox" checked={testimonialForm.approved || false} onChange={e => setTestimonialForm({...testimonialForm, approved: e.target.checked})} className="w-4 h-4" />
                     <span>מאושר לפרסום</span>
                  </div>

                  <div className="flex gap-2 pt-2">
                     <button onClick={() => setEditingTestimonialId(null)} className="flex-1 bg-earth-800 text-white py-2 rounded hover:bg-earth-700">ביטול</button>
                     <button onClick={saveTestimonialEdit} className="flex-1 bg-earth-accent text-earth-900 py-2 rounded font-bold hover:bg-white">שמור שינויים</button>
                  </div>
               </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};