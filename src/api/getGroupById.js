import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;

export const getGroupById = (user, group_id) => async () => {
  
  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
    params: {
      cache_bust: new Date().getTime(), // add params to avoid caching
    },
  };

  const response = await axios.get(`${BASE_URL}/groups/states/${group_id}`, config);
  console.log("response:")
  console.log(response)
  return response.data;
};