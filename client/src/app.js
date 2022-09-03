import { Component } from "react";
import ProfilePicture from "./profilepicture";
import PictureModal from "./picturemodal";
import Profile from "./profile";
import FindPeople from "./findpeople";
import OtherProfile from "./otherprofile";
import Friends from "./friends";
import Chat from "./chatbox";
import OnlineUsers from "./onlineusers";
import { BrowserRouter, Route, NavLink } from "react-router-dom";
import { connect, disconnect } from "./socket.js";

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
        this.changeBio = this.changeBio.bind(this);
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
        this.setState({
            user: {
                ...this.state.user,
                profile_picture_url: profile_picture_url,
            },
            showModal: false,
        });
    }

    changeBio(userBio) {
        this.setState({
            user: {
                ...this.state.user,
                bio: userBio,
            },
        });
    }

    async componentDidMount() {
        const response = await fetch("/api/users/me");
        const data = await response.json();
        this.setState({
            user: { ...data /*  profile_picture_url: "default" */ },
        });
        connect();
        disconnect();
    }

    render() {
        return (
            <BrowserRouter>
                <section className="app">
                    <header>
                        <div className="header">
                            <NavLink to="/">
                                <img className="headerlogo" src="/banner.PNG" />
                            </NavLink>
                            <div className="headername">
                                <p>the worknet</p>
                            </div>
                            <nav className="nav">
                                <NavLink to="/" className="navlink">
                                    Home
                                </NavLink>
                                <NavLink to="/people" className="navlink">
                                    Search People
                                </NavLink>
                                <NavLink to="/friends" className="navlink">
                                    Friends
                                </NavLink>
                                <NavLink to="/chat" className="navlink">
                                    Chat
                                </NavLink>
                                <NavLink to="/onlineusers" className="navlink">
                                    Now Online
                                </NavLink>
                                <form action="/logout" method="POST">
                                    <button className="logout">Logout</button>
                                </form>
                            </nav>{" "}
                            <div
                                className="profilePictureWrapper"
                                onClick={this.onButtonClick}
                            >
                                <ProfilePicture
                                    profile_picture_url={
                                        this.state.user.profile_picture_url
                                    }
                                />
                            </div>
                            {this.state.showModal && (
                                <PictureModal
                                    onUpload={this.onUpload}
                                    closeClick={this.clickCloseModal}
                                    profile_picture_url={
                                        this.state.user.profile_picture_url
                                    }
                                />
                            )}
                        </div>
                    </header>
                    <section className="homecontainer">
                        <Route path="/" exact>
                            <p>
                                Welcome {this.state.user.first_name}{" "}
                                {this.state.user.last_name}!
                            </p>
                            <div
                                className="profilePictureWrapper"
                                onClick={this.onButtonClick}
                            >
                                <ProfilePicture
                                    profile_picture_url={
                                        this.state.user.profile_picture_url
                                    }
                                />
                            </div>
                            {/*     {this.state.showModal && (
                                <PictureModal
                                    onUpload={this.onUpload}
                                    closeClick={this.clickCloseModal}
                                />
                            )} */}
                            <Profile
                                changeBio={this.changeBio}
                                user={this.state.user}
                            />
                        </Route>
                        <Route path="/users/:user_id">
                            <OtherProfile />
                        </Route>
                        <Route path="/people">
                            <FindPeople />
                        </Route>
                        <Route path="/friends">
                            <Friends />
                        </Route>
                        <Route path="/chat">
                            <Chat />
                        </Route>
                        <Route path="/onlineusers">
                            <OnlineUsers />
                        </Route>
                    </section>

                    <footer> &copy;Yes</footer>
                </section>
            </BrowserRouter>
        );
    }
}
