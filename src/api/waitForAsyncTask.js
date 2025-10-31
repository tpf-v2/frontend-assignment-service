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
          resolve({success: data.status === "success", result: data.result});
        });

        socket.on("disconnect", () => {
          console.log("Desconectado del servidor de notificaciones");
          reject(new Error("Desconectado del servidor de notificaciones"));
        });
      });

      const res = await result;

      return {
        success: res.success,
        result: res.result
      };
    } catch (error) {
      Sentry.captureException(error);
      console.error("Error al intentar conectar un websocket", error);
    } finally {
      if (socket) {
        socket.disconnect();
      }
    }

    return {
        success: false,
        result: null
    };
}
