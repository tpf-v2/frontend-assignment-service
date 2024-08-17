import axios from 'axios';

export const sendGroupForm = async (payload, existingGroup) => {
  try {
    var response;
    if(existingGroup){
      response = await axios.post('http://127.0.0.1:8000/forms/answers', payload);
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
      response = await axios.post('http://127.0.0.1:8000/groups/?period=2C2024', groupPayload);
    }
    
    return response;
  } catch (error) {
    throw new Error('Error al enviar el formulario');
  }
};