const Bookshop = require("../models/bookshop");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
  const bookshop = await Bookshop.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  bookshop.reviews.push(review);
  await review.save();
  await bookshop.save();
  req.flash("success", "Successfully made a new review");
  res.redirect(`/bookshops/${bookshop._id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Bookshop.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);

  req.flash("success", "Successfully deleted review");

  res.redirect(`/bookshops/${id}`);
};
