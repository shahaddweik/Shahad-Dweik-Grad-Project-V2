import { VisualizationCard } from '@/components/VisualizationCard';
import { ENGAGEMENT_CHARTS } from '@/data/dashboard-data';

export function EngagementSkills() {
  return (
    <section className="mb-12 md:mb-16">
      <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 md:mb-8">Engagement & Skills</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {ENGAGEMENT_CHARTS.map((chart, index) => (
          <VisualizationCard
            key={index}
            title={chart.title}
            description={chart.description}
            imageSrc={chart.imageSrc}
            imageAlt={chart.imageAlt}
          />
        ))}
      </div>
    </section>
  );
}
