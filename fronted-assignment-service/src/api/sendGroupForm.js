import axios from 'axios';

export const sendGroupForm = async (payload) => {
  try {
    const response = await axios.post('http://127.0.0.1:8000/topic_preferences/', payload);
    return response;
  } catch (error) {
    throw new Error('Error al enviar el formulario');
  }
};