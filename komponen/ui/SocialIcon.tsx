
import React, { useEffect, useState } from 'react';
import { routingData } from '../../services/routingData';
import { cn } from '../../utils/cn';
import { Link as LinkIcon } from 'lucide-react';

interface SocialIconProps {
  name: string; // e.g., 'instagram', 'linkedin', 'website'
  className?: string;
  fallbackIcon?: React.ReactNode;
}

export const SocialIcon: React.FC<SocialIconProps> = ({ name, className, fallbackIcon }) => {
  const [iconUrl, setIconUrl] = useState<string | null>(null);

  useEffect(() => {
    routingData.getIcons().then((icons: Record<string, string>) => {
      if (icons && icons[name.toLowerCase()]) {
        setIconUrl(icons[name.toLowerCase()]);
      }
    });
  }, [name]);

  if (iconUrl) {
    return (
      <img 
        src={iconUrl} 
        alt={name} 
        className={cn("object-contain", className || "w-5 h-5")} 
      />
    );
  }

  // Fallback if URL not found
  if (fallbackIcon) {
    return <>{fallbackIcon}</>;
  }

  // Default generic fallback
  return <LinkIcon className={cn("text-current", className || "w-5 h-5")} />;
};
