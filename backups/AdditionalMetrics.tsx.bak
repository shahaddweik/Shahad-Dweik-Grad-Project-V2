import { motion } from 'framer-motion';
import { ADDITIONAL_METRICS } from '@/data/dashboard-data';
import clsx from 'clsx';

export function AdditionalMetrics() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.section 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
      className="mb-12 md:mb-16"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {ADDITIONAL_METRICS.map((metric, index) => (
          <motion.div 
            key={index}
            variants={itemVariants} 
            className={clsx(
              "rounded-xl p-6 text-white shadow-lg",
              metric.className
            )}
          >
            <h4 className="text-lg font-bold mb-2">{metric.title}</h4>
            <p className="text-4xl font-bold">{metric.value}</p>
            <p className="text-sm opacity-80 mt-1">{metric.sub}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
// NOTE: Ideally I should update data.tsx to include full class strings.
