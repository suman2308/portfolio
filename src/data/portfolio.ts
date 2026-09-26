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
      degree: "B.Tech in Computer Science and Engineering — CGPA 8.99/10",
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

  // Portrait used in the Hero (public/images/hero.webp — originals kept in /originals).
  heroImage: "/images/hero.webp",

  // Optional anime/3D character for the Hero. When set, the Hero shows this
  // instead of the photo. Drop the file in /public/images/ and set the path,
  // e.g. "/images/character.png". Keep empty to use the photo.
  characterImage: "",

  openToWork: true,

  links: {
    github: "https://github.com/suman2308",
    linkedin: "https://www.linkedin.com/in/sumanjash",
    twitter: "", // optional
    email: "iamsumanjash@gmail.com",
  },

  bio: [
    "Computer Science Engineering student who designs, builds, and deploys full-stack, backend, and machine learning systems using Python, FastAPI, Flask, SQL, Docker, and GitHub Actions.",
    "Strong foundation in system design, database schema design, authentication and security, REST APIs, and machine learning model evaluation — I ship projects end-to-end, from design through CI/CD and deployment, and I use AI coding assistants the way a professional engineer does: to move faster, not to skip understanding.",
    "B.Tech in Computer Science at Narula Institute of Technology (CGPA 8.99/10), with a strong foundation in DSA, OOP, operating systems, computer networks, DBMS, and machine learning.",
  ],

  achievements: [
    "2nd rank in Code It — a college-level duo-format coding competition with 40 teams in the final round.",
    "Led a team in the internal Smart India Hackathon round to build a College ERP System concept; owned system design, QA/testing, and project presentation after selection for the college-level demonstration round.",
  ],

  focusAreas: ["Full-Stack Development", "Machine Learning", "DSA / Problem Solving"],
};

export const stats = [
  { label: "Experience", value: "Fresher" },
  { label: "Projects shipped", value: 3 },
  { label: "Problems solved", value: 600 },
  { label: "Certifications", value: 8 },
];

export const heroMarquee = [
  "Software Engineer",
  "Full-Stack Developer",
  "AI / ML",
  "Problem Solving",
  "Data Structures",
  "Clean Code",
];

export const heroChips = ["Python", "FastAPI", "Next.js", "PostgreSQL"];

export type Project = {
  title: string;
  /** One-line pitch shown under the title. */
  tagline: string;
  /** The problem the project set out to solve. */
  problem: string;
  /** What was actually achieved / shipped. */
  result: string;
  features: string[];
  tech: string[];
  github: string; // "" hides the GitHub button
  demo: string; // "" hides the Live demo button
  /** Clean domain for the browser-frame URL bar (derived from the demo link). */
  domain: string;
  /** Whether the project has an AI/ML core (shown as a badge). */
  ai?: boolean;
  image: string; // "/images/project-1.png" or "" for a styled placeholder
};

