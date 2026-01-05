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
    if (previewUrl && stream) {
      stopCameraStream(stream);
      setStream(null);
      videoRef.current = null;
    }
  }, [previewUrl, stream]);

  return (
    <div className="relative h-[100svh] w-full overflow-hidden">
      <div className="fixed inset-0 bg-cyber-darker">
        <div className="absolute inset-0 cyber-grid opacity-15" />
      </div>

      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="w-full h-full">
          <div className="relative glass-card rounded-none border border-neon-cyan/40 shadow-glass h-full">
            <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />

            <div className="relative flex flex-col h-full min-h-0">
              <header className="flex flex-col gap-3 bg-cyber-dark/70 px-4 sm:px-6 py-3 md:grid md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-4">
                <div className="hidden md:block" />

                <div className="text-center">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-cyber font-semibold text-neon-cyan neon-text uppercase tracking-[0.25em] sm:tracking-[0.3em] mb-1">
                    AI Photobooth
                  </h1>
                </div>

                <div className="hidden md:block" />
              </header>

              <div className="flex-1 flex flex-col px-4 sm:px-6 py-3 sm:py-4 gap-4 sm:gap-5 min-h-0">
                <div className="flex-1 flex items-center justify-center min-h-0">
                  <div className="relative w-full h-full flex items-center justify-center">
                    <div className="relative aspect-video w-full h-full mx-auto">
                      <div className="relative h-full glass-card rounded-none border-2 border-neon-cyan/60 overflow-hidden">
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
                                  Photo Captured
                                </p>
                              </div>
                            </div>
                          ) : (
                            <CameraPreview
                              key={cameraKey}
                              onStreamReady={handleStreamReady}
                              onVideoReady={handleVideoReady}
                              onError={setError}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center items-center gap-4 sm:gap-6 pb-2 w-full px-4 sm:px-6">
                  {previewUrl ? (
                    <div className="flex flex-col items-center gap-4 w-full">
                      <div className="flex flex-col md:flex-row gap-3 sm:gap-4 w-full">
                        <Button onClick={handleRetake} variant="ghost" size="md" className="w-full">
                          Retake
                        </Button>
                        <Button
                          onClick={handleNext}
                          variant="primary"
                          size="lg"
                          className="w-full"
                        >
                          Use This Photo
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-4">
                      <ShutterButton onClick={handleCapture} disabled={!stream} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
