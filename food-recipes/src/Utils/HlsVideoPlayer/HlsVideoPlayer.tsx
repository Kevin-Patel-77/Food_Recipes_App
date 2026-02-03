import Hls from "hls.js";
import { useEffect, useRef } from "react";

const HlsVideoPlayer = ({ videoId }: { videoId: string }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const src = `http://localhost:3000/video/${videoId}/master.m3u8`;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);

      return () => hls.destroy();
    }
  }, [videoId]);

  return (
    <video
      ref={videoRef}
      controls
      style={{ maxWidth: "100%", borderRadius: "12px" }}
    />
  );
};

export default HlsVideoPlayer
