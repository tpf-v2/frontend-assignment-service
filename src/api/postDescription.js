import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL;

export const uploadDescription = async (user, description) => {
    const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        params: {
            description: description,
        }
    };
    const response = await axios.put(`${BASE_URL}/groups/add-description/${user.group_id}`, undefined, config);
    return response.data;
};