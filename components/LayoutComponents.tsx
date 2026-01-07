import { motion } from "framer-motion";

export function PageHeader() {
  return (
    <header className="bg-white/5 border-b border-white/5 sticky top-0 z-50 backdrop-blur-xl shadow-lg shadow-black/5 supports-[backdrop-filter]:bg-white/5">
      <div className="container mx-auto px-4 py-4 md:py-5 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex items-center gap-2"
          >
            <h1 className="text-2xl md:text-3xl font-black bg-[size:200%] bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 bg-clip-text text-transparent tracking-tighter animate-gradient text-center">
              Shahad D Graduation Project
            </h1>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="text-xs text-blue-400 uppercase tracking-[0.3em] font-bold mt-1"
          >
            Shipment & Logistics Intelligence
          </motion.p>
        </div>
      </div>
    </header>
  );
}
export function PageFooter() {
  return (
    <footer className="mt-20 border-t border-blue-900/10 py-8 text-center bg-white/5 backdrop-blur-sm">
      <div className="flex items-center justify-center gap-2 mb-4">
        <span className="font-bold text-blue-900 dark:text-blue-200">Shahad D Graduation Project</span>
      </div>
      <p className="text-gray-500 dark:text-gray-400 text-sm">
        © {new Date().getFullYear()} Shipment & Logistics Intelligence • Powered by AI
      </p>
    </footer>
  );
}
