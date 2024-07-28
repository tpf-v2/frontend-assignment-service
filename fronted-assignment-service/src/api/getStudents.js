import axios from 'axios';

export const getStudents = async (uids) => {
    const response = await axios.get(`http://127.0.0.1:8000/students/?uids=123456789&uids=12344321`);
    return response;
};