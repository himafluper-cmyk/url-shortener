import { motion } from 'framer-motion';
import { Zap, BarChart2, Shield, Globe } from 'lucide-react';
import ShortenerForm from '../components/ShortenerForm';

const features = [
  { icon: Zap, title: 'Lightning Fast', desc: 'Sub-millisecond redirects powered by Redis caching', color: 'text-yellow-400' },
  { icon: BarChart2, title: 'Rich Analytics', desc: 'Track clicks, devices, locations and trends', color: 'text-brand-400' },
  { icon: Shield, title: 'Secure & Reliable', desc: 'Rate limiting, JWT auth, and 99.9% uptime', color: 'text-green-400' },
  { icon: Globe, title: 'Custom Aliases', desc: 'Brand your links with memorable short names', color: 'text-purple-400' },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-24 pb-20 px-4 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-600/20 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-medium mb-6">
              <Zap size={12} className="fill-brand-400" />
              Fast · Trackable · Free
            </span>
            <h1 className="text-5xl sm:text-6xl font-extrabold text-white leading-tight mb-5 tracking-tight">
              Shorten. Track.
              <br />
              <span className="text-brand-400">Share.</span>
            </h1>
            <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
              Transform long, ugly URLs into clean, powerful short links — with real-time analytics, custom aliases, and expiry control.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <ShortenerForm />
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-xs font-semibold text-slate-500 uppercase tracking-widest mb-10"
          >
            Everything you need
          </motion.p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="card p-5 hover:border-surface-700 transition-colors"
              >
                <f.icon size={22} className={`${f.color} mb-3`} />
                <h3 className="font-semibold text-slate-200 mb-1">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
