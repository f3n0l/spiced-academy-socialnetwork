const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const { SESSION_SECRET } = require("./secrets.json");
const cookieSession = require("cookie-session");

const { getUserById, createUser, login } = require("./db");

////////////////////////// MIDDLEWARE

app.use(compression());
app.use(express.static(path.join(__dirname, "..", "client", "public")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
    cookieSession({
        secret: SESSION_SECRET,
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);

////////////////////////// REGISTER

app.get("/api/users/me", (request, response) => {
    if (!request.session.user_id) {
        response.json(null);
        return;
    }
    getUserById(request.session.user_id).then((user) => {
        response.json(user);
    });
});

app.post("/api/users", (request, response) => {
    console.log("post /reg", request.body);
    createUser(request.body)
        .then((newUser) => {
            console.log("newuser", newUser);
            request.session.user_id = newUser.id;
            response.json(newUser);
        })
        .catch((error) => {
            console.log("post /api/users", error);
            if (error.constraint === "email") {
                response.status(400).json({ error: "E-Mail already used" });
                return;
            }
            response.status(500).json({ error: "Something went wrong" });
        });
});

////////////////////////// LOGIN

app.post("/api/login", (request, response) => {
    console.log("login", request.body);
    login(request.body)
        .then((foundUser) => {
            if (!foundUser) {
                response.status(401).json({ error: "Wrong credentials!" });
                return;
            }
            request.session.user_id = foundUser.id;

            response.json(foundUser);
        })
        .catch((error) => {
            console.log("POST /API/LOGIN", error);
            response.status(500).json({ error: "something went wrong" });
        });
});

app.get("/logout", (request, response) => {
    request.session = null;
    response.json({ message: "ok" });
});

//////////////////////////// RESET PASSWORD

app.post("/password/reset/start", (request, response) => {
    //check email //if + create code + send to email +++ log code in console
});

app.post("/password/reset/verify", (request, response) => {
    //getuserbyemail  //check if code exists // if valid + timer not expired  -> reset password
    //error + message ok
});

//////////////////////////

app.get("*", (request, response) => {
    response.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(process.env.PORT || 3001, () => {
    console.log("I'm listening.");
});
