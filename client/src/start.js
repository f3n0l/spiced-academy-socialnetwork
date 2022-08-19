import ReactDOM from "react-dom";
import Welcome from "./welcome";
import App from "./app";

fetch("/api/users/me")
    .then((response) => response.json())
    .then((user) => {
        if (!user) {
            ReactDOM.render(<Welcome />, document.querySelector("main"));
        } else {
            ReactDOM.render(<App />, document.querySelector("main"));
        }
    });

/* function HelloWorld() {
    return (
        <div>
            <img src="./banner.PNG"></img>
            <p>Hello, World!</p>
            <a href="/logout">Log Out</a>
        </div>
    );
} */
