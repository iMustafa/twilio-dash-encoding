import { TwilioActionTypes } from "../types/twilio.types"
import { Room, Participant } from "twilio-video"

export interface TwilioReducerState {
  token: string;
  identity: string;
  room: string;
  isConnected: boolean;
  participants: Participant[]
}

const INITIAL_STATE: TwilioReducerState = {
  token: null,
  identity: "",
  room: "",
  isConnected: false,
  participants: []
}

const TwilioReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case TwilioActionTypes.SET_TWILIO_TOKEN:
      return { ...state, token: action.payload }
    case TwilioActionTypes.SET_IDENTITY:
      return { ...state, ...action.payload }
    case TwilioActionTypes.SET_IS_CONNECTED:
      return { ...state, isConnected: action.payload }
    case TwilioActionTypes.ADD_PARTICIPANT:
      return { ...state, participants: [...state.participants, action.payload] }
    case TwilioActionTypes.REMOVE_PARTICIPANT:
      return { ...state, participants: state.participants.filter(p => p.sid != action.payload.sid) }
    default:
      return { ...state }
  }
}

export default TwilioReducer