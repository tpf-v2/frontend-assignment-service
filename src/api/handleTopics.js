import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL;

export const getTopics = async (user) => {
    const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

    const response = await axios.get(`${BASE_URL}/topics/`, config);
    return response;
};

export const addTopic = async (newTopic, user) => {
    const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
    
    try {
        const url = `${BASE_URL}/topics/`;
        const response = await axios.post(url, newTopic, config);
        return response.data;
    } catch (err) {
        console.error(`Error when adding new topic: ${err}`)
        throw new Error(err);
    }
};