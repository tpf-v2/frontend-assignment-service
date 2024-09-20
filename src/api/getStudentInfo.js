import axios from "axios";
import { setUserInfo } from "../redux/userSlice";


const BASE_URL = process.env.REACT_APP_API_URL;

export const getStudentInfo = (user) => async (dispatch) => {
  
  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
    params: {
      cache_bust: new Date().getTime(), // Añadir parámetro para evitar caché
    },
  };

  const user_id = user.id;

  // Realiza la solicitud GET con los parámetros de consulta dinámicos
  const response = await axios.get(`${BASE_URL}/students/info/me`, config);
  
  const userData = {
    form_answered: response.data.form_answered,
    group_id: response.data.group_id,
    tutor: response.data.tutor,
    topic: response.data.topic,
    teammates: response.data.teammates? response.data.teammates.join(" , ") : "",
  };

  // Guarda la informacion del usuario
  dispatch(setUserInfo(userData));

  return response.data;
};