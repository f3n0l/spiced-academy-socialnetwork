import { useState, useEffect } from "react";
import { connect, disconnect } from "./socket";
import ChatEntry from "./chatmessage";

export default function Chat() {
    const [chatMessages, setChatMessages] = useState([]);
    useEffect(() => {
        const socket = connect();
        function onRecentMessages(incomingMessages) {
            setChatMessages(incomingMessages);
        }

        function onBroadcastMessage(message) {
            setChatMessages((allMessages) => {
                return [...allMessages, message];
            });
        }

        socket.on("recentMessages", onRecentMessages);
        socket.on("broadcastMessage", onBroadcastMessage);

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
        socket.emit("sendMessage", message);
    }

    return (
        <section className="chat">
            <h2>Chat</h2>
            <ul className="messages">
                {chatMessages.map((message) => (
                    <ChatEntry key={message.id} {...message} />
                ))}
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
