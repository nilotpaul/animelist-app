const asyncHandler = require("express-async-handler");

const Anilist = require("../lib/schema/anilistSchema");

const getData = asyncHandler(async (req, res) => {
  const listData = await Anilist.find({ user: req.user.id });

  res.status(200).json(listData);
});

const createData = asyncHandler(async (req, res) => {
  const {
    animeId,
    title,
    image,
    genres,
    studios,
    status,
    score,
    comment,
    episodes,
    lastAdded,
  } = req.body;

  if (!animeId || !title || !image || !genres || !studios || !status) {
    res.status(400).json({ message: "none of the fields can be empty" });
    throw new Error("none of the fields can be empty");
  }

  const user = await Anilist.find({ user: req.user.id });

  const check = user.find((item) => {
    return item?.animeId === animeId;
  });

  if (check) {
    res.status(409).json({ message: "item is already in your list" });
    throw new Error("item is already in your list");
  }

  const addedData = await Anilist.create({
    animeId,
    title,
    image,
    genres,
    studios,
    status,
    episodes,
    score,
    comment,
    lastAdded,
    user: req.user.id,
  });

  res.status(201).json(addedData);
});

const deleteData = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await Anilist.find({ user: req.user.id });

  const check = user.find((item) => {
    return item.id === id;
  });

  if (!id) {
    res.status(400).json({ message: "no id found" });
    throw new Error("no product id found");
  } else {
    if (!check) {
      res.status(400).json({ message: "no matching id found in db" });
      throw new Error("no matching id found in db");
    } else {
      const deletedData = await Anilist.findByIdAndDelete(check);

      res.status(200).json(deletedData);
    }
  }
});

const editData = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { animeId, title, image, genres, studios, status, score, episodes } =
    req.body;

  const user = await Anilist.find({ user: req.user.id });

  const check = user.find((item) => {
    return item.id === id;
  });

  if (!id) {
    res.status(400).json({ message: "no product id found" });
    throw new Error("no product id found");
  } else {
    if (!check) {
      res.status(400).json({ message: "no matching id found in db" });
      throw new Error("no mathing id found in db");
    } else {
      if (animeId || title || image || genres || studios) {
        res.status(401).json({ message: "you cannot edit these fields" });
        throw new Error("you cannot edit these fields");
      }

      if (
        status.toString() === check.status.toString() &&
        score === check.score &&
        episodes === check.episodes
      ) {
        res.status(409);
        throw new Error("cannot send unchanged data");
      }

      const editedData = await Anilist.findByIdAndUpdate(check, req.body);

      res.status(200).json(editedData);
    }
  }
});

module.exports = {
  getData,
  createData,
  deleteData,
  editData,
};
