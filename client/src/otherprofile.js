// compare request.params.user_id = number 1? === login ID => return error+ redirect
import { useState, useEffect } from "react";
import { useParams } from "react-router";

function OtherProfile() {
    const { user_id } = useParams();
    const [user, setUser] = useState({});

    useEffect(() => {
        // fetch the user info with the given user_id
        // update the user accordingly
        // if the user is not found (or is the logged user)
        // redirect to the homepage
        // see instructions above about how to use the history.replace method
    }, [user_id]);

    return <div class="other-profile">// display the user info</div>;
}
