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
/** What kind of thing a project is — drives the filter above the list. */
export type ProjectCategory = 'web' | 'mobile' | 'desktop' | 'data';

export interface Experience {
  /** Two-digit display number, "01"… */
  i: string;
  /** Stable slug, independent of language and order. */
  id: string;
  /** Cover picture, served from public/projects/. */
  category: ProjectCategory;
  image: string;
  /** Every screen of the project, cover first — what the viewer steps through. */
  gallery: string[];
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
  work: {
    label: string;
    heading: string;
    /** Labels of the category filter. */
    filters: { all: string; web: string; mobile: string; desktop: string; data: string };
    /** The word after the count, as in “16 projects”. */
    countWord: string;
    items: Experience[];
  };
  edu: { label: string; heading: string; items: Education[] };
  contact: { label: string; heading: string; body: string; cta: string };
  footer: { built: string; top: string };
  /** What search results and link previews show: one sentence, 150–160 characters. */
  seo: { description: string };
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
    status: 'Disponible · Freelance',
    hero: {
      eyebrow: 'Développeur Full Stack · Data Science & IA',
      eyebrowLabel: 'Rôle',
      tagline:
        'Je conçois des applications web modernes et des solutions intelligentes, d’un front-end soigné jusqu’aux modèles de machine learning.',
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
      heading:
        'Développeur full stack, diplômé d’un Master en science des données et passionné d’intelligence artificielle.',
      body: 'Développeur full stack, en freelance depuis 2023. Je conçois et livre des sites et des applications de bout en bout : interfaces React, TypeScript et React Native, back-ends Node.js, Laravel, Django ou Spring Boot, et applications de bureau C# / .NET hors ligne quand une entreprise en a besoin. Côté data, je m’appuie sur des projets concrets de machine learning et de big data (scikit-learn, LightGBM, PySpark, Hadoop) menés pendant mon Master en Sciences des Données & Systèmes Intelligents. Je travaille en français, en anglais et en arabe.',
      facts: [
        { k: 'Localisation', v: 'Constantine, DZ' },
        { k: 'Diplôme', v: 'Master · SDSI' },
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
      filters: { all: 'Tous', web: 'Web', mobile: 'Mobile', desktop: 'Bureau', data: 'Data · IA · IoT' },
      countWord: 'projets',
      items: buildProjects('fr'),
    },
    edu: {
      label: 'Formation',
      heading: 'Parcours académique.',
      items: [
        {
          period: '2024 – 2026',
          degree: 'Master · Sciences des Données & Systèmes Intelligents',
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
          degree: 'Licence · Informatique',
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
    seo: {
      description:
        'Portfolio de Mohamed Mehdi Zitouni, développeur full stack à Constantine, Algérie : 16 projets web, mobile et bureau, machine learning et IoT, avec captures.',
    },
    spoken: [
      { name: 'Arabe', level: 'Natif', pct: 100 },
      { name: 'Français', level: 'Avancé', pct: 92 },
      { name: 'Anglais', level: 'Avancé', pct: 85 },
    ],
  },

  en: {
    nav: { about: 'About', skills: 'Skills', work: 'Work', edu: 'Education', contact: 'Contact' },
    status: 'Available · Freelance',
    hero: {
      eyebrow: 'Full Stack Developer · Data Science & AI',
      eyebrowLabel: 'Role',
      tagline:
        'I build modern web applications and intelligent solutions, from polished front-ends to machine-learning models.',
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
      heading: "Full stack developer with a Master's in data science, and an AI enthusiast.",
      body: "Full stack developer, freelancing since 2023. I design and ship websites and apps end to end: React, TypeScript and React Native front ends, Node.js, Laravel, Django or Spring Boot back ends, and offline C# / .NET desktop apps when a business needs one. On the data side I draw on hands-on machine learning and big data projects (scikit-learn, LightGBM, PySpark, Hadoop) from my Master's in Data Science & Intelligent Systems. I work in French, English and Arabic.",
      facts: [
        { k: 'Location', v: 'Constantine, DZ' },
        { k: 'Degree', v: 'MSc · Data Science' },
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
      filters: { all: 'All', web: 'Web', mobile: 'Mobile', desktop: 'Desktop', data: 'Data · AI · IoT' },
      countWord: 'projects',
      items: buildProjects('en'),
    },
    edu: {
      label: 'Education',
      heading: 'Academic background.',
      items: [
        {
          period: '2024 – 2026',
          degree: "Master's · Data Science & Intelligent Systems",
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
          degree: "Bachelor's · Computer Science",
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
        { period: '2020 – 2021', degree: 'Scientific Baccalaureate', school: 'Honors: Good', modules: [] },
      ],
    },
    contact: {
      label: 'Contact',
      heading: "Let's work together.",
      body: 'A web project, a data mission, or just want to chat? My inbox is always open.',
      cta: 'Send an email',
    },
    footer: { built: 'Designed & built by Mohamed Mehdi Zitouni', top: 'Back to top' },
    seo: {
      description:
        'Mohamed Mehdi Zitouni, full stack developer in Constantine, Algeria. 16 web, mobile and desktop projects, machine learning and IoT, with real screenshots.',
    },
    spoken: [
      { name: 'Arabic', level: 'Native', pct: 100 },
      { name: 'French', level: 'Advanced', pct: 92 },
      { name: 'English', level: 'Advanced', pct: 85 },
    ],
  },

  ar: {
    nav: { about: 'نبذة', skills: 'المهارات', work: 'الخبرة', edu: 'التعليم', contact: 'تواصل' },
    status: 'متاح · عمل حر',
    hero: {
      eyebrow: 'Full Stack · علم البيانات والذكاء الاصطناعي',
      eyebrowLabel: 'الدور',
      tagline: 'أصمّم تطبيقات ويب حديثة وحلولاً ذكية، من واجهات أمامية متقنة إلى نماذج تعلّم الآلة.',
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
      heading: 'مطوّر full stack حاصل على ماستر في علم البيانات، وشغوف بالذكاء الاصطناعي.',
      body: 'مطوّر full stack أعمل بشكل حر منذ 2023. أصمّم وأنجز المواقع والتطبيقات من البداية إلى النهاية: واجهات بـ React و TypeScript و React Native، وخوادم بـ Node.js أو Laravel أو Django أو Spring Boot، وتطبيقات سطح مكتب بـ C# / .NET تعمل دون إنترنت عندما تحتاجها المؤسسة. وفي جانب البيانات أعتمد على مشاريع فعلية في تعلّم الآلة والبيانات الضخمة (scikit-learn و LightGBM و PySpark و Hadoop) أنجزتها خلال ماستر علم البيانات والأنظمة الذكية. أعمل بالعربية والفرنسية والإنجليزية.',
      facts: [
        { k: 'الموقع', v: 'قسنطينة، الجزائر' },
        { k: 'الشهادة', v: 'ماستر · SDSI' },
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
      filters: {
        all: 'الكل',
        web: 'ويب',
        mobile: 'موبايل',
        desktop: 'سطح المكتب',
        data: 'بيانات · ذكاء · IoT',
      },
      countWord: 'مشروعاً',
      items: buildProjects('ar'),
    },
    edu: {
      label: 'التعليم',
      heading: 'المسار الأكاديمي.',
      items: [
        {
          period: '2024 – 2026',
          degree: 'ماستر · علم البيانات والأنظمة الذكية',
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
          degree: 'ليسانس · إعلام آلي',
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
    seo: {
      description:
        'معرض أعمال محمد مهدي زيتوني، مطوّر full stack من قسنطينة، الجزائر: 16 مشروعاً في الويب والموبايل وسطح المكتب وتعلّم الآلة وإنترنت الأشياء، مع لقطات شاشة.',
    },
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
