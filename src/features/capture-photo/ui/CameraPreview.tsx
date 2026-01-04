'use client';

import React, { useEffect, useRef, useState } from 'react';
import { requestCameraAccess, stopCameraStream } from '../lib/camera-utils';

interface CameraPreviewProps {
  onStreamReady?: (stream: MediaStream) => void;
  onError?: (error: string) => void;
}

export function CameraPreview({ onStreamReady, onError }: CameraPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function initCamera() {
      try {
        const mediaStream = await requestCameraAccess();
        if (!mounted) {
          stopCameraStream(mediaStream);
          return;
        }

        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
        onStreamReady?.(mediaStream);
        setIsLoading(false);
      } catch (err) {
        if (!mounted) return;
        const errorMessage = err instanceof Error ? err.message : 'Failed to access camera';
        setError(errorMessage);
        onError?.(errorMessage);
        setIsLoading(false);
      }
    }

    initCamera();

    return () => {
      mounted = false;
      stopCameraStream(stream);
    };
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-purple-900/20 rounded-lg border-2 border-red-500">
        <div className="text-center p-8">
          <p className="text-red-400 text-lg mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-neon-cyan text-black rounded-lg font-bold hover:bg-neon-cyan/80"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-purple-900/20 rounded-lg">
          <p className="text-neon-cyan text-xl animate-pulse">Initializing camera...</p>
        </div>
      )}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover rounded-lg"
      />
    </div>
  );
}
