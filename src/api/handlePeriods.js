// src/services/apiService.js
import axios from 'axios';

// Fetch existing cuatrimesters
export const fetchCuatrimestres = async () => {
  try {
    const url = 'http://127.0.0.1:5000/tutors/periods'; // Adjust if needed
    const response = await axios.get(url);
    return response.data; // Adjust according to your data structure
  } catch (error) {
    throw new Error('Error fetching cuatrimestres: ' + error.message);
  }
};

// Add a new cuatrimestre
export const addCuatrimestre = async (newEntry) => {
  try {
    const url = 'http://127.0.0.1:5000/tutors/periods?order=ASC'; // Adjust if needed
    await axios.post(url, { id: newEntry });
  } catch (error) {
    throw new Error('Error adding cuatrimestre: ' + error.message);
  }
};