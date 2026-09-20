import {
  Project,
  ExperienceItem,
  EducationItem,
  CertificationItem,
  SkillCategory,
  Book,
  TransactionRecord,
  ProductItem,
  BankTransaction,
} from '../types';

export const PERSONAL_INFO = {
  name: 'Priyadarshan Baral',
  title: 'MERN Stack Full Stack Developer',
  subTitle: 'Frontend & Backend Specialist',
  location: 'Bhubaneswar, Odisha, India',
  phone: '8984054385',
  phoneFormatted: '+91 89840 54385',
  email: 'priyadrshanbaral@gmail.com',
  linkedin: 'https://linkedin.com/in/priyadarshan-baral',
  github: 'https://github.com/priyadarshanbaral',
  status: 'Open for Junior / Fresher Full Stack Roles',
  summary:
    'Full Stack Developer with hands-on MERN stack experience (MongoDB, Express.js, React.js, Node.js) gained through a live internship and three end-to-end projects. Comfortable across the full request/response cycle — building responsive React interfaces, designing RESTful APIs in Express, and modeling data in MongoDB. Familiar with Git-based version control. Seeking a Junior/Fresher Full Stack Developer role to contribute production-ready code from day one.',
  languages: [
    { name: 'English', proficiency: 'Professional' },
    { name: 'Hindi', proficiency: 'Professional' },
    { name: 'Odia', proficiency: 'Native' },
  ],
};

export const PROJECTS_DATA: Project[] = [
  {
    id: 'library-management',
    title: 'Library Management System',
    tagline: 'End-to-end MERN stack system for automated book tracking, user management, and fine calculation.',
    category: 'MERN Stack',
    stack: ['MongoDB', 'Express.js', 'React.js', 'Node.js', 'Mongoose', 'REST API'],
    description:
      'Built a full-stack library management web application designed for academic libraries and study centers. Features comprehensive book issue/return workflows, patron management, real-time inventory queries, and automated overdue fine calculations.',
    highlights: [
      'Built a full-stack library management web application with book issue/return, user management, search, and fine calculation',
      'Designed RESTful APIs with Node.js and Express.js for CRUD operations on books, users, and transactions',
      'Modeled relational data (users, books, transactions) in MongoDB using Mongoose schemas with indexed searches',
      'Built a responsive React.js frontend consuming the API for real-time state updates and instant inventory status',
    ],
    githubUrl: 'https://github.com/priyadarshanbaral',
    liveSimType: 'library',
    color: 'emerald',
  },
  {
    id: 'online-shopping',
    title: 'Online Shopping Website',
    tagline: 'High-performance responsive e-commerce web application with client-side state and simulated payment flow.',
    category: 'Frontend',
    stack: ['HTML5', 'CSS3', 'JavaScript', 'Responsive UI', 'State Management'],
    description:
      'Developed a responsive e-commerce interface with product browsing, dynamic filtering, interactive shopping cart, promo coupon evaluation, and a simulated checkout and invoice generation workflow.',
    highlights: [
      'Developed a responsive e-commerce interface with product browsing, category filtering, cart, and simulated checkout flow',
      'Implemented robust client-side state handling for shopping cart and persistent order records using vanilla JavaScript',
      'Designed responsive product grid cards and checkout drawers optimized across mobile, tablet, and desktop viewports',
      'Engineered dynamic subtotal, tax calculation, and promotional discount voucher logic',
    ],
    githubUrl: 'https://github.com/priyadarshanbaral',
    liveSimType: 'ecommerce',
    color: 'amber',
  },
  {
    id: 'banking-website',
    title: 'Banking Website (Front-End Simulation)',
    tagline: 'Clean, accessible digital banking interface featuring account overview and simulated money transfers.',
    category: 'Frontend',
    stack: ['HTML5', 'CSS3', 'JavaScript', 'Clean UI', 'DOM Manipulation'],
    description:
      'Engineered an intuitive simulated retail banking portal showcasing account balances, deposit/withdrawal logs, beneficiary fund transfers with validation, and debit card security controls.',
    highlights: [
      'Built a basic banking interface with account details display and simulated transaction flow',
      'Focused on clean, accessible UI and cross-device responsive design with WCAG compliant contrast',
      'Implemented live validation for account numbers, IFSC codes, and transfer limits with instant feedback',
      'Provided simulated statement export, balance history filter, and debit card freeze/unfreeze state management',
    ],
    githubUrl: 'https://github.com/priyadarshanbaral',
    liveSimType: 'banking',
    color: 'cyan',
  },
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: 'Languages',
    items: [
      { name: 'JavaScript (ES6+)', level: 'Advanced' },
      { name: 'HTML5', level: 'Advanced' },
      { name: 'CSS3', level: 'Advanced' },
    ],
  },
  {
    title: 'Frontend Development',
    items: [
      { name: 'React.js', level: 'Advanced' },
      { name: 'React Hooks', level: 'Advanced' },
      { name: 'State Management', level: 'Advanced' },
      { name: 'Responsive Web Design', level: 'Advanced' },
      { name: 'Tailwind CSS', level: 'Proficient' },
    ],
  },
  {
    title: 'Backend Development',
    items: [
      { name: 'Node.js', level: 'Proficient' },
      { name: 'Express.js', level: 'Proficient' },
      { name: 'REST APIs', level: 'Advanced' },
      { name: 'CRUD Operations', level: 'Advanced' },
      { name: 'API Middleware', level: 'Proficient' },
    ],
  },
  {
    title: 'Databases & Modeling',
    items: [
      { name: 'MongoDB', level: 'Proficient' },
      { name: 'Mongoose ODM', level: 'Proficient' },
      { name: 'Data Modeling & Schemas', level: 'Proficient' },
      { name: 'Aggregation Pipelines', level: 'Familiar' },
    ],
  },
  {
    title: 'Tools & Version Control',
    items: [
      { name: 'Git', level: 'Advanced' },
      { name: 'GitHub', level: 'Advanced' },
      { name: 'VS Code', level: 'Advanced' },
      { name: 'Postman API Client', level: 'Proficient' },
    ],
  },
  {
    title: 'Deployment & Hosting',
    items: [
      { name: 'Netlify', level: 'Proficient' },
      { name: 'Vercel / Cloud Run', level: 'Proficient' },
      { name: 'Environment Configs', level: 'Proficient' },
    ],
  },
  {
    title: 'Soft Skills',
    items: [
      { name: 'Communication' },
      { name: 'Teamwork & Collaboration' },
      { name: 'Problem Solving' },
      { name: 'Time Management' },
      { name: 'Adaptability & Quick Learning' },
    ],
  },
];

