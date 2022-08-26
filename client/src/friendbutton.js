import { useState, useEffect } from "react";

export default function FriendButton({ user_id }) {
    const [buttonText, setButtonText] = useState("");
    /*     const [friendStatus, setFriendStatus] = useState("");
     */
    useEffect(() => {
        fetch("/api/friendship-status/" + user_id)
            .then((response) => response.json())
            .then((data) => {
                setButtonText(data);
            })
            .catch((error) => {
                console.log("error /friendship-status", error);
            });
    }, [user_id]);

    function onClick(event) {
        event.preventDefault();
        fetch("/api/friendship-action", {
            method: "POST",
            body: JSON.stringify({
                buttonText: buttonText,
                otherUser_id: user_id,
            }),
            headers: { "Content-Type": "application/json" },
        })
            .then((response) => response.json())
            .then((data) => {
                setButtonText(data);
            })
            .catch((error) => {
                console.log("error /friendship-status", error);
            });
    }

    /*     function getStatusSetText(friendStatus, user_id) {
        const { recipient_id, accepted } = friendStatus[0];
        if (friendStatus.length === 0) {
            setButtonText("Add as a Friend");
        } else if (accepted) {
            setButtonText("Delete friendship");
        } else if (!accepted && recipient_id == user_id) {
            setButtonText("Accept friend request");
        } else if (!accepted && recipient_id !== user_id) {
            setButtonText("Cancel friend request");
        }
    } */

    return (
        <button name={buttonText} className="friendButton" onClick={onClick}>
            {buttonText}
        </button>
    );
}

/*     const buttonText = {
        request: "Add as a Friend",
        cancel: "Cancel friend equest",
        accept: "Accept friend equest",
        delete: "Delete friendship",
    }; */
