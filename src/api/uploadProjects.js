import axios from "axios";
import * as Sentry from "@sentry/react";

const BASE_URL = process.env.REACT_APP_API_URL;
const WS_BASE_URL = process.env.REACT_APP_API_URL
  .replace("http", "ws")
  .replace("https", "wss");

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

    if (response.status == 200 && response.data.task_id && response.data.status == "pending") {

      try {
        const result = new Promise((resolve, reject) => {
          const ws = new WebSocket(`${WS_BASE_URL}/notifications/connect`);
          ws.onopen = () => {
            ws.send(JSON.stringify({
              type: "listen-task",
              task_id: response.data.task_id
            }));
          };

          ws.onerror = (event) => {
            reject(event);
          };

          ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type == "task-status") {
              if (data.status == "success") {
                ws.close();
                resolve(data);
              } else {
                ws.close();
                reject(data);
              }
            }
          };
        });

        await result;

        return {
          success: true,
          message: `¡Envío exitoso! Se ha registrado correctamente la ${projectNameKeyMap[projectType]}.`,
        };

      } catch (error) {
        Sentry.captureException(error);
        console.error("Error al intentar conectar un websocket", error);
      }


      // Espera a que la tarea se complete mediante polling
      while (true) {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const statusResponse = await axios.get(
          `${BASE_URL}/tasks/status/${response.data.task_id}`,
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
    Sentry.captureException(error);
    console.error(`Error al enviar la ${projectNameKeyMap[projectType]}`, error);
    return {
      success: false,
      message: `No se pudo completar el envío de la ${projectNameKeyMap[projectType]}. Por favor, inténtalo de nuevo.`,
    };
  }
};
