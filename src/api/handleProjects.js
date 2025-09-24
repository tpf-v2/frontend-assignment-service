import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;

export const downloadProject = async (groupId, user, period_id, projectType, groupNumber) => {
  const projectName = projectType === 'final' ? 'final-project' : 'initial-project';
  const fileName = projectType === 'final' ? `EntregaFinal_equipo${groupNumber}.pdf` : `EntregaInicial_equipo${groupNumber}.pdf`;

  try {
    const url = await fetchUrlForProject(groupId, projectName, user, period_id);

    // Crea un enlace temporal
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName); // Puedes cambiar el nombre del archivo aquí
    document.body.appendChild(link);

    // Dispara el clic para descargar el archivo
    link.click();

    // Limpia el DOM eliminando el enlace temporal
    document.body.removeChild(link);

  } catch (error) {
    console.error(`Error al descargar la entrega ${projectType}:`, error);
    throw error;
  }
};

export const fetchProjectPdf = async (groupId, user, period_id, projectType) => {
  const projectName = projectType === 'final' ? 'final-project' : 'initial-project';
  try {
    return await fetchUrlForProject(groupId, projectName, user, period_id);
  } catch (error) {
    console.error(`Error al obtener el PDF de la entrega ${projectType}:`, error);
    throw error;
  }
};

export const getProjects = async (user, period_id, projectType) => {
  const projectName = projectType === 'final' ? 'final-project' : 'initial-project';
  const config = config(period_id, user);
  const response = await axios.get(`${BASE_URL}/groups/${projectName}`, config);
  return response.data;
};

export const getPublicProjects = async (user, period_id, projectType) => {
  const config = config(period_id, user);
  const response = await axios.get(`${BASE_URL}/groups/public-final-project`, config);
  return response.data;
};

function config(period_id, user) {
  return {
    params: {
      period: period_id
    },
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };
}

async function fetchUrlForProject(groupId, projectName, user, period_id) {
  const CONFIG_BLOB = {
    params: {
      period: period_id,
    },
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
    responseType: 'blob', // Esto asegura que la respuesta se maneje como un archivo binario
  };
  // Realiza la solicitud GET para obtener el archivo
  const response = await axios.get(`${BASE_URL}/groups/${groupId}/${projectName}`, CONFIG_BLOB);

  // Crea un blob a partir de la respuesta
  const blob = new Blob([response.data], { type: response.headers['content-type'] });

  // Crea una URL para el blob
  const url = window.URL.createObjectURL(blob);
  return url;
}

