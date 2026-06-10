import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link2, MousePointerClick, Activity, Search, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUrls, useDashboardStats } from '../hooks/useUrls';
import { useAuthStore } from '../hooks/useAuthStore';
import UrlCard from '../components/UrlCard';
import StatsCard from '../components/StatsCard';
import ShortenerForm from '../components/ShortenerForm';

export default function Dashboard() {
  const { user } = useAuthStore();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);

  const { data: urlsData, isLoading } = useUrls({ search, page, limit: 8 });
  const { data: stats } = useDashboardStats();

  const urls = urlsData?.data || [];
  const pagination = urlsData?.pagination;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Dashboard
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">Welcome back, {user?.name?.split(' ')[0]} 👋</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary text-sm self-start sm:self-auto"
        >
          <Plus size={16} />
          New Short URL
        </button>
      </div>

      {/* Inline form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-8"
        >
          <ShortenerForm />
        </motion.div>
      )}

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatsCard
          index={0}
          label="Total Links"
          value={stats?.totalUrls ?? 0}
          icon={Link2}
          color="bg-brand-500/15 text-brand-400"
        />
        <StatsCard
          index={1}
          label="Total Clicks"
          value={stats?.totalClicks ?? 0}
          icon={MousePointerClick}
          color="bg-green-500/15 text-green-400"
        />
        <StatsCard
          index={2}
          label="Active Links"
          value={stats?.activeUrls ?? 0}
          icon={Activity}
          color="bg-purple-500/15 text-purple-400"
        />
      </div>

      {/* URL list */}
      <div className="card p-5">
        {/* Search bar */}
        <div className="relative mb-5">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search links..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="input pl-10 py-2.5 text-sm"
          />
        </div>

        {/* List */}
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 rounded-xl bg-surface-800 animate-pulse" />
            ))}
          </div>
        ) : urls.length === 0 ? (
          <div className="text-center py-16">
            <Link2 size={32} className="text-slate-700 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">No links yet. Create your first one above!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {urls.map((url, i) => (
              <UrlCard key={url._id} url={url} index={i} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="flex items-center justify-between mt-5 pt-4 border-t border-surface-800">
            <p className="text-xs text-slate-500">{pagination.total} total links</p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-secondary text-sm py-1.5 px-3 disabled:opacity-40"
              >
                Prev
              </button>
              <span className="btn-ghost text-sm py-1.5 px-3 cursor-default">
                {page} / {pagination.pages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                disabled={page === pagination.pages}
                className="btn-secondary text-sm py-1.5 px-3 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
