import { Link } from "react-router-dom";

export default function FriendList({
    friendships,
    onClickAccept,
    onClickDeny,
    showDeny,
}) {
    return (
        <ul className="friendscard">
            {friendships.map((f) => (
                <li key={f.user_id}>
                    <a
                        href={"/users/" + f.user_id}
                        className="friendrequestpic"
                    >
                        <img src={f.profile_picture_url}></img>
                    </a>
                    <div className="content">
                        <Link
                            to={`/users/${f.user_id}`}
                            className="friendrequestname"
                        >
                            {f.first_name} {f.last_name}
                        </Link>
                        <button
                            onClick={() =>
                                f.accepted ? onClickDeny(f) : onClickAccept(f)
                            }
                        >
                            {f.accepted
                                ? "Delete friendship"
                                : "Accept friend request"}
                        </button>
                        {showDeny && (
                            <button onClick={() => onClickDeny(f)}>Deny</button>
                        )}
                    </div>
                </li>
            ))}
        </ul>
    );
}
