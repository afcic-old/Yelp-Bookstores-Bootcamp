const mongoose = require("mongoose");
const cities = require("./cities");
const { name, thing } = require("./seedHelpers.js");
const Bookshop = require("../models/bookshop");

mongoose.connect("mongodb://localhost:27017/bookshop", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Bookshop.deleteMany({});
  for (let i = 0; i < 200; i++) {
    const randomCity = Math.floor(Math.random() * 101);
    const book = new Bookshop({
      //YOUR USER ID, so change it!!!
      author: "605bec139e51053788a99521",
      location: `${cities[randomCity].city}`,
      title: `${sample(name)} ${sample(thing)}`,
      description: "Lorem ipsum dolor sit amet consectetur",
      geometry: {
        type: "Point",
        coordinates: [
          cities[randomCity].longitude,
          cities[randomCity].latitude,
        ],
      },
      images: [
        {
          url:
            "https://res.cloudinary.com/cicinoblacek/image/upload/v1616638421/bookstore/hfyd3k1ywyvnsuvmrw4n.jpg",
          filename: "bookstore/hfyd3k1ywyvnsuvmrw4n",
        },
        {
          url:
            "https://res.cloudinary.com/cicinoblacek/image/upload/v1616638421/bookstore/hfyd3k1ywyvnsuvmrw4n.jpg",
          filename: "bookstore/hfyd3k1ywyvnsuvmrw4n",
        },
      ],
    });

    await book.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
