export default function DeleteAccount({ user_id }) {
    function onClick(event) {
        event.preventDefault();
        const check = prompt("Write DELETE to confirm!");
        if (check !== "DELETE") {
            alert("Wrong word!");
            return;
        } else if (
            !confirm("Are you sure? Your Account will be GONE for GOOD!")
        ) {
            return;
        }

        fetch("/deleteaccount", {
            method: "POST",
            body: JSON.stringify({
                user_id: user_id,
            }),
            headers: { "Content-Type": "application/json" },
        })
            .then((response) => response.json())
            .then((data) => {
                window.location = "/";

                console.log(data);
            })
            .catch((error) => {
                console.log("error /deleteaccount", error);
            });
    }

    return (
        <div className="deleteaccount">
            <button className="deleteAccountButton" onClick={onClick}>
                Delete Account
            </button>
        </div>
    );
}
