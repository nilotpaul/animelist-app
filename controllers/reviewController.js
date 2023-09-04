const asyncHandler = require("express-async-handler");

const Review = require("../lib/schema/reviewSchema");

const getReviews = asyncHandler(async (req, res) => {
  const userReviews = await Review.find();

  res.status(200).json(userReviews);
});

const postReviews = asyncHandler(async (req, res) => {
  const { animeId, title, image, review, reviewTitle } = req.body;

  const userReviews = await Review.find({ user: req.user.id });

  if (!animeId || !title || !image || !review || !reviewTitle) {
    res.status(400).json({ message: "none of the fields can be empty" });
    throw new Error("none of the fields can be empty");
  }

  const check = userReviews.find((item) => {
    return item?.animeId === animeId;
  });

  if (check) {
    res
      .status(405)
      .json({ message: "cannot post another review for the same show" });
    throw new Error("cannot post another review for the same show");
  }

  const createdReview = await Review.create({
    animeId,
    title,
    image,
    reviewTitle,
    review,
    user: req.user.id,
  });

  res.status(201).json(createdReview);
});

const deleteReviews = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const userReviews = await Review.find({ user: req.user.id });

  if (!id) {
    res.status(400).json({ message: "no id found" });
    throw new Error("no id found");
  }

  const check = userReviews.find((item) => {
    return item.id === id;
  });

  if (!check) {
    res.status(400).json({ message: "no matching id found in db" });
    throw new Error("no matching id found in db");
  } else {
    const deletedReview = await Review.findByIdAndDelete(check);

    res.status(200).json(deletedReview);
  }
});

const editReviews = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { name, title, image, review, reviewTitle } = req.body;

  if (name || title || image) {
    res.status(401).json({ message: "you cannot edit these fields" });
    throw new Error("you cannot edit these fields");
  }

  if (!review || !reviewTitle) {
    res.status(400).json({ message: "field cannot be empty" });
    throw new Error("field cannot be empty");
  }

  const userReviews = await Review.find({ user: req.user.id });

  if (!id) {
    res.status(400).json({ message: "no id found" });
    throw new Error("no id found");
  }

  const check = userReviews.find((item) => {
    return item.id === id;
  });

  if (review === check.review) {
    res.status(409).json({ message: "cannot send unchanged data" });
    throw new Error("cannot send unchanged data");
  }

  if (!check) {
    res.status(400).json({ message: "no matching id found in db" });
    throw new Error("no matching id found in db");
  }

  const editedReview = await Review.findByIdAndUpdate(check, req.body);

  res.status(200).json(editedReview);
});

module.exports = {
  getReviews,
  postReviews,
  deleteReviews,
  editReviews,
};
