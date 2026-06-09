export interface Project {
  title: string;
  category: 'web3' | 'systems' | 'frontend' | 'tooling';
  description: string;
  tech: string[];
  githubUrl: string;
  demoUrl?: string;
}

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
