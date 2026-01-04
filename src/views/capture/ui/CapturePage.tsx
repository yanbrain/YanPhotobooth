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
    // Get video element from CameraPreview
    const video = document.querySelector('video');
    if (video) {
      videoRef.current = video;
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 bg-gradient-to-br from-cyber-darker via-cyber-dark to-cyber-darker">
        <div className="absolute inset-0 cyber-grid opacity-10" />

        {/* Animated gradient orbs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-neon-pink/20 to-cyber-blue/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center p-6 md:p-8">
          <div className="w-32" />

          {/* Logo/Title */}
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-cyber font-bold text-neon-cyan neon-text uppercase tracking-widest mb-1">
              AI Photobooth
            </h1>
            <div className="flex items-center justify-center gap-2 text-neon-cyan/60 text-sm font-mono">
              <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
              <span>STEP 1 / 3</span>
            </div>
          </div>

          {/* Next button */}
          <Button
            onClick={handleNext}
            disabled={!blob}
            variant="primary"
            size="sm"
          >
            Next →
          </Button>
        </header>

        {/* Main content */}
        <div className="flex-1 flex items-center justify-center p-4 md:p-8">
          <div className="relative w-full max-w-4xl">
            {/* Instruction banner */}
            {!previewUrl && (
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-20 glass-card px-6 py-3 rounded-full border border-neon-cyan/40">
                <p className="text-neon-cyan text-sm font-mono uppercase tracking-wider flex items-center gap-2">
                  <span className="text-xl">📸</span>
                  Position yourself and click the shutter
                </p>
              </div>
            )}

            {/* Camera/Photo frame */}
            <div className="relative aspect-video">
              {/* Outer glow */}
              <div className="absolute -inset-4 bg-gradient-to-br from-neon-cyan/30 via-neon-purple/30 to-neon-pink/30 rounded-3xl blur-xl opacity-60" />

              {/* Main frame */}
              <div className="relative h-full glass-card rounded-2xl border-4 border-neon-cyan/60 shadow-neon-cyan overflow-hidden">
                {/* Corner brackets */}
                <div className="absolute top-3 left-3 w-12 h-12 border-t-4 border-l-4 border-neon-cyan z-10" />
                <div className="absolute top-3 right-3 w-12 h-12 border-t-4 border-r-4 border-neon-cyan z-10" />
                <div className="absolute bottom-3 left-3 w-12 h-12 border-b-4 border-l-4 border-neon-cyan z-10" />
                <div className="absolute bottom-3 right-3 w-12 h-12 border-b-4 border-r-4 border-neon-cyan z-10" />

                {/* Camera preview or captured photo */}
                <div className="absolute inset-0">
                  {previewUrl ? (
                    <div className="relative w-full h-full">
                      <img
                        src={previewUrl}
                        alt="Captured photo"
                        className="w-full h-full object-cover"
                      />

                      {/* Success overlay */}
                      <div className="absolute top-4 left-1/2 -translate-x-1/2 glass-card px-6 py-2 rounded-full border border-neon-green">
                        <p className="text-neon-green text-sm font-mono uppercase tracking-wider flex items-center gap-2">
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

        {/* Bottom controls */}
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
