'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, BookOpen, Clock, Calendar, Edit } from 'lucide-react';
import { getArticleBySlug, Article } from '@/lib/apex';
import { MarkdownRenderer } from '@/components/MarkdownEditor';

export default function ArticleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('apex_token');
      setIsAuthenticated(!!token);
    }
  }, []);

  useEffect(() => {
    if (slug) {
      getArticleBySlug(slug).then((data) => {
        setArticle(data);
        setIsLoading(false);
      });
    }
  }, [slug]);

  if (isLoading) {
    return (
      <div className="flex h-[40vh] flex-col items-center justify-center gap-4 text-center font-mono">
        <Loader2 className="w-8 h-8 animate-spin text-[#32ff84]" />
        <p className="text-xs uppercase font-black tracking-widest text-black">RETRACTING ARTICLE VECTOR...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-3xl mx-auto border-[3px] border-black bg-white p-12 text-center shadow-[6px_6px_0px_0px_#000000] my-8 font-mono">
        <BookOpen className="w-12 h-12 mx-auto mb-4 text-rose-500" />
        <h3 className="font-display font-black text-2xl uppercase mb-2">ARTICLE NOT FOUND</h3>
        <p className="text-xs font-bold text-neutral-500 uppercase mb-6">
          The requested document &quot;{slug}&quot; does not exist in the ledger.
        </p>
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 px-6 py-3 bg-black text-[#32ff84] border-2 border-black font-black text-xs uppercase shadow-[3px_3px_0px_0px_#000000] hover:bg-[#32ff84] hover:text-black transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> RETURN TO DOCS
        </button>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 mb-12">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-black font-mono font-bold text-xs uppercase shadow-[2px_2px_0px_0px_#000000] hover:bg-[#32ff84] transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> BACK TO ALL DOCS
        </button>

        {isAuthenticated && (
          <Link
            href={`/docs/${article.slug}/edit`}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-black text-[#32ff84] border-2 border-black font-mono font-black text-xs uppercase shadow-[2px_2px_0px_0px_#000000] hover:bg-[#32ff84] hover:text-black transition-all"
          >
            <Edit className="w-4 h-4" /> EDIT ARTICLE
          </Link>
        )}
      </div>

      <div className="border-[3px] border-black bg-white p-6 sm:p-10 shadow-[8px_8px_0px_0px_#000000]">
        <div className="flex flex-wrap items-center gap-4 mb-4 border-b-2 border-black pb-4 text-xs font-mono font-bold text-neutral-600 uppercase">
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-black" /> {article.readTime || '5 min read'}
          </span>
          {article.created && (
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-black" /> {new Date(article.created).toLocaleDateString()}
            </span>
          )}
        </div>

        <h1 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight text-black mb-6">
          {article.title}
        </h1>

        <div className="p-4 border-l-4 border-[#32ff84] bg-neutral-50 border-2 border-black font-mono text-sm font-semibold text-neutral-800 mb-8 shadow-[3px_3px_0px_0px_#000000]">
          {article.summary}
        </div>

        <MarkdownRenderer content={article.content} />

        {article.tags && article.tags.length > 0 && (
          <div className="mt-8 pt-6 border-t-2 border-black flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-black uppercase text-neutral-500 mr-2">TAGS:</span>
            {article.tags.map((tag) => (
              <span key={tag} className="text-xs font-mono font-bold bg-[#32ff84] text-black border-2 border-black px-2.5 py-1 uppercase shadow-[2px_2px_0px_0px_#000000]">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}