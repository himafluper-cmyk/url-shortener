import { useState } from 'react';
import { Copy, Trash2, ExternalLink, BarChart2, CheckCheck, Clock, MousePointerClick } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useDeleteUrl } from '../hooks/useUrls';
import { motion } from 'framer-motion';

export default function UrlCard({ url, index }) {
  const [copied, setCopied] = useState(false);
  const { mutate: deleteUrl, isPending: isDeleting } = useDeleteUrl();

  const shortUrl = `${import.meta.env.VITE_BASE_URL || 'http://localhost:5000'}/${url.shortCode}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    toast.success('Copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = () => {
    if (confirm('Delete this URL?')) deleteUrl(url._id);
  };

  const isExpired = url.expiresAt && new Date() > new Date(url.expiresAt);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`card p-4 hover:border-surface-700 transition-all duration-200 group ${isExpired ? 'opacity-60' : ''}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Title & original URL */}
          <div className="flex items-center gap-2 mb-1">
            {url.title && (
              <p className="text-sm font-semibold text-slate-200 truncate">{url.title}</p>
            )}
            {isExpired && (
              <span className="badge bg-red-500/20 text-red-400 shrink-0">Expired</span>
            )}
            {!url.isActive && (
              <span className="badge bg-yellow-500/20 text-yellow-400 shrink-0">Inactive</span>
            )}
          </div>
          <p className="text-xs text-slate-500 truncate mb-2">{url.originalUrl}</p>

          {/* Short URL */}
          <div className="flex items-center gap-2">
            <span className="font-mono text-brand-400 text-sm font-medium">
              {shortUrl.replace('http://', '').replace('https://', '')}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={handleCopy} className="btn-ghost p-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {copied ? <CheckCheck size={15} className="text-green-400" /> : <Copy size={15} />}
          </button>
          <a href={shortUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost p-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <ExternalLink size={15} />
          </a>
          <Link to={`/dashboard/url/${url._id}`} className="btn-ghost p-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <BarChart2 size={15} />
          </Link>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="btn-ghost p-2 opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300 hover:bg-red-500/10"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Footer stats */}
      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-surface-800">
        <span className="flex items-center gap-1.5 text-xs text-slate-500">
          <MousePointerClick size={12} className="text-brand-500" />
          {url.clicks} clicks
        </span>
        <span className="flex items-center gap-1.5 text-xs text-slate-500">
          <Clock size={12} />
          {formatDistanceToNow(new Date(url.createdAt), { addSuffix: true })}
        </span>
        {url.expiresAt && !isExpired && (
          <span className="flex items-center gap-1.5 text-xs text-amber-500">
            <Clock size={12} />
            Expires {formatDistanceToNow(new Date(url.expiresAt), { addSuffix: true })}
          </span>
        )}
      </div>
    </motion.div>
  );
}
