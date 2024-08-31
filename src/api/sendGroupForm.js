import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL;

export const sendGroupForm = async (payload, existingGroup, user) => {
  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };
  try {
    var response;
    if(!existingGroup){
      response = await axios.post(`${BASE_URL}/forms/answers`, payload, config);
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
      response = await axios.post(`${BASE_URL}/groups/?period=2C2024`, groupPayload, config);
    }
    console.log(response)
    return response;
  } catch (error) {
    return error.response
  }
};