import { Component } from "react";

export default class Switch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bioChange: false,
            draftBio: "",
            showTextArea: false,
            hasBio: false,
        };
        this.handleClick = this.handleClick.bind(this);
        this.handleBioChange = this.handleBioChange(this);
        this.updateBio = this.updateBio(this);
    }

    handleClick() {
        this.setState({
            showTextArea: !this.state.showTextArea,
        });
    }

    handleBioChange(event) {
        this.bioChange = true;
        this.setState({ draftBio: event.target.value });
        console.log("handlebiochange");
    }

    updateBio() {
        fetch("/api/bio", {
            method: "POST",
            body: JSON.stringify({
                bio: this.state.draftBio,
            }),
            headers: { "Content-Type": "application/json" },
        })
            .then((response) => response.json())
            .then((data) => {
                this.props.update(data.bio);
            })
            .catch((error) => console.log("bio update", error));

        this.setState({
            showTextArea: false,
        });
    }

    render() {
        return (
            <>
                {this.state.showTextArea && (
                    <textarea defaultValue={this.props.bio}></textarea>
                )}
                {!this.state.showTextArea && <p>{this.props.bio}</p>}

                <button onClick={this.handleClick}>Edit Bio</button>
            </>
        );
    }
}
