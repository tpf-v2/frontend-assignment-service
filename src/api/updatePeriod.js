import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;

const updatePeriod = async (updatedSettings, user) => {
  try {
    const response = await axios.put(
        `${BASE_URL}/api/periods/`,
      updatedSettings,
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data; // Retorna la respuesta si la necesitas en el componente
  } catch (error) {
    console.error("Error updating settings:", error);
    throw error;
  }
};

export default updatePeriod;
