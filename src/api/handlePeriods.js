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

// Fetch existing cuatrimesters
export const getTutorCuatrimestre = async (user) => {
  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };
  try {
    //const url = `${BASE_URL}/api/tutors/periods`;
    //const response = await axios.get(url, config);
    //return response.data;
    const response = {
      "id": 12024,
      "name": "Agustín",
      "last_name": "Rojas",
      "email": "arojas@fi.uba.ar",
      "periods": [
        {
          "id": 1,
          "period_id": "2C2024",
          "tutor_id": 12024,
          "capacity": 1,
          "is_evaluator": false
        },
        {
          "id": 2,
          "period_id": "1C2025",
          "tutor_id": 12024,
          "capacity": 1,
          "is_evaluator": false
        }
      ]
    }

    return response.periods
  } catch (error) {
    throw new Error('Error fetching cuatrimestres: ' + error.message);
  }
};