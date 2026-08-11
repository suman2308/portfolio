// ═══════════════════════════════════════════════════════════════════════════
//  SITE CONTENT — everything the site shows lives in this one file.
//  (Except the competitive-programming stats, which scripts/fetch-cp-stats.mjs
//  refreshes from the live sources into cp-live.ts on every build.)
// ═══════════════════════════════════════════════════════════════════════════

import { cpLive } from "./cp-live";

export const profile = {
  name: "Suman Jash",
  firstName: "Suman",
  lastName: "Jash",
  initials: "SJ",
  headline: "Software Engineer",
  roles: ["Full-Stack Developer", "AI / ML"],
  tagline: "I design, build and deploy full-stack and machine-learning applications — from data to deployment.",
  location: "Kolkata, West Bengal, India",
  educationList: [
    {
      school: "Narula Institute of Technology",
      degree: "B.Tech in Computer Science and Engineering — CGPA 8.96/10",
      years: "2023 – 2027",
      location: "Kolkata, West Bengal",
    },
    {
      school: "Arambagh Vivekananda Academy",
      degree: "CBSE Class XII — 85.8% · Class X — 94.4%",
      years: "2021 – 2023",
      location: "Arambagh, Hooghly",
    },
  ],
  email: "iamsumanjash@gmail.com",
  phone: "+91 95934 28292",
  resumeUrl: "/resume/Suman_Jash_Resume.pdf",

  // Portrait used in the Hero (public/images/hero.jpg).
  heroImage: "/images/hero.jpg",

  // Optional anime/3D character for the Hero. When set, the Hero shows this
  // instead of the photo. Drop the file in /public/images/ and set the path,
  // e.g. "/images/character.png". Keep empty to use the photo.
  characterImage: "",

  // Hero tagline (adaptation of the mockup's "Build · Deploy · Impact").
  heroTagline: ["Build", "Deploy", "Impact"],

  openToWork: true,

  links: {
    github: "https://github.com/suman2308",
    linkedin: "https://www.linkedin.com/in/sumanjash",
    twitter: "", // optional
    email: "iamsumanjash@gmail.com",
  },

  bio: [
    "Computer Science Engineering student with hands-on experience designing, building, and deploying full-stack, backend, and machine-learning applications using Python, Flask, PHP, SQL, Docker, and GitHub Actions.",
    "I use AI tools (ChatGPT, Claude, Copilot) to accelerate debugging and learning — while independently owning system design, testing, and architecture decisions across every project.",
    "Codeforces Pupil and CodeChef 3-Star with 600+ problems solved, and a B.Tech in Computer Science at Narula Institute of Technology (CGPA 8.96/10) with a strong foundation in DSA, OOP, operating systems, computer networks, DBMS, and machine learning.",
  ],

  achievements: [
    "2nd rank in Code It — a college-level duo-format coding competition with 40 teams in the final round.",
    "Co-designed a School ERP System concept for Smart India Hackathon (SIH); owned system design and QA/testing, and delivered the final presentation after the idea was selected for the college-level demonstration round.",
    "Codeforces Pupil (max 1327) · CodeChef 3-Star (max 1628) · 600+ problems solved across LeetCode, CodeChef, and Codeforces.",
    "NPTEL Programming in Java (Elite) — 94/100 · NPTEL Cloud Computing — 92/100.",
  ],

  focusAreas: ["Full-Stack Development", "Machine Learning", "DSA / Problem Solving"],
};

export const stats = [
  { label: "Experience", value: "Fresher" },
  { label: "Projects shipped", value: 2 },
  { label: "Problems solved", value: 600 },
  { label: "Certifications", value: 7 },
];

export const heroMarquee = [
  "Software Engineer",
  "Full-Stack Developer",
  "AI / ML",
  "Problem Solving",
  "Data Structures",
  "Clean Code",
];

export const heroChips = ["Python", "Flask", "Docker", "scikit-learn"];

