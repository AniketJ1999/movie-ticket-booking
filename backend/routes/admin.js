// Import necessary modules
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const Movie = require('../models/Movie');

// Add a new movie
router.post('/add-movie', [auth, isAdmin], async (req, res) => {
  const { title, genre, showtimes } = req.body;

  try {
    const newMovie = new Movie({ title, genre, showtimes });
    const movie = await newMovie.save();
    res.json(movie);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
