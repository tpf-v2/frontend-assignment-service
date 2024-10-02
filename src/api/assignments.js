import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;

export const incompleteGroups = async (user, period) => {
    console.log(user)
  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
    params: {
      cache_bust: new Date().getTime(), // add params to avoid caching
    },
  };

  try {
    const url = `${BASE_URL}/assignments/incomplete-groups?period_id=${period.id}`;
    const response = await axios.post(url, {}, config);
    return response;
  } catch (error) {
    throw new Error(error);
  }

};
