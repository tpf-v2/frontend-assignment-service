import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL;

export const getTopics = async (period, user) => {
    const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

    const response = await axios.get(`${BASE_URL}/topics/?period=${period}`, config);
    return response;
};

export const addTopic = async (newTopic, user, period_id) => {
    const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
    
    try {
        const url = `${BASE_URL}/topics/?period=${period_id}`;
        const response = await axios.post(url, newTopic, config);
        return response.data;
    } catch (err) {
        console.error(`Error when adding new topic: ${err}`)
        throw new Error(err);
    }
};

// En el caso de los temas, el id no es editable (no resulta de relevancia en el domino).
// Solo se usa para identificar unívocamente al tema.
export const editTopic = async (id, period_id, topicToEdit, user) => {
  const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

  // Con esto enviamos Exactamente los campos que el back espera (y excluimos el id, que ya está
  // como path param)
  const sendableTopicToEdit = {
    "name": topicToEdit.name,
    "category": topicToEdit.category,
    "tutor_email": topicToEdit.tutor_email,
    "capacity": topicToEdit.capacity
  };
  
  try {
      const url = `${BASE_URL}/topics/${id}/periods/${period_id}`;
      const response = await axios.patch(url, sendableTopicToEdit, config);
      return response.data;
  } catch (err) {
      console.error(`Error when editing student: ${err}`)
      throw new Error(err);
  }
};