export const EXPERIENCES: ExperienceItem[] = [
  {
    id: 'vidyavistara-internship',
    role: 'MERN Stack Developer Intern',
    company: 'Vidyavistara Institute',
    location: 'Bhubaneswar, Odisha',
    period: 'January 2026 – Present',
    current: true,
    description: [
      'Building full-stack web applications with React.js frontends integrated to Express.js/Node.js REST APIs and MongoDB data models.',
      'Collaborating with a team on real-world project modules using Git for version control and Agile-style task tracking.',
      'Debugging and resolving issues across frontend, backend, and database layers to improve application reliability.',
      'Writing modular, reusable React components and optimizing REST endpoints for fast response times.',
    ],
    skills: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Git', 'Agile', 'REST APIs'],
  },
];

export const EDUCATION_LIST: EducationItem[] = [
  {
    id: 'btech',
    degree: 'Bachelor of Technology (B.Tech), Computer Science',
    institution: 'NM Institute of Engineering and Technology',
    location: 'Bhubaneswar, Odisha',
    period: '2023 – 2027 (Ongoing)',
    score: 'CGPA: 7.85 (up to 5th Semester)',
    current: true,
  },
  {
    id: '12th-science',
    degree: '12th (Science)',
    institution: 'Godavarish Higher Secondary School',
    location: 'Banpur, Odisha',
    period: '2021 – 2023',
    score: '65%',
  },
  {
    id: '10th-matriculation',
    degree: '10th (Matriculation)',
    institution: 'Godavarish Vidyapitha',
    location: 'Banpur, Odisha',
    period: '2020 – 2021',
    score: '73%',
  },
];

export const CERTIFICATIONS: CertificationItem[] = [
  {
    id: 'cert-webdev',
    title: 'Web Development Certification',
    issuer: 'Vidyavistara Institute',
    badgeType: 'Full Stack Development',
    skillsCovered: ['HTML5', 'CSS3', 'JavaScript', 'React.js', 'Node.js', 'Express', 'MongoDB'],
  },
  {
    id: 'cert-ai',
    title: 'Artificial Intelligence',
    issuer: 'IBM SkillsBuild',
    badgeType: 'Global Certification',
    skillsCovered: ['AI Fundamentals', 'Machine Learning Concepts', 'Ethical AI', 'Generative AI Applications'],
  },
  {
    id: 'cert-ai-tools',
    title: 'AI Tools Workshop',
    issuer: 'be10X',
    badgeType: 'Productivity & AI',
    skillsCovered: ['Prompt Engineering', 'Developer Productivity', 'Automation Workflows', 'Modern Tooling'],
  },
  {
    id: 'cert-dsa-mern',
    title: 'DSA & MERN Workshop',
    issuer: 'MyAnatomy',
    badgeType: 'Core Engineering',
    skillsCovered: ['Data Structures & Algorithms', 'MERN Architecture', 'System Logic', 'Optimization'],
  },
];

