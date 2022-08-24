// compare request.params.user_id = number 1? === login ID => return error+ redirect
import { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router";
import ProfilePicture from "./profilepicture";

export default function OtherProfile() {
    const { user_id } = useParams();
    const [user, setUser] = useState({});
    const history = useHistory();

    useEffect(() => {
        fetch(`/api/users/${user_id}`)
            .then((response) => response.json())
            .then(
                (data) => {
                    if (!data || data.error) {
                        history.replace("/");
                        return;
                    }
                    setUser(data);
                },
                [user_id]
            );
        // fetch the user info with the given user_id
        // update the user accordingly
        // if the user is not found (or is the logged user)
        // redirect to the homepage
        // see instructions above about how to use the history.replace method
    }, [user_id]);

    return (
        <div className="other-profile">
            <div className="profile-picture">
                <ProfilePicture
                    profile_picture_url={user.profile_picture_url}
                />
            </div>
            <div className="profile-info">
                <p key={user.id}>
                    {user.first_name} {user.last_name}
                </p>
                <p>{user.bio}</p>
            </div>
        </div>
    );
}
