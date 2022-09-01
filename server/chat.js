const {
    getRecentChatMessages,
    saveChatMessage,
    getUserById,
    getUsersByIds,
} = require("./db");

module.exports = function initChat(io) {
    let onlineUsers = [];

    io.on("connection", async (socket) => {
        console.log("[social:socket] incoming socked connection", socket.id);
        const { user_id } = socket.request.session;
        if (!user_id) {
            return socket.disconnect(true);
        }
        onlineUsers[socket.id] = user_id;
        console.log(onlineUsers);
        let usersArray = Object.values(onlineUsers);
        let onlinePeople = await getUsersByIds(usersArray);
        console.log("this is ", onlinePeople);
        socket.emit("userJoined", onlinePeople);

        const latestMessages = await getRecentChatMessages();

        socket.emit("recentMessages", latestMessages);

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
        socket.on("disconnect", async () => {
            delete onlineUsers[user_id];
            console.log("disconnetc", onlineUsers);
        });
    });
};
