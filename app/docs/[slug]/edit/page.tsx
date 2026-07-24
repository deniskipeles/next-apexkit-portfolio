'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, Save, AlertTriangle, Trash2 } from 'lucide-react';
import { getArticleBySlug, updateArticle, deleteArticle, Article } from '@/lib/apex';
import { MarkdownEditor } from '@/components/MarkdownEditor';

export default function EditArticlePage() {
  const params = useParams();
  const router = useRouter();
  const slugParam = params.slug as string;

  const [article, setArticle] = useState<Article | null>(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [readTime, setReadTime] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (slugParam) {
      getArticleBySlug(slugParam).then((data) => {
        if (data) {
          setArticle(data);
          setTitle(data.title);
          setSlug(data.slug);
          setSummary(data.summary);
          setContent(data.content);
          setReadTime(data.readTime || '5 min read');
          setTagsInput(data.tags ? data.tags.join(', ') : '');
        }
        setIsLoading(false);
      });
    }
  }, [slugParam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!article || !title || !summary || !content) return;

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const tags = tagsInput
        ? tagsInput.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean)
        : [];

      await updateArticle(article.id, {
        title,
        slug,
        summary,
        content,
        readTime,
        tags,
      });

      router.push(`/docs/${slug || slugParam}`);
    } catch (err: any) {
      console.error('[Edit Article Error]', err);
      setErrorMsg(err.message || 'Failed to update article.');
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!article) return;
    if (!confirm('Are you sure you want to permanently delete this article?')) return;

    setIsDeleting(true);
    try {
      await deleteArticle(article.id);
      router.push('/docs');
    } catch (err: any) {
      console.error('[Delete Article Error]', err);
      setErrorMsg(err.message || 'Failed to delete article.');
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[40vh] flex-col items-center justify-center gap-4 text-center font-mono">
        <Loader2 className="w-8 h-8 animate-spin text-[#32ff84]" />
        <p className="text-xs uppercase font-black tracking-widest text-black">RETRACTING ARTICLE DATA...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-3xl mx-auto border-[3px] border-black bg-white p-12 text-center shadow-[6px_6px_0px_0px_#000000] my-8 font-mono">
        <h3 className="font-display font-black text-2xl uppercase mb-2">ARTICLE NOT FOUND</h3>
        <Link
          href="/docs"
          className="inline-flex items-center gap-2 px-6 py-3 bg-black text-[#32ff84] border-2 border-black font-black text-xs uppercase shadow-[3px_3px_0px_0px_#000000] hover:bg-[#32ff84] hover:text-black transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> RETURN TO DOCS
        </Link>
      </div>
    );
  }

  return (
    <section className="max-w-5xl mx-auto mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-6">
        <Link
          href={`/docs/${slugParam}`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-black font-mono font-bold text-xs uppercase shadow-[2px_2px_0px_0px_#000000] hover:bg-[#32ff84] transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> CANCEL &amp; BACK
        </Link>

        <button
          onClick={handleDelete}
          disabled={isDeleting || isSubmitting}
          className="inline-flex items-center gap-2 px-4 py-2 bg-rose-500 text-white border-2 border-black font-mono font-bold text-xs uppercase shadow-[2px_2px_0px_0px_#000000] hover:bg-rose-600 transition-all disabled:opacity-50"
        >
          {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
          DELETE ARTICLE
        </button>
      </div>

      <div className="border-[3px] border-black bg-white p-6 sm:p-10 shadow-[8px_8px_0px_0px_#000000]">
        <div className="flex items-center gap-3 mb-6 border-b-2 border-black pb-4">
          <div className="w-6 h-6 bg-[#32ff84] border-[3px] border-black flex-shrink-0 shadow-[2px_2px_0px_0px_#000000]" />
          <h3 className="font-display font-black tracking-tight text-2xl uppercase">EDIT DOCUMENTATION ENTRY</h3>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 border-2 border-black bg-rose-100 text-rose-800 font-mono text-xs font-bold uppercase flex items-start gap-2 shadow-[3px_3px_0px_0px_#000]">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>{errorMsg}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 font-mono">
          <div>
            <label className="text-xs font-black uppercase block mb-1">
              Article Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={isSubmitting}
              className="w-full bg-neutral-50 border-2 border-black p-3 text-sm font-bold focus:outline-none focus:bg-white focus:shadow-[4px_4px_0px_0px_#32ff84] transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-black uppercase block mb-1">Slug</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                disabled={isSubmitting}
                className="w-full bg-neutral-50 border-2 border-black p-3 text-sm focus:outline-none focus:bg-white focus:shadow-[4px_4px_0px_0px_#32ff84] transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-black uppercase block mb-1">Read Time Estimate</label>
              <input
                type="text"
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
                disabled={isSubmitting}
                className="w-full bg-neutral-50 border-2 border-black p-3 text-sm focus:outline-none focus:bg-white focus:shadow-[4px_4px_0px_0px_#32ff84] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-black uppercase block mb-1">
              Article Summary / Abstract <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              required
              rows={3}
              disabled={isSubmitting}
              className="w-full bg-neutral-50 border-2 border-black p-3 text-sm focus:outline-none focus:bg-white focus:shadow-[4px_4px_0px_0px_#32ff84] transition-all resize-y"
            />
          </div>

          {/* Advanced Markdown Editor */}
          <div>
            <label className="text-xs font-black uppercase block mb-2">
              Full Article Content (Markdown) <span className="text-rose-500">*</span>
            </label>
            <MarkdownEditor
              initialValue={content}
              onChange={setContent}
            />
          </div>

          <div>
            <label className="text-xs font-black uppercase block mb-1">
              Tags <span className="text-neutral-400 font-normal">(Comma-separated)</span>
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              disabled={isSubmitting}
              className="w-full bg-neutral-50 border-2 border-black p-3 text-sm focus:outline-none focus:bg-white focus:shadow-[4px_4px_0px_0px_#32ff84] transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-4 bg-black text-[#32ff84] border-[3px] border-black font-black text-sm uppercase shadow-[4px_4px_0px_0px_#000] hover:bg-[#32ff84] hover:text-black transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Save className="w-5 h-5" /> SAVE CHANGES
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
}