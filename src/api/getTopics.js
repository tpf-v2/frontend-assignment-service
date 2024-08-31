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