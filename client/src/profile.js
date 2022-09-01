import BioEditor from "./bioeditor";
import ProfilePicture from "./profilepicture";
import DeleteAccount from "./deleteaccount";

export default function Profile(props) {
    return (
        <section className="profileRoom">
            <h3>
                Profile of: {props.user.first_name} {props.user.last_name}
            </h3>
            <ProfilePicture
                profile_picture_url={props.user.profile_picture_url}
            />
            <div>
                <BioEditor changeBio={props.changeBio} user={props.user} />
                <DeleteAccount />
            </div>
        </section>
    );
}
