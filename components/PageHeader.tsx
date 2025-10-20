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
                         src="/pencil.png" 
                         alt="Pencil" 
                         className="h-auto cursor-pointer"
                         style={{ 
                           width: '320px',
                           borderRadius: '8px'
                         }}
                         whileHover={{ 
                           scale: 1.1,
                           rotate: 25,
                           transition: { duration: 0.5, ease: "easeOut" },
                         }}
                         whileTap={{ scale: 0.95 }}
                       />
                     </div>
                   </div>
                   
                   {/* Shavings image - bottom right */}
                   <div className="fixed bottom-[-20px] right-4 z-1">
                     <img 
                       src="/shavings_1.png" 
                       alt="Pencil shavings" 
                       className="h-auto"
                       style={{ 
                         width: '300px',
                         opacity: 0.8
                       }}
                     />
                   </div>
                 </>
               )}
      </div>
    </motion.header>
  );
}

