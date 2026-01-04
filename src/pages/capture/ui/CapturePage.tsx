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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-purple-800 flex flex-col">
      {/* Header with navigation */}
      <div className="flex justify-between items-center p-8">
        <div className="w-32" />
        <h1 className="text-4xl font-bold text-white uppercase tracking-wider">
          AI Photobooth
        </h1>
        <Button
          onClick={handleNext}
          disabled={!blob}
          variant="primary"
          size="sm"
        >
          Next →
        </Button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="relative w-full max-w-3xl aspect-video">
          {/* Frame with neon border */}
          <div className="absolute inset-0 border-4 border-neon-purple rounded-2xl shadow-2xl shadow-neon-purple/50" />

          {/* Camera preview or captured photo */}
          <div className="absolute inset-4 rounded-xl overflow-hidden">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Captured photo"
                className="w-full h-full object-cover"
              />
            ) : (
              <CameraPreview onStreamReady={handleStreamReady} onError={setError} />
            )}
          </div>
        </div>
      </div>

      {/* Bottom controls */}
      <div className="flex justify-center items-center p-8 gap-8">
        {previewUrl ? (
          <>
            <Button onClick={handleRetake} variant="outline" size="md">
              Retake
            </Button>
            <Button onClick={handleNext} variant="primary" size="lg">
              Use This Photo
            </Button>
          </>
        ) : (
          <ShutterButton onClick={handleCapture} disabled={!stream} />
        )}
      </div>
    </div>
  );
}
