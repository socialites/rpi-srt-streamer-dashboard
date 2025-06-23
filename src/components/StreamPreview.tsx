import Hls from 'hls.js';
import { useEffect, useRef } from 'preact/hooks';

export default function StreamPreview() {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(`http://${window.location.hostname}/hls/preview.m3u8`);
      hls.attachMedia(videoRef.current);
      return () => hls.destroy();
    }
  }, []);

  return (
    <div class="rounded-md overflow-hidden border border-white/10">
      <video
        ref={videoRef}
        className="w-full max-w-full"
        autoPlay
        muted
        playsInline
        controls
      />
    </div>
  );
}
