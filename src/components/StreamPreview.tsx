import mpegts from 'mpegts.js';
import { useEffect, useRef } from 'preact/hooks';

export default function StreamPreview() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (mpegts.getFeatureList().mseLivePlayback && videoRef.current) {
      const player = mpegts.createPlayer({
        type: 'mpegts',
        isLive: true,
        url: `http://${window.location.hostname}:8080/preview`,
      });

      player.attachMediaElement(videoRef.current);
      player.load();
      player.play();

      return () => {
        player.unload();
        player.detachMediaElement();
        player.destroy();
      };
    }
  }, []);

  return (
    <video
      ref={videoRef}
      controls
      autoPlay
      muted
      className="w-full max-w-640px"
    />
  );
}
