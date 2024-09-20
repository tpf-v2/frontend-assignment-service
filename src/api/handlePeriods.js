// src/services/apiService.js
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL;

// Fetch existing cuatrimesters
export const fetchCuatrimestres = async (user) => {
  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };
  try {
    const url = `${BASE_URL}/api/tutors/periods`;
    const response = await axios.get(url, config);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching cuatrimestres: ' + error.message);
  }
};

// Add a new cuatrimestre
export const addCuatrimestre = async (newEntry, user) => {
  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };

  try {
    const url = `${BASE_URL}/tutors/periods`;
    const response = await axios.post(url, { id: newEntry }, config);
    return response.data;
    
  } catch (error) {
    throw new Error(error);
  }
};