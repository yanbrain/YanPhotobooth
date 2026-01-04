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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal content */}
      <div className="relative bg-gradient-to-br from-purple-900/90 to-blue-900/90 border-2 border-neon-cyan rounded-xl p-6 max-w-md w-full shadow-2xl shadow-neon-cyan/50">
        {title && (
          <h2 className="text-2xl font-bold text-white mb-4 text-center">
            {title}
          </h2>
        )}
        {children}
      </div>
    </div>
  );
}
