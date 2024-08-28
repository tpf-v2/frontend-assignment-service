import axios from "axios";

export const getStudents = async (uids, user) => {
  // Crea una instancia de URLSearchParams
  const params = new URLSearchParams();

  // Agrega cada uid al objeto de parámetros
  uids.forEach((uid) => {
    params.append("user_ids", uid);
  });

  const config = {
    params,
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };

  console.log("Token:", user.token);

  // Realiza la solicitud GET con los parámetros de consulta dinámicos
  const response = await axios.get(`http://127.0.0.1:5000/students`, config);

  return response;
};
