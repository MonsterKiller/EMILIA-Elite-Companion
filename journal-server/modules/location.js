const journalEvents = require("../utils/journalEvents.js");
const journalData   = require("../utils/journalDataStore.js");

// List of scoopable stars
const eliteScoopableStarClasses = ["A", "B", "F", "G", "K", "O", "M"];

// Location data
var location = {
    "system": {
        "name":       "Unknown",
        "allegiance": "None",
        "security":   "Unknown",
        "starClass":  "?",
        "scoopable":  false
    },
    "station": {
        "name":       "None",
        "type":       "Unknown",
        "docked":     false
    },
    "history": []
};

function init() {
    journalData.set("location", location);

    journalEvents.on("Location", eventLocation);
    journalEvents.on("StartJump",  eventJumping);
    journalEvents.on("FSDJump", eventJumped);
    journalEvents.on("SupercruiseExit", eventSupercruiseExit);
    journalEvents.on("Docked", eventDocked);
    journalEvents.on("Undocked", eventUndocked);
    journalEvents.on("ApproachSettlement", eventSettlement);
}

// Set the current system info
function setSystem(systemName, systemAllegiance, systemSecurity) {
    location.system.name       = systemName       || "Unknown";
    location.system.allegiance = systemAllegiance || "None";
    location.system.security   = systemSecurity   || "Unknown";

    journalData.update("location", location);
}

// Set the current station info/docked status
function setStation(stationName, isDocked, stationType) {
    location.station.name   = stationName || "None";
    location.station.type   = stationType || "Unknown";
    location.station.docked = !!isDocked;

    journalData.update("location", location);
}

// Set the star class of the jump destination
function setStarClass(starClass) {
    location.system.starClass = starClass || "Unknown";
    location.system.scoopable = eliteScoopableStarClasses.indexOf(starClass.toUpperCase()) > -1;

    journalData.update("location", location);
}

// Location event, written when loading an instance
function eventLocation(journalEntry) {
    // System
    setSystem(journalEntry.StarSystem, journalEntry.SystemAllegiance, journalEntry.SystemSecurity_Localised);

    // Docked at a station?
    if (typeof journalEntry.Docked !== "undefined" && journalEntry.Docked) {
        setStation(journalEntry.StationName, true, journalEntry.StationType);
    } else {
        // We aren't at a station
        if (location.station.name !== "None") {
            setStation();
        }
    }
}

// Jumping event, written when starting a jump to hyperspace or supercruise
function eventJumping(journalEntry) {
    // Are we jumping to hyperspace or supercruise?
    if (journalEntry.JumpType === 'Hyperspace') {
        // System
        setSystem(journalEntry.StarSystem);

        // Star class
        setStarClass(journalEntry.StarClass);
    }

    // We aren't at a station any more
    if (location.station.name !== "None") {
        setStation();
    }
}

// Jumped event, written when hyperspace jump complete
function eventJumped(journalEntry) {
    // System
    setSystem(journalEntry.StarSystem, journalEntry.SystemAllegiance, journalEntry.SystemSecurity_Localised);
}

// Exit supercruise event, written when... you guessed it. 
function eventSupercruiseExit(journalEntry) {
    if (journalEntry.BodyType && journalEntry.BodyType === 'Station') {
        setStation(journalEntry.Body);
    }
}

// Docked event, you get the picture
function eventDocked(journalEntry) {
    setStation(journalEntry.StationName, true, journalEntry.StationType);
}

// Undocked event, need I explain?
function eventUndocked(journalEntry) {
    // Set the current station so we can see which station we are near
    // But set docked to false
    setStation(location.station.name, false, location.station.Type);
}

// Approaching a planet settlement
function eventSettlement(journalEntry) {
    setStation(journalEntry.Name);
}

module.exports = {
    init
};