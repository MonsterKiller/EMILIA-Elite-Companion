const journalData = require("./journalDataStore.js");

// Store websocket handle
var socketIoHandle = null;

// Allow broacasts to be silenced/stopped
// Does this at the start while we are loading journals
var silenced = true;

// Initialise module
function init(socketHandle) {
    socketIoHandle = socketHandle;
}

// Listen for client connection
function hookClientConnect(journalDataHandle) {
    socketIoHandle.on("connection", function(socket) {
        console.log("SocketIO -> User connected");
    
        // broadcast all events
        const allJournalData = journalDataHandle.getAll();
        for (let dataKey in allJournalData) {
            if (allJournalData.hasOwnProperty(dataKey)) {
                broadcast(dataKey, allJournalData[dataKey]);
            }
        }
    
        socket.on("disconnect", function() {
            console.log("SocketIO -> User disconnected");
        });
    });
}

// Broadcast a websocket even
function broadcast(eventType, eventData) {
    if (!silenced) {
        socketIoHandle.emit("journalEvent", {"event": eventType, "payload": (eventData || {})});
        // socketIoHandle.emit("journalEvent", {"event": eventType, "payload": (eventData || {}), "allData": currentPlayerInfo});
    }
}

// Prevent websocket from broadcasting
function silence() {
    silenced = true;

    console.warn("Websocket event have been silenced");
}

// Allow websocket to broadcast
function unsilence(initial) {
    silenced = false;

    // Don"t log this if this is the initial load
    if (!initial) {
        console.info("Websocket event have been silenced");
    }
}

module.exports = {
    init,
    hookClientConnect,
    broadcast,
    silence,
    unsilence
};