export type Project = {
  title: string;
  description: string;
  features: string[];
  tech: string[];
  github: string; // "" hides the GitHub button
  demo: string; // "" hides the Live demo button
  image: string; // "/images/project-1.png" or "" for a styled placeholder
};

export const projects: Project[] = [
  {
    title: "CourierAI",
    description:
      "ML-powered delivery time prediction platform for courier shipments — from training the model to a secured, rate-limited prediction API.",
    features: [
      "Trained and tuned a HistGradientBoostingRegressor on 49,639 real DTDC courier records — randomized search over 150 of 960 configurations with 5-fold cross-validation, achieving 0.5361-day holdout MAE and 0.7466 R²",
      "Experiment harness comparing Random Forest, XGBoost, CatBoost, SVR/SVC, and MLP models plus voting/stacking hybrids — up to 17 stacking combinations for regression and classification",
      "Secured REST API (/api/predict) with SHA-256-hashed and Fernet-encrypted API keys, 30 req/min and 1000 req/day limits, and plan-based prediction quotas",
      "User authentication with scrypt password hashing, CSRF protection, security headers, and a standalone admin console for users, plans, analytics, and system/ML status",
      "Containerized with Docker and Docker Compose, GitHub Actions CI with pytest, deployed to Render with Gunicorn",
      "Used AI coding assistants (ChatGPT, Claude, Copilot) to accelerate debugging and learn ML/statistical concepts — while independently owning model selection, security architecture, and API design",
    ],
    tech: ["Python", "Flask", "scikit-learn", "Pandas", "NumPy", "XGBoost", "CatBoost", "SQLite", "Docker"],
    github: "https://github.com/suman2308/smart-delivery-prediction",
    demo: "https://smart-delivery-prediction.onrender.com/",
    image: "/images/project-courierai.png", // home-page screenshot from the repo README
  },
  {
    title: "AeroBook",
    description:
      "Full-stack airline reservation and flight operations platform with a Smart Fare Engine, interactive seat maps, QR e-tickets and an admin operations center.",
    features: [
      "Full-stack airline reservation platform spanning 24 passenger-facing pages and a 16-page admin Operations Center — flight search, booking, check-in, and account management",
      "Smart Fare Engine discovers valid connecting itineraries (90-minute to 8-hour layovers, single connection) alongside direct flights, scoring price, travel time, layover length, and stops to surface Best Value / Cheapest / Fastest",
      "Interactive 2D seat map with multi-passenger booking (1–6), baggage/meal add-ons, promo code discounts, and QR-coded e-tickets with calendar export",
      "Admin analytics suite: revenue, occupancy, and route reports with CSV exports, a searchable audit trail, and automated data-quality diagnostics — plus optional live flight/airport sync from the AviationStack API",
      "Hardened with prepared statements, CSRF protection, bcrypt password hashing, and login lockout tracking; dependency-free smoke-test suite and containerized Docker deployment",
    ],
    tech: ["PHP 8", "MySQL", "JavaScript", "Bootstrap 5", "Docker"],
    github: "https://github.com/suman2308/airline-reservation-system",
    demo: "https://aerobook-2snu.onrender.com/",
    image: "/images/project-aerobook.png", // landing-page screenshot from the repo README
  },
];

export const skills: { category: string; icon: string; items: string[] }[] = [
  {
    category: "Languages",
    icon: "code",
    items: ["C / C++", "Python", "PHP", "Java", "JavaScript", "SQL", "HTML", "CSS"],
  },
  {
    category: "Frameworks & Libraries",
    icon: "backend",
    items: ["Flask", "scikit-learn", "Pandas", "NumPy", "XGBoost", "CatBoost", "Bootstrap 5"],
  },
  {
    category: "Databases",
    icon: "database",
    items: ["MySQL", "SQLite"],
  },
  {
    category: "Developer Tools",
    icon: "tools",
    items: ["Git", "GitHub", "GitHub Actions", "Docker", "Docker Compose", "pytest", "VS Code", "XAMPP"],
  },
  {
    category: "Deployment",
    icon: "deploy",
    items: ["Render", "InfinityFree"],
  },
  {
    category: "Core Concepts",
    icon: "concepts",
    items: ["Data Structures & Algorithms", "OOP", "Operating Systems", "Computer Networks", "DBMS", "Machine Learning", "REST APIs", "Authentication", "Web Security", "CI / CD"],
  },
];

