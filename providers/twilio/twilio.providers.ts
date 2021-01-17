import axios from 'axios';
import { GetTwilioTokenInput } from './twilio.providers.d';

export const GetTwilioToken = async ({ identity, room }: GetTwilioTokenInput): Promise<string> => {
  try {
    const token = await axios.get<string>('http://localhost:3000/api/twilio/video-token', { params: { room, identity } });
    return token.data;
  } catch (e) {
    return e.toJSON();
  }
}