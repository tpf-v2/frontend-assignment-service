import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;

export const incompleteGroups = async (user, period) => {
  console.log(user);
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

export const groupsTopicTutor = async (user, period, balance_limit) => {
  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
    params: {
      cache_bust: new Date().getTime(), // add params to avoid caching
    },
  };

  try {
    const url = `${BASE_URL}/assignments/group-topic-tutor?period_id=${period.id}&balance_limit=${balance_limit}`;
    const response = await axios.post(url, {}, config);
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};

export const assignSpecificDate = async (
  user,
  group_id,
  tutor_id,
  evaluator_id,
  date
) => {
  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
    params: {
      cache_bust: new Date().getTime(), // add params to avoid caching
    },
  };

  const body = [
    {
      group_id: group_id,
      tutor_id: tutor_id,
      evaluator_id: evaluator_id,
      date: date,
    },
  ];

  try {
    const url = `${BASE_URL}/assignments/date-assigment`;
    const response = await axios.put(url, body, config);
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};
