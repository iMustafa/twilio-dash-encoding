import { combineReducers } from "redux";
import TwilioReducer, { TwilioReducerState } from "./twilio.reducer";
import WebRTCReducer, {WebRTCReducerState} from "./webrtc.reducer";

export interface StoreState {
  twilio: TwilioReducerState;
  webrtc: WebRTCReducerState
}

export default combineReducers<StoreState>({
  twilio: TwilioReducer,
  webrtc: WebRTCReducer
});