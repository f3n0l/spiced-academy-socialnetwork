import { Component } from "react";

export default class BioEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bioChange: false,
            draftBio: "",
            showTextArea: false,
            /*    hasBio: false, */
        };
        this.handleClick = this.handleClick.bind(this);
        this.handleBioChange = this.handleBioChange.bind(this);
        this.updateBio = this.updateBio.bind(this);
        this.cancelEdit = this.cancelEdit.bind(this);
        /*         this.clickClearContents = this.clickClearContents.bind(this); */
    }

    handleClick() {
        this.setState({
            showTextArea: true,
        });
    }

    cancelEdit(event) {
        this.setState({
            showTextArea: false,
            draftBio: event.target.value,
        });
    }

    handleBioChange(event) {
        this.bioChange = true;
        this.setState({ draftBio: event.target.value });
    }
    /* 
    clickClearContents() {
        this.setState({
      
        });
    } */

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
                this.props.changeBio(data.bio);
            })
            .catch((error) => console.log("bio update", error));

        this.setState({
            showTextArea: false,
        });
    }

    render() {
        if (!this.props.user.bio) {
            return (
                <div className="bioeditor">
                    {!this.props.user.bio && (
                        <button onClick={this.handleClick}>Add Bio</button>
                    )}
                    {this.state.showTextArea && (
                        <form className="bioeditortext">
                            <textarea
                                /*        onClick={this.clickClearContents} */
                                onInput={this.handleBioChange}
                                placeholder="About you..."
                            ></textarea>
                            <button onClick={this.updateBio}>Save Bio</button>
                            <button onClick={this.cancelEdit}>Cancel</button>
                        </form>
                    )}
                </div>
            );
        }
        return (
            <div className="bioeditor">
                <p>{this.props.user.bio}</p>
                <button onClick={this.handleClick}>Edit Bio</button>
                {this.state.showTextArea && (
                    <form className="bioeditortext">
                        <textarea
                            onInput={this.handleBioChange}
                            defaultValue={this.props.user.bio}
                        ></textarea>
                        <button onClick={this.updateBio}>Save Bio</button>
                        <button onClick={this.cancelEdit}>Cancel</button>
                    </form>
                )}
            </div>
        );
    }
}
