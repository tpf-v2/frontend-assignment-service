import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;

export const addTutor = async (newTutor, user, period) => {
  const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
  
  const body = {
    "id": newTutor.id,
    "name": newTutor.name,
    "last_name": newTutor.last_name,
    "email": newTutor.email,
    "period": period,
    "capacity": newTutor.capacity
  }
  try {
    const url = `${BASE_URL}/tutors`;
    const response = await axios.post(url, body, config);
    return response.data;
  } catch (err) {
    console.error(`Error when adding new tutor: ${err}`)
    throw new Error(err);
  }
};