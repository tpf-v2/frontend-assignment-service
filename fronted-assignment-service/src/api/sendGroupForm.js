import axios from 'axios';

export const sendGroupForm = async (payload) => {
  try {
    const response = await axios.post('http://127.0.0.1:8000/forms/groups', payload);
    return response;
  } catch (error) {
    throw new Error('Error al enviar el formulario');
  }
};