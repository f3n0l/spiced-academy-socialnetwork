import { useState, useEffect } from "react";

export default function FriendButton({ otherUser_id, user_id }) {
    const [buttonText, setButtonText] = useState("");
    /*     const [friendStatus, setFriendStatus] = useState("");
     */
    useEffect(() => {
        fetch("/api/friendship-status/" + otherUser_id)
            .then((response) => response.json())
            .then((data) => {
                setButtonText(data);
            })
            .catch((error) => {
                console.log("error /friendship-status", error);
            });
    }, [otherUser_id]);

    function onClick(event) {
        event.preventDefault();
        fetch("/api/friendship-action", {
            method: "POST",
            body: JSON.stringify({
                buttonText: buttonText,
                otherUser_id: otherUser_id,
            }),
            headers: { "Content-Type": "application/json" },
        });
    }

    function getStatusSetText(friendStatus, user_id) {
        /*     const buttonText = {
        request: "Add as a Friend",
        cancel: "Cancel friend equest",
        accept: "Accept friend equest",
        delete: "Delete friendship",
    }; */
        if (friendStatus.length === 0) {
            setButtonText("Add as a Friend!");
        } else if(){

        }
    }

    return (
        <button name={buttonText} className="friendButton" onClick={onClick}>
            {buttonText}
        </button>
    );
}
