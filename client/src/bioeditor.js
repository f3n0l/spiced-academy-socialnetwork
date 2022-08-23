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
    }

    handleClick() {
        this.setState({
            showTextArea: true,
        });
    }

    cancelEdit(event) {
        console.log("ijawdj");
        this.setState({
            showTextArea: false,
            draftBio: event.target.value,
        });
    }

    handleBioChange(event) {
        this.bioChange = true;
        this.setState({ draftBio: event.target.value });
        console.log("handlebiochange");
    }

    updateBio(event) {
        event.preventDefault();
        console.log("updatebio", this.state.draftBio);
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
                console.log("haha", data.bio);
            })
            .catch((error) => console.log("bio update", error));

        this.setState({
            showTextArea: false,
        });
    }

    render() {
        console.log("label:", this.props);
        if (!this.props.user.bio) {
            return (
                <div className="bioeditor">
                    {!this.props.user.bio && (
                        <button onClick={this.handleClick}>Add Bio</button>
                    )}
                    {this.state.showTextArea && (
                        <form className="bioeditortext">
                            <textarea></textarea>
                            {/*      <button onClick={this.updateBio}></button> */}
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
    ///////////////////////////
    /*  <>
                {this.state.showTextArea && (
                    <textarea defaultValue={this.props.bio}></textarea>
                )}
                {!this.state.showTextArea && <p>{this.props.bio}</p>}

                <button onClick={this.handleClick}>Edit Bio</button>
                </>*/
}
