'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';

interface Shortcut {
  key: string;
  description: string;
  action?: string;
}

const shortcuts: Shortcut[] = [
  { key: '?', description: 'Show/hide this help menu' },
  { key: 'Esc', description: 'Close modals and dialogs' },
  { key: 'Space', description: 'Capture photo (on camera page)' },
  { key: 'Enter', description: 'Confirm selection / Next step' },
  { key: '←/→', description: 'Navigate style carousel' },
  { key: 'R', description: 'Retake photo' },
  { key: 'N', description: 'Next / Continue' },
  { key: 'B', description: 'Go back' },
];

export function KeyboardShortcuts() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Toggle help menu with '?'
      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <>
      {/* Help button in corner */}
      <button
        onClick={() => setIsOpen(true)}
        className="
          fixed bottom-4 left-4 z-40
          w-12 h-12 rounded-xl
          glass-card border-2 border-neon-cyan/40
          hover:border-neon-cyan hover:shadow-neon-cyan
          flex items-center justify-center
          transition-all duration-300
          group
        "
        aria-label="Show keyboard shortcuts"
        title="Keyboard Shortcuts (?)"
      >
        <span className="text-xl text-neon-cyan group-hover:scale-110 transition-transform">
          ?
        </span>

        {/* Corner brackets */}
        <div className="absolute top-0.5 left-0.5 w-2 h-2 border-t-2 border-l-2 border-neon-cyan opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute bottom-0.5 right-0.5 w-2 h-2 border-b-2 border-r-2 border-neon-cyan opacity-0 group-hover:opacity-100 transition-opacity" />
      </button>

      {/* Help modal */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Keyboard Shortcuts"
      >
        <div className="space-y-4">
          {/* Intro */}
          <p className="text-neon-cyan/70 text-sm font-mono">
            Use these keyboard shortcuts to navigate the application quickly
          </p>

          {/* Shortcuts list */}
          <div className="space-y-2">
            {shortcuts.map((shortcut) => (
              <div
                key={shortcut.key}
                className="flex items-center justify-between gap-4 p-3 glass-card rounded-lg border border-neon-cyan/20"
              >
                {/* Key */}
                <kbd
                  className="
                    px-3 py-1.5 min-w-[60px] text-center
                    bg-cyber-dark border-2 border-neon-cyan/40
                    rounded-lg text-neon-cyan font-cyber font-bold
                    text-sm uppercase shadow-neon-cyan/20
                  "
                >
                  {shortcut.key}
                </kbd>

                {/* Description */}
                <p className="flex-1 text-white text-sm font-mono">
                  {shortcut.description}
                </p>
              </div>
            ))}
          </div>

          {/* Footer tip */}
          <div className="glass-card rounded-lg border border-neon-purple/30 p-3 mt-4">
            <p className="text-neon-purple/70 text-xs font-mono text-center">
              💡 Tip: Press <kbd className="px-2 py-1 bg-cyber-dark border border-neon-purple/50 rounded text-neon-purple">?</kbd> anytime to toggle this menu
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
}
