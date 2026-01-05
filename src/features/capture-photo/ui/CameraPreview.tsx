'use client';

import React, { useEffect, useRef, useState } from 'react';
import { requestCameraAccess, stopCameraStream } from '../lib/camera-utils';

interface CameraPreviewProps {
  onStreamReady?: (stream: MediaStream) => void;
  onVideoReady?: (videoElement: HTMLVideoElement) => void;
  onError?: (error: string) => void;
}

export function CameraPreview({ onStreamReady, onVideoReady, onError }: CameraPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    let readyTimeout: ReturnType<typeof setTimeout> | null = null;

    async function initCamera() {
      try {
        const mediaStream = await requestCameraAccess();
        if (!mounted) {
          stopCameraStream(mediaStream);
          return;
        }

        const [videoTrack] = mediaStream.getVideoTracks();
        if (!videoTrack) {
          stopCameraStream(mediaStream);
          throw new Error('No camera device found. Please connect a camera and try again.');
        }

        setStream(mediaStream);
        if (videoRef.current) {
          const video = videoRef.current;
          video.srcObject = mediaStream;
          onVideoReady?.(video);

          const markReady = async () => {
            console.log('Video stream ready', {
              videoWidth: video.videoWidth,
              videoHeight: video.videoHeight,
              readyState: video.readyState
            });
            try {
              await video.play();
            } catch (playError) {
              console.warn('Unable to autoplay camera feed', playError);
            }
            setIsReady(true);
            setIsLoading(false);
          };

          video.onloadedmetadata = markReady;
          video.onloadeddata = markReady;
          video.oncanplay = markReady;
          video.onplaying = markReady;

          if (video.readyState >= 2) {
            markReady();
          } else {
            readyTimeout = setTimeout(() => {
              if (video.readyState >= 2) {
                markReady();
              }
            }, 600);
          }

          console.log('Camera stream set to video element', {
            streamActive: mediaStream.active,
            trackCount: mediaStream.getVideoTracks().length,
            trackSettings: mediaStream.getVideoTracks()[0]?.getSettings()
          });
        } else {
          console.error('Video ref is null!');
        }
        onStreamReady?.(mediaStream);

        mediaStream.oninactive = () => {
          if (!mounted) return;
          const message = 'Camera disconnected. Please reconnect the camera and retry.';
          setError(message);
          onError?.(message);
          setIsLoading(false);
        };

        videoTrack.onended = () => {
          if (!mounted) return;
          const message = 'Camera disconnected. Please reconnect the camera and retry.';
          setError(message);
          onError?.(message);
          setIsLoading(false);
        };
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
      if (readyTimeout) {
        clearTimeout(readyTimeout);
      }
      stopCameraStream(stream);
    };
  }, []);

  if (error) {
    return (
      <div className="relative flex items-center justify-center h-full glass-card rounded-none border border-cyber-pink overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-15" />

        <div className="relative text-center p-8 z-10">
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

      </div>
    );
  }

  return (
    <div className="relative w-full h-full group">
      <div className="relative w-full h-full glass-card rounded-none border border-neon-cyan/40 overflow-hidden shadow-glass bg-black/70">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover bg-black"
        />

        <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" style={{ zIndex: 5 }} />

        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 5 }}>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-cyan/5 to-transparent animate-scanline" />
        </div>

        {(isLoading || !isReady) && (
          <div className="absolute inset-x-0 bottom-6 flex items-center justify-center px-4" style={{ zIndex: 30 }}>
            <div className="flex flex-col items-center gap-2 glass-card border border-neon-cyan/30 bg-cyber-dark/80 px-4 py-3 text-center shadow-glass">
              <p className="text-neon-cyan text-xs font-mono uppercase tracking-[0.2em]">
                Allow camera access to start the live feed
              </p>
              <p className="text-neon-cyan/50 text-[11px] font-mono">
                The browser permission prompt must be accepted to continue.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
