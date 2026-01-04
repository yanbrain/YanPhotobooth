// Camera utilities

export async function requestCameraAccess(): Promise<MediaStream> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 1920 },
        height: { ideal: 1080 },
        facingMode: 'user',
      },
    });
    return stream;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'NotAllowedError') {
        throw new Error('Camera permission denied. Please allow camera access in your browser settings.');
      }
      if (error.name === 'NotFoundError') {
        throw new Error('No camera device found. Please connect a camera and try again.');
      }
    }
    throw new Error('Failed to access camera. Please check your device and try again.');
  }
}

export function stopCameraStream(stream: MediaStream | null) {
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
  }
}

export async function captureImageFromVideo(
  videoElement: HTMLVideoElement
): Promise<{ blob: Blob; previewUrl: string }> {
  const canvas = document.createElement('canvas');
  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  ctx.drawImage(videoElement, 0, 0);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const previewUrl = URL.createObjectURL(blob);
          resolve({ blob, previewUrl });
        } else {
          reject(new Error('Failed to capture image'));
        }
      },
      'image/jpeg',
      0.95
    );
  });
}
