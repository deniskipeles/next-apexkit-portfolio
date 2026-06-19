import { ApexKit } from '@apexkit/sdk';
import {
  Project, PROJECTS,
  SkillCategory, SKILLS,
  AboutData, ABOUT,
  HomeHeroData, HOME_HERO
} from './data';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://kipeles-vs--5000.hf.space';
const TENANT_ID = 'portfolio';

// Initialize the SDK lazy-loaded
let apexClient: any = null;

export function getApexClient() {
  if (!apexClient) {
    try {
      const parent = new ApexKit(BACKEND_URL);
      apexClient = parent.tenant(TENANT_ID);
    } catch (e) {
      console.warn('[ApexKit] Client initialization failed:', e);
    }
  }
  return apexClient;
}

/**
 * Robust helper to fetch a collection with full resilience and standard fallbacks.
 */
async function fetchCollectionWithFallback<T>(
  collectionName: string,
  fallbackData: T[],
  mapper: (item: any) => T
): Promise<T[]> {
  const client = getApexClient();
  if (!client) {
    return fallbackData;
  }

  try {
    // Attempt fetching with a timeout to avoid hanging UI
    const fetchPromise = client.collection(collectionName).list({ per_page: 50 });
    const timeoutPromise = new Promise<null>((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), 4000)
    );

    const result = await Promise.race([fetchPromise, timeoutPromise]);

    if (result && result.items && Array.isArray(result.items) && result.items.length > 0) {
      return result.items.map(mapper);
    }
  } catch (error) {
    console.warn(`[ApexKit] Failed to fetch collection "${collectionName}". Falling back to static mock dataset.`, error);
  }

  return fallbackData;
}

/**
 * Fetch dynamic projects or fallback
 */
export async function getProjects(): Promise<Project[]> {
  return fetchCollectionWithFallback<Project>('projects', PROJECTS, (item) => {
    let techArray: string[] = [];
    if (Array.isArray(item.tech)) {
      techArray = item.tech;
    } else if (item.data && Array.isArray(item.data.tech)) {
      techArray = item.data.tech;
    } else if (typeof item.tech === 'string') {
      techArray = item.tech.split(',').map((s: string) => s.trim()).filter(Boolean);
    } else if (item.data && typeof item.data.tech === 'string') {
      techArray = item.data.tech.split(',').map((s: string) => s.trim()).filter(Boolean);
    }

    return {
      title: item.title || item.data?.title || 'untitled',
      category: (item.category || item.data?.category || 'systems') as Project['category'],
      description: item.description || item.data?.description || '',
      tech: techArray,
      githubUrl: item.githubUrl || item.github_url || item.data?.githubUrl || item.data?.github_url || '#',
      demoUrl: item.demoUrl || item.demo_url || item.data?.demoUrl || item.data?.demo_url
    };
  });
}

/**
 * Fetch dynamic skills or fallback
 */
export async function getSkills(): Promise<SkillCategory[]> {
  return fetchCollectionWithFallback<SkillCategory>('skills', SKILLS, (item) => {
    let skillsArray: string[] = [];
    if (Array.isArray(item.skills)) {
      skillsArray = item.skills;
    } else if (item.data && Array.isArray(item.data.skills)) {
      skillsArray = item.data.skills;
    } else if (typeof item.skills === 'string') {
      skillsArray = item.skills.split(',').map((s: string) => s.trim()).filter(Boolean);
    } else if (item.data && typeof item.data.skills === 'string') {
      skillsArray = item.data.skills.split(',').map((s: string) => s.trim()).filter(Boolean);
    }

    const category = (item.category || item.data?.category || 'languages') as SkillCategory['category'];
    const title = (item.title || item.data?.title || category.toUpperCase()) as string;

    // Set fallback brand color class based on category
    let colorClass = 'bg-[#32ff84]';
    if (category === 'backend') colorClass = 'bg-teal-300';
    if (category === 'frontend') colorClass = 'bg-yellow-300';
    if (category === 'infrastructure') colorClass = 'bg-sky-300';

    return {
      category,
      title,
      colorClass: item.colorClass || item.color_class || item.data?.colorClass || item.data?.color_class || colorClass,
      skills: skillsArray
    };
  });
}

/**
 * Fetch about page configuration info
 */
export async function getAbout(): Promise<AboutData> {
  const client = getApexClient();
  if (!client) {
    return ABOUT;
  }

  try {
    const fetchPromise = client.collection('about').list({ per_page: 5 });
    const timeoutPromise = new Promise<null>((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), 4000)
    );

    const result = await Promise.race([fetchPromise, timeoutPromise]);

    if (result && result.items && Array.isArray(result.items) && result.items.length > 0) {
      const item = result.items[0];
      const data = item.data || item;

      let parsedHighlights = ABOUT.highlights;
      if (typeof data.highlights === 'string') {
        try {
          parsedHighlights = JSON.parse(data.highlights);
        } catch (_) {
          parsedHighlights = data.highlights.split(',').map((h: string, idx: number) => ({
            text: h.trim(),
            color: idx % 4 === 0 ? '#32ff84' : idx % 4 === 1 ? 'teal-300' : idx % 4 === 2 ? 'yellow-300' : 'sky-300'
          }));
        }
      } else if (Array.isArray(data.highlights)) {
        parsedHighlights = data.highlights;
      }

      return {
        headline: data.headline || ABOUT.headline,
        description: data.description || ABOUT.description,
        highlights: parsedHighlights
      };
    }
  } catch (error) {
    console.warn('[ApexKit] Failed to fetch "about" info. Falling back to local about description.', error);
  }

  return ABOUT;
}

/**
 * Fetch home page content (hero & dynamic ticker targets)
 */
export async function getHomeHero(): Promise<HomeHeroData> {
  const client = getApexClient();
  if (!client) {
    return HOME_HERO;
  }

  try {
    // 1. Fetch home hero configurations from 'home_hero' collection if available
    const heroPromise = client.collection('home_hero').list({ per_page: 1 });
    const tickerPromise = client.collection('home_ticker').list({ per_page: 15 });

    const timeoutPromise = new Promise<null>((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), 4000)
    );

    const [heroRes, tickerRes] = await Promise.all([
      Promise.race([heroPromise, timeoutPromise]).catch(() => null),
      Promise.race([tickerPromise, timeoutPromise]).catch(() => null)
    ]);

    let title = HOME_HERO.title;
    let subheading = HOME_HERO.subheading;
    let ticker = HOME_HERO.ticker;

    if (heroRes && heroRes.items && heroRes.items.length > 0) {
      const hData = heroRes.items[0].data || heroRes.items[0];
      title = hData.title || title;
      subheading = hData.subheading || subheading;
    }

    if (tickerRes && tickerRes.items && tickerRes.items.length > 0) {
      ticker = tickerRes.items.map((t: any) => {
        const tData = t.data || t;
        return {
          key: tData.key || tData.ticker_key || 'NODE-METRIC',
          module: tData.module || 'System',
          load: Number(tData.load) || 10,
          latency: tData.latency || '5ms',
          status: (tData.status || 'optimal') as 'optimal' | 'warning' | 'critical'
        };
      });
    }

    return { title, subheading, ticker };
  } catch (error) {
    console.warn('[ApexKit] Failed to fetch home hero info. Falling back to default datasets.', error);
  }

  return HOME_HERO;
}
