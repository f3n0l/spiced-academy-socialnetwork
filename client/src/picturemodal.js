import ProfilePicture from "./profilepicture";

export default function PictureModal({ closeClick, onUpload }) {
    function onSubmit(event) {
        event.preventDefault();
        fetch("/api/users/profile", {
            method: "POST",
            body: new FormData(event.target),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    alert("Error uploading avatar!");
                    return;
                }

                onUpload(data.profile_picture_url);
            });
    }

    return (
        <div className="modal">
            <ProfilePicture />
            <p>Change Profile Picture?</p>
            <form onSubmit={onSubmit}>
                <input
                    name="file"
                    type="file"
                    accept="image/*"
                    required
                ></input>
                <button>Submit</button>
            </form>
            <p>
                <button onClick={closeClick}>Close</button>
            </p>
        </div>
    );
}
