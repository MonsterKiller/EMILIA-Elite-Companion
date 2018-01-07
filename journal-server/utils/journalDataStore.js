const websocket = require("../utils/websocket.js");

var journalData = {};

// Set/reset journal data by key
function set(dataKey, newData) {
    if (journalData[dataKey] !== newData) {
        journalData[dataKey] = newData;
        updated(dataKey, newData);
    }
}

// Update some journal data by key
function update(dataKey, updatedData) {
    if (typeof journalData[dataKey] === "undefined") {
        journalData[dataKey] = updatedData;
    } else {
        journalData[dataKey] = {...journalData[dataKey], ...updatedData};
    }
    
    updated(dataKey, updatedData);
}

// Get journal data by key
function get(dataKey) {
    return journalData[dataKey] || null;
}

// Get all journal data
function getAll() {
    return journalData;
}

// Broadcast websocket event
function updated(eventType, eventData) {
    websocket.broadcast(eventType, eventData);
}

module.exports = {
    set,
    update,
    get,
    getAll,
};