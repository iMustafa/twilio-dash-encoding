import axios from 'axios';
import { GetTwilioTokenInput } from './twilio.providers.d';

export interface AccessToken {
  accountSid: string;
  keySid: string;
  secret: string;
  ttls: number;
  identity: string;
  grants: { room: string }[]
}

export const GetTwilioToken = async ({ identity, room }: GetTwilioTokenInput): Promise<AccessToken> => {
  try {
    const token = await axios.get('http://localhost:3000/api/twilio/video-token', { params: { room, identity } });
    return token.data as AccessToken;
  } catch (e) {
    return e.toJSON();
  }
}