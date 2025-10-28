import axios from "axios";
import { getConfigLoginCached } from "./config/getConfig";
const BASE_URL = process.env.REACT_APP_API_URL;

export const getAllPeriods = async (user) => {
  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };
  try {
    const url = `${BASE_URL}/api/periods/`;
    const response = await axios.get(url, config);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching periods: ' + error.message);
  }
};

export const addPeriod = async (newEntry, user) => {
  const config = getConfigLoginCached(user)
  try {
    const url = `${BASE_URL}/api/periods/`;
    const response = await axios.post(url, { id: newEntry }, config);
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};

export const getTutorPeriods = async (user) => {
  const config = getConfigLoginCached(user)
  try {
    var url = "";
    if (user.role === "admin") {
      url = `${BASE_URL}/api/periods/`;
    } else {
      url = `${BASE_URL}/api/tutors/${user.id}/periods`;
    }
    const response = await axios.get(url, config);

    const periods = response.data.tutor_periods
      ? response.data.tutor_periods
      : response.data.map((item) => {
          const { id, ...rest } = item;
          return { period_id: id, ...rest };
        });
    return periods;
  } catch (error) {
    throw new Error("Error fetching periods: " + error.message);
  }
};

export const getPeriodById = async (user, periodId=undefined) => {
  try {
    const config = getConfigLoginCached(user)
    const periodRequest = periodId? periodId : user.period_id
    const response = await axios.get(
      `${BASE_URL}/api/periods/${periodRequest}`,
      config
    );
    return response.data;
  } catch (error) {
    throw new Error("Error fetching periods: " + error.message);
  }
};