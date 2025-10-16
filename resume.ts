// Centralized resume data derived from provided resume text.
export const resume = {
  lastUpdated: new Date('2025-01-28T00:00:00Z'),
  summary: `Aspiring Data Scientist and Machine Learning Engineer with a strong foundation in statistical analysis, predictive modeling, and deep learning frameworks. Skilled in Python, Flask, Scikit-learn, TensorFlow, and cloud platforms (AWS, Azure, GCP). With hands-on project experience in AI-powered chatbots, NLP, and cloud-based ML applications.`,
  skills: {
    languages: ['Python', 'C', 'Java', 'JavaScript'],
    frontend: ['HTML', 'CSS', 'Bootstrap'],
    backend: ['Flask', 'Django'],
    frameworks: ['Flask', 'Django', 'TensorFlow', 'Scikit-learn'],
    databases: ['Oracle RDBMS', 'MySQL', 'SQL'],
    cloud: ['AWS (EC2, S3, IAM, RDS, CloudWatch)', 'Azure', 'GCP'],
    tools: ['Docker', 'Kubernetes', 'Git', 'GitHub', 'VS Code', 'Google Colab'],
    dataScience: ['NumPy', 'Pandas', 'Matplotlib', 'Seaborn', 'Scikit-learn', 'AI Concepts', 'LLMs', 'LangChain', 'RAG']
  },
  education: [
    {
      degree: 'Master of Computer Applications (MCA)',
      institution: 'KLE Institute Of Technology, VTU',
      start: 'Feb 2024',
      end: 'Oct 2025',
      gpa: '9.2'
    },
    {
      degree: 'Bachelor of Computer Applications (BCA)',
      institution: 'KLE\'s RLSI Belagavi, RCU',
      start: 'Sept 2020',
      end: 'Oct 2023',
      gpa: '8.8'
    }
  ],
  experience: [
    {
      title: 'Data Science Intern',
      company: 'Starvic Edu Tech Llp',
      location: 'Remote',
      start: 'Nov 2024',
      end: 'Jan 2025',
      bullets: [
        'Developed proficiency in using Python libraries such as Pandas, NumPy, Scikit-learn, and Matplotlib for data science tasks.',
        'Gained exposure to industry practices through active participation in project-based learning and mentorship sessions.',
        'Worked on real-world data science projects and gained hands-on experience with machine learning workflows.'
      ]
    },
    {
      title: 'Web Development Intern',
      company: 'Octanet Services',
      location: 'Remote',
      start: 'Sept 2024',
      end: 'Oct 2024',
      bullets: [
        'Assisted in coding, debugging, and UI enhancements; collaborated with stakeholders and contributed to documentation.',
        'Gained hands-on experience with modern web technologies and improved overall understanding of web application architecture.',
        'Worked on frontend and backend development using HTML, CSS, JavaScript, and various web frameworks.'
      ]
    }
  ],
  projects: [
    {
      name: 'Dr HeAlify AI – Intelligent Medical Assistant',
      year: '2024',
      tech: ['Python', 'Flask', 'LLMs', 'LangChain', 'RAG', 'Random Forest'],
      bullets: [
        'Developed a Flask-based healthcare chatbot using Python, LLMs (LLaMA, LangChain, RAG).',
        'Built modules for Symptom Checker, BMI Calculator, Health Monitoring, and Condition Explainer.',
        'Achieved 96.58% accuracy in disease prediction using Random Forest algorithm.'
      ],
      links: {
        live: 'https://vaibhav88614.github.io/dr-healify-ai',
        source: 'https://github.com/vaibhav88614/dr-healify-ai'
      }
    },
    {
      name: 'Plagiarism Checker using ML',
      year: '2024',
      tech: ['Python', 'Flask', 'NLP', 'Naïve Bayes', 'SVM', 'Random Forest'],
      bullets: [
        'Developed an NLP-driven plagiarism detection tool using Python, ML models (Naïve Bayes, SVM, Random Forest).',
        'Built a Flask web app for real-time analysis with similarity scoring and highlighting.',
        'Implemented advanced text processing and machine learning algorithms for accurate plagiarism detection.'
      ],
      links: {
        live: 'https://vaibhav88614.github.io/plagiarism-checker',
        source: 'https://github.com/vaibhav88614/plagiarism-checker-ml'
      }
    }
  ],
  certifications: [
    { name: 'GenAI Powered Data Analytics - Tata (2025)', link: 'https://www.tcs.com/certificate' },
    { name: 'Web Development - Octanet Services (2024)', link: 'https://www.octanet.in/certificate' },
    { name: 'AWS Certified Cloud Practitioner - AWS (2023)', link: 'https://www.credly.com/badges/aws-certified-cloud-practitioner' }
  ],
  contact: {
    email: 'raghupatil9036@gmail.com',
    portfolio: 'https://raghavendra-patil.github.io/',
    location: 'India',
    phone: '+91 9108969917'
  }
} as const;

export type ResumeData = typeof resume;
