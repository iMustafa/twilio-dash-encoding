import React from 'react';
import {useSelector, connect} from 'react-redux';
import {StoreState} from '../../redux/reducers';

const MyPreview = () => {
  const ref = React.useRef<HTMLVideoElement>();
  const stream = useSelector((state: StoreState) => state.webrtc.stream);

  React.useEffect(() => {
    if (stream && 'getVideoTracks' in stream) {
      ref.current.srcObject = stream;
      ref.current.play();
    }
  }, [stream]);

  return stream && <video ref={ref} muted={true} />;
};

export default connect(null, {})(MyPreview);
