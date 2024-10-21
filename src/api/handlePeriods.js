// src/services/apiService.js
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;

// Fetch existing cuatrimesters
export const fetchCuatrimestres = async (user) => {
  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };
  try {
    const url = `${BASE_URL}/api/periods/`;
    const response = await axios.get(url, config);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching periods: ' + error.message);
  }
};

// Add a new period
export const addCuatrimestre = async (newEntry, user) => {
  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };

  try {
    const url = `${BASE_URL}/periods`;
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
    var url = "";
    if (user.role === "admin") {
      url = `${BASE_URL}/api/periods/`;
    } else {
      url = `${BASE_URL}/api/tutors/${user.id}/periods`;
    }
    const response = await axios.get(url, config);

    const periods = response.data.tutor_periods
      ? response.data.tutor_periods
      : response.data.map((item) => {
          const { id, ...rest } = item;
          return { period_id: id, ...rest };
        });
    return periods;
  } catch (error) {
    throw new Error("Error fetching cuatrimestres: " + error.message);
  }
};

export const getCuatrimestre = async (user) => {
  console.log("API", user.period_id)
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    const response = await axios.get(
      `${BASE_URL}/api/periods/${user.period_id}`,
      config
    );
    console.log(response)
    return response.data;
  } catch (error) {
    throw new Error("Error fetching cuatrimestre: " + error.message);
  }
};
