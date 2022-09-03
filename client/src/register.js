import { Component } from "react";
import { Link } from "react-router-dom";

export default class RegisterForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: "",
        };
        this.onFormSubmit = this.onFormSubmit.bind(this);
    }
    onFormSubmit(event) {
        event.preventDefault();
        const formData = {
            first_name: event.target.first_name.value,
            last_name: event.target.last_name.value,
            email: event.target.email.value,
            password: event.target.password.value,
        };

        fetch("/api/users", {
            method: "POST",
            body: JSON.stringify(formData),
            headers: { "Content-Type": "application/json" },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    this.setState({ error: "email already taken" });
                    return;
                } else {
                    window.location.href = "/";
                }
            });
    }
    render() {
        return (
            <div className="register">
                <h2>Join the madness!</h2>
                <form onSubmit={this.onFormSubmit}>
                    <input
                        name="first_name"
                        type="first_name"
                        placeholder="First Name"
                        required
                    />
                    <input
                        name="last_name"
                        type="last_name"
                        placeholder="Last Name"
                        required
                    />
                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        required
                    />
                    <input
                        name="password"
                        type="password"
                        required
                        placeholder="Password"
                    />
                    {this.state.error && <p>{this.state.error}</p>}
                    <button>Register</button>
                </form>
                <Link className="logininstead" to="/login">
                    Click here to Log in!
                </Link>
            </div>
        );
    }
}
