import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
/* import io from "socket.io-client"; */
import { connect, disconnect } from "./socket";

export default function Chat() {
    const [chatMessages, setChatMessages] = useState([]);
    useEffect(() => {
        const socket = connect();
        function onRecentMessages(incomingMessages) {
            setChatMessages(incomingMessages);
            // update the list of messages
        }

        function onBroadcastMessage(message) {
            setChatMessages((allMessages) => {
                return [...allMessages, message];
            });
            // update the list of messages * (see note below)
        }

        socket.on("recentMessages", onRecentMessages);
        socket.on("broadcastMessage", onBroadcastMessage);

        // cleanup function returned from useEffect
        return () => {
            socket.off("recentMessages", onRecentMessages);
            socket.off("broadcastMessage", onBroadcastMessage);
            disconnect();
        };
    }, []);

    function onSubmit(event) {
        event.preventDefault();
        const socket = connect();
        const message = event.target.message.value;
        console.log("onSubmit", message);
        // emit the right socket event and send the right info
    }

    return (
        <section className="chat">
            <h2>Chat</h2>
            <ul className="messages">
                {/*    // loop over the messages and render them */}
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
