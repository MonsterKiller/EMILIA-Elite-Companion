const journalEvents = require("../utils/journalEvents.js");
const journalData   = require("../utils/journalDataStore.js");

// Store commander info
const commander = {
    "name": "Unknown",
};

function init() {
    journalData.set("commander", commander);

    journalEvents.on("LoadGame", eventLoad);
    journalEvents.on("NewCommander", eventNewCommander);
}

// On load game
function eventLoad(journalEntry) {
    if (journalEntry.Commander) {
        if (journalEntry.Commander !== commander.name) {
            commander.name = journalEntry.Commander.trim();

            journalData.update("commander", commander);
        }
    }
}

// On new commander created
function eventNewCommander(journalEntry) {
    if (journalEntry.Name) {
        if (journalEntry.Name !== commander.name) {
            commander.name = journalEntry.Name.trim();

            journalData.update("commander", commander);
        }
    }
}

module.exports = {
    init
};