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
    <Modal isOpen={isOpen} onClose={handleClose} title="Email Your Photo">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-white text-sm font-bold mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSending}
            className="w-full px-4 py-3 rounded-lg bg-purple-900/50 border-2 border-neon-cyan/50 text-white focus:border-neon-cyan outline-none"
            placeholder="your@email.com"
            autoComplete="email"
          />
          {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        </div>

        <div className="flex gap-4">
          <Button
            type="button"
            onClick={handleClose}
            variant="outline"
            disabled={isSending}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSending}
            className="flex-1"
          >
            {isSending ? 'Sending...' : 'Send'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
