const journalEvents = require("../utils/journalEvents.js");
const websocket     = require("../utils/websocket.js");
const missions      = require("../modules/missions.js");

function init() {
    journalEvents.on("ReceiveText", eventChat);
    journalEvents.on("MissionAccepted", eventMissionAccepted);
    journalEvents.on("MissionFailed", eventMissionFailed);
    journalEvents.on("CommitCrime", eventCrime);
}

// Interdiction warning - On chat message received
function eventChat(journalEntry) {
    if (journalEntry.Channel == "npc" && (
        journalEntry.Message.toLowerCase().indexOf("hunterhostilesc") > -1 ||
        journalEntry.Message.toLowerCase().indexOf("startinterdiction") > -1
    )) {
        websocket.broadcast("interdictionWarning", {
            "name": journalEntry.From_Localised
        });
    }
}

// Illegal mission warning
function eventMissionAccepted(journalEntry) {
    const missionIllegal = missions.isMissionIllegal(journalEntry.Name, journalEntry.PassengerWanted);
    if (missionIllegal) {
        websocket.broadcast("illegalMission", {
            "name": journalEntry.Name
        });
    }
}

// Failed missions
function eventMissionFailed(journalEntry) {
    websocket.broadcast("missionFailed", {
        "name": journalEntry.Name
    });
}

// Committed a crime
function eventCrime(journalEntry) {
    websocket.broadcast("crimeCommitted", {
        "type": journalEntry.CrimeType
    });
}

module.exports = {
    init
};