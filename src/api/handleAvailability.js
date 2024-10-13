import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL;

export const sendAvailability = async (user, slots, period_id) => {
  const config = {
      params: {
        period: period_id,
      },
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
  
    try {
      const url = `${BASE_URL}/dates`;
      const response = await axios.post(url, slots, config);
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
};

export const fetchAvailability = async (user, period_id) => {
  const config = {
      params: {
        period: period_id,
      },
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
  
    try {
      const url = `${BASE_URL}/dates`;
      const response = await axios.get(url, config);
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
};

