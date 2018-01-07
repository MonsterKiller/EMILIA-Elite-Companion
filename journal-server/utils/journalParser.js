const journalEvents = require("./journalEvents.js");

// Parse a journal line and broadcast an event for it
function parseLine(journalLine) {
    if (typeof journalLine === 'string') {
        // Trim whitespace and ensure there is content on the line
        journalLine = journalLine.trim();
        if (journalLine.length < 3) {
            return;
        }

        // Try to parse the line as JSON
        try {
            journalLine = JSON.parse(journalLine);
        } catch (error) {
            console.error("Failed to read journal log line");
            console.log(error.message);
        }
    }

    // Does the line contain an event type?
    if (journalLine && journalLine.event) {
        journalEvents.broadcast(journalLine.event, journalLine);
    }
}

module.exports = {
    parseLine,
};