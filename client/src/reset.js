import { Component } from "react";
/* import { Link } from "react-router-dom"; */

export default class ResetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 1,
            error: "",
            email: "",
        };
        this.checkStep = this.checkStep.bind(this);
        this.handleEmailSubmit = this.handleEmailSubmit.bind(this);
        this.handleCodeSubmit = this.handleCodeSubmit.bind(this);
    }

    checkStep() {
        const { step } = this.state;
        if (step === 1) {
            return (
                <div>
                    Send Reset Code
                    <form key={step} onSubmit={this.handleEmailSubmit}>
                        <input type="email" name="email" placeholder="Email" />
                        <button>Submit</button>
                    </form>
                </div>
            );
        } else if (step === 2) {
            return (
                <div>
                    Enter Reset Code
                    <form
                        autoComplete="false"
                        key={step}
                        onSubmit={this.handleCodeSubmit}
                    >
                        <input
                            autoComplete="false"
                            type="text"
                            name="code"
                            placeholder="Code"
                        />

                        <input
                            autoComplete="false"
                            type="password"
                            name="password"
                            placeholder="Password"
                        />

                        <button>Submit</button>
                    </form>
                </div>
            );
        } else if (step === 3) {
            return (
                <div>
                    <p>Success</p>
                </div>
            );
        }
    }

    handleEmailSubmit(event) {
        event.preventDefault();
        console.log(this.state);
        this.setState({ email: event.target.email.value });
        fetch("/api/reset/start", {
            method: "POST",
            body: JSON.stringify({ email: event.target.email.value }),
            headers: { "Content-Type": "application/json" },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    this.setState({ error: "Email not found!" });
                    return;
                }
                this.setState({ step: 2 });
            });
    }
    handleCodeSubmit(event) {
        console.log(event.target);
        event.preventDefault();
        const resetData = {
            code: event.target.code.value,
            password: event.target.password.value,
            email: this.state.email,
        };
        fetch("/api/reset/verify", {
            method: "POST",
            body: JSON.stringify(resetData),
            headers: { "Content-Type": "application/json" },
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(resetData);
                if (data.error) {
                    this.setState({ error: "Invalid Code!" });
                    return;
                }
                if (data.id) {
                    this.setState({ step: 3 });
                }
            });
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
