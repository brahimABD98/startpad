"use client";
import React from "react";
import {
  ControlBar,
  GridLayout,
  LiveKitRoom,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { Track } from "livekit-client";
import type { LiveKitRoomProps } from "@livekit/components-react";
import { env } from "@/env";
interface props
  extends Omit<
    LiveKitRoomProps,
    "token" | "video" | "audio" | "serverUrl" | "data-lk-theme"
  > {
  token: string;
  video?: boolean;
  audio?: boolean;
  serverUrl?: string;
  "data-lk-theme"?: string;
}
export function LiveRoom({
  token,
  video = true,
  audio = true,
  serverUrl = env.NEXT_PUBLIC_LIVEKIT_URL,
  ...props
}: props) {
  return (
    <>
      <LiveKitRoom
        video={video}
        audio={audio}
        token={token}
        serverUrl={serverUrl}
        {...props}
        style={{ height: "100dvh" }}
        data-lk-theme="default"
      >
        <MyVideoConference />
        <RoomAudioRenderer />
        <ControlBar />
      </LiveKitRoom>
    </>
  );
}

function MyVideoConference() {
  // `useTracks` returns all camera and screen share tracks. If a user
  // joins without a published camera track, a placeholder track is returned.
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  );
  return (
    <GridLayout
      tracks={tracks}
      style={{ height: "calc(100vh - var(--lk-control-bar-height))" }}
    >
      {/* The GridLayout accepts zero or one child. The child is used
      as a template to render all passed in tracks. */}
      <ParticipantTile />
    </GridLayout>
  );
}
