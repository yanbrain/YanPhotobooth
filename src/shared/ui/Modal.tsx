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
      <div
        className="absolute inset-0 bg-cyber-darker/95 cyber-grid"
        onClick={onClose}
      />

      <div className="relative glass-card rounded-none p-8 max-w-md w-full border border-neon-cyan/40 animate-in zoom-in duration-300">
        <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-neon-cyan/70" />
        <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-neon-cyan/70" />
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-neon-cyan/70" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-neon-cyan/70" />

        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 w-9 h-9 bg-cyber-dark border border-neon-pink rounded-none flex items-center justify-center text-neon-pink hover:text-white transition-all duration-300 shadow-neon-pink group"
          aria-label="Close modal"
        >
          <span className="text-xl font-bold group-hover:rotate-90 transition-transform duration-300">×</span>
        </button>

        {title && (
          <h2 className="text-2xl font-cyber font-semibold text-neon-cyan mb-6 text-center uppercase tracking-[0.2em] neon-text">
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
