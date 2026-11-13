// ─────────────────────────────────────────────────────────────────────────
// Projects shown in the "work" section of every design.
// What never changes with the language (cover, stack, links) lives in BASE;
// the words live in TEXT, one block per language. buildProjects() joins them.
// Covers are real captures of each project, stored in public/projects/.
// ─────────────────────────────────────────────────────────────────────────
import type { Experience, Lang } from './content';

type Localised = Record<Lang, string>;

interface BaseLink {
  label: string | Localised;
  url: string;
}
interface BaseProject {
  /** Stable id: names the cover file and keys the translations. */
  id: string;
  /** Extra screens beyond the cover; omitted when the cover is all there is. */
  shots?: number;
  tags: string[];
  links?: BaseLink[];
}
interface ProjectText {
  title: string;
  role: string;
  period: string;
  bullets: string[];
}

const LIVE: Localised = { fr: 'Voir le site', en: 'Live site', ar: 'زيارة الموقع' };
const CODE: Localised = { fr: 'Voir le code', en: 'View code', ar: 'عرض الكود' };
const gh = (repo: string): BaseLink => ({ label: CODE, url: `https://github.com/mi2odev/${repo}` });

/**
 * Display order = array order: most important first.
 * `shots` is how many extra screens sit in public/projects/<id>/ (1.webp, 2.webp…).
 */
const BASE: BaseProject[] = [
  {
    id: 'siara',
    shots: 3,
    tags: [
      'React',
      'React Native',
      'Node.js',
      'PostgreSQL',
      'PostGIS',
      'LightGBM',
      'SHAP',
      'Socket.IO',
      'Leaflet',
    ],
    links: [{ label: 'Siara Live', url: 'https://siaraalgeria.vercel.app/' }, gh('siara')],
  },
  {
    id: 'gaming-center',
    shots: 4,
    tags: ['C#', '.NET 10', 'WPF', 'MVVM', 'EF Core', 'SQLite'],
    links: [gh('Gaming-Center-Management')],
  },
  {
    id: 'tutoring-center',
    shots: 6,
    tags: ['C#', '.NET 10', 'WPF', 'EF Core', 'SQLite', 'Excel export'],
    links: [gh('ecoleprive')],
  },
  {
    id: 'subscription-watch',
    shots: 3,
    tags: ['React Native', 'Expo', 'TypeScript', 'Zustand', 'Notifications'],
    links: [gh('subscription-watch-')],
  },
  {
    id: 'weighpoint',
    shots: 4,
    tags: ['React Native', 'Expo', 'TypeScript', 'AsyncStorage', 'Charts'],
    links: [gh('weight-tracker')],
  },
  {
    id: 'e-card',
    shots: 4,
    tags: ['React Native', 'Expo', 'TypeScript', 'Reanimated', 'Zustand', 'Wi-Fi'],
    links: [gh('e-card')],
  },
  {
    id: 'personality-tests',
    shots: 6,
    tags: ['React', 'TypeScript', 'Tailwind', 'Framer Motion', 'GSAP', 'Recharts'],
    links: [
      { label: 'JoJo Test', url: 'https://jojomi2o.netlify.app/' },
      { label: 'One Piece Test', url: 'https://onepiecemi2o.netlify.app/' },
      gh('jojo'),
    ],
  },
  { id: 'sentiment', tags: ['Python', 'PySpark', 'Hadoop', 'Docker', 'NLP'] },
  {
    id: 'iot-security',
    tags: ['ESP32', 'MQTT', 'AWS IoT Core', 'Lambda', 'DynamoDB', 'SNS', 'CloudWatch', 'Grafana', 'Wokwi'],
  },
  { id: 'qa-assistant', tags: ['PyTorch', 'Deep Learning', 'NLP', 'Q&A'] },
  {
    id: 'last-signal',
    shots: 2,
    tags: ['React', 'Vite', 'Canvas', 'Node.js', 'Express', 'PostgreSQL'],
    links: [{ label: LIVE, url: 'https://the-last-signal.netlify.app/' }, gh('the-last-signal')],
  },
  {
    id: 'client-portfolio',
    shots: 3,
    tags: ['React', 'Vite', 'Prerendering', 'SEO', 'WebP'],
    links: [{ label: LIVE, url: 'https://mohcene-meradji.netlify.app/' }, gh('mohsenportfolio')],
  },
  {
    id: 'imposter',
    shots: 4,
    tags: ['React Native', 'Expo', 'JavaScript', 'Offline'],
    links: [gh('the-imposter')],
  },
  { id: 'delivery', tags: ['Web', 'Mobile', 'Full Stack', 'UML'] },
  {
    id: 'hotel',
    shots: 3,
    tags: ['React', 'Tailwind', 'i18n', 'RTL', 'PDF'],
    links: [gh('reservation')],
  },
  {
    id: 'school',
    shots: 2,
    tags: ['React', 'React Router', 'Material UI', 'Tailwind'],
    links: [gh('schoolsystem')],
  },
];

