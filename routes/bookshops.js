const express = require("express");
const router = express.Router();
const bookshops = require("../controllers/bookshops");
const catchAsync = require("../utilities/catchAsync");
const { isLoggedIn, isAuthor, validateBookshop } = require("../middleware");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

const Bookshop = require("../models/bookshop");

router
  .route("/")
  .get(catchAsync(bookshops.index))
  .post(
    isLoggedIn,
    upload.array("image"),
    validateBookshop,
    catchAsync(bookshops.createBookshop)
  );

router.get("/new", isLoggedIn, bookshops.renderNewForm);

router
  .route("/:id")
  .get(catchAsync(bookshops.showBookshop))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    validateBookshop,
    catchAsync(bookshops.updateBookshop)
  )
  .delete(isLoggedIn, isAuthor, catchAsync(bookshops.deleteBookshop));

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(bookshops.renderEditForm)
);

module.exports = router;
