import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth', formData);
      localStorage.setItem('token', res.data.token);
      toast.success('Login successful');
      navigate('/movies');
    } catch (err) {
      toast.error('Login failed');
    }
  };

  return (
    <Container>
      <Typography variant="h2">Login</Typography>
      <form onSubmit={onSubmit}>
        <TextField label="Email" name="email" value={email} onChange={onChange} fullWidth required />
        <TextField
          label="Password"
          name="password"
          value={password}
          onChange={onChange}
          type="password"
          fullWidth
          required
        />
        <Button type="submit" variant="contained" color="primary">Login</Button>
      </form>
    </Container>
  );
};

export default Login;
