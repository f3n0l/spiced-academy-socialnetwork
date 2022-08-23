import BioEditor from "./bioeditor";
import ProfilePicture from "./profilepicture";

export default function Profile(props) {
    console.log(props);
    // console.log("isLightOn: ", isLightOn);
    // console.log("toggleLight: ", toggleLight);
    return (
        <section className="profileRoom">
            <h3>Profile of:</h3>
            <div>
                {/*    <p>{this.state.user.first_name}</p>
                <p>{this.state.user.last_name}</p> */}
                <BioEditor />
            </div>
        </section>
    );
}
/*     <ProfilePicture /* user={props.user} */ /> */;
