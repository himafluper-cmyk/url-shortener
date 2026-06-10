import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MousePointerClick, Monitor, Smartphone, Tablet, ExternalLink, Copy, CheckCheck } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useUrl } from '../hooks/useUrls';
import { format } from 'date-fns';

const DEVICE_ICONS = { desktop: Monitor, mobile: Smartphone, tablet: Tablet };
const PIE_COLORS = ['#6366f1', '#22d3ee', '#a78bfa'];

export default function UrlAnalytics() {
  const { id } = useParams();
  const { data, isLoading } = useUrl(id);
  const [copied, setCopied] = useState(false);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 rounded-2xl bg-surface-800 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const url = data?.data;
  const analytics = data?.analytics;
  const shortUrl = `${import.meta.env.VITE_BASE_URL || 'http://localhost:5000'}/${url?.shortCode}`;

  const deviceData = Object.entries(analytics?.deviceStats || {}).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
  }));

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    toast.success('Copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      {/* Back */}
      <Link to="/dashboard" className="btn-ghost text-sm mb-6 -ml-2 inline-flex">
        <ArrowLeft size={16} />
        Back to Dashboard
      </Link>

      {/* Header card */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-white mb-1 truncate">
              {url?.title || url?.shortCode}
            </h1>
            <p className="text-slate-500 text-sm truncate mb-3">{url?.originalUrl}</p>
            <div className="flex items-center gap-3">
              <span className="font-mono text-brand-400 text-sm">{shortUrl}</span>
              <button onClick={handleCopy} className="btn-ghost py-1 px-2 text-xs gap-1">
                {copied ? <CheckCheck size={13} className="text-green-400" /> : <Copy size={13} />}
                Copy
              </button>
              <a href={shortUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost py-1 px-2 text-xs gap-1">
                <ExternalLink size={13} />
                Open
              </a>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="card px-5 py-3 text-center border-brand-600/30 bg-brand-950/30">
              <p className="text-3xl font-bold text-brand-300">{analytics?.totalClicks || 0}</p>
              <p className="text-xs text-slate-500 mt-0.5">Total Clicks</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Clicks over time */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-5 lg:col-span-2"
        >
          <h2 className="text-sm font-semibold text-slate-300 mb-5">Clicks — Last 7 Days</h2>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={analytics?.clicksByDay || []}>
              <defs>
                <linearGradient id="clickGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                tickFormatter={(d) => format(new Date(d + 'T00:00:00'), 'MMM d')}
                tick={{ fill: '#64748b', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, fontSize: 12 }}
                labelFormatter={(d) => format(new Date(d + 'T00:00:00'), 'MMM d, yyyy')}
              />
              <Area type="monotone" dataKey="clicks" stroke="#6366f1" strokeWidth={2} fill="url(#clickGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Device breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="card p-5"
        >
          <h2 className="text-sm font-semibold text-slate-300 mb-5">Device Breakdown</h2>
          {deviceData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie data={deviceData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                    {deviceData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-4">
                {deviceData.map((d, i) => {
                  const Icon = DEVICE_ICONS[d.name.toLowerCase()] || Monitor;
                  return (
                    <div key={d.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-sm" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                        <Icon size={13} className="text-slate-400" />
                        <span className="text-xs text-slate-400">{d.name}</span>
                      </div>
                      <span className="text-xs font-medium text-slate-300">{d.value}</span>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-36 text-slate-600">
              <MousePointerClick size={28} className="mb-2" />
              <p className="text-xs">No clicks yet</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Metadata */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card p-5 mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4"
      >
        {[
          { label: 'Short Code', value: url?.shortCode },
          { label: 'Created', value: url?.createdAt ? format(new Date(url.createdAt), 'MMM d, yyyy') : '—' },
          { label: 'Expires', value: url?.expiresAt ? format(new Date(url.expiresAt), 'MMM d, yyyy') : 'Never' },
          { label: 'Status', value: url?.isActive ? 'Active' : 'Inactive' },
        ].map((item) => (
          <div key={item.label}>
            <p className="text-xs text-slate-500 mb-1">{item.label}</p>
            <p className="text-sm font-medium text-slate-200 font-mono">{item.value}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
