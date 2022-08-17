const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const { SESSION_SECRET } = require("./secrets.json");
const cookieSession = require("cookie-session");

const { getUserById, createUser } = require("./db");

//////////////////////////

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

//////////////////////////

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
            if (error.constraint === "users_email_key") {
                response.status(400).json({ error: "E-Mail already used" });
                return;
            }
            response.status(500).json({ error: "Something went wrong" });
        });
});

//////////////////////////

app.get("*", (request, response) => {
    response.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(process.env.PORT || 3001, () => {
    console.log("I'm listening.");
});
