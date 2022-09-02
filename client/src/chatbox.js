import { useState, useEffect, useRef } from "react";
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

    const lastChatRef = useRef(null);
    useEffect(() => {
        if (!lastChatRef.current) {
            return;
        }

        lastChatRef.current.scrollIntoView({ behaviour: "smooth" });
    }, [chatMessages]);

    function onSubmit(event) {
        event.preventDefault();
        const socket = connect();
        const message = event.target.message.value;
        socket.emit("sendMessage", message);
    }

    return (
        <section className="chat">
            <h2>Chat</h2>
            <div className="chatlist">
                {chatMessages.map((message) => (
                    <ul
                        className="messages"
                        ref={lastChatRef}
                        key={message.message_id}
                    >
                        <ChatEntry {...message} />
                    </ul>
                ))}
            </div>
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
