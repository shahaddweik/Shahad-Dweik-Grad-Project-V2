import React, { ReactNode, useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { Info, X } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  description: string;
  icon: ReactNode;
  variant?: "default" | "accent";
  delay?: number;
  isNew?: boolean;
  isDarkMode?: boolean;
}

export function StatCard({
  label,
  value,
  description,
  icon,
  variant = "default",
  delay = 0,
  isNew,
  isDarkMode = true,
}: StatCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isAccent = variant === "accent";

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        whileHover={{ y: -5 }}
        viewport={{ once: true }}
        className={`relative rounded-2xl p-6 border transition-all hover:scale-[1.02] duration-300 ${isAccent
            ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white border-transparent shadow-lg shadow-blue-500/30"
            : isDarkMode
              ? "bg-white/5 border-white/10 text-white shadow-lg shadow-blue-900/10 backdrop-blur-sm"
              : "bg-white border-gray-100 text-gray-900 shadow-sm hover:shadow-md"
          } ${isNew ? 'ring-2 ring-purple-500 ring-offset-2 ring-offset-black' : ''}`}
      >
        {isNew && (
          <span className={`absolute top-3 right-3 text-xs font-bold px-2 py-0.5 rounded-full border animate-pulse ${isDarkMode ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' : 'bg-purple-100 text-purple-700 border-purple-200'}`}>
            New
          </span>
        )}
        <div className="flex items-start justify-between mb-4">
          <div>
            <p
              className={`text-sm font-medium ${isAccent ? "text-blue-50 opacity-90" : isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
            >
              {label}
            </p>
            <h3 className="text-2xl font-bold mt-1 tracking-tight">{value}</h3>
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className={`p-2 rounded-lg transition-transform hover:scale-110 active:scale-95 ${isAccent ? "bg-white/20" : isDarkMode ? "bg-white/10 text-blue-400" : "bg-blue-50 text-blue-600"
              }`}
          >
            {icon}
          </button>
        </div>
        <p
          className={`text-xs truncate ${isAccent ? "text-blue-50 opacity-80" : isDarkMode ? "text-gray-500" : "text-gray-400"
            }`}
        >
          {description}
        </p>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className={`relative w-full max-w-md overflow-hidden rounded-3xl border p-8 shadow-2xl ${isDarkMode
                  ? "bg-[#0a0a1a] border-white/10 text-white"
                  : "bg-white border-gray-100 text-gray-900"
                }`}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 rounded-xl text-blue-400">
                    <Info size={20} />
                  </div>
                  <h4 className="text-xl font-bold tracking-tight">{label} Details</h4>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div className={`p-4 rounded-2xl ${isDarkMode ? 'bg-white/5 border border-white/5' : 'bg-gray-50 border border-gray-100'}`}>
                  <p className={`text-sm font-semibold uppercase tracking-wider mb-1 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>Current Value</p>
                  <p className="text-4xl font-black">{value}</p>
                </div>

                <div>
                  <p className={`text-sm font-semibold uppercase tracking-wider mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Calculation & Insight</p>
                  <p className={`text-lg leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {description}
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5">
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]"
                >
                  Got it
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
