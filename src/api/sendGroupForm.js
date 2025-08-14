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

export const editGroup = async (groupId, periodId, groupToEdit, user, confirm_move_student=false) => {
  const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };


  // Con esto enviamos Exactamente los campos que el back espera (y excluimos el id, que ya está
  // como path param)
  const studentsInput = groupToEdit.students;
  
  const intStudentIds = studentsInput
  .map(s => s.id)
  .filter(id => Number.isInteger(id));
  
  console.log("int:", intStudentIds);
  console.log("input:", studentsInput);
  // if (intStudentIds.length !== studentsInput.length){
  //   return; // <--- nop, esto sale sin informar error.
  // };

  const sendableGroupToEdit = {
    "students_ids": intStudentIds,
    "tutor_email": groupToEdit.tutor_email, //getTutorEmailByTutorPeriodId(groupToEdit.tutor_period_id, periodId),
    "topic_id": groupToEdit.topic.id,
    "confirm_move_student": confirm_move_student,
  };
  
  try {
      const url = `${BASE_URL}/groups/${groupId}/periods/${periodId}`;
      const response = await axios.patch(url, sendableGroupToEdit, config);
      return response.data;
  } catch (err) {
      console.error(`Error when editing group: ${err}`)
      //throw new Error(err);
      throw err;
  }
};