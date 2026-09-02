const mongoose = require("mongoose");

const musicSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  artistId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  features: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  ],
  likeCount: {
    type: Number,
    default: 0,
  },
  playCount: {
    type: Number,
    default: 0,
  },
  duration: {
    type: Number,
  },
  releaseDate: {
    type: Date,
  },
  audioUrl: {
    type: String,
  },
  coverImage: {
    type: String,
  },
  lyrics: {
    type: String,
  },
  language: {
    type: String,
  },
  createdAt: {
    type: Date,
  },
  updatedAt: {
    type: Date,
  },
});

const Music = mongoose.model("musics", musicSchema);

module.exports = Music;
