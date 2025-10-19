import { motion } from "motion/react";

interface PageHeaderProps {
  title: string;
  isDarkMode?: boolean;
}

export function PageHeader({ title}: PageHeaderProps) {
  const monoFont = "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace";

  return (
    <motion.header
      className="w-full py-16 px-8 text-black"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto text-center">
        <h1
          className="font-medium uppercase tracking-tight leading-none"
          style={{ 
            fontFamily: monoFont,
            fontSize: '13vw'
          }}
        >
          {title}
        </h1>
      </div>
    </motion.header>
  );
}

