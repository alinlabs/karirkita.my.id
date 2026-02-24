import React from 'react';
import { motion, Transition } from 'framer-motion';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

const pageVariants = {
  initial: {
    opacity: 0
  },
  in: {
    opacity: 1
  },
  out: {
    opacity: 0
  }
};

const pageTransition: Transition = {
  type: 'tween',
  ease: 'linear',
  duration: 0.1
};

export const PageTransition = React.forwardRef<HTMLDivElement, PageTransitionProps>(({ children, className }, ref) => {
  return (
    <motion.div
      ref={ref}
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className={className}
    >
      {children}
    </motion.div>
  );
});

PageTransition.displayName = 'PageTransition';
