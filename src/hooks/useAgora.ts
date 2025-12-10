import { useState, useEffect } from "react";
import AgoraRTC, {
    type IAgoraRTCClient,
    type IAgoraRTCRemoteUser,
    type MicrophoneAudioTrackInitConfig,
    type CameraVideoTrackInitConfig,
    type ILocalVideoTrack,
    type ILocalAudioTrack,
} from "agora-rtc-sdk-ng";
import { AGORA_APP_ID, AGORA_TOKEN } from "@/lib/agora-config";

export interface AgoraState {
    joinState: boolean;
    remoteUsers: IAgoraRTCRemoteUser[];
    localVideoTrack: ILocalVideoTrack | undefined;
    localAudioTrack: ILocalAudioTrack | undefined;
}

export default function useAgora(client: IAgoraRTCClient | undefined) {
    const [localVideoTrack, setLocalVideoTrack] = useState<ILocalVideoTrack | undefined>(undefined);
    const [localAudioTrack, setLocalAudioTrack] = useState<ILocalAudioTrack | undefined>(undefined);
    const [joinState, setJoinState] = useState(false);
    const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([]);

    const [error, setError] = useState<Error | null>(null);

    async function createLocalTracks(audioConfig?: MicrophoneAudioTrackInitConfig, videoConfig?: CameraVideoTrackInitConfig) {
        try {
            const [microphoneTrack, cameraTrack] = await AgoraRTC.createMicrophoneAndCameraTracks(
                audioConfig,
                videoConfig
            );
            setLocalAudioTrack(microphoneTrack);
            setLocalVideoTrack(cameraTrack);
            return [microphoneTrack, cameraTrack];
        } catch (err: any) {
            setError(err);
            console.error("Error creating local tracks:", err);
            throw err;
        }
    }

    async function join(channelName: string, uid: string | number | null, token: string | null = null) {
        if (!client) return;

        try {
            console.log("Agora: Joining channel", channelName, "with App ID", AGORA_APP_ID);
            // Use provided token or fallback to global config (which might be null)
            const tokenToUse = token || AGORA_TOKEN;
            await client.join(AGORA_APP_ID, channelName, tokenToUse, uid);
            console.log("Agora: Joined channel successfully");

            const [microphoneTrack, cameraTrack] = await createLocalTracks();

            await client.publish([microphoneTrack, cameraTrack]);
            console.log("Agora: Published tracks");

            setJoinState(true);
            setError(null);
        } catch (err: any) {
            console.error("Agora: Join failed", err);
            setError(err);
            // Cleanup on failure
            if (client.connectionState === "CONNECTED") {
                await client.leave();
            }
            throw err;
        }
    }

    async function leave() {
        if (localAudioTrack) {
            localAudioTrack.stop();
            localAudioTrack.close();
        }
        if (localVideoTrack) {
            localVideoTrack.stop();
            localVideoTrack.close();
        }
        setLocalAudioTrack(undefined);
        setLocalVideoTrack(undefined);
        setRemoteUsers([]);
        setJoinState(false);
        await client?.leave();
    }

    useEffect(() => {
        if (!client) return;

        const handleUserPublished = async (user: IAgoraRTCRemoteUser, mediaType: "audio" | "video") => {
            await client.subscribe(user, mediaType);
            if (mediaType === "video") {
                setRemoteUsers((prev) => {
                    // Avoid duplicates
                    if (prev.find(u => u.uid === user.uid)) return prev;
                    return [...prev, user]
                });
            }
            if (mediaType === "audio") {
                user.audioTrack?.play();
            }
        };

        const handleUserUnpublished = () => {
            // Removing user from state is handled mostly in UserLeft, but sometimes valuable here too
        };

        const handleUserLeft = (user: IAgoraRTCRemoteUser) => {
            setRemoteUsers((prev) => prev.filter((u) => u.uid !== user.uid));
        };

        client.on("user-published", handleUserPublished);
        client.on("user-unpublished", handleUserUnpublished);
        client.on("user-left", handleUserLeft);

        return () => {
            client.off("user-published", handleUserPublished);
            client.off("user-unpublished", handleUserUnpublished);
            client.off("user-left", handleUserLeft);
        };
    }, [client]);

    return {
        localAudioTrack,
        localVideoTrack,
        joinState,
        leave,
        join,
        remoteUsers,
        error,
    };
}
