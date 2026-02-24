import { io } from 'socket.io-client';

// Use window.location.origin to connect to the same server
export const socket = io(window.location.origin, {
    transports: ['websocket'],
    autoConnect: true
});
