import io from "socket.io-client";

let socket;

// lazy initialise pattern!
export const connect = () => {
    if (!socket) {
        socket = io.connect();
    }
    return socket;
};

export const disconnect = () => (socket = null);
