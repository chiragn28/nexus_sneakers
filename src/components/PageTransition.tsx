import { motion } from 'framer-motion';

interface Props {
  children: React.ReactNode;
}

/** Snappy 220ms page in/out — energetic, never floaty. */
export function PageTransition({ children }: Props) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-[70vh]"
    >
      {children}
    </motion.main>
  );
}
