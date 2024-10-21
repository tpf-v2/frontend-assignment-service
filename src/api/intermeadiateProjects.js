import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;

export const getIntermediateProjects = async (user, period) => {
  const config = {
    params: {
      period: period.id,
    },
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };

  // Realiza la solicitud GET con los parámetros de consulta dinámicos
  const response = await axios.get(
    `${BASE_URL}/groups/intermediate-report`,
    config
  );

  return response.data;
};

export const getIntermediateProject = async (groupId, user, period) => {
    const config = {
      params: {
        period: period.id,
      },
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
  
    const response = await axios.get(`${BASE_URL}/groups/${groupId}/intermediate-report`, config);
  
    return response.data;
  };
