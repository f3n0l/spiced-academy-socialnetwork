const bcrypt = require("bcryptjs");
const DATABASE_NAME = "social-network";
const { DATABASE_USER, DATABASE_PASSWORD } = require("./secrets.json");
const spicedPg = require("spiced-pg");

const db = spicedPg(
    `postgres:${DATABASE_USER}:${DATABASE_PASSWORD}@localhost:5432/${DATABASE_NAME}`
);

const hash = (password) =>
    bcrypt.genSalt().then((salt) => bcrypt.hash(password, salt));

/////////////////////// REGISTER

function createUser({ first_name, last_name, email, password }) {
    return hash(password).then((password_hash) => {
        return db
            .query(
                `INSERT INTO users (first_name, last_name, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING *`,
                [first_name, last_name, email, password_hash]
            )
            .then((result) => result.rows[0]);
    });
}

function getUserById(id) {
    return db
        .query("SELECT * FROM users WHERE id = $1", [id])
        .then((result) => result.rows[0]);
}

/////////////////////// LOGIN

function login({ email, password }) {
    return getUserByEmail(email).then((foundUser) => {
        if (!foundUser) {
            console.log("Email not found");
            return null;
        }
        return bcrypt
            .compare(password, foundUser.password_hash)
            .then((match) => {
                if (match) {
                    return foundUser;
                }
                return null;
            });
    });
}

function getUserByEmail(email) {
    return db
        .query("SELECT * FROM users WHERE email = $1", [email])
        .then((result) => result.rows[0]);
}

//////////////////////////// RESET PASSWORD

const cryptoRandomString = require("crypto-random-string");

function createCode({ email }) {
    return getUserByEmail(email).then((foundUser) => {
        if (!foundUser) {
            console.log("email not found!");
            return null;
        }
        const code = cryptoRandomString({
            length: 6,
        });

        return db
            .query(
                `INSERT INTO reset_codes (email, code) VALUES ($1, $2)  RETURNING *`,
                [email, code]
            )
            .then((result) => result.rows[0]);
    });
}

function getCodeByEmailAndCode({ email, code }) {
    return db
        .query(
            `SELECT * FROM reset_codes
            WHERE CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes'
            AND email = $1 AND code = $2;`,
            [email, code]
        )
        .then((result) => result.rows[0]);
}

function updatePassword(password, email) {
    return hash(password).then((password_hash) => {
        return db
            .query(
                `UPDATE users
                 SET password_hash = $1 WHERE email= $2
                 RETURNING *`,
                [password_hash, email]
            )
            .then((result) => result.rows[0]);
    });
}

//////////////////////////// UPDATE PROFILE PICTURE

async function updateUserProfilePicture({ user_id, profile_picture_url }) {
    const result = await db.query(
        `
    UPDATE users SET profile_picture_url = $1 WHERE id = $2 RETURNING profile_picture_url`,
        [profile_picture_url, user_id]
    );
    return result.rows[0];
}

//////////////////////////// EDIT BIO

async function editBio(userBio, user_id) {
    const result = await db.query(
        `
    UPDATE users SET bio = $1 WHERE id = $2 RETURNING bio`,
        [userBio, user_id]
    );

    return result.rows[0];
}

//////////////////////////// searchusers/recent

async function getRecentUsers({ limit = 3 }) {
    const result = await db.query(
        `
        SELECT * FROM users
        ORDER BY id DESC
        LIMIT $1
    `,
        [limit]
    );
    return result.rows;
}

async function searchUsers({ q, limit = 10 }) {
    const result = await db.query(
        `SELECT * FROM users WHERE first_name ILIKE $1
        OR last_name ILIKE $1
        ORDER BY first_name ASC LIMIT $2`,
        [q + "%", limit]
    );
    return result.rows;
}

//////////////////////////// friend requests

