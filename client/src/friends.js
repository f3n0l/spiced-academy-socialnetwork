import { useState, useEffect } from "react";
import FriendList from "./friendlist";

export default function Friends() {
    const [friendships, setFriendships] = useState([]);

    useEffect(() => {
        fetch("/api/friendships")
            .then((response) => response.json())
            .then((data) => {
                setFriendships(data);
            });
        // fetch the friendships from the server
        // update the friendship state
    }, []);

    function onClickAccept(friendship) {
        /*        friendship.preventDefault(); */

        fetch("/api/friendship-action", {
            method: "POST",
            body: JSON.stringify({
                buttonText: "Accept friend request",

                otherUser_id: friendship.user_id,
            }),
            headers: { "Content-Type": "application/json" },
        });

        const targetFriend_id = friendship.friendship_id;

        const newFriends = friendships.map((f) => {
            if (f.friendship_id === targetFriend_id) {
                f.accepted = true;
            }
            return f;
        });

        setFriendships(newFriends);
        /*  else {
            const newFriends = friendships.filter(
                (f) => f.user_id !== friendship.user_id
            );

            setFriendships(newFriends);
        } */
    }
    function onClickDeny(friendship) {
        fetch("/api/friendship-action", {
            method: "POST",
            body: JSON.stringify({
                buttonText: "Delete friendship",

                otherUser_id: friendship.user_id,
            }),
            headers: { "Content-Type": "application/json" },
        });

        const newFriends = friendships.filter(
            (f) => f.user_id !== friendship.user_id
        );

        setFriendships(newFriends);
    }

    const incoming = friendships.filter((f) => !f.accepted);
    const accepted = friendships.filter((f) => f.accepted);

    return (
        <section className="friends">
            <h2>Friends</h2>
            <section className="incoming-list">
                <h3>Incoming requests</h3>
                <FriendList
                    friendships={incoming}
                    onClickAccept={onClickAccept}
                    showDeny
                    onClickDeny={onClickDeny}
                />
            </section>
            <section className="current-list">
                <h3>Current friends</h3>
                <FriendList friendships={accepted} onClickDeny={onClickDeny} />
            </section>
        </section>
    );
}
