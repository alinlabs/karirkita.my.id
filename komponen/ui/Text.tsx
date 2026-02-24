
import React, { useState, useEffect } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { routingData } from '../../services/routingData';

interface TextProps {
  children: string;
  className?: string;
  as?: any; // element type
}

export const Text: React.FC<TextProps> = ({ children, className, as: Component = 'span' }) => {
  const { language } = useSettings();
  const [translatedText, setTranslatedText] = useState(children);

  useEffect(() => {
    if (language === 'id') {
      setTranslatedText(children);
      return;
    }

    let isMounted = true;
    
    const doTranslate = async () => {
      try {
        const result = await routingData.translate(children, 'id', language);
        if (isMounted) setTranslatedText(result);
      } catch (err) {
        if (isMounted) setTranslatedText(children);
      }
    };

    doTranslate();

    return () => { isMounted = false; };
  }, [language, children]);

  return <Component className={className}>{translatedText}</Component>;
};
