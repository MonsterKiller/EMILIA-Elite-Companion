const fs = require("fs");
const journalEvents = require("../utils/journalEvents.js");
const journalData   = require("../utils/journalDataStore.js");

// Names of the internal slots
const internalSlotsTypes = ["Armour", "PowerPlant", "MainEngines", "FrameShiftDrive", "LifeSupport", "PowerDistributor", "Radar", "FuelTank"];

// Store ship info
const ship = {
    "id":           null,
    "type":         "Unknown",
    "name":         "Unknown",
    "ident":        null,
    // "fuelLevel":    0,
    // "fuelCapacity": 0,
    "modules": {}
};

// Reset ship modules
function resetShipModules() {
    ship.modules = {
        "hardpoints":     [],
        "internals":      [],
        "optionals":      [],
        "utilities":      [],
        "cargoSlots":     0,
    };
}

// Load module names
var modulesInfo = {};
var modulesInfoFile = fs.readFileSync("data/ship_modules.json", "utf8");
if (modulesInfoFile) {
    try {
        modulesInfo = JSON.parse(modulesInfoFile.trim());
        console.log("Loaded ship modules info");
    } catch (e) {
        console.log("Error reading ship module names: ", e.message);
    }
}
modulesInfoFile = null;

// Load ship names
var shipNames = {};
var shipNamesFile = fs.readFileSync("data/ship_names.json", "utf8");
if (shipNamesFile) {
    try {
        shipNames = JSON.parse(shipNamesFile.trim());
        console.log("Loaded ship names");
    } catch (e) {
        console.log("Error reading ship names: ", e.message);
    }
}
shipNamesFile = null;

function init() {
    resetShipModules();
    journalData.set("ship", ship);

    journalEvents.on(["LoadGame", "Loadout"], eventLoadout);
    journalEvents.on("SetUserShipName", eventShipName);
    journalEvents.on(["ModuleBuy", "ModuleSell", "ModuleStore", "ModuleRetrieve"], eventModule);
    journalEvents.on("MassModuleStore", eventMassStore);
    journalEvents.on("ModuleSwap", eventSwap);
}

// Get a module slot type
function getSlotType(slotType) {
    if (slotType.indexOf("TinyHardpoint") > -1) {
        return "utilities";
    }
    if (slotType.indexOf("Hardpoint") > -1) {
        return "hardpoints";
    }
    if (internalSlotsTypes.indexOf(slotType) >-1) {
        return "internals";
    }
    if (/^Slot(\d+)_Size(\d+)$/i.test(slotType)) {
        return "optionals";
    }
    if (slotType === "PlanetaryApproachSuite") {
        return "optionals";
    }

    return null;
}

// Get the capacity of a cargo rack based on its size
function getCargoRackCapacity(size) {
    switch (size) {
        case "Size1": return 2;
        case "Size2": return 4;
        case "Size3": return 8;
        case "Size4": return 16;
        case "Size5": return 32;
        case "Size6": return 64;
        case "Size7": return 128;
        case "Size8": return 256;
    }

    return 0;
}

// Get module info
function getModuleInfo(moduleName) {
    // Normalize the name
    moduleName = moduleName.replace(/\$|;|_name/gi, "");

    // Get module info from the slot name
    const moduleMatches = moduleName.match(/^\$?(Hpt|Int)_([a-z0-9]+)_([a-z0-9]+)(?:_([a-z0-9]+))?(?:_([a-z0-9]+))?;?$/i);
    if (moduleMatches) {
        let shipModule = {
            "name":   "Unknown",
            "class":  null,
            "rating": null,
        };

        // Find module info
        const moduleInfo = modulesInfo[moduleName.toLowerCase()];
        if (moduleInfo) {
            shipModule.name   = moduleInfo.name   || moduleName;
            shipModule.class  = moduleInfo.class  || 0;
            shipModule.rating = moduleInfo.rating || "";
        }

        // Cargo space
        if (moduleMatches[2] === "CargoRack") {
            const cargoCapacity = getCargoRackCapacity(moduleMatches[3]);
            ship.modules.cargoSlots += parseInt(cargoCapacity) || 0;
        }

        return shipModule;
    }

    return null;
}

// Add a module
function addShipModule(moduleSlot, moduleName) {
    // Get the slot type
    const slotType = getSlotType(moduleSlot);
    if (slotType) {
        // Get some friendly info from the module name
        let moduleInfo = getModuleInfo(moduleName);
        if (moduleInfo) {
            moduleInfo.slot = moduleSlot.toLowerCase();

            ship.modules[slotType].push(moduleInfo);
        }
    }
}

// Remove a module
function removeModule(moduleSlot) {
    const slotType = getSlotType(moduleSlot);
    if (slotType) {
        for (let i = 0; i < ship.modules[slotType].length; i++) {
            if (ship.modules[slotType][i].slot.toLowerCase() === moduleSlot.toLowerCase()) {
                ship.modules[slotType].splice(i, 1);
                return;
            }
        }
    }
}

// Called on game load
function eventLoadout(journalEntry) {
    ship.id    = journalEntry.ShipID    || null;
    ship.name  = journalEntry.ShipName  || null;
    ship.ident = journalEntry.ShipIdent || null;
    ship.type  = shipNames[journalEntry.Ship.toLowerCase()] || journalEntry.Ship || "Unknown";

    // Fuel
    // if (journalEntry.FuelLevel) {
    //     ship.fuelLevel = parseInt(journalEntry.FuelLevel) || 0;
    // }
    // if (journalEntry.FuelCapacity) {
    //     ship.fuelCapacity = parseInt(journalEntry.FuelCapacity) || 0;
    // }

    // Modules
    if (journalEntry.Modules) {
        // Reset modules
        resetShipModules();
 
        // Loop modules
        journalEntry.Modules.forEach(function(shipModule) {
            addShipModule(shipModule.Slot, shipModule.Item, shipModule.AmmoInClip);
        });
    }

    journalData.update("ship", ship);
}

// Called when renaming a ship
function eventShipName(journalEntry) {
    ship.id    = journalEntry.ShipID       || ship.id;
    ship.type  = journalEntry.Ship         || ship.type;
    ship.name  = journalEntry.UserShipName || ship.name;
    ship.ident = journalEntry.UserShipId   || ship.ident;

    journalData.update("ship", ship);
}

// When buying, selling or storing a module
function eventModule(journalEntry) {
    // Are we selling an item?
    if (journalEntry.SellItem || journalEntry.StoredItem) {
        removeModule(journalEntry.Slot);
    }

    if (journalEntry.BuyItem) {
        addShipModule(journalEntry.Slot, journalEntry.BuyItem);
    } else if (journalEntry.RetrievedItem) {
        addShipModule(journalEntry.Slot, journalEntry.RetrievedItem);
    }

    journalData.update("ship", ship);
}

// When mass storing modules
function eventMassStore(journalEntry) {
    // Ensure it's for our current ship
    if (journalEntry.ShipID === ship.id && journalEntry.Items) {
        journalEntry.Items.forEach(function(item) {
            removeModule(item.Slot);
        });

        journalData.update("ship", ship);
    }
}

// When swapping a module
function eventSwap(journalEntry) {
    // Ensure it's for our current ship
    if (journalEntry.ShipID === ship.id) {
        if (journalEntry.FromSlot) {
            removeModule(journalEntry.FromSlot);
        }
        if (journalEntry.ToSlot) {
            addShipModule(journalEntry.ToSlot, journalEntry.ToItem);
        }

        journalData.update("ship", ship);
    }
}

module.exports = {
    init
};