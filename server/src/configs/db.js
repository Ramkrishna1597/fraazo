const mongoose = require("mongoose");

const connect = () => {
  mongoose.connect(
    "mongodb+srv://ramkrishna:ram123@fraazo.iq2mpzm.mongodb.net/?retryWrites=true&w=majority"
  );
};

module.exports = connect;