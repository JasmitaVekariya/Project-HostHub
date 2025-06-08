require('dotenv').config();
const mongoose = require('mongoose');
const Listing = require('../models/listing');
const initData = require('./data');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN; // Ensure this is set in your env or .env file
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

main()
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const initDB = async () => {
  await Listing.deleteMany({});

  const dataWithGeometry = [];

  for (let obj of initData.data) {
    const geoData = await geocodingClient
      .forwardGeocode({
        query: obj.location,
        limit: 1
      })
      .send();

    const coordinates = geoData.body.features[0]?.geometry?.coordinates || [0, 0];

    const listingWithGeometry = {
      ...obj,
      owner: '6841dcfe6e786d29608412a2',
      geometry: {
        type: "Point",
        coordinates: coordinates
      }
    };

    dataWithGeometry.push(listingWithGeometry);
  }

  await Listing.insertMany(dataWithGeometry);
  // console.log("Database initialized with sample data including geometry");
};

initDB();