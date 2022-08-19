/* export default function ProfilePictureUploader({ clickUpload, clickClose }) {
    async function onSubmit(event) {
        event.preventDefault();
        const response = await fetch("/api/users/profile", {
            method: "POST",
            body: new FormData(event.target),
        });
    }
}
 */

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
                // call onUpload with the right information from data
            });
    }

    return (
        <div className="modal">
            <p>
                <button onClick={closeClick}>Close</button>
            </p>
            <form onSubmit={onSubmit}>
                <input
                    name="file"
                    type="file"
                    accept="image/*"
                    required
                ></input>
                <button>Submit</button>
            </form>
        </div>
    );
}
