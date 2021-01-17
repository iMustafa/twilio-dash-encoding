import React from 'react';
import {Participant, RemoteTrackPublication} from 'twilio-video';

interface VideoPlayerProps {
  participant: Participant;
}

const trackpubsToTracks = (trackMap) =>
  Array.from(trackMap.values())
    .map((publication: RemoteTrackPublication) => publication.track)
    .filter((track) => track !== null);

const VideoPlayer = ({participant}: VideoPlayerProps) => {
  const [videoTracks, setVideoTracks] = React.useState([]);
  const [audioTracks, setAudioTracks] = React.useState([]);

  const videoRef = React.useRef<HTMLVideoElement>();
  const audioRef = React.useRef<HTMLAudioElement>();

  React.useEffect(() => {
    console.log('>> PARTICIPANT', participant.identity, 'connected');
    console.log(participant);
    setVideoTracks(trackpubsToTracks(participant.videoTracks));
    setAudioTracks(trackpubsToTracks(participant.audioTracks));

    return () => {
      setVideoTracks([]);
      setAudioTracks([]);
      participant.removeAllListeners();
    };
  }, []);

  React.useEffect(() => {
    const videoTrack = videoTracks[0];
    if (videoTrack) {
      console.log('>> ADDED VIDEO TRACK')
      videoTrack.attach(videoRef.current);
      videoRef.current.play();
      return () => {
        videoTrack.detach();
      };
    }
  }, [videoTracks]);

  React.useEffect(() => {
    const audioTrack = audioTracks[0];
    if (audioTrack) {
      audioTrack.attach(audioRef.current);
      videoRef.current.play();
      return () => {
        audioTrack.detach();
      };
    }
  }, [audioTracks]);

  return (
    <div>
      <h6>{participant.identity}</h6>
      <video ref={videoRef} />
      <audio ref={audioRef} />
    </div>
  );
};

export default VideoPlayer;
