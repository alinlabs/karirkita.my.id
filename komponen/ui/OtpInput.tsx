import React, { useRef, useEffect, useState } from 'react';
import { cn } from '../../utils/cn';

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export const OtpInput: React.FC<OtpInputProps> = ({ 
  length = 4, 
  value, 
  onChange, 
  disabled = false,
  className 
}) => {
  const [activeInput, setActiveInput] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Initialize refs array
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  // Handle change for a specific input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const val = e.target.value;
    
    // Only allow numbers
    if (isNaN(Number(val))) return;

    // Get the last character typed (in case user types fast or overwrite)
    const newDigit = val.substring(val.length - 1);
    
    const newValue = value.split('');
    newValue[index] = newDigit;
    const nextValue = newValue.join('');
    
    onChange(nextValue);

    // Move focus to next input if value is entered
    if (newDigit && index < length - 1) {
      setActiveInput(index + 1);
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace and navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const newValue = value.split('');
      
      // If current box has value, clear it. If empty, move back and clear previous.
      if (newValue[index]) {
        newValue[index] = '';
        onChange(newValue.join(''));
      } else if (index > 0) {
        newValue[index - 1] = '';
        onChange(newValue.join(''));
        setActiveInput(index - 1);
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      setActiveInput(index - 1);
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      setActiveInput(index + 1);
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle paste event
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').replace(/\D/g, '').slice(0, length);
    
    if (pastedData) {
      onChange(pastedData);
      // Focus the last input or the next empty one
      const nextIndex = Math.min(pastedData.length, length - 1);
      setActiveInput(nextIndex);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  return (
    <div className={cn("flex gap-2 justify-center w-full", className)}>
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          ref={(el) => { inputRefs.current[index] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1} // Although we handle >1 char in onChange, this is good for UX
          value={value[index] || ''}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          onFocus={() => setActiveInput(index)}
          disabled={disabled}
          className={cn(
            "w-12 h-14 md:w-14 md:h-16 border-2 rounded-xl text-center text-xl md:text-2xl font-bold transition-all outline-none caret-blue-600",
            "focus:border-blue-600 focus:ring-4 focus:ring-blue-100 focus:bg-white",
            disabled ? "bg-slate-100 text-slate-400 border-slate-200" : "bg-white border-slate-200 text-slate-900 shadow-sm",
            // Highlight active input visually if value exists
            value[index] ? "border-blue-600 bg-blue-50/30" : ""
          )}
        />
      ))}
    </div>
  );
};