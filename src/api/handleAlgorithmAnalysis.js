import axios from 'axios';


const BASE_URL = process.env.REACT_APP_API_URL;
const PREFIX = "/input-analyzers";

// Devuelve la info necesaria para mostrar a admin Antes de ejecutar algoritmo de equipos incompletos
export const getInputAnalysis = async (endpoint, periodId, user) => {
  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
    params: {
      cache_bust: new Date().getTime(), // add params to avoid caching
    },
  };
  try {
    const response = await axios.get(`${BASE_URL}${PREFIX}${endpoint}?period_id=${periodId}`, config);
    return response.data; // Retorna la data
  } catch (error) {
    throw error; // Lanza el error para manejarlo en el componente
  }
};