async function getFriendStatus(user_id, otherUser_id) {
    const result = await db.query(
        `SELECT * FROM friendships
        WHERE (recipient_id = $1 AND sender_id = $2)
        OR (recipient_id = $2 AND sender_id = $1)`,
        [user_id, otherUser_id]
    );
    return result.rows[0];
}

async function makeFriendRequest(user_id, otherUser_id) {
    const result = await db.query(
        `INSERT INTO friendships (sender_id, recipient_id)
        VALUES ($1, $2)
        RETURNING sender_id, recipient_id, accepted`,
        [user_id, otherUser_id]
    );
    return result.rows[0];
}

async function acceptFriendRequest(user_id, otherUser_id) {
    const result = await db.query(
        `UPDATE friendships
        SET accepted = 'true' 
        WHERE (recipient_id = $1 AND sender_id = $2) 
        OR (recipient_id = $2 AND sender_id = $1)`,
        [user_id, otherUser_id]
    );
    return result.rows[0];
}

async function cancelFriendRequest(user_id, otherUser_id) {
    const result = await db.query(
        `DELETE FROM friendships 
        WHERE (recipient_id = $1 AND sender_id = $2) 
        OR (recipient_id = $2 AND sender_id = $1)`,
        [user_id, otherUser_id]
    );
    return result.rows[0];
}

//////////////////////////// Request List

async function getFriendships(user_id) {
    const result = await db.query(
        `
        SELECT friendships.accepted,
        friendships.sender_id,
        friendships.recipient_id,
        friendships.id AS friendship_id,
        users.first_name, users.last_name, users.profile_picture_url
        , users.id AS user_id
        FROM friendships
        JOIN users
        ON (
        users.id = friendships.sender_id
        AND friendships.recipient_id = $1)
        OR (
        users.id = friendships.recipient_id
        AND friendships.sender_id = $1
        AND accepted = true)
        `,
        [user_id]
    );
    return result.rows;
}

//////////////////////////// Chat

async function getRecentChatMessages(limit = 10) {
    const result = await db.query(
        `SELECT users.first_name, users.last_name, users.profile_picture_url, 
        chat_messages.message, chat_messages.created_at, chat_messages.id
        FROM users
        JOIN chat_messages
        ON chat_messages.sender_id = users.id
        ORDER BY chat_messages.id DESC
        LIMIT $1`,
        [limit]
    );

    return result.rows;
}
async function saveChatMessage({ sender_id, message }) {
    const result = await db.query(
        `INSERT INTO chat_messages (sender_id, message)
        VALUES ($1, $2)        
        RETURNING *`,
        [sender_id, message]
    );
    return result.rows[0];
}

//////////////////////////// delete account

async function deleteAccount(user_id) {
    const result = await db.query(
        `
    DELETE FROM users WHERE id = $1 RETURNING *`,
        [user_id]
    );
    return result.rows[0];
}
async function deleteFriendships(user_id) {
    const result = await db.query(
        `
    DELETE from friendships
    WHERE recipient_id = $1 OR sender_id = $1 RETURNING *
    `,
        [user_id]
    );
    return result.rows;
}
async function deleteAccountChat(user_id) {
    const result = await db.query(
        ` DELETE
        FROM chat_messages
        WHERE sender_id = $1 RETURNING * `,
        [user_id]
    );
    return result.rows;
}

//////////////////////////// online users

async function getUsersByIds(user_id) {
    const result = await db.query(`SELECT * FROM users WHERE id = ANY($1)`, [
        user_id,
    ]);
    return result.rows;
}

////////////////////////////

module.exports = {
    createUser,
    getUserById,
    login,
    getUserByEmail,
    createCode,
    getCodeByEmailAndCode,
    updatePassword,
    updateUserProfilePicture,
    editBio,
    searchUsers,
    getRecentUsers,
    getFriendStatus,
    makeFriendRequest,
    cancelFriendRequest,
    acceptFriendRequest,
    getFriendships,
    getRecentChatMessages,
    saveChatMessage,
    deleteAccount,
    deleteAccountChat,
    deleteFriendships,
    getUsersByIds,
};
