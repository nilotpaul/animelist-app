const asyncHandler = require("express-async-handler");

const User = require("../lib/schema/userSchema");
const Anilist = require("../lib/schema/anilistSchema");

const getAllUser = asyncHandler(async (req, res) => {
  const users = await User.find();

  const allUsers = users.map((user) => {
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  });

  res.status(200).json(allUsers);
});

const getAnilistById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const users = await User.find();

  const findUser = users.find((items) => {
    return items.id === id;
  });

  if (!findUser) {
    res.status(404).redirect("/");
  }

  const anilist = await Anilist.find({ user: findUser });

  res.status(200).json(anilist);
});

module.exports = {
  getAllUser,
  getAnilistById,
};
