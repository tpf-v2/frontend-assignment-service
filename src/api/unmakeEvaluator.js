import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL;

export const unmakeEvaluator = async (periodId, tutorId, user) => {
    const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      try {
        const url = `${BASE_URL}/tutors/unmake_evaluator?period_id=${periodId}&tutor_id=${tutorId}`;
        const response = await axios.put(url, {}, config);
        return response.data;
      } catch (error) {
        throw new Error(error);
      }
  };