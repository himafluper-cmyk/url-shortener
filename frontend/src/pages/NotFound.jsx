import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Link2Off } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <Link2Off size={48} className="text-slate-700 mx-auto mb-4" />
        <h1 className="text-6xl font-extrabold text-white mb-3">404</h1>
        <p className="text-slate-400 mb-6">This link doesn't exist or has been removed.</p>
        <Link to="/" className="btn-primary">
          <Home size={16} />
          Back Home
        </Link>
      </motion.div>
    </div>
  );
}
