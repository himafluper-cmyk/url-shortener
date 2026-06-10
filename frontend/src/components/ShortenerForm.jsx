import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link2, Scissors, Copy, ExternalLink, CheckCheck, ChevronDown, ChevronUp, Calendar, Tag } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCreateUrl } from '../hooks/useUrls';

export default function ShortenerForm() {
  const [url, setUrl] = useState('');
  const [alias, setAlias] = useState('');
  const [title, setTitle] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const { mutateAsync: createUrl, isPending } = useCreateUrl();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) return toast.error('Please enter a URL');

    try {
      const { data } = await createUrl({
        originalUrl: url.trim(),
        customAlias: alias.trim() || undefined,
        title: title.trim() || undefined,
        expiresAt: expiresAt || undefined,
      });
      setResult(data.data);
      toast.success('URL shortened successfully! 🎉');
    } catch (_) {}
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(result.shortUrl);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="card p-2 flex gap-2">
          <div className="flex-1 relative">
            <Link2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste your long URL here..."
              className="input pl-9 py-3.5 rounded-xl border-0 bg-surface-800 focus:ring-1"
              required
            />
          </div>
          <button type="submit" disabled={isPending} className="btn-primary px-6 shrink-0">
            {isPending ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Scissors size={16} />
            )}
            {isPending ? 'Shortening...' : 'Shorten'}
          </button>
        </div>

        {/* Advanced options */}
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 mt-3 ml-1 transition-colors"
        >
          {showAdvanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          Advanced options
        </button>

        <AnimatePresence>
          {showAdvanced && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="card p-4 mt-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="label text-xs">Custom Alias</label>
                  <div className="relative">
                    <Tag size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      value={alias}
                      onChange={(e) => setAlias(e.target.value)}
                      placeholder="my-link"
                      className="input pl-8 py-2.5 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="label text-xs">Title (optional)</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="My awesome link"
                    className="input py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="label text-xs">Expires At</label>
                  <div className="relative">
                    <Calendar size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="datetime-local"
                      value={expiresAt}
                      onChange={(e) => setExpiresAt(e.target.value)}
                      className="input pl-8 py-2.5 text-sm"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="card mt-4 p-4 border-brand-600/40 bg-brand-950/30"
          >
            <p className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wider">Your Short URL</p>
            <div className="flex items-center gap-3">
              <div className="flex-1 font-mono text-brand-300 text-sm bg-surface-800 px-3 py-2.5 rounded-lg truncate">
                {result.shortUrl}
              </div>
              <button onClick={copyToClipboard} className="btn-secondary py-2.5 text-sm shrink-0">
                {copied ? <CheckCheck size={16} className="text-green-400" /> : <Copy size={16} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <a
                href={result.shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost py-2.5 px-3 shrink-0"
              >
                <ExternalLink size={16} />
              </a>
            </div>
            <p className="text-xs text-slate-600 mt-2 truncate">
              ↳ {result.originalUrl}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
