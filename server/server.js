const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const { SESSION_SECRET } = require("./secrets.json");
const cookieSession = require("cookie-session");
const socketConnect = require("socket.io");
const { Server } = require("http");
const server = Server(app);
const { Bucket, s3Upload } = require("./s3");
const { uploader } = require("./uploader");
const { initChat } = require("./chat");
/* const helmet = require("helmet"); */

const {
    getUserById,
    createUser,
    login,
    createCode,
    updatePassword,
    getCodeByEmailAndCode,
    updateUserProfilePicture,
    editBio,
    getRecentUsers,
    searchUsers,
    getFriendStatus,
    makeFriendRequest,
    cancelFriendRequest,
    acceptFriendRequest,
    getFriendships,
    /*     getRecentChatMessages,
    saveChatMessage, */
} = require("./db");

////////////////////////// MIDDLEWARE

app.use(compression());
app.use(express.static(path.join(__dirname, "..", "client", "public")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieSessionMiddleware);

const cookieSessionMiddleware = cookieSession({
    secret: SESSION_SECRET,
    maxAge: 1000 * 60 * 60 * 24 * 14,
});

/* app.use(helmet()); */
////////////////////////// REGISTER

app.get("/api/users/me", (request, response) => {
    if (!request.session.user_id) {
        response.json(null);
        return;
    }
    getUserById(request.session.user_id).then((user) => {
        console.log("wadawdjawd", user);
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

app.post("/logout", (request, response) => {
    request.session = null;
    response.redirect("/");
});

//////////////////////////// RESET PASSWORD

app.post("/api/reset/start", (request, response) => {
    createCode(request.body)
        .then((code) => {
            console.log("something before", code);
            if (!code) {
                response.status(401).json({ error: "Email not found!" });
                return;
            }
            response.json({ message: "ok" });
        })
        .catch((error) => {
            console.log("POST /reset/start", error);
            response.status(500).json({ error: "something went wrong" });
        });
});

app.post("/api/reset/verify", (request, response) => {
    /*   getUserById(request.session.user_id).then((user) => {
        console.log("useruser", user);
    });
 */

    getCodeByEmailAndCode(request.body) //request.session.currentEmail
        .then((foundCode) => {
            console.log("in the server", foundCode, request.body.code);
            if (!foundCode) {
                response.status(401).json({ error: "Email/Code incorrect!" });
                return;
            }

            if (request.body.code !== foundCode.code) {
                response.status(401).json({ error: "incorrect code" });
            }
            console.log("herehere", request.body.password);
            updatePassword(request.body.password, foundCode.email).then(() => {
                response.json({ message: "ok" });
            }); //crap ////
        })

        .catch((error) => {
            console.log("POST /reset/verify", error);
            response.status(500).json({ error: "something went wrong" });
        });
});

////////////////////////// UPDATE PROFILE PICTURE

app.post(
    "/api/users/profile",
    uploader.single("file"),
    s3Upload,
    (request, response) => {
        const url = `https://s3.amazonaws.com/${Bucket}/${request.file.filename}`;
        console.log("POST /upload", url);

        updateUserProfilePicture({
            user_id: request.session.user_id,
            profile_picture_url: url,
        })
            .then((user) => {
                response.json(user);
            })
            .catch((error) => {
                console.log("POST /upload", error);
                response.status(500).json({ message: "error uploading image" });
            });
    }
);

////////////////////////// BIO UPDATE

app.post("/api/bio", (request, response) => {
    const user_id = request.session.user_id;
    console.log("hahahahahaah", request.body);
    editBio(request.body.bio, user_id)
        .then((userBio) => {
            response.json(userBio);
        })
        .catch((error) => {
            console.log("POST /editBio", error);
            response.statusCode(500).json({ message: "error editing bio" });
        });
});

////////////////////////// friendslist

app.get("/api/users/recent", async (request, response) => {
    const recentUsers = await getRecentUsers(request.query);
    response.json(recentUsers);

    /*     .filter() */
});

app.get("/api/users/search", async (request, response) => {
    const searchResults = await searchUsers(request.query);
    response.json(
        searchResults.filter((user) => user.id !== request.session.user_id)
    );
});

////////////////////////// OTHER PROFILES

app.get("/api/users/:user_id", async (request, response) => {
    if (request.params.user_id == request.session.user_id) {
        response.status(400).json({ error: "This is you!" });
        return;
    }
    const otherUser = await getUserById(request.params.user_id);
    response.json(otherUser || null);
});

////////////////////////// Friend Requests

app.get("/api/friendship-status/:otherUser_id", async (request, response) => {
    try {
        const friendStatus = await getFriendStatus(
            request.params.otherUser_id,
            request.session.user_id
        );
        if (!friendStatus) {
            response.json("Add as a Friend");
            return;
        }
        if (friendStatus.accepted) {
            response.json("Delete friendship");
            return;
        }
        if (friendStatus.sender_id == request.session.user_id) {
            response.json("Cancel friend request");
            return;
        }
        if (friendStatus.recipient_id == request.session.user_id) {
            response.json("Accept friend request");
            return;
        }
        /*  response.json(friendStatus); */
    } catch (error) {
        console.log("GET / friendstatus", error);
        response.status(500).json({ message: "couldn't get friend status" });
    }
});

app.post("/api/friendship-action", async (request, response) => {
    const { buttonText, otherUser_id } = request.body;
    console.log("we need to be here", buttonText);
    if (buttonText === "Add as a Friend") {
        console.log("and also here", otherUser_id);
        console.log("blabla", request.session.user_id);
        try {
            const result = await makeFriendRequest(
                request.session.user_id,
                otherUser_id
            );
            response.json("Cancel friend request");
            console.log(result);
        } catch (error) {
            console.log("friend request error", error);
            response.json({ message: "couldn't make friend request" });
        }
    } else if (
        buttonText === "Cancel friend request" ||
        buttonText === "Delete friendship"
    ) {
        try {
            await cancelFriendRequest(request.session.user_id, otherUser_id);
            response.json("Add as a Friend");
        } catch (error) {
            console.log("friend request cancel error", error);
            response.json({ message: "couldn't cancel friend request" });
        }
    } else if (buttonText === "Accept friend request") {
        try {
            await acceptFriendRequest(request.session.user_id, otherUser_id);
            response.json("Delete friendship");
        } catch (error) {
            console.log("friend request accept error", error);
            response.json({ message: "couldn't accept friend request" });
        }
    }
});

////////////////////////// Friends List

app.get("/api/friendships", async (request, response) => {
    try {
        const friendlist = await getFriendships(request.session.user_id);
        response.json(friendlist);
    } catch (error) {
        console.log("error getting friendlist", error);
        response.status(500).json({ message: "couldn't list friendrequests" });
    }
});

////////////////////////// Chat

const io = socketConnect(server, {
    allowRequest: (request, callback) =>
        callback(
            null,
            request.headers.referer.startsWith(`http://localhost:3000`)
        ),
});

io.use((socket, next) => {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

initChat(io);

//////////////////////////

app.get("*", (request, response) => {
    response.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

server.listen(process.env.PORT || 3001, () => {
    console.log("I'm listening.");
});
