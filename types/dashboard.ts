export interface ChartDataPoint {
  name: string;
  value: number;
  color?: string;
  [key: string]: any;
}

export interface Metric {
  label: string;
  value: string;
  description: string;
  icon: string;
  variant?: 'default' | 'accent';
  delay?: number;
  isNew?: boolean;
}

export interface DynamicChart {
  id: string;
  title: string;
  description: string;
  chartType: 'bar' | 'pie' | 'line' | 'area' | 'scatter';
  data: { name: string; value: number }[];
  config?: { xKey: string; yKey: string; color?: string };
  isNew?: boolean;
}

export interface GenericInsight {
  title: string;
  severity: 'info' | 'warning' | 'positive';
  description: string;
  isNew?: boolean;
}

export interface Recommendation {
  title: string;
  action: string;
  impact?: 'high' | 'medium' | 'low';
  isNew?: boolean;
}

export interface DataCleaningStep {
  step: string;
  details: string;
}

export interface DashboardData {
  analysisTitle: string;
  analysisDescription: string;

  keyMetrics: Metric[];

  dynamicCharts: DynamicChart[];

  keyInsights: GenericInsight[];
  recommendations: Recommendation[];
  dataCleaningReport?: DataCleaningStep[];
  removals?: {
    type: 'metric' | 'chart' | 'insight' | 'recommendation';
    id?: string;
    title?: string;
  }[];
  isNew?: boolean;
  recordCount?: number;
}
