const asyncHandler = require("express-async-handler");

const Favourite = require("../lib/schema/favouriteSchema");

const getFavourite = asyncHandler(async (req, res) => {
  const userFavourites = await Favourite.find({ user: req.user.id });

  res.status(200).json(userFavourites);
});

const createFavourite = asyncHandler(async (req, res) => {
  const { animeId, title, image } = req.body;

  const userFavourites = await Favourite.find({ user: req.user.id });

  if (userFavourites.length === 6) {
    res.status(429).json({ message: "cannot add more than 6 favorites" });
    throw new Error("cannot add more than 6 favorites");
  }

  if (!animeId || !title || !image) {
    res.status(400).json({ message: "none of the fields can be empty" });
    throw new Error("none of the fields can be empty");
  }

  const check = userFavourites.find((item) => {
    return item?.animeId === animeId;
  });

  if (check) {
    res
      .status(405)
      .json({ message: "cannot add the same favorite more than once" });
    throw new Error("cannot add the same favorite more than once");
  }

  const createdFavourites = await Favourite.create({
    animeId,
    title,
    image,
    user: req.user.id,
  });

  res.status(201).json(createdFavourites);
});

const delFavourite = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const userFavourites = await Favourite.find({ user: req.user.id });

  if (!id) {
    res.status(400).json({ message: "no id found" });
    throw new Error("no id found");
  }

  const check = userFavourites.find((item) => {
    return item.id === id;
  });

  if (!check) {
    res.status(400).json({ message: "no matching id found in db" });
    throw new Error("no matching id found in db");
  } else {
    const deletedFavourite = await Favourite.findByIdAndDelete(check);

    res.status(200).json(deletedFavourite);
  }
});

module.exports = { getFavourite, createFavourite, delFavourite };
