const Bookshop = require("../models/bookshop");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
  const bookshops = await Bookshop.find({}).populate("popupText");
  res.render("bookshops/index", { bookshops });
};

module.exports.renderNewForm = (req, res) => {
  res.render("bookshops/new");
};

module.exports.createBookshop = async (req, res, next) => {
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.bookshop.location,
      limit: 1,
    })
    .send();
  const bookshop = new Bookshop(req.body.bookshop);
  bookshop.geometry = geoData.body.features[0].geometry;
  bookshop.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  bookshop.author = req.user._id;
  await bookshop.save();
  console.log(bookshop);
  req.flash("success", "Successfully made a new bookshop");
  res.redirect(`/bookshops/${bookshop._id}`);
};
module.exports.showBookshop = async (req, res) => {
  const bookshop = await Bookshop.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  if (!bookshop) {
    req.flash("error", "Cannot find the bookshop");
    return res.redirect("/bookshops");
  }
  res.render("bookshops/show", { bookshop });
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const bookshop = await Bookshop.findById(id);

  if (!bookshop) {
    req.flash("error", "Cannot find that bookshop");
    return res.redirect("/bookshops");
  }

  res.render("bookshops/edit", { bookshop });
};

module.exports.updateBookshop = async (req, res) => {
  const { id } = req.params;
  console.log(req.body);
  const bookshop = await Bookshop.findByIdAndUpdate(id, {
    ...req.body.bookshop,
  });
  const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  bookshop.images.push(...imgs);
  await bookshop.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await bookshop.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }
  req.flash("success", "Successfully updated bookshop");
  res.redirect(`/bookshops/${bookshop._id}`);
};

module.exports.deleteBookshop = async (req, res) => {
  const { id } = req.params;
  await Bookshop.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted Bookshop");
  res.redirect("/bookshops");
};
