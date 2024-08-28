import axios from 'axios';

export const getTopics = async (user) => {
    const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

    const response = await axios.get(`http://127.0.0.1:5000/topics/`, config);
    return response;
};