import { Link } from "react-router-dom";
import ProfilePicture from "./profilepicture";

function formatDate(timestamp) {
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()} - ${date.toLocaleTimeString()}`;
}

export default function ChatEntry({
    user_id,
    first_name,
    last_name,
    profile_picture_url,
    message,
    created_at,
}) {
    return (
        <div>
            <Link to={`/user/${user_id}`} className="chatAvatar">
                <ProfilePicture
                    first_name={first_name}
                    last_name={last_name}
                    profile_picture_url={profile_picture_url}
                />
            </Link>
            <div className="chatContent">
                <header className="chatInfo">
                    <Link to={`/user/${user_id}`} className="chatUsername">
                        {first_name}
                        {last_name}
                    </Link>
                    <p className="chatDate">{formatDate(created_at)}</p>
                </header>
                <p className="chatMessage">{message}</p>
            </div>
        </div>
    );
}
