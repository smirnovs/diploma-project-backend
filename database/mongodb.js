const mongoose = require('mongoose');
const mongoAddress = require('../helpers/mongo-address');

mongoose.connect(mongoAddress.MONGO_ADDRESS, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});
