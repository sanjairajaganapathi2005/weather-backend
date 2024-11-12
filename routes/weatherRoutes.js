const express = require('express');
const WeatherData = require('../models/WeatherData');

const router = express.Router();

// Save weather data for a specific user
router.post('/saveWeatherData', async (req, res) => {
  const { user_id, ...weatherData } = req.body;
  if (!user_id) return res.status(400).json({ error: 'User ID is required' });

  try {
    const newWeatherData = new WeatherData({ user_id, ...weatherData });
    await newWeatherData.save();
    res.status(200).json({ message: 'Weather data saved successfully' });
  } catch (err) {
    console.error('Error saving weather data:', err.message);
    res.status(500).json({ error: 'Error saving weather data' });
  }
});

// Fetch weather data for a specific user
router.get('/getWeatherData/:user_id', async (req, res) => {
  const { user_id } = req.params;
  
  try {
    const weatherData = await WeatherData.find({ user_id });
    if (weatherData.length === 0) {
      return res.status(404).json({ error: 'No weather data found for this user' });
    }
    res.status(200).json(weatherData);
  } catch (err) {
    console.error('Error fetching weather data:', err.message);
    res.status(500).json({ error: 'Error fetching weather data' });
  }
});

module.exports = router;
