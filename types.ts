
export interface TabContent {
  id: string;
  label: string;
  content: string; // HTML or Markdown string
  tags: string[]; // Tags specific to this tab (e.g., 'digestion', 'calming')
}

export interface Article {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  tabs: TabContent[];
}

export interface SlideData {
  id: number;
  image: string;
  title: string;
  subtitle: string;
}

export interface AboutData {
  title: string;
  subtitle: string;
  paragraph1: string;
  paragraph2: string;
  image: string;
}

export interface ContactData {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  addressLink: string; // Waze/Google Maps link
  hoursText: string;
  zoomAvailable: boolean;
  siteTagline: string; // New Field for Site Title next to Logo
}

export interface Testimonial {
  id: string;
  name: string;
  city: string;
  content: string;
  image?: string;
  approved: boolean;
  date: string;
  expirationDate?: string; // Optional: When to stop showing this review
}

export interface AnalyticsSession {
  id: string;
  date: string; // ISO string
  duration: string; // e.g. "2m 30s"
  page: string;
  device: 'Mobile' | 'Desktop' | 'Tablet';
  source: 'Google' | 'Facebook' | 'Direct' | 'Instagram';
  searchTerm?: string; // If source is Google
}

export interface InboxMessage {
  id: string;
  date: string;
  name: string;
  contact: string; // Email or Phone
  type: 'contact' | 'questionnaire';
  subject?: string; // For contact form
  content?: string; // Or summary of questionnaire
  read: boolean;
}

export interface GlobalSettings {
  announcementBar: {
    enabled: boolean;
    text: string;
    bgColor: string; // Hex or Tailwind class
    textColor: string;
  }
}

export interface DataContextType {
  articles: Article[]; // Plants
  generalArticles: Article[]; // General Articles
  caseStudies: Article[]; // Case Studies
  slides: SlideData[];
  aboutData: AboutData;
  contactData: ContactData;
  authorizedEmails: string[];
  testimonials: Testimonial[];
  analyticsData: AnalyticsSession[];
  messages: InboxMessage[];
  globalSettings: GlobalSettings;
  
  // Plant CRUD
  addArticle: (article: Article) => void;
  updateArticle: (id: string, article: Partial<Article>) => void;
  deleteArticle: (id: string) => void;

  // General Article CRUD
  addGeneralArticle: (article: Article) => void;
  updateGeneralArticle: (id: string, article: Partial<Article>) => void;
  deleteGeneralArticle: (id: string) => void;

  // Case Study CRUD
  addCaseStudy: (article: Article) => void;
  updateCaseStudy: (id: string, article: Partial<Article>) => void;
  deleteCaseStudy: (id: string) => void;

  updateSlide: (id: number, slide: Partial<SlideData>) => void;
  updateAbout: (data: Partial<AboutData>) => void;
  updateContact: (data: Partial<ContactData>) => void;
  
  addAdmin: (email: string) => void;
  removeAdmin: (email: string) => void;

  // Testimonials CRUD
  addTestimonial: (testimonial: Testimonial) => void;
  updateTestimonial: (id: string, testimonial: Partial<Testimonial>) => void;
  deleteTestimonial: (id: string) => void;

  // Analytics
  logVisit: () => void;

  // Inbox & Settings
  addMessage: (msg: Omit<InboxMessage, 'id' | 'date' | 'read'>) => void;
  markMessageRead: (id: string) => void;
  deleteMessage: (id: string) => void;
  updateGlobalSettings: (settings: Partial<GlobalSettings>) => void;
}