export type Platform = {
  name: string;
  icon: string; // key into the brand icon map
  handle: string;
  url: string;
  stats: { label: string; value: string }[];
};

// Stats are refreshed from the live sources at every build by
// scripts/fetch-cp-stats.mjs (see src/data/cp-live.ts) — they can't go stale.
export const platforms: Platform[] = [
  {
    name: "Codeforces",
    icon: "codeforces",
    handle: "sumanjash",
    url: "https://codeforces.com/profile/sumanjash",
    stats: cpLive.codeforces,
  },
  {
    name: "CodeChef",
    icon: "codechef",
    handle: "suman23082005",
    url: "https://www.codechef.com/users/suman23082005",
    stats: cpLive.codechef,
  },
  {
    name: "LeetCode",
    icon: "leetcode",
    handle: "eHMLu7Dusc",
    url: "https://leetcode.com/u/eHMLu7Dusc/",
    stats: cpLive.leetcode,
  },
];

export const codingIntro =
  "Competitive programming keeps my problem-solving sharp — Codeforces Pupil, CodeChef 3-Star, and 600+ problems solved across LeetCode, CodeChef, and Codeforces. I also secured 2nd rank in Code It, a college-level duo-format coding competition with 40 teams in the final round.";

export type Certification = {
  title: string;
  issuer: string;
  year: string; // "" hides the year
  url: string; // "" hides the verification link
  detail?: string; // optional extra line, e.g. a score
};

export const certifications: Certification[] = [
  {
    title: "Programming in Java (Elite)",
    issuer: "NPTEL",
    year: "Jul-Oct 2025",
    url: "https://archive.nptel.ac.in/noc/Ecertificate/?q=NPTEL25CS110S459600636",
    detail: "Score: 94/100 · 12-week course",
  },
  {
    title: "Cloud Computing",
    issuer: "NPTEL",
    year: "Jan-Apr 2026",
    url: "https://archive.nptel.ac.in/noc/Ecertificate/?q=NPTEL26CS55S1057500592",
    detail: "Score: 92/100 · 12-week course",
  },
  {
    title: "AI Deployment & Automation — Internship Credential",
    issuer: "Eduskill",
    year: "2026",
    url: "/certificates/AI_Deployment_Automation_Internship.pdf",
    detail: "8-week program · Issued Mar 10 · ID 2026-314A92062F",
  },
  {
    title: "Prompt Engineering for AI — Internship Credential",
    issuer: "Eduskill",
    year: "2026",
    url: "/certificates/Prompt_Engineering_AI_Internship.pdf",
    detail: "8-week program · Issued Aug 11 · ID 2026-E8309C1FD8",
  },
  {
    title: "MEAN Full Stack Web Development — 36 Hour Training",
    issuer: "IALSD — Institute for Advanced Learning & Skill Development",
    year: "Sep 2025",
    url: "/certificates/MEAN_Full_Stack_Training_IALSD.pdf",
    detail: "36-hour training · Cert No. IALSD/CS/25/02/0052/360",
  },
  {
    title: "Python Programming — 30 Hour Training",
    issuer: "Narula Institute of Technology",
    year: "Feb 2025",
    url: "/certificates/Python_Programming_Training_Ardent.pdf",
    detail: "30-hour training · ID ARDENT/133057",
  },
  {
    title: "Generative AI — 30 Hour Training",
    issuer: "Ardent Software",
    year: "Feb 2026",
    url: "/certificates/Generative_AI_Training_Ardent.pdf",
    detail: "30-hour training · ID ARDENT/192400 · Feb 16–26, 2026 · CSE Dept, Narula Institute of Technology",
  },
];
