import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;

export const downloadAnteproyecto = async (groupId, user, period) => {
  try {
    const config = {
      params: {
        period: period.id,
      },
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
      responseType: 'blob', // Esto asegura que la respuesta se maneje como un archivo binario
    };

    // Realiza la solicitud GET para obtener el archivo
    const response = await axios.get(`${BASE_URL}/groups/${groupId}/initial-project`, config);

    // Crea un blob a partir de la respuesta
    const blob = new Blob([response.data], { type: response.headers['content-type'] });

    // Crea una URL para el blob
    const url = window.URL.createObjectURL(blob);

    // Crea un enlace temporal
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `grupo-${groupId}-anteproyecto.pdf`); // Puedes cambiar el nombre del archivo aquí
    document.body.appendChild(link);

    // Dispara el clic para descargar el archivo
    link.click();

    // Limpia el DOM eliminando el enlace temporal
    document.body.removeChild(link);
  } catch (error) {
    console.error("Error al descargar el anteproyecto:", error);
    throw error;
  }
};
