import { StatCard } from '@/components/StatCard';
import { KEY_METRICS } from '@/data/dashboard-data';

export function KeyMetrics() {
  return (
    <section className="mb-12 md:mb-16">
      <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 md:mb-8">Key Metrics</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {KEY_METRICS.map((metric, index) => (
          <StatCard
            key={index}
            label={metric.label}
            value={metric.value}
            description={metric.description}
            icon={<metric.icon size={24} />}
            variant={metric.variant}
            delay={metric.delay}
          />
        ))}
      </div>
    </section>
  );
}
