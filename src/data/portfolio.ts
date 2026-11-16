/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  Single source of truth for all portfolio content.
 *  Edit this file to update the site — every section reads from here.
 *  GitHub stats (stars, languages, recent repos) are fetched live at runtime.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const profile = {
  name: "Raghavendra S Patil",
  firstName: "Raghavendra",
  lastName: "S Patil",
  initials: "RSP",
  role: "Software Development Engineer",
  company: "RealtySlices",
  location: "Hyderabad, India",
  timezone: "Asia/Kolkata",
  email: "raghupatil9036@gmail.com",
  phone: "+91 9108969917",
  photo: "/certs/profile photo.jpeg",
  logo: "/certs/new logo.png",
  resume: "/certs/Raghavendra_Patil_Resume_.pdf",
  available: true,
  githubUser: "raghavendrapatil17",
  socials: {
    github: "https://github.com/raghavendrapatil17",
    linkedin: "https://www.linkedin.com/in/raghavendra-patil-a272a021b/",
  },
  roles: [
    "Software Development Engineer",
    "AI & ML Practitioner",
    "Full-Stack Developer",
    "Power Platform Expert",
    "Dynamics 365 CRM Developer",
  ],
  tagline:
    "I build enterprise applications with Angular & Dynamics 365 CRM, and intelligent systems with LLMs, RAG & Agentic AI.",
  about: [
    "I'm a Software Development Engineer at RealtySlices, Hyderabad, where I architect Angular frontends and Microsoft Dynamics 365 CRM solutions that power real business operations.",
    "My work lives at the intersection of enterprise software and artificial intelligence — from RAG-powered healthcare assistants to Power BI dashboards that turn raw data into decisions.",
    "With an MCA from KLE Institute of Technology (9.2 GPA) and research presented at international conferences, I pair academic rigour with hands-on engineering.",
  ],
  /** Short About copy for the bento grid */
  headline: "I build enterprise software by day — and intelligent systems by design.",
  summary:
    "Angular and Dynamics 365 CRM at RealtySlices; LLMs, RAG pipelines and ML models on the side. Research presented at two international conferences.",
  mission:
    "To build intelligent, scalable software that bridges enterprise systems with the future of AI — creating real impact for real people.",
};

export const pillars = [
  {
    title: "Enterprise Builder",
    body: "Scalable Angular frontends and Dynamics 365 CRM solutions for real-world business workflows.",
    icon: "layers",
  },
  {
    title: "AI Practitioner",
    body: "LLM-powered systems, RAG pipelines and agentic workflows with Python, LangChain & modern AI tooling.",
    icon: "cpu",
  },
  {
    title: "Data Storyteller",
    body: "Interactive Power BI dashboards and forecasting models that surface insights and drive decisions.",
    icon: "chart",
  },
] as const;

export const stats = [
  { value: 9.2, decimals: 1, suffix: "", label: "MCA GPA" },
  { value: 96.58, decimals: 1, suffix: "%", label: "Best model accuracy" },
  { value: 2, decimals: 0, suffix: "", label: "Research papers" },
  { value: 1, decimals: 0, suffix: "+", label: "Years in industry" },
];

/**
 * Skills shown in the "stack explorer". `tier` replaces percentage bars (which
 * read as arbitrary); `note` says where the tool was actually used. Leave
 * `note` out rather than guess. `icon` is a key in components/Skills.tsx.
 */
export type SkillTier = "Expert" | "Advanced" | "Proficient";
export type Skill = { name: string; icon: string; tier: SkillTier; note?: string };

