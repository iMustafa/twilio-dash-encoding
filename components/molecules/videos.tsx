import React, {useEffect} from 'react';
import {connect, useSelector, useDispatch} from 'react-redux';
import Video, {Participant} from 'twilio-video';
import socketIOClient from 'socket.io-client';
import {StoreState} from '../../redux/reducers';
import {TwilioActionTypes} from '../../redux/types/twilio.types';
import {WebRTCActionTypes} from '../../redux/types/webrtc.types';
import MyPreview from '../atoms/my-preview';
import VideoPlayer from '../atoms/video-player';

const Videos = () => {
  const dispatch = useDispatch();
  const [myPreview, setMyPreview] = React.useState<MediaStream>(null);
  const {token, room, isConnected, participants, identity} = useSelector(
    (state: StoreState) => state.twilio
  );
  const stream = useSelector((state: StoreState) => state.webrtc.stream);

  React.useEffect(() => {
    const getUserMedia = async () => {
      try {
        if (navigator.webdriver) {
          dispatch({type: WebRTCActionTypes.SET_MEDIA_STREAM, payload: {}});
        } else {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });
          dispatch({type: WebRTCActionTypes.SET_MEDIA_STREAM, payload: stream});
        }
      } catch (e) {
        console.log(e);
      }
    };
    if (token) getUserMedia();
  }, [token]);

  React.useEffect(() => {
    const connectToRoom = async () => {
      const r = await Video.connect(token, {
        name: room,
        tracks: 'getTracks' in stream ? stream.getTracks() : [],
      });
      console.log('>> room', room)
      console.log('>> identity', identity)
      dispatch({type: TwilioActionTypes.SET_IS_CONNECTED, payload: true});

      r.participants.forEach((participant) => {
        console.log('>> participantConnected', participant)
        dispatch({
          type: TwilioActionTypes.ADD_PARTICIPANT,
          payload: participant,
        });
      });
      r.on('participantConnected', (participant) => {
        console.log('>> participantConnected', participant)
        dispatch({
          type: TwilioActionTypes.ADD_PARTICIPANT,
          payload: participant,
        });
      });

      r.on('participantDisconnected', (participant) => {
        dispatch({
          type: TwilioActionTypes.REMOVE_PARTICIPANT,
          payload: participant,
        });
      });
    };
    if (stream) connectToRoom();
  }, [stream]);

  React.useEffect(() => {
    if (isConnected && !navigator.webdriver) {
      const io = socketIOClient();
      io.emit('start-recording', {room, identity});
    }
  }, [isConnected]);

  return (
    <React.Fragment>
      <MyPreview />
      <h1>{navigator.webdriver ? 'HEADLESS' : 'CHROME'}</h1>
      {isConnected && <h1>Connected</h1>}
      {participants
        .filter((p) => p.identity != identity)
        .map((participant, i) => (
          <VideoPlayer key={i} participant={participant} />
        ))}
    </React.Fragment>
  );
};

export default connect(null, {})(Videos);
