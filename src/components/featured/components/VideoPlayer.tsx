'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

import { VIDEO_STATE, VideoState } from './VideoPlayer.constants';
import { VideoControls } from './VideoControls';
import { VideoFinished } from './VideoFinished';

// TODO: Change time with range
// TODO: Hide icon after playing for N seconds
export function VideoPlayer(props: {
  poster?: string;
  priority: boolean;
  src: string;
  video: string;
}) {
  const [isMuted, setIsMuted] = useState(false);
  const [isOpaque, setIsOpaque] = useState(true);
  const [isReady, setIsReady] = useState(true);
  const [isPlayRequested, setIsPlayRequested] = useState(false);
  const [duration, setDuration] = useState<number | undefined>(undefined);
  const [time, setTime] = useState(0);
  const [playState, setPlayState] = useState<VideoState>(VIDEO_STATE.IDLE);

  const ref = useRef<HTMLVideoElement>(null);
  const isIdle = playState === VIDEO_STATE.IDLE;
  const isFinished = playState === VIDEO_STATE.FINISHED;
  const isPaused = playState === VIDEO_STATE.PAUSED;
  const isPlaying = playState === VIDEO_STATE.PLAYING;

  useEffect(() => {
    ref.current?.load();
  }, []);

  const isPlay = isReady && isPlayRequested;
  useEffect(() => {
    if (isPlay) ref.current?.play();
  }, [isPlay]);

  return (
    <>
      <video
        className={[
          'absolute top-0 left-0',
          'w-full h-full',
          'object-contain object-center',
          'transition-opacity',
          isIdle ? 'opacity-0' : 'opacity-100',
        ]
          .filter(Boolean)
          .join(' ')}
        muted={isMuted}
        onCanPlay={() => setIsReady(true)}
        onEnded={() => {
          setIsOpaque(true);
          setPlayState(VIDEO_STATE.FINISHED);
        }}
        onError={() => setPlayState(VIDEO_STATE.ERRORED)}
        // TODO: Proper TS
        onLoadedMetadata={(e) => {
          setDuration(Math.ceil(e.currentTarget.duration));
        }}
        onPause={() => setPlayState(VIDEO_STATE.PAUSED)}
        onPlay={() => setPlayState(VIDEO_STATE.PLAYING)}
        onTimeUpdate={(e) => {
          setTime(Math.ceil(e.currentTarget.currentTime));
        }}
        preload="auto"
        ref={ref}
        src={props.src}
      />
      {props.poster && (
        <Image
          alt="Video"
          src={props.poster}
          fill
          className={[
            'transition-opacity transition-700',
            isPlaying || isPaused ? 'opacity-0' : isOpaque ? 'opacity-50' : 'opacity-100',
          ].join(' ')}
          placeholder="blur"
          blurDataURL={props.poster}
          // TODO: True sizes here pls
          sizes="80vw"
          priority={props.priority}
        />
      )}

      <VideoFinished isFinished={isFinished} onReplay={() => ref.current?.play()} />

      <VideoControls
        duration={duration}
        isFinished={isFinished}
        isMuted={isMuted}
        isPlaying={isPlaying}
        onToggleMute={() => setIsMuted((old) => !old)}
        onTogglePlay={() => {
          setIsOpaque(false);
          if (isPlaying) {
            ref.current?.pause();
          } else if (isReady) {
            ref.current?.play();
          } else {
            setIsPlayRequested(true);
          }
        }}
        time={time}
      />
    </>
  );
}
