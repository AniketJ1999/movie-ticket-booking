// Import necessary modules
const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

// Fetch all movies
router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Add a new movie
router.post('/', [auth, isAdmin], async (req, res) => {
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
