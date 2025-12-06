
import { Article, SlideData, AboutData, ContactData, Testimonial, AnalyticsSession, InboxMessage, GlobalSettings } from './types';

export const HERO_SLIDES: SlideData[] = [
  {
    id: 1,
    image: "https://picsum.photos/id/106/1920/1080", // Flower/Nature
    title: "ריפוי מהשורש",
    subtitle: "מסע אל עומק הריפוי הטבעי בהתאמה אישית"
  },
  {
    id: 2,
    image: "https://picsum.photos/id/252/1920/1080", // Nature/Calm
    title: "חוכמת הצמחים",
    subtitle: "ידע עתיק פוגש מדע מודרני בקליניקה"
  },
  {
    id: 3,
    image: "https://picsum.photos/id/292/1920/1080", // Herbs/Tea
    title: "איזון גוף ונפש",
    subtitle: "טיפולים הוליסטיים המשלבים תזונה וצמחי מרפא"
  }
];

export const ABOUT_DATA: AboutData = {
  title: "אודות המטפלת",
  subtitle: "חיבור לטבע, הקשבה לגוף",
  paragraph1: "נעים להכיר, שמי ענת (שם בדוי להדגמה). אני מטפלת בצמחי מרפא קליניים עם ניסיון של מעל עשור. הגישה שלי משלבת בין הידע המסורתי העתיק של רפואת הצמחים לבין הבנה מדעית מודרנית של הפיזיולוגיה האנושית.",
  paragraph2: "אני מאמינה שהגוף יודע לרפא את עצמו, והתפקיד שלנו הוא רק לתת לו את הכלים הנכונים. בקליניקה שלי, כל מטופל מקבל פורמולה המותאמת אישית לצרכיו, לאורח חייו ולמצבו הרגשי.",
  image: "https://picsum.photos/id/447/800/1000"
};

export const CONTACT_DATA: ContactData = {
  phone: "050-1234567",
  whatsapp: "972501234567",
  email: "contact@herbalc.co.il",
  address: "רחוב הזית 12, פרדס חנה",
  addressLink: "#",
  hoursText: "ימים א'-ה': 09:00 - 19:00, יום ו': 09:00 - 13:00",
  zoomAvailable: true,
  siteTagline: "הילה כהן - מטפלת בצמחי מרפא"
};

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'מיכל כהן',
    city: 'תל אביב',
    content: 'הגעתי לענת עם בעיות עיכול שנמשכו שנים. אחרי חודש עם הפורמולה המדויקת שהיא רקחה לי, אני מרגישה אדם חדש. תודה רבה!',
    approved: true,
    date: '2023-10-15',
    image: 'https://randomuser.me/api/portraits/women/44.jpg'
  },
  {
    id: 't2',
    name: 'דוד לוי',
    city: 'רעננה',
    content: 'מקצועיות ברמה הגבוהה ביותר. השילוב של הידע הקליני עם הגישה הנעימה והמכילה עושה את כל ההבדל.',
    approved: true,
    date: '2023-11-02',
    image: 'https://randomuser.me/api/portraits/men/32.jpg'
  },
  {
    id: 't3',
    name: 'שרון אלון',
    city: 'חיפה',
    content: 'הטיפול בצמחי מרפא שינה את חיי. סוף סוף אני ישנה טוב בלילה ויש לי אנרגיה במהלך היום.',
    approved: true,
    date: '2023-12-10',
    image: 'https://randomuser.me/api/portraits/women/68.jpg'
  },
  {
    id: 't4',
    name: 'יואב צור',
    city: 'פרדס חנה',
    content: 'ממליץ בחום! ענת ידעה לאבחן בדיוק את הבעיה ולתת פתרון טבעי שעובד.',
    approved: true,
    date: '2024-01-05',
    image: 'https://randomuser.me/api/portraits/men/85.jpg'
  }
];

