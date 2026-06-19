'use client';

import { useState, useEffect } from 'react';
import { ShieldCheck, Loader2, ArrowRight, AlertTriangle, Eye, EyeOff, Github } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getApexClient } from '@/lib/apex';

export default function LoginPage() {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isVerifyingOAuth, setIsVerifyingOAuth] = useState(true);

  // Parse URL to check if returning from GitHub OAuth redirection
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');

      if (token) {
        // Save the authenticated token
        localStorage.setItem('apex_token', token);
        const client = getApexClient();
        if (client) {
          client.setToken(token);
        }
        
        setSuccessMessage('OAUTH VERIFICATION SUCCESSFUL. HYDRATING SESSION...');
        setTimeout(() => {
          window.location.href = '/'; // Redirect to portfolio home page
        }, 1200);
      } else {
        setIsVerifyingOAuth(false);
      }
    }
  }, []);

  const handleGithubOAuth = () => {
    const client = getApexClient();
    if (client) {
      setIsSubmitting(true);
      // Construct return redirect back to this page
      const redirectUrl = `${window.location.origin}/login`;
      client.auth.loginWithGithub(redirectUrl);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const client = getApexClient();
      if (!client) throw new Error('ApexKit initialization failure.');

      if (authMode === 'signin') {
        const res = await client.auth.login(email, password);
        localStorage.setItem('apex_token', res.token);
        client.setToken(res.token, res.user);

        setSuccessMessage('SESSION CONVERGENCE SUCCESSFUL. LOADING PORTFOLIO...');
        setTimeout(() => {
          window.location.href = '/';
        }, 1200);
      } else {
        await client.auth.register(email, password);
        setSuccessMessage('ACCOUNT ISSUED SUCCESSFULLY. SWITCHING TO SIGN IN...');
        setAuthMode('signin');
        setPassword('');
      }
    } catch (err: any) {
      console.error('[Auth] Failed:', err);
      setErrorMessage(err.message || 'Identity verification rejected.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isVerifyingOAuth) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4 text-center font-mono">
        <Loader2 className="w-10 h-10 animate-spin text-[#32ff84]" />
        <p className="text-xs uppercase font-black tracking-widest text-black">
          Authenticating Transmission...
        </p>
      </div>
    );
  }

  return (
    <section className="mb-12 max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pt-10">
      <div className="flex items-center justify-center gap-3 mb-8">
        <div className="w-8 h-8 bg-black border-[3px] border-black text-[#32ff84] flex items-center justify-center shadow-[3px_3px_0px_0px_#000000]">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <h3 className="font-display font-black tracking-tight text-3xl uppercase">SECURE PORTAL</h3>
      </div>

      <div className="border-[3px] border-black bg-white p-6 sm:p-8 shadow-[6px_6px_0px_0px_#000000]">
        
        {/* GitHub OAuth Button */}
        <button
          type="button"
          onClick={handleGithubOAuth}
          disabled={isSubmitting}
          className="w-full mb-6 py-3.5 border-[3px] border-black bg-white hover:bg-[#32ff84] text-black font-mono font-black text-sm uppercase transition-all flex items-center justify-center gap-2.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50"
        >
          <Github className="w-5 h-5" />
          SIGN IN WITH GITHUB
        </button>

        <div className="relative flex items-center justify-center mb-6">
          <div className="absolute inset-0 h-0.5 bg-black" />
          <span className="relative bg-white px-3 font-mono text-[10px] font-bold text-neutral-400">OR</span>
        </div>

        {/* Toggle tabs */}
        <div className="flex bg-neutral-100 border-2 border-black p-1 mb-6 font-mono text-xs font-bold uppercase">
          <button
            onClick={() => { setAuthMode('signin'); setErrorMessage(''); }}
            className={cn("flex-1 py-2 border transition-all uppercase", authMode === 'signin' ? "bg-black text-[#32ff84] border-black" : "bg-transparent text-black border-transparent")}
            type="button"
          >
            SIGN IN
          </button>
          <button
            onClick={() => { setAuthMode('signup'); setErrorMessage(''); }}
            className={cn("flex-1 py-2 border transition-all uppercase", authMode === 'signup' ? "bg-black text-[#32ff84] border-black" : "bg-transparent text-black border-transparent")}
            type="button"
          >
            REGISTER
          </button>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 border-[2px] border-black bg-rose-100 text-rose-800 font-mono text-xs font-bold uppercase flex items-start gap-2.5 shadow-[3px_3px_0px_0px_#000000]">
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
            <div>
              <p className="font-black">Access Denied:</p>
              <p className="opacity-95 font-medium mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 border-[2px] border-black bg-[#32ff84]/20 text-emerald-800 font-mono text-xs font-bold uppercase flex items-start gap-2.5 shadow-[3px_3px_0px_0px_#000000]">
            <Loader2 className="w-4 h-4 mt-0.5 shrink-0 animate-spin" />
            <div>
              <p className="font-black">Process Ack:</p>
              <p className="opacity-95 font-medium mt-0.5">{successMessage}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleAuthSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] font-bold font-mono text-black uppercase block mb-1">
              Identity Vector / Email
            </label>
            <input 
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              disabled={isSubmitting}
              className="w-full bg-neutral-50 border-2 border-black p-3 font-mono text-sm focus:outline-none focus:bg-white focus:shadow-[4px_4px_0px_0px_#32ff84] transition-all disabled:opacity-50"
              placeholder="YOUR@EMAIL.COM"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold font-mono text-black uppercase block mb-1">
              Security Keyphrase / Password
            </label>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'} 
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                disabled={isSubmitting}
                className="w-full bg-neutral-50 border-2 border-black p-3 pr-10 font-mono text-sm focus:outline-none focus:bg-white focus:shadow-[4px_4px_0px_0px_#32ff84] transition-all disabled:opacity-50"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-neutral-400 hover:text-black transition"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full mt-2 px-8 py-4 font-mono font-black border-[3px] border-black text-sm uppercase transition-all flex items-center justify-center gap-2 bg-black text-white hover:bg-[#32ff84] hover:text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                {authMode === 'signin' ? 'AUTHORIZE CONVERGENCE' : 'PROVISION ACCOUNT'}
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
}