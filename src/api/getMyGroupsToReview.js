import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL;

export const getMyGroupsToReview = async (user,period) => {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    try {
      const url = `${BASE_URL}/api/tutors/reviewer/my-groups?period_id=${period}`;
      const response = await axios.get(url, config);
      return response.data;
    } catch (error) {
      throw new Error('Error fetching cuatrimestres: ' + error.message);
    }
};