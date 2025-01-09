import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getChannelStats,
  getChannelVideosGlobal,
  getChannelVideosOur,
} from "../controllers/dashboard.controller.js";
const router = Router();

router.route("/s/:channelName").post(verifyJWT, getChannelVideosGlobal);
router.route("/get-channel-stats").post(verifyJWT, getChannelStats);

router.route("get-channel-videos-our").post(verifyJWT, getChannelVideosOur);

export default router;
