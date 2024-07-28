import axios from 'axios';

export const getTopics = async () => {
    const response = await axios.get(`http://127.0.0.1:8000/topics/`);
    return response;
};