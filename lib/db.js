const mongoose = require("mongoose");

const mongoConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("mongodb connected");
  } catch (err) {
    throw new Error("could'nt connect to db");
  }
};

module.exports = mongoConnect;
