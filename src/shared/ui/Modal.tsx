import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export function Modal({ isOpen, onClose, children, title }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      {/* Backdrop with grid */}
      <div
        className="absolute inset-0 bg-cyber-darker/95 backdrop-blur-md cyber-grid"
        onClick={onClose}
      />

      {/* Modal content */}
      <div className="relative glass-card rounded-2xl p-8 max-w-md w-full shadow-glass border-2 border-neon-cyan/40 animate-in zoom-in duration-300">
        {/* Decorative corners */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-neon-cyan"></div>
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-neon-cyan"></div>
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-neon-cyan"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-neon-cyan"></div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 w-10 h-10 bg-cyber-dark border-2 border-neon-pink rounded-full flex items-center justify-center text-neon-pink hover:bg-neon-pink hover:text-cyber-darker transition-all duration-300 shadow-neon-pink group"
          aria-label="Close modal"
        >
          <span className="text-2xl font-bold group-hover:rotate-90 transition-transform duration-300">×</span>
        </button>

        {title && (
          <h2 className="text-3xl font-cyber font-bold text-neon-cyan mb-6 text-center uppercase tracking-wider neon-text">
            {title}
          </h2>
        )}
        <div className="text-white/90">
          {children}
        </div>
      </div>
    </div>
  );
}
