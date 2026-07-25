'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, Loader2, BookOpen, ArrowRight, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { getArticles, Article } from '@/lib/apex';

function DocsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Read current page and search query directly from URL parameters
  const urlPage = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const urlQuery = searchParams.get('q') || '';

  const [articles, setArticles] = useState<Article[]>([]);
  const [total, setTotal] = useState(0);
  const [searchInput, setSearchInput] = useState(urlQuery);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const perPage = 6;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('apex_token');
      setIsAuthenticated(!!token);
    }
  }, []);

  // Synchronize local input state whenever the URL query parameter changes
  useEffect(() => {
    setSearchInput(urlQuery);
  }, [urlQuery]);

  const loadDocs = useCallback(async (p: number, q: string) => {
    setIsLoading(true);
    const { items, total: totalCount } = await getArticles(p, perPage, q);
    setArticles(items);
    setTotal(totalCount);
    setIsLoading(false);
  }, [perPage]);

  useEffect(() => {
    loadDocs(urlPage, urlQuery);
  }, [urlPage, urlQuery, loadDocs]);

  // Helper to push state changes to URL query parameters
  const updateUrl = (newPage: number, newQuery: string) => {
    const params = new URLSearchParams();
    if (newPage > 1) {
      params.set('page', newPage.toString());
    }
    if (newQuery.trim()) {
      params.set('q', newQuery.trim());
    }

    const queryString = params.toString();
    router.push(`/docs${queryString ? `?${queryString}` : ''}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrl(1, searchInput);
  };

  const handlePageChange = (newPage: number) => {
    updateUrl(newPage, urlQuery);
  };

  const totalPages = Math.ceil(total / perPage);

  return (
    <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-[#32ff84] border-[3px] border-black flex-shrink-0 shadow-[2px_2px_0px_0px_#000000]" />
          <h3 className="font-display font-black tracking-tight text-2xl uppercase">DOCUMENTATION &amp; ARTICLES</h3>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {isAuthenticated && (
            <Link
              href="/docs/new"
              className="px-4 py-2 bg-[#32ff84] text-black border-2 border-black font-mono font-black text-xs uppercase shadow-[2px_2px_0px_0px_#000000] hover:bg-black hover:text-[#32ff84] transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> CREATE ARTICLE
            </Link>
          )}

          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search documentation..."
                className="bg-white border-2 border-black p-2 pl-8 font-mono text-xs font-bold uppercase focus:outline-none focus:shadow-[2px_2px_0px_0px_#32ff84] transition-all w-48 sm:w-64"
              />
              <Search className="w-4 h-4 text-black absolute left-2.5 top-2.5" />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-black text-[#32ff84] border-2 border-black font-mono font-black text-xs uppercase shadow-[2px_2px_0px_0px_#000000] hover:bg-[#32ff84] hover:text-black transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
            >
              SEARCH
            </button>
          </form>
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-[30vh] flex-col items-center justify-center gap-4 text-center font-mono">
          <Loader2 className="w-8 h-8 animate-spin text-[#32ff84]" />
          <p className="text-xs uppercase font-black tracking-widest text-black">QUERYING DOCUMENTATION VECTORS...</p>
        </div>
      ) : articles.length === 0 ? (
        <div className="border-[3px] border-black bg-white p-12 text-center shadow-[5px_5px_0px_0px_#000000]">
          <BookOpen className="w-12 h-12 mx-auto mb-4 text-neutral-400" />
          <h4 className="font-display font-black text-xl uppercase mb-2">NO DOCUMENTS FOUND</h4>
          <p className="font-mono text-xs text-neutral-500 uppercase">
            No articles match your search query &quot;{urlQuery}&quot;.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {articles.map((article) => (
              <div
                key={article.slug}
                className="border-[3px] border-black bg-white p-6 shadow-[5px_5px_0px_0px_#000000] flex flex-col justify-between hover:shadow-[8px_8px_0px_0px_#32ff84] hover:-translate-y-1 transition duration-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-3 border-b-2 border-dotted border-black pb-2">
                    <span className="text-[10px] font-mono font-black uppercase text-neutral-500">
                      {article.readTime || '5 min read'}
                    </span>
                    {article.created && (
                      <span className="text-[9px] font-mono font-bold px-2 py-0.5 bg-neutral-100 border border-black">
                        {new Date(article.created).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  <h4 className="font-display font-black text-lg uppercase tracking-tight text-black mb-3">
                    {article.title}
                  </h4>

                  <p className="font-mono text-xs font-medium text-neutral-700 leading-relaxed mb-6 line-clamp-3">
                    {article.summary}
                  </p>
                </div>

                <div>
                  {article.tags && article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {article.tags.map((tag) => (
                        <span key={tag} className="text-[9px] font-mono font-bold bg-[#32ff84]/20 border border-black px-1.5 py-0.5 uppercase">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <Link
                    href={`/docs/${article.slug}`}
                    className="w-full flex items-center justify-center gap-2 bg-black hover:bg-[#32ff84] text-white hover:text-black py-2.5 font-mono font-black text-xs border-2 border-black shadow-[2px_2px_0px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all uppercase"
                  >
                    READ ARTICLE
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-[3px] border-black bg-white p-4 shadow-[4px_4px_0px_0px_#000000] font-mono text-xs font-bold uppercase">
              <button
                disabled={urlPage <= 1}
                onClick={() => handlePageChange(urlPage - 1)}
                className="px-3 py-1.5 bg-white border-2 border-black flex items-center gap-1 hover:bg-[#32ff84] disabled:opacity-40 disabled:hover:bg-white shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
              >
                <ChevronLeft className="w-4 h-4" /> PREV
              </button>

              <span>
                PAGE {urlPage} OF {totalPages} ({total} TOTAL DOCS)
              </span>

              <button
                disabled={urlPage >= totalPages}
                onClick={() => handlePageChange(urlPage + 1)}
                className="px-3 py-1.5 bg-white border-2 border-black flex items-center gap-1 hover:bg-[#32ff84] disabled:opacity-40 disabled:hover:bg-white shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
              >
                NEXT <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default function DocsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-[30vh] flex-col items-center justify-center gap-4 text-center font-mono">
          <Loader2 className="w-8 h-8 animate-spin text-[#32ff84]" />
          <p className="text-xs uppercase font-black tracking-widest text-black">PARSING DOCUMENTATION ROUTE...</p>
        </div>
      }
    >
      <DocsPageContent />
    </Suspense>
  );
}