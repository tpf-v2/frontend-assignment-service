import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;

export const getFormAnswersById = async (period, user) => {
  
  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    }
  };

  const user_id = user.id;

  // Realiza la solicitud GET con los parámetros de consulta dinámicos
  const response = await axios.get(`${BASE_URL}/forms/answers/${user_id}/?period=${period}`, config);

  return response;
};