import { Component } from "react";
/* import { Link } from "react-router-dom"; */

export default class ResetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 1,
            error: "",
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
        console.log(event);
        event.preventDefault();
        const resetData = {
            code: event.target.code.value,
            password: event.target.password.value,
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
