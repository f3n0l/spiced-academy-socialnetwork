import { Component } from "react";
import { Link } from "react-router-dom";

export default class LoginForm extends Component {
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
            email: event.target.email.value,
            password: event.target.password.value,
        };

        fetch("/api/login", {
            method: "POST",
            body: JSON.stringify(formData),
            headers: { "Content-Type": "application/json" },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    this.setState({ error: "credentials' faulty" });
                    return;
                } else {
                    window.location.href = "/";
                }
            });
    }
    render() {
        return (
            <div className="backgroundall">
                <div className="login">
                    <img className="welcomebanner" src="./logobig.jpg"></img>
                    <p>Already a Member?</p>
                    <form onSubmit={this.onFormSubmit}>
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
                        <button>Login</button>
                    </form>
                    <Link to="/">Click here to Register!</Link>
                    <Link to="/reset">Reset Password?</Link>
                </div>
            </div>
        );
    }
}
