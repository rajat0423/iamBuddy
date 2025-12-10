import { useRef, useEffect } from "react";
import type { ILocalVideoTrack, IRemoteVideoTrack } from "agora-rtc-sdk-ng";

interface VideoPlayerProps {
    videoTrack: ILocalVideoTrack | IRemoteVideoTrack | undefined;
    style?: React.CSSProperties;
    className?: string;
}

export default function VideoPlayer({ videoTrack, style, className }: VideoPlayerProps) {
    const container = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!container.current) return;
        videoTrack?.play(container.current);
        return () => {
            videoTrack?.stop();
        };
    }, [videoTrack]);

    return <div ref={container} style={style} className={className} />;
}
