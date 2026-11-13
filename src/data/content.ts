// ─────────────────────────────────────────────────────────────────────────
// Shared content for every portfolio version (V1–V8).
// All eight designs render from this single source of truth.
// The projects themselves live next door in ./projects.ts.
// FR / EN / AR. (V1 Terminal only exposes FR + EN; the others add AR + RTL.)
// ─────────────────────────────────────────────────────────────────────────

import { buildProjects } from './projects';

export type Lang = 'fr' | 'en' | 'ar';

export interface Link {
  label: string;
  url: string;
}
export interface Experience {
  /** Two-digit display number, "01"… */
  i: string;
  /** Stable slug, independent of language and order. */
  id: string;
  /** Cover picture, served from public/projects/. */
  image: string;
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
  /** Same number, dialable — used for the tel: links. */
  tel: 'tel:+213542866839',
  github: 'mi2odev',
  githubUrl: 'https://github.com/mi2odev',
  instagram: 'https://www.instagram.com/_.mi2o/',
  facebook: 'https://www.facebook.com/Mohamed.mehdi.zitouni?locale=fr_FR',
  cvHref: '/CV_Mohamed_Mehdi_ZITOUNI.pdf',
  photo: '/photo.webp',
  year: '2026',
} as const;

// ── Skill chips (language-independent) ────────────────────────────────────
export const SKILL_CHIPS = {
  fe: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'React Native', 'Expo', 'Vue.js', 'Tailwind'],
  be: ['Node.js', 'PHP', 'Laravel', 'Django', 'Spring Boot', 'C# / .NET', 'PostgreSQL', 'MySQL', 'NoSQL'],
  data: ['Python', 'Pandas', 'Scikit-learn', 'PyTorch', 'Hadoop', 'Spark', 'Deep Learning'],
  ops: ['Docker', 'Linux', 'Git', 'GitHub', 'UML'],
  cloud: ['AWS IoT Core', 'AWS Lambda', 'DynamoDB', 'SNS', 'CloudWatch', 'EC2', 'MQTT', 'ESP32', 'Grafana'],
} as const;

export const TECH_MARQUEE = [
  'React',
  'TypeScript',
  'Python',
  'Docker',
  'Spark',
  'Laravel',
  'Vue.js',
  'PySpark',
  'MySQL',
  'Tailwind',
  'Django',
  'Spring Boot',
  'Hadoop',
  'Git',
] as const;

// ── Localised content ─────────────────────────────────────────────────────
export const CONTENT: Record<Lang, Content> = {
  fr: {
    nav: {
      about: 'À propos',
      skills: 'Compétences',
      work: 'Expérience',
      edu: 'Formation',
      contact: 'Contact',
    },
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
      cats: {
        fe: 'Frontend',
        be: 'Backend',
        data: 'Data & IA',
        ops: 'DevOps & Outils',
        cloud: 'Cloud & IoT',
      },
    },
    work: {
      label: 'Expérience',
      heading: 'Projets & expériences sélectionnés.',
      items: buildProjects('fr'),
    },
    edu: {
      label: 'Formation',
      heading: 'Parcours académique.',
      items: [
        {
          period: '2024 – Présent',
          degree: 'Master — Sciences des Données & Systèmes Intelligents',
          school: 'Université Constantine 2 · Abdelhamid Mehri',
          modules: [
            'Machine Learning',
            'Deep Learning',
            'Big Data & NoSQL',
            'Cloud & IoT',
            'Optimisation',
            'Prétraitement des données',
          ],
        },
        {
          period: '2021 – 2024',
          degree: 'Licence — Informatique',
          school: 'Université Larbi Ben M’Hidi · Oum El Bouaghi',
          modules: [
            'Structures de données',
            'POO',
            'Génie logiciel',
            'Systèmes d’exploitation',
            'Dév. Web',
            'Bases de données avancées',
          ],
        },
        {
          period: '2020 – 2021',
          degree: 'Baccalauréat Scientifique',
          school: 'Mention Assez Bien',
          modules: [],
        },
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
      items: buildProjects('en'),
    },
    edu: {
      label: 'Education',
      heading: 'Academic background.',
      items: [
        {
          period: '2024 – Present',
          degree: "Master's — Data Science & Intelligent Systems",
          school: 'Constantine 2 University · Abdelhamid Mehri',
          modules: [
            'Machine Learning',
            'Deep Learning',
            'Big Data & NoSQL',
            'Cloud & IoT',
            'Optimization',
            'Data Preprocessing',
          ],
        },
        {
          period: '2021 – 2024',
          degree: "Bachelor's — Computer Science",
          school: "Larbi Ben M'Hidi University · Oum El Bouaghi",
          modules: [
            'Data Structures',
            'OOP',
            'Software Engineering',
            'Operating Systems',
            'Web Development',
            'Advanced Databases',
          ],
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
      cats: {
        fe: 'الواجهة الأمامية',
        be: 'الواجهة الخلفية',
        data: 'البيانات والذكاء',
        ops: 'DevOps والأدوات',
        cloud: 'الحوسبة السحابية و IoT',
      },
    },
    work: {
      label: 'الخبرة',
      heading: 'مشاريع وخبرات مختارة.',
      items: buildProjects('ar'),
    },
    edu: {
      label: 'التعليم',
      heading: 'المسار الأكاديمي.',
      items: [
        {
          period: '2024 – حتى الآن',
          degree: 'ماستر — علم البيانات والأنظمة الذكية',
          school: 'جامعة قسنطينة 2 · عبد الحميد مهري',
          modules: [
            'تعلّم الآلة',
            'التعلّم العميق',
            'البيانات الضخمة و NoSQL',
            'الحوسبة السحابية و IoT',
            'الأمثلة',
            'معالجة البيانات',
          ],
        },
        {
          period: '2021 – 2024',
          degree: 'ليسانس — إعلام آلي',
          school: 'جامعة العربي بن مهيدي · أم البواقي',
          modules: [
            'هياكل البيانات',
            'البرمجة الكائنية',
            'هندسة البرمجيات',
            'أنظمة التشغيل',
            'تطوير الويب',
            'قواعد البيانات المتقدّمة',
          ],
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
