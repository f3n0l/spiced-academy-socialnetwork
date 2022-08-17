import { Component } from "react";

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
            headers: {},
        })
            .then((response) => response.json)
            .then((data) => {
                if (data.error) {
                    console.log("/post", data.error);
                    return;
                } else {
                    window.location.href = "/";
                }
            });
    }
    render() {
        return (
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
                    placeholder="First Name"
                    required
                />
                <input name="email" type="email" placeholder="Email" required />
                <input
                    name="password"
                    type="password"
                    required
                    placeholder="Password"
                />
                {this.state.error && <p>{this.state.error}</p>}
                <button>Register</button>
            </form>
        );
    }
}
