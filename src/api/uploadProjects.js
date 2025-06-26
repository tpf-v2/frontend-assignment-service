import axios from "axios";
import * as Sentry from "@sentry/react";
import { io } from "socket.io-client";

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

    if (response.status == 200 && response.data.task_id && response.data.status == "pending") {

      let socket;
      try {
        let tries = 5
        socket = io(`${BASE_URL}`, {
          path: "/ws",
          reconnection: true,
          reconnectionAttempts: tries,
          reconnectionDelay: 1000
        });

        const result = new Promise((resolve, reject) => {
          socket.on("connect", () => {
            console.log("Conectado al servidor de notificaciones");
            socket.emit("listentask", {
              task_id: response.data.task_id
            });
          });

          socket.on("connect_timeout", (error) => {
            console.error("Error al intentar conectar un websocket (timeout)", error);
            reject(error);
          });

          socket.on("connect_error", (error) => {
            tries--;
            if (tries <= 0) {
              console.error("Error al intentar conectar un websocket (connect_error)", error);
              reject(error);
            }
          });

          socket.on("reconnect_failed", (error) => {
            console.error("Error al intentar conectar un websocket", error);
            reject(error);
          });

          socket.on("error", (error) => {
            console.error("Error al intentar conectar un websocket", error);
            reject(error);
          });

          socket.on("taskstatus", (data) => {
            console.log("Status de la tarea", data);
            resolve(data.status);
          });

          socket.on("disconnect", () => {
            console.log("Desconectado del servidor de notificaciones");
            reject(new Error("Desconectado del servidor de notificaciones"));
          });
        });

        const status = await result;

        return {
          success: status == "success",
          message: `¡Envío exitoso! Se ha registrado correctamente la ${projectNameKeyMap[projectType]}.`,
        };
      } catch (error) {
        Sentry.captureException(error);
        console.error("Error al intentar conectar un websocket", error);
      } finally {
        if (socket) {
          socket.disconnect();
        }
      }
    }

    // Todo lo que viene hasta ahora es para la compatibilidad con
    // la version del backend que no implementa socketio
    if (!response.data.task_id) {
      return {
        success: response.status === 202 || response.status === 200,
        message: `¡Envío exitoso! Se ha registrado correctamente la ${projectNameKeyMap[projectType]}.`,
      };
    }

    // El fallback a long polling es necesario si socket.io falla
    // porque el servidor no lo soporta
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
