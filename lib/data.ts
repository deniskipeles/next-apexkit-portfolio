export interface Project {
  title: string;
  category: 'web3' | 'systems' | 'frontend' | 'tooling';
  description: string;
  tech: string[];
  githubUrl: string;
  demoUrl?: string;
}

export interface SkillCategory {
  category: 'languages' | 'backend' | 'frontend' | 'infrastructure';
  title: string;
  colorClass: string; // e.g. bg-[#32ff84], bg-teal-300, etc.
  skills: string[];
}

export interface AboutData {
  headline: string;
  description: string;
  highlights: {
    text: string;
    color: string; // #32ff84, teal-300, etc.
  }[];
}

export interface HomeTickerMetric {
  key: string;
  module: string;
  load: number;
  latency: string;
  status: 'optimal' | 'warning' | 'critical';
}

export interface HomeHeroData {
  title: string;
  subheading: string;
  ticker: HomeTickerMetric[];
}

// Fallback / Mock Data sources
export const PROJECTS: Project[] = [
  {
    title: 'swalang-beta',
    category: 'systems',
    description: 'A Swahili-based programming language interpreter written in Golang and shared libraries in C.',
    tech: ['Golang', 'C', 'Interpreter', 'Compilers'],
    githubUrl: 'https://github.com/deniskipeles/swalang-beta'
  },
  {
    title: 'swalang',
    category: 'systems',
    description: 'A Swahili-based programming language interpreter written in Zig and shared libraries in C. Released as Version 2.',
    tech: ['Zig', 'C', 'Interpreter', 'Optimizations'],
    githubUrl: 'https://github.com/deniskipeles/swalang'
  },
  {
    title: 'apexkit',
    category: 'systems',
    description: 'ApexKit is a Backend-as-a-Service (BaaS) with database, authentication, file storage, real-time channels, serverless scripts, and AI vector engines. Automatically manages authentication headers and handles scoping context (Root, Tenant, and Sandbox spaces) behind the scenes.',
    tech: ['Rust', 'BaaS', 'AI Vector', 'WebSockets'],
    githubUrl: 'https://github.com/deniskipeles/apexkit'
  },
  {
    title: 'swalang-page-apexkit-next',
    category: 'frontend',
    description: 'A swalang page that uses ApexKit as a backend and is written in Next.js.',
    tech: ['Next.js', 'React', 'ApexKit', 'Tailwind'],
    githubUrl: 'https://github.com/deniskipeles/swalang-page-apexkit-next',
    demoUrl: 'https://swalang.vercel.app'
  },
  {
    title: 'apexhub',
    category: 'frontend',
    description: 'An ApexKit hub page that uses ApexKit as a backend, managing database environments and analytics logs.',
    tech: ['Next.js', 'React', 'ApexKit', 'Web3 UI'],
    githubUrl: 'https://github.com/deniskipeles/apexhub',
    demoUrl: 'https://apexkit-hub.vercel.app'
  },
  {
    title: 'apexkit-js-sdk',
    category: 'tooling',
    description: 'A high-performance TypeScript/JavaScript SDK to easily interact with the ApexKit BaaS API platforms.',
    tech: ['TypeScript', 'BaaS SDK', 'NodeJS', 'WebSockets'],
    githubUrl: 'https://github.com/deniskipeles/apexkit-js-sdk'
  }
];

export const SKILLS: SkillCategory[] = [
  {
    category: 'languages',
    title: 'LANGUAGES',
    colorClass: 'bg-[#32ff84]',
    skills: ['Zig', 'Rust', 'Go', 'TypeScript', 'C', 'SQL', 'Python', 'Shell Scripting']
  },
  {
    category: 'backend',
    title: 'BACKEND',
    colorClass: 'bg-teal-300',
    skills: ['BaaS Engines', 'Interpreter Lab', 'WebSockets', 'Realtime Channels', 'Go APIs', 'JWT & Credentials Scoping', 'Redis Cache', 'Serverless Scripts']
  },
  {
    category: 'frontend',
    title: 'FRONTEND',
    colorClass: 'bg-yellow-300',
    skills: ['Next.js 15', 'React 19', 'Tailwind CSS', 'Framer Motion', 'ApexKit SDK Integration', 'Dynamic Charts', 'Web3 UI Architecture', 'State Hydration']
  },
  {
    category: 'infrastructure',
    title: 'INFRASTRUCTURE',
    colorClass: 'bg-sky-300',
    skills: ['Zig Build', 'Cargo Toolchain', 'Docker Pipelines', 'AI Vector DBs', 'Vercel Deployments', 'Unit/Integration Tests', 'GitHub Actions']
  }
];

export const ABOUT: AboutData = {
  headline: 'I am a Full-Stack Systems Engineer specializing in low-level compilers, Swahili programming environment interpreters, and high-performance Rust-based BaaS infrastructure.',
  description: 'As the creator of swalang and apexkit, I build custom compiler architectures in Zig, Go, and Rust. I thrive at the intersection of custom platform runtime engines and ultra-slick web portals that leverage them. My work focuses on sub-millisecond execution speeds, automated environment scoping (Root, Tenant, and Sandbox regions), and highly intuitive next-generation developer tooling.',
  highlights: [
    {
      text: 'Advanced compiler & interpreter design using Zig, Go, and C shared libraries',
      color: '#32ff84'
    },
    {
      text: 'BaaS construction in Rust featuring custom real-time socket channels and vector engines',
      color: 'teal-300'
    },
    {
      text: 'Next-generation frontend dashboards with real-time multi-tenant credentials mapping',
      color: 'yellow-300'
    },
    {
      text: 'API tooling creation with modular TypeScript SDKs for custom platform integrations',
      color: 'sky-300'
    }
  ]
};

export const HOME_HERO: HomeHeroData = {
  title: 'I BUILD CUSTOM INTERPRETERS & SOUPED-UP BACKEND ENGINE FABRICS.',
  subheading: 'Creator of swalang and apexkit. Specialist in compiling high-speed interpreters (Zig/Go), managing complex multi-tenant BaaS contexts behind the scenes, and organizing modular JavaScript SDK pipelines.',
  ticker: [
    { key: 'APEXKIT-RUST', module: 'BaaS Realtime', load: 18.2, latency: '3ms', status: 'optimal' },
    { key: 'SWALANG-ZIG', module: 'V2 Compiler', load: 8.4, latency: '1ms', status: 'optimal' },
    { key: 'SWALANG-BETA', module: 'Go Interpreter', load: 34.5, latency: '5ms', status: 'optimal' },
    { key: 'APEXKIT-JS-SDK', module: 'TS Query Engine', load: 11.2, latency: '2ms', status: 'optimal' }
  ]
};
