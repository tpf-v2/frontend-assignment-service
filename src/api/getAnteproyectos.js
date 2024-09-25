import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;

export const getAnteproyectos = async (user, period) => {
  const config = {
    params: {
        period: period.id
    },
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };

  // Realiza la solicitud GET con los parámetros de consulta dinámicos
  const response = await axios.get(`${BASE_URL}/groups/initial-project`, config);

  return response.data;
};
