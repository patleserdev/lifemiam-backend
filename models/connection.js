const mongoose = require('mongoose');

const connectionString = process.env.CONNECTION_STRING;

mongoose.set("strictQuery", true); // Remove Mongoose warning in console

mongoose.connect(connectionString, { connectTimeoutMS: 2000 })
  .then(() => console.log('Database connected'))
  .catch(error => console.error(error));

  module.exports = connectionString;