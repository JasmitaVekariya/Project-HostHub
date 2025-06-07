const initData = require('./data');

const Listing = require('../models/listing');

const mongoose = require('mongoose');

main()
.then(() => {console.log("Connected to MongoDB")})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) =>({...obj,owner:'6841dcfe6e786d29608412a2'}))
    await Listing.insertMany(initData.data);
    console.log("Database initialized with sample data");
}

initDB();