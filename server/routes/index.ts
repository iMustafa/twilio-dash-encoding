import { Router } from "express";
import TwilioRoutes from "./twilio.routes";

const router = Router();

router.use("/twilio", TwilioRoutes);

export default router;