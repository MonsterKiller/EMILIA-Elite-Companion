const journalEvents = require("../utils/journalEvents.js");
const journalData   = require("../utils/journalDataStore.js");

// Rank data
var ranks = {};
var rankTypes = ["Combat", "Trade", "Explore", "CQC", "Empire", "Federation"];

// Set default rank data for each type
rankTypes.forEach(function(rankType) {
    ranks[rankType.toLowerCase()] = {
        "rank":           0,
        "startRank":      null,
        "rankFriendly":   "Unknown",
        "progress":       0,
        "startProgress":  null,
    };
});

// Friendly rank names
const eliteRanksFriendly = {
    "combat":     ["Harmless", "Mostly Harmless", "Novice", "Competent", "Expert", "Master", "Dangerous", "Deadly", "Elite"],
    "trade":      ["Penniless", "Mostly Pennliess", "Peddler", "Dealer", "Merchant", "Broker", "Entrepreneur", "Tycoon", "Elite"],
    "explore":    ["Aimless", "Mostly Aimless", "Scout", "Surveyor", "Explorer", "Pathfinder", "Ranger", "Pioneer", "Elite"],
    "cqc":        ["Helpless", "Mostly Helpless", "Amateur", "Semi Professional", "Professional", "Champion", "Hero", "Legend", "Elite"],
    "empire":     ["None", "Outsider", "Serf", "Master", "Squire", "Knight", "Lord", "Baron",  "Viscount ", "Count", "Earl", "Marquis", "Duke", "Prince", "King"],
    "federation": ["None", "Recruit", "Cadet", "Midshipman", "Petty Officer", "Chief Petty Officer", "Warrant Officer", "Ensign", "Lieutenant", "Lt. Commander", "Post Commander",  "Post Captain",  "Rear Admiral", "Vice Admiral", "Admiral"],
};

function init() {
    journalData.set("ranks", ranks);

    journalEvents.on(["Rank", "Promotion"], eventRank);
    journalEvents.on("Progress", eventProgress);
    journalEvents.on("journalChange", eventFileChanged);
}

// On start-up rank or rank up
function eventRank(journalEntry) {
    rankTypes.forEach(function(rankType) {
        // Ensure the rank type is set
        if (typeof journalEntry[rankType] !== "number") {
            return;
        }

        const newRank = journalEntry[rankType];
        const rankTypeLower = rankType.toLowerCase();

        // Do we need to reset the starting progress?
        if (newRank > ranks[rankTypeLower].rank && ranks[rankTypeLower].startProgress !== null) {
            ranks[rankTypeLower].progress = 0;
            ranks[rankTypeLower].startProgress = 0;
        }

        // Set rank
        ranks[rankTypeLower].rank = newRank;
        ranks[rankTypeLower].rankFriendly = eliteRanksFriendly[rankTypeLower][newRank];

        // Set the start rank
        if (ranks[rankTypeLower].startRank === null) {
            ranks[rankTypeLower].startRank = newRank;
        }
    });

    journalData.update("ranks", ranks);
}

// Start-up rank progress
function eventProgress(journalEntry) {
    rankTypes.forEach(function(progressType) {
        // Ensure the rank type is set
        if (typeof journalEntry[progressType] !== "number") {
            return;
        }

        const newProgress = journalEntry[progressType];
        const progressTypeLower = progressType.toLowerCase();

        // Alter the start progress if needed
        if (ranks[progressTypeLower].startProgress === null) {
            ranks[progressTypeLower].startProgress = newProgress;
        } else if (ranks[progressTypeLower].progress > newProgress) {
            ranks[progressTypeLower].startProgress = 0;
        }

        // Set progress
        ranks[progressTypeLower].progress = newProgress;
    });

    journalData.update("ranks", ranks);
}

// When a new journal is opened
function eventFileChanged(changeInfo) {
    // Is it a new journal?
    if (!changeInfo.newPart) {
        rankTypes.forEach(function(progressType) {
            const progressTypeLower = progressType.toLowerCase();

            // Reset start rank
            ranks[progressTypeLower].startRank     = null;
            ranks[progressTypeLower].startProgress = null;
        });

        journalData.update("ranks", ranks);
    }
}

module.exports = {
    init
};