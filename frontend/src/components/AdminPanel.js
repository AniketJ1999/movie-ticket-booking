import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Typography } from '@mui/material';
import { toast } from 'react-toastify';

const AdminPanel = () => {
  const [formData, setFormData] = useState({ title: '', genre: '', showtimes: '' });

  const { title, genre, showtimes } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('/api/admin/add-movie', formData, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      toast.success('Movie added successfully');
    } catch (err) {
      toast.error('Failed to add movie');
    }
  };

  return (
    <Container>
      <Typography variant="h2">Admin Panel</Typography>
      <form onSubmit={onSubmit}>
        <TextField label="Title" name="title" value={title} onChange={onChange} fullWidth required />
        <TextField label="Genre" name="genre" value={genre} onChange={onChange} fullWidth required />
        <TextField
          label="Showtimes (comma-separated)"
          name="showtimes"
          value={showtimes}
          onChange={onChange}
          fullWidth
          required
        />
        <Button type="submit" variant="contained" color="primary">Add Movie</Button>
      </form>
    </Container>
  );
};

export default AdminPanel;