const TEXT: Record<Lang, Record<string, ProjectText>> = {
  fr: {
    siara: {
      title: 'SIARA — Évaluation intelligente du risque d’accidents',
      role: 'Projet de mémoire de Master',
      period: '2025 – 2026',
      bullets: [
        'Plateforme temps réel d’aide à la décision pour la sécurité routière : signalement citoyen, cartes de zones dangereuses, modèles de risque et IA explicable.',
        'Applications web et mobile React, API Node.js / Express, PostgreSQL + PostGIS, alertes temps réel avec Socket.IO, interface en français, anglais et arabe (RTL).',
        'Module police : zone de travail par wilaya et commune, incidents à moins de 500 m, vérification, affectation et historique des opérations.',
      ],
    },
    sentiment: {
      title: 'Analyse de sentiments — Avis Amazon',
      role: 'Projet Machine Learning · Big Data & NoSQL',
      period: 'Mars – Mai 2025',
      bullets: [
        'Développement d’un modèle capable d’analyser et de classifier les sentiments exprimés dans les avis clients Amazon.',
        'Traitement de données massives avec PySpark et Hadoop, le tout conteneurisé sous Docker pour la portabilité.',
      ],
    },
    'iot-security': {
      title: 'Système de sécurité domotique basé sur l’IoT',
      role: 'Mini-projet Cloud & IoT',
      period: '2025',
      bullets: [
        'Système de détection d’intrusion pour maison connectée avec ESP32, capteurs PIR, MQTT et services AWS.',
        'Pipeline événementiel complet : AWS IoT Core, Lambda, SNS, DynamoDB, CloudWatch et Grafana — alertes automatiques, stockage des événements et dashboard.',
        'Dispositifs et réseau simulés avec Wokwi et Cisco Packet Tracer.',
      ],
    },
    'qa-assistant': {
      title: 'Assistant Q&R multilingue pour supports de cours',
      role: 'Projet Deep Learning',
      period: '2025',
      bullets: [
        'Conception et implémentation d’un assistant de questions-réponses multilingue pour les supports de cours universitaires, basé sur PyTorch et le deep learning.',
      ],
    },
    'personality-tests': {
      title: 'Tests de personnalité JoJo & One Piece',
      role: 'Développeur Web Full Stack · Freelance',
      period: '2023 – Présent',
      bullets: [
        'Deux quiz animés qui associent le visiteur à un personnage : intro cinématique, questions notées, graphique radar des traits et carte de résultat à partager avec QR code.',
        'Scènes animées (Framer Motion, GSAP), logique de score dédiée, anglais et arabe (RTL), entièrement responsive.',
      ],
    },
    'subscription-watch': {
      title: 'Subscription Watch — suivi d’abonnements',
      role: 'Application mobile · Projet personnel',
      period: '2026',
      bullets: [
        'Application mobile local-first qui suit les abonnements et les essais gratuits, et prévient avant chaque prélèvement.',
        'Tableau de bord avec total mensuel et annuel, échéances des 30 prochains jours, analyses par catégorie et lignes à glisser pour modifier ou supprimer.',
        'Rappels par notifications locales, replanifiés à chaque changement ; thème clair / sombre.',
      ],
    },
    'gaming-center': {
      title: 'mi2o Gaming Center — gestion & caisse',
      role: 'Application de bureau Windows',
      period: '2026',
      bullets: [
        'Logiciel de gestion pour salle de jeux : postes (PS4, PS5, PC, Xbox…), sessions chronométrées, ventes de produits, factures et paiements.',
        'Entièrement hors ligne sur un seul PC : base SQLite, sauvegardes automatiques, rapports, comptes administrateur et opérateur.',
        'Architecture MVVM en C# / .NET 10 avec WPF et Entity Framework Core.',
      ],
    },
    'tutoring-center': {
      title: 'Centre de soutien — gestion d’école privée',
      role: 'Application de bureau · Projet client',
      period: '2026',
      bullets: [
        'Application de bureau pour le gérant d’un centre de cours de soutien : élèves, parents, enseignants, groupes, salles et emploi du temps.',
        'Présences, notes et examens, paiements par packs de séances avec reçus imprimés, rémunération des enseignants, dépenses et bénéfice estimé.',
        'Fonctionne en local sans serveur, interface en français, montants en DZD, export Excel.',
      ],
    },
    weighpoint: {
      title: 'Weighpoint — suivi de perte de poids',
      role: 'Application mobile · Projet personnel',
      period: '2026',
      bullets: [
        'Application de suivi : pesée quotidienne, habitudes, objectifs, mensurations et photos de progression — toutes les données restent sur l’appareil.',
        'Courbes de tendance, barres de perte hebdomadaire, carte de chaleur des habitudes, projections et date d’objectif estimée.',
        'Export CSV, sauvegarde et restauration, verrouillage de l’app ; 377 tests sur les calculs, unités et règles de rappel.',
      ],
    },
    'e-card': {
      title: 'E-Card — jeu de cartes de bluff à deux',
      role: 'Jeu mobile · Projet personnel',
      period: '2026',
      bullets: [
        'Jeu de bluff pour deux joueurs : Empereur, Citoyen, Esclave, avec mises et bourse à gérer sur douze manches.',
        'Se joue sur un seul téléphone ou sur deux téléphones en Wi-Fi ; l’hôte arbitre la partie et n’envoie jamais la main cachée de l’adversaire.',
        'Reprise après déconnexion et suite d’auto-tests couvrant les règles, l’argent et une partie en ligne complète.',
      ],
    },
    imposter: {
      title: 'Imposter — jeu de société sur téléphone',
      role: 'Jeu mobile · Projet personnel',
      period: '2026',
      bullets: [
        'Jeu de mots à plusieurs où l’on se passe le téléphone : tout le monde reçoit le mot secret, sauf l’imposteur qui doit bluffer.',
        '100 % hors ligne : banque de mots embarquée par catégories, minuteur de discussion, vote, scores et confettis.',
      ],
    },
    'last-signal': {
      title: 'The Last Signal — jeu de dactylographie sci-fi',
      role: 'Jeu web · Projet personnel',
      period: '2026',
      bullets: [
        'Jeu de frappe narratif : retaper les transmissions pour rétablir le signal, avec vitesse, précision et combo mesurés en direct.',
        'Missions scénarisées à difficulté croissante, classement et statistiques servis par une API Express + PostgreSQL, fond étoilé et globe animés sur canvas.',
      ],
    },
    'client-portfolio': {
      title: 'Portfolio pour un ingénieur en bioprocédés',
      role: 'Projet client · Freelance',
      period: '2026',
      bullets: [
        'Portfolio d’une page réalisé pour un client : parcours, grille d’expertises, schéma interactif d’un bioprocédé et carte de contact.',
        'Page prérendue au build puis hydratée : le premier affichage médian passe de 1,09 s à 0,84 s sur mobile bridé, et le poids de 352 kB à 228 kB.',
      ],
    },
    delivery: {
      title: 'Plateforme de gestion de livraison',
      role: 'Projet de fin d’études · Licence',
      period: '2024',
      bullets: [
        'Conception et développement d’une application web et mobile dédiée à la gestion de la livraison des commandes.',
        'Suivi en temps réel des commandes et de leur acheminement jusqu’au client final.',
      ],
    },
    hotel: {
      title: 'Système de réservation d’hôtel',
      role: 'Application web · Projet',
      period: '2024',
      bullets: [
        'Application de réservation d’hôtel : recherche et filtres, détails des chambres, réservations et téléchargement du reçu en PDF.',
        'Trois langues (français, anglais, arabe RTL), mode sombre et authentification.',
      ],
    },
    school: {
      title: 'Système de gestion scolaire',
      role: 'Application web · Projet',
      period: '2024',
      bullets: [
        'Application de gestion des étudiants : inscription, moyennes par semestre, spécialités et classement des vœux.',
        'Données conservées dans le navigateur, sans back-end.',
      ],
    },
  },

  en: {
    siara: {
      title: 'SIARA — Smart Incident & Accident Risk Assessment',
      role: "Master's Thesis Project",
      period: '2025 – 2026',
      bullets: [
        'A real-time road-safety decision-support platform: citizen accident reports, danger-zone maps, risk models and explainable AI.',
        'React web and mobile apps, a Node.js / Express API, PostgreSQL + PostGIS, real-time alerts over Socket.IO, and an English, French and Arabic (RTL) interface.',
        'Police module: work zone by wilaya and commune, incidents within 500 m, verification, assignment and a full operation history.',
      ],
    },
    sentiment: {
      title: 'Sentiment Analysis — Amazon Reviews',
      role: 'Machine Learning Project · Big Data & NoSQL',
      period: 'Mar – May 2025',
      bullets: [
        'Built a model to analyze and classify the sentiment expressed in Amazon customer reviews.',
        'Processed large-scale data with PySpark and Hadoop, fully containerized with Docker for portability.',
      ],
    },
    'iot-security': {
      title: 'IoT-Based Smart Home Security System',
      role: 'Cloud & IoT Mini Project',
      period: '2025',
      bullets: [
        'A smart-home intrusion detection system using ESP32, PIR sensors, MQTT and AWS services.',
        'A complete event-driven pipeline — AWS IoT Core, Lambda, SNS, DynamoDB, CloudWatch and Grafana — for automated alerts, event storage and a live dashboard.',
        'Devices and network simulated with Wokwi and Cisco Packet Tracer.',
      ],
    },
    'qa-assistant': {
      title: 'Multilingual Q&A Assistant for Course Materials',
      role: 'Deep Learning Project',
      period: '2025',
      bullets: [
        'Designed and implemented a multilingual question-answering assistant for university course materials, built with PyTorch and deep learning.',
      ],
    },
    'personality-tests': {
      title: 'JoJo & One Piece Personality Tests',
      role: 'Full Stack Web Developer · Freelance',
      period: '2023 – Present',
      bullets: [
        'Two animated quizzes that match the visitor with a character: cinematic intro, scored questions, a radar chart of traits and a shareable result card with a QR code.',
        'Animated scenes (Framer Motion, GSAP), dedicated scoring logic, English and Arabic (RTL), fully responsive.',
      ],
    },
    'subscription-watch': {
      title: 'Subscription Watch — Subscription Tracker',
      role: 'Mobile App · Personal Project',
      period: '2026',
      bullets: [
        'A local-first mobile app that tracks subscriptions and free trials and reminds you before each charge.',
        'Dashboard with monthly and yearly totals, the next 30 days of charges, per-category analytics and swipeable rows to edit or delete.',
        'Local-notification reminders rescheduled on every change; light and dark themes.',
      ],
    },
    'gaming-center': {
      title: 'mi2o Gaming Center — Management & POS',
      role: 'Windows Desktop App',
      period: '2026',
      bullets: [
        'Management software for a gaming café: stations (PS4, PS5, PC, Xbox…), timed sessions, product sales, bills and payments.',
        'Runs fully offline on one PC: SQLite database, automatic backups, reports, admin and operator accounts.',
        'MVVM architecture in C# / .NET 10 with WPF and Entity Framework Core.',
      ],
    },
    'tutoring-center': {
      title: 'Tutoring Center — Private School Management',
      role: 'Desktop App · Client Project',
      period: '2026',
      bullets: [
        'A desktop app for the owner of a private tutoring center: students, parents, teachers, groups, rooms and the weekly timetable.',
        'Attendance, grades and exams, payments by packs of sessions with printed receipts, teacher pay, expenses and estimated profit.',
        'Runs locally with no server, French interface, amounts in DZD, Excel export.',
      ],
    },
    weighpoint: {
      title: 'Weighpoint — Weight-Loss Tracker',
      role: 'Mobile App · Personal Project',
      period: '2026',
      bullets: [
        'A tracking app: daily weigh-ins, habits, targets, body measurements and progress photos — all data stays on the device.',
        'Trend lines, weekly loss bars, a habit heat map, projections and an estimated goal date.',
        'CSV export, backup and restore, app lock; 377 tests covering calculations, units and reminder rules.',
      ],
    },
    'e-card': {
      title: 'E-Card — Two-Player Bluffing Card Game',
      role: 'Mobile Game · Personal Project',
      period: '2026',
      bullets: [
        'A bluffing game for two players — Emperor, Citizen, Slave — with wagers and a purse to manage over twelve rounds.',
        'Plays on one phone or on two phones over Wi-Fi; the host referees the match and never sends the opponent’s hidden hand.',
        'Recovers from dropped connections, with a self-test suite covering the rules, the money and a whole online match.',
      ],
    },
    imposter: {
      title: 'Imposter — Pass-the-Phone Party Game',
      role: 'Mobile Game · Personal Project',
      period: '2026',
      bullets: [
        'A party word game played by passing one phone: everyone gets the secret word except the imposter, who has to bluff.',
        '100% offline: a bundled word bank by category, discussion timer, voting, scores and confetti.',
      ],
    },
    'last-signal': {
      title: 'The Last Signal — Sci-Fi Typing Game',
      role: 'Web Game · Personal Project',
      period: '2026',
      bullets: [
        'A story-driven typing game: retype the transmissions to restore the signal, with speed, accuracy and combo measured live.',
        'Story missions of rising difficulty, a leaderboard and statistics served by an Express + PostgreSQL API, and a starfield and globe animated on canvas.',
      ],
    },
    'client-portfolio': {
      title: 'Portfolio for a Bioprocess Engineer',
      role: 'Client Project · Freelance',
      period: '2026',
      bullets: [
        'A single-page portfolio built for a client: timeline, expertise grid, an interactive bioprocess flow and a contact card.',
        'Prerendered at build time, then hydrated: median first paint went from 1.09 s to 0.84 s on throttled mobile, and page weight from 352 kB to 228 kB.',
      ],
    },
    delivery: {
      title: 'Delivery Management Platform',
      role: 'Final-Year Project · Bachelor',
      period: '2024',
      bullets: [
        'Designed and built a web and mobile app dedicated to managing order deliveries.',
        'Real-time tracking of orders and their routing all the way to the end customer.',
      ],
    },
    hotel: {
      title: 'Hotel Reservation System',
      role: 'Web Application · Project',
      period: '2024',
      bullets: [
        'A hotel booking app: search and filters, room details, reservations and a downloadable PDF receipt.',
        'Three languages (English, French, Arabic RTL), dark mode and authentication.',
      ],
    },
    school: {
      title: 'School Management System',
      role: 'Web Application · Project',
      period: '2024',
      bullets: [
        'A student management app: registration, per-semester averages, specialities and ranked choices.',
        'Data is kept in the browser, with no back end.',
      ],
    },
  },

  ar: {
    siara: {
      title: 'SIARA — التقييم الذكي لمخاطر الحوادث',
      role: 'مشروع مذكرة الماستر',
      period: '2025 – 2026',
      bullets: [
        'منصة دعم قرار في الوقت الحقيقي للسلامة المرورية: بلاغات المواطنين، خرائط المناطق الخطرة، نماذج تقدير المخاطر وذكاء اصطناعي قابل للتفسير.',
        'تطبيقات ويب وموبايل بـ React، واجهة برمجية بـ Node.js / Express، قاعدة PostgreSQL + PostGIS، تنبيهات فورية عبر Socket.IO، وواجهة بالعربية والفرنسية والإنجليزية.',
        'وحدة الشرطة: منطقة العمل حسب الولاية والبلدية، الحوادث ضمن 500 متر، التحقق والإسناد وسجل كامل للعمليات.',
      ],
    },
    sentiment: {
      title: 'تحليل المشاعر — مراجعات أمازون',
      role: 'مشروع تعلّم آلي · البيانات الضخمة و NoSQL',
      period: 'مارس – ماي 2025',
      bullets: [
        'تطوير نموذج قادر على تحليل وتصنيف المشاعر المعبّر عنها في مراجعات عملاء أمازون.',
        'معالجة بيانات ضخمة باستخدام PySpark و Hadoop، مع حاويات Docker لضمان قابلية النقل.',
      ],
    },
    'iot-security': {
      title: 'نظام أمن منزلي ذكي قائم على إنترنت الأشياء',
      role: 'مشروع مصغّر · الحوسبة السحابية و IoT',
      period: '2025',
      bullets: [
        'نظام كشف تسلّل للمنزل الذكي باستخدام ESP32 وحسّاسات PIR و MQTT وخدمات AWS.',
        'خط معالجة كامل قائم على الأحداث: AWS IoT Core و Lambda و SNS و DynamoDB و CloudWatch و Grafana — تنبيهات آلية، تخزين الأحداث ولوحة متابعة حيّة.',
        'محاكاة الأجهزة والشبكة باستخدام Wokwi و Cisco Packet Tracer.',
      ],
    },
    'qa-assistant': {
      title: 'مساعد أسئلة وأجوبة متعدد اللغات للمقررات الدراسية',
      role: 'مشروع تعلّم عميق',
      period: '2025',
      bullets: [
        'تصميم وتنفيذ مساعد أسئلة وأجوبة متعدد اللغات لمقررات الجامعة، مبني على PyTorch والتعلّم العميق.',
      ],
    },
    'personality-tests': {
      title: 'اختبارات الشخصية JoJo و One Piece',
      role: 'مطوّر ويب Full Stack · عمل حر',
      period: '2023 – حتى الآن',
      bullets: [
        'اختباران متحركان يطابقان الزائر مع شخصية: مقدمة سينمائية، أسئلة بنظام نقاط، مخطط راداري للصفات وبطاقة نتيجة قابلة للمشاركة مع رمز QR.',
        'مشاهد متحركة (Framer Motion و GSAP)، منطق خاص لحساب النتائج، بالعربية والإنجليزية، ومتجاوب بالكامل.',
      ],
    },
    'subscription-watch': {
      title: 'Subscription Watch — متابعة الاشتراكات',
      role: 'تطبيق موبايل · مشروع شخصي',
      period: '2026',
      bullets: [
        'تطبيق موبايل يعمل محلياً لمتابعة الاشتراكات والفترات التجريبية، ويذكّرك قبل كل عملية خصم.',
        'لوحة متابعة بالمجموع الشهري والسنوي، مدفوعات الثلاثين يوماً القادمة، تحليلات حسب الفئة وصفوف تُسحب للتعديل أو الحذف.',
        'تذكيرات بإشعارات محلية تُعاد جدولتها عند كل تغيير؛ وضع فاتح وداكن.',
      ],
    },
    'gaming-center': {
      title: 'mi2o Gaming Center — إدارة ونقطة بيع',
      role: 'تطبيق سطح مكتب لويندوز',
      period: '2026',
      bullets: [
        'برنامج لإدارة قاعة ألعاب: الأجهزة (PS4، PS5، PC، Xbox…)، جلسات موقوتة، بيع المنتجات، الفواتير والمدفوعات.',
        'يعمل دون إنترنت على حاسوب واحد: قاعدة SQLite، نسخ احتياطية آلية، تقارير، وحسابات للمدير والعامل.',
        'بنية MVVM بلغة C# و .NET 10 مع WPF و Entity Framework Core.',
      ],
    },
    'tutoring-center': {
      title: 'مركز الدعم — إدارة مدرسة خاصة',
      role: 'تطبيق سطح مكتب · مشروع لعميل',
      period: '2026',
      bullets: [
        'تطبيق سطح مكتب لصاحب مركز دروس الدعم: التلاميذ، الأولياء، الأساتذة، الأفواج، القاعات وجدول التوقيت الأسبوعي.',
        'الحضور، النقاط والامتحانات، الدفع بحزم الحصص مع طباعة الوصولات، أجور الأساتذة، المصاريف والربح التقديري.',
        'يعمل محلياً دون خادم، واجهة بالفرنسية، المبالغ بالدينار الجزائري، وتصدير إلى Excel.',
      ],
    },
    weighpoint: {
      title: 'Weighpoint — متابعة إنقاص الوزن',
      role: 'تطبيق موبايل · مشروع شخصي',
      period: '2026',
      bullets: [
        'تطبيق متابعة: وزن يومي، عادات، أهداف، قياسات الجسم وصور التقدّم — كل البيانات تبقى على الجهاز.',
        'منحنيات الاتجاه، أعمدة الخسارة الأسبوعية، خريطة حرارية للعادات، توقّعات وتاريخ تقديري لبلوغ الهدف.',
        'تصدير CSV، نسخ احتياطي واسترجاع، قفل للتطبيق؛ 377 اختباراً للحسابات والوحدات وقواعد التذكير.',
      ],
    },
    'e-card': {
      title: 'E-Card — لعبة ورق للخداع بين لاعبَين',
      role: 'لعبة موبايل · مشروع شخصي',
      period: '2026',
      bullets: [
        'لعبة خداع للاعبَين: الإمبراطور، المواطن والعبد، مع رهانات ورصيد يُدار على مدى اثنتي عشرة جولة.',
        'تُلعب على هاتف واحد أو على هاتفين عبر Wi-Fi؛ الهاتف المستضيف يحكّم المباراة ولا يرسل أبداً أوراق الخصم المخفية.',
        'استرجاع المباراة بعد انقطاع الاتصال، ومجموعة اختبارات ذاتية تغطي القواعد والمال ومباراة كاملة عبر الشبكة.',
      ],
    },
    imposter: {
      title: 'Imposter — لعبة جماعية على الهاتف',
      role: 'لعبة موبايل · مشروع شخصي',
      period: '2026',
      bullets: [
        'لعبة كلمات جماعية بتمرير الهاتف: الجميع يعرف الكلمة السرية ما عدا المحتال الذي عليه أن يخادع.',
        'تعمل دون إنترنت تماماً: بنك كلمات مدمج حسب الفئات، مؤقّت للنقاش، تصويت، نقاط واحتفال بالفوز.',
      ],
    },
    'last-signal': {
      title: 'The Last Signal — لعبة كتابة بطابع الخيال العلمي',
      role: 'لعبة ويب · مشروع شخصي',
      period: '2026',
      bullets: [
        'لعبة كتابة سريعة بقصة: أعد كتابة الرسائل لاستعادة الإشارة، مع قياس مباشر للسرعة والدقة والتتابع.',
        'مهمات قصصية بصعوبة متصاعدة، لوحة متصدرين وإحصائيات عبر واجهة Express + PostgreSQL، مع سماء نجوم وكرة أرضية متحركتين على canvas.',
      ],
    },
    'client-portfolio': {
      title: 'موقع شخصي لمهندس في الهندسة الحيوية',
      role: 'مشروع لعميل · عمل حر',
      period: '2026',
      bullets: [
        'موقع من صفحة واحدة أُنجز لعميل: المسار المهني، شبكة الخبرات، مخطط تفاعلي لعملية حيوية وبطاقة تواصل.',
        'صفحة تُولَّد مسبقاً عند البناء ثم تُفعَّل في المتصفح: زمن أول ظهور انخفض من 1.09 ث إلى 0.84 ث على هاتف مقيَّد، والحجم من 352 kB إلى 228 kB.',
      ],
    },
    delivery: {
      title: 'منصة إدارة التوصيل',
      role: 'مشروع نهاية الدراسة · ليسانس',
      period: '2024',
      bullets: [
        'تصميم وتطوير تطبيق ويب وموبايل مخصّص لإدارة توصيل الطلبات.',
        'تتبّع الطلبات في الوقت الحقيقي حتى وصولها إلى العميل النهائي.',
      ],
    },
    hotel: {
      title: 'نظام حجز فندقي',
      role: 'تطبيق ويب · مشروع',
      period: '2024',
      bullets: [
        'تطبيق لحجز الفنادق: بحث وفلاتر، تفاصيل الغرف، الحجوزات وتحميل وصل الحجز بصيغة PDF.',
        'ثلاث لغات (العربية، الفرنسية، الإنجليزية)، وضع داكن وتسجيل دخول.',
      ],
    },
    school: {
      title: 'نظام إدارة مدرسية',
      role: 'تطبيق ويب · مشروع',
      period: '2024',
      bullets: [
        'تطبيق لإدارة الطلبة: التسجيل، معدلات السداسيات، التخصصات وترتيب الرغبات.',
        'البيانات تُحفظ في المتصفح، دون خادم.',
      ],
    },
  },
};

/** Where a project's cover lives in public/. */
export const projectImage = (id: string) => `/projects/${id}.webp`;

/** Cover first, then the numbered screens. */
export const projectGallery = (id: string, shots = 0) => [
  projectImage(id),
  ...Array.from({ length: shots }, (_, n) => `/projects/${id}/${n + 1}.webp`),
];

/** The project ids, in display order. */
export const PROJECT_IDS = BASE.map((p) => p.id);

export function buildProjects(lang: Lang): Experience[] {
  return BASE.map((p, idx) => {
    const links = (p.links ?? []).map((l) => ({
      label: typeof l.label === 'string' ? l.label : l.label[lang],
      url: l.url,
    }));
    return {
      i: String(idx + 1).padStart(2, '0'),
      id: p.id,
      image: projectImage(p.id),
      gallery: projectGallery(p.id, p.shots),
      ...TEXT[lang][p.id],
      tags: p.tags,
      hasLinks: links.length > 0,
      links,
    };
  });
}
