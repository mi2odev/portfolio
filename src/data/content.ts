// ─────────────────────────────────────────────────────────────────────────
// Shared content for every portfolio version (V1–V6).
// All six designs render from this single source of truth.
// FR / EN / AR. (V1 Terminal only exposes FR + EN; the others add AR + RTL.)
// Mirrors the CV: CV_Mohamed_Mehdi_ZITOUNI.pdf
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
  site: 'https://mohamedmehdi-zitouni.netlify.app',
  instagram: 'https://www.instagram.com/_.mi2o/',
  facebook: 'https://www.facebook.com/Mohamed.mehdi.zitouni?locale=fr_FR',
  cvHref: '/CV_Mohamed_Mehdi_ZITOUNI.pdf',
  photo: '/photo.png',
  year: '2026',
} as const;

// ── Skill chips (language-independent) ────────────────────────────────────
export const SKILL_CHIPS = {
  fe: ['HTML5', 'CSS3', 'JavaScript', 'TypeScript', 'React', 'Vue.js', 'Tailwind CSS'],
  be: ['PHP (Laravel)', 'Python (Django)', 'Spring Boot', 'Node.js / Express', 'MySQL', 'PostgreSQL / PostGIS'],
  data: ['Python', 'Pandas', 'Scikit-learn', 'LightGBM', 'SHAP', 'Spark (PySpark)', 'Hadoop'],
  ops: ['Docker', 'Git & GitHub', 'Linux', 'UML', 'Vite'],
  cloud: ['AWS IoT Core', 'AWS Lambda', 'DynamoDB', 'SNS', 'CloudWatch', 'EC2', 'MQTT', 'ESP32', 'Grafana'],
} as const;

export const TECH_MARQUEE = [
  'React', 'React Native', 'TypeScript', 'Python', 'Docker', 'PySpark', 'Vue.js',
  'Laravel', 'Django', 'Spring Boot', 'Node.js', 'PostgreSQL', 'Hadoop', 'Tailwind',
] as const;

