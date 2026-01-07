'use client';

import { useState, useEffect } from 'react';
import { FileUploader } from '@/components/FileUploader';
import { SkeletonLoader } from '@/components/SkeletonLoader';
import { DashboardView } from '@/components/DashboardView';
import { DashboardData } from '@/types/dashboard';
import { PageHeader, PageFooter } from '@/components/LayoutComponents';

export default function Home() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [currentFile, setCurrentFile] = useState<File | null>(null);

  /* Persistence Logic */
  useEffect(() => {
    const savedData = localStorage.getItem('shahad_dashboard_data');
    if (savedData) {
      try {
        setData(JSON.parse(savedData));
      } catch (e) {
        console.error("Failed to load saved dashboard", e);
      }
    }
  }, []);

  useEffect(() => {
    if (data) {
      localStorage.setItem('shahad_dashboard_data', JSON.stringify(data));
    }
  }, [data]);

  const handleUpload = async (file: File, prompt?: string) => {
    setIsAnalyzing(true);
    setCurrentFile(file);

    // Create an abort controller for timeout (60 seconds)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    try {
      const formData = new FormData();
      formData.append('file', file);
      if (prompt) {
        formData.append('customPrompt', prompt);
      }

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.details || 'Analysis failed');
      }

      const result = await response.json();
      // Mark initial items as NOT new to prevent badges on first load
      const cleanResult = {
        ...result,
        keyMetrics: result.keyMetrics?.map((m: any) => ({ ...m, isNew: false })) || [],
        dynamicCharts: result.dynamicCharts?.map((c: any) => ({ ...c, isNew: false })) || [],
        keyInsights: result.keyInsights?.map((i: any) => ({ ...i, isNew: false })) || [],
        recommendations: result.recommendations?.map((r: any) => ({ ...r, isNew: false })) || []
      };

      setData(cleanResult);
    } catch (error: any) {
      console.error('Error analyzing file:', error);
      if (error.name === 'AbortError') {
        alert('Request timed out. The file might be too large or the AI service is busy. Please try again.');
      } else {
        alert(error.message || 'Failed to analyze the file.');
      }
    } finally {
      clearTimeout(timeoutId);
      setIsAnalyzing(false);
    }
  };

  const [showSuccess, setShowSuccess] = useState(false);


  /* Persistence Logic */
  // ... existing imports ...

  // ... inside Home component ...
  const [particles, setParticles] = useState<Array<{ width: string, height: string, left: string, delay: string, duration: string }>>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 80 }).map(() => {
      const duration = 15 + Math.random() * 25; // 15-40s duration
      return {
        width: (Math.random() * 3 + 1.5) + 'px', // Min size 1.5px
        height: (Math.random() * 3 + 1.5) + 'px',
        left: Math.random() * 100 + '%',
        // Negative delay simulates the animation having started already
        delay: -(Math.random() * duration) + 's',
        duration: duration + 's'
      };
    });
    setParticles(newParticles);
  }, []);

  const handleRefine = async (refinePrompt: string) => {
    if (!currentFile) return;
    setIsRefining(true);

    try {
      // Gather current state context to help AI identify what to remove/replace
      const currentContext = {
        metrics: data?.keyMetrics.map(m => m.label).join(", "),
        charts: data?.dynamicCharts.map(c => c.title).join(", "),
        insights: data?.keyInsights.map(i => i.title).join(", "),
        recommendations: data?.recommendations.map(r => r.title).join(", ")
      };

      const formData = new FormData();
      formData.append('file', currentFile);
      // Append instruction to be additive AND context
      formData.append('customPrompt', `(ADDITIVE REQUEST): ${refinePrompt}. 
      Generate ONLY the new requested metrics/charts/insights to append to the existing dashboard. 
      Do not regenerate existing data unless replacing.
      
      CURRENT DASHBOARD ITEMS (DO NOT DUPLICATE THESE):
      - Metrics: ${currentContext.metrics}
      - Charts: ${currentContext.charts}
      - Insights: ${currentContext.insights}
      - Recommendations: ${currentContext.recommendations}

      STRICT NO DUPLICATES RULE: Check the "Charts" list above. If a requested chart matches an existing title, DO NOT generate it again. Choose a different metric or title.
      `);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Refinement failed');
      }

      const newResult = await response.json();

      // Mark new items and SCRUB chart data to ensure numbers
      const markNew = (items: any[]) => items.map(item => ({ ...item, isNew: true }));
      const scrubCharts = (charts: any[]) => charts.map((chart: any) => ({
        ...chart,
        isNew: true,
        chartType: chart.chartType?.toLowerCase(), // Enforce lowercase
        data: chart.data.map((d: any) => ({
          ...d,
          value: typeof d.value === 'string' ? parseFloat(d.value.replace(/[^0-9.-]/g, '')) : d.value
        }))
      }));

      const newItemSet = {
        keyMetrics: markNew(newResult.keyMetrics || []),
        dynamicCharts: scrubCharts(newResult.dynamicCharts || []),
        keyInsights: markNew(newResult.keyInsights || []),
        recommendations: markNew(newResult.recommendations || [])
      };

      // Process Removals
      const removals = newResult.removals || [];

      setData((prevData) => {
        if (!prevData) return newResult;

        // Helper to filter out removed items
        const filterRemoved = (items: any[], type: string, key: string) => {
          const removedTitles = new Set(
            removals.filter((r: any) => r.type === type).map((r: any) => r.title)
          );
          return items.filter(item => !removedTitles.has(item[key]));
        };

        // Filter valid previous data (excluding removals)
        const prevMetrics = filterRemoved(prevData.keyMetrics, 'metric', 'label');
        const prevCharts = filterRemoved(prevData.dynamicCharts, 'chart', 'title');
        const prevInsights = filterRemoved(prevData.keyInsights, 'insight', 'title');
        const prevRecs = filterRemoved(prevData.recommendations, 'recommendation', 'title');

        // Helper to remove duplicates based on a key (merging filtered prev + new)
        const mergeUnique = (prev: any[], next: any[], key: string) => {
          const existingKeys = new Set(prev.map(item => item[key]));
          return [...prev, ...next.filter(item => !existingKeys.has(item[key]))];
        };

        return {
          ...prevData,
          keyMetrics: mergeUnique(prevMetrics, newItemSet.keyMetrics, 'label'),
          dynamicCharts: mergeUnique(prevCharts, newItemSet.dynamicCharts, 'title'),
          keyInsights: mergeUnique(prevInsights, newItemSet.keyInsights, 'title'),
          recommendations: mergeUnique(prevRecs, newItemSet.recommendations, 'title'),

          analysisTitle: prevData.analysisTitle,
          analysisDescription: prevData.analysisDescription
        };
      });

      // Trigger Success Animation
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000); // Hide after 3s

    } catch (error: any) {
      console.error('Refinement error:', error);
      alert('Failed to refine analysis: ' + error.message);
    } finally {
      setIsRefining(false);
    }
  };

  const handleReset = () => {
    setData(null);
    setCurrentFile(null);
    localStorage.removeItem('shahad_dashboard_data');
  };

  const handleSessionRestore = (file: File) => {
    setCurrentFile(file);
  };

  if (isAnalyzing) {
    return <SkeletonLoader />;
  }

  if (data) {
    return (
      <DashboardView
        data={data}
        onReset={handleReset}
        onRefine={handleRefine}
        isRefining={isRefining}
        isSessionActive={!!currentFile}
        onSessionRestore={handleSessionRestore}
        showSuccess={showSuccess}
      />
    );
  }

  return (
    <div className="min-h-screen relative flex flex-col font-sans bg-black overflow-hidden selection:bg-blue-500/30">

      {/* Dynamic Aurora Background - Fixed Position to cover viewport always */}
      <div className="fixed inset-0 z-0 bg-[#000000] overflow-hidden">

        {/* Deep Space Base Gradient - Pitch Black */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#000000] via-[#010108] to-[#0a0a1a]"></div>

        {/* Shooting Star - Bottom Left to Top Right */}
        <div className="absolute bottom-0 left-0 w-[400px] h-[3px] bg-gradient-to-r from-transparent via-white to-transparent opacity-0 animate-[shooting-star_4s_ease-out_forwards] blur-[2px] rotate-[-45deg] origin-bottom-left"></div>
        <div className="absolute bottom-[10%] left-[10%] w-[300px] h-[3px] bg-gradient-to-r from-transparent via-blue-200 to-transparent opacity-0 animate-[shooting-star_5s_ease-out_1s_forwards] blur-[1px] rotate-[-45deg] origin-bottom-left"></div>

        {/* Aurora Bands */}
        <div className="absolute inset-0 opacity-40 mix-blend-screen overflow-hidden">
          <div className="absolute -inset-[50%] bg-gradient-to-r from-transparent via-purple-500 to-transparent blur-[100px] animate-aurora-1 opacity-50"></div>
          <div className="absolute -inset-[50%] bg-gradient-to-t from-transparent via-blue-500 to-transparent blur-[80px] animate-aurora-2 opacity-40"></div>
          <div className="absolute -inset-[50%] bg-gradient-to-br from-transparent via-indigo-400 to-transparent blur-[90px] animate-aurora-3 opacity-30"></div>
        </div>

        {/* Floating Particles/Stars */}
        <div className="absolute inset-0">
          {particles.map((p, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full"
              style={{
                width: p.width,
                height: p.height,
                left: p.left,
                top: '100%',
                animationName: 'float',
                animationTimingFunction: 'linear',
                animationIterationCount: 'infinite',
                animationDelay: p.delay,
                animationDuration: p.duration
              }}
            ></div>
          ))}
        </div>

        {/* Noise overlay for texture */}
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.15] mix-blend-overlay pointer-events-none"></div>

        {/* Subtle grid */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.05] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen text-white">
        <PageHeader />

        <main className="flex-grow flex flex-col items-center justify-center p-4">
          <div className="text-center max-w-5xl mx-auto mb-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 relative">

            {/* Ambient Glow behind text */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-600/20 blur-[100px] rounded-full -z-10"></div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/30 border border-blue-500/30 text-xs font-medium text-blue-300 mb-8 backdrop-blur-md animate-in fade-in zoom-in duration-700">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Shahad D Graduation Project v1.0
            </div>

            <h2 className="text-6xl md:text-8xl font-black text-white mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-blue-200 tracking-tighter drop-shadow-2xl leading-none pb-2">
              Smart Logistics<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 pr-4 pb-2 inline-block">Analytics</span>
            </h2>

            <p className="text-xl md:text-2xl text-blue-100/70 mb-10 max-w-3xl mx-auto leading-relaxed tracking-tight font-light">
              Detect delays, optimize routes, and audit carrier performance instantly.
              Upload shipment data from <span className="text-white font-semibold">Aramex, FedEx, or DHL</span> to get actionable AI insights.
            </p>

          </div>

          <div className="w-full max-w-2xl bg-white/5 backdrop-blur-2xl rounded-3xl p-2 border border-white/10 shadow-2xl shadow-blue-900/20 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
            <FileUploader onUpload={handleUpload} isAnalyzing={isAnalyzing} />
          </div>
        </main>

        <PageFooter />
      </div>
    </div>
  );
}
