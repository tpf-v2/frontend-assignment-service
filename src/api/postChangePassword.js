import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL;

export const resetPassword = async (user, new_password, old_password) => {
  const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    const body =  {
        new_password: new_password,
        old_password: old_password
    }
  
    try {
      const url = `${BASE_URL}/reset-password`;
      const response = await axios.post(url, body, config);
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
};