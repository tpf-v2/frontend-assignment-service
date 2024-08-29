import axios from 'axios';

export const getTopics = async (user) => {
    const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

    const response = await axios.get(`https://tpp-g4-fiuba.azurewebsites.net/topics/`, config);
    return response;
};