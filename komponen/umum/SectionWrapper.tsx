import React from 'react';
import { cn } from '../../utils/cn';

interface SectionWrapperProps extends React.HTMLAttributes<HTMLElement> {
  containerClassName?: string;
}

export const SectionWrapper: React.FC<SectionWrapperProps> = ({ className, containerClassName, children, ...props }) => {
  return (
    <section className={cn("py-20", className)} {...props}>
      <div className={cn("max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", containerClassName)}>
        {children}
      </div>
    </section>
  );
};