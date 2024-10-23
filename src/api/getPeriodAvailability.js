import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;

export const getPeriodAvailability = async (user, period) => {
  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };
  try {
    const url = `${BASE_URL}/api/dates/?period=${period.id}`;
    const response = await axios.get(url, config);
    return response.data;

    // const generateSlots = () => {
    //   const slots = [];
    //   const startDate = new Date(2024, 9, 9); // 8 de octubre de 2024 (el primer día de la segunda semana)
    //   const endDate = new Date(2024, 9, 21); // 20 de octubre de 2024 (el último día de la tercera semana)

    //   for (
    //     let date = startDate;
    //     date <= endDate;
    //     date.setDate(date.getDate() + 1)
    //   ) {
    //     // Solo considerar días de lunes a viernes
    //     const day = date.getDay();
    //     if (day >= 1 && day <= 5) {
    //       // 1 (lunes) a 5 (viernes)
    //       for (let hour = 9; hour < 20; hour++) {
    //         // Excluir 13:00 y 14:00
    //         if (hour !== 13 && hour !== 14) {
    //           const slotDate = new Date(date);
    //           slotDate.setHours(hour, 0, 0, 0);
    //           slots.push({ slot: slotDate.toISOString() });
    //         }
    //       }
    //     }
    //   }
    //   return slots;
    // };
    // const mockSlots = generateSlots();
    // return mockSlots;
  } catch (error) {
    throw new Error("Error fetching cuatrimestres: " + error.message);
  }
};
