import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL;

export const proposeIdea = async (ideaData, periodId, user) => {
    const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
  
    // Pasamos los campos
    const sendableIdeaData = {
      "author_id": user.id,
      "title": ideaData.title,
      "description": ideaData.description,
    };
  
    try {
        const url = `${BASE_URL}/periods/${periodId}/ideas`;
        const response = await axios.post(url, sendableIdeaData, config);
        return response.data;
    } catch (err) {
        console.error(`Error when proposing idea: ${err}`)
        throw err;
    }
  };
  

  export const getPeriodIdeas = async (periodId, user) => {
    const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
  
    try {
        const url = `${BASE_URL}/periods/${periodId}/ideas`;
        const response = await axios.get(url, config);
        return response.data;
    } catch (err) {
        console.error(`Error when getting period idea: ${err}`)
        throw err;
    }
  };