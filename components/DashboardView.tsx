import { useRef, useState } from 'react';
import { PageFooter } from '@/components/LayoutComponents';
import { HeroSection } from '@/components/HeroSection';
import { StatCard } from '@/components/StatCard';
import {
  Methodology,
  DataCleaningLog,
  DynamicAnalysisSection,
  InsightsSection,
  RecommendationsSection
} from '@/components/AnalysisSections';
import { ScrollToTop } from '@/components/ScrollToTop';
import { DashboardData } from '@/types/dashboard';
import { Users, TrendingUp, MapPin, Trophy, Target, Megaphone, BarChart3, Lightbulb, Download, Activity, DollarSign, PieChart, AlertCircle, CheckCircle, Sparkles, X, Upload, Sun, Moon } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';

// Icon mapping helper
const IconMap: Record<string, any> = {
  Users, TrendingUp, MapPin, Trophy, Target, Megaphone, BarChart3, Lightbulb, Download, Activity, DollarSign, PieChart, AlertCircle, CheckCircle, Zap: Activity, Sparkles
};

interface DashboardViewProps {
  data: DashboardData;
  onReset: () => void;
  onRefine: (prompt: string) => void;
  isRefining: boolean;
  isSessionActive: boolean;
  onSessionRestore: (file: File) => void;
  showSuccess?: boolean;
}

export function DashboardView({ data, onReset, onRefine, isRefining, isSessionActive, onSessionRestore, showSuccess }: DashboardViewProps) {

  const { keyMetrics, dynamicCharts, keyInsights, recommendations, recordCount, analysisTitle, analysisDescription } = data;
  const dashboardRef = useRef<HTMLDivElement>(null);
  const [showRefineDialog, setShowRefineDialog] = useState(false);
  const isDarkMode = true; // Forced Dark Mode
  const [refinePrompt, setRefinePrompt] = useState('');

  const handlePrint = () => {
    window.print();
  };

  const handleSubmitRefine = () => {
    if (!refinePrompt.trim()) return;
    onRefine(refinePrompt);
    setShowRefineDialog(false);
    setRefinePrompt('');
  };

  const handleFileRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onSessionRestore(e.target.files[0]);
    }
  };

  return (

    <div className={`min-h-screen relative flex flex-col font-sans overflow-hidden transition-colors duration-500 ${isDarkMode ? 'bg-[#0b1121] text-white selection:bg-blue-500/30' : 'bg-slate-50 text-slate-900 selection:bg-blue-200/50'}`} ref={dashboardRef}>

      {/* Professional Logistics Background */}
      {isDarkMode ? (
        <div className="absolute inset-0 z-0 pointer-events-none">
          {/* Subtle Grid for Data Feel */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>
          {/* Deep Blue Glows */}
          <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-900/20 to-transparent opacity-40"></div>
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[100px]"></div>
        </div>
      ) : (
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-50"></div>
          <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-blue-50 to-transparent"></div>
        </div>
      )}

      {/* Success Overlay Animation */}
      {showSuccess && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center pointer-events-none">
          <div className={`${isDarkMode ? 'bg-white/10 border-white/20' : 'bg-white/80 border-gray-200'} backdrop-blur-xl rounded-3xl p-8 shadow-2xl border flex flex-col items-center animate-in zoom-in duration-300`}>
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-4 text-green-500 ring-1 ring-green-500/50 animate-in zoom-in delay-150 duration-500">
              <CheckCircle size={48} strokeWidth={3} />
            </div>
            <h3 className={`text-2xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Analysis Updated</h3>
            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Your requested changes have been added</p>
          </div>
        </div>
      )}

      {/* Refine Dialog */}
      {showRefineDialog && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className={`${isDarkMode ? 'bg-gray-900/90 border-white/10' : 'bg-white border-gray-200'} border rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200`}>
            <div className={`p-6 border-b ${isDarkMode ? 'border-white/10' : 'border-gray-100'} flex justify-between items-center`}>
              <h3 className={`text-xl font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {isSessionActive ? (
                  <>
                    <Sparkles className="text-blue-400" size={20} />
                    Ask AI to Refine Analysis
                  </>
                ) : (
                  <>
                    <RefreshCcw className="text-amber-400" size={20} />
                    Restore Session
                  </>
                )}
              </h3>
              <button onClick={() => setShowRefineDialog(false)} className={`${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-600'} transition-colors`}>
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              {!isSessionActive ? (
                <div className="text-center py-6">
                  <div className="bg-amber-500/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 ring-1 ring-amber-500/30">
                    <AlertCircle className="text-amber-500" size={24} />
                  </div>
                  <h4 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Source File Needed</h4>
                  <p className={`text-sm mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Because the page was refreshed, your file session was reset for security.
                    <br />Please <strong>re-select your file</strong> to continue refining.
                  </p>
                  <label className="inline-flex cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-medium transition-colors items-center gap-2">
                    <Upload size={18} />
                    Select File to Restore
                    <input type="file" className="hidden" onChange={handleFileRestore} accept=".xlsx,.xls,.csv" />
                  </label>
                </div>
              ) : (
                <>
                  <p className={`mb-4 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Add or refine anything to your dashboard!
                  </p>
                  <textarea
                    className={`w-full border rounded-xl p-4 min-h-[120px] focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none ${isDarkMode ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-500' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400'}`}
                    placeholder="Type your request here (e.g. 'Remove the pie chart', 'Add a sales trend')..."
                    value={refinePrompt}
                    onChange={(e) => setRefinePrompt(e.target.value)}
                    autoFocus
                    disabled={isRefining}
                  />
                </>
              )}
            </div>

            {isSessionActive && (
              <div className={`p-4 flex justify-end gap-3 rounded-b-2xl border-t ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                <Button variant="ghost" onClick={() => setShowRefineDialog(false)} disabled={isRefining} className={`${isDarkMode ? 'text-gray-300 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:bg-gray-200'}`}>Cancel</Button>
                <Button onClick={handleSubmitRefine} className="bg-blue-600 hover:bg-blue-500 text-white gap-2 rounded-full px-6" disabled={isRefining}>
                  {isRefining ? <Activity className="animate-spin" size={16} /> : <Sparkles size={16} />}
                  {isRefining ? 'Refining...' : 'Update Analysis'}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Header */}

      <div className={`sticky top-0 z-50 border-b px-6 py-4 flex justify-between items-center shadow-lg transition-colors duration-500 ${isDarkMode ? 'bg-[#0f172a]/90 border-blue-900/30 backdrop-blur-md' : 'bg-white/90 border-slate-200 backdrop-blur-md'}`} data-html2canvas-ignore>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-blue-600' : 'bg-blue-600'} text-white`}>
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h1 className={`text-lg font-bold leading-none ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Shahad D Project
            </h1>
            <p className={`text-[10px] uppercase tracking-wider font-semibold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>Logistics Intelligence</p>
          </div>
        </div>

        <div className="flex gap-3 items-center">
          {/* Theme Toggle Removed - Forced Dark Mode */}

          <Button
            onClick={handlePrint}
            variant="outline"
            className={`flex items-center gap-2 transition-colors ${isDarkMode ? 'border-white/10 bg-white/5 text-gray-200 hover:bg-white/10 hover:text-white' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            <Download className="w-4 h-4" />
            <span className="hidden md:inline">Save dashboard as PDF</span>
          </Button>
          <Button
            onClick={onReset}
            variant="outline"
            className={`flex items-center gap-2 transition-colors ${isDarkMode ? 'border-white/10 bg-white/5 text-gray-200 hover:bg-white/10 hover:text-white' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            <RefreshCcw size={16} />
            <span className="hidden md:inline">Upload New Data</span>
          </Button>
        </div>
      </div>

      <main className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        {/* Dynamic Hero Section */}
        <section className={`mb-12 text-center py-10 rounded-3xl relative overflow-hidden`}>
          {/* Decorative backing for hero */}
          <div className={`absolute inset-0 opacity-10 ${isDarkMode ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-gradient-to-r from-blue-600 to-indigo-600'}`}></div>

          <h2 className={`text-3xl md:text-5xl font-bold mb-4 relative z-10 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{analysisTitle}</h2>
          <p className={`text-lg max-w-3xl mx-auto font-light leading-relaxed relative z-10 ${isDarkMode ? 'text-blue-100' : 'text-slate-600'}`}>{analysisDescription}</p>
        </section>

        {/* Key Metrics */}
        <section className="mb-12 md:mb-16">
          <div className="flex items-center gap-4 mb-8">
            <div className={`h-px flex-1 ${isDarkMode ? 'bg-white/10' : 'bg-slate-200'}`}></div>
            <h3 className={`text-lg font-bold uppercase tracking-widest ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>
              Key Performance Indicators
            </h3>
            <div className={`h-px flex-1 ${isDarkMode ? 'bg-white/10' : 'bg-slate-200'}`}></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {keyMetrics.map((metric, index) => {
              const IconComponent = IconMap[metric.icon] || BarChart3;
              return (
                <StatCard
                  key={index}
                  label={metric.label}
                  value={metric.value}
                  description={metric.description}
                  icon={<IconComponent size={24} />}
                  variant={metric.variant}
                  delay={metric.delay}
                  isNew={metric.isNew}
                  isDarkMode={isDarkMode}
                />
              );
            })}
          </div>
        </section>

        {/* Dynamic & Generic Analysis Sections */}
        <DataCleaningLog report={data.dataCleaningReport} isDarkMode={isDarkMode} />

        <Methodology recordCount={recordCount} isDarkMode={isDarkMode} />

        <InsightsSection insights={keyInsights} isDarkMode={isDarkMode} />

        <DynamicAnalysisSection charts={dynamicCharts} isDarkMode={isDarkMode} />

        <RecommendationsSection recommendations={recommendations} isDarkMode={isDarkMode} />

        <PageFooter />
      </main>

      {/* Scroll To Top */}
      <ScrollToTop />

      {/* Bottom Floating Command Bar (Refine) */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 animate-in slide-in-from-bottom-10 fade-in duration-700 delay-1000 w-full max-w-lg px-4">
        <button
          onClick={() => setShowRefineDialog(true)}
          className={`w-full group relative overflow-hidden backdrop-blur-xl border rounded-full p-1.5 pr-6 flex items-center gap-4 transition-all hover:scale-[1.02] shadow-2xl ${isDarkMode ? 'bg-[#0f172a]/80 border-blue-500/30 shadow-blue-900/20' : 'bg-white/90 border-blue-200 shadow-blue-900/5'}`}
        >
          {/* Animated Glow Border Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-transparent to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white'}`}>
            <Sparkles size={18} className="fill-current" />
          </div>

          <div className="flex flex-col items-start mr-auto">
            <span className={`text-sm font-bold tracking-wide ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>COMMAND AI ANALYST</span>
            <span className={`text-[10px] ${isDarkMode ? 'text-blue-300' : 'text-slate-500'}`}>Click to request deeper logistics insights...</span>
          </div>

          <div className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'bg-white/10 text-white group-hover:bg-white/20' : 'bg-slate-100 text-slate-700'}`}>
            INITIATE
          </div>
        </button>
      </div>

    </div>
  );
}
