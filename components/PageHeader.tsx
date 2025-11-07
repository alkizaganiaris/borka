import { motion } from "motion/react";
import { useState } from "react";

interface PageHeaderProps {
  title: string;
  isDarkMode?: boolean;
}

export function PageHeader({ title, isDarkMode = false }: PageHeaderProps) {
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
          className="font-medium uppercase tracking-tight leading-none mb-8"
          style={{ 
            fontFamily: monoFont,
            fontSize: '13vw'
          }}
        >
          {title}
        </h1>
               {title === "Journal" && (
                 <>
                   <div className="flex justify-center">
                     <div 
                       style={{ 
                         transform: 'translate(450px, -220px)',
                         zIndex: 1
                       }}
                     >
                       <motion.img 
                         src="/media/pencil.png" 
                         alt="Pencil" 
                         className="h-auto cursor-pointer"
                         style={{ 
                           width: '320px',
                           borderRadius: '8px',
                           border: '2px solid black'
                         }}
                         whileTap={{ scale: 0.95 }}
                       />
                     </div>
                   </div>
                   
                   {/* Shavings image - bottom right */}
                   <div className="fixed bottom-[-20px] right-4 z-1">
                     <img 
                       src="/media/shavings_1.png" 
                       alt="Pencil shavings" 
                       className="h-auto"
                       style={{ 
                         width: '300px',
                         opacity: 0.8
                       }}
                     />
                   </div>

                   {/* Coffee/Tea image - center viewport */}
                   <div className="fixed top-1/2 left-1/2 z-1" style={{ transform: 'translate(-50%, -35%)' }}>
                     <motion.img 
                       src={isDarkMode ? "/media/tea.png" : "/media/coffee.png"} 
                       alt={isDarkMode ? "Tea" : "Coffee"} 
                       className="h-auto cursor-pointer"
                       style={{ 
                         width: '400px',
                         opacity: 1
                       }}
                       whileHover={{ 
                         rotate: 58,
                         transition: { duration: 0.3, ease: "easeOut" }
                       }}
                       whileTap={{ scale: 0.95 }}
                     />
                   </div>
                 </>
               )}
      </div>
    </motion.header>
  );
}

