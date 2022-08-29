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

    function onClick(friendship) {
        friendship.preventDefault();
        fetch("/api/friendship-action", {
            method: "POST",
            body: JSON.stringify({
                buttonText: friendship.accepted, ///nööö
                otherUser_id: friendship.friendship_id,
            }),
            headers: { "Content-Type": "application/json" },
        });

        console.log("onClick", friendship.friendship_id);
        const targetFriend_id = friendship.friendship_id;
        if (!friendship.accepted) {
            const newFriends = friendships.map((f) => {
                if (f.friendship_id === targetFriend_id) {
                    f.accepted = true;
                }
                return f;
            });
            console.log({ newFriends });
            setFriendships(newFriends);
        }
        // if the friendship is accepted,
        // cancel it and update the friendships state
        // else
        // accept it and update the friendships state as well
    }

    // split the friendships in two groups
    const incoming = friendships.filter((f) => !f.accepted);
    const accepted = friendships.filter((f) => f.accepted);

    return (
        <section className="friends">
            <h2>Friends</h2>
            <section className="incoming-list">
                <h3>Incoming requests</h3>
                <FriendList friendships={incoming} onClick={onClick} />
            </section>
            <section className="current-list">
                <h3>Current friends</h3>
                <FriendList friendships={accepted} onClick={onClick} />
            </section>
        </section>
    );
}
