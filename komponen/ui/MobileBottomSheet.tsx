import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { X } from "lucide-react";
import { cn } from "../../utils/cn";

interface MobileBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

export const MobileBottomSheet: React.FC<MobileBottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className,
  contentClassName,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const handleResize = () => setIsMobile(mediaQuery.matches);
    handleResize();
    mediaQuery.addEventListener("change", handleResize);
    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  useEffect(() => {
    // Measure header height
    const header = document.querySelector("nav");
    if (header) {
      setHeaderHeight(header.clientHeight);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Small delay to allow render before animating in
      requestAnimationFrame(() => {
        setIsAnimating(true);
      });
      document.body.style.overflow = "hidden";
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 350); // Match transition duration
      document.body.style.overflow = "unset";
      return () => clearTimeout(timer);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isMobile) return null;
  if (!isVisible && !isOpen) return null;

  return ReactDOM.createPortal(
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={cn(
          "fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[60] transition-opacity duration-300",
          isAnimating ? "opacity-100" : "opacity-0"
        )}
        style={{ top: 0 }} // Overlay covers everything including header? No, usually overlays everything.
      />

      {/* Bottom Sheet */}
      <div
        className={cn(
          "fixed left-0 right-0 bottom-0 bg-white z-[61] flex flex-col shadow-[0_-4px_20px_rgba(0,0,0,0.1)] transition-transform duration-300 cubic-bezier(0.22, 1, 0.36, 1)",
          className
        )}
        style={{
          top: headerHeight > 0 ? `${headerHeight}px` : '60px', // Fallback if header not found
          borderTopLeftRadius: "20px",
          borderTopRightRadius: "20px",
          transform: isAnimating ? "translateY(0)" : "translateY(100%)",
          maxHeight: `calc(100vh - ${headerHeight}px)`,
          paddingBottom: 'env(safe-area-inset-bottom)', 
        }}
      >
        {/* Drag Indicator Area */}
        <div className="flex-none pt-3 pb-2 flex justify-center cursor-grab active:cursor-grabbing" onClick={onClose}>
           <div className="w-10 h-1.5 bg-slate-200 rounded-full" />
        </div>

        {/* Header (Optional) */}
        {title && (
          <div className="flex-none px-4 pb-3 flex items-center justify-between border-b border-slate-100">
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            <button 
              onClick={onClose}
              className="p-1 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Content - Scrollable */}
        <div className={cn("flex-1 overflow-y-auto p-4 overscroll-contain", contentClassName)}>
          {children}
        </div>
      </div>
    </>,
    document.body
  );
};
