import { Megaphone, Target, Lightbulb, BarChart3, Users, Trophy, TrendingUp } from 'lucide-react';
import clsx from 'clsx';
import { MarketingData } from '@/types/dashboard';

interface MarketingConclusionProps {
  data: MarketingData;
}

export function MarketingConclusion({ data }: MarketingConclusionProps) {
  const { targetAudience, recommendations, strategies, roi } = data;

  return (
    <section className="mb-12 md:mb-16">
      <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 md:mb-8 flex items-center gap-3">
        <Megaphone className="text-teal-600" size={28} />
        Marketing Campaigns Conclusion
      </h3>
      
      <div className="bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 rounded-xl p-8 border border-teal-200 mb-8">
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          Based on our comprehensive analysis of the user data, we have identified key insights that should drive strategic marketing decisions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Target Audience */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-lg shadow-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center">
              <Target className="text-teal-600" size={24} />
            </div>
            <h4 className="text-xl font-bold text-gray-900">Target Audience</h4>
          </div>
          <ul className="space-y-3 text-sm text-gray-700">
            {targetAudience.map((item, i) => (
               <li key={i}><strong>{item.label}</strong> {item.text}</li>
            ))}
          </ul>
        </div>

        {/* Campaign Recommendations */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-lg shadow-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
              <Lightbulb className="text-orange-600" size={24} />
            </div>
            <h4 className="text-xl font-bold text-gray-900">Campaign Recommendations</h4>
          </div>
          <ul className="space-y-3 text-sm text-gray-700">
             {recommendations.map((item, i) => (
               <li key={i}><strong>{item.label}</strong> {item.text}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Strategic Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {strategies.map((strategy, index) => {
          // Dynamic icon mapping or fallback
          // Since icon is a string from AI, we might not have the component. 
          // For now, let's just use TrendingUp as generic if specific mapping isn't easy, 
          // OR we can trust the string matches Lucide names if we map them.
          // The previous code had `strategy.icon` as a component. The API returns a string.
          // Let's us a generic icon for now to avoid crashes.
           return (
           <div key={index} className="rounded-xl p-6 text-white shadow-md bg-gradient-to-br from-violet-600 to-indigo-600">
            <TrendingUp className="mb-3" size={32} />
            <h4 className="font-bold text-lg mb-2">{strategy.title}</h4>
            <p className="text-sm opacity-90">{strategy.desc}</p>
          </div>
        )})}
      </div>

      {/* ROI Projections */}
      <div className="bg-gray-900 rounded-xl p-8 text-white shadow-xl">
        <h4 className="text-xl font-bold mb-6 flex items-center gap-3">
          <TrendingUp size={24} />
          Projected Marketing ROI
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {roi.map((metric, index) => (
             <div key={index} className="text-center p-4 bg-gray-800/50 rounded-lg">
               <p className={`text-3xl md:text-4xl font-bold text-${metric.color}-400`}>{metric.value}</p>
               <p className="text-xs md:text-sm text-gray-400 mt-1">{metric.label}</p>
             </div>
          ))}
        </div>
      </div>
    </section>
  );
}
