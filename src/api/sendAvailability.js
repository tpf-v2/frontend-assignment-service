import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL;

export const sendAvailability = async (user,events) => {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
  
    try {
      const url = user.role === "student" ? `${BASE_URL}/api/dates/groups?group_id=${user.group_id}` : `${BASE_URL}/api/dates/tutors?period=${user.period_id}`
      console.log(user)
      console.log(`El URL es: ${url}`)
      console.log(`Los eventos son: ${JSON.stringify(events)}`)
      const response = await axios.post(url, events, config);
      return response.data;
  
    } catch (error) {
      throw new Error(error);
    }
};