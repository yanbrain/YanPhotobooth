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
  const [isReady, setIsReady] = useState(false);

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

          video.onloadedmetadata = async () => {
            console.log('✅ Video metadata loaded', {
              videoWidth: video.videoWidth,
              videoHeight: video.videoHeight,
              readyState: video.readyState
            });
            try {
              await video.play();
            } catch (playError) {
              console.warn('⚠️ Unable to autoplay camera feed', playError);
            }
            setIsReady(true);
            setIsLoading(false);
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
      <div className="relative flex items-center justify-center h-full glass-card rounded-none border border-cyber-pink overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-15" />

        <div className="relative text-center p-8 z-10">
          <div className="mb-6 text-5xl">⚠️</div>

          <p className="text-cyber-pink text-xl mb-2 font-cyber font-semibold neon-text">
            Camera Access Error
          </p>
          <p className="text-neon-cyan/80 text-sm mb-6 font-mono">
            {error}
          </p>

          <button
            onClick={() => window.location.reload()}
            className="
              relative px-8 py-3 rounded-none font-cyber font-semibold text-lg
              bg-cyber-dark text-cyber-pink border border-cyber-pink
              hover:text-white hover:border-cyber-pink/80
              transition-all duration-200
            "
          >
            Retry Camera
          </button>
        </div>

        <div className="absolute top-2 left-2 w-6 h-6 border-t border-l border-cyber-pink" />
        <div className="absolute top-2 right-2 w-6 h-6 border-t border-r border-cyber-pink" />
        <div className="absolute bottom-2 left-2 w-6 h-6 border-b border-l border-cyber-pink" />
        <div className="absolute bottom-2 right-2 w-6 h-6 border-b border-r border-cyber-pink" />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full group">
      <div className="relative w-full h-full min-h-[420px] aspect-[16/9] glass-card rounded-none border border-neon-cyan/40 overflow-hidden shadow-glass bg-black/70">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" style={{ zIndex: 5 }} />

        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 5 }}>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-cyan/5 to-transparent animate-scanline" />
        </div>

        {(isLoading || !isReady) && (
          <div className="absolute inset-0 flex items-center justify-center bg-cyber-dark/90" style={{ zIndex: 30 }}>
            <div className="text-center max-w-sm">
              <div className="mb-4 text-5xl">📷</div>

              <p className="text-neon-cyan text-xl font-cyber font-semibold neon-text">
                Camera Feed Pending
              </p>
              <p className="text-neon-cyan/60 text-sm font-mono mt-2">
                Allow camera access in your browser to display the live feed.
              </p>
              <p className="text-neon-cyan/40 text-xs font-mono mt-3">
                If permission was denied, refresh and approve access.
              </p>

              <div className="flex justify-center gap-2 mt-4">
                <div className="w-3 h-3 bg-neon-cyan animate-pulse" style={{ animationDelay: '0ms' }} />
                <div className="w-3 h-3 bg-neon-cyan animate-pulse" style={{ animationDelay: '200ms' }} />
                <div className="w-3 h-3 bg-neon-cyan animate-pulse" style={{ animationDelay: '400ms' }} />
              </div>
            </div>
          </div>
        )}

        <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-neon-cyan transition-all duration-300 group-hover:w-10 group-hover:h-10" style={{ zIndex: 15 }} />
        <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-neon-cyan transition-all duration-300 group-hover:w-10 group-hover:h-10" style={{ zIndex: 15 }} />
        <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-neon-cyan transition-all duration-300 group-hover:w-10 group-hover:h-10" style={{ zIndex: 15 }} />
        <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-neon-cyan transition-all duration-300 group-hover:w-10 group-hover:h-10" style={{ zIndex: 15 }} />

        {!isLoading && isReady && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 glass-card rounded-none border border-neon-cyan/30" style={{ zIndex: 25 }}>
            <div className="w-2 h-2 bg-neon-green animate-pulse shadow-neon-cyan" />
            <span className="text-neon-cyan text-xs font-mono uppercase tracking-[0.2em]">Live</span>
          </div>
        )}
      </div>
    </div>
  );
}
