import { motion } from "motion/react";
import { PageHeader } from "../components/PageHeader";

interface JournalProps {
  isDarkMode: boolean;
}

export function Journal({ isDarkMode }: JournalProps) {
  const journalEntries = [
    {
      id: 1,
      title: "The Art of Film Photography",
      date: "December 15, 2024",
      excerpt: "There's something magical about the anticipation of developing film. The uncertainty, the waiting, the moment when images emerge from chemicals...",
      content: "Film photography teaches us patience and intentionality. Every frame matters when you have only 36 exposures. This constraint becomes liberating rather than limiting."
    },
    {
      id: 2,
      title: "Finding Light in Unexpected Places",
      date: "December 10, 2024",
      excerpt: "Sometimes the most beautiful photographs come from the most ordinary moments. A ray of light through a window, a reflection on water...",
      content: "Light is the essence of photography. It shapes our subjects, creates mood, and tells stories. Learning to see light is learning to see the world differently."
    },
    {
      id: 3,
      title: "The Journey of a Ceramic Artist",
      date: "December 5, 2024",
      excerpt: "From clay to kiln, every piece tells a story of transformation. The process is as important as the final result...",
      content: "Working with clay is a meditation. Each piece is unique, bearing the marks of the maker's hands and the kiln's fire. There's beauty in imperfection."
    }
  ];

  return (
    <div>
      <PageHeader title="Journal" isDarkMode={isDarkMode} />
      
      <div className="max-w-4xl mx-auto px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className={`text-lg mb-12 transition-colors duration-500 ${
            isDarkMode ? 'text-zinc-300' : 'text-zinc-600'
          }`}>
            Thoughts, stories, and reflections on art, photography, and life.
          </p>

        <div className="space-y-12">
          {journalEntries.map((entry, index) => (
            <motion.article
              key={entry.id}
              className={`p-8 rounded-2xl border transition-all duration-300 hover:scale-[1.02] ${
                isDarkMode 
                  ? 'bg-zinc-800/30 border-zinc-700 hover:border-zinc-500' 
                  : 'bg-white/50 border-zinc-200 hover:border-zinc-400'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="mb-4">
                <h2 className={`text-2xl font-bold mb-2 transition-colors duration-500 ${
                  isDarkMode ? 'text-white' : 'text-black'
                }`}>
                  {entry.title}
                </h2>
                <p className={`text-sm transition-colors duration-500 ${
                  isDarkMode ? 'text-zinc-400' : 'text-zinc-500'
                }`}>
                  {entry.date}
                </p>
              </div>
              
              <p className={`text-lg leading-relaxed mb-4 transition-colors duration-500 ${
                isDarkMode ? 'text-zinc-300' : 'text-zinc-700'
              }`}>
                {entry.excerpt}
              </p>
              
              <p className={`text-base leading-relaxed transition-colors duration-500 ${
                isDarkMode ? 'text-zinc-400' : 'text-zinc-600'
              }`}>
                {entry.content}
              </p>
            </motion.article>
          ))}
        </div>

        {/* Coming Soon */}
        <motion.div
          className={`mt-16 p-8 rounded-2xl border-2 border-dashed text-center transition-colors duration-500 ${
            isDarkMode 
              ? 'border-zinc-600 bg-zinc-800/20' 
              : 'border-zinc-300 bg-zinc-50/50'
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h3 className={`text-xl font-semibold mb-2 transition-colors duration-500 ${
            isDarkMode ? 'text-zinc-300' : 'text-zinc-600'
          }`}>
            More entries coming soon...
          </h3>
          <p className={`transition-colors duration-500 ${
            isDarkMode ? 'text-zinc-500' : 'text-zinc-400'
          }`}>
            Stay tuned for more thoughts and stories.
          </p>
        </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
