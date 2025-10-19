import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;


function _config(period_id, user) {
  return {
    params: {
      period: period_id
    },
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };
}

export const downloadProject = async (groupId, user, period_id, projectType, groupNumber) => {
  const projectName = projectType;
  const fileName = projectType === 'final-project' ? `EntregaFinal_equipo${groupNumber}.pdf` : `EntregaInicial_equipo${groupNumber}.pdf`;

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
  console.log("Group id")
  console.log(groupId)
  try {
    return await fetchUrlForProject(groupId, projectName, user, period_id);
  } catch (error) {
    console.error(`Error al obtener el PDF de la entrega ${projectType}:`, error);
    throw error;
  }
};

export const downloadPPSReport = async (user, student_id, period_id, fileName) => {
  try {

    const config = {
      params: {
        period: period_id
      },
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
      responseType: 'blob',
    };

    const response = await axios.get(`${BASE_URL}/students/${student_id}/pps-report`, config);

    // Crea un blob a partir de la respuesta
    const blob = new Blob([response.data], { type: response.headers['content-type'] });

    // Crea una URL para el blob
    const url = window.URL.createObjectURL(blob);

    // Crea un enlace temporal
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);

    // Dispara el clic para descargar el archivo
    link.click();

    // Limpia el DOM eliminando el enlace temporal
    document.body.removeChild(link);
  } catch (error) {
    console.error(`Error al descargar el informe PPS:`, error);
    throw error;
  }
}

export const getPPSReports = async (user, period_id) => {

  const config = {
    params: {
      period: period_id
    },
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };

  const response = await axios.get(`${BASE_URL}/students/pps-reports`, config);
  return response.data.map(row => {
    if (row.name) {
      const tokens = row.name.split('/');
      if (tokens[1]) {
        const x = parseInt(tokens[1])
        if (!isNaN(x)) {
          row.student_id = x;
        }
      }
    }

    return row;
  });
}

export const getProjects = async (user, period_id, projectType) => {
  const projectName = projectType;
  const config = _config(period_id, user);
  const response = await axios.get(`${BASE_URL}/groups/${projectName}`, config);
  return response.data;
};

export const getPublicProjects = async (user, period_id) => {
  const config = _config(period_id, user);
  const response = await axios.get(`${BASE_URL}/projects/public-project`, config);
  return response.data;
};
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
  const response = await axios.get(`${BASE_URL}/groups/${groupId}/${projectName}`, CONFIG_BLOB);
  const blob = new Blob([response.data], { type: response.headers['content-type'] });
  const url = window.URL.createObjectURL(blob);
  return url;
}

