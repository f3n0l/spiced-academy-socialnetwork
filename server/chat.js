const {
    getRecentChatMessages,
    saveChatMessage,
    getUserById,
    getUsersByIds,
    /*  makeFriendRequest, */
} = require("./db");

module.exports = function initChat(io) {
    let onlineUsers = {};

    io.on("connection", async (socket) => {
        /*   console.log("[social:socket] incoming socked connection", socket.id); */
        const { user_id } = socket.request.session;
        if (!user_id) {
            return socket.disconnect(true);
        }

        onlineUsers[socket.id] = user_id;

        let usersArray = Object.values(onlineUsers);
        let onlinePeople = await getUsersByIds(usersArray);

        io.emit("userJoined", onlinePeople);

        socket.on("disconnect", async () => {
            delete onlineUsers[socket.id];

            let usersArray = Object.values(onlineUsers);
            let onlinePeople = await getUsersByIds(usersArray);
            io.emit("userJoined", onlinePeople);
        });

        const latestMessages = await getRecentChatMessages();
        socket.emit("recentMessages", latestMessages.reverse());

        socket.on("sendMessage", async (text) => {
            const newMessage = await saveChatMessage({
                message: text,
                sender_id: user_id,
            });
            const user = await getUserById(user_id);
            io.emit("broadcastMessage", {
                ...newMessage,
                ...user,
                message_id: newMessage.id,
            });
        });

        /*   socket.on("friendRequest", async (friendships) => {
            const newFriend = await makeFriendRequest({
                user: user_id,
                otherUser: otherUser_id,
            });
            console.log("iwjadjd", friendships);
            io.emit("newFriendRequest", {
                from: friendships.sender_id,
                to: friendships.otherUser_id,
            });
        }); */
    });
};
