// Import necessary modules
const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Movie = require('../models/Movie');
const auth = require('../middleware/auth');
const sendConfirmationEmail = require('../utils/sendConfirmationEmail');

// Create a new booking
router.post('/', auth, async (req, res) => {
  const { movie, seats, showtime, totalPrice } = req.body;

  try {
    const newBooking = new Booking({
      user: req.user.id,
      movie,
      seats,
      showtime,
      totalPrice
    });

    const booking = await newBooking.save();

    // Send confirmation email
    const user = await User.findById(req.user.id);
    sendConfirmationEmail(user, booking);

    res.json(booking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Fetch all bookings (Admin only)
router.get('/', [auth, isAdmin], async (req, res) => {
  try {
    const bookings = await Booking.find().populate('user movie');
    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
