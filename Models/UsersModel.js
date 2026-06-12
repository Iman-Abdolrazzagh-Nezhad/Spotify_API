const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "You must add a name."],
  },
  password: {
    type: String,
    required: [true, "You must provide a password"],
    minlength: 4,
    select: false,
  },
  email: {
    type: String,
    required: [true, "You must add an email."],
    unique: true,
    validate: [validator.isEmail, "Provide a valid Email"],
  },
  image: {
    type: String,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  lastLoginAt: {
    type: Date,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
  },
  updatedAt: {
    type: Date,
  },
});

// userSchema.pre(/^find/, function (next) {
//   this.start = Date.now();

//   next();
// });

// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return; //next();

//   this.password = await bcrypt.hash(this.password, 12);

//   // next();
// });

// userSchema.post(/^find/, function (docs, next) {
//   console.log(
//     `User query middleware took ${Date.now() - this.start} milliseconds!`
//   );

//   next();
// });

const Users = mongoose.model("users", userSchema);

module.exports = Users;