export const skillGroups: { category: string; blurb: string; skills: Skill[] }[] = [
  {
    category: "AI / ML",
    blurb: "LLM apps, retrieval pipelines and classic machine learning.",
    skills: [
      { name: "LLMs & RAG", icon: "brain", tier: "Advanced", note: "Dr. Healify AI · NextHire AI" },
      { name: "LangChain", icon: "langchain", tier: "Advanced", note: "Dr. Healify AI · NextHire AI" },
      { name: "Scikit-learn", icon: "sklearn", tier: "Expert", note: "96.58% disease-prediction model" },
      { name: "TensorFlow", icon: "tensorflow", tier: "Advanced", note: "Mango disease detection (NKCon '25)" },
      { name: "Agentic AI", icon: "robot", tier: "Proficient", note: "Microsoft Agent in a Day" },
    ],
  },
  {
    category: "Microsoft Stack",
    blurb: "Dynamics 365, Dataverse and the Power Platform.",
    skills: [
      { name: "Dynamics 365 CRM", icon: "microsoft", tier: "Expert", note: "RealtySlices" },
      { name: "Power BI", icon: "chart", tier: "Expert", note: "Cognizant · US real-estate dashboard" },
      { name: "Power Apps", icon: "apps", tier: "Advanced", note: "RealtySlices" },
      { name: "Power Automate", icon: "automation", tier: "Advanced", note: "RealtySlices" },
    ],
  },
  {
    category: "Web",
    blurb: "Component-driven, responsive interfaces.",
    skills: [
      { name: "Angular", icon: "angular", tier: "Expert", note: "Daily at RealtySlices" },
      { name: "React", icon: "react", tier: "Advanced", note: "This portfolio" },
      { name: "Flask", icon: "flask", tier: "Expert", note: "Healify · Plagiarism Checker · Art Gallery" },
      { name: "Bootstrap", icon: "bootstrap", tier: "Advanced", note: "Online Art Gallery" },
    ],
  },
  {
    category: "Languages",
    blurb: "Typed, tested, maintainable code.",
    skills: [
      { name: "Python", icon: "python", tier: "Expert", note: "All AI / ML projects" },
      { name: "TypeScript", icon: "typescript", tier: "Advanced", note: "RealtySlices · this site" },
      { name: "C#", icon: "csharp", tier: "Proficient" },
      { name: "Java", icon: "java", tier: "Proficient" },
    ],
  },
  {
    category: "Cloud & DevOps",
    blurb: "Containers and cloud deployment.",
    skills: [
      { name: "AWS", icon: "aws", tier: "Advanced", note: "AWS Cloud Practitioner" },
      { name: "Docker", icon: "docker", tier: "Proficient" },
      { name: "Azure", icon: "azure", tier: "Proficient" },
      { name: "Kubernetes", icon: "kubernetes", tier: "Proficient" },
    ],
  },
  {
    category: "Data",
    blurb: "Relational stores and vector databases.",
    skills: [
      { name: "MySQL", icon: "mysql", tier: "Advanced", note: "Online Art Gallery" },
      { name: "Oracle SQL", icon: "sql", tier: "Advanced" },
      { name: "FAISS", icon: "vector", tier: "Proficient", note: "Vector search for RAG" },
      { name: "ChromaDB", icon: "database", tier: "Proficient", note: "Vector search for RAG" },
    ],
  },
];

export const toolbelt = [
  "Angular", "TypeScript", "Python", "Dynamics 365", "Power Platform", "Power BI",
  "LangChain", "LlamaIndex", "RAG", "TensorFlow", "Scikit-learn", "React", "Flask",
  "Dataverse", "DAX", "Power Query", "Docker", "Kubernetes", "AWS", "Azure",
  "MySQL", "FAISS", "ChromaDB", "Pandas", "NumPy", "Git",
];

export type ProjectCategory = "AI / ML" | "Data Science" | "Full-Stack";

export type Project = {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  category: ProjectCategory;
  featured: boolean;
  metric: string;
  accent: string;
  /** owner/repo — used to pull live stars, language & last-updated from GitHub */
  repo?: string;
  github: string;
  demo?: string;
};

export const projects: Project[] = [
  {
    slug: "healify",
    title: "Dr. Healify AI",
    subtitle: "Intelligent medical assistant",
    description:
      "Full-stack AI healthcare assistant built with Flask, LLaMA, LangChain and RAG. Symptom checking, BMI and health monitoring, and plain-language condition explanations — backed by a Random Forest classifier with 96.58% disease-prediction accuracy.",
    tags: ["Python", "Flask", "LLaMA", "LangChain", "RAG", "Random Forest"],
    category: "AI / ML",
    featured: true,
    metric: "96.58% accuracy",
    accent: "#22d3ee",
    repo: "raghavendrapatil17/Dr-HeAlify-AI-Using-LLM-Models",
    github: "https://github.com/raghavendrapatil17/Dr-HeAlify-AI-Using-LLM-Models",
  },
  {
    slug: "nexthire",
    title: "NextHire AI",
    subtitle: "Resume & LinkedIn analyzer",
    description:
      "AI career tool that analyzes resumes and LinkedIn profiles to deliver ATS optimization scores, skill-gap analysis and tailored job recommendations — helping candidates stand out in competitive pipelines.",
    tags: ["Python", "LLM", "LangChain", "Flask", "NLP", "RAG"],
    category: "AI / ML",
    featured: true,
    metric: "LLM-powered ATS scoring",
    accent: "#818cf8",
    repo: "raghavendrapatil17/NextHire-AI-Resume-Linkedin-Analyzer",
    github: "https://github.com/raghavendrapatil17/NextHire-AI-Resume-Linkedin-Analyzer",
  },
  {
    slug: "mango",
    title: "Mango Disease Detection",
    subtitle: "CNN transfer learning",
    description:
      "Deep-learning system using CNN-based transfer learning to detect diseases in mango trees from leaf images. Presented at the 4th International Conference NKCon '25.",
    tags: ["Python", "TensorFlow", "CNN", "Transfer Learning", "OpenCV"],
    category: "AI / ML",
    featured: true,
    metric: "NKCon '25 research",
    accent: "#fbbf24",
    github: "https://github.com/raghavendrapatil17",
  },
  {
    slug: "house-price",
    title: "House Price Prediction",
    subtitle: "ML regression system",
    description:
      "Regression system predicting real-estate prices from location, size, amenities and market trends, with an interactive Streamlit dashboard for real-time estimates.",
    tags: ["Python", "Scikit-learn", "Streamlit", "Pandas", "NumPy"],
    category: "Data Science",
    featured: false,
    metric: "Real-time estimates",
    accent: "#34d399",
    repo: "raghavendrapatil17/House-Price-Prediction",
    github: "https://github.com/raghavendrapatil17/House-Price-Prediction",
  },
  {
    slug: "usa-real-estate",
    title: "USA Real Estate Dashboard",
    subtitle: "Market analysis & visualization",
    description:
      "Analytics dashboard for the US real-estate market — trends, price distributions, property comparisons and regional insights.",
    tags: ["Python", "Power BI", "Pandas", "Matplotlib", "Seaborn"],
    category: "Data Science",
    featured: false,
    metric: "Market analytics",
    accent: "#60a5fa",
    repo: "raghavendrapatil17/USA-Real-Estate-Market-Analysis-Dashboard",
    github: "https://github.com/raghavendrapatil17/USA-Real-Estate-Market-Analysis-Dashboard",
  },
  {
    slug: "plagiarism",
    title: "Plagiarism Checker",
    subtitle: "ML-based detection",
    description:
      "NLP-driven plagiarism detection using Naïve Bayes, SVM and Random Forest, served through a Flask app with similarity scoring and content highlighting.",
    tags: ["Python", "Flask", "NLP", "SVM", "Naïve Bayes"],
    category: "AI / ML",
    featured: false,
    metric: "Real-time detection",
    accent: "#c084fc",
    github: "https://github.com/raghavendrapatil17",
  },
  {
    slug: "art-gallery",
    title: "Online Art Gallery",
    subtitle: "Full-stack web application",
    description:
      "Platform for artists to showcase and sell their work, with artist profiles, gallery management and artwork listings.",
    tags: ["JavaScript", "Bootstrap", "Flask", "MySQL"],
    category: "Full-Stack",
    featured: false,
    metric: "Full-stack app",
    accent: "#f472b6",
    repo: "raghavendrapatil17/Online-Art-Gallery",
    github: "https://github.com/raghavendrapatil17/Online-Art-Gallery",
  },
];

