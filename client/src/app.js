import { Component } from "react";
import ProfilePicture from "./profilepicture";
import PictureModal from "./picturemodal";
import Profile from "./profile";

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {},
            showModal: false,
        };
        this.onButtonClick = this.onButtonClick.bind(this);
        this.clickCloseModal = this.clickCloseModal.bind(this);
        this.onUpload = this.onUpload.bind(this);
    }
    onButtonClick() {
        this.setState({
            showModal: true,
        });
    }
    clickCloseModal() {
        this.setState({
            showModal: false,
        });
    }
    onUpload(profile_picture_url) {
        console.log(profile_picture_url);
    } //update user state

    changeBio(userBio) {
        this.setState({
            ...this.state.user,
            bio: userBio,
        });
    }

    async componentDidMount() {
        const response = await fetch("/api/users/me");
        const data = await response.json();
        this.setState({
            user: { ...data /*  profile_picture_url: "default" */ },
        });
    }

    render() {
        return (
            <div className="app">
                <div className="header">
                    <img className="headerlogo" src="./public/banner.PNG" />
                    <p>Welcome</p>
                </div>
                <p> Welcome {this.state.user.first_name}</p>
                <ProfilePicture
                    onButtonClick={this.onButtonClick}
                    profile_picture_url={this.state.user.profile_picture_url}
                />
                <p>
                    <button onClick={this.onButtonClick}>Modal</button>
                </p>

                {this.state.showModal && (
                    <PictureModal
                        onUpload={this.onUpload}
                        closeClick={this.clickCloseModal}
                    />
                )}
                <Profile changeBio={this.changeBio} user={this.state.user} />
            </div>
        );
    }
}
