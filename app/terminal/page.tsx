'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Loader2, BrainCircuit, Terminal as TerminalIcon, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getApexClient } from '@/lib/apex';

// Decodes entities that may already be present in the raw LLM string before
// we re-escape for safe rendering — prevents "&#039;" / "&gt;" showing literally.
const decodeEntities = (str: string) =>
  str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'");

const escapeHtml = (unsafe: string) => {
  return decodeEntities(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

function formatTerminalLine(str: string) {
  let safeStr = escapeHtml(str);
  return safeStr
    .replace(/\*\*(.*?)\*\*/g, '<span class="text-white font-black">$1</span>')
    .replace(/\*(.*?)\*/g, '<span class="text-neutral-400 italic">$1</span>')
    .replace(/`([^`]+)`/g, '<span class="text-fuchsia-300 bg-fuchsia-400/10 border border-fuchsia-400/30 px-1.5 py-0.5 rounded">$1</span>')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" class="text-sky-400 underline hover:text-sky-300 underline-offset-2">↗ $1</a>');
}

const GLOW = 'shadow-[0_0_12px_rgba(50,255,132,0.10)]';

const TerminalMarkdown = ({ text }: { text: string }) => {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeLang = '';
  let tableBuffer: string[] = [];

  const flushTable = (keyBase: number) => {
    if (tableBuffer.length === 0) return;
    const rows = tableBuffer
      .filter(r => !/^\s*\|?[\s:|-]+\|?\s*$/.test(r)) // drop the |---|---| separator row
      .map(r => r.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(c => c.trim()));

    if (rows.length > 0) {
      const [header, ...body] = rows;
      elements.push(
        <div key={`table-${keyBase}`} className={cn("my-2 overflow-x-auto border border-neutral-700 rounded", GLOW)}>
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-neutral-900">
                {header.map((h, hi) => (
                  <th key={hi} className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-sky-300 font-bold border-b border-neutral-700 whitespace-nowrap">
                    <span dangerouslySetInnerHTML={{ __html: formatTerminalLine(h) }} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {body.map((row, ri) => (
                <tr key={ri} className={ri % 2 === 0 ? 'bg-black' : 'bg-neutral-900/40'}>
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-3 py-1.5 border-b border-neutral-800 text-brand whitespace-nowrap">
                      <span dangerouslySetInnerHTML={{ __html: formatTerminalLine(cell) }} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    tableBuffer = [];
  };

  lines.forEach((line, i) => {
    // Buffer pipe-delimited rows until the table block ends
    if (!inCodeBlock && /^\s*\|/.test(line.trim())) {
      tableBuffer.push(line);
      return;
    }
    if (tableBuffer.length > 0) flushTable(i);

    const fenceMatch = line.trim().match(/^```(\w*)/);
    if (fenceMatch) {
      if (!inCodeBlock) {
        codeLang = fenceMatch[1] || 'text';
        inCodeBlock = true;
        elements.push(
          <div key={i} className={cn("mt-2 flex items-center justify-between bg-neutral-900 border border-neutral-700 border-b-0 rounded-t px-3 py-1", GLOW)}>
            <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold">{codeLang}</span>
            <span className="text-neutral-600 select-none text-[10px]">●●●</span>
          </div>
        );
      } else {
        inCodeBlock = false;
        elements.push(<div key={i} className={cn("bg-neutral-900/60 border border-neutral-700 border-t-0 rounded-b h-2 mb-2", GLOW)} />);
      }
      return;
    }

    if (inCodeBlock) {
      elements.push(
        <div key={i} className={cn("bg-neutral-900/60 border-x border-neutral-700 px-3 text-amber-300 whitespace-pre overflow-x-auto", GLOW)}>
          {escapeHtml(line) || '\u00A0'}
        </div>
      );
      return;
    }

    const headingMatch = line.match(/^(#{1,6})\s+(.*)/);
    if (headingMatch) {
      elements.push(
        <div key={i} className="text-sky-300 font-bold mt-4 mb-1 uppercase tracking-wider border-b border-sky-300/20 pb-1">
          <span className="opacity-50 mr-2">{headingMatch[1]}</span>
          <span dangerouslySetInnerHTML={{ __html: formatTerminalLine(headingMatch[2]) }} />
        </div>
      );
      return;
    }

    const quoteMatch = line.match(/^\s*>\s?(.*)/);
    if (quoteMatch) {
      elements.push(
        <div key={i} className="border-l-2 border-neutral-600 pl-3 text-neutral-400 italic mt-1">
          <span dangerouslySetInnerHTML={{ __html: formatTerminalLine(quoteMatch[1]) }} />
        </div>
      );
      return;
    }

    const numListMatch = line.match(/^(\s*)(\d+\.)\s+(.*)/);
    if (numListMatch) {
      elements.push(
        <div key={i} className="flex mt-1" style={{ marginLeft: numListMatch[1].length * 8 }}>
          <span className="text-sky-300 font-bold mr-2 whitespace-pre shrink-0">{numListMatch[2]}</span>
          <span dangerouslySetInnerHTML={{ __html: formatTerminalLine(numListMatch[3]) }} />
        </div>
      );
      return;
    }

    const listMatch = line.match(/^(\s*)([-*])\s+(.*)/);
    if (listMatch) {
      const indent = listMatch[1].length;
      elements.push(
        <div key={i} className="flex mt-1" style={{ marginLeft: indent * 8 }}>
          <span className="text-[#32ff84] font-bold mr-2 shrink-0">{indent > 0 ? '◦' : '▸'}</span>
          <span dangerouslySetInnerHTML={{ __html: formatTerminalLine(listMatch[3]) }} />
        </div>
      );
      return;
    }

    if (line.trim().match(/^[-*_]{3,}$/)) {
      elements.push(<div key={i} className="border-t border-neutral-700 my-3" />);
      return;
    }

    if (line.trim() === '') {
      elements.push(<div key={i} className="h-4" />);
      return;
    }

    elements.push(
      <div key={i} dangerouslySetInnerHTML={{ __html: formatTerminalLine(line) }} className="mt-1" />
    );
  });

  flushTable(lines.length); // catch a table that runs to the end of the message

  return <div className="flex flex-col w-full text-brand">{elements}</div>;
};
// ----------------------------------------

