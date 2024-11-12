const mongoose = require('mongoose');

const weatherSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  name: { type: String, required: true },
  weather: { type: Object, required: true },
  main: { type: Object, required: true },
  wind: { type: Object, required: true },
  clouds: { type: Object, required: true },
  sys: { type: Object, required: true },
  searchedAt: { type: Date, default: Date.now }, // Store timestamp for each weather entry
});

module.exports = mongoose.model('WeatherData', weatherSchema);