export const projects: Project[] = [
  {
    title: "ShetBhav",
    tagline: "Know the market. Choose better. Earn more. — a market-intelligence platform that helps farmers decide where, when, and to whom to sell.",
    problem:
      "Farmers often sell at whichever mandi is nearest, without knowing whether another market or a buyer would pay more. ShetBhav closes that gap with official mandi prices, buyer demand, and a Smart Sell engine that ranks every selling option by net income after transport, storage, handling, and spoilage costs.",
    result:
      "A full-stack platform with 104 REST endpoints, a 45-table PostgreSQL schema, and 24 Next.js/TypeScript routes across 4 user roles with server-side RBAC — a Smart Sell engine, XGBoost price forecasting on live AGMARKNET data, a complete marketplace with FPO aggregation, and a trilingual UI (English, Hindi, Marathi) — verified by 246 backend + 15 end-to-end tests in CI/CD.",
    features: [
      "Designed and built a full-stack platform with 104 REST endpoints, a 45-table PostgreSQL schema, and 24 Next.js/TypeScript routes, supporting 4 user roles with server-side RBAC and a trilingual UI (English, Hindi, Marathi)",
      "Smart Sell engine scoring every selling option by net income (8 weighted factors), plus an XGBoost 7-day price-forecasting pipeline on live AGMARKNET data (data.gov.in) with automatic baseline fallback",
      "Full marketplace transaction flow — listings, offers with counter-negotiation history, order lifecycle, simulated payments, and FPO aggregation with payment distribution — secured with JWT authentication and bcrypt hashing",
      "246 backend tests and 15 Playwright end-to-end tests in a GitHub Actions CI/CD pipeline; deployed on Vercel (frontend) and Render with PostgreSQL (backend)",
    ],
    tech: ["Python", "FastAPI", "Next.js", "TypeScript", "PostgreSQL", "XGBoost"],
    github: "https://github.com/suman2308/market-intelligence-for-farmer",
    demo: "https://market-intelligence-for-farmer.vercel.app",
    domain: "market-intelligence-for-farmer.vercel.app",
    ai: true,
    image: "/images/project-shetbhav.webp", // branded landing screenshot (register + tagline)
  },
  {
    title: "CourierAI",
    tagline: "ML-powered delivery time prediction — from data to a secured, rate-limited API.",
    problem:
      "Delivery times are hard to predict reliably. The goal: train a model on real courier shipment history and expose it as a secure, production-ready prediction API.",
    result:
      "A HistGradientBoostingRegressor trained on 49,639 real DTDC courier records — 0.5361-day holdout MAE, 0.7466 R², CV std ±0.0056 with no overfitting — shipped behind a secured, rate-limited REST API with an admin console, containerized and deployed to production.",
    features: [
      "Trained a HistGradientBoostingRegressor on 49,639 real DTDC courier records via randomized search over 150 of 960 configurations with 5-fold CV — 0.5361-day holdout MAE, 0.7466 R², CV std ±0.0056 with a train/test ratio of 0.973 (no overfitting), at ~5.8μs per prediction",
      "Experiment harness benchmarking 5 base models (Random Forest, XGBoost, CatBoost, SVR/SVC, MLP) against voting and stacking ensembles across up to 17 combinations, for regression and classification",
      "Secured REST API (/api/predict) with SHA-256-hashed, Fernet-encrypted per-user API keys, tiered rate limits (30/min, 1000/day), and plan-based quotas enforced with HTTP 402 — plus scrypt auth and CSRF protection",
      "Standalone admin console for users, plans, analytics, and live system/ML health; containerized with Docker and Docker Compose, GitHub Actions CI with pytest, deployed to Render with Gunicorn",
    ],
    tech: ["Python", "Flask", "scikit-learn", "Pandas", "NumPy", "XGBoost", "CatBoost", "SQLite", "Docker"],
    github: "https://github.com/suman2308/smart-delivery-prediction",
    demo: "https://smart-delivery-prediction.onrender.com/",
    domain: "smart-delivery-prediction.onrender.com",
    ai: true,
    image: "/images/project-courierai.webp", // home-page screenshot from the repo README
  },
  {
    title: "AeroBook",
    tagline: "Airline reservation & flight operations — passengers, fares, and admin analytics.",
    problem:
      "Booking a flight with connections means weighing fares, layovers, and total travel time across many itineraries. The goal: a complete reservation platform that finds the best options automatically.",
    result:
      "A complete airline reservation system: passengers can search, compare, and book flights — including multi-leg connections ranked automatically — while administrators get a full Operations Center with revenue, occupancy, and route analytics. Containerized and deployed with Docker.",
    features: [
      "Normalized 24-table MySQL schema (FK constraints, 13 indexes) powering 24 passenger-facing pages and a 16-page admin Operations Center — flight search, booking, check-in, and account management",
      "Smart Fare Engine that discovers valid connecting itineraries (90-minute to 8-hour layovers, single connection) in 3 database queries per search, scoring price, travel time, layover length, and stops for Best Value / Cheapest / Fastest",
      "Interactive 2D seat map with multi-passenger booking (1–6), baggage/meal add-ons, promo codes, and QR-coded e-tickets with calendar export",
      "Prepared statements, CSRF protection, bcrypt hashing, and login lockout tracking; admin analytics with revenue, occupancy, and route reports, CSV exports, and AviationStack data sync; containerized Docker deployment",
    ],
    tech: ["PHP 8", "MySQL", "JavaScript", "Bootstrap 5", "Docker"],
    github: "https://github.com/suman2308/airline-reservation-system",
    demo: "https://aerobook-2snu.onrender.com/",
    domain: "aerobook-2snu.onrender.com",
    image: "/images/project-aerobook.webp", // landing-page screenshot from the repo README
  },
];

