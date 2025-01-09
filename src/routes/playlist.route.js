import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  addVideoToPlaylist,
  createPlaylist,
  deletePlaylist,
  getPlaylistById,
  getUserPlaylists,
  removeVideoFromPlaylist,
  updatePlaylist,
} from "../controllers/playlist.controller.js";

const router = Router();

router.route("/create-playlist").post(verifyJWT, createPlaylist);
router.route("/get-user-playlist/:userId").post(verifyJWT, getUserPlaylists);
router
  .route("/get-playlist-by-id/:playlistId")
  .post(verifyJWT, getPlaylistById);
router
  .route("/add-v-to-playlist/:playlistId/:videoId")
  .post(addVideoToPlaylist);
router
  .route("/remove-v-from-playlist/:playlistId/:videoId")
  .post(verifyJWT, removeVideoFromPlaylist);
router.route("delete-playlist").delete(verifyJWT, deletePlaylist);
router.route("update-playlist/:playlistId").patch(verifyJWT, updatePlaylist);

export default router;
