const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB (replace with your MongoDB URI)
mongoose.connect('mongodb://localhost:27017/weather', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Weather data schema
const weatherSchema = new mongoose.Schema({
  user_id: String,
  name: String,
  weather: Object,
  main: Object,
  wind: Object,
  clouds: Object,
  sys: Object,
  timestamp: { type: Date, default: Date.now }, // Automatically set the current date and time
});

const WeatherData = mongoose.model('WeatherData', weatherSchema);

// Save weather data endpoint
app.post('/saveWeatherData', async (req, res) => {
  const { user_id, ...weatherData } = req.body;
  try {
    const newWeatherData = new WeatherData({ user_id, ...weatherData });
    await newWeatherData.save();
    res.status(200).send('Weather data saved');
  } catch (err) {
    console.error('Error saving weather data:', err);
    res.status(500).send('Error saving data');
  }
});

// Fetch weather data for specific user
app.get('/getWeatherData/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;
    const weatherData = await WeatherData.find({ user_id }); // Fetch only user-specific data
    res.status(200).json(weatherData);
  } catch (err) {
    console.error('Error fetching weather data:', err);
    res.status(500).send('Error fetching data');
  }
});

app.use('/auth', require('./routes/auth'));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


// Backend (Node.js/Express)
app.delete('/deleteWeatherData/:user_id/:timestamp', async (req, res) => {
  const { user_id, timestamp } = req.params;

  try {
    // Find and delete the weather data based on user_id and timestamp
    const result = await WeatherData.deleteOne({ user_id, timestamp: new Date(timestamp) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Weather data not found for this user and timestamp' });
    }

    res.status(200).json({ message: "Weather data deleted successfully." });
  } catch (err) {
    console.error("Error deleting weather data:", err);
    res.status(500).json({ error: "Failed to delete weather data" });
  }
});
