'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, Save, AlertTriangle } from 'lucide-react';
import { createArticle } from '@/lib/apex';
import { MarkdownEditor } from '@/components/MarkdownEditor';

export default function NewArticlePage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [readTime, setReadTime] = useState('5 min read');
  const [tagsInput, setTagsInput] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !summary || !content) {
      setErrorMsg('Title, summary, and article content are required.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const tags = tagsInput
        ? tagsInput.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean)
        : [];

      const payload: any = {
        title,
        summary,
        content,
        readTime,
        tags,
      };

      if (slug.trim()) {
        payload.slug = slug.trim();
      }

      await createArticle(payload);
      router.push('/docs');
    } catch (err: any) {
      console.error('[Create Article Error]', err);
      setErrorMsg(err.message || 'Failed to publish documentation article.');
      setIsSubmitting(false);
    }
  };

  return (
    <section className="max-w-5xl mx-auto mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Link
        href="/docs"
        className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-white border-2 border-black font-mono font-bold text-xs uppercase shadow-[2px_2px_0px_0px_#000000] hover:bg-[#32ff84] transition-all"
      >
        <ArrowLeft className="w-4 h-4" /> CANCEL &amp; BACK TO DOCS
      </Link>

      <div className="border-[3px] border-black bg-white p-6 sm:p-10 shadow-[8px_8px_0px_0px_#000000]">
        <div className="flex items-center gap-3 mb-6 border-b-2 border-black pb-4">
          <div className="w-6 h-6 bg-[#32ff84] border-[3px] border-black flex-shrink-0 shadow-[2px_2px_0px_0px_#000000]" />
          <h3 className="font-display font-black tracking-tight text-2xl uppercase">NEW DOCUMENTATION ENTRY</h3>
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
              placeholder="e.g. Swalang Memory Model & Garbage Collection"
              className="w-full bg-neutral-50 border-2 border-black p-3 text-sm font-bold focus:outline-none focus:bg-white focus:shadow-[4px_4px_0px_0px_#32ff84] transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-black uppercase block mb-1">
                Custom Slug <span className="text-neutral-400 font-normal">(Auto-generated if blank)</span>
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                disabled={isSubmitting}
                placeholder="e.g. swalang-memory-model"
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
                placeholder="e.g. 5 min read"
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
              placeholder="Brief high-level summary of the article..."
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
              placeholder="Type or paste markdown content here..."
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
              placeholder="swalang, zig, compilers, rust"
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
                <Save className="w-5 h-5" /> PUBLISH ARTICLE TO LEDGER
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
}