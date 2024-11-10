import axios from 'axios';


const BASE_URL = process.env.REACT_APP_API_URL;

//TO-DO handle all the endpoints
export const getTableData = async (endpoint, user) => {
  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
    params: {
      cache_bust: new Date().getTime(), // add params to avoid caching
    },
  };
  try {
    const response = await axios.get(`${BASE_URL}${endpoint}`, config);
    return response.data; // Retorna la data
  } catch (error) {
    throw error; // Lanza el error para manejarlo en el componente
  }
};

export const deleteRow = async (endpoint, id, user) => {
  let url = null;

  if (endpoint.includes('students')) {
    url = '/students';
  } else if (endpoint.includes('tutors')) {
    url = '/tutors';
  } else if (endpoint.includes('topics')) {
    url = '/topics';
  }
  
  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };
  try {
    await axios.delete(`${BASE_URL}${url}/${id}`, config); // Cambia esta URL según tu API
  } catch (error) {
    throw error; // Lanza el error para manejarlo en el componente
  }
};