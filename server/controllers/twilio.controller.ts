import { Request, Response } from 'express';
import { jwt } from "twilio"

const AccessToken = jwt.AccessToken;

const {
  TWILIO_ACCOUNT_SID,
  TWILIO_API_KEY_SID,
  TWILIO_API_KEY_SECRET,
} = process.env;



export const GetTwilioToken = (req: Request, res: Response) => {
  const { identity, room } = req.query;
  const grant = new AccessToken.VideoGrant();

  const token = new AccessToken(
    TWILIO_ACCOUNT_SID,
    TWILIO_API_KEY_SID,
    TWILIO_API_KEY_SECRET
  );

  grant['room'] = room;
  token['identity'] = identity;

  token.addGrant(grant);

  const jwt = token.toJwt();
  res.status(201).send(jwt);
}