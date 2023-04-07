const mongoose = require("mongoose");

const connection = mongoose.connect("mongodb+srv://Rajesh:rajesh@cluster0.odfmnjk.mongodb.net/azes?retryWrites=true&w=majority");

module.exports = { connection }