export const ACHIEVEMENTS = [
  {
    title: 'Hackathon Participant & Rapid Prototyper',
    description:
      'Participated in a regional Hackathon, gaining hands-on experience in team-based high-speed problem solving, architectural design, and rapid MVP prototyping under tight time constraints.',
    icon: 'Trophy',
  },
];

// Seed data for interactive simulators
export const INITIAL_BOOKS: Book[] = [
  {
    id: 'B101',
    title: 'Mastering Full-Stack React & Node',
    author: 'Alex Banks & Eve Porcello',
    isbn: '978-1491954621',
    category: 'Computer Science',
    available: true,
  },
  {
    id: 'B102',
    title: 'MongoDB: The Definitive Guide',
    author: 'Shannon Bradshaw & Kristina Chodorow',
    isbn: '978-1491954461',
    category: 'Databases',
    available: false,
    issuedTo: 'Rohan Sharma',
    issuedDate: '2026-03-01',
    dueDate: '2026-03-15',
  },
  {
    id: 'B103',
    title: 'Clean Code: Handbook of Agile Software Craftsmanship',
    author: 'Robert C. Martin',
    isbn: '978-0132350884',
    category: 'Software Engineering',
    available: true,
  },
  {
    id: 'B104',
    title: 'You Don\'t Know JS Yet: Scope & Closures',
    author: 'Kyle Simpson',
    isbn: '978-1985942479',
    category: 'JavaScript',
    available: false,
    issuedTo: 'Ananya Mishra',
    issuedDate: '2026-02-10',
    dueDate: '2026-02-24', // Overdue!
  },
  {
    id: 'B105',
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    isbn: '978-1449373320',
    category: 'Systems Architecture',
    available: true,
  },
  {
    id: 'B106',
    title: 'Express in Action: Node Applications with Express',
    author: 'Evan M. Hahn',
    isbn: '978-1617292422',
    category: 'Web Backend',
    available: true,
  },
];

export const INITIAL_PRODUCTS: ProductItem[] = [
  {
    id: 'p1',
    name: 'Mechanical Developer Keyboard (RGB)',
    category: 'Electronics',
    price: 3499,
    rating: 4.8,
    stock: 14,
    image: '⌨️',
  },
  {
    id: 'p2',
    name: 'Ultra-Wide Ergo Gaming Mouse',
    category: 'Accessories',
    price: 1299,
    rating: 4.6,
    stock: 22,
    image: '🖱️',
  },
  {
    id: 'p3',
    name: 'Noise-Cancelling Dev Headphones',
    category: 'Audio',
    price: 4999,
    rating: 4.9,
    stock: 8,
    image: '🎧',
  },
  {
    id: 'p4',
    name: 'MERN Stack Developer Desk Mat (XXL)',
    category: 'Accessories',
    price: 799,
    rating: 4.7,
    stock: 35,
    image: '🖥️',
  },
  {
    id: 'p5',
    name: 'Aluminum Laptop Riser Stand',
    category: 'Ergonomics',
    price: 1599,
    rating: 4.5,
    stock: 19,
    image: '📐',
  },
  {
    id: 'p6',
    name: 'Smart Ambient Monitor Light Bar',
    category: 'Electronics',
    price: 2199,
    rating: 4.8,
    stock: 12,
    image: '💡',
  },
];

export const INITIAL_BANK_TRANSACTIONS: BankTransaction[] = [
  {
    id: 'TXN-9021',
    date: '2026-03-18',
    description: 'Vidyavistara Institute - Internship Stipend',
    amount: 15000,
    type: 'credit',
    category: 'Income',
  },
  {
    id: 'TXN-9020',
    date: '2026-03-16',
    description: 'AWS / Cloud Hosting Subscription',
    amount: 850,
    type: 'debit',
    category: 'Developer Tools',
    recipient: 'Cloud Provider',
  },
  {
    id: 'TXN-9019',
    date: '2026-03-14',
    description: 'Bhubaneswar Tech Hub Bookshop',
    amount: 1450,
    type: 'debit',
    category: 'Education',
    recipient: 'Tech Books',
  },
  {
    id: 'TXN-9018',
    date: '2026-03-10',
    description: 'Online Food Delivery - Swiggy',
    amount: 320,
    type: 'debit',
    category: 'Food & Dining',
    recipient: 'Restaurant Hub',
  },
  {
    id: 'TXN-9017',
    date: '2026-03-05',
    description: 'Transfer from Savings Account',
    amount: 5000,
    type: 'credit',
    category: 'Self Transfer',
  },
];
