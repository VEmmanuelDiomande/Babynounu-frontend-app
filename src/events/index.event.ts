// src/services/socket.service.ts
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3000'; // Remplacez par l'URL de votre backend NestJS

export class SocketService {
  socket: Socket;

  constructor() {
    this.socket = io(SOCKET_URL);
  }

  // Écouter un événement
  on(event: string, callback: (data: any) => void) {
    this.socket.on(event, callback);
  }

  // Émettre un événement
  emit(event: string, data: any) {
    this.socket.emit(event, data);
  }

  // Déconnecter le socket
  disconnect() {
    this.socket.disconnect();
  }
}