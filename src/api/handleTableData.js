import axios from 'axios';

const BASE_URL = 'https://tpp-g4-fiuba.azurewebsites.net'; 

//TO-DO handle all the endpoints
export const getTableData = async (endpoint, user) => {
  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
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
  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };
  try {
    await axios.delete(`${BASE_URL}${endpoint}${id}`, config); // Cambia esta URL según tu API
  } catch (error) {
    throw error; // Lanza el error para manejarlo en el componente
  }
};