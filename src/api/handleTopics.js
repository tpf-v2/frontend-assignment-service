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