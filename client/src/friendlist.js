import { Link } from "react-router-dom";

export default function FriendList({ friendships, onClick }) {
    return (
        <ul>
            {friendships.map((f) => (
                <li key={f.user_id}>
                    // put the profile picture as well!
                    <div className="content">
                        <Link to={`/users/${f.user_id}`}>
                            {f.first_name} {f.last_name}
                        </Link>
                        <button onClick={() => onClick(f)}>
                            // put the right button text based on the friendship
                            status
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    );
}
