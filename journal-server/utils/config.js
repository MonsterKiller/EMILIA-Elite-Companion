const path = require("path");
const os   = require("os");

// Get commandline arguments
let commandlineArgs = {};
process.argv.forEach(function (value, index, array) {
    // Is it a valid parameter? 
    const argMatch = value.match(/^--([a-z]+)=(?:"|')?(.+)(?:"|')?$/i);
    if (argMatch) {
        // Save it for later
        commandlineArgs[argMatch[1].toLowerCase()] = argMatch[2];
    }
});

// Listen port
const listenPort = parseInt(commandlineArgs["port"]) || 3031;

// Static files path
const staticPath = commandlineArgs["staticpath"] || "." + path.sep + "front-end";

// Journal directory
const journalDirectory = path.join(os.homedir(), "Saved Games", "Frontier Developments", "Elite Dangerous") + path.sep;

// Journal file regex
const journalFileRegex = /^Journal\.([0-9]+)\.([0-9]+)\.log$/i;

// Journal polling internal
const journalPollInterval = parseInt(commandlineArgs["pollinterval"]) || 100;

// Location history
const locationHistoryCount = parseInt(commandlineArgs["locationhistory"]) || 30;

// Mission completed history
const missionCompletedHistoryCount = parseInt(commandlineArgs["missionhistory"]) || 0;

module.exports = {
    listenPort,
    staticPath,
    journalDirectory,
    journalFileRegex,
    journalPollInterval,
    locationHistoryCount,
    missionCompletedHistoryCount,
};