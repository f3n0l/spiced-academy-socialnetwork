const { getRecentChatMessages, saveChatMessage, getUserById } = require("./db");

module.exports = function initChat(io) {
    io.on("connection", async (socket) => {
        console.log("[social:socket] incoming socked connection", socket.id);
        const { user_id } = socket.request.session;
        if (!user_id) {
            return socket.disconnect(true);
        }

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
    });
};
