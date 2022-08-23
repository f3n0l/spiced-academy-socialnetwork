import RegisterForm from "./register";
import LoginForm from "./login";
import ResetPassword from "./reset";

import { BrowserRouter, Route, Link } from "react-router-dom";

export default function Welcome() {
    return (
        <div className="welcome" id="welcome">
            <img src="./banner.PNG"></img>
            <h1>Very network</h1>

            <BrowserRouter>
                <Route exact path="/">
                    <div className="register">
                        <RegisterForm />
                    </div>
                </Route>

                <Route path="/login">
                    <div className="login">
                        <LoginForm />
                        <Link to="/reset">Reset Password</Link>
                    </div>
                </Route>

                <Route path="/reset">
                    <div className="reset">
                        <ResetPassword />
                    </div>
                </Route>
            </BrowserRouter>
        </div>
    );
}
