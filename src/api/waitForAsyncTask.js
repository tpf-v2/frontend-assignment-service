import axios from "axios";
import * as Sentry from "@sentry/react";
import { io } from "socket.io-client";

const BASE_URL = process.env.REACT_APP_API_URL;

export const waitForAsyncTask = async function (task_id, token) {

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
            task_id: task_id
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

      await result;

      return {
        success: true
      };
    } catch (error) {
      Sentry.captureException(error);
      console.error("Error al intentar conectar un websocket", error);
    } finally {
      if (socket) {
        socket.disconnect();
      }
    }

    // El fallback a long polling es necesario si socket.io falla
    // porque el servidor no lo soporta
    while (true) {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const statusResponse = await axios.get(
          `${BASE_URL}/tasks/status/${task_id}`,
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
        success: true
    };
}
