import axios from 'axios';
import { getConfigLoginCached } from './config/getConfig';
const BASE_URL = process.env.REACT_APP_API_URL;

export const sendAvailability = async (user, slots, period_id) => {
  const config = getConfigLoginCached(user);
  
    try {
      const url = `${BASE_URL}/dates/?period=${period_id}`;
      const response = await axios.post(url, slots, config);
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
};

export const sendStudentAvailability = async (user, slots, group_id,period_id) => {
  const config = getConfigLoginCached(user);
  
    try {
      const url = `${BASE_URL}/api/dates/groups?group_id=${group_id}&period=${period_id}`;
      const response = await axios.post(url, slots, config);
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
};

export const sendTutorAvailability = async (user, slots, tutor_id, period_id) => {
  const config = getConfigLoginCached(user);
  
    try {
      const url = `${BASE_URL}/api/dates/tutors?tutor_id=${tutor_id}&period=${period_id}`;
      const response = await axios.post(url, slots, config);
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
};

export const fetchAvailability = async (user, period_id) => {
  const config = getConfigLoginCached(user);
  
    try {
      const url = `${BASE_URL}/dates/?period=${period_id}`;
      const response = await axios.get(url, config);
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
};

export const putAvailability = async (user, slots, period_id) => {
  const config = getConfigLoginCached(user);
  
    try {
      const url = `${BASE_URL}/dates/?period=${period_id}`;
      const response = await axios.put(url, slots, config);
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
};

export const putStudentAvailability = async (user, slots, group_id, period_id) => {
  const config = getConfigLoginCached(user);
  
    try {
      const url = `${BASE_URL}/dates/groups?group_id=${group_id}&period=${period_id}`;
      const response = await axios.put(url, slots, config);
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
};

export const putTutorAvailability = async (user, slots, tutor_id, period_id) => {
  const config = getConfigLoginCached(user);
  
    try {
      const url = `${BASE_URL}/dates/tutors?tutor_id=${tutor_id}&period=${period_id}`;
      const response = await axios.put(url, slots, config);
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
};

export const fetchStudentAvailability = async (user, group_id) => {
  const config = getConfigLoginCached(user);
  
    try {
      const url = `${BASE_URL}/dates/groups/${group_id}`;
      const response = await axios.get(url, config);
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
};

export const fetchTutorAvailability = async (user, tutor_id, period_id) => {
  const config = getConfigLoginCached(user);
  
    try {
      const url = `${BASE_URL}/dates/tutors/${tutor_id}?period=${period_id}`;
      const response = await axios.get(url, config);
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
};