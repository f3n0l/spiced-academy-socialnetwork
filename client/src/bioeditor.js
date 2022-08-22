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
        this.cancelEdit = this.cancelEdit(this);
    }

    handleClick() {
        this.setState({
            /* showTextArea: !this.state.showTextArea, */ // test
            showTextArea: true,
        });
    }

    cancelEdit() {
        this.setState({
            showTextArea: false,
        });
    }

    handleBioChange(event) {
        this.bioChange = true;
        this.setState({ draftBio: event.target.value });
        console.log("handlebiochange");
    }

    updateBio(event) {
        event.preventDefault();
        fetch("/api/bio", {
            //async??
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
        if (!this.props.bio) {
            return (
                <div className="bioeditor">
                    {!this.props.user.bio && (
                        <button onClick={this.handleClick}>Add Bio</button>
                    )}
                    {this.state.showTextArea && (
                        <form className="bioeditortext">
                            <textarea></textarea>
                            <button onClick={this.updateBio}></button>
                            <button onClick={this.cancelEdit}>Cancel</button>
                        </form>
                    )}
                </div>
            );
        }
        <div className="bioeditor">
            <p>{this.props.bio}</p>
            <button onClick={this.handleClick}>Edit Bio</button>
            {this.state.showTextArea && (
                <form className="bioeditortext">
                    <textarea></textarea>
                    <button onClick={this.updateBio}></button>
                    <button onClick={this.cancelEdit}>Cancel</button>
                </form>
            )}
        </div>;
    }
}
///////////////////////////
/*  <>
                {this.state.showTextArea && (
                    <textarea defaultValue={this.props.bio}></textarea>
                )}
                {!this.state.showTextArea && <p>{this.props.bio}</p>}

                <button onClick={this.handleClick}>Edit Bio</button>
            </> */
