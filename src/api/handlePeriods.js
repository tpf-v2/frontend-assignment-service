// src/services/apiService.js
import axios from 'axios';

// Fetch existing cuatrimesters
export const fetchCuatrimestres = async (user) => {
  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };
  try {
    const url = 'https://tpp-g4-fiuba.azurewebsites.net/api/tutors/periods';
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
    const url = 'https://tpp-g4-fiuba.azurewebsites.net/tutors/periods';
    await axios.post(url, { id: newEntry }, config);
  } catch (error) {
    throw new Error('Error adding cuatrimestre: ' + error.message);
  }
};