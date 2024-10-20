import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL;

export const sendAvailability = async (user, slots, period_id) => {
  const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
  
    try {
      const url = `${BASE_URL}/dates/?period=${period_id}`;
      const response = await axios.post(url, slots, config);
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
};

export const fetchAvailability = async (user, period_id) => {
  const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
  
    try {
      const url = `${BASE_URL}/dates/?period=${period_id}`;
      const response = await axios.get(url, config);
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
};

export const putAvailability = async (user, slots, period_id) => {
  const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
  
    try {
      const url = `${BASE_URL}/dates/?period=${period_id}`;
      const response = await axios.put(url, slots, config);
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
};
