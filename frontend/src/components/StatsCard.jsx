import { motion } from 'framer-motion';

export default function StatsCard({ label, value, icon: Icon, color, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="card p-5 flex items-center gap-4"
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={22} />
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-100">{value ?? '—'}</p>
        <p className="text-sm text-slate-500">{label}</p>
      </div>
    </motion.div>
  );
}
