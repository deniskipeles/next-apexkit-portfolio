'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import hljs from 'highlight.js';

// ─── Markdown Utilities & Renderer ──────────────────────────────────────────

function escapeFull(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

const renderer = new marked.Renderer();

renderer.heading = function ({ tokens, depth }: any) {
    // @ts-ignore
    const text = this.parser.parseInline(tokens);
    const styles: Record<number, string> = {
        1: 'font-size:1.875rem;font-weight:900;margin:0 0 1.25rem;letter-spacing:-0.02em;color:#000;line-height:1.2;text-transform:uppercase;',
        2: 'font-size:1.4rem;font-weight:900;margin:1.75rem 0 0.875rem;padding-bottom:0.4rem;border-bottom:2px solid #000;color:#000;line-height:1.3;text-transform:uppercase;',
        3: 'font-size:1.15rem;font-weight:800;margin:1.5rem 0 0.5rem;color:#000;text-transform:uppercase;',
        4: 'font-size:1rem;font-weight:800;margin:1.25rem 0 0.5rem;color:#000;',
        5: 'font-size:0.9rem;font-weight:700;margin:1rem 0 0.25rem;color:#000;',
        6: 'font-size:0.8rem;font-weight:700;margin:0.75rem 0 0.25rem;color:#555;',
    };
    return `<h${depth} style="${styles[depth] ?? 'font-weight:800;'}">${text}</h${depth}>\n`;
};

renderer.paragraph = function ({ tokens }: any) {
    // @ts-ignore
    const text = this.parser.parseInline(tokens);
    return `<p style="margin:0 0 1rem;color:#222;line-height:1.7;word-break:break-word;overflow-wrap:break-word;font-weight:500;">${text}</p>\n`;
};

renderer.list = function (token: any) {
    const ordered   = token.ordered;
    const start     = token.start;
    let body = '';
    for (let j = 0; j < token.items.length; j++) {
        // @ts-ignore
        body += this.listitem(token.items[j]);
    }
    const tag       = ordered ? 'ol' : 'ul';
    const listStyle = ordered ? 'decimal' : 'square';
    const startAttr = ordered && start !== 1 ? ` start="${start}"` : '';
    return `<${tag} style="list-style:${listStyle};margin:0 0 1.25rem 1.5rem;padding:0;display:block;"${startAttr}>${body}</${tag}>\n`;
};

renderer.listitem = function (token: any) {
    // @ts-ignore
    const text = this.parser.parse(token.tokens);
    return `<li style="margin-bottom:0.4rem;padding-left:0.25rem;color:#111;line-height:1.7;display:list-item;font-weight:600;">${text}</li>\n`;
};

renderer.table = function (token: any) {
    // @ts-ignore
    const headerCells = token.header.map((cell: any) => {
        // @ts-ignore
        const text = this.parser.parseInline(cell.tokens);
        return `<th style="padding:0.6rem 1rem;text-align:left;font-weight:900;font-size:0.8rem;color:#000;border:2px solid #000;background:#32ff84;text-transform:uppercase;white-space:nowrap;">${text}</th>`;
    }).join('');

    // @ts-ignore
    const bodyRows = token.rows.map((row: any[], rowIdx: number) => {
        // @ts-ignore
        const cells = row.map((cell: any) => {
            // @ts-ignore
            const text = this.parser.parseInline(cell.tokens);
            return `<td style="padding:0.6rem 1rem;color:#111;border:2px solid #000;font-size:0.85rem;font-weight:600;">${text}</td>`;
        }).join('');
        const bg = rowIdx % 2 === 0 ? 'background:#fff;' : 'background:#f4f4f4;';
        return `<tr style="${bg}">${cells}</tr>`;
    }).join('');

    return (
        `<div style="overflow-x:auto;margin:0 0 1.25rem;max-width:100%;box-sizing:border-box;">\n` +
        `<table style="width:100%;border-collapse:collapse;font-size:0.85rem;border:2px solid #000;box-shadow:3px 3px 0px 0px #000;">\n` +
        `<thead><tr>${headerCells}</tr></thead>\n` +
        `<tbody>${bodyRows}</tbody>\n` +
        `</table></div>\n`
    );
};

renderer.image = function ({ href, title, text }: any) {
    const t = title ? ` title="${title}"` : '';
    const a = text ? ` alt="${text}"` : '';
    return `<img src="${href}"${t}${a} style="max-width:100%;height:auto;border:3px solid #000;box-shadow:4px 4px 0px 0px #000;display:block;margin:1.25rem 0;" />`;
};

renderer.link = function ({ href, title, tokens }: any) {
    // @ts-ignore
    const text = this.parser.parseInline(tokens);
    const t = title ? ` title="${title}"` : '';
    return `<a href="${href}"${t} style="color:#000;background:#32ff84;padding:0 4px;border:1.5px solid #000;font-weight:800;text-decoration:none;box-shadow:1.5px 1.5px 0px 0px #000;" target="_blank" rel="noopener noreferrer">${text}</a>`;
};

renderer.blockquote = function ({ tokens }: any) {
    // @ts-ignore
    const text = this.parser.parse(tokens);
    return (
        `<blockquote style="border-left:5px solid #000;margin:1.25rem 0;padding:0.75rem 1rem;` +
        `background:#f5f5f5;border:2px solid #000;border-left-width:6px;box-shadow:3px 3px 0px 0px #000;` +
        `color:#111;font-weight:600;line-height:1.7;word-break:break-word;">` +
        `${text}</blockquote>\n`
    );
};

renderer.codespan = function ({ text }: any) {
    return (
        `<code style="background:#000;color:#32ff84;` +
        `padding:0.2em 0.5em;border:1.5px solid #000;` +
        `font-size:0.85em;font-family:monospace;font-weight:700;">${escapeFull(text)}</code>`
    );
};

renderer.strong = function ({ tokens }: any) {
    // @ts-ignore
    const text = this.parser.parseInline(tokens);
    let style = 'font-weight:900;color:#000;';
    if (/\bAdded\b/.test(text)) style = 'font-weight:900;color:#000;background:#32ff84;padding:0 3px;border:1px solid #000;';
    else if (/\bFixed\b/.test(text)) style = 'font-weight:900;color:#fff;background:#f43f5e;padding:0 3px;border:1px solid #000;';
    else if (/\b(Changed|Improved)\b/.test(text)) style = 'font-weight:900;color:#000;background:#fde047;padding:0 3px;border:1px solid #000;';
    return `<strong style="${style}">${text}</strong>`;
};

marked.use({ renderer, breaks: true, gfm: true });

interface CodeStash {
    marker: string;
    html: string;
}

function renderCodeBlock(lang: string, text: string): string {
    let highlighted = escapeFull(text);
    const cleanLang = lang ? lang.trim().toLowerCase() : '';

    if (cleanLang && hljs.getLanguage(cleanLang)) {
        try {
            highlighted = hljs.highlight(text, { language: cleanLang }).value;
        } catch (e) {
            console.warn("Syntax highlighting failed for language:", cleanLang, e);
        }
    }

    return (
        `<div style="margin:1.25rem 0;border:3px solid #000;box-shadow:4px 4px 0px 0px #000;` +
        `overflow:hidden;max-width:100%;box-sizing:border-box;background:#000;">` +
        (lang
            ? `<div style="padding:0.4rem 1rem;font-size:0.7rem;font-family:monospace;font-weight:900;` +
              `color:#32ff84;background:#111;border-bottom:2px solid #000;` +
              `text-transform:uppercase;letter-spacing:0.05em;">${lang}</div>`
            : '') +
        `<pre style="margin:0;padding:1rem;overflow-x:auto;max-width:100%;box-sizing:border-box;background:#000;">` +
        `<code class="hljs ${cleanLang ? 'language-' + cleanLang : ''}" style="font-family:monospace;font-size:0.85rem;white-space:pre;background:transparent;border:none;padding:0;color:#32ff84;">${highlighted}</code></pre></div>`
    );
}

function extractCodeBlocks(markdown: string): { safe: string; stash: CodeStash[] } {
    const stash: CodeStash[] = [];
    const safe = markdown.replace(/^```([^\n]*)\n([\s\S]*?)^```[ \t]*$/gm, (_match, lang, body) => {
        const marker = `APEXMD_CODE_${stash.length}_PLACEHOLDER`;
        stash.push({
            marker,
            html: renderCodeBlock(lang.trim(), body),
        });
        return `\n\n${marker}\n\n`;
    });
    return { safe, stash };
}

function restoreCodeBlocks(html: string, stash: CodeStash[]): string {
    let result = html;
    for (const { marker, html: codeHtml } of stash) {
        const regex = new RegExp(`<p[^>]*>\\s*${marker}\\s*<\\/p>|${marker}`, 'g');
        result = result.replace(regex, codeHtml);
    }
    return result;
}

export const renderMarkdown = async (content: string): Promise<string> => {
    if (!content) return '';

    const { safe, stash } = extractCodeBlocks(content);
    const rawHtml = await marked.parse(safe) as string;

    const sanitized = typeof window !== 'undefined'
        ? DOMPurify.sanitize(rawHtml, {
            ALLOWED_TAGS: [
                'h1','h2','h3','h4','h5','h6',
                'p','br','hr','blockquote',
                'ul','ol','li',
                'table','thead','tbody','tr','th','td',
                'pre','code','div','span',
                'a','strong','em','b','i','img'
            ],
            ALLOWED_ATTR: ['style', 'href', 'target', 'rel', 'title', 'start', 'src', 'alt', 'class'],
        })
        : rawHtml;

    return restoreCodeBlocks(sanitized, stash);
};

// ─── MarkdownRenderer Component ─────────────────────────────────────────────

interface MarkdownRendererProps {
    content: string;
    className?: string;
    style?: React.CSSProperties;
}

export function MarkdownRenderer({ content, className = "", style }: MarkdownRendererProps) {
    const [html, setHtml] = useState('');

    useEffect(() => {
        let isMounted = true;
        renderMarkdown(content).then((res) => {
            if (isMounted) setHtml(res);
        });
        return () => { isMounted = false; };
    }, [content]);

    return (
        <div
            className={`font-mono text-sm leading-relaxed text-black ${className}`}
            style={{
                fontFamily: 'var(--font-mono), monospace',
                maxWidth: '100%',
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
                ...style,
            }}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}

// ─── MarkdownEditor Component (Neobrutalist / Squary Theme) ──────────────────

type PanelMode = 'editor' | 'split' | 'preview';
type ToastType = 'success' | 'error' | 'info';

interface Toast { id: number; message: string; type: ToastType; }

export interface MarkdownEditorProps {
    initialValue?: string;
    onChange?: (value: string) => void;
    onSave?: (value: string) => void;
    placeholder?: string;
    className?: string;
}

type InsertFn = (before: string, after?: string, placeholder?: string, selectPlaceholder?: boolean) => void;

interface ToolbarAction {
    icon: string;
    label: string;
    shortcut?: string;
    action: (insert: InsertFn) => void;
    separator?: boolean;
}

const TOOLBAR: ToolbarAction[] = [
    { icon: 'H1', label: 'Heading 1', action: (i) => i('# ', '', 'Heading 1', true) },
    { icon: 'H2', label: 'Heading 2', action: (i) => i('## ', '', 'Heading 2', true) },
    { icon: 'H3', label: 'Heading 3', action: (i) => i('### ', '', 'Heading 3', true), separator: true },
    { icon: 'B',  label: 'Bold',      shortcut: 'Ctrl+B', action: (i) => i('**', '**', 'bold text', true) },
    { icon: 'I',  label: 'Italic',    shortcut: 'Ctrl+I', action: (i) => i('*', '*', 'italic text', true) },
    { icon: 'S',  label: 'Strikethrough', action: (i) => i('~~', '~~', 'strikethrough', true), separator: true },
    { icon: '🔗', label: 'Link',      shortcut: 'Ctrl+K', action: (i) => i('[', '](https://)', 'link text', true) },
    { icon: '🖼',  label: 'Image',     action: (i) => i('![', '](https://)', 'alt text', true) },
    { icon: '`',  label: 'Inline Code', action: (i) => i('`', '`', 'code', true), separator: true },
    { icon: '```', label: 'Code Block', action: (i) => i('```\n', '\n```', 'code here', true) },
    { icon: '❝',  label: 'Blockquote', action: (i) => i('> ', '', 'quote', true) },
    { icon: '—',  label: 'Horizontal Rule', action: (i) => i('\n---\n'), separator: true },
    { icon: 'UL', label: 'Unordered List', action: (i) => i('- ', '', 'list item', true) },
    { icon: 'OL', label: 'Ordered List',   action: (i) => i('1. ', '', 'list item', true) },
    { icon: '☑',  label: 'Task List',      action: (i) => i('- [ ] ', '', 'task', true), separator: true },
    { icon: '⊞',  label: 'Table', action: (i) => i('\n| Column 1 | Column 2 |\n|----------|----------|\n| Cell     | Cell     |\n') },
];

function countWords(t: string) { return t.trim() === '' ? 0 : t.trim().split(/\s+/).length; }
function countLines(t: string) { return t === '' ? 0 : t.split('\n').length; }
function readTime(w: number)   { return `${Math.ceil(w / 200)} min read`; }

export function MarkdownEditor({
    initialValue = '',
    onChange,
    onSave,
    placeholder = 'Start typing documentation markdown...',
    className = '',
}: MarkdownEditorProps) {
    const [value, setValue]   = useState(initialValue);
    const [mode, setMode]     = useState<PanelMode>('split');
    const [docTitle, setDocTitle] = useState('Untitled Document');
    const [toasts, setToasts] = useState<Toast[]>([]);
    const [saved, setSaved]   = useState(true);
    const [cursor, setCursor] = useState({ line: 1, col: 1 });
    const [findOpen, setFindOpen]     = useState(false);
    const [findVal, setFindVal]       = useState('');
    const [replaceVal, setReplaceVal] = useState('');
    const taRef   = useRef<HTMLTextAreaElement>(null);
    const toastId = useRef(0);

    useEffect(() => { 
        setValue(initialValue);
    }, [initialValue]);

    useEffect(() => { 
        onChange?.(value); 
        setSaved(false); 
    }, [value, onChange]);

    useEffect(() => { 
        if (!saved) { 
            const t = setTimeout(() => setSaved(true), 2500); 
            return () => clearTimeout(t); 
        } 
    }, [saved]);

    const addToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = toastId.current++;
        setToasts(p => [...p, { id, message, type }]);
        setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 2500);
    }, []);

    const insertText: InsertFn = useCallback((before, after = '', ph = '', selectPh = false) => {
        const ta = taRef.current;
        if (!ta) return;
        const s = ta.selectionStart, e = ta.selectionEnd;
        const selected = ta.value.slice(s, e);
        const insert   = selected || ph;
        const next     = ta.value.slice(0, s) + before + insert + after + ta.value.slice(e);
        setValue(next);
        requestAnimationFrame(() => {
            ta.focus();
            if (selectPh && !selected) {
                ta.setSelectionRange(s + before.length, s + before.length + insert.length);
            } else {
                const p = s + before.length + insert.length + after.length;
                ta.setSelectionRange(p, p);
            }
        });
    }, []);

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        const ctrl = e.ctrlKey || e.metaKey;
        if (ctrl && e.key === 'b') { e.preventDefault(); insertText('**', '**', 'bold text', true); }
        if (ctrl && e.key === 'i') { e.preventDefault(); insertText('*', '*', 'italic text', true); }
        if (ctrl && e.key === 'k') { e.preventDefault(); insertText('[', '](https://)', 'link text', true); }
        if (ctrl && e.key === 's') { e.preventDefault(); onSave?.(value); setSaved(true); addToast('Saved successfully', 'success'); }
        if (e.key === 'Tab') { e.preventDefault(); insertText('    '); }
        if (e.key === 'Enter') {
            const ta   = e.currentTarget;
            const pos  = ta.selectionStart;
            const line = ta.value.slice(0, pos).split('\n').pop() ?? '';
            const ulM  = line.match(/^(\s*)([-*+])\s/);
            const olM  = line.match(/^(\s*)(\d+)\.\s/);
            if (ulM) {
                if (line.trim() === ulM[2]) {
                    e.preventDefault();
                    const nv = ta.value.slice(0, pos - line.length) + '\n' + ta.value.slice(pos);
                    setValue(nv);
                    requestAnimationFrame(() => ta.setSelectionRange(pos - line.length + 1, pos - line.length + 1));
                } else { e.preventDefault(); insertText(`\n${ulM[1]}${ulM[2]} `); }
            } else if (olM) {
                e.preventDefault();
                insertText(`\n${olM[1]}${parseInt(olM[2]) + 1}. `);
            }
        }
    }, [insertText, value, onSave, addToast]);

    const updateCursor = useCallback((e: React.SyntheticEvent<HTMLTextAreaElement>) => {
        const ta = e.currentTarget;
        const before = ta.value.slice(0, ta.selectionStart).split('\n');
        setCursor({ line: before.length, col: before[before.length - 1].length + 1 });
    }, []);

    const handleReplace = useCallback(() => {
        if (!findVal) return;
        setValue(v => v.split(findVal).join(replaceVal));
        addToast('Replaced all occurrences', 'success');
    }, [findVal, replaceVal, addToast]);

    const matchCount = findVal
        ? (value.match(new RegExp(findVal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length
        : 0;

    const words = countWords(value);

    return (
        <div className={`flex flex-col h-full min-h-[500px] border-[3px] border-black bg-white shadow-[6px_6px_0px_0px_#000000] font-mono text-black ${className}`}>

            {/* ── Top Bar ── */}
            <div className="flex flex-wrap items-center gap-2 px-3 py-2 border-b-[3px] border-black bg-neutral-100 shrink-0">
                <input
                    value={docTitle}
                    onChange={e => setDocTitle(e.target.value)}
                    className="flex-1 text-xs font-black uppercase bg-white border-2 border-black px-2 py-1 outline-none text-black font-mono shadow-[1.5px_1.5px_0px_0px_#000]"
                    aria-label="Document title"
                    spellCheck={false}
                />
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 border border-black ${saved ? 'bg-[#32ff84] text-black' : 'bg-amber-300 text-black'}`}>
                    {saved ? '● SAVED' : '○ UNSAVED'}
                </span>

                <div className="flex items-center gap-1">
                    {(['editor', 'split', 'preview'] as PanelMode[]).map(m => (
                        <button
                            key={m}
                            onClick={() => setMode(m)}
                            className={`px-2 py-1 border-2 border-black text-[10px] font-black uppercase transition-all shadow-[1.5px_1.5px_0px_0px_#000] ${
                                mode === m
                                    ? 'bg-black text-[#32ff84]'
                                    : 'bg-white text-black hover:bg-[#32ff84]'
                            }`}
                        >
                            {m === 'editor' ? '✏ EDIT' : m === 'split' ? '⊟ SPLIT' : '👁 PREVIEW'}
                        </button>
                    ))}
                </div>

                <div className="w-0.5 h-4 bg-black mx-1" />

                <button 
                    onClick={() => navigator.clipboard.writeText(value).then(() => addToast('Copied to clipboard!', 'success'))}
                    className="text-[10px] font-black px-2 py-1 border-2 border-black bg-white hover:bg-[#32ff84] text-black shadow-[1.5px_1.5px_0px_0px_#000] active:translate-x-[0.5px] active:translate-y-[0.5px] active:shadow-none transition-all uppercase"
                    title="Copy Markdown"
                >
                    COPY
                </button>
                <button 
                    onClick={() => setFindOpen(v => !v)}
                    className={`text-[10px] font-black px-2 py-1 border-2 border-black shadow-[1.5px_1.5px_0px_0px_#000] transition-all uppercase ${findOpen ? 'bg-black text-[#32ff84]' : 'bg-white text-black hover:bg-[#32ff84]'}`} 
                    title="Find & Replace"
                >
                    FIND
                </button>
                <button 
                    onClick={() => value && confirm('Clear editor contents?') && setValue('')}
                    className="text-[10px] font-black px-2 py-1 border-2 border-black bg-white hover:bg-rose-400 text-black shadow-[1.5px_1.5px_0px_0px_#000] transition-all uppercase" 
                    title="Clear"
                >
                    CLEAR
                </button>
            </div>

            {/* ── Formatting Toolbar ── */}
            {mode !== 'preview' && (
                <div className="flex items-center flex-wrap gap-1 px-3 py-1.5 border-b-2 border-black bg-neutral-50 shrink-0" role="toolbar">
                    {TOOLBAR.map((action, idx) => (
                        <React.Fragment key={idx}>
                            {action.separator && idx > 0 && <span className="w-0.5 h-4 bg-black mx-1" aria-hidden />}
                            <button
                                className="inline-flex items-center justify-center min-w-[28px] h-7 px-1.5 border-2 border-black bg-white hover:bg-[#32ff84] text-[10px] font-black font-mono text-black shadow-[1.5px_1.5px_0px_0px_#000] active:translate-x-[0.5px] active:translate-y-[0.5px] active:shadow-none transition-all"
                                title={action.shortcut ? `${action.label} (${action.shortcut})` : action.label}
                                onMouseDown={e => { e.preventDefault(); action.action(insertText); }}
                            >
                                {action.icon}
                            </button>
                        </React.Fragment>
                    ))}
                </div>
            )}

            {/* ── Find & Replace Panel ── */}
            {findOpen && (
                <div className="flex items-center flex-wrap gap-2 px-3 py-2 border-b-2 border-black bg-amber-100 shrink-0">
                    <input
                        value={findVal}
                        onChange={e => setFindVal(e.target.value)}
                        placeholder="FIND..."
                        autoFocus
                        className="text-xs font-mono font-bold px-2 py-1 border-2 border-black bg-white text-black outline-none w-36 shadow-[1px_1px_0px_0px_#000]"
                    />
                    <input
                        value={replaceVal}
                        onChange={e => setReplaceVal(e.target.value)}
                        placeholder="REPLACE WITH..."
                        className="text-xs font-mono font-bold px-2 py-1 border-2 border-black bg-white text-black outline-none w-44 shadow-[1px_1px_0px_0px_#000]"
                    />
                    <button 
                        onClick={handleReplace}
                        className="text-xs font-black uppercase px-3 py-1 border-2 border-black bg-[#32ff84] text-black hover:bg-black hover:text-white transition-all shadow-[1.5px_1.5px_0px_0px_#000]"
                    >
                        REPLACE ALL
                    </button>
                    {findVal && (
                        <span className="text-xs font-black text-black">{matchCount} MATCH{matchCount !== 1 ? 'ES' : ''}</span>
                    )}
                    <button 
                        onClick={() => setFindOpen(false)}
                        className="ml-auto text-xs font-black px-2 py-1 border-2 border-black bg-white hover:bg-rose-400 text-black transition-all"
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* ── Body Panes ── */}
            <div className="flex flex-1 min-h-0 overflow-hidden">
                {(mode === 'editor' || mode === 'split') && (
                    <div className={`flex flex-col flex-1 min-w-0 overflow-hidden ${mode === 'split' ? 'border-r-[3px] border-black' : ''}`}>
                        <textarea
                            ref={taRef}
                            value={value}
                            onChange={e => setValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onKeyUp={updateCursor}
                            onClick={updateCursor}
                            placeholder={placeholder}
                            spellCheck
                            className="flex-1 w-full p-4 border-none outline-none resize-none font-mono text-xs sm:text-sm leading-relaxed text-black bg-white caret-black overflow-y-auto placeholder:text-neutral-400"
                        />
                    </div>
                )}

                {(mode === 'preview' || mode === 'split') && (
                    <div className="flex-1 min-w-0 overflow-y-auto p-4 sm:p-6 bg-white">
                        {value.trim()
                            ? <MarkdownRenderer content={value} />
                            : <p className="text-xs font-bold text-neutral-400 uppercase italic">Buffer empty. Input text to preview.</p>
                        }
                    </div>
                )}
            </div>

            {/* ── Status Bar ── */}
            <div className="flex items-center gap-4 px-3 h-7 border-t-[3px] border-black bg-neutral-100 shrink-0 text-[10px] font-black uppercase">
                <span className="text-black bg-[#32ff84] px-1.5 py-0.5 border border-black">{words} WORDS</span>
                <span className="text-neutral-700">{countLines(value)} LINES</span>
                <span className="text-neutral-700">{value.length} CHARS</span>
                <span className="text-neutral-700">{readTime(words)}</span>
                <span className="flex-1" />
                <span className="text-neutral-700">LN {cursor.line}, COL {cursor.col}</span>
                <span className="text-black bg-white px-1.5 py-0.5 border border-black">MARKDOWN</span>
            </div>

            {/* ── Notification Toasts ── */}
            <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-50 pointer-events-none font-mono text-xs uppercase font-black">
                {toasts.map(t => (
                    <div 
                        key={t.id} 
                        className={`px-4 py-2 border-[3px] border-black shadow-[4px_4px_0px_0px_#000] animate-in fade-in slide-in-from-bottom-2 duration-150 ${
                            t.type === 'success' ? 'bg-[#32ff84] text-black'
                            : t.type === 'error' ? 'bg-rose-500 text-white'
                            : 'bg-white text-black'
                        }`}
                    >
                        {t.message}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MarkdownEditor;