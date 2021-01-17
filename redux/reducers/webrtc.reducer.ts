import { WebRTCActionTypes } from "../types/webrtc.types"

export interface WebRTCReducerState {
  stream: MediaStream
}

const INITIAL_STATE: WebRTCReducerState = {
  stream: null
}

const TwilioReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case WebRTCActionTypes.SET_MEDIA_STREAM:
      return { ...state, stream: action.payload }
    default:
      return { ...state }
  }
}

export default TwilioReducer