// ── Localised content ─────────────────────────────────────────────────────
export const CONTENT: Record<Lang, Content> = {
  fr: {
    nav: { about: 'À propos', skills: 'Compétences', work: 'Expérience', edu: 'Formation', contact: 'Contact' },
    status: 'Disponible — Freelance',
    hero: {
      eyebrow: 'Développeur Full-Stack · Data Science & IA',
      eyebrowLabel: 'Rôle',
      tagline:
        'Je conçois et je livre des sites et applications web responsives de bout en bout — du front-end soigné jusqu’aux modèles de machine learning.',
      ctaContact: 'Me contacter',
      ctaCV: 'Télécharger le CV',
      loc: 'Constantine, Algérie',
      role2: 'Master · SDSI',
      name: { n1: 'Mohamed', n2: 'Mehdi', n3: 'Zitouni' },
      locLabel: 'Localisation',
      progLabel: 'Programme',
    },
    about: {
      label: 'À propos',
      heading: 'Développeur web full-stack, freelance depuis 2023, passionné de data et d’IA.',
      body:
        'À l’aise sur toute la stack — du front React, Vue.js et TypeScript aux back-ends PHP (Laravel), Django et Spring Boot — avec une expérience concrète en machine learning et Big Data (scikit-learn, PySpark, Hadoop). Titulaire d’un Master en Sciences des Données & Systèmes Intelligents (SDSI).',
      facts: [
        { k: 'Localisation', v: 'Constantine, DZ' },
        { k: 'Formation', v: 'Master — SDSI' },
        { k: 'Focus', v: 'Web · IA / ML' },
        { k: 'Statut', v: 'Freelance · Disponible' },
      ],
    },
    skills: {
      label: 'Compétences',
      heading: 'Stack technique & outils du quotidien.',
      cats: { fe: 'Front-end', be: 'Back-end & Bases de données', data: 'ML & Data', ops: 'DevOps & Outils', cloud: 'Cloud & IoT' },
    },
    work: {
      label: 'Expérience',
      heading: 'Projets & expériences sélectionnés.',
      items: [
        {
          i: '01',
          title: 'SIARA — Plateforme d’intelligence pour la sécurité routière',
          role: 'Développeur Full-Stack & ML',
          period: '2025',
          bullets: [
            'Co-conception et développement d’une plateforme multi-rôles en production qui prédit le risque d’accident et diffuse des alertes de danger en temps réel à travers l’Algérie — application web React, application mobile React Native, API Node.js et microservice ML Python.',
            'Entraînement et déploiement de trois familles de modèles : un modèle RandomForest de risque conducteur avec explications SHAP, un modèle LightGBM de sévérité des zones dangereuses et un validateur d’anomalies/spam pour les signalements citoyens.',
            'Intégration d’un LLM qui traduit les sorties des modèles en explications de risque en langage clair ; authentification JWT par rôles, requêtes géospatiales PostGIS, notifications temps réel et push mobile.',
          ],
          tags: ['React', 'React Native (Expo)', 'Node.js/Express', 'PostgreSQL + PostGIS', 'Python/Flask', 'Scikit-learn', 'LightGBM', 'SHAP', 'Socket.IO', 'Docker'],
          hasLinks: true,
          links: [{ label: 'Siara Live', url: 'https://siaraalgeria.vercel.app/' }],
        },
        {
          i: '02',
          title: 'Analyse de sentiments — Avis Amazon',
          role: 'Machine Learning · Big Data & NoSQL',
          period: 'Mars – Mai 2025',
          bullets: [
            'Développement d’un modèle capable d’analyser et de classifier les sentiments exprimés dans les avis clients Amazon.',
            'Prétraitement et traitement de données d’avis à grande échelle avec des technologies Big Data telles que PySpark et Hadoop.',
            'Conteneurisation complète du système avec Docker pour garantir la portabilité et simplifier le déploiement.',
          ],
          tags: ['Python', 'PySpark', 'Hadoop', 'Docker', 'NLP'],
        },
        {
          i: '03',
          title: 'Application web & mobile de gestion de livraison',
          role: 'Projet de fin d’études (Licence)',
          period: '2024',
          bullets: [
            'Conception et développement d’une application web et mobile dédiée à la gestion de la livraison des commandes.',
            'Mise en place de la gestion et du suivi des commandes, de leur passation jusqu’à la livraison au client.',
          ],
          tags: ['Web', 'Mobile', 'Full-Stack', 'UML'],
        },
        {
          i: '04',
          title: 'Développeur web full-stack freelance',
          role: 'Applications web & mobiles',
          period: '2023 – Présent',
          bullets: [
            'Conception et livraison d’applications web et mobiles responsives de bout en bout. Projets sélectionnés (github.com/mi2odev) :',
            'One Piece Personality Test — site de test de personnalité sur le thème de l’anime.',
            'JoJo Personality Test — quiz de personnalité interactif.',
            'Hotel Booking App — plateforme de réservation d’hôtel multilingue (EN / FR / AR).',
            'Subscription Watch — application mobile de suivi des abonnements et périodes d’essai.',
            'School System — application web de gestion scolaire.',
            'Salary Sort — application de tri et de gestion des salaires.',
          ],
          tags: ['React', 'React Native (Expo)', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'Vite'],
          hasLinks: true,
          links: [
            { label: 'One Piece Test', url: 'https://onepiecemi2o.netlify.app/' },
            { label: 'JoJo Test', url: 'https://jojomi2o.netlify.app/' },
            { label: 'Hotel Booking', url: 'https://github.com/mi2odev/reservation' },
            { label: 'School System', url: 'https://github.com/mi2odev/schoolsystem' },
            { label: 'GitHub', url: 'https://github.com/mi2odev' },
          ],
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
          period: '2024 – 2026',
          degree: 'Master — Sciences des Données & Systèmes Intelligents (SDSI)',
          school: 'Université Constantine 2 · Abdelhamid Mehri',
          modules: ['Machine Learning', 'Deep Learning', 'Big Data & NoSQL', 'Cloud & IoT', 'Techniques d’optimisation', 'Prétraitement des données'],
        },
        {
          period: '2021 – 2024',
          degree: 'Licence — Informatique',
          school: 'Université Larbi Ben M’Hidi · Oum El Bouaghi',
          modules: ['Structures de données & algorithmes', 'POO', 'Développement d’applications web', 'Génie logiciel', 'Systèmes d’exploitation', 'Architecture des ordinateurs', 'Réseaux', 'Bases de données avancées'],
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
      { name: 'Français', level: 'Intermédiaire supérieur', pct: 78 },
      { name: 'Anglais', level: 'Intermédiaire supérieur', pct: 75 },
    ],
  },

  en: {
    nav: { about: 'About', skills: 'Skills', work: 'Work', edu: 'Education', contact: 'Contact' },
    status: 'Available — Freelance',
    hero: {
      eyebrow: 'Full-Stack Developer · Data Science & AI',
      eyebrowLabel: 'Role',
      tagline:
        'I design and ship responsive websites and web apps end to end — from polished front-ends to machine-learning models.',
      ctaContact: 'Get in touch',
      ctaCV: 'Download CV',
      loc: 'Constantine, Algeria',
      role2: 'MSc · SDSI',
      name: { n1: 'Mohamed', n2: 'Mehdi', n3: 'Zitouni' },
      locLabel: 'Location',
      progLabel: 'Program',
    },
    about: {
      label: 'About',
      heading: 'Full-stack web developer, freelancing since 2023, with a foot in data and AI.',
      body:
        'Comfortable across the stack — from React, Vue.js and TypeScript front ends to PHP (Laravel), Django and Spring Boot back ends — with hands-on ML and Big Data project experience (scikit-learn, PySpark, Hadoop). Holds an MSc in Data Science & Intelligent Systems (SDSI).',
      facts: [
        { k: 'Location', v: 'Constantine, DZ' },
        { k: 'Education', v: 'MSc — SDSI' },
        { k: 'Focus', v: 'Web · AI / ML' },
        { k: 'Status', v: 'Freelance · Available' },
      ],
    },
    skills: {
      label: 'Skills',
      heading: 'Tech stack & everyday tools.',
      cats: { fe: 'Front-end', be: 'Back-end & Databases', data: 'ML & Data', ops: 'DevOps & Tools', cloud: 'Cloud & IoT' },
    },
    work: {
      label: 'Work',
      heading: 'Selected projects & experience.',
      items: [
        {
          i: '01',
          title: 'SIARA — Road-Safety Intelligence Platform',
          role: 'Full-Stack & ML Developer',
          period: '2025',
          bullets: [
            'Co-designed and built a production, multi-role platform that predicts road-accident risk and streams real-time hazard alerts across Algeria — spanning a React web app, a React Native mobile app, a Node.js API and a Python ML microservice.',
            'Trained and deployed three ML model families: a RandomForest driver-risk model with SHAP explanations, a LightGBM danger-zone severity model and an anomaly/spam validator for crowdsourced incident reports.',
            'Integrated an LLM that turns model output into plain-language risk explanations; implemented JWT role-based auth, PostGIS geospatial queries, real-time notifications and mobile push.',
          ],
          tags: ['React', 'React Native (Expo)', 'Node.js/Express', 'PostgreSQL + PostGIS', 'Python/Flask', 'Scikit-learn', 'LightGBM', 'SHAP', 'Socket.IO', 'Docker'],
          hasLinks: true,
          links: [{ label: 'Siara Live', url: 'https://siaraalgeria.vercel.app/' }],
        },
        {
          i: '02',
          title: 'Amazon Reviews Sentiment Analysis',
          role: 'Machine Learning · Big Data & NoSQL',
          period: 'Mar – May 2025',
          bullets: [
            'Developed a model able to analyse and classify the sentiment expressed in Amazon customer reviews.',
            'Pre-processed and handled large-scale review data using Big Data technologies such as PySpark and Hadoop.',
            'Containerised the whole system with Docker to guarantee portability and simplify deployment.',
          ],
          tags: ['Python', 'PySpark', 'Hadoop', 'Docker', 'NLP'],
        },
        {
          i: '03',
          title: 'Delivery Management Web & Mobile Application',
          role: 'Final-Year Project (BSc)',
          period: '2024',
          bullets: [
            'Designed and developed a web and mobile application dedicated to managing order deliveries.',
            'Implemented order management and tracking, from placement through to delivery to the customer.',
          ],
          tags: ['Web', 'Mobile', 'Full-Stack', 'UML'],
        },
        {
          i: '04',
          title: 'Freelance Full-Stack Web Developer',
          role: 'Web & Mobile Apps',
          period: '2023 – Present',
          bullets: [
            'Designed and shipped responsive web and mobile apps end to end. Selected projects (github.com/mi2odev):',
            'One Piece Personality Test — anime-themed personality-quiz website.',
            'JoJo Personality Test — interactive anime personality quiz.',
            'Hotel Booking App — multilingual (EN / FR / AR) hotel booking platform.',
            'Subscription Watch — mobile subscription & free-trial tracker.',
            'School System — school management web application.',
            'Salary Sort — salary sorting and management app.',
          ],
          tags: ['React', 'React Native (Expo)', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'Vite'],
          hasLinks: true,
          links: [
            { label: 'One Piece Test', url: 'https://onepiecemi2o.netlify.app/' },
            { label: 'JoJo Test', url: 'https://jojomi2o.netlify.app/' },
            { label: 'Hotel Booking', url: 'https://github.com/mi2odev/reservation' },
            { label: 'School System', url: 'https://github.com/mi2odev/schoolsystem' },
            { label: 'GitHub', url: 'https://github.com/mi2odev' },
          ],
        },
        {
          i: '05',
          title: 'Multilingual Q&A Assistant for Course Materials',
          role: 'Deep Learning Project',
          period: '2025',
          bullets: [
            'Designed and implemented a multilingual question-answering assistant for university course materials, built with PyTorch and deep learning.',
          ],
          tags: ['PyTorch', 'Deep Learning', 'NLP', 'Q&A', 'Multilingual'],
        },
        {
          i: '06',
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
          period: '2024 – 2026',
          degree: 'MSc — Data Science & Intelligent Systems (SDSI)',
          school: 'University of Constantine 2 · Abdelhamid Mehri',
          modules: ['Machine Learning', 'Deep Learning', 'Big Data & NoSQL', 'Cloud Computing & IoT', 'Optimisation Techniques', 'Data Pre-processing'],
        },
        {
          period: '2021 – 2024',
          degree: 'BSc — Computer Science',
          school: "University Larbi Ben M'Hidi · Oum El Bouaghi",
          modules: ['Data Structures & Algorithms', 'OOP', 'Web Application Development', 'Software Engineering', 'Operating Systems', 'Computer Architecture', 'Networks', 'Advanced Databases'],
        },
        { period: '2020 – 2021', degree: 'Baccalauréat Scientifique', school: 'Mention Assez Bien', modules: [] },
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
      { name: 'French', level: 'Upper-Intermediate', pct: 78 },
      { name: 'English', level: 'Upper-Intermediate', pct: 75 },
    ],
  },

  ar: {
    nav: { about: 'نبذة', skills: 'المهارات', work: 'الخبرة', edu: 'التعليم', contact: 'تواصل' },
    status: 'متاح — عمل حر',
    hero: {
      eyebrow: 'مطوّر Full-Stack · علم البيانات والذكاء الاصطناعي',
      eyebrowLabel: 'الدور',
      tagline: 'أصمّم وأطلق مواقع وتطبيقات ويب متجاوبة من الألف إلى الياء — من واجهات أمامية متقنة إلى نماذج تعلّم الآلة.',
      ctaContact: 'تواصل معي',
      ctaCV: 'تحميل السيرة الذاتية',
      loc: 'قسنطينة، الجزائر',
      role2: 'ماستر · SDSI',
      name: { n1: 'محمد', n2: 'مهدي', n3: 'زيتوني' },
      locLabel: 'الموقع',
      progLabel: 'البرنامج',
    },
    about: {
      label: 'نبذة',
      heading: 'مطوّر ويب full-stack، أعمل بشكل حر منذ 2023، مع اهتمام بالبيانات والذكاء الاصطناعي.',
      body:
        'أعمل على كامل الستاك — من واجهات React و Vue.js و TypeScript إلى واجهات خلفية بـ PHP (Laravel) و Django و Spring Boot — مع خبرة عملية في مشاريع تعلّم الآلة والبيانات الضخمة (scikit-learn و PySpark و Hadoop). حاصل على ماستر في علم البيانات والأنظمة الذكية (SDSI).',
      facts: [
        { k: 'الموقع', v: 'قسنطينة، الجزائر' },
        { k: 'التكوين', v: 'ماستر — SDSI' },
        { k: 'التخصص', v: 'ويب · ذكاء اصطناعي / ML' },
        { k: 'الحالة', v: 'عمل حر · متاح' },
      ],
    },
    skills: {
      label: 'المهارات',
      heading: 'المهارات التقنية وأدوات العمل اليومية.',
      cats: { fe: 'الواجهة الأمامية', be: 'الواجهة الخلفية وقواعد البيانات', data: 'تعلّم الآلة والبيانات', ops: 'DevOps والأدوات', cloud: 'الحوسبة السحابية و IoT' },
    },
    work: {
      label: 'الخبرة',
      heading: 'مشاريع وخبرات مختارة.',
      items: [
        {
          i: '01',
          title: 'SIARA — منصة ذكاء للسلامة المرورية',
          role: 'مطوّر Full-Stack وتعلّم آلي',
          period: '2025',
          bullets: [
            'المشاركة في تصميم وبناء منصة إنتاجية متعددة الأدوار تتنبّأ بمخاطر حوادث الطرق وتبثّ تنبيهات خطر في الوقت الحقيقي عبر الجزائر — تطبيق ويب بـ React، تطبيق موبايل بـ React Native، واجهة برمجية بـ Node.js وخدمة مصغّرة لتعلّم الآلة بـ Python.',
            'تدريب ونشر ثلاث عائلات من النماذج: نموذج RandomForest لمخاطر السائق مع تفسيرات SHAP، نموذج LightGBM لشدّة المناطق الخطرة، ومدقّق للشذوذ والرسائل المزعجة في بلاغات المواطنين.',
            'دمج نموذج لغوي كبير يحوّل مخرجات النماذج إلى تفسيرات مخاطر بلغة بسيطة؛ مع مصادقة JWT حسب الأدوار، استعلامات جغرافية PostGIS، إشعارات فورية ودفع للموبايل.',
          ],
          tags: ['React', 'React Native (Expo)', 'Node.js/Express', 'PostgreSQL + PostGIS', 'Python/Flask', 'Scikit-learn', 'LightGBM', 'SHAP', 'Socket.IO', 'Docker'],
          hasLinks: true,
          links: [{ label: 'Siara Live', url: 'https://siaraalgeria.vercel.app/' }],
        },
        {
          i: '02',
          title: 'تحليل المشاعر — مراجعات أمازون',
          role: 'تعلّم آلي · البيانات الضخمة و NoSQL',
          period: 'مارس – ماي 2025',
          bullets: [
            'تطوير نموذج قادر على تحليل وتصنيف المشاعر المعبّر عنها في مراجعات عملاء أمازون.',
            'معالجة أوّلية لبيانات مراجعات ضخمة باستخدام تقنيات البيانات الضخمة مثل PySpark و Hadoop.',
            'وضع النظام بالكامل في حاويات Docker لضمان قابلية النقل وتبسيط النشر.',
          ],
          tags: ['Python', 'PySpark', 'Hadoop', 'Docker', 'NLP'],
        },
        {
          i: '03',
          title: 'تطبيق ويب وموبايل لإدارة التوصيل',
          role: 'مشروع نهاية الدراسة (ليسانس)',
          period: '2024',
          bullets: [
            'تصميم وتطوير تطبيق ويب وموبايل مخصّص لإدارة توصيل الطلبات.',
            'تنفيذ إدارة وتتبّع الطلبات، من لحظة الطلب حتى تسليمها إلى العميل.',
          ],
          tags: ['Web', 'Mobile', 'Full-Stack', 'UML'],
        },
        {
          i: '04',
          title: 'مطوّر ويب Full-Stack بشكل حر',
          role: 'تطبيقات ويب وموبايل',
          period: '2023 – حتى الآن',
          bullets: [
            'تصميم وإطلاق تطبيقات ويب وموبايل متجاوبة من الألف إلى الياء. مشاريع مختارة (github.com/mi2odev):',
            'One Piece Personality Test — موقع اختبار شخصية بطابع الأنمي.',
            'JoJo Personality Test — اختبار شخصية تفاعلي.',
            'Hotel Booking App — منصة حجز فنادق متعدّدة اللغات (EN / FR / AR).',
            'Subscription Watch — تطبيق موبايل لتتبّع الاشتراكات والفترات المجانية.',
            'School System — تطبيق ويب لإدارة المدارس.',
            'Salary Sort — تطبيق لفرز وإدارة الرواتب.',
          ],
          tags: ['React', 'React Native (Expo)', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'Vite'],
          hasLinks: true,
          links: [
            { label: 'One Piece Test', url: 'https://onepiecemi2o.netlify.app/' },
            { label: 'JoJo Test', url: 'https://jojomi2o.netlify.app/' },
            { label: 'Hotel Booking', url: 'https://github.com/mi2odev/reservation' },
            { label: 'School System', url: 'https://github.com/mi2odev/schoolsystem' },
            { label: 'GitHub', url: 'https://github.com/mi2odev' },
          ],
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
          period: '2024 – 2026',
          degree: 'ماستر — علم البيانات والأنظمة الذكية (SDSI)',
          school: 'جامعة قسنطينة 2 · عبد الحميد مهري',
          modules: ['تعلّم الآلة', 'التعلّم العميق', 'البيانات الضخمة و NoSQL', 'الحوسبة السحابية و IoT', 'تقنيات الأمثلة', 'معالجة البيانات'],
        },
        {
          period: '2021 – 2024',
          degree: 'ليسانس — إعلام آلي',
          school: 'جامعة العربي بن مهيدي · أم البواقي',
          modules: ['هياكل البيانات والخوارزميات', 'البرمجة الكائنية', 'تطوير تطبيقات الويب', 'هندسة البرمجيات', 'أنظمة التشغيل', 'بنية الحاسوب', 'الشبكات', 'قواعد البيانات المتقدّمة'],
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
      { name: 'الفرنسية', level: 'فوق المتوسط', pct: 78 },
      { name: 'الإنجليزية', level: 'فوق المتوسط', pct: 75 },
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
