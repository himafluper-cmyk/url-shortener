import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock3, Home, Link2Off, PlusCircle, Copy } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ExpiredLink() {
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code');

  const copyCode = async () => {
    if (!code) return;
    await navigator.clipboard.writeText(code);
    toast.success('Short code copied');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-brand-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-[-120px] w-[260px] h-[260px] bg-slate-700/20 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-xl"
      >
        <div className="card p-8 sm:p-10 text-center relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-500/50 to-transparent" />

          <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
            <Link2Off size={28} className="text-brand-400" />
          </div>

          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-medium mb-5">
            <Clock3 size={12} />
            Link expired
          </span>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
            This short link has expired
          </h1>
          <p className="text-slate-400 leading-relaxed max-w-md mx-auto">
            The destination is no longer available because the link reached its expiration date.
            Create a fresh short link and share that one instead.
          </p>

          {code && (
            <div className="mt-6 card p-4 bg-surface-950/60 border-surface-800 inline-flex items-center gap-3">
              <div className="text-left">
                <p className="text-xs uppercase tracking-widest text-slate-500 mb-1">Expired code</p>
                <p className="font-mono text-brand-300 text-sm break-all">{code}</p>
              </div>
              <button
                type="button"
                onClick={copyCode}
                className="btn-ghost px-3 py-2 shrink-0 text-slate-300 hover:text-white"
                aria-label="Copy short code"
              >
                <Copy size={16} />
              </button>
            </div>
          )}

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/" className="btn-primary">
              <Home size={16} />
              Go Home
            </Link>
            <Link to="/" className="btn-secondary">
              <PlusCircle size={16} />
              Create New Link
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
