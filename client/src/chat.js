const {
    getRecentChatMessages,
    saveChatMessage,
    getUserById,
} = require("./db)");

module.exports = function initChat(io) {
    io.on("connection", async (socket) => {
        console.log("[social:socket] incoming socked connection", socket.id);
        const { user_id } = socket.request.session;
        if (!user_id) {
            return socket.disconnect(true);
        }

        // retrieve the latest 10 messages
        const latestMessages = await getRecentChatMessages();
        // and send them when a client connects
        socket.emit("recentMessages", latestMessages);

        // listen for when the connected user send a message
        socket.on("sendMessage", async (text) => {
            // store the message in the db
            const newMessage = await saveChatMessage({
                message: text,
                sender_id: user_id,
            });
            const user = await getUserById(user_id);

            io.emit("newMessage", {
                ...newMessage,
                ...user,
                message_id: newMessage.id,
            });
            // then broadcast the message to all connected users (included the sender!)
            // hint: you need the sender info (name, picture...) as well
            // how can you retrieve it?
        });
    });
};
