import {Router} from 'express';
import { GetTwilioToken } from '../controllers/twilio.controller';

const router = Router();

router.get('/video-token', GetTwilioToken)

export default router