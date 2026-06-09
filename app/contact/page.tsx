'use client';

import { useState } from 'react';
import { Send, Loader2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ContactPage() {
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) return;

    setIsSubmittingContact(true);
    // Simulated high-fidelity API packet dispatch
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmittingContact(false);
    setContactSuccess(true);
    setContactName('');
    setContactEmail('');
    setContactMessage('');
    setTimeout(() => setContactSuccess(false), 5000);
  };

  return (
    <section className="mb-12 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-6 h-6 bg-[#32ff84] border-[3px] border-black flex-shrink-0 shadow-[2px_2px_0px_0px_#000000]" />
        <h3 className="font-display font-black tracking-tight text-2xl uppercase">SYSTEMS CONTACT PORTAL</h3>
      </div>

      <div className="border-[3px] border-black bg-white p-6 sm:p-8 shadow-[6px_6px_0px_0px_#000000]">
        <h4 className="font-display font-black text-xl mb-2 uppercase">
          Currently open to specialized developer integrations, full-stack consulting, and low-latency architectural roles.
        </h4>
        
        <p className="text-xs font-mono font-bold text-neutral-500 uppercase tracking-wider mb-8">
          Send an encrypted contact transmission directly to my endpoint
        </p>

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
                className="w-full bg-neutral-50 border-2 border-black p-3 font-mono text-sm focus:outline-none focus:bg-white focus:shadow-[4px_4px_0px_0px_#32ff84] transition-all"
                placeholder="YOUR NAME"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold font-mono text-black uppercase block mb-1">
                Return Vector / Email
              </label>
              <input 
                type="email" 
                value={contactEmail}
                onChange={e => setContactEmail(e.target.value)}
                required
                className="w-full bg-neutral-50 border-2 border-black p-3 font-mono text-sm focus:outline-none focus:bg-white focus:shadow-[4px_4px_0px_0px_#32ff84] transition-all"
                placeholder="YOUR@EMAIL.COM"
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
              className="w-full bg-neutral-50 border-2 border-black p-3 font-mono text-sm focus:outline-none focus:bg-white focus:shadow-[4px_4px_0px_0px_#32ff84] transition-all resize-y"
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
    </section>
  );
}
