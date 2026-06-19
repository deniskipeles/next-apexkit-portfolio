'use client';

import { useState, useEffect } from 'react';
import { Send, Loader2, Check, AlertTriangle, ShieldAlert, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { getApexClient } from '@/lib/apex';

export default function ContactPage() {
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contactError, setContactError] = useState('');

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('apex_token');
      if (!token) {
        setIsCheckingAuth(false);
        return;
      }

      try {
        const client = getApexClient();
        if (client) {
          client.setToken(token);
          // Fetch current profile metrics
          const user = await client.auth.getMe();
          setIsAuthenticated(true);
          setContactEmail(user.email); // Auto-fill verified return vector
        }
      } catch (err) {
        console.warn('[Contact] Session stale or expired:', err);
        localStorage.removeItem('apex_token');
        setIsAuthenticated(false);
      } finally {
        setIsCheckingAuth(false);
      }
    };
    checkAuthStatus();
  }, []);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) return;

    setIsSubmittingContact(true);
    setContactError('');

    try {
      const client = getApexClient();
      if (client) {
        // Dispatch transmission payload securely to messages collection
        await client.collection('messages').create({
          name: contactName,
          email: contactEmail,
          message: contactMessage,
        });

        setIsSubmittingContact(false);
        setContactSuccess(true);
        setContactName('');
        setContactMessage('');
        setTimeout(() => setContactSuccess(false), 5000);
      } else {
        throw new Error('ApexKit client failed to initialize.');
      }
    } catch (err: any) {
      console.error('[Contact] Transmission failure:', err);
      setContactError(err.message || 'Failed to dispatch transmission payload.');
      setIsSubmittingContact(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="flex h-[40vh] flex-col items-center justify-center gap-4 text-center font-mono">
        <Loader2 className="w-8 h-8 animate-spin text-[#32ff84]" />
        <p className="text-xs uppercase font-black tracking-widest text-black">
          Decrypting session key...
        </p>
      </div>
    );
  }

  return (
    <section className="mb-12 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-6 h-6 bg-[#32ff84] border-[3px] border-black flex-shrink-0 shadow-[2px_2px_0px_0px_#000000]" />
        <h3 className="font-display font-black tracking-tight text-2xl uppercase">SYSTEMS CONTACT PORTAL</h3>
      </div>

      {!isAuthenticated ? (
        // Access Denied Box (Unauthenticated guests)
        <div className="border-[3px] border-black bg-white p-8 shadow-[6px_6px_0px_0px_#000000] text-center max-w-2xl mx-auto">
          <div className="w-16 h-16 bg-black text-rose-400 border-[3px] border-black flex items-center justify-center mx-auto mb-6 shadow-[3px_3px_0px_0px_#000000]">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h4 className="font-display font-black text-2xl uppercase mb-3">TRANSMISSION BLOCKED</h4>
          <p className="text-xs font-mono font-bold text-neutral-500 uppercase tracking-wider mb-6">
            Authentication credentials are required to initiate contacting subroutines.
          </p>
          <p className="text-sm font-semibold text-neutral-700 leading-relaxed mb-8 max-w-md mx-auto">
            To prevent spam payloads on my SQLite databases, only authenticated GitHub visitors can send direct transmissions.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#32ff84] border-[3px] border-black font-mono font-black text-xs uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            AUTHORIZE PORTAL ID
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        // Form unlocked (Authenticated users)
        <div className="border-[3px] border-black bg-white p-6 sm:p-8 shadow-[6px_6px_0px_0px_#000000]">
          <h4 className="font-display font-black text-xl mb-2 uppercase">
            Currently open to specialized developer integrations, full-stack consulting, and low-latency architectural roles.
          </h4>
          
          <p className="text-xs font-mono font-bold text-neutral-500 uppercase tracking-wider mb-8">
            Send an encrypted contact transmission directly to my endpoint
          </p>

          {contactError && (
            <div className="mb-6 p-4 border-[2px] border-black bg-rose-100 text-rose-800 font-mono text-xs font-bold uppercase flex items-start gap-2.5 shadow-[3px_3px_0px_0px_#000000]">
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
              <div>
                <p className="font-black">Transmission Error:</p>
                <p className="opacity-95 font-medium mt-0.5">{contactError}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold font-mono text-black uppercase block mb-1">
                  Identity Identifier / Name
                </label>
                <input 
                  type="text" 
                  value={contactName}
                  onChange={e => setContactName(e.target.value)}
                  required
                  disabled={isSubmittingContact}
                  className="w-full bg-neutral-50 border-2 border-black p-3 font-mono text-sm focus:outline-none focus:bg-white focus:shadow-[4px_4px_0px_0px_#32ff84] transition-all disabled:opacity-50"
                  placeholder="YOUR NAME"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold font-mono text-black uppercase block mb-1">
                  Return Vector / Email (Verified)
                </label>
                <input 
                  type="email" 
                  value={contactEmail}
                  readOnly
                  className="w-full bg-neutral-200 border-2 border-black p-3 font-mono text-sm text-neutral-500 cursor-not-allowed select-all"
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold font-mono text-black uppercase block mb-1">
                Transmission Payload / Message
              </label>
              <textarea 
                value={contactMessage}
                onChange={e => setContactMessage(e.target.value)}
                required
                rows={5}
                disabled={isSubmittingContact}
                className="w-full bg-neutral-50 border-2 border-black p-3 font-mono text-sm focus:outline-none focus:bg-white focus:shadow-[4px_4px_0px_0px_#32ff84] transition-all resize-y disabled:opacity-50"
                placeholder="YOUR MESSAGE..."
              ></textarea>
            </div>
            <button 
              type="submit" 
              disabled={isSubmittingContact || contactSuccess}
              className={cn(
                "w-full sm:w-auto px-8 py-4 font-mono font-black border-[3px] border-black text-sm uppercase transition-all flex items-center justify-center gap-2",
                contactSuccess 
                  ? "bg-[#32ff84] text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" 
                  : "bg-black text-white hover:bg-[#32ff84] hover:text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              )}
            >
              {isSubmittingContact ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : contactSuccess ? (
                <>
                  <Check className="w-5 h-5" />
                  TRANSMISSION SENT SUCCESSFULLY
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  INITIATE CONTACT
                </>
              )}
            </button>
          </form>
        </div>
      )}
    </section>
  );
}