const mongoose = require("mongoose");

const anilistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    animeId: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    genres: {
      type: [],
      default: undefined,
      required: true,
    },
    studios: {
      type: [],
      default: undefined,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "watching",
        "planning",
        "completed",
        "rewatching",
        "paused",
        "dropped",
      ],
      required: true,
    },
    episodes: {
      type: Number,
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
    },
    lastAdded: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Anilist", anilistSchema);
