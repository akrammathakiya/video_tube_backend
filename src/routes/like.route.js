import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getLikedVideos,
  toggleCommentLike,
  toggleTweetLike,
  toggleVideoLike,
} from "../controllers/like.controller.js";

const router = Router();

router.route("/toggle-like-v/:videoId").post(verifyJWT, toggleVideoLike);
router.route("/toggle-like-c/:commentId").post(verifyJWT, toggleCommentLike);
router.route("/toggle-like-t/:tweetId").post(verifyJWT, toggleTweetLike);
router.route("/get-liked-v").post(verifyJWT, getLikedVideos);

export default router;
