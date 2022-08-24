export default function ProfilePicture({ profile_picture_url }) {
    return (
        <img
            className="profile-picture"
            src={profile_picture_url || "./defaultpic.png"}
            alt="user profile picture"
        />
    );
}
