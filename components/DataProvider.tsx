
import React, { createContext, useContext, useState, ReactNode } from 'react';
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

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [articles, setArticles] = useState<Article[]>(ARTICLES); // Plants
  const [generalArticles, setGeneralArticles] = useState<Article[]>(GENERAL_ARTICLES); // General Articles
  const [caseStudies, setCaseStudies] = useState<Article[]>(CASE_STUDIES); // Case Studies
  const [slides, setSlides] = useState<SlideData[]>(HERO_SLIDES);
  const [aboutData, setAboutData] = useState<AboutData>(ABOUT_DATA);
  const [contactData, setContactData] = useState<ContactData>(CONTACT_DATA);
  const [authorizedEmails, setAuthorizedEmails] = useState<string[]>(['hilatams@gmail.com']);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsSession[]>(MOCK_ANALYTICS);
  const [messages, setMessages] = useState<InboxMessage[]>(MOCK_MESSAGES);
  const [globalSettings, setGlobalSettings] = useState<GlobalSettings>(GLOBAL_SETTINGS);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([
    {
      id: 't1',
      name: 'מיכל לוי',
      city: 'תל אביב',
      content: 'הטיפול בצמחי מרפא שינה את חיי. הגעתי עם בעיות עיכול קשות ואחרי חודש הרגשתי הקלה משמעותית. ממליצה בחום!',
      date: '2023-10-01',
      approved: true,
      image: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    {
      id: 't2',
      name: 'דני כהן',
      city: 'חיפה',
      content: 'מקצועיות, הקשבה ודיוק. הפורמולה שקיבלתי עזרה לי לישון טוב יותר בלילות. תודה רבה!',
      date: '2023-09-15',
      approved: true
    },
    {
      id: 't3',
      name: 'נועה ברק',
      city: 'הרצליה',
      content: 'תהליך מדהים של ניקוי רעלים. הליווי האישי והתמיכה לאורך כל הדרך היו יוצאי דופן.',
      date: '2023-11-20',
      approved: true,
      image: 'https://randomuser.me/api/portraits/women/68.jpg'
    }
  ]);

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
    
    // --- EMAIL SIMULATION ---
    console.log(`📧 SENDING EMAIL TO ADMINS (${authorizedEmails.join(', ')}):
    New ${msg.type} from ${msg.name}
    Contact: ${msg.contact}
    Subject: ${msg.subject || 'N/A'}
    Content: ${msg.content || 'N/A'}
    `);
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
