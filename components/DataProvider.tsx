
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Article, SlideData, AboutData, ContactData, AnalyticsSession, DataContextType, InboxMessage, GlobalSettings, Testimonial } from '../types';
import { ARTICLES, HERO_SLIDES, ABOUT_DATA, CONTACT_DATA, GENERAL_ARTICLES, CASE_STUDIES, MOCK_ANALYTICS, MOCK_MESSAGES, GLOBAL_SETTINGS } from '../constants';

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

// --- EMAIL JS PLACEHOLDER ---
// To enable real emails:
// 1. Go to emailjs.com, create account
// 2. Add 'npm install @emailjs/browser'
// 3. Replace this function with real emailjs.send() calls
const sendEmail = (templateParams: any, templateId: string = 'YOUR_TEMPLATE_ID') => {
  console.log(`[EmailJS Simulation] Sending ${templateId} with:`, templateParams);
  // Example implementation:
  // emailjs.send('YOUR_SERVICE_ID', templateId, templateParams, 'YOUR_PUBLIC_KEY')
};

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load from LocalStorage or use Defaults
  const loadState = <T,>(key: string, defaultVal: T): T => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : defaultVal;
    } catch (e) {
      return defaultVal;
    }
  };

  const [articles, setArticles] = useState<Article[]>(() => loadState('articles', ARTICLES));
  const [generalArticles, setGeneralArticles] = useState<Article[]>(() => loadState('generalArticles', GENERAL_ARTICLES));
  const [caseStudies, setCaseStudies] = useState<Article[]>(() => loadState('caseStudies', CASE_STUDIES));
  const [slides, setSlides] = useState<SlideData[]>(() => loadState('slides', HERO_SLIDES));
  const [aboutData, setAboutData] = useState<AboutData>(() => loadState('aboutData', ABOUT_DATA));
  const [contactData, setContactData] = useState<ContactData>(() => loadState('contactData', CONTACT_DATA));
  const [authorizedEmails, setAuthorizedEmails] = useState<string[]>(() => loadState('authorizedEmails', ['hilatams@gmail.com']));
  const [analyticsData, setAnalyticsData] = useState<AnalyticsSession[]>(() => loadState('analyticsData', MOCK_ANALYTICS));
  const [messages, setMessages] = useState<InboxMessage[]>(() => loadState('messages', MOCK_MESSAGES));
  const [globalSettings, setGlobalSettings] = useState<GlobalSettings>(() => loadState('globalSettings', GLOBAL_SETTINGS));
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => loadState('testimonials', []));

  // Save to LocalStorage on change
  useEffect(() => localStorage.setItem('articles', JSON.stringify(articles)), [articles]);
  useEffect(() => localStorage.setItem('generalArticles', JSON.stringify(generalArticles)), [generalArticles]);
  useEffect(() => localStorage.setItem('caseStudies', JSON.stringify(caseStudies)), [caseStudies]);
  useEffect(() => localStorage.setItem('slides', JSON.stringify(slides)), [slides]);
  useEffect(() => localStorage.setItem('aboutData', JSON.stringify(aboutData)), [aboutData]);
  useEffect(() => localStorage.setItem('contactData', JSON.stringify(contactData)), [contactData]);
  useEffect(() => localStorage.setItem('authorizedEmails', JSON.stringify(authorizedEmails)), [authorizedEmails]);
  useEffect(() => localStorage.setItem('analyticsData', JSON.stringify(analyticsData)), [analyticsData]);
  useEffect(() => localStorage.setItem('messages', JSON.stringify(messages)), [messages]);
  useEffect(() => localStorage.setItem('globalSettings', JSON.stringify(globalSettings)), [globalSettings]);
  useEffect(() => localStorage.setItem('testimonials', JSON.stringify(testimonials)), [testimonials]);

  // Plant Functions
  const addArticle = (article: Article) => {
    setArticles(prev => [...prev, article]);
  };

  const updateArticle = (id: string, updatedFields: Partial<Article>) => {
    setArticles(prev => prev.map(art => art.id === id ? { ...art, ...updatedFields } : art));
  };

  const deleteArticle = (id: string) => {
    setArticles(prev => prev.filter(art => art.id !== id));
  };

  // General Article Functions
  const addGeneralArticle = (article: Article) => {
    setGeneralArticles(prev => [...prev, article]);
  };

  const updateGeneralArticle = (id: string, updatedFields: Partial<Article>) => {
    setGeneralArticles(prev => prev.map(art => art.id === id ? { ...art, ...updatedFields } : art));
  };

  const deleteGeneralArticle = (id: string) => {
    setGeneralArticles(prev => prev.filter(art => art.id !== id));
  };

  // Case Study Functions
  const addCaseStudy = (article: Article) => {
    setCaseStudies(prev => [...prev, article]);
  };

  const updateCaseStudy = (id: string, updatedFields: Partial<Article>) => {
    setCaseStudies(prev => prev.map(art => art.id === id ? { ...art, ...updatedFields } : art));
  };

  const deleteCaseStudy = (id: string) => {
    setCaseStudies(prev => prev.filter(art => art.id !== id));
  };

  const updateSlide = (id: number, updatedFields: Partial<SlideData>) => {
    setSlides(prev => prev.map(slide => slide.id === id ? { ...slide, ...updatedFields } : slide));
  };

  const updateAbout = (updatedFields: Partial<AboutData>) => {
    setAboutData(prev => ({ ...prev, ...updatedFields }));
  };

  const updateContact = (updatedFields: Partial<ContactData>) => {
    setContactData(prev => ({ ...prev, ...updatedFields }));
  };

  const addAdmin = (email: string) => {
    if (email && !authorizedEmails.includes(email.toLowerCase())) {
      setAuthorizedEmails(prev => [...prev, email.toLowerCase()]);
    }
  };

  const removeAdmin = (email: string) => {
    setAuthorizedEmails(prev => prev.filter(e => e !== email.toLowerCase()));
  };

  // Analytics
  const logVisit = () => {
    const sources: ('Google' | 'Facebook' | 'Direct' | 'Instagram')[] = ['Google', 'Facebook', 'Direct', 'Instagram'];
    const searchTerms = ['טיפול טבעי', 'צמחי מרפא', 'נטורופתיה', 'כאבי בטן', 'חרדה טיפול'];
    
    const randomSource = sources[Math.floor(Math.random() * sources.length)];
    const randomTerm = randomSource === 'Google' ? searchTerms[Math.floor(Math.random() * searchTerms.length)] : undefined;
    
    const newSession: AnalyticsSession = {
      id: `v-${Date.now()}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      duration: '0m 00s', // Starts at 0
      page: 'דף הבית',
      device: window.innerWidth < 768 ? 'Mobile' : 'Desktop',
      source: randomSource,
      searchTerm: randomTerm
    };
    
    setAnalyticsData(prev => [newSession, ...prev]);
  };

  // Inbox
  const addMessage = (msg: Omit<InboxMessage, 'id' | 'date' | 'read'>) => {
    const newMessage: InboxMessage = {
      ...msg,
      id: `m-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      read: false
    };
    setMessages(prev => [newMessage, ...prev]);
    
    // Send Email Notification to Admin
    sendEmail({
        to_email: authorizedEmails[0], // Send to first admin
        from_name: msg.name,
        from_contact: msg.contact,
        subject: msg.subject || msg.type,
        message: msg.content
    }, 'template_admin_notification');
  };

  const markMessageRead = (id: string) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
  };

  const deleteMessage = (id: string) => {
    setMessages(prev => prev.filter(m => m.id !== id));
  };

  const updateGlobalSettings = (settings: Partial<GlobalSettings>) => {
    setGlobalSettings(prev => ({ ...prev, ...settings }));
  };

  const addTestimonial = (t: Testimonial) => {
    setTestimonials(prev => [...prev, t]);
  };

  return (
    <DataContext.Provider value={{
      articles,
      generalArticles,
      caseStudies,
      slides,
      aboutData,
      contactData,
      authorizedEmails,
      analyticsData,
      messages,
      globalSettings,
      testimonials,
      addArticle,
      updateArticle,
      deleteArticle,
      addGeneralArticle,
      updateGeneralArticle,
      deleteGeneralArticle,
      addCaseStudy,
      updateCaseStudy,
      deleteCaseStudy,
      updateSlide,
      updateAbout,
      updateContact,
      addAdmin,
      removeAdmin,
      logVisit,
      addMessage,
      markMessageRead,
      deleteMessage,
      updateGlobalSettings,
      addTestimonial
    }}>
      {children}
    </DataContext.Provider>
  );
};