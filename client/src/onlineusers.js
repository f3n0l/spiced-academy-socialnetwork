import { useState, useEffect } from "react";
import { connect, disconnect } from "./socket";

export default function OnlineUsers() {
    const [onlineUsers, setOnlineUsers] = useState([]);
    useEffect(() => {
        const socket = connect();

        function onUserJoined(user) {
            setOnlineUsers(user);
        }

        function onUserLeft(user) {
            setOnlineUsers((allUsers) => {
                return [...allUsers, user];
            });
        }

        socket.on("userJoined", onUserJoined);
        socket.on("userLeft", onUserLeft);

        return () => {
            socket.off("userJoined", onUserJoined);
            socket.off("userLeft", onUserLeft);
            disconnect();
        };
    }, []);

    /* function onSubmit(event) {
        event.preventDefault();
        const socket = connect();
        const message = event.target.message.value;
  /*       /*     socket.emit("userLeft", event.target.user.id); */
    /*     } */

    return (
        <div className="onlineUsers">
            <p>Now online:</p>
        </div>
    );
}
