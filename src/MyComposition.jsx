import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';

export const MyComposition = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const opacity = frame / durationInFrames;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0f0f0f',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <h1
        style={{
          color: 'white',
          fontSize: 80,
          fontFamily: 'sans-serif',
          opacity,
        }}
      >
        Hello, Remotion!
      </h1>
    </AbsoluteFill>
  );
};
