import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Button, Grid } from '@mui/material';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const BookSeats = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState({});
  const [seats, setSeats] = useState(Array(60).fill(false));
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookingConfirmation, setBookingConfirmation] = useState(null);

  useEffect(() => {
    const fetchMovie = async () => {
      const res = await axios.get(`/api/movies/${id}`);
      setMovie(res.data);
    };
    fetchMovie();
  }, [id]);

  const onSeatClick = index => {
    if (seats[index]) return;
    const newSelectedSeats = [...selectedSeats];
    const seatIndex = newSelectedSeats.indexOf(index);
    if (seatIndex > -1) {
      newSelectedSeats.splice(seatIndex, 1);
    } else {
      newSelectedSeats.push(index);
    }
    setSelectedSeats(newSelectedSeats);
  };

  const onReserve = async () => {
    const totalPrice = selectedSeats.length * 10;
    try {
      const orderRes = await axios.post(
        '/api/payment/create-order',
        { amount: totalPrice },
        { headers: { 'x-auth-token': localStorage.getItem('token') } }
      );

      const options = {
        key: 'YOUR_RAZORPAY_KEY_ID',
        amount: orderRes.data.amount,
        currency: 'INR',
        name: 'Movie Booking',
        description: `Booking for ${movie.title}`,
        order_id: orderRes.data.id,
        handler: async response => {
          try {
            const verificationRes = await axios.post(
              '/api/payment/verify',
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              { headers: { 'x-auth-token': localStorage.getItem('token') } }
            );

            if (verificationRes.data.status === 'success') {
              const bookingRes = await axios.post(
                '/api/bookings',
                { movie: movie._id, seats: selectedSeats, showtime: movie.showtimes[0], totalPrice },
                { headers: { 'x-auth-token': localStorage.getItem('token') } }
              );
              toast.success('Booking successful');
              setBookingConfirmation(bookingRes.data);
            } else {
              toast.error('Payment verification failed');
            }
          } catch (err) {
            toast.error('Booking failed');
          }
        },
        prefill: {
          name: "Your Name",
          email: "your.email@example.com",
          contact: "9999999999",
        },
        notes: {
          address: "Some address",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error('Payment failed');
    }
  };

  return (
    <Container>
      <Typography variant="h2">Book Seats for {movie.title}</Typography>
      {bookingConfirmation && (
        <div>
          <Typography variant="h4">Booking Confirmation</Typography>
          <Typography>Movie: {movie.title}</Typography>
          <Typography>Seats: {bookingConfirmation.seats.join(', ')}</Typography>
          <Typography>Showtime: {new Date(bookingConfirmation.showtime).toLocaleString()}</Typography>
          <Typography>Total Price: ${bookingConfirmation.totalPrice}</Typography>
        </div>
      )}
      <Grid container spacing={2}>
        {seats.map((seat, index) => (
          <Grid item xs={1} key={index}>
            <Button
              variant="contained"
              color={selectedSeats.includes(index) ? 'secondary' : 'primary'}
              onClick={() => onSeatClick(index)}
              disabled={seat}
            >
              {index + 1}
            </Button>
          </Grid>
        ))}
      </Grid>
      <Button variant="contained" color="primary" onClick={onReserve}>
        Reserve Seats
      </Button>
    </Container>
  );
};

export default BookSeats;
