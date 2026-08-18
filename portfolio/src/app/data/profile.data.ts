export interface CareerEntry {
  company: string;
  role: string;
  period: string;
  location?: string;
  description: string[];
  technologies?: string[];
  highlight?: boolean;
}

export interface EducationEntry {
  institution: string;
  degree: string;
  period: string;
  field?: string;
}

export interface PortfolioItem {
  title: string;
  description: string;
  status: 'coming-soon' | 'live';
  tags: string[];
  link?: string;
}

export interface Profile {
  name: string;
  title: string;
  location: string;
  email: string;
  linkedin: string;
  tagline: string;
  summary: string;
  yearsExperience: number;
  skills: string[];
  languages: { name: string; level: string }[];
  career: CareerEntry[];
  education: EducationEntry[];
  publications: string[];
  awards: string[];
  portfolio: PortfolioItem[];
}

export const PROFILE: Profile = {
  name: 'Maroš Fill',
  title: 'Senior Software Engineer',
  location: 'Málaga, Andalusia, Spain',
  email: 'marosfill@gmail.com',
  linkedin: 'https://www.linkedin.com/in/maros-fill',
  tagline: 'Building enterprise web applications with precision and edge.',
  yearsExperience: 9,
  summary:
    'Software engineer with 9 years of experience focused on web application development, UI/UX front-end technologies, and intermediate back-end experience. PhD in Logistics of Information, data analysis, and forecasting — experienced in teaching web development and leading international engineering teams.',
  skills: [
    'Angular',
    'Vue.js',
    'TypeScript',
    'JavaScript',
    'Node.js',
    'Python',
    'HTML & CSS / SCSS',
    'UI/UX Design',
    'GraphQL & REST',
    'PostgreSQL & MongoDB',
    'Cypress',
    'Storybook',
    'Tailwind & Bootstrap',
    'Azure DevOps',
    'Figma & Adobe XD',
  ],
  languages: [
    { name: 'Slovak', level: 'Native' },
    { name: 'English', level: 'Full Professional' },
    { name: 'Czech', level: 'Professional Working' },
    { name: 'Spanish', level: 'Professional Working' },
  ],
  career: [
    {
      company: 'Freelance',
      role: 'Software Engineer',
      period: 'Jun 2024 — Present',
      location: 'Remote',
      description: [
        'Independent consulting and software engineering engagements.',
      ],
      highlight: true,
    },
    {
      company: 'Celonis SE',
      role: 'Senior Software Engineer',
      period: 'Aug 2024 — Jan 2026',
      location: 'Munich, Germany',
      description: [
        'Senior member of international team building a process management system.',
        'Multi-app / multi-library architecture with Angular 18 and yFiles.',
      ],
      technologies: ['Angular 18', 'GitHub Copilot', 'yFiles', 'Multi-lib Architecture'],
      highlight: true,
    },
    {
      company: 'Michelin',
      role: 'Senior Software Engineer',
      period: 'Mar 2023 — Oct 2024',
      location: 'France',
      description: [
        'Senior member of international team — telematics data analysis for fleet and asset management.',
      ],
      technologies: ['Vue.js', 'Node.js', 'GraphQL', 'MongoDB', 'PostgreSQL', 'Vuetify'],
    },
    {
      company: 'CHG Healthcare',
      role: 'Software Engineer',
      period: 'Feb 2021 — Feb 2023',
      location: 'Utah, USA',
      description: [
        'Member of US team building web application for healthcare staffing process management.',
      ],
      technologies: ['Vue.js', 'Node.js', 'Tailwind', 'Sequelize', 'Storybook', 'Feature Flags'],
    },
    {
      company: 'Caterpillar Marine Digital',
      role: 'Software Engineer',
      period: 'Oct 2019 — Jan 2021',
      location: 'Virginia, USA',
      description: [
        'Ship tracking web application for seas and oceans worldwide.',
        'UI/UX design with Figma.',
      ],
      technologies: ['Angular', 'Bootstrap', 'Cypress', 'Figma'],
    },
    {
      company: 'Solar Turbines',
      role: 'Software Engineer',
      period: 'Oct 2017 — Sep 2019',
      location: 'San Diego, USA',
      description: [
        'Analysis of data gathered from industrial gas turbines.',
        'UI/UX design with Adobe XD.',
      ],
      technologies: ['Angular', 'Angular Material', 'Adobe XD'],
    },
    {
      company: 'Ness KE',
      role: 'Senior Software Engineer',
      period: 'Apr 2022 — Oct 2023',
      location: 'Košice, Slovakia',
      description: [
        'Front-end development, UI/UX design, and generic component libraries.',
        'Web development lecturer at IT academy and Faculty of Informatics.',
      ],
      technologies: ['Vue.js', 'REST API', 'SQL & NoSQL', 'Scrum'],
    },
    {
      company: 'Ness KE',
      role: 'Software Developer, Front End & UI/UX',
      period: 'Oct 2017 — Mar 2022',
      location: 'Košice, Slovakia',
      description: [
        'Front-end development, data visualization, authentication, and test automation.',
      ],
    },
    {
      company: 'Bookitit',
      role: 'Software Engineer — Internship',
      period: 'Jul 2017 — Sep 2017',
      location: 'Valencia, Spain',
      description: [
        'Front-end development in JavaScript with unit and component testing.',
      ],
    },
    {
      company: 'Technical University of Košice',
      role: 'PhD Student',
      period: 'Sep 2014 — Jun 2017',
      location: 'Košice, Slovakia',
      description: [
        'Research and dissertation on logistics and forecasting.',
        'Published scientific contributions and organized international congress.',
        'Built web application (JavaScript, PHP, Java, SQL) for time-series analysis.',
      ],
    },
    {
      company: 'Sony',
      role: 'Vaio — Hardware & Software Adviser',
      period: '2011 — 2014',
      location: 'Slovakia',
      description: [
        'Product portfolio presentation and technical advice on Sony hardware and software.',
      ],
    },
  ],
  education: [
    {
      institution: 'Technical University of Košice',
      degree: 'PhD',
      field: 'Logistics, Materials & Supply Chain Management',
      period: '2014 — 2017',
    },
    {
      institution: 'Universidad de Huelva',
      degree: 'Exchange Program',
      period: '2016',
    },
    {
      institution: 'Technical University of Košice',
      degree: 'Ing. (Master)',
      field: 'Logistics',
      period: '2012 — 2014',
    },
    {
      institution: 'Technical University of Košice',
      degree: 'Bc. (Bachelor)',
      field: 'Logistics, Materials & Supply Chain Management',
      period: '2009 — 2012',
    },
  ],
  publications: [
    'Information System as a Tool of Decision Support',
    'Prvky logistiky ovplyvňujúce globálnu optimalizáciu podniku',
    'Application of EXTENDSIM for improvement of production logistics efficiency',
    'Information technology as a means of support of logistics processes',
    'Discrete and Continuous Simulation of Manufacturing Processes',
  ],
  awards: [
    'Scientific Award — Carpathian Logistics Congress Poster Contest',
  ],
  portfolio: [
    {
      title: 'Process Management Platform',
      description: 'Enterprise-grade process modeling and management — case study coming soon.',
      status: 'coming-soon',
      tags: ['Angular', 'Enterprise', 'yFiles'],
    },
    {
      title: 'Fleet Telematics Dashboard',
      description: 'Real-time fleet and asset management analytics — detailed write-up in progress.',
      status: 'coming-soon',
      tags: ['Vue.js', 'GraphQL', 'Data Viz'],
    },
    {
      title: 'Marine Tracking System',
      description: 'Global ship tracking interface — portfolio deep-dive forthcoming.',
      status: 'coming-soon',
      tags: ['Angular', 'Maps', 'Cypress'],
    },
    {
      title: 'Healthcare Staffing Platform',
      description: 'Staffing workflow management for healthcare — showcase coming soon.',
      status: 'coming-soon',
      tags: ['Vue.js', 'Tailwind', 'Storybook'],
    },
  ],
};
