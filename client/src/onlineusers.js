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

        socket.on("userJoined", onUserJoined);

        return () => {
            socket.off("userJoined", onUserJoined);
            disconnect();
        };
    }, []);

    return (
        <div className="onlineUsers">
            <h2>Now online:</h2>
            <ul className="onlinelist">
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
