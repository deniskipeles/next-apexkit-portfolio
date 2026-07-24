import { ApexKit } from '@apexkit/sdk';
import {
  Project, PROJECTS,
  SkillCategory, SKILLS,
  AboutData, ABOUT,
  HomeHeroData, HOME_HERO
} from './data';

export interface Article {
  id: string | number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  readTime?: string;
  tags?: string[];
  created?: string;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';
const TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID || 'portfolio';

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

export async function getHomeHero(): Promise<HomeHeroData> {
  const client = getApexClient();
  if (!client) {
    return HOME_HERO;
  }

  try {
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

export async function getArticles(page = 1, perPage = 6, query = ''): Promise<{ items: Article[]; total: number }> {
  const client = getApexClient();
  if (!client) return { items: [], total: 0 };

  try {
    if (query.trim()) {
      const searchRes = await client.collection('articles').searchRecordsWithOSE(query, {
        page,
        per_page: perPage,
      });

      const items = (searchRes.items || []).map((item: any) => ({
        id: item.id,
        title: item.data?.title || item.title || 'Untitled',
        slug: item.data?.slug || item.slug || String(item.id),
        summary: item.data?.summary || item.summary || '',
        content: item.data?.content || item.content || '',
        readTime: item.data?.readTime || item.readTime || '5 min',
        tags: item.data?.tags || item.tags || [],
        created: item.created || item.data?.created,
      }));

      return { items, total: searchRes.total || items.length };
    }

    const res = await client.collection('articles').list({
      page,
      per_page: perPage,
      sort: '-id',
    });

    const items = (res.items || []).map((item: any) => ({
      id: item.id,
      title: item.data?.title || item.title || 'Untitled',
      slug: item.data?.slug || item.slug || String(item.id),
      summary: item.data?.summary || item.summary || '',
      content: item.data?.content || item.content || '',
      readTime: item.data?.readTime || item.readTime || '5 min',
      tags: item.data?.tags || item.tags || [],
      created: item.created || item.data?.created,
    }));

    return { items, total: res.total || 0 };
  } catch (error) {
    console.error('[ApexKit] Failed to fetch articles:', error);
    return { items: [], total: 0 };
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const client = getApexClient();
  if (!client) return null;

  try {
    const filter = JSON.stringify({ slug: { $eq: slug } });
    const res = await client.collection('articles').list({ filter, per_page: 1 });

    if (res.items && res.items.length > 0) {
      const item = res.items[0];
      return {
        id: item.id,
        title: item.data?.title || item.title || 'Untitled',
        slug: item.data?.slug || item.slug || slug,
        summary: item.data?.summary || item.summary || '',
        content: item.data?.content || item.content || '',
        readTime: item.data?.readTime || item.readTime || '5 min',
        tags: item.data?.tags || item.tags || [],
        created: item.created || item.data?.created,
      };
    }
  } catch (error) {
    console.error(`[ApexKit] Failed to fetch article "${slug}":`, error);
  }

  return null;
}

export async function createArticle(data: {
  title: string;
  summary: string;
  content: string;
  readTime?: string;
  tags?: string[];
  slug?: string;
}): Promise<any> {
  const client = getApexClient();
  if (!client) throw new Error('ApexKit client not available');
  const token = typeof window !== 'undefined' ? localStorage.getItem('apex_token') : null;
  if (token) client.setToken(token);

  return await client.collection('articles').create(data);
}

export async function updateArticle(
  recordId: string | number,
  data: {
    title?: string;
    summary?: string;
    content?: string;
    readTime?: string;
    tags?: string[];
    slug?: string;
  }
): Promise<any> {
  const client = getApexClient();
  if (!client) throw new Error('ApexKit client not available');
  const token = typeof window !== 'undefined' ? localStorage.getItem('apex_token') : null;
  if (token) client.setToken(token);

  return await client.collection('articles').update(recordId, data);
}

export async function deleteArticle(recordId: string | number): Promise<any> {
  const client = getApexClient();
  if (!client) throw new Error('ApexKit client not available');
  const token = typeof window !== 'undefined' ? localStorage.getItem('apex_token') : null;
  if (token) client.setToken(token);

  return await client.collection('articles').delete(recordId);
}