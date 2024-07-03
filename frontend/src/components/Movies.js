import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Card, CardContent, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      const res = await axios.get('/api/movies');
      setMovies(res.data);
    };
    fetchMovies();
  }, []);

  return (
    <Container>
      <Typography variant="h2">Available Movies</Typography>
      {movies.map(movie => (
        <Card key={movie._id} style={{ margin: '20px 0' }}>
          <CardContent>
            <Typography variant="h5">{movie.title}</Typography>
            <Typography variant="body2">{movie.genre}</Typography>
            <Typography variant="body2">Showtimes: {movie.showtimes.join(', ')}</Typography>
            <Button variant="contained" color="primary" onClick={() => navigate(`/book/${movie._id}`)}>
              Book Now
            </Button>
          </CardContent>
        </Card>
      ))}
    </Container>
  );
};

export default Movies;
