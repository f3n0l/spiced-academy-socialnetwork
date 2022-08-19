import { Component } from "react";

export default class ResetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 1,
            error: "",
        };
        /*         this.plusStep = this.plusStep.bind(this); */
        this.checkStep = this.checkStep.bind(this);
        this.handleEmailSubmit = this.handleEmailSubmit.bind(this);
        this.handleCodeSubmit = this.handleCodeSubmit.bind(this);
    }

    /*     plusStep() {
        const newStep = Math.min(this.state.step + 1, 3);
        this.setState({ step: newStep });
    } */

    checkStep() {
        const { step } = this.state;
        if (step === 1) {
            return (
                <div>
                    Send Reset Code
                    <form onSubmit={this.handleEmailSubmit}>
                        <input type="email" name="email" placeholder="Email" />
                        <button>Submit</button>
                    </form>
                </div>
            );
        } else if (step === 2) {
            return (
                <div>
                    Enter Reset Code
                    <form onSubmit={this.handleCodeSubmit}>
                        <input type="text" name="code" placeholder="Code" />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                        />
                        <button>Submit</button>
                    </form>
                </div>
            );
        } else if (step === 3) {
            return <div>Success</div>;
        }
    }
    ///fetch
    handleEmailSubmit(event) {
        event.preventDefault();
        console.log(this.state);

        fetch("/password/reset/start", {
            method: "POST",
            body: JSON.stringify({ email: event.target.email.value }),
            headers: { "Content-Type": "application/json" },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    this.setState({ error: "code/error faulty" });
                    return;
                }
                this.setState({ step: 2 });
            }); //another for code

        //post req
    }
    handleCodeSubmit(event) {
        event.preventDefault();
        this.setState({ step: 3 });
    }

    render() {
        return (
            <div>
                <h2> Reset Password</h2>
                {this.checkStep()}
                {this.state.error && <p>{this.state.error}</p>}
            </div>
        );
    }
}
