import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL;

export const sendGroupForm = async (period, payload, existingGroup, user) => {
  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };
  try {
    var response;
    if(!existingGroup){
      response = await axios.post(`${BASE_URL}/forms/answers?period=${period}`, payload, config);
    }
    else{
      //TO-DO dynamic period in QP
      const groupPayload = {
        students_ids: [
          payload.user_id_sender,
          payload.user_id_student_2,
          payload.user_id_student_3,
          payload.user_id_student_4,
        ],
        tutor_email: payload.tutor_email,
        topic: payload.topic_1
      }

      groupPayload.students_ids = groupPayload.students_ids.filter(uid => uid);
      response = await axios.post(`${BASE_URL}/groups/?period=${period}`, groupPayload, config);
    }
    return response;
  } catch (error) {
    return error.response
  }
};


// inner
export const createTeam = async (periodId, payload, config) => {
  
  //TO-DO dynamic period in QP // [query parameter? pero sí es un query parameter]
  const teamPayload = {
    students_ids: [
      payload.user_id_sender,
      payload.user_id_student_2,
      payload.user_id_student_3,
      payload.user_id_student_4,
    ],
    
    // Por convención, cuando se desea guardar al equipo con un tema determinado (sea porque Ya tiene tema y tutor, o porque
    // admin agrega al equipo manualmente), el tema a guardar se pone en topic_1
    topic: payload.topic_1,
    tutor_email: payload.tutor_email
  }

  teamPayload.students_ids = teamPayload.students_ids.filter(uid => uid);
  const response = await axios.post(`${BASE_URL}/groups/?period=${periodId}`, teamPayload, config);
  return response;
}

export const addTeam = async (newItem, user, periodId) => {
  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };
  const intStudentIds = newItem.students
  .map(s => s.id)
  .filter(id => Number.isInteger(id));
  
  // Construyo un payload para reutilizar la función createTeam
  const payload = {
    user_id_sender: intStudentIds[0] || null,
    user_id_student_2: intStudentIds[1] || null,
    user_id_student_3: intStudentIds[2] || null,
    user_id_student_4: intStudentIds[3] || null,
    
    topic_1: newItem.topic.name, // ver si tengo que mandar el name o el topic... _ [VER] [el back espera str pero acá nec id o algo]
    
    tutor_email: newItem.tutor_email || null,
  };
  return await createTeam(periodId, payload, config);
}

export const editTeam = async (groupId, periodId, teamToEdit, user, confirm_move=false) => {
  const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };


  // Con esto enviamos Exactamente los campos que el back espera (y excluimos el id, que ya está
  // como path param)
  const studentsInput = teamToEdit.students;
  
  const intStudentIds = studentsInput
  .map(s => s.id)
  .filter(id => Number.isInteger(id));

  const sendableTeamToEdit = {
    "students_ids": intStudentIds,
    "tutor_email": teamToEdit.tutor_email,
    "topic_id": teamToEdit.topic.id,
    "confirm_move": confirm_move,
  };  

  try {
      const url = `${BASE_URL}/groups/${groupId}/periods/${periodId}`;
      const response = await axios.patch(url, sendableTeamToEdit, config);
      return response.data;
  } catch (err) {
      console.error(`Error when editing team: ${err}`)
      throw err;
  }
};