export const skills: { category: string; icon: string; items: string[] }[] = [
  {
    category: "Languages",
    icon: "code",
    items: ["C++", "Python", "Java", "PHP", "JavaScript", "SQL", "HTML", "CSS"],
  },
  {
    category: "Frameworks & Libraries",
    icon: "backend",
    items: ["FastAPI", "Flask", "Next.js", "scikit-learn", "Pandas", "NumPy", "XGBoost", "CatBoost"],
  },
  {
    category: "Databases",
    icon: "database",
    items: ["PostgreSQL", "MySQL", "SQLite"],
  },
  {
    category: "Developer Tools",
    icon: "tools",
    items: ["Git", "GitHub Actions", "Docker", "Docker Compose", "pytest"],
  },
  {
    category: "Deployment",
    icon: "deploy",
    items: ["Render", "Vercel", "Gunicorn"],
  },
  {
    category: "Core Concepts",
    icon: "concepts",
    items: ["Data Structures & Algorithms", "OOP", "DBMS", "Operating Systems", "Computer Networks", "System Design", "REST APIs", "Authentication", "Web Security", "CI / CD", "Machine Learning"],
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
  "Competitive programming keeps my problem-solving sharp — I practice daily across Codeforces, CodeChef, and LeetCode, and placed 2nd in Code It, a college-level duo-format coding competition with 40 teams in the final round.";

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
    title: "AI Deployment & Automation — Virtual Internship",
    issuer: "EduSkills (AICTE · Ministry of Education)",
    year: "2026",
    url: "/certificates/AI_Deployment_Automation_Internship.pdf",
    detail: "10-week program · Jan–Mar 2026 · ID 42C2841CCB3EE00CF2BB",
  },
  {
    title: "Prompt Engineering for AI — Virtual Internship",
    issuer: "EduSkills (AICTE · Ministry of Education)",
    year: "2026",
    url: "/certificates/Prompt_Engineering_AI_Internship.pdf",
    detail: "8-week program · Apr–Jun 2026 · ID 4EF6BBA5772AB76A234E",
  },
  {
    title: "DevOps & Cloud Automation — Virtual Internship",
    issuer: "EduSkills (AICTE · Ministry of Education)",
    year: "2026",
    url: "/certificates/DevOps_Cloud_Automation_Internship.pdf",
    detail: "8-week program · Aug–Oct 2026 · ID 41FBB98CD82AE33A3E65",
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
    issuer: "Ardent Computech Pvt. Ltd.",
    year: "Feb 2025",
    url: "/certificates/Python_Programming_Training_Ardent.pdf",
    detail: "30-hour training · ID ARDENT/133057",
  },
  {
    title: "Generative AI — 30 Hour Training",
    issuer: "Ardent Computech Pvt. Ltd.",
    year: "Feb 2026",
    url: "/certificates/Generative_AI_Training_Ardent.pdf",
    detail: "30-hour training · ID ARDENT/192400 · Feb 16–26, 2026 · CSE Dept, Narula Institute of Technology",
  },
];
