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
          const video = videoRef.current;
          video.srcObject = mediaStream;

          // Debug: log when metadata loads
          video.onloadedmetadata = () => {
            console.log('✅ Video metadata loaded', {
              videoWidth: video.videoWidth,
              videoHeight: video.videoHeight,
              readyState: video.readyState
            });
          };

          console.log('✅ Camera stream set to video element', {
            streamActive: mediaStream.active,
            trackCount: mediaStream.getVideoTracks().length,
            trackSettings: mediaStream.getVideoTracks()[0]?.getSettings()
          });
        } else {
          console.error('❌ Video ref is null!');
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
      <div className="relative flex items-center justify-center h-full glass-card rounded-2xl border-2 border-cyber-pink overflow-hidden">
        {/* Cyber grid background */}
        <div className="absolute inset-0 cyber-grid opacity-20" />

        {/* Error content */}
        <div className="relative text-center p-8 z-10">
          {/* Error icon */}
          <div className="mb-6 text-6xl animate-pulse-neon">⚠️</div>

          {/* Error message */}
          <p className="text-cyber-pink text-xl mb-2 font-cyber font-bold neon-text">
            Camera Access Error
          </p>
          <p className="text-neon-cyan/80 text-sm mb-6 font-mono">
            {error}
          </p>

          {/* Retry button */}
          <button
            onClick={() => window.location.reload()}
            className="
              relative px-8 py-3 rounded-xl font-cyber font-bold text-lg
              bg-gradient-to-r from-cyber-pink to-cyber-purple
              text-white shadow-neon-pink
              hover:shadow-neon-purple hover:scale-105
              transition-all duration-300
              before:absolute before:inset-0 before:rounded-xl
              before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent
              before:translate-x-[-200%] before:transition-transform before:duration-700
              hover:before:translate-x-[200%]
            "
          >
            Retry Camera
          </button>
        </div>

        {/* Decorative corners */}
        <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-cyber-pink" />
        <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-cyber-pink" />
        <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-cyber-pink" />
        <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-cyber-pink" />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full group">
      {/* Camera feed container */}
      <div className="relative w-full h-full glass-card rounded-2xl border-2 border-neon-cyan/40 overflow-hidden shadow-glass" style={{ minHeight: '400px' }}>
        {/* Video element - MUST be visible */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1,
            display: 'block',
            backgroundColor: 'black'
          }}
        />

        {/* Cyber grid overlay */}
        <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" style={{ zIndex: 5 }} />

        {/* Scanline effect */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 5 }}>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-cyan/5 to-transparent animate-scanline" />
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-cyber-dark/80 backdrop-blur-sm" style={{ zIndex: 30 }}>
            <div className="text-center">
              {/* Loading icon */}
              <div className="mb-4 text-6xl animate-pulse-neon">📷</div>

              {/* Loading text */}
              <p className="text-neon-cyan text-2xl font-cyber font-bold neon-text animate-pulse">
                Initializing Camera
              </p>
              <p className="text-neon-cyan/60 text-sm font-mono mt-2">
                Please allow camera access...
              </p>

              {/* Loading dots */}
              <div className="flex justify-center gap-2 mt-4">
                <div className="w-3 h-3 rounded-full bg-neon-cyan animate-pulse" style={{ animationDelay: '0ms' }} />
                <div className="w-3 h-3 rounded-full bg-neon-cyan animate-pulse" style={{ animationDelay: '200ms' }} />
                <div className="w-3 h-3 rounded-full bg-neon-cyan animate-pulse" style={{ animationDelay: '400ms' }} />
              </div>
            </div>
          </div>
        )}

        {/* Decorative corner brackets */}
        <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-neon-cyan transition-all duration-300 group-hover:w-10 group-hover:h-10" style={{ zIndex: 15 }} />
        <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-neon-cyan transition-all duration-300 group-hover:w-10 group-hover:h-10" style={{ zIndex: 15 }} />
        <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-neon-cyan transition-all duration-300 group-hover:w-10 group-hover:h-10" style={{ zIndex: 15 }} />
        <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-neon-cyan transition-all duration-300 group-hover:w-10 group-hover:h-10" style={{ zIndex: 15 }} />

        {/* Status indicator */}
        {!isLoading && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 glass-card rounded-full border border-neon-cyan/30" style={{ zIndex: 25 }}>
            <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse shadow-neon-cyan" />
            <span className="text-neon-cyan text-xs font-mono uppercase tracking-wider">Live</span>
          </div>
        )}
      </div>
    </div>
  );
}
