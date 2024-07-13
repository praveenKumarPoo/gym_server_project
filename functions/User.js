const mongoose = require('mongoose')
const { Schema, model } = mongoose;

const gymModel = new Schema({
  "DUE DATE": {
    type: Number,
  },
  "Reg No:": {
    type: Number,
  },
  "NAME": {
    type: String,
  },
  "Gender": {
    type: String,
  },
  "Date of Joining": {
    type: Date,
  },
  "Phone Number": {
    type: Number,
  },
  "Typeof pack": {
    type: String,
  },
  "January": {
    type: String,
  },
  "__EMPTY": {
    type: Number,
  },
  "February": {
    type: String,
  },
  "__EMPTY_1": {
    type: Number,
  },
  "March": {
    type: String,
  },
  "__EMPTY_2": {
    type: Number,
  },
  "April": {
    type: String,
  },
  "__EMPTY_3": {
    type: Number,
  },
  "May": {
    type: String,
  },
  "__EMPTY_4": {
    type: Number,
  },
  "June": {
    type: String,
  },
  "__EMPTY_5": {
    type: Number,
  },
  "July       ": {
    type: String,
  },
  "__EMPTY_6": {
    type: Number,
  },
  "August": {
    type: String,
  },
  "__EMPTY_7": {
    type: Number,
  },
  "monthlyAttendance": {
    type: Object,
  },
  "expiredDays": {
    type: Number,
  },
  "rowColor": {
    type: String,
  },
  "inValidList": {
    type: Boolean,
  },
  "lastCheckInTime": {
    type: String,
  },
  "Fees Options": {
    type: String,
  },
  "Fees Amount": {
    type: Number,
  },
  "comments": {
    type: String,
  },
  "lastUpdateDateTime": {
    type: String,
  }
});

const Gym_user = model('Gym_user', gymModel);
module.exports = Gym_user;

