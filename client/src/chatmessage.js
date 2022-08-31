import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import io from "socket.io-client";

let socket;

// lazy initialise pattern!
const connect = () => {
    if (!socket) {
        socket = io.connect();
    }
    return socket;
};

const disconnect = () => (socket = null);

export default function Chat() {
    const [chatMessages, setChatMessages] = useState([]);
    useEffect(() => {
        const socket = connect();
        function onRecentMessages(incomingMessages) {
            // update the list of messages
        }

        function onBroadcastMessage(message) {
            // update the list of messages * (see note below)
        }

        socket.on("recentMessages", onRecentMessages);
        socket.on("broadcastMessage", onBroadcastMessage);

        // cleanup function returned from useEffect
        return () => {
            socket.off("recentMessages", onRecentMessages);
            socket.off("broadcastMessage", broadcastMessage);
            disconnect();
        };
    }, []);

    function onSubmit(event) {
        event.preventDefault();
        const socket = connect();
        // emit the right socket event and send the right info
    }

    return (
        <section className="chat">
            <h2>Chat</h2>
            <ul className="messages">
                // loop over the messages and render them
            </ul>
            <form onSubmit={onSubmit}>
                <textarea
                    name="message"
                    rows={1}
                    placeholder="Write your message..."
                    required
                ></textarea>
                <button>Send</button>
            </form>
        </section>
    );
}
