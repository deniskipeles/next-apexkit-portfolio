'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Calendar, Clock, Loader2, FileText, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getApexClient } from '@/lib/apex';

interface Article {
  title: string;
  slug: string;
  summary: string;
  content: string;
  readTime: string;
  tags: string[];
  created: string;
}

const FALLBACK_ARTICLES: Article[] = [
  {
    title: 'Architecting a Swahili compiler in Zig',
    slug: 'architecting-swalang-zig',
    summary: 'A deep dive into lexing, parsing, and code-generation pipelines inside Swalang V2 using the Zig toolchain.',
    content: 'Swalang V2 utilizes a custom recursive-descent parser written from scratch in Zig. The lexer maps Swahili syntax tokens—such as "andika" (print), "kama" (if), and "kwa" (for)—into a strictly typed Abstract Syntax Tree (AST). By avoiding heavy dependencies, the entire compiler compiles down to a single 1.4MB binary, producing execution performance on par with native platform threads.',
    readTime: '6 min read',
    tags: ['zig', 'compilers', 'swalang'],
    created: '2026-06-10T12:00:00.000Z'
  },
  {
    title: 'Inside ApexKit: Realtime WS Sync Topologies',
    slug: 'inside-apexkit-realtime-ws',
    summary: 'How ApexKit leverages Rust-broadcast loops and the SQLite Session extension to multiplex transactional changesets.',
    content: 'ApexKit implements real-time data sync using an in-memory broadcast channel coupled directly with SQLite write transactions. When a client performs a write, the SQLite session extension computes a binary changeset. This changeset is instantly dispatched through active WebSocket rooms, allowing connected replicas and frontends to hydrate their state sub-milliseconds without triggering database polling loops.',
    readTime: '8 min read',
    tags: ['rust', 'websockets', 'realtime'],
    created: '2026-06-08T09:30:00.000Z'
  }
];

export default function DocsPage() {
  const [articles, setArticles] = useState<Article[]>(FALLBACK_ARTICLES);
  const [activeArticle, setActiveArticle] = useState<Article>(FALLBACK_ARTICLES[0]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      const client = getApexClient();
      if (!client) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await client.collection('articles').list({ per_page: 20 });
        if (res && res.items && res.items.length > 0) {
          const parsed: Article[] = res.items.map((item: any) => {
            const data = item.data || item;
            return {
              title: data.title || 'Untitled Article',
              slug: data.slug || 'untitled',
              summary: data.summary || '',
              content: data.content || '',
              readTime: data.readTime || '5 min read',
              tags: Array.isArray(data.tags) ? data.tags : [],
              created: item.created || new Date().toISOString()
            };
          });
          setArticles(parsed);
          setActiveArticle(parsed[0]);
        }
      } catch (err) {
        console.warn('[Docs] Failed to load articles. Fallback active.', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchArticles();
  }, []);

  return (
    <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-6 h-6 bg-[#32ff84] border-[3px] border-black flex-shrink-0 shadow-[2px_2px_0px_0px_#000000]" />
        <h3 className="font-display font-black tracking-tight text-2xl uppercase">DEVELOPER LOGS & DOCS</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left column: Article List */}
        <div className="lg:col-span-5 space-y-4">
          <p className="text-xs font-mono font-black text-neutral-500 uppercase tracking-widest mb-2">
            SELECT REPOSITORY ENTRY
          </p>

          {isLoading ? (
            <div className="border-[3px] border-black bg-white p-12 text-center flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-[#32ff84]" />
              <span className="font-mono text-xs font-bold">QUERYING DATABASE...</span>
            </div>
          ) : (
            articles.map((article) => (
              <div
                key={article.slug}
                onClick={() => setActiveArticle(article)}
                className={cn(
                  "border-[3px] border-black p-5 cursor-pointer transition-all duration-150 relative group",
                  activeArticle.slug === article.slug
                    ? "bg-[#32ff84] text-black shadow-[4px_4px_0px_0px_#000000]"
                    : "bg-white text-black shadow-[3px_3px_0px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#000000]"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold opacity-75">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(article.created).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold opacity-75">
                    <Clock className="w-3.5 h-3.5" />
                    {article.readTime}
                  </div>
                </div>

                <h4 className="font-display font-black text-base uppercase mb-2 group-hover:underline">
                  {article.title}
                </h4>
                <p className="text-xs font-semibold opacity-80 leading-relaxed line-clamp-2">
                  {article.summary}
                </p>

                <div className="flex flex-wrap gap-1.5 mt-4">
                  {article.tags.map(t => (
                    <span key={t} className="text-[9px] font-mono font-bold bg-white text-black border border-black px-1.5 py-0.5 lowercase">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right column: Active Article Viewer */}
        <div className="lg:col-span-7 border-[3px] border-black bg-white p-6 sm:p-8 shadow-[6px_6px_0px_0px_#000000] min-h-[400px]">
          {activeArticle ? (
            <article className="prose max-w-none">
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono font-bold text-neutral-500 uppercase mb-4 border-b-2 border-dashed border-black pb-4">
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(activeArticle.created).toLocaleDateString()}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {activeArticle.readTime}</span>
                <span>•</span>
                <span className="bg-[#32ff84] text-black border border-black px-1.5 py-0.5">DOCS_MODE</span>
              </div>

              <h2 className="font-display font-black text-2xl sm:text-4xl text-black uppercase tracking-tight leading-none mb-6">
                {activeArticle.title}
              </h2>

              <p className="font-mono text-xs font-bold text-neutral-600 bg-neutral-50 border-2 border-black p-4 mb-8 leading-relaxed">
                <span className="text-black font-black uppercase block mb-1">TL;DR Summary</span>
                {activeArticle.summary}
              </p>

              <div className="text-sm font-semibold leading-relaxed text-neutral-800 whitespace-pre-wrap">
                {activeArticle.content}
              </div>
            </article>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center py-20 text-neutral-400 gap-3">
              <FileText className="w-12 h-12 opacity-30" />
              <p className="font-mono text-sm">Select an entry from the ledger to begin reading.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}