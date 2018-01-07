const config        = require("../utils/config.js");
const journalEvents = require("../utils/journalEvents.js");
const journalData   = require("../utils/journalDataStore.js");

// Location data
var missions = {
    "accepted":  [],
    "completed": [],
    "acceptedRewards":  0,
    "collectedRewards": 0,
};

function init() {
    journalData.set("missions", missions);

    journalEvents.on("MissionAccepted", eventAccepted);
    journalEvents.on("MissionCompleted", eventCompleted);
    journalEvents.on(["MissionFailed", "MissionAbandoned"], eventRemove);
    journalEvents.on("journalChange", eventFileChanged);
}

// Make a good guess as to the mission type
function getMissionType(missionName) {
    if (missionName.indexOf('PassengerBulk') > -1) {
        return 'passenger';
    }
    if (missionName.indexOf('PassengerVIP') > -1) {
        return 'passenger-vip';
    }
    if (missionName.indexOf('Altruism') > -1) {
        return 'charity';
    }
    if (missionName.indexOf('Mining') > -1) {
        return 'mining';
    }
    if (missionName.indexOf('Courier') > -1) {
        return 'courier';
    }
    if (missionName.indexOf('Assassin') > -1) {
        return 'assassin';
    }
    if (missionName.indexOf('Collect') > -1) {
        return 'delivery-collect';
    }
    if (missionName.indexOf('Delivery') > -1 || missionName.indexOf('HelpFinishTheOrder') > -1) {
        return 'delivery';
    }
    if (missionName.indexOf('Salvage_Illegal') > -1) {
        return 'delivery-pirate';
    }
    return 'unknown';
}

// Convert the High/Medium/Low rep reward to an int
function repToInt(rep) {
    switch (rep) {
        case "High":   return 3;
        case "Medium": return 2;
        case "Low":    return 1;
        default:       return 0;
    }
}

function isMissionIllegal(missionName, passengerWanted) {
    if (passengerWanted) {
        return "Wanted";
    } else if (missionName.indexOf("Terrorist") > -1) {
        return "Criminal";
    } else if (missionName.indexOf("Salvage_Illegal") > -1) {
        return "Illegal";
    }

    return false;
}

// Called when a mission is accepted
function eventAccepted(journalEntry) {
    // Mission data
    const mission = {
        "id":            journalEntry.MissionID,
        "name":          (journalEntry.LocalisedName.trim() || "Unknown").trim(),
        "destination":   null,
        "expiry":        Date.parse(journalEntry.Expiry),
        "expiry_string": journalEntry.Expiry,
        "credit_reward": null,
        "reputation":    null,
        "influence":     null,
        "illegal":       false
    };

    // Destination
    if (journalEntry.DestinationSystem) {
        mission.destination = {
            "system":   journalEntry.DestinationSystem,
            "station":  journalEntry.DestinationStation || "Unknown",
            "friendly": journalEntry.DestinationSystem + (journalEntry.DestinationStation ? " - " + journalEntry.DestinationStation : ""),
        };
    }
    if (journalEntry.Target_Localised) {
        mission.destination = {
            "system":   journalEntry.Target_Localised,
            "station":  "Unknown",
            "friendly": journalEntry.Target_Localised,
        };
    }

    // Credit reward
    if (journalEntry.Reward) {
        const reward = parseInt(journalEntry.Reward) || null;
        if (reward) {
            mission.credit_reward = reward;
            missions.acceptedRewards += reward;
        }
    }

    // Reputation / Influence
    if (journalEntry.Reputation) {
        const repLevel = repToInt(journalEntry.Reputation);
        mission.reputation = "+++".slice(0, repLevel);
    }

    if (journalEntry.Influence) {
        const infLevel = repToInt(journalEntry.Influence);
        mission.influence = "+++".slice(0, infLevel);
    }

    // Mission type/icon
    mission.type = getMissionType(journalEntry.Name);

    // Illegal missions
    mission.illegal = isMissionIllegal(journalEntry.Name, journalEntry.PassengerWanted);

    // Add the mission
    missions.accepted.push(mission);

    journalData.update("missions", missions);
}

// Called when a mission is completed
function eventCompleted(journalEntry) {
    const missionIndex = findMissionIndex(journalEntry.MissionID);
    if (missionIndex > -1) {
        const mission = missions.accepted[missionIndex];

        // Save the mission to completed
        if (config.missionCompletedHistoryCount) {
            missions.completed.unshift(mission);

            // Only save the last X history
            if (missions.completed.length > config.missionCompletedHistoryCount) {
                missions.completed = missions.completed.slice(0, config.missionCompletedHistoryCount);
            }
        }

        // Add reward to collected rewards
        if (mission.credit_reward) {
            missions.collectedRewards += mission.credit_reward;
        }

        // Remove the accepted mission
        removeMission(journalEntry.MissionID);

        journalData.update("missions", missions);
    }
}

// Called when a mission has been abandoned or failed
function eventRemove(journalEntry) {
    removeMission(journalEntry.MissionID);

    journalData.update("missions", missions);
}

// Remove a mission from the accepted list
function removeMission(missionId) {
    const missionIndex = findMissionIndex(missionId);
    if (missionIndex > -1) {
        // Remove reward from accepted rewards
        if (missions.accepted[missionIndex].credit_reward) {
            missions.acceptedRewards -= missions.accepted[missionIndex].credit_reward;
        }

        missions.accepted.splice(missionIndex, 1);
    }
}

// Find the index of a mission in the accepted list
function findMissionIndex(missionId) {
    for (let i = 0; i < missions.accepted.length; i++) {
        if (missions.accepted[i].id === missionId) {
            return i;
        }
    }
    return -1;
}

// When a new journal is opened
function eventFileChanged(changeInfo) {
    // Is it a new journal?
    if (!changeInfo.newPart) {
        missions.collectedRewards = 0;

        journalData.update("missions", missions);
    }
}

module.exports = {
    init,
    isMissionIllegal
};