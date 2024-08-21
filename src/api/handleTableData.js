import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:5000'; 

//TO-DO handle all the endpoints
export const getTableData = async (endpoint) => {
  try {
    const response = await axios.get(`${BASE_URL}${endpoint}`);
    return response.data; // Retorna la data
  } catch (error) {
    throw error; // Lanza el error para manejarlo en el componente
  }
};

export const deleteResponse = async (endpoint, id) => {
  try {
    await axios.delete(`${BASE_URL}${endpoint}/${id}`); // Cambia esta URL según tu API
  } catch (error) {
    throw error; // Lanza el error para manejarlo en el componente
  }
};