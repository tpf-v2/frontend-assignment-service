import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL;

export const uploadDescription = async (user, description) => {
    description="test_example_temp_TODO"
    const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        params: {
            description: description,
        }
    };
    console.log("users group id:")
    console.log(user.group_id)
    const response = await axios.put(`${BASE_URL}/groups/add-description/${user.group_id}`, undefined, config);
    return response.data;
};