'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CameraPreview } from '@/features/capture-photo/ui/CameraPreview';
import { ShutterButton } from '@/features/capture-photo/ui/ShutterButton';
import { useCaptureStore } from '@/features/capture-photo/model/capture-store';
import { captureImageFromVideo, stopCameraStream } from '@/features/capture-photo/lib/camera-utils';
import { Button } from '@/shared/ui/Button';

export function CapturePage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraKey, setCameraKey] = useState(0);
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
    setCameraKey((key) => key + 1);
  };

  const handleNext = () => {
    if (blob) {
      router.push('/styles');
    }
  };

  const handleStreamReady = (mediaStream: MediaStream) => {
    setStream(mediaStream);
  };

  const handleVideoReady = (videoElement: HTMLVideoElement) => {
    videoRef.current = videoElement;
  };

  useEffect(() => {
    return () => {
      if (stream) {
        stopCameraStream(stream);
      }
    };
  }, [stream]);

  return (
    <div className="relative min-h-[100svh] w-full overflow-hidden">
      <div className="fixed inset-0 bg-cyber-darker">
        <div className="absolute inset-0 cyber-grid opacity-15" />
      </div>

      <div className="relative z-10 flex min-h-[100svh] w-full items-center justify-center px-4 py-4 sm:px-6 sm:py-6">
        <div className="w-full max-w-5xl">
          <div className="relative glass-card rounded-none border border-neon-cyan/40 shadow-glass">
            <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />

            <div className="relative flex flex-col h-full min-h-0">
              <header className="flex flex-col gap-3 bg-cyber-dark/70 px-5 sm:px-8 py-4 md:grid md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-4">
                <div className="hidden md:block" />

                <div className="text-center">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-cyber font-semibold text-neon-cyan neon-text uppercase tracking-[0.25em] sm:tracking-[0.3em] mb-1">
                    AI Photobooth
                  </h1>
                  <p className="text-xs sm:text-sm text-neon-cyan/70 font-mono uppercase tracking-[0.2em]">
                    Align your frame before capturing
                  </p>
                </div>

                <div className="hidden md:block" />
              </header>

              <div className="flex-1 flex flex-col px-5 sm:px-8 py-5 sm:py-6 gap-6 min-h-0">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between text-xs sm:text-sm font-mono uppercase tracking-[0.2em] text-neon-cyan/70">
                    <span>Live Feed</span>
                    <span>16:9 Frame</span>
                  </div>

                  <div className="relative w-full aspect-video">
                    <div className="relative h-full glass-card rounded-none border-2 border-neon-cyan/60 overflow-hidden">
                      <div className="absolute inset-0">
                        <CameraPreview
                          key={cameraKey}
                          onStreamReady={handleStreamReady}
                          onVideoReady={handleVideoReady}
                          onError={setError}
                        />
                      </div>

                      {previewUrl ? (
                        <div className="absolute inset-0 z-20">
                          <img
                            src={previewUrl}
                            alt="Captured photo"
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute top-3 left-1/2 -translate-x-1/2 glass-card px-4 py-2 rounded-none border border-neon-green">
                            <p className="text-neon-green text-xs font-mono uppercase tracking-[0.2em]">
                              Captured Frame
                            </p>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex justify-center items-center gap-4 sm:gap-6 w-full">
                    <ShutterButton onClick={handleCapture} disabled={!stream} />
                  </div>

                  <div className="flex flex-col md:flex-row gap-3 sm:gap-4 w-full">
                    <Button onClick={handleRetake} variant="ghost" size="md" className="w-full">
                      Retake
                    </Button>
                    <Button
                      onClick={handleNext}
                      variant="primary"
                      size="lg"
                      className="w-full"
                      disabled={!previewUrl}
                    >
                      Use This Photo
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
