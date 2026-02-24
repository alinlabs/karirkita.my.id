import React from 'react';
import { cn } from '../../utils/cn';

interface AvatarProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Avatar: React.FC<AvatarProps> = ({ className, size = 'md', ...props }) => {
  const sizes = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-16 w-16",
    xl: "h-32 w-32",
  };

  return (
    <img
      className={cn("rounded-full object-cover bg-slate-100", sizes[size], className)}
      {...props}
    />
  );
};