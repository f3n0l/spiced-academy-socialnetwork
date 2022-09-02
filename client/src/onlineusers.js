import { useState, useEffect } from "react";
import { connect, disconnect } from "./socket";
import { Link } from "react-router-dom";

export default function OnlineUsers() {
    const [onlineUsers, setOnlineUsers] = useState([]);
    useEffect(() => {
        const socket = connect();

        function onUserJoined(user) {
            setOnlineUsers(user);
        }

        /*         function onUserLeft(user) {
            console.log("iwadjiawjdioawdjaowidj", user);
            setOnlineUsers(user);
        } */

        socket.on("userJoined", onUserJoined);
        /*         socket.on("userLeft", onUserLeft); */

        return () => {
            socket.off("userJoined", onUserJoined);
            /*     socket.off("userLeft", onUserLeft) */ disconnect();
        };
    }, []);

    return (
        <div className="onlineUsers">
            <p>Now online:</p>
            <ul>
                {onlineUsers.map((onlineUser) => (
                    <li key={onlineUser.id}>
                        <a
                            href={"/users/" + onlineUser.id}
                            className="onlineUserPic"
                        >
                            <img src={onlineUser.profile_picture_url}></img>
                        </a>
                        <div className="content">
                            <Link
                                to={`/users/${onlineUser.id}`}
                                className="onlineUserName"
                            >
                                {onlineUser.first_name} {onlineUser.last_name}
                            </Link>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
