import io from "socket.io-client";

let socket;
export const connect = () => {
    if (!socket) {
        socket = io.connect();
    }
    return socket;
};

export const disconnect = () => (socket = null);
