const fs       = require("fs");
const chokidar = require("chokidar");
const path     = require("path");

const config = require("./config.js");
const journalParser = require("./journalParser.js");
const journalEvents = require("./journalEvents.js");

// Stoer the file watcher
var journalWatcher = null;

// Store the current journal file and line, needed when finding new lines
var currentJournalFile = null;
var currentJournalPart = 1;
var currentJournalLine = 0;

// Order array elements by multiple properties
function orderByProperty(prop) {
    var args = Array.prototype.slice.call(arguments, 1);
    return function (a, b) {
        var equality = b[prop] - a[prop];
        if (equality === 0 && arguments.length > 1) {
            return orderByProperty.apply(null, args)(a, b);
        }
        return equality;
    };
}

// Get the base name of a file
function getFileName(filePath) {
    const fileName = path.basename(filePath);
    return fileName;
}

// Get journal file part number
function getJournalPartNumber(journalFile) {
    const fileMatches = journalFile.match(config.journalFileRegex);
    if (fileMatches) {
        const filePart = parseInt(fileMatches[2]) || 1;
        return filePart;
    }

    return 1;
}

// List all current journal files, in order
function listJournalFiles() {
    var journalList = [];

    // Get a list of files in the journal directory
    const journalFiles = fs.readdirSync(config.journalDirectory);
    if (journalFiles && journalFiles.length) {
        // Loop all files
        journalFiles.forEach(function(journalFile) {
            // Is this file a valid journal file?
            const fileMatches = journalFile.match(config.journalFileRegex);
            if (!fileMatches) {
                return;
            }

            journalList.push({
                file:      config.journalDirectory + journalFile,
                datestamp: parseInt(fileMatches[1]),
                part:      parseInt(fileMatches[2]) || 1,
            });
        });

        // Sort the array by file datestamp, then by part
        journalList.sort(orderByProperty("datestamp", "part"));

        return journalList;
    }

    return [];
}

// Get the most recent journal file path
function latestJournalFilePath() {
    const journalFiles = listJournalFiles();
    if (journalFiles.length) {
        return journalFiles[0].file;
    }
    
    return null;
}

// Read lines from a journal file
function getJournalLines(journalFile, fromCurrentLine) {
    // Read the journal file and split the lines
    let journalLines = fs.readFileSync(journalFile, "utf-8")
        .trim()
        .split("\r\n");
    
    // Return from a specific line
    if (fromCurrentLine) {
        // Are there new lines?
        if (currentJournalLine > journalLines.length) {
            console.warn("Lines have been removed?");
            currentJournalLine = journalLines.length;

            return [];
        } else if (currentJournalLine === journalLines.length) {
            console.log("No new lines found?");

            return [];
        }

        // Only return new lines
        journalLines = journalLines.splice(currentJournalLine);
    }

    return journalLines;
}

// Load and parse all current journal files (run at start-up)
function parseAllJournalFiles() {
    const journalFiles = listJournalFiles();

    // We want to start with the oldest files first
    journalFiles.reverse();

    journalFiles.forEach(function(journalFileInfo) {
        parseJournalFile(journalFileInfo.file);
    });
}

// Load and parse a single journal file
function parseJournalFile(journalFilePath, journalFilePart) {
    // Detect the file part
    if (!journalFilePart) {
        const journalFileName = getFileName(journalFilePath);
        journalFilePart = getJournalPartNumber(journalFileName);
    }

    // Broadcast new file events
    if (currentJournalFile !== journalFilePath) {
        if (journalFilePart > 1) {
            journalEvents.broadcast("journalChange", {"newFile": journalFilePath, "newPart": journalPart});
        } else {
            journalEvents.broadcast("journalChange", {"newFile": journalFilePath, "newPart": false});
        }
    }

    currentJournalFile = journalFilePath;
    currentJournalPart = journalFilePart;
    currentJournalLine = 0;

    // Load the journal file and split the lines
    const journalLines = getJournalLines(journalFilePath);
    journalLines.forEach(function(journalLine) {
        currentJournalLine++;

        journalParser.parseLine(journalLine);
    });
}

// Load and parse just the new lines in the journal
function parseJournalUpdate() {
    const newJournalLines = getJournalLines(currentJournalFile, true);

    console.log("Detected journal change, " + (newJournalLines.length || 0) + " new lines.");

    if (newJournalLines) {
        newJournalLines.forEach(function(journalLine) {
            currentJournalLine++;
    
            journalParser.parseLine(journalLine);
        });
    }
}

// Begin watching the journal directory & files for changes
function watchJournals() {
    // Ensure we have a journal file to watch
    if (!currentJournalFile) {
        console.error("Cannot watch journal files, current journal file not set?");
        return;
    }

    // Start watching journal directory and current journal file
    journalWatcher = chokidar.watch([config.journalDirectory, currentJournalFile], {
        usePolling: true,
        interval:   config.journalPollInterval,
    });

    journalWatcher.on("ready", journalWatcherReady);
}

// Change the currently watched journal file
function changeWatchedJournalFile(newJournalFile, newJournalPart) {
    // Unwatch the current file
    journalWatcher.unwatch(currentJournalFile);
 
    // Read the new file
    parseJournalFile(newJournalFile, newJournalPart);

    // Watch the new file
    journalWatcher.add(newJournalFile);

    console.info("Switched to new file and parsed lines:", newJournalFile);
}

// Called when the journal watcher is ready, start listening for file events
function journalWatcherReady() {
    // Watch for a new file being created
    journalWatcher.on('add', newJournalFileCreated);
    
    // Watch for changes to the current file
    journalWatcher.on('raw', journalFileEvent);

    console.info("Started watching journal directory");
}

// Called when a new file is created
function newJournalFileCreated(journalPath) {
    // Get the file name
    const fileName    = getFileName(journalPath);
    const fileMatches = fileName.match(config.journalFileRegex);

    // Is the file a journal file?
    if (!fileMatches) {
        console.warn("New file created but is not a journal file? \"" + fileName + "\"");
        return;
    }

    // Is it a new journal part?
    const journalPart = parseInt(fileMatches[2]);

    if (journalPart === 1) {
        // New journal file
        console.info("Detected new journal file: " + fileName);

        // Broadcast a journal change event
        journalEvents.broadcast("journalChange", {"newFile": journalPath, "newPart": false});

        // Change active journal file
        changeWatchedJournalFile(journalPath, journalPart);
    } else if ((currentJournalPart + 1) === journalPart) {
        // Next part to the current file
        console.info("Detected new journal file part: " + fileName);

        // Broadcast a journal change event
        journalEvents.broadcast("journalChange", {"newFile": journalPath, "newPart": journalPart});

        // Change active journal file
        changeWatchedJournalFile(journalPath, journalPart);
    } else {
        // What is this?
        console.warn("Detected new journal file, but it doesn't follow on from the current file... Ignoring");
    }
}

// Called when a file event is trigged on the current journal file
function journalFileEvent(event, filePath) {
    // Is it a change event?
    if (event.toLowerCase() === 'change' && filePath === currentJournalFile) {
        parseJournalUpdate();
    }
}

module.exports = {
    listJournalFiles,
    latestJournalFilePath,
    parseAllJournalFiles,
    parseJournalFile,
    parseJournalUpdate,
    watchJournals,
};