'use client';

import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CameraPreview } from '@/features/capture-photo/ui/CameraPreview';
import { ShutterButton } from '@/features/capture-photo/ui/ShutterButton';
import { useCaptureStore } from '@/features/capture-photo/model/capture-store';
import { captureImageFromVideo } from '@/features/capture-photo/lib/camera-utils';
import { Button } from '@/shared/ui/Button';

export function CapturePage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const { blob, previewUrl, setCapture, clearCapture, setError } = useCaptureStore();

  const handleCapture = async () => {
    if (!videoRef.current) {
      setError('Video not ready');
      return;
    }

    try {
      const { blob: capturedBlob, previewUrl: url } = await captureImageFromVideo(
        videoRef.current
      );
      setCapture(capturedBlob, url);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to capture photo');
    }
  };

  const handleRetake = () => {
    clearCapture();
  };

  const handleNext = () => {
    if (blob) {
      router.push('/styles');
    }
  };

  const handleStreamReady = (mediaStream: MediaStream) => {
    setStream(mediaStream);
    const video = document.querySelector('video');
    if (video) {
      videoRef.current = video;
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="fixed inset-0 bg-cyber-darker">
        <div className="absolute inset-0 cyber-grid opacity-15" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        <header className="flex justify-between items-center p-6 md:p-8">
          <div className="w-32" />

          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-cyber font-semibold text-neon-cyan neon-text uppercase tracking-[0.3em] mb-1">
              AI Photobooth
            </h1>
            <div className="flex items-center justify-center gap-2 text-neon-cyan/60 text-sm font-mono">
              <div className="w-2 h-2 bg-neon-green animate-pulse" />
              <span>STEP 1 / 3</span>
            </div>
          </div>

          <Button
            onClick={handleNext}
            disabled={!blob}
            variant="primary"
            size="sm"
          >
            Next →
          </Button>
        </header>

        <div className="flex-1 flex items-center justify-center p-4 md:p-8">
          <div className="relative w-full max-w-4xl">
            {!previewUrl && (
              <div className="absolute -top-14 left-1/2 -translate-x-1/2 z-20 glass-card px-6 py-3 rounded-none border border-neon-cyan/40">
                <p className="text-neon-cyan text-sm font-mono uppercase tracking-[0.2em] flex items-center gap-2">
                  <span className="text-lg">📸</span>
                  Position yourself and click the shutter
                </p>
              </div>
            )}

            <div className="relative aspect-video">
              <div className="relative h-full glass-card rounded-none border-2 border-neon-cyan/60 overflow-hidden">
                <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-neon-cyan z-10" />
                <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-neon-cyan z-10" />
                <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-neon-cyan z-10" />
                <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-neon-cyan z-10" />

                <div className="absolute inset-0">
                  {previewUrl ? (
                    <div className="relative w-full h-full">
                      <img
                        src={previewUrl}
                        alt="Captured photo"
                        className="w-full h-full object-cover"
                      />

                      <div className="absolute top-4 left-1/2 -translate-x-1/2 glass-card px-6 py-2 rounded-none border border-neon-green">
                        <p className="text-neon-green text-sm font-mono uppercase tracking-[0.2em] flex items-center gap-2">
                          <span>✓</span>
                          Photo Captured
                        </p>
                      </div>
                    </div>
                  ) : (
                    <CameraPreview onStreamReady={handleStreamReady} onError={setError} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center p-6 md:p-8 gap-6">
          {previewUrl ? (
            <div className="flex flex-col items-center gap-4">
              <div className="flex gap-4">
                <Button onClick={handleRetake} variant="ghost" size="md">
                  ← Retake
                </Button>
                <Button onClick={handleNext} variant="primary" size="lg" className="min-w-64">
                  <span className="flex items-center gap-2">
                    <span>✨</span>
                    Use This Photo
                  </span>
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <ShutterButton onClick={handleCapture} disabled={!stream} />
              {stream && (
                <p className="text-neon-cyan/60 text-sm font-mono animate-pulse">
                  Click to capture
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
