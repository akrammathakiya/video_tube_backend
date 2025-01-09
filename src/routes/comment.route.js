import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  addComment,
  deleteComment,
  getVideoComments,
  updateComment,
} from "../controllers/comment.controller.js";
const router = Router();

router.route("/video-comments").post(verifyJWT, getVideoComments);
router.route("/add-comment").post(verifyJWT, addComment);
router.route("update-comment").patch(verifyJWT, updateComment);
router.route("delete-comment").delete(verifyJWT, deleteComment);

export default router;
