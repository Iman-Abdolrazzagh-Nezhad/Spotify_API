const mongoose = require("mongoose");

const playlistSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  songs: [
    {
      musicId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "musics",
      },
      addedAt: {
        type: Date,
      },
      _id: false,
    },
  ],
  createdAt: {
    type: Date,
  },
  updatedAt: {
    type: Date,
  },
});

const Playlist = mongoose.model("playlists", playlistSchema);

module.exports = Playlist;
