// ─────────────────────────────────────────────────────────────────────────
// Shared content for every portfolio version (V1–V6).
// All six designs render from this single source of truth.
// FR / EN / AR. (V1 Terminal only exposes FR + EN; the others add AR + RTL.)
// ─────────────────────────────────────────────────────────────────────────

export type Lang = 'fr' | 'en' | 'ar';

export interface Link {
  label: string;
  url: string;
}
export interface Experience {
  i: string;
  title: string;
  role: string;
  period: string;
  bullets: string[];
  tags: string[];
  hasLinks?: boolean;
  links?: Link[];
}
export interface Education {
  period: string;
  degree: string;
  school: string;
  modules: string[];
}
export interface Fact {
  k: string;
  v: string;
}
export interface SpokenLanguage {
  name: string;
  level: string;
  pct: number;
}
export interface Content {
  nav: { about: string; skills: string; work: string; edu: string; contact: string };
  status: string;
  hero: {
    eyebrow: string;
    eyebrowLabel: string;
    tagline: string;
    ctaContact: string;
    ctaCV: string;
    loc: string;
    role2: string;
    name: { n1: string; n2: string; n3: string };
    locLabel: string;
    progLabel: string;
  };
  about: { label: string; heading: string; body: string; facts: Fact[] };
  skills: {
    label: string;
    heading: string;
    cats: { fe: string; be: string; data: string; ops: string; cloud: string };
  };
  work: { label: string; heading: string; items: Experience[] };
  edu: { label: string; heading: string; items: Education[] };
  contact: { label: string; heading: string; body: string; cta: string };
  footer: { built: string; top: string };
  spoken: SpokenLanguage[];
}

// ── Profile constants shared across all languages ────────────────────────
export const PROFILE = {
  email: 'mohamedmehdi.zitouni@univ-constantine2.dz',
  mailto: 'mailto:mohamedmehdi.zitouni@univ-constantine2.dz',
  phone: '+213 5 42 86 68 39',
  github: 'mi2odev',
  githubUrl: 'https://github.com/mi2odev',
  instagram: 'https://www.instagram.com/_.mi2o/',
  facebook: 'https://www.facebook.com/Mohamed.mehdi.zitouni?locale=fr_FR',
  cvHref: '/CV_Mohamed_Mehdi_ZITOUNI.pdf',
  photo: '/photo.png',
  year: '2026',
} as const;

// ── Skill chips (language-independent) ────────────────────────────────────
export const SKILL_CHIPS = {
  fe: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Vue.js', 'Tailwind'],
  be: ['PHP', 'Laravel', 'Django', 'Spring Boot', 'MySQL', 'NoSQL'],
  data: ['Python', 'Pandas', 'Scikit-learn', 'Hadoop', 'Spark', 'Deep Learning'],
  ops: ['Docker', 'Linux', 'Git', 'GitHub', 'UML'],
  cloud: ['AWS IoT Core', 'AWS Lambda', 'DynamoDB', 'SNS', 'CloudWatch', 'EC2', 'MQTT', 'ESP32', 'Grafana'],
} as const;

export const TECH_MARQUEE = [
  'React', 'TypeScript', 'Python', 'Docker', 'Spark', 'Laravel', 'Vue.js',
  'PySpark', 'MySQL', 'Tailwind', 'Django', 'Spring Boot', 'Hadoop', 'Git',
] as const;

