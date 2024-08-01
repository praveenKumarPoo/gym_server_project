const mongoose = require('mongoose')
const { Schema, model } = mongoose;

const neelamUserModel = new Schema({
    phoneNumber: {
        type: Number,
    },
    firstName: {
        type: String,
      },
    lastName: {
        type: String,
      },
    email: {
        type: String,
      },
    country: {
        type: String,
      },
    street: {
        type: String,
      },
    city: {
        type: String,
      },
    state: {
        type: String,
      },
    zip: {
        type: String,
      },
  image: {
    publicUrl: { type: String },
    imageName: { type: String }
  }
});

const User_list = model('user_list', neelamUserModel);
module.exports = User_list;

