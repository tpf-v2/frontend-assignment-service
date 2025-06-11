import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;

export const uploadProjects = async ({ projectType, groupId, projectTitle, selectedFile, url, token }) => {
  const projectNameKeyMap = {
    "initial-project": "Anteproyecto",
    "intermediate-project": "Entrega Intermedia",
    "final-project": "Entrega Final",
  };

  try {
    let apiUrl = `${BASE_URL}/groups/${groupId}/${projectType}?mode=async&project_title=${projectTitle}`;
    let response;

    // Si es entrega intermedia, enviar la URL
    if (projectType === "intermediate-project") {
      response = await axios.post(
        `${BASE_URL}/groups/${groupId}/intermediate-report`,
        { url },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } else {
      // Para initial y final projects, se sube un archivo
      const formData = new FormData();
      formData.append("file", selectedFile);
      response = await axios.post(apiUrl, formData, {
        headers: {
          "Content-Type": "application/pdf",
          Authorization: `Bearer ${token}`,
        },
      });
    }

    if (response.status == 200 && response.data.task_id) {
      while (true) {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const statusResponse = await axios.get(
          `${BASE_URL}/groups/${groupId}/${projectType}/status?task_id=${response.data.task_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (statusResponse.data.status == "error") {
          throw new Error();
        } else if (statusResponse.data.status == "success") {
          break;
        }
      }
    }

    return {
      success: response.status === 202 || response.status === 200,
      message: `¡Envío exitoso! Se ha registrado correctamente la ${projectNameKeyMap[projectType]}.`,
    };
  } catch (error) {
    console.error(`Error al enviar la ${projectNameKeyMap[projectType]}`, error);
    return {
      success: false,
      message: `No se pudo completar el envío de la ${projectNameKeyMap[projectType]}. Por favor, inténtalo de nuevo.`,
    };
  }
};
