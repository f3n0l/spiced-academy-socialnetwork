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
    console.log(email, password);
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

// const cryptoRandomString = require("crypto-random-string");
// const secretCode = cryptoRandomString({
//     length: 6,
// });

// function createCode(email, secretCode) {
//     return getUserByEmail(email).then((foundUser) => {
//         if (!foundUser) {
//             console.log("email not found!");
//             return null;
//         }
//         return something.then((email, code, created_at) => {
//             return db
//                 .query(
//                     `INSERT INTO reset_codes (email, code, created_at) VALUES ($1, $2, $3) RETURNING *`,
//                     [email, code, created_at]
//                 )
//                 .then((result) => result.rows[0]);
//         });
//     });
// }

// function checkCodeTable() {
//     return db.query(`SELECT * FROM reset_codes
// WHERE CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes';`);
// }

// function updatePassword() {
//     return hash(password).then((password_hash) => {
//         return db
//             .query(
//                 `INSERT INTO users (password_hash) VALUES ($1) RETURNING *`,
//                 [password_hash]
//             )
//             .then((result) => result.rows[0]);
//     });
// }

////////////////////////////

module.exports = {
    createUser,
    getUserById,
    login,
    getUserByEmail,
    // createCode,
    // checkCodeTable,
    // updatePassword,
};