// ── Localised content ─────────────────────────────────────────────────────
export const CONTENT: Record<Lang, Content> = {
  fr: {
    nav: { about: 'À propos', skills: 'Compétences', work: 'Expérience', edu: 'Formation', contact: 'Contact' },
    status: 'Disponible — Freelance',
    hero: {
      eyebrow: 'Développeur Full Stack · Data Science & IA',
      eyebrowLabel: 'Rôle',
      tagline:
        'Je conçois des applications web modernes et des solutions intelligentes — d’un front-end soigné jusqu’aux modèles de machine learning.',
      ctaContact: 'Me contacter',
      ctaCV: 'Télécharger le CV',
      loc: 'Constantine, Algérie',
      role2: 'Master 2 · SDSI',
      name: { n1: 'Mohamed', n2: 'Mehdi', n3: 'Zitouni' },
      locLabel: 'Localisation',
      progLabel: 'Programme',
    },
    about: {
      label: 'À propos',
      heading: 'Étudiant en Master 2, développeur full stack et passionné d’intelligence artificielle.',
      body: 'Master 2 Sciences des Données & Systèmes Intelligents.',
      facts: [
        { k: 'Localisation', v: 'Constantine, DZ' },
        { k: 'Formation', v: 'Master 2 — SDSI' },
        { k: 'Focus', v: 'Web · IA / ML' },
        { k: 'Statut', v: 'Freelance · Stage' },
      ],
    },
    skills: {
      label: 'Compétences',
      heading: 'Stack technique & outils du quotidien.',
      cats: { fe: 'Frontend', be: 'Backend', data: 'Data & IA', ops: 'DevOps & Outils', cloud: 'Cloud & IoT' },
    },
    work: {
      label: 'Expérience',
      heading: 'Projets & expériences sélectionnés.',
      items: [
        {
          i: '01',
          title: 'Analyse de sentiments — Avis Amazon',
          role: 'Projet Machine Learning · Big Data & NoSQL',
          period: 'Mars – Mai 2025',
          bullets: [
            'Développement d’un modèle capable d’analyser et de classifier les sentiments exprimés dans les avis clients Amazon.',
            'Traitement de données massives avec PySpark et Hadoop, le tout conteneurisé sous Docker pour la portabilité.',
          ],
          tags: ['Python', 'PySpark', 'Hadoop', 'Docker', 'NLP'],
        },
        {
          i: '02',
          title: 'Plateforme de gestion de livraison',
          role: 'Projet de fin d’études · Licence',
          period: '2024',
          bullets: [
            'Conception et développement d’une application web et mobile dédiée à la gestion de la livraison des commandes.',
            'Suivi en temps réel des commandes et de leur acheminement jusqu’au client final.',
          ],
          tags: ['Web', 'Mobile', 'Full Stack', 'UML'],
        },
        {
          i: '03',
          title: 'Sites de tests de personnalité',
          role: 'Développeur Web Full Stack · Freelance',
          period: '2023 – Présent',
          bullets: [
            'Conception de sites de tests de personnalité : interface utilisateur et logique de calcul des résultats.',
            'Intégration d’interfaces modernes et responsives pour optimiser l’expérience utilisateur.',
          ],
          tags: ['JavaScript', 'React', 'UI/UX', 'Responsive'],
          hasLinks: true,
          links: [
            { label: 'JoJo Test', url: 'https://jojomi2o.netlify.app/' },
            { label: 'One Piece Test', url: 'https://onepiecemi2o.netlify.app/' },
          ],
        },
        {
          i: '04',
          title: 'SIARA — Évaluation intelligente du risque d’accidents',
          role: 'Projet de mémoire de Master',
          period: '2025 – 2026',
          bullets: [
            'Plateforme temps réel d’aide à la décision pour la sécurité routière, intégrant machine learning, SIG, signalement citoyen et IA explicable.',
            'Architecture multiplateforme : applications web/mobile React, services backend Node.js, bases PostgreSQL/PostGIS et services ML prédictifs d’estimation du risque d’accident.',
            'Modules de prédiction du risque, validation des signalements, gestion des alertes, visualisation géospatiale et IA explicable pour appuyer citoyens et forces de l’ordre.',
          ],
          tags: ['React', 'React Native', 'Node.js', 'PostgreSQL', 'PostGIS', 'Machine Learning', 'LightGBM', 'SHAP', 'SIG', 'REST APIs', 'OpenStreetMap', 'Git'],
          hasLinks: true,
          links: [{ label: 'Siara Live', url: 'https://siaraalgeria.vercel.app/' }],
        },
        {
          i: '05',
          title: 'Assistant Q&R multilingue pour supports de cours',
          role: 'Projet Deep Learning',
          period: '2025',
          bullets: [
            'Conception et implémentation d’un assistant de questions-réponses multilingue pour les supports de cours universitaires, basé sur PyTorch et le deep learning.',
          ],
          tags: ['PyTorch', 'Deep Learning', 'NLP', 'Q&R', 'Multilingue'],
        },
        {
          i: '06',
          title: 'Système de réservation d’hôtel',
          role: 'Application web · Projet',
          period: '2024',
          bullets: ['Application web de réservation d’hôtel : gestion des chambres, des disponibilités et des réservations.'],
          tags: ['JavaScript', 'Web', 'Hôtel', 'Réservation'],
          hasLinks: true,
          links: [{ label: 'Voir le code', url: 'https://github.com/mi2odev/reservation' }],
        },
        {
          i: '07',
          title: 'Système de gestion scolaire',
          role: 'Application web · Projet',
          period: '2024',
          bullets: ['Application web pour la gestion des élèves, des classes et des données scolaires.'],
          tags: ['JavaScript', 'Web', 'Gestion'],
          hasLinks: true,
          links: [{ label: 'Voir le code', url: 'https://github.com/mi2odev/schoolsystem' }],
        },
        {
          i: '08',
          title: 'Système de sécurité domotique basé sur l’IoT',
          role: 'Mini-projet Cloud & IoT',
          period: '2025',
          bullets: [
            'Conception et implémentation d’un système de détection d’intrusion pour maison connectée avec ESP32, capteurs PIR, MQTT et services AWS Cloud.',
            'Construction d’un pipeline événementiel complet avec AWS IoT Core, Lambda, SNS, DynamoDB, CloudWatch et Grafana.',
            'Développement de la surveillance d’intrusion en temps réel, des alertes automatisées, du stockage des événements et de la visualisation par dashboard.',
            'Simulation des dispositifs IoT et de l’infrastructure réseau avec Wokwi et Cisco Packet Tracer.',
          ],
          tags: ['ESP32', 'MQTT', 'AWS IoT Core', 'Lambda', 'DynamoDB', 'SNS', 'CloudWatch', 'EC2', 'Grafana', 'Cisco Packet Tracer', 'Wokwi'],
        },
      ],
    },
    edu: {
      label: 'Formation',
      heading: 'Parcours académique.',
      items: [
        {
          period: '2024 – Présent',
          degree: 'Master — Sciences des Données & Systèmes Intelligents',
          school: 'Université Constantine 2 · Abdelhamid Mehri',
          modules: ['Machine Learning', 'Deep Learning', 'Big Data & NoSQL', 'Cloud & IoT', 'Optimisation', 'Prétraitement des données'],
        },
        {
          period: '2021 – 2024',
          degree: 'Licence — Informatique',
          school: 'Université Larbi Ben M’Hidi · Oum El Bouaghi',
          modules: ['Structures de données', 'POO', 'Génie logiciel', 'Systèmes d’exploitation', 'Dév. Web', 'Bases de données avancées'],
        },
        { period: '2020 – 2021', degree: 'Baccalauréat Scientifique', school: 'Mention Assez Bien', modules: [] },
      ],
    },
    contact: {
      label: 'Contact',
      heading: 'Travaillons ensemble.',
      body: 'Un projet web, une mission data ou simplement envie d’échanger ? Ma boîte mail est toujours ouverte.',
      cta: 'Envoyer un email',
    },
    footer: { built: 'Conçu & développé par Mohamed Mehdi Zitouni', top: 'Haut de page' },
    spoken: [
      { name: 'Arabe', level: 'Natif', pct: 100 },
      { name: 'Français', level: 'Avancé', pct: 92 },
      { name: 'Anglais', level: 'Avancé', pct: 85 },
    ],
  },

  en: {
    nav: { about: 'About', skills: 'Skills', work: 'Work', edu: 'Education', contact: 'Contact' },
    status: 'Available — Freelance',
    hero: {
      eyebrow: 'Full Stack Developer · Data Science & AI',
      eyebrowLabel: 'Role',
      tagline:
        'I build modern web applications and intelligent solutions — from polished front-ends to machine-learning models.',
      ctaContact: 'Get in touch',
      ctaCV: 'Download CV',
      loc: 'Constantine, Algeria',
      role2: "Master's · DSIS",
      name: { n1: 'Mohamed', n2: 'Mehdi', n3: 'Zitouni' },
      locLabel: 'Location',
      progLabel: 'Program',
    },
    about: {
      label: 'About',
      heading: "Master's student, full stack developer and AI enthusiast.",
      body: "Master's in Data Science & Intelligent Systems.",
      facts: [
        { k: 'Location', v: 'Constantine, DZ' },
        { k: 'Studying', v: 'MSc — Data Science' },
        { k: 'Focus', v: 'Web · AI / ML' },
        { k: 'Status', v: 'Freelance · Intern' },
      ],
    },
    skills: {
      label: 'Skills',
      heading: 'Tech stack & everyday tools.',
      cats: { fe: 'Frontend', be: 'Backend', data: 'Data & AI', ops: 'DevOps & Tools', cloud: 'Cloud & IoT' },
    },
    work: {
      label: 'Work',
      heading: 'Selected projects & experience.',
      items: [
        {
          i: '01',
          title: 'Sentiment Analysis — Amazon Reviews',
          role: 'Machine Learning Project · Big Data & NoSQL',
          period: 'Mar – May 2025',
          bullets: [
            'Built a model to analyze and classify the sentiment expressed in Amazon customer reviews.',
            'Processed large-scale data with PySpark and Hadoop, fully containerized with Docker for portability.',
          ],
          tags: ['Python', 'PySpark', 'Hadoop', 'Docker', 'NLP'],
        },
        {
          i: '02',
          title: 'Delivery Management Platform',
          role: 'Final-Year Project · Bachelor',
          period: '2024',
          bullets: [
            'Designed and built a web and mobile app dedicated to managing order deliveries.',
            'Real-time tracking of orders and their routing all the way to the end customer.',
          ],
          tags: ['Web', 'Mobile', 'Full Stack', 'UML'],
        },
        {
          i: '03',
          title: 'Personality Test Websites',
          role: 'Full Stack Web Developer · Freelance',
          period: '2023 – Present',
          bullets: [
            'Built personality-test websites: the user interface and the result-scoring logic.',
            'Integrated modern, responsive interfaces to optimize the overall user experience.',
          ],
          tags: ['JavaScript', 'React', 'UI/UX', 'Responsive'],
          hasLinks: true,
          links: [
            { label: 'JoJo Test', url: 'https://jojomi2o.netlify.app/' },
            { label: 'One Piece Test', url: 'https://onepiecemi2o.netlify.app/' },
          ],
        },
        {
          i: '04',
          title: 'SIARA — Smart Incident & Accident Risk Assessment',
          role: "Master's Thesis Project",
          period: '2025 – 2026',
          bullets: [
            'A real-time road-safety decision-support platform integrating machine learning, GIS, citizen reporting, and explainable AI.',
            'Cross-platform architecture: React web/mobile apps, Node.js backend services, PostgreSQL/PostGIS databases, and predictive ML services for accident-risk estimation.',
            'Risk prediction, report validation, alert management, geospatial visualization, and explainable-AI modules supporting citizens and law-enforcement agencies.',
          ],
          tags: ['React', 'React Native', 'Node.js', 'PostgreSQL', 'PostGIS', 'Machine Learning', 'LightGBM', 'SHAP', 'GIS', 'REST APIs', 'OpenStreetMap', 'Git'],
          hasLinks: true,
          links: [{ label: 'Siara Live', url: 'https://siaraalgeria.vercel.app/' }],
        },
        {
          i: '05',
          title: 'Multilingual Q&A Assistant for Course Materials',
          role: 'Deep Learning Project',
          period: '2025',
          bullets: [
            'Designing and implementing a multilingual question-answering assistant for university course materials, built with PyTorch and deep learning.',
          ],
          tags: ['PyTorch', 'Deep Learning', 'NLP', 'Q&A', 'Multilingual'],
        },
        {
          i: '06',
          title: 'Hotel Reservation System',
          role: 'Web Application · Project',
          period: '2024',
          bullets: ['A hotel booking web application: room management, availability and reservations.'],
          tags: ['JavaScript', 'Web', 'Hotel', 'Booking'],
          hasLinks: true,
          links: [{ label: 'View Code', url: 'https://github.com/mi2odev/reservation' }],
        },
        {
          i: '07',
          title: 'School Management System',
          role: 'Web Application · Project',
          period: '2024',
          bullets: ['A web application for managing students, classes and school records.'],
          tags: ['JavaScript', 'Web', 'Management'],
          hasLinks: true,
          links: [{ label: 'View Code', url: 'https://github.com/mi2odev/schoolsystem' }],
        },
        {
          i: '08',
          title: 'IoT-Based Smart Home Security System',
          role: 'Cloud & IoT Mini Project',
          period: '2025',
          bullets: [
            'Designed and implemented a smart home intrusion detection system using ESP32, PIR sensors, MQTT, and AWS Cloud services.',
            'Built a complete event-driven pipeline with AWS IoT Core, Lambda, SNS, DynamoDB, CloudWatch, and Grafana.',
            'Developed real-time intrusion monitoring, automated alerting, event storage, and dashboard visualization.',
            'Simulated IoT devices and network infrastructure using Wokwi and Cisco Packet Tracer.',
          ],
          tags: ['ESP32', 'MQTT', 'AWS IoT Core', 'Lambda', 'DynamoDB', 'SNS', 'CloudWatch', 'EC2', 'Grafana', 'Cisco Packet Tracer', 'Wokwi'],
        },
      ],
    },
    edu: {
      label: 'Education',
      heading: 'Academic background.',
      items: [
        {
          period: '2024 – Present',
          degree: "Master's — Data Science & Intelligent Systems",
          school: 'Constantine 2 University · Abdelhamid Mehri',
          modules: ['Machine Learning', 'Deep Learning', 'Big Data & NoSQL', 'Cloud & IoT', 'Optimization', 'Data Preprocessing'],
        },
        {
          period: '2021 – 2024',
          degree: "Bachelor's — Computer Science",
          school: "Larbi Ben M'Hidi University · Oum El Bouaghi",
          modules: ['Data Structures', 'OOP', 'Software Engineering', 'Operating Systems', 'Web Development', 'Advanced Databases'],
        },
        { period: '2020 – 2021', degree: 'Scientific Baccalaureate', school: 'Honors — Good', modules: [] },
      ],
    },
    contact: {
      label: 'Contact',
      heading: "Let's work together.",
      body: 'A web project, a data mission, or just want to chat? My inbox is always open.',
      cta: 'Send an email',
    },
    footer: { built: 'Designed & built by Mohamed Mehdi Zitouni', top: 'Back to top' },
    spoken: [
      { name: 'Arabic', level: 'Native', pct: 100 },
      { name: 'French', level: 'Advanced', pct: 92 },
      { name: 'English', level: 'Advanced', pct: 85 },
    ],
  },

  ar: {
    nav: { about: 'نبذة', skills: 'المهارات', work: 'الخبرة', edu: 'التعليم', contact: 'تواصل' },
    status: 'متاح — عمل حر',
    hero: {
      eyebrow: 'Full Stack · علم البيانات والذكاء الاصطناعي',
      eyebrowLabel: 'الدور',
      tagline: 'أصمّم تطبيقات ويب حديثة وحلولاً ذكية — من واجهات أمامية متقنة إلى نماذج تعلّم الآلة.',
      ctaContact: 'تواصل معي',
      ctaCV: 'تحميل السيرة الذاتية',
      loc: 'قسنطينة، الجزائر',
      role2: 'ماستر 2 · SDSI',
      name: { n1: 'محمد', n2: 'مهدي', n3: 'زيتوني' },
      locLabel: 'الموقع',
      progLabel: 'البرنامج',
    },
    about: {
      label: 'نبذة',
      heading: 'طالب ماستر 2، مطوّر full stack وشغوف بالذكاء الاصطناعي.',
      body: 'ماستر علم البيانات والأنظمة الذكية.',
      facts: [
        { k: 'الموقع', v: 'قسنطينة، الجزائر' },
        { k: 'التكوين', v: 'ماستر 2 — SDSI' },
        { k: 'التخصص', v: 'ويب · ذكاء اصطناعي / ML' },
        { k: 'الحالة', v: 'عمل حر · تربّص' },
      ],
    },
    skills: {
      label: 'المهارات',
      heading: 'المهارات التقنية وأدوات العمل اليومية.',
      cats: { fe: 'الواجهة الأمامية', be: 'الواجهة الخلفية', data: 'البيانات والذكاء', ops: 'DevOps والأدوات', cloud: 'الحوسبة السحابية و IoT' },
    },
    work: {
      label: 'الخبرة',
      heading: 'مشاريع وخبرات مختارة.',
      items: [
        {
          i: '01',
          title: 'تحليل المشاعر — مراجعات أمازون',
          role: 'مشروع تعلّم آلي · البيانات الضخمة و NoSQL',
          period: 'مارس – ماي 2025',
          bullets: [
            'تطوير نموذج قادر على تحليل وتصنيف المشاعر المعبّر عنها في مراجعات عملاء أمازون.',
            'معالجة بيانات ضخمة باستخدام PySpark و Hadoop، مع حاويات Docker لضمان قابلية النقل.',
          ],
          tags: ['Python', 'PySpark', 'Hadoop', 'Docker', 'NLP'],
        },
        {
          i: '02',
          title: 'منصة إدارة التوصيل',
          role: 'مشروع نهاية الدراسة · ليسانس',
          period: '2024',
          bullets: [
            'تصميم وتطوير تطبيق ويب وموبايل مخصّص لإدارة توصيل الطلبات.',
            'تتبّع الطلبات في الوقت الحقيقي حتى وصولها إلى العميل النهائي.',
          ],
          tags: ['Web', 'Mobile', 'Full Stack', 'UML'],
        },
        {
          i: '03',
          title: 'مواقع اختبارات الشخصية',
          role: 'مطوّر ويب Full Stack · عمل حر',
          period: '2023 – حتى الآن',
          bullets: [
            'تصميم مواقع اختبارات الشخصية: واجهة المستخدم ومنطق حساب النتائج.',
            'دمج واجهات حديثة ومتجاوبة لتحسين تجربة المستخدم.',
          ],
          tags: ['JavaScript', 'React', 'UI/UX', 'Responsive'],
          hasLinks: true,
          links: [
            { label: 'JoJo Test', url: 'https://jojomi2o.netlify.app/' },
            { label: 'One Piece Test', url: 'https://onepiecemi2o.netlify.app/' },
          ],
        },
        {
          i: '04',
          title: 'SIARA — التقييم الذكي لمخاطر الحوادث',
          role: 'مشروع مذكرة الماستر',
          period: '2025 – 2026',
          bullets: [
            'منصة دعم قرار في الوقت الحقيقي للسلامة المرورية، تدمج تعلّم الآلة ونظم المعلومات الجغرافية والإبلاغ من المواطنين والذكاء الاصطناعي القابل للتفسير.',
            'بنية متعددة المنصات: تطبيقات ويب/موبايل بـ React، خدمات خلفية بـ Node.js، قواعد بيانات PostgreSQL/PostGIS وخدمات ML تنبؤية لتقدير مخاطر الحوادث.',
            'وحدات للتنبؤ بالمخاطر، التحقق من البلاغات، إدارة التنبيهات، التصوّر الجغرافي والذكاء الاصطناعي القابل للتفسير لدعم المواطنين والجهات الأمنية.',
          ],
          tags: ['React', 'React Native', 'Node.js', 'PostgreSQL', 'PostGIS', 'Machine Learning', 'LightGBM', 'SHAP', 'GIS', 'REST APIs', 'OpenStreetMap', 'Git'],
          hasLinks: true,
          links: [{ label: 'Siara Live', url: 'https://siaraalgeria.vercel.app/' }],
        },
        {
          i: '05',
          title: 'مساعد أسئلة وأجوبة متعدد اللغات للمقررات الدراسية',
          role: 'مشروع تعلّم عميق',
          period: '2025',
          bullets: ['تصميم وتنفيذ مساعد أسئلة وأجوبة متعدد اللغات لمقررات الجامعة، مبني على PyTorch والتعلّم العميق.'],
          tags: ['PyTorch', 'Deep Learning', 'NLP', 'Q&A', 'Multilingual'],
        },
        {
          i: '06',
          title: 'نظام حجز فندقي',
          role: 'تطبيق ويب · مشروع',
          period: '2024',
          bullets: ['تطبيق ويب لحجز الفنادق: إدارة الغرف والتوفّر والحجوزات.'],
          tags: ['JavaScript', 'Web', 'Hotel', 'Booking'],
          hasLinks: true,
          links: [{ label: 'عرض الكود', url: 'https://github.com/mi2odev/reservation' }],
        },
        {
          i: '07',
          title: 'نظام إدارة مدرسية',
          role: 'تطبيق ويب · مشروع',
          period: '2024',
          bullets: ['تطبيق ويب لإدارة التلاميذ والأقسام والبيانات المدرسية.'],
          tags: ['JavaScript', 'Web', 'Management'],
          hasLinks: true,
          links: [{ label: 'عرض الكود', url: 'https://github.com/mi2odev/schoolsystem' }],
        },
        {
          i: '08',
          title: 'نظام أمن منزلي ذكي قائم على إنترنت الأشياء',
          role: 'مشروع مصغّر · الحوسبة السحابية و IoT',
          period: '2025',
          bullets: [
            'تصميم وتنفيذ نظام كشف تسلّل للمنزل الذكي باستخدام ESP32 وحسّاسات PIR و MQTT وخدمات AWS السحابية.',
            'بناء خط معالجة كامل قائم على الأحداث باستخدام AWS IoT Core و Lambda و SNS و DynamoDB و CloudWatch و Grafana.',
            'تطوير مراقبة التسلّل في الوقت الحقيقي، التنبيهات الآلية، تخزين الأحداث والتصوّر عبر لوحات المعلومات.',
            'محاكاة أجهزة إنترنت الأشياء والبنية الشبكية باستخدام Wokwi و Cisco Packet Tracer.',
          ],
          tags: ['ESP32', 'MQTT', 'AWS IoT Core', 'Lambda', 'DynamoDB', 'SNS', 'CloudWatch', 'EC2', 'Grafana', 'Cisco Packet Tracer', 'Wokwi'],
        },
      ],
    },
    edu: {
      label: 'التعليم',
      heading: 'المسار الأكاديمي.',
      items: [
        {
          period: '2024 – حتى الآن',
          degree: 'ماستر — علم البيانات والأنظمة الذكية',
          school: 'جامعة قسنطينة 2 · عبد الحميد مهري',
          modules: ['تعلّم الآلة', 'التعلّم العميق', 'البيانات الضخمة و NoSQL', 'الحوسبة السحابية و IoT', 'الأمثلة', 'معالجة البيانات'],
        },
        {
          period: '2021 – 2024',
          degree: 'ليسانس — إعلام آلي',
          school: 'جامعة العربي بن مهيدي · أم البواقي',
          modules: ['هياكل البيانات', 'البرمجة الكائنية', 'هندسة البرمجيات', 'أنظمة التشغيل', 'تطوير الويب', 'قواعد البيانات المتقدّمة'],
        },
        { period: '2020 – 2021', degree: 'بكالوريا علوم تجريبية', school: 'بتقدير حسن', modules: [] },
      ],
    },
    contact: {
      label: 'تواصل',
      heading: 'لنعمل معاً.',
      body: 'مشروع ويب، مهمة بيانات، أو فقط رغبة في الحديث؟ بريدي مفتوح دائماً.',
      cta: 'إرسال بريد',
    },
    footer: { built: 'صُمّم وطُوّر بواسطة محمد مهدي زيتوني', top: 'العودة للأعلى' },
    spoken: [
      { name: 'العربية', level: 'لغة أم', pct: 100 },
      { name: 'الفرنسية', level: 'متقدّم', pct: 92 },
      { name: 'الإنجليزية', level: 'متقدّم', pct: 85 },
    ],
  },
};

export function skillGroups(t: Content) {
  return [
    { i: '01', label: t.skills.cats.fe, chips: SKILL_CHIPS.fe },
    { i: '02', label: t.skills.cats.be, chips: SKILL_CHIPS.be },
    { i: '03', label: t.skills.cats.data, chips: SKILL_CHIPS.data },
    { i: '04', label: t.skills.cats.ops, chips: SKILL_CHIPS.ops },
    { i: '05', label: t.skills.cats.cloud, chips: SKILL_CHIPS.cloud },
  ];
}
