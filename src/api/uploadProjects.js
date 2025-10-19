import axios from "axios";
import * as Sentry from "@sentry/react";
import { waitForAsyncTask } from "./waitForAsyncTask";
const BASE_URL = process.env.REACT_APP_API_URL;

export const uploadProjects = async ({ projectType, subpath, id, projectTitle, selectedFile, url, token }) => {
  const projectNameKeyMap = {
    "initial-project": "Anteproyecto",
    "intermediate-project": "Entrega Intermedia",
    "final-project": "Entrega Final",
    "pps-report": "Informe Cumplimiento PPS",
  };

  const errorMessage = `No se pudo completar el envío de la ${projectNameKeyMap[projectType]}. Por favor, inténtalo de nuevo.`;
  const successMessage = `¡Envío exitoso! Se ha registrado correctamente la ${projectNameKeyMap[projectType]}.`;

  try {
    let apiUrl = `${BASE_URL}/${subpath}/${id}/${projectType}?mode=async&project_title=${projectTitle}`;
    let response;

    // Si es entrega intermedia, enviar la URL
    if (projectType === "intermediate-project") {
      response = await axios.post(
        `${BASE_URL}/${subpath}/${id}/intermediate-report`,
        { url },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status == 200 || response.status == 201 || response.status == 202) {
        return {
          success: true,
          message: successMessage,
        };
      } else {
        return {
          success: false,
          message: errorMessage,
        };
      }
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

      if ((response.status == 200 || response.status == 201 || response.status == 202) && response.data.task_id && response.data.status == "pending") {
        const result = await waitForAsyncTask(response.data.task_id, token);
        if (result.success) {
          return {
            success: true,
            message: successMessage,
          };
        } else {
          return {
            success: false,
            message: errorMessage,
          };
        }
      } else {
        return {
          success: false,
          message: errorMessage,
        };
      }
    }
  } catch (error) {
    Sentry.captureException(error);
    console.error(`Error al enviar la ${projectNameKeyMap[projectType]}`, error);
    return {
      success: false,
      message: errorMessage,
    };
  }
};
