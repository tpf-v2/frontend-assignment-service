import axios from "axios";

export const getStudents = async (uids, user) => {
  // Crea una instancia de URLSearchParams
  const params = new URLSearchParams();

  // Agrega cada uid al objeto de parámetros
  uids.forEach((uid) => {
    params.append("user_ids", uid);
  });

  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
    params
  };

  // Realiza la solicitud GET con los parámetros de consulta dinámicos
  const response = await axios.get(`https://tpp-g4-fiuba.azurewebsites.net/students/`, config);

  return response;
};


export const getAllStudents = async (user) => {
  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    }
  };

  // Realiza la solicitud GET con los parámetros de consulta dinámicos
  const response = await axios.get(`https://tpp-g4-fiuba.azurewebsites.net/students/`, config);

  return response;
};