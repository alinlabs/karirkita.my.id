import React from 'react';
import { motion } from 'framer-motion';

export const Loading = () => {
  return (
    <div className="flex items-center justify-center p-8 w-full h-full min-h-[200px]">
      <div className="relative w-16 h-16">
        <motion.div
          className="absolute inset-0 border-4 border-blue-200 rounded-full"
          initial={{ opacity: 0.5 }}
        />
        <motion.div
          className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    </div>
  );
};
