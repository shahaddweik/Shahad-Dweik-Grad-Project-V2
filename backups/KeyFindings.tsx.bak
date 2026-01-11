import { motion } from 'framer-motion';
import { KEY_FINDINGS } from '@/data/dashboard-data';

export function KeyFindings() {
  return (
    <section className="mb-12 md:mb-16">
      <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 md:mb-8">Key Findings</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {KEY_FINDINGS.map((finding, index) => (
           <motion.div 
             key={index}
             whileHover={{ scale: 1.02 }} 
             className={`rounded-xl p-6 shadow-sm border ${
               index === 0 
               ? 'bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-100' // First item special styling
               : 'bg-white border-gray-100'
             }`}
           >
            <h4 className="font-bold text-gray-900 mb-3">{finding.title}</h4>
            <p className="text-sm text-gray-700">{finding.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
