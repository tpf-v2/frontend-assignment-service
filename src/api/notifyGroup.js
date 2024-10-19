import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;

export const notifyGroup = async (user, message, group_id) => {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
  
    try {
      const url = `${BASE_URL}/api/tutors/notify-group?group_id=${group_id}`;
      const response = await axios.post(url, { body: message }, config);
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  };