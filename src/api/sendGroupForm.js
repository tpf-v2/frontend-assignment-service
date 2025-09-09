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
  
  console.log("int:", intStudentIds);
  console.log("input:", studentsInput);
  // if (intStudentIds.length !== studentsInput.length){
  //   return; // <--- nop, esto sale sin informar error.
  // };

  const sendableTeamToEdit = {
    "students_ids": intStudentIds,
    "tutor_email": teamToEdit.tutor_email, //getTutorEmailByTutorPeriodId(groupToEdit.tutor_period_id, periodId),
    "topic_id": teamToEdit.topic.id,
    "confirm_move": confirm_move,
  };  

  try {
      const url = `${BASE_URL}/groups/${groupId}/periods/${periodId}`;
      const response = await axios.patch(url, sendableTeamToEdit, config);
      return response.data;
  } catch (err) {
      console.error(`Error when editing team: ${err}`)
      //throw new Error(err);
      throw err;
  }
};