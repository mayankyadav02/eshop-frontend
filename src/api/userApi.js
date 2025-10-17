import axios from './axios.js';

export const loginUser = async (credentials) => {
  const response = await axios.post('/users/login', credentials);
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await axios.post('/users/register', userData);
  return response.data;
};
