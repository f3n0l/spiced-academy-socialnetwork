import BioEditor from "./bioeditor";
import ProfilePicture from "./profilepicture";

export default function Profile(props) {
    console.log(props);
    // console.log("isLightOn: ", isLightOn);
    // console.log("toggleLight: ", toggleLight);
    return (
        <section className="profileRoom">
            <h3>
                Profile of: {props.user.first_name} {props.user.last_name}
            </h3>
            <div>
                <BioEditor changeBio={props.changeBio} user={props.user} />
            </div>
        </section>
    );
}
