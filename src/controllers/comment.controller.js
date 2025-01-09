import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Like } from "../models/like.model.js";

const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if (!videoId) {
    throw new ApiErrors(400, "video id not found");
  }

  const comments = await Comment.aggregate([
    {
      $match: new mongoose.Types.ObjectId(videoId),
    },
    {
      $lookup: {
        from: "users",
        foreignField: "_id",
        localField: "owner",
        as: "owner",
        pipeline: [
          {
            $project: {
              userName: 1,
              avatar: 1,
              fullName: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "likes",
        foreignField: "comment",
        localField: "_id",
        as: "likedocuments",
      },
    },
    {
      $addFields: {
        likes: {
          $size: "$likedocuments",
        },
      },
    },
    {
      $project: {
        content: 1,
        likes: 1,
        fullName: 1,
        userName: 1,
        avatar: 1,
      },
    },
    {
      $skip: (page - 1) * limit,
    },
    {
      $limit: parseInt(limit),
    },
  ]);

  if (!comments.length) {
    throw new ApiError(404, "No comment found on this video");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, comments, "comments fetched successfully"));
});

const addComment = asyncHandler(async (req, res) => {
  // TODO: add a comment to a video

  const { content } = req.body;
  const { videoId } = req.params;

  if (!content || !videoId) {
    throw new ApiErrors(404, "provide both content and video id ");
  }

  const comment = await Comment.create({
    content,
    video: videoId,
    owner: req.user._id,
  });

  if (!comment) {
    throw new ApiErrors(
      500,
      "something went wrong when adding your comment in database"
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, comment, "comment added successfully"));
});

const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment
  const { content } = req.body;
  const { commentId } = req.params;

  if (!content || !commentId) {
    throw new ApiErrors(404, "provide content and commentId");
  }

  const comment = await Comment.findById({ commentId });

  if (!comment) {
    throw new ApiErrors(404, "comment not found");
  }

  if (comment.owner !== req.user._id) {
    throw new ApiErrors(
      405,
      "you are not owner of this comment, unable to edit"
    );
  }

  const isCommentUpdated = await Comment.findByIdAndUpdate(
    commentId,
    {
      $set: { content },
    },
    { new: true }
  );

  if (!isCommentUpdated) {
    throw new ApiErrors(500, "something went wrong when updating your comment");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "comment updated successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment
  const { commentId } = req.params;

  const comment = await Comment.findById({ commentId });

  if (!comment) {
    throw new ApiErrors(404, "comment not found");
  }

  const isDeleted = await Comment.findByIdAndDelete({ commentId });

  if (!isDeleted) {
    throw new ApiErrors(
      500,
      "something went wrong when deleting your comment "
    );
  }

  await Like.deleteMany({ comment: commentId });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "comment is deleted successfully"));
});

export { getVideoComments, addComment, updateComment, deleteComment };
