import mongoose from "mongoose";
import { cities } from "./cities.mjs";
import { Campground } from "../models/campground.mjs";
import { descriptors, places } from "./seedHelpers.mjs";

//mongo connection
mongoose
  .connect("mongodb://127.0.0.1:27017/yelp-camp")
  .then(() => {
    console.log("mongo connection done from app.mjs");
  })
  .catch((err) => {
    console.log(err);
  });
const sample = (array) => array[Math.floor(Math.random() * array.length)];
const seeedDB = async () => {
  await Campground.deleteMany();
  for (let i = 1; i <= 500; i++) {
    const randomCities = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const n = new Campground({
      author: "631718efe90897369a87d16d",
      location: `${cities[randomCities].city}, ${cities[randomCities].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      number: `${i}`,
      geometry: {
        type: "Point",
        coordinates: [
          cities[randomCities].longitude,
          cities[randomCities].latitude,
        ],
      },
      imgs: [
        {
          url: "https://res.cloudinary.com/yelpcamp-zsm-test/image/upload/v1664932478/YelpCamp/fiver_df7vw1.jpg",
          filename: "YelpCamp/fiver_df7vw1",
        },
        {
          url: "https://res.cloudinary.com/yelpcamp-zsm-test/image/upload/v1664932478/YelpCamp/upwork_jfa3we.png",
          filename: "YelpCamp/upwork_jfa3we",
        },
        {
          url: "https://res.cloudinary.com/yelpcamp-zsm-test/image/upload/v1664932480/YelpCamp/freelancer_baegll.jpg",
          filename: "YelpCamp/freelancer_baegll",
        },
      ],
      price,
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem quia natus, odit possimus placeat tempora facere suscipit ipsam iusto incidunt, corrupti quibusdam? Eveniet aspernatur sapiente fuga. Aliquid nesciunt ab fugit.",
    });
    await n.save();
  }
};
seeedDB().then(() => {
  mongoose.connection.close();
});