export const experience = [
  {
    role: "Software Development Engineer",
    company: "RealtySlices",
    location: "Hyderabad, India",
    period: "Mar 2026 — Present",
    current: true,
    points: [
      "Develop responsive Angular interfaces for a dynamic, user-friendly property platform.",
      "Build and customize Microsoft Dynamics 365 CRM solutions that streamline business workflows and customer engagement.",
      "Design low-code automations with Power Apps, Power Automate and Dataverse to connect data and processes across systems.",
    ],
    stack: ["Angular", "Dynamics 365", "Power Platform", "TypeScript"],
  },
  {
    role: "Data Analyst",
    company: "Cognizant",
    location: "Chennai, India",
    period: "Dec 2025 — Mar 2026",
    current: false,
    points: [
      "Cleaned, transformed and modeled data using Power Query and DAX.",
      "Designed interactive Power BI dashboards that enabled faster business decisions.",
      "Implemented forecasting and trend-analysis models to predict performance metrics.",
    ],
    stack: ["Power BI", "DAX", "Power Query", "SQL"],
  },
];

export const education = [
  {
    degree: "Master of Computer Applications",
    school: "KLE Institute of Technology, VTU",
    period: "2024 — 2025",
    score: "9.2 / 10",
  },
  {
    degree: "Bachelor of Computer Applications",
    school: "KLE's RLSI Belagavi, RCU",
    period: "2020 — 2023",
    score: "8.8 / 10",
  },
];

export const research = [
  {
    venue: "ICIET-2025",
    type: "International Conference",
    title: "MediCura AI: Smart Health Companion for Patients & Professionals",
    body: "2nd Joint International Conference on Innovative Engineering Technologies — organized by KITCoE (India), Ningxia University (China), SJTU (China) and AGH University (Poland).",
  },
  {
    venue: "NKCon '25",
    type: "International Conference",
    title: "Mango Tree Disease Detection Using CNN-Based Transfer Learning",
    body: "4th International Conference NKCon '25 — deep learning applied to agricultural disease detection.",
  },
];

export const certifications = [
  {
    name: "Microsoft Agent in a Day",
    issuer: "Microsoft · Koenig Solutions",
    year: "2026",
    image: "/certs/microsoft ai.jpg",
    description: "Building AI agents with Microsoft Copilot Studio and the Power Platform.",
  },
  {
    name: "Context Engineering Foundation",
    issuer: "Cognizant",
    year: "2026",
    image: "/certs/context ai.jpg",
    description: "Foundations of context engineering for LLM-based applications.",
  },
  {
    name: "Data Science",
    issuer: "Starvic",
    year: "2025",
    image: "/certs/starvic-data-science.jpg.png",
    description: "Data analysis, machine learning and practical data-science workflows.",
  },
  {
    name: "Data Visualisation: Empowering Business",
    issuer: "Tata · Forage",
    year: "2024",
    image: "/certs/tata-forage-data-visualisation.jpg.jpg",
    description: "Framing scenarios, choosing visuals, building dashboards and communicating insights.",
  },
];

export const navLinks = [
  { label: "About", id: "about" },
  { label: "Skills", id: "skills" },
  { label: "Work", id: "work" },
  { label: "Experience", id: "experience" },
  { label: "Contact", id: "contact" },
];