interface ChatLine {
  role: 'user' | 'system' | 'copilot' | 'error';
  text: string;
  timestamp: string;
}

export default function TerminalPage() {
  const [chatLog, setChatLog] = useState<ChatLine[]>([]);
  const [commandInput, setCommandInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Initial welcome transmission
    setChatLog([
      {
        role: 'system',
        text: 'SECURE SHELL ESTABLISHED TO APEXKIT COGNITIVE INFERENCE ENGINE.',
        timestamp: getTimestamp()
      },
      {
        role: 'system',
        text: 'RAG ARCHITECTURE STATUS: ONLINE / EMBEDDINGS MAP SYNCED.',
        timestamp: getTimestamp()
      },
      {
        role: 'copilot',
        text: 'Greetings. I am your specialized Systems & Frontend Copilot. I have real-time semantic access to all published documentation regarding swalang, the custom Zig compiler, and the ApexKit backend fabrics. Ask me anything about my architecture.',
        timestamp: getTimestamp()
      }
    ]);
  }, []);

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatLog, isProcessing]);

  function getTimestamp() {
    return new Date().toISOString().split('T')[1].slice(0, -1);
  }

  const handleCommandSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const promptText = commandInput.trim();
    if (!promptText || isProcessing) return;

    const ts = getTimestamp();
    
    if (promptText.toLowerCase() === 'clear') {
      setChatLog([]);
      setCommandInput('');
      return;
    }

    setChatLog(prev => [...prev, { role: 'user', text: promptText, timestamp: ts }]);
    setCommandInput('');
    setIsProcessing(true);

    try {
      const client = getApexClient();
      if (!client) throw new Error('ApexKit client failed to initialize.');

      // The heavy lifting (vector embedding, DB search, and context injection)
      // is now handled entirely securely by the ApexKit `before_ai_run` hook on the backend!
      const aiResponse = await client.ai.run('copilot', {
        prompt: promptText
      });

      const result = aiResponse.result || 'No response returned from inference engine.';

      setChatLog(prev => [
        ...prev,
        { role: 'copilot', text: result, timestamp: getTimestamp() }
      ]);

    } catch (err: any) {
      console.error('[Copilot] Inference Error:', err);
      setChatLog(prev => [
        ...prev,
        { role: 'error', text: `CRITICAL PIPELINE FAILURE: ${err.message || 'Network unreachable'}`, timestamp: getTimestamp() }
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <section className="mb-12 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 px-4 md:px-0">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-brand border-[3px] border-black flex-shrink-0 shadow-[2px_2px_0px_0px_#000]" />
          <h3 className="font-display font-black tracking-tight text-2xl uppercase">SYSTEM COPILOT</h3>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] font-bold text-neutral-500 uppercase flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-brand animate-pulse inline-block" />
            NODE-GEMINI-DIRECT-INGRESS: ESTABLISHED
          </span>
        </div>
      </div>

      <div className="border-[3px] border-black bg-white shadow-[8px_8px_0px_0px_#000000] rounded overflow-hidden flex flex-col h-[70vh] min-h-[500px]">
        
        <div className="border-b-[3px] border-black bg-neutral-100 p-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <TerminalIcon className="w-4 h-4 text-black shrink-0" />
            <span className="font-mono text-[10px] sm:text-xs font-black uppercase tracking-wider text-black truncate">
              apexkit@cognitive-copilot:~
            </span>
          </div>

          <button 
            onClick={() => setChatLog([])}
            className="p-1 px-3 bg-white hover:bg-neutral-200 border-2 border-black shadow-[1.5px_1.5px_0px_0px_#000] active:translate-x-[0.5px] active:translate-y-[0.5px] active:shadow-none font-mono text-[10px] font-bold flex items-center gap-1.5 transition-all shrink-0"
            title="Prune output lines"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-600" /> Clear Screen
          </button>
        </div>

        <div className="flex-1 bg-black p-4 md:p-6 text-brand font-mono text-xs sm:text-sm overflow-hidden flex flex-col justify-between">
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
            {chatLog.length === 0 && !isProcessing ? (
              <div className="text-neutral-700 italic select-none">
                Screen buffer empty. Input your questions below to interface with the copilot.
              </div>
            ) : (
              chatLog.map((line, idx) => {
                const isUser = line.role === 'user';
                const isSys = line.role === 'system';
                const isErr = line.role === 'error';
                return (
                  <div 
                    key={idx} 
                    className={cn(
                      "leading-relaxed select-text flex flex-col items-start gap-1 sm:flex-row sm:items-start sm:gap-2",
                      isUser ? 'text-white font-extrabold border-l-2 border-white pl-3' : 
                      isSys ? 'text-sky-300 font-bold opacity-90' : 
                      isErr ? 'text-red-400 font-bold' : 'text-brand'
                    )}
                  >
                    {/* Timestamp: Rendered on its own line/row on mobile */}
                    <span className="text-[10px] opacity-40 select-none shrink-0 sm:mt-0.5">[{line.timestamp}]</span>
                    
                    {/* Message Content: Renders on its own row on mobile */}
                    <div className="w-full sm:flex-1 min-w-0 overflow-x-auto">
                      {isUser && <span className="text-[#32ff84] select-none mr-1.5">visitor@copilot:~$</span>}
                      {line.role === 'copilot' ? (
                        <TerminalMarkdown text={line.text} />
                      ) : (
                        <span className="whitespace-pre-wrap">{line.text}</span>
                      )}
                    </div>
                  </div>
                );
              })
            )}

            {isProcessing && (
              <div className="text-sky-300 font-bold animate-pulse flex items-start gap-2 pt-2 select-none">
                <BrainCircuit className="w-5 h-5 animate-spin text-[#32ff84] shrink-0" />
                <span>RAG COMPILE CHAIN ACTIVE: RESOLVING COGNITIVE VECTORS...</span>
              </div>
            )}
            
            <div ref={terminalEndRef} />
          </div>

          <form 
            onSubmit={handleCommandSubmit} 
            className="flex items-center gap-2 border-t border-neutral-900 pt-3.5 mt-3.5 shrink-0"
          >
            {/* Shortened target for smaller screens to save input layout space */}
            <span className="text-white font-black select-none hidden sm:inline">visitor@copilot:~$</span>
            <span className="text-white font-black select-none inline sm:hidden">~$</span>
            
            <input
              type="text"
              value={commandInput}
              onChange={e => setCommandInput(e.target.value)}
              disabled={isProcessing}
              placeholder="Ask anything about the compilers, swalang, or apexkit (e.g. type 'clear')..."
              className="flex-1 bg-transparent border-none text-white focus:outline-none placeholder-neutral-700 font-mono text-xs sm:text-sm caret-brand disabled:opacity-50"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              autoFocus
            />
            <button 
              type="submit" 
              disabled={isProcessing || !commandInput.trim()} 
              className="p-1.5 hover:bg-neutral-900 rounded text-neutral-400 hover:text-brand transition disabled:opacity-30 disabled:hover:bg-transparent shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      </div>
    </section>
  );
}