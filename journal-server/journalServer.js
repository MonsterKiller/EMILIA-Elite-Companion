const config   = require("./utils/config.js");
const express  = require('express');
const app      = express();
const server   = app.listen(config.listenPort);
const socketio = require('socket.io').listen(server);
const fs       = require("fs");
const path     = require("path");

const journalReader = require("./utils/journalReader.js");
const journalData   = require("./utils/journalDataStore.js");
const websocket     = require("./utils/websocket.js");

// Initialise the application
function init() {
    console.info("Starting journal server...");

    // Initialise the websocket module
    websocket.init(socketio);
    websocket.hookClientConnect(journalData);

    // Print useful info
    console.log("Listening on: " + config.listenPort);
    console.log("Monitoring: \"" + config.journalDirectory + "\" at " + config.journalPollInterval.toLocaleString() + "ms intervals");

    // Load modules
    console.log("Loading modules...");
    loadAllModules();

    // Load existing journals
    console.info("Loading existing journal files...");
    journalReader.parseAllJournalFiles();

    // Watch journals
    journalReader.watchJournals();

    // We can allow websocket broadcasts now
    websocket.unsilence(true);

    // TEST
    const data = journalData.getAll();
    console.log(JSON.stringify(data, null, '\t'));
}

// Load all modules
function loadAllModules() {
    require('fs').readdirSync(__dirname + path.sep + "modules" + path.sep)
        .forEach(function(moduleFile) {
            if (moduleFile.match(/\.js$/) !== null && moduleFile !== 'index.js') {
                let requiredModule = require("./modules/" + moduleFile);
                if (requiredModule && typeof requiredModule.init === "function") {
                    requiredModule.init();
                }
            }
        });
}

// Color console messages
const manakin = require("manakin").global;
manakin.log.bright     = true;
manakin.warn.bright    = true;
manakin.error.bright   = true;
manakin.info.bright    = true;
manakin.success.bright = true;

// Add timestamp to console messages
["log", "warn", "error", "success", "info"]
    .forEach(function(method) {
        var oldMethod = console[method].bind(console);
        console[method] = function() {
            oldMethod.apply(
                console,
                [new Date().toLocaleString()].concat(Array.prototype.slice.call(arguments))
            );
        };
    });

// We're ready, run init
init();