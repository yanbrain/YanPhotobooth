import { create } from 'zustand';

type EmailStatus = 'idle' | 'sending' | 'sent' | 'failed';

interface SendEmailState {
  email: string;
  status: EmailStatus;
  error: string | null;

  setEmail: (email: string) => void;
  setStatus: (status: EmailStatus) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useSendEmailStore = create<SendEmailState>((set) => ({
  email: '',
  status: 'idle',
  error: null,

  setEmail: (email) => set({ email }),

  setStatus: (status) => set({ status }),

  setError: (error) => set({ error, status: 'failed' }),

  reset: () => set({ email: '', status: 'idle', error: null }),
}));
