import axios from "axios";
import { setUserInfo } from "../redux/slices/userSlice";
import { getConfigLogin, getConfigLoginCached } from "./config/getConfig";
const BASE_URL = process.env.REACT_APP_API_URL;

export const getStudentInfo = (user) => async (dispatch) => {
  
  const config = getConfigLogin(user);

  // Realiza la solicitud GET con los parámetros de consulta dinámicos
  const response = await axios.get(`${BASE_URL}/students/info/me`, config);
  
  const userData = {
    form_answered: response.data.form_answered,
    group_id: response.data.group_id,
    tutor: response.data.tutor,
    topic: response.data.topic,
    teammates: response.data.teammates ? response.data.teammates.join(" , ") : "",
    period_id: response.data.period_id,
    group_number: response.data.group_number,
    student_number: response.data.student_number
  };

  // Guarda la informacion del usuario
  dispatch(setUserInfo(userData));

  return response.data;
};

export const getStudents = async (period, uids, user) => {
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
    const response = await axios.get(`${BASE_URL}/students/?period=${period.id}`, config);
  
    return response;
  };
  
  
  export const getAllStudents = async (user) => {
    const config = getConfigLoginCached(user)
  
    // Realiza la solicitud GET con los parámetros de consulta dinámicos
    const response = await axios.get(`${BASE_URL}/students/`, config);
  
    return response;
};
  
export const addStudent = async (newStudent, user, period_id) => {
    const config = getConfigLoginCached(user)
    
    try {
        const url = `${BASE_URL}/students?period=${period_id}`;
        const response = await axios.post(url, newStudent, config);
        return response.data;
    } catch (err) {
        console.error(`Error when adding new student: ${err}`)
        throw new Error(err);
    }
};

export const editStudent = async (original_student_id, period_id, studentToEdit, user) => {
  const config = getConfigLoginCached(user)
  try {
      const url = `${BASE_URL}/students/${original_student_id}/periods/${period_id}`;
      const response = await axios.patch(url, studentToEdit, config);
      return response.data;
  } catch (err) {
      console.error(`Error when editing student: ${err}`)
      throw new Error(err);
  }
};