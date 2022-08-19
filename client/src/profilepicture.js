export default function ProfilePicture({ profile_picture_url }) {
    return (
        <img
            className="profile-picture"
            src={profile_picture_url}
            alt="user profile picture"
        />
    );
}
