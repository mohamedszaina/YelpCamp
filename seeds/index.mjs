import mongoose from "mongoose";
import { cities } from "./cities.mjs";
import { Campground } from "../models/campground.mjs";

//mongo connection
mongoose
  .connect("mongodb://127.0.0.1:27017/yelp-camp")
  .then(() => {
    console.log("mongo connection done from app.mjs");
  })
  .catch((err) => {
    console.log(err);
  });

const seeedDB = async () => {
  await Campground.deleteMany();
  for (let i = 1; i <= 50; i++) {
    const randomCities = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const n = new Campground({
      location: `${cities[randomCities].city} - ${cities[randomCities].city}`,
      number: `${i}`,
      img: "https://source.unsplash.com/collection/483251",
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
