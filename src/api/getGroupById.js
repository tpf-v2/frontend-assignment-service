import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;

// función dispatch / redux
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
  return response.data;
};

// función sin dispatch / redux
export const getGroupByIdSimple = async (user, group_id) => {
  
  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
    params: {
      cache_bust: new Date().getTime(), // add params to avoid caching
    },
  };

  const response = await axios.get(`${BASE_URL}/groups/states/${group_id}`, config);
  return response.data;
};