'use client';

import React, { useState } from 'react';
import { Modal } from '@/shared/ui/Modal';
import { Button } from '@/shared/ui/Button';
import { validateEmail } from '@/shared/lib/validate';

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string) => void;
  isSending: boolean;
}

export function EmailModal({ isOpen, onClose, onSubmit, isSending }: EmailModalProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setError('');
    onSubmit(email);
  };

  const handleClose = () => {
    setEmail('');
    setError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Email Your Masterpiece">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-3">
          <label
            htmlFor="email"
            className="block text-neon-cyan text-sm font-cyber font-semibold uppercase tracking-[0.2em]"
          >
            📧 Email Address
          </label>

          <div className="relative">
            <div className="relative glass-card rounded-none border border-neon-cyan/40 overflow-hidden group focus-within:border-neon-cyan transition-all duration-300">
              <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />

              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSending}
                className="
                  relative w-full px-5 py-4 bg-transparent
                  text-white text-lg font-mono
                  placeholder:text-neon-cyan/40
                  outline-none
                  disabled:opacity-50 disabled:cursor-not-allowed
                  z-10
                "
                placeholder="your@email.com"
                autoComplete="email"
                autoFocus
              />

              <div className="absolute top-1 left-1 w-4 h-4 border-t border-l border-neon-cyan/60 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
              <div className="absolute top-1 right-1 w-4 h-4 border-t border-r border-neon-cyan/60 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-1 left-1 w-4 h-4 border-b border-l border-neon-cyan/60 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-1 right-1 w-4 h-4 border-b border-r border-neon-cyan/60 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />

              <div className="absolute inset-0 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 shadow-neon-cyan" />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 mt-2 text-cyber-pink">
                <span className="text-sm">⚠️</span>
                <p className="text-sm font-mono">{error}</p>
              </div>
            )}
          </div>

          {!error && (
            <p className="text-neon-cyan/60 text-xs font-mono">
              We'll send your AI-generated portrait to this address
            </p>
          )}
        </div>

        <div className="flex gap-4 pt-2">
          <Button
            type="button"
            onClick={handleClose}
            variant="ghost"
            disabled={isSending}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSending || !email}
            className="flex-1"
          >
            {isSending ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-pulse">📤</span>
                Sending...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <span>✨</span>
                Send Portrait
              </span>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
