'use client';

import { useState } from 'react';
import { FileUploader } from '@/components/FileUploader';
import { SkeletonLoader } from '@/components/SkeletonLoader';
import { DashboardView } from '@/components/DashboardView';
import { DashboardData } from '@/types/dashboard';
import { PageHeader, PageFooter } from '@/components/LayoutComponents';

export default function Home() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleUpload = async (file: File, prompt?: string) => {
    setIsAnalyzing(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (prompt) {
        formData.append('customPrompt', prompt);
      }

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.details || 'Analysis failed');
      }

      const result = await response.json();
      setData(result);
    } catch (error: any) {
      console.error('Error analyzing file:', error);
      alert(error.message || 'Failed to analyze the file.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setData(null);
  };

  if (isAnalyzing) {
    return <SkeletonLoader />;
  }

  if (data) {
    return <DashboardView data={data} onReset={handleReset} />;
  }

  return (
    <div className="min-h-screen relative flex flex-col font-sans">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/hero-bg.png')" }}
      >
        <div className="absolute inset-0 bg-white/85 backdrop-blur-sm"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <PageHeader />
        
        <main className="flex-grow flex flex-col items-center justify-center p-4">
          <div className="text-center max-w-5xl mx-auto mb-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 relative">
            {/* Glowing effect behind text */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-400/20 blur-[100px] rounded-full -z-10 animate-pulse"></div>

            <h2 className="text-6xl md:text-7xl font-black text-gray-900 mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 tracking-tighter drop-shadow-sm leading-tight">
              Intelligent Data Analysis
            </h2>
            <p className="text-2xl md:text-3xl text-gray-700 mb-10 max-w-3xl mx-auto leading-relaxed font-medium tracking-tight">
              Unlock the power of your data with our <span className="text-blue-600 font-bold">Next-Gen Platform</span>. 
              Powered by <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent font-bold">Groq Llama 3</span>, getting insights is now instant.
            </p>
            
            <div className="flex items-center justify-center gap-4 animate-in fade-in zoom-in duration-700 delay-300">
              <div className="flex items-center gap-3 text-sm font-bold text-blue-900 bg-white/60 backdrop-blur-xl py-3 px-8 rounded-full border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] inline-flex transition-all hover:bg-white/80 hover:scale-105 hover:shadow-lg cursor-default">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                System Operational
              </div>
              <div className="flex items-center gap-2 text-sm font-bold text-indigo-900 bg-indigo-50/60 backdrop-blur-xl py-3 px-8 rounded-full border border-indigo-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] inline-flex transition-all hover:bg-indigo-50/80 hover:scale-105 hover:shadow-lg cursor-default">
                <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                v2.4.0 Live
              </div>
            </div>
          </div>
          
          <div className="w-full max-w-2xl bg-white/40 backdrop-blur-2xl rounded-3xl p-2 border border-white/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
             <FileUploader onUpload={handleUpload} isAnalyzing={isAnalyzing} />
          </div>
        </main>
        
        <PageFooter />
      </div>
    </div>
  );
}
