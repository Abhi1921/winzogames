import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    const socketUrl = (import.meta as any).env?.VITE_SOCKET_URL || "http://localhost:5000";
    socket = io(socketUrl, {
      withCredentials: true,
      autoConnect: true,
    });
  }
  return socket;
}
