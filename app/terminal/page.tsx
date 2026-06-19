'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Loader2, BrainCircuit, Terminal as TerminalIcon, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getApexClient } from '@/lib/apex';

// --- CUSTOM TERMINAL MARKDOWN PARSER ---
// Safely escapes HTML to prevent XSS injection from LLM output
const escapeHtml = (unsafe: string) => {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

// Applies inline coloring for Bold, Italic, Links, and Inline Code
function formatTerminalLine(str: string) {
  let safeStr = escapeHtml(str);
  return safeStr
    .replace(/\*\*(.*?)\*\*/g, '<span class="text-white font-black">$1</span>') // Bold -> White
    .replace(/\*(.*?)\*/g, '<span class="text-neutral-400 italic">$1</span>') // Italic -> Dimmed
    .replace(/`([^`]+)`/g, '<span class="text-fuchsia-400 bg-fuchsia-400/10 px-1 py-0.5 rounded">$1</span>') // Code -> Pink
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" class="text-sky-400 underline hover:text-sky-300">$1</a>'); // Links -> Blue
}

const TerminalMarkdown = ({ text }: { text: string }) => {
  const lines = text.split('\n');
  let inCodeBlock = false;

  return (
    <div className="flex flex-col w-full text-brand">
      {lines.map((line, i) => {
        // Toggle Code Block State
        if (line.trim().startsWith('```')) {
          inCodeBlock = !inCodeBlock;
          return <div key={i} className="text-neutral-600 select-none">{line}</div>;
        }

        // Inside Code Block: Render raw text as Amber
        if (inCodeBlock) {
          return <div key={i} className="text-amber-300 whitespace-pre">{escapeHtml(line)}</div>;
        }

        // Headings (e.g. ## Topic) -> Sky Blue, Uppercase
        const headingMatch = line.match(/^(#{1,6})\s+(.*)/);
        if (headingMatch) {
          const hashes = headingMatch[1];
          const content = headingMatch[2];
          return (
            <div key={i} className="text-sky-300 font-bold mt-4 mb-1 uppercase tracking-wider">
              <span className="opacity-50 mr-2">{hashes}</span>
              <span dangerouslySetInnerHTML={{ __html: formatTerminalLine(content) }} />
            </div>
          );
        }

        // Numbered Lists (e.g. 1. Item) -> Number is Sky Blue
        const numListMatch = line.match(/^(\s*\d+\.)\s+(.*)/);
        if (numListMatch) {
          const bullet = numListMatch[1];
          const content = numListMatch[2];
          return (
            <div key={i} className="flex mt-1">
              <span className="text-sky-300 font-bold mr-2 whitespace-pre shrink-0">{bullet}</span>
              <span dangerouslySetInnerHTML={{ __html: formatTerminalLine(content) }} />
            </div>
          );
        }

        // Bullet Lists (e.g. - Item) -> Bullet is Green
        const listMatch = line.match(/^(\s*[-*])\s+(.*)/);
        if (listMatch) {
          const bullet = listMatch[1];
          const content = listMatch[2];
          return (
            <div key={i} className="flex mt-1">
              <span className="text-[#32ff84] font-bold mr-2 whitespace-pre shrink-0">{bullet}</span>
              <span dangerouslySetInnerHTML={{ __html: formatTerminalLine(content) }} />
            </div>
          );
        }

        // Horizontal Rules (e.g. ---)
        if (line.trim().match(/^[-*_]{3,}$/)) {
          return <div key={i} className="text-neutral-600 tracking-widest my-2">{line}</div>;
        }

        // Empty lines act as spacers
        if (line.trim() === '') {
          return <div key={i} className="h-4"></div>;
        }

        // Regular Text
        return (
          <div key={i} dangerouslySetInnerHTML={{ __html: formatTerminalLine(line) }} className="mt-1" />
        );
      })}
    </div>
  );
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

      const searchResults = await client.collection('articles').searchTextVector(promptText, 2);
      
      let contextString = '';
      if (Array.isArray(searchResults) && searchResults.length > 0) {
        contextString = searchResults
          .map((r: any) => `Title: ${r.title}\nContent: ${r.content}`)
          .join('\n\n');
        
        setChatLog(prev => [
          ...prev, 
          { 
            role: 'system', 
            text: `[VECTOR DB] Retrieved ${searchResults.length} relevant documentation nodes. Injecting context...`, 
            timestamp: getTimestamp() 
          }
        ]);
      } else {
        setChatLog(prev => [
          ...prev, 
          { 
            role: 'system', 
            text: '[VECTOR DB] Zero context matches in database. Prompting without additional scope...', 
            timestamp: getTimestamp() 
          }
        ]);
      }

      const aiResponse = await client.ai.run('copilot', {
        prompt: promptText,
        context: contextString
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
    <section className="mb-12 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      
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
          <div className="flex items-center gap-2">
            <TerminalIcon className="w-4 h-4 text-black" />
            <span className="font-mono text-xs font-black uppercase tracking-wider text-black">
              apexkit@cognitive-copilot:~
            </span>
          </div>

          <button 
            onClick={() => setChatLog([])}
            className="p-1 px-3 bg-white hover:bg-neutral-200 border-2 border-black shadow-[1.5px_1.5px_0px_0px_#000] active:translate-x-[0.5px] active:translate-y-[0.5px] active:shadow-none font-mono text-[10px] font-bold flex items-center gap-1.5 transition-all"
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
                      "leading-relaxed select-text flex items-start gap-2",
                      isUser ? 'text-white font-extrabold border-l-2 border-white pl-3' : 
                      isSys ? 'text-sky-300 font-bold opacity-90' : 
                      isErr ? 'text-red-400 font-bold' : 'text-brand'
                    )}
                  >
                    <span className="text-[10px] opacity-40 select-none shrink-0 mt-0.5">[{line.timestamp}]</span>
                    <div className="flex-1 min-w-0 overflow-x-auto">
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
            <span className="text-white font-black select-none">visitor@copilot:~$</span>
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