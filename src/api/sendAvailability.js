import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL;

export const sendAvailability = async (user,events) => {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
  
    try {
      //const url = `${BASE_URL}/post-availability`; cambiar por post real
      //const response = await axios.post(url, { events: events }, config);
      //return response.data;

      console.log(`Los eventos son: ${JSON.stringify(events)}`)
  
    } catch (error) {
      throw new Error(error);
    }
};