export const ARTICLES: Article[] = [
  {
    id: 'lavender',
    title: 'לבנדר (Lavandula)',
    subtitle: 'המרגיע הלאומי',
    description: 'הלבנדר הוא אחד הצמחים המוכרים והאהובים ביותר בעולם הרפואה הטבעית. הוא משלב ארומה משכרת עם יכולות חיטוי והרגעה עוצמתיות.',
    image: 'https://picsum.photos/id/306/800/600',
    tabs: [
      {
        id: 'properties',
        label: 'תכונות רפואיות',
        content: 'הלבנדר ידוע כצמח מרגיע (Sedative), נוגד עוויתות (Antispasmodic), ומחטא (Antiseptic). השמן האתרי שבו מכיל לינאלול המפעיל את מערכת העצבים הפרא-סימפתטית.',
        tags: ['calming', 'antiseptic', 'sleep']
      },
      {
        id: 'uses',
        label: 'שימושים נפוצים',
        content: 'שימוש בשמן אתרי לבנדר במבער מסייע לשינה טובה. חליטת פרחי לבנדר מסייעת לכהבי בטן והרגעה כללית. מריחה חיצונית מסייעת לחיטוי פצעים וכוויות.',
        tags: ['home-remedy', 'skin', 'digestion']
      },
      {
        id: 'research',
        label: 'מחקרים',
        content: 'מחקרים קליניים הראו כי הרחת שמן לבנדר לפני שינה משפרת את איכות השינה העמוקה ומפחיתה חרדה במצבי לחץ.',
        tags: ['science', 'anxiety']
      }
    ]
  },
  {
    id: 'echinacea',
    title: 'אכינצאה (Echinacea)',
    subtitle: 'מגן החורף',
    description: 'האכינצאה היא "האנטיביוטיקה של הטבע". צמח עוצמתי לחיזוק המערכת החיסונית ומניעת מחלות חורף.',
    image: 'https://picsum.photos/id/360/800/600',
    tabs: [
      {
        id: 'properties',
        label: 'תכונות רפואיות',
        content: 'האכינצאה היא אימונו-מודולטורית (Immunomodulator), כלומר מווסתת ומחזקת את מערכת החיסון. היא גם אנטי-ויראלית ואנטי-דלקתית.',
        tags: ['immunity', 'winter', 'antiviral']
      },
      {
        id: 'uses',
        label: 'שימושים נפוצים',
        content: 'מומלץ ליטול תמצית אכינצאה עם הופעת התסמינים הראשונים של הצטננות או שפעת. ניתן להשתמש גם כתרסיס גרון להקלה על כאבים.',
        tags: ['winter', 'cold-flu']
      },
      {
        id: 'contraindications',
        label: 'אזהרות',
        content: 'לא מומלץ לאנשים הסובלים ממחלות אוטואימוניות כיוון שהצמח מעורר את מערכת החיסון יתר על המידה.',
        tags: ['safety']
      }
    ]
  },
  {
    id: 'ginger',
    title: 'זנגביל (Ginger)',
    subtitle: 'האש הפנימית',
    description: 'שורש הזנגביל הוא מנוע של אנרגיה וחום. הוא מסייע בעיכול, מחמם את הגוף ומעורר זרימת דם.',
    image: 'https://picsum.photos/id/431/800/600',
    tabs: [
      {
        id: 'properties',
        label: 'תכונות רפואיות',
        content: 'הזנגביל הוא צמח מחמם, קרמינטיבי (סופח גזים), נוגד בחילות חזק מאוד (Antiemetic) ומעודד זרימת דם פריפרית.',
        tags: ['digestion', 'warming', 'energy']
      },
      {
        id: 'uses',
        label: 'שימושים נפוצים',
        content: 'מצוין לבחילות הריון או נסיעות. חליטת ג\'ינג\'ר טרי עם לימון ודבש היא תרופה קלאסית להצטננות. מסייע בעיכול ארוחות כבדות.',
        tags: ['digestion', 'nausea', 'home-remedy']
      },
      {
        id: 'cuisine',
        label: 'במטבח',
        content: 'ניתן לשלב ג\'ינג\'ר במוקפצים, מרקים ושייקים ירוקים להוספת חריפות עדינה ובריאות.',
        tags: ['food', 'lifestyle']
      }
    ]
  },
  {
    id: 'chamomile',
    title: 'קמומיל (Chamomile)',
    subtitle: 'הליטוף העדין',
    description: 'הקמומיל הוא הצמח העדין והבטוח ביותר, מתאים לתינוקות ועד קשישים להרגעה וכאבי בטן.',
    image: 'https://picsum.photos/id/514/800/600',
    tabs: [
      {
        id: 'properties',
        label: 'תכונות רפואיות',
        content: 'נוגד דלקת עדין, מרגיע מערכת העצבים, ומרגיע את מערכת העיכול (Carminative). מצוין למצבים של "בטן עצבנית".',
        tags: ['calming', 'digestion', 'kids-safe']
      },
      {
        id: 'uses',
        label: 'שימושים נפוצים',
        content: 'חליטה להרגעה לפני השינה, קומפרסים לעיניים דלקתיות, ושטיפות פה להרגעת חניכיים.',
        tags: ['sleep', 'home-remedy', 'skin']
      }
    ]
  },
  {
    id: 'mint',
    title: 'נענע (Mentha)',
    subtitle: 'רעננות של בריאות',
    description: 'הנענע היא צמח מצנן, מרענן ומסייע להקלה מיידית בבעיות עיכול וכאבי ראש.',
    image: 'https://picsum.photos/id/627/800/600',
    tabs: [
      {
        id: 'properties',
        label: 'תכונות רפואיות',
        content: 'המנטול בנענע פועל כמשכך כאבים טבעי, מרפה שרירים ומסייע בשחרור גזים ממערכת העיכול.',
        tags: ['digestion', 'cooling', 'pain']
      },
      {
        id: 'uses',
        label: 'שימושים נפוצים',
        content: 'חליטה חמה להקלה על בטן נפוחה. שמן אתרי נענע למריחה על הרקות בזמן כאב ראש (בזהירות מהעיניים).',
        tags: ['digestion', 'headache']
      }
    ]
  }
];

export const GENERAL_ARTICLES: Article[] = [
  {
    id: 'winter-health',
    title: 'איך לעבור את החורף בשלום',
    subtitle: 'טיפים טבעיים לחיזוק החיסון',
    description: 'החורף מביא איתו אתגרים לגוף ולנפש. במאמר זה נלמד כיצד להכין את הגוף באמצעות תזונה, צמחים והרגלי חיים.',
    image: 'https://picsum.photos/id/885/800/600',
    tabs: [
      {
        id: 'intro',
        label: 'מבוא',
        content: 'החורף הוא זמן של התכנסות. ברפואה הסינית הוא מקושר לאלמנט המים ולכליות. זה הזמן לשמור על האנרגיה שלנו פנימה.',
        tags: ['winter', 'lifestyle', 'immunity']
      },
      {
        id: 'nutrition',
        label: 'תזונה מחממת',
        content: 'בחורף מומלץ לעבור למזון מבושל, מרקים, תבשילי קדרה וירקות שורש. תבלינים כמו קינמון, ג\'ינג\'ר והל עוזרים לחימום הגוף.',
        tags: ['nutrition', 'winter']
      },
      {
        id: 'herbs',
        label: 'צמחים תומכים',
        content: 'צמחים כמו סמבוק שחור, אכינצאה וקדד קרומי יכולים לסייע במניעת מחלות חורף וקיצור משך המחלה.',
        tags: ['herbs', 'immunity']
      }
    ]
  },
  {
    id: 'stress-management',
    title: 'להירגע בטבעיות',
    subtitle: 'התמודדות עם לחץ בעולם המודרני',
    description: 'סטרס הוא גורם משמעותי במחלות רבות. גלו דרכים טבעיות להרגעת מערכת העצבים.',
    image: 'https://picsum.photos/id/995/800/600',
    tabs: [
      {
        id: 'understanding',
        label: 'הבנת הסטרס',
        content: 'סטרס כרוני מעלה את רמות הקורטיזול בגוף, מה שפוגע בשינה, בעיכול ובמערכת החיסון.',
        tags: ['stress', 'science']
      },
      {
        id: 'tools',
        label: 'כלים מעשיים',
        content: 'תרגילי נשימה, מדיטציה, ושימוש בצמחים אדפטוגניים כמו אשווגנדה ורודיולה יכולים לשפר את העמידות ללחץ.',
        tags: ['lifestyle', 'calming']
      }
    ]
  }
];

export const CASE_STUDIES: Article[] = [
  {
    id: 'migraine-case',
    title: 'טיפול במיגרנות כרוניות',
    subtitle: 'איזון הכבד וזרימת הדם',
    description: 'תיאור מקרה של אישה בת 35 הסובלת ממיגרנות על רקע הורמונלי ומתח.',
    image: 'https://picsum.photos/id/1012/800/600',
    tabs: [
      {
        id: 'complaint',
        label: 'תלונה עיקרית',
        content: 'המטופלת הגיעה עם תלונות על כאבי ראש פועמים בצד אחד, המוחמרים לפני וסת ובזמן לחץ בעבודה. עוצמת הכאב 8/10.',
        tags: ['pain', 'stress', 'hormonal']
      },
      {
        id: 'diagnosis',
        label: 'אבחנה',
        content: 'על פי הרפואה המסורתית: תקיעות של צ\'י הכבד וחום עולה מעלה. נראתה גם חולשת דם קלה.',
        tags: ['diagnosis']
      },
      {
        id: 'treatment',
        label: 'אסטרטגיה טיפולית',
        content: 'פורמולה המכילה חרצית (Chrysanthemum) לקרור הראש, בן-חרצית (Feverfew) למניעת מיגרנה, ושורש אדמונית לאיזון הורמונלי.',
        tags: ['herbs', 'treatment']
      },
      {
        id: 'outcome',
        label: 'תוצאות',
        content: 'לאחר 3 חודשי טיפול, תדירות ההתקפים ירדה מפעמיים בשבוע לפעם בחודש, ועוצמתם פחתה משמעותית.',
        tags: ['results']
      }
    ]
  },
  {
    id: 'digestive-issue',
    title: 'שיקום מערכת העיכול',
    subtitle: 'ממעי רגיז לאיזון מלא',
    description: 'גבר בן 45 עם היסטוריה של נפיחות, גזים ואי נוחות לאחר ארוחות.',
    image: 'https://picsum.photos/id/1060/800/600',
    tabs: [
      {
        id: 'background',
        label: 'רקע',
        content: 'המטופל עובד שעות רבות בישיבה, אוכל מהר ולא מסודר. סובל מנפיחות משמעותית בשעות הערב.',
        tags: ['digestion', 'lifestyle']
      },
      {
        id: 'treatment',
        label: 'טיפול',
        content: 'שילוב של צמחים קרמינטיביים (סופחי גזים) כמו שומר, קמומיל ומליסה, יחד עם פרוביוטיקה ושינוי הרגלי אכילה.',
        tags: ['digestion', 'nutrition']
      },
      {
        id: 'results',
        label: 'מעקב',
        content: 'שיפור משמעותי תוך שבועיים. הנפיחות ירדה והמטופל מדווח על קלילות ואנרגיה טובה יותר.',
        tags: ['results']
      }
    ]
  }
];

export const MOCK_ANALYTICS: AnalyticsSession[] = [
  { id: '1', date: '2023-10-27 10:30', duration: '2m 15s', page: 'דף הבית', device: 'Mobile', source: 'Google', searchTerm: 'נטורופתית בפרדס חנה' },
  { id: '2', date: '2023-10-27 11:15', duration: '5m 00s', page: 'לבנדר', device: 'Desktop', source: 'Direct' },
  { id: '3', date: '2023-10-27 12:45', duration: '1m 20s', page: 'צור קשר', device: 'Mobile', source: 'Instagram' },
  { id: '4', date: '2023-10-27 14:00', duration: '8m 45s', page: 'טיפול במיגרנות', device: 'Desktop', source: 'Google', searchTerm: 'טיפול טבעי במיגרנה' },
  { id: '5', date: '2023-10-27 15:30', duration: '0m 45s', page: 'דף הבית', device: 'Mobile', source: 'Facebook' },
];

export const MOCK_MESSAGES: InboxMessage[] = [
  { id: 'm1', date: '2023-10-28', name: 'ישראל ישראלי', contact: '050-1234567', type: 'contact', subject: 'התעניינות בטיפול', content: 'שלום, אשמח לשמוע פרטים על טיפול בבעיות שינה.', read: false },
  { id: 'm2', date: '2023-10-27', name: 'שרה כהן', contact: 'sara@example.com', type: 'questionnaire', content: 'שאלון אבחון חדש - מטרה עיקרית: בעיות עיכול', read: true },
];

export const GLOBAL_SETTINGS: GlobalSettings = {
  announcementBar: {
    enabled: false,
    text: "סדנת צמחי מרפא לחורף נפתחת בקרוב! הרשמה מוקדמת בעיצומה",
    bgColor: "#84a98c",
    textColor: "#ffffff"
  }
};
