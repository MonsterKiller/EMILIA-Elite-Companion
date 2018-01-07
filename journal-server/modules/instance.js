const journalEvents = require("../utils/journalEvents.js");
const journalData   = require("../utils/journalDataStore.js");

var instance = {
    "mode":  "Main Menu",
    "group": null
};

function init() {
    journalData.set("instance", instance);

    journalEvents.on("LoadGame", eventLoadGame);
    journalEvents.on("Music", eventMusic);
    journalEvents.on("journalChange", eventFileChanged);
}

// When loading into an instance
function eventLoadGame(journalEntry) {
    // Game mode/instance
    var gameMode = journalEntry.GameMode || null;
    switch (gameMode) {
        case 'Group': gameMode = 'Private Group'; break;
        case 'Solo':  gameMode = 'Solo Play'; break;
        case 'Open':  gameMode = 'Open Play'; break;
        default:      gameMode = 'Main Menu'; break;
    }

    instance.mode = gameMode;

    // Group name
    var groupName = journalEntry.Group || null;
    instance.group = groupName;

    journalData.update("instance", instance);
}

// When music gets changed
function eventMusic(journalEntry) {
    // Is it main menu music?
    if (journalEntry.MusicTrack && journalEntry.MusicTrack === 'MainMenu') {
        instance.mode  = "Main Menu";
        instance.group = null;

        journalData.update("instance", instance);
    }
}

// When a new journal is opened
function eventFileChanged(changeInfo) {
    // Is it a new journal?
    if (!changeInfo.newPart) {
        instance.mode  = "Main Menu";
        instance.group = null;

        journalData.update("instance", instance);
    }
}

module.exports = {
    init
};