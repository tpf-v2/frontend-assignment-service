import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL;

export const getTutorEvents = async (user, period) => {
    const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        params: {
          cache_bust: new Date().getTime(), // add params to avoid caching
        },
      };

    const response = await axios.get(`${BASE_URL}/tutors/assigned-dates?period_id=${period.id}`, config);
    return response.data;
};