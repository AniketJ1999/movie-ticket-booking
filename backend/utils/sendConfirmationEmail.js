const nodemailer = require('nodemailer');
const config = require('config');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.get('emailUser'),
    pass: config.get('emailPassword')
  }
});

const sendConfirmationEmail = (user, booking) => {
  const mailOptions = {
    from: config.get('emailUser'),
    to: user.email,
    subject: 'Booking Confirmation',
    text: `Your booking for ${booking.movie.title} on ${new Date(booking.showtime).toLocaleString()} has been confirmed. Seats: ${booking.seats.join(', ')}.`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

module.exports = sendConfirmationEmail;
