'use client';

import { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, Cpu, Server, Activity, RefreshCw, Play, Square, Sparkles, Send, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Container {
  name: string;
  status: 'RUNNING' | 'PAUSED' | 'CRASHED';
  cpu: string;
  mem: string;
  uptime: string;
}

export default function TerminalPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [commandInput, setCommandInput] = useState('');
  const logsContainerRef = useRef<HTMLDivElement | null>(null);
  const [activeTab, setActiveTab] = useState<'console' | 'system' | 'allocations'>('console');
  
  // Hardware levels (changing periodically)
  const [cpuUsage, setCpuUsage] = useState(38);
  const [memUsage, setMemUsage] = useState(488);
  const [peersConnected, setPeersConnected] = useState(12);

  const [containers, setContainers] = useState<Container[]>([
    { name: 'gateway-ingress', status: 'RUNNING', cpu: '2.4%', mem: '45MB', uptime: '14h 22m' },
    { name: 'auth-validator-node', status: 'RUNNING', cpu: '1.1%', mem: '128MB', uptime: '14h 21m' },
    { name: 'redis-session-store', status: 'RUNNING', cpu: '0.8%', mem: '24MB', uptime: '48h 03m' },
    { name: 'esbuild-compiler-swarm', status: 'PAUSED', cpu: '0.0%', mem: '12MB', uptime: '0s' },
    { name: 'locust-test-runner', status: 'CRASHED', cpu: '0.0%', mem: '0MB', uptime: '0s' }
  ]);

  // Handle auto-scroll in logs
  useEffect(() => {
    if (logsContainerRef.current) {
      logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
    }
  }, [logs]);

  // Setup logging ticks and random resource fluctuations
  useEffect(() => {
    setLogs([
      '[SYS] Initializing local orchestrator engine...',
      '[SYS] neobrutalism UI theme set config variable "ACCENT" = "#32ff84"',
      '[SYS] Port 3000 mapping successfully active on Docker network bridge.',
      '[NET] Connected to local development socket... OK',
      '[SRV] Ready for local execution transmission.',
      'Type "help" in the terminal input below for list of diagnostic commands.'
    ]);

    const logSnippets = [
      '[NET] WebSocket packet delivered successfully to client-3392.',
      '[DBG] Chunk caching layer verified: 98.4% hit ratio.',
      '[SYS] Local webpack bundle loader triggered cache replacement.',
      '[SRV] Route metrics updated: GET /api/v1/projects 200 OK - 8ms',
      '[NET] KeepAlive packet returned status code 200.',
      '[SYS] Compiling static routes to /out folder... 100% OK',
      '[SRV] Worker payload synchronized in 4.5ms.'
    ];

    const sysInterval = setInterval(() => {
      // Fluctuations
      setCpuUsage(v => Math.max(10, Math.min(99, v + Math.floor((Math.random() - 0.5) * 8))));
      setMemUsage(v => Math.max(300, Math.min(1024, v + Math.floor((Math.random() - 0.5) * 15))));
      
      const ts = new Date().toISOString().split('T')[1].slice(0, -1);
      const randIdx = Math.floor(Math.random() * logSnippets.length);
      setLogs(p => [...p.slice(-99), `[${ts}] ${logSnippets[randIdx]}`]);
    }, 4500);

    return () => clearInterval(sysInterval);
  }, []);

  // Handle command execution in mock CLI
  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandInput.trim()) return;

    const cmd = commandInput.trim().toLowerCase();
    const ts = new Date().toISOString().split('T')[1].slice(0, -1);
    const newLogs = [...logs, `visitor@kipeles:~$ ${commandInput}`];

    switch (cmd) {
      case 'help':
        newLogs.push(
          `[${ts}] -- AVAILABLE COMMANDS --`,
          `[${ts}] help              Shows this terminal instruction manual.`,
          `[${ts}] status            Queries current container health status reports.`,
          `[${ts}] clear             Prunes all active terminal line queues.`,
          `[${ts}] env               Prints the global env specifications.`,
          `[${ts}] build             Triggers simulated bundle minifier and static export.`
        );
        break;
      case 'status':
        newLogs.push(
          `[${ts}] -- HARDWARE REPORT --`,
          `[${ts}] CPU Load: ${cpuUsage}% total system capability`,
          `[${ts}] Memory usage: ${memUsage}MB of total 1024MB system heap allocation`,
          `[${ts}] Active services online: ${containers.filter(c => c.status === 'RUNNING').length}`
        );
        break;
      case 'clear':
        setLogs([]);
        setCommandInput('');
        return;
      case 'env':
        newLogs.push(
          `[${ts}] NODE_ENV=production`,
          `[${ts}] PORT=3000`,
          `[${ts}] ACCENT_COLOR=#32ff84`,
          `[${ts}] SYNC_INTERVAL_MS=4500`,
          `[${ts}] STORAGE_ENGINE=local_state`
        );
        break;
      case 'build':
        newLogs.push(
          `[${ts}] esbuild init compiler swarm v1.2.0...`,
          `[${ts}] Compiling TSX dependency entry points...`,
          `[${ts}] Optimizing neobrutalist class utilities...`,
          `[${ts}] Build succeeded! Export files written to ./dist directory (1.4 seconds)`
        );
        break;
      default:
        newLogs.push(`[${ts}] command "${cmd}" not recognized. Try typing "help" for instructions.`);
    }

    setLogs(newLogs);
    setCommandInput('');
  };

  // Toggle container state on click
  const toggleContainer = (name: string, act: 'START' | 'STOP') => {
    const ts = new Date().toISOString().split('T')[1].slice(0, -1);
    setContainers(prevList => prevList.map(c => {
      if (c.name === name) {
        const nextStatus = act === 'START' ? 'RUNNING' : 'PAUSED';
        setLogs(prev => [...prev, `[${ts}] [DOCKER] Container "${name}" state transitioned to: ${nextStatus}`]);
        return {
          ...c,
          status: nextStatus,
          cpu: nextStatus === 'RUNNING' ? '1.5%' : '0.0%',
          mem: nextStatus === 'RUNNING' ? '64MB' : '10MB'
        };
      }
      return c;
    }));
  };

  // Generate dynamic path coordinates for compiler activities
  const getCoordinates = () => {
    const count = 12;
    const coords: { x: number; y: number; val: number }[] = [];
    for (let i = 0; i < count; i++) {
      const x = (i / (count - 1)) * 430;
      const pseudoRandomVal = Math.sin((i / 2) * Math.PI) * 15 + Math.cos(i) * 8 + 40;
      const y = 140 - ((pseudoRandomVal - 10) / 70) * 110;
      coords.push({ x, y, val: Math.round(pseudoRandomVal) });
    }
    return coords;
  };

  const chartData = getCoordinates();
  const graphLinePath = chartData.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const graphAreaPath = `${graphLinePath} L ${chartData[chartData.length - 1].x} 140 L ${chartData[0].x} 140 Z`;

  return (
    <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-[#32ff84] border-[3px] border-black flex-shrink-0 shadow-[2px_2px_0px_0px_#000]" />
          <h3 className="font-display font-black tracking-tight text-2xl uppercase">SYSTEM WORKSPACE</h3>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] font-bold text-neutral-500 uppercase flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#32ff84] animate-pulse inline-block" />
            VIRTUAL CONTAINER MANAGER: STANDBY
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Resource levels & Container states */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Progress bar cards */}
          <div className="border-[3px] border-black bg-white p-5 shadow-[5px_5px_0px_0px_#000000]">
            <div className="flex items-center gap-2 border-b-2 border-black pb-3 mb-4">
              <Cpu className="w-5 h-5 text-neutral-700" />
              <div>
                <h4 className="font-display font-black text-sm uppercase">CLUSTER METRICS</h4>
                <p className="text-[9px] font-mono text-neutral-500">Real-time mock environment loads</p>
              </div>
            </div>

            <div className="space-y-4 font-mono text-xs">
              <div>
                <div className="flex justify-between mb-1 font-bold">
                  <span>ORCHESTRATOR CPU</span>
                  <span>{cpuUsage}%</span>
                </div>
                <div className="w-full h-3.5 bg-neutral-100 border-2 border-black">
                  <div 
                    className="h-full bg-[#32ff84] border-r border-black transition-all duration-300" 
                    style={{ width: `${cpuUsage}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1 font-bold">
                  <span>HEAP SEGMENT MEMORY</span>
                  <span>{memUsage}MB / 1024MB</span>
                </div>
                <div className="w-full h-3.5 bg-neutral-100 border-2 border-black">
                  <div 
                    className="h-full bg-[#32ff84] border-r border-black transition-all duration-300" 
                    style={{ width: `${(memUsage / 1024) * 100}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 font-bold text-[10px] leading-snug">
                <div className="p-3 border-2 border-black bg-neutral-50 shadow-[2px_2px_0px_0px_#000]">
                  <span className="text-neutral-500 block">LOCAL ROUTER</span>
                  <span className="text-sm font-black uppercase text-black font-mono">OK / ESTABLISHED</span>
                </div>
                <div className="p-3 border-2 border-black bg-neutral-50 shadow-[2px_2px_0px_0px_#000]">
                  <span className="text-neutral-500 block">SYSTEM CONTROLS</span>
                  <span className="text-sm font-black uppercase text-[#32ff84] bg-black px-1 py-0.5 mt-1 inline-block">LIVE ACTIVE</span>
                </div>
              </div>
            </div>
          </div>

          {/* Docker Container Manager */}
          <div className="border-[3px] border-black bg-white p-5 shadow-[5px_5px_0px_0px_#000000]">
            <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4" />
                <h4 className="font-display font-black text-sm uppercase">SANDBOX CONTAINER CLUSTER</h4>
              </div>
              <span className="font-mono text-[9px] font-black bg-black text-[#32ff84] px-1.5 py-0.5 rounded">
                DOCKER CLI
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {containers.map(c => {
                const isRunning = c.status === 'RUNNING';
                return (
                  <div key={c.name} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border-2 border-black hover:bg-neutral-50 gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className={cn(
                          "w-2 h-2 rounded-full inline-block border border-black",
                          c.status === 'RUNNING' ? 'bg-[#32ff84]' : c.status === 'PAUSED' ? 'bg-yellow-300' : 'bg-rose-400'
                        )} />
                        <span className="font-bold text-black">{c.name}</span>
                      </div>
                      <div className="text-[10px] text-neutral-500 mt-0.5 flex gap-2">
                        <span>CPU: {c.cpu}</span>
                        <span>MEM: {c.mem}</span>
                        <span>UP: {c.uptime}</span>
                      </div>
                    </div>

                    <div className="flex gap-1.5 self-end">
                      {isRunning ? (
                        <button
                          onClick={() => toggleContainer(c.name, 'STOP')}
                          className="px-2 py-0.5 border border-black bg-white hover:bg-rose-100 text-rose-600 font-bold uppercase text-[9px] flex items-center gap-1 shadow-[1px_1px_0_0_#000]"
                        >
                          <Square className="w-2.5 h-2.5" /> STOP
                        </button>
                      ) : (
                        <button
                          onClick={() => toggleContainer(c.name, 'START')}
                          className="px-2 py-0.5 border border-black bg-white hover:bg-[#32ff84]/20 text-emerald-600 font-bold uppercase text-[9px] flex items-center gap-1 shadow-[1px_1px_0_0_#000]"
                        >
                          <Play className="w-2.5 h-2.5 fill-emerald-600" /> START
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Dynamic Build Speed Chart & CLI Logger */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Dynamic compiling speed chart */}
          <div className="border-[3px] border-black bg-white p-5 shadow-[5px_5px_0px_0px_#000000]">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h4 className="font-display font-black text-sm uppercase">COMPILER TRAFFIC SPEED INDEX</h4>
                <p className="text-[9px] font-mono text-neutral-500">Active compiler loads and index timings</p>
              </div>
              <Sparkles className="w-4.5 h-4.5 text-[#32ff84] animate-bounce" />
            </div>

            <div className="w-full h-[150px] relative px-1 border-2 border-black bg-neutral-900 overflow-hidden rounded">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 430 140">
                <line x1="0" y1="35" x2="430" y2="35" stroke="#222" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="0" y1="70" x2="430" y2="70" stroke="#222" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="0" y1="105" x2="430" y2="105" stroke="#222" strokeWidth="1" strokeDasharray="3 3" />

                <path d={graphAreaPath} fill="#32ff84" fillOpacity="0.08" />
                <path d={graphLinePath} fill="none" stroke="#32ff84" strokeWidth="3" />

                {chartData.map((d, i) => (
                  <g key={i}>
                    <rect 
                      x={d.x - 3} 
                      y={d.y - 3} 
                      width="6" 
                      height="6" 
                      fill="#000000" 
                      stroke="#32ff84" 
                      strokeWidth="2.0"
                    />
                  </g>
                ))}
              </svg>

              <div className="absolute bottom-2 left-2 right-2 flex justify-between font-mono text-[9px] text-[#32ff84] font-bold">
                <span>DOCKER METRICS CHRONOMETRY</span>
                <span>AVERAGE DOCKER LATENCY: 34ms</span>
              </div>
            </div>
          </div>

          {/* Core Interactive CLI output */}
          <div className="border-[3px] border-black bg-white shadow-[6px_6px_0px_0px_#000000] flex-1 flex flex-col rounded overflow-hidden">
            <div className="border-b-[3px] border-black bg-neutral-100 p-2 flex items-center justify-between">
              <div className="flex items-center gap-1">
                {(['console', 'system', 'allocations'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "px-3 py-1 font-mono text-[10px] sm:text-xs font-bold uppercase transition focus:outline-none",
                      activeTab === tab 
                        ? "bg-black text-[#32ff84] border-2 border-black" 
                        : "text-neutral-500 hover:text-black hover:bg-neutral-200 border-2 border-transparent"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              
              <button 
                onClick={() => setLogs([])}
                className="p-1 px-2.5 bg-white hover:bg-neutral-200 border-2 border-black shadow-[1.5px_1.5px_0px_0px_#000] active:translate-x-[0.5px] active:translate-y-[0.5px] active:shadow-none font-mono text-[10px] font-bold flex items-center gap-1"
                title="Prune queue"
              >
                <Trash2 className="w-3 h-3 text-red-600" /> Prune
              </button>
            </div>

            {/* Simulated interactive black terminal window */}
            <div className="bg-black p-4 text-[#32ff84] font-mono text-xs sm:text-sm min-h-[280px] max-h-[350px] overflow-hidden flex flex-col justify-between">
              
              {/* Output log strings */}
              <div 
                ref={logsContainerRef}
                className="flex-1 overflow-y-auto space-y-1.5 pr-2 custom-scrollbar"
              >
                {activeTab === 'console' && (
                  logs.length === 0 ? (
                    <div className="text-neutral-600 italic">Console output is empty. Initiate subroutines or use terminal below.</div>
                  ) : (
                    logs.map((L, i) => {
                      const isErr = L.includes('[ERR]') || L.includes('CRASHED');
                      const isWarn = L.includes('[WRN]') || L.includes('PAUSED');
                      const isUser = L.includes('visitor@kipeles:~$');
                      return (
                        <div key={i} className={cn(
                          "leading-relaxed select-text",
                          isErr ? 'text-red-400' : isWarn ? 'text-yellow-300' : isUser ? 'text-white font-extrabold' : 'text-[#32ff84]'
                        )}>
                          {L}
                        </div>
                      );
                    })
                  )
                )}

                {activeTab === 'system' && (
                  <div className="text-neutral-300 whitespace-pre overflow-x-auto text-[10px] sm:text-xs leading-relaxed select-text">
{`DEVELOPMENT_UPTIME: 14h 22m
ACTIVE_K8S_PODS:    5
COMPILE_ENGINE:     esbuild_v1.2.0
PLATFORM_ARCHITECTURE: x84_64-linux

------------------------------------------
RUNTIME CONFIGURATION DUMP
------------------------------------------
ORCHESTRATOR_MODE=microservice
CLUSTER_SYNC_INTERVAL_MS=4500
GATEWAY_MAX_SOCKETS=15000
ACCENT_GREEN_HEX=#32ff84
`}
                  </div>
                )}

                {activeTab === 'allocations' && (
                  <div className="text-neutral-300 whitespace-pre overflow-x-auto text-[10px] sm:text-xs leading-relaxed select-text">
{`PORT FIREWALL & CLUSTER ROUTING
======================================
[ACTIVE] 172.16.2.1:8080   -> GATEWAY_INGRESS_PROXY
[ACTIVE] 172.16.2.2:6379   -> REDIS_SESSION_CACHE
[LISTEN] 0.0.0.0:3000      -> DEV_WEB_UI_PORTAL
[DENY]   0.0.0.0:5432      -> DB_BACKEND_REPLICA (SECURED)

POLISHED ACCESS CONTROLS
--------------------------------------
PERMIT INBOUND TCP PORTS: 3000, 8080
REJECT ALL OUTBOUND UNSIGNED CREDENTIALS
`}
                  </div>
                )}
              </div>

              {/* Console interactive CLI command input bar */}
              <form onSubmit={handleCommandSubmit} className="flex items-center gap-1.5 border-t border-neutral-800 pt-2.5 mt-2.5">
                <span className="text-white font-black select-none">visitor@kipeles:~$</span>
                <input
                  type="text"
                  value={commandInput}
                  onChange={e => setCommandInput(e.target.value)}
                  placeholder="type command (e.g. help, status, env, build, clear)..."
                  className="flex-1 bg-transparent border-none text-white focus:outline-none placeholder-neutral-700 font-mono text-xs sm:text-sm caret-[#32ff84]"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                />
                <button type="submit" className="p-1 hover:bg-neutral-800 rounded text-neutral-400 hover:text-[#32ff84] transition">
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
