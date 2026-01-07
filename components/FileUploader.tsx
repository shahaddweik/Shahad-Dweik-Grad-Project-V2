'use client';

import { useState, useCallback } from 'react';
import { Upload, FileSpreadsheet, CheckCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// To save installing another dep, I'll allow simple input first, 
// OR I can write a simple custom drag-drop handler. Custom is better to avoid deps if possible.

interface FileUploaderProps {
  onUpload: (file: File, prompt?: string) => void;
  isAnalyzing: boolean;
}

export function FileUploader({ onUpload, isAnalyzing }: FileUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState('');

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUploadClick = () => {
    if (file) {
      onUpload(file, prompt);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl bg-[#0f172a]/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-blue-500/20 p-8 text-center relative overflow-hidden"
      >
        {/* Decorative Grid Background inside card */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-20 pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="mb-6">
            <div className="w-16 h-16 bg-blue-500/10 text-blue-400 rounded-2xl border border-blue-500/20 flex items-center justify-center mx-auto mb-4 relative group">
              <div className="absolute inset-0 bg-blue-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-full"></div>
              <FileSpreadsheet size={32} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Upload Shipment Data</h2>
            <p className="text-blue-200/60 font-light">
              Supported formats: .xlsx, .csv (Aramex, FedEx, DHL)
            </p>
          </div>

          <div
            className={`relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300 group ${
              dragActive 
                ? "border-blue-400 bg-blue-500/10 scale-[1.02]" 
                : "border-blue-500/20 hover:border-blue-400/50 hover:bg-blue-500/5"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              onChange={handleChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
              accept=".xlsx,.xls,.csv"
            />
            
            <div className="flex flex-col items-center gap-3 relative z-10 pointer-events-none">
              <AnimatePresence mode="wait">
                {file ? (
                  <motion.div
                    key="file"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center gap-2"
                  >
                    <div className="w-12 h-12 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center ring-1 ring-green-500/40">
                       <CheckCircle size={24} />
                    </div>
                    <span className="text-white font-medium text-lg">{file.name}</span>
                    <span className="text-xs text-blue-300/60 uppercase tracking-widest">Ready to Analyze</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="prompt"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center gap-2"
                  >
                    <div className="bg-blue-900/40 p-3 rounded-full mb-2">
                       <Upload size={24} className="text-blue-400" />
                    </div>
                    <p className="text-sm text-blue-100/70">
                      Drag & drop file here or <span className="text-blue-400 font-bold underline decoration-blue-500/30 underline-offset-4">browse</span>
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="text-left">
              <label className="text-xs font-semibold uppercase tracking-wider text-blue-300/80 mb-2 block pl-1">
                Special Instructions (Optional)
              </label>
              <input 
                type="text" 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. Focus on Riyadh delays..."
                className="w-full bg-[#1e293b]/50 border border-blue-500/20 rounded-xl px-4 py-3 text-white placeholder:text-blue-300/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-light"
              />
            </div>

            <button
              onClick={handleUploadClick}
              disabled={!file || isAnalyzing}
              className={`w-full py-4 rounded-xl font-bold text-lg tracking-wide transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-900/20 ${
                !file || isAnalyzing
                  ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:scale-[1.02] hover:shadow-blue-600/25 active:scale-[0.98]"
              }`}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="animate-spin" />
                  Analyzing Platform Data...
                </>
              ) : (
                <>
                  <span>Initialize Analysis</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
