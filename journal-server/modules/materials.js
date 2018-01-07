const fs = require("fs");
const journalEvents = require("../utils/journalEvents.js");
const journalData   = require("../utils/journalDataStore.js");

// Store materials info
const materials = {
    "materials":     [],
    "data":          [],
    "materialCount": 0,
    "dataCount":     0
};

// Load material names
var materialsInfo = {};
var materialInfoFile = fs.readFileSync("data/item_names.json", "utf8");
if (materialInfoFile) {
    try {
        materialsInfo = JSON.parse(materialInfoFile.trim());
        console.log("Loaded materials info");
    } catch (e) {
        console.log("Error reading item names: ", e.message);
    }
}
materialInfoFile = null;

function init() {
    journalData.set("materials", materials);

    journalEvents.on("Materials", eventMaterials);
    journalEvents.on("MaterialCollected", eventCollected);
    journalEvents.on("MaterialDiscarded", eventDiscarded);
    journalEvents.on("EngineerCraft", eventCraft);
}

// Add a material to the list with a specific count
function addMaterial(materialName, materialCount) {
    // Ensure we have a count
    materialCount = parseInt(materialCount) || 1;
    if (!materialCount) {
        return;
    }

    // "Material" type
    const materialType = materialsInfo[materialName] ? materialsInfo[materialName].type.toLowerCase() : "material";

    // Does the material already exist?
    const materialId = findMaterialIndex(materialType, materialName);
    if (materialId > -1) {
        // Add to the count
        if (materialType === "data") {
            materials.data[materialId].count += materialCount;
        } else {
            materials.materials[materialId].count += materialCount;
        }
    } else {
        let material = {
            "name": materialName,
            "type": "material",
            "friendlyName": materialName,
            "count": materialCount
        };
        
        // Set the friendly name and type
        if (typeof materialsInfo[materialName] !== "undefined") {
            material.friendlyName = materialsInfo[materialName].name;
            material.type = materialsInfo[materialName].type.toLowerCase();
        }

        if (materialType === "data") {
            materials.data.push(material);
        } else {
            materials.materials.push(material);
        }

        // Add to material count
        if (materialType === "data") {
            materials.dataCount += materialCount;
        } else {
            materials.materialCount += materialCount;
        }
    }
}

// Remove a specific amount of a material
function removeMaterial(materialName, materialCount) {
    // "Material" type
    const materialType = materialsInfo[materialName] ? materialsInfo[materialName].type.toLowerCase() : "material";

    const materialIndex = findMaterialIndex(materialType, materialName);
    if (materialIndex > -1) {
        // Subtract count
        if (materialType === "data") {
            materials.data[materialId].count -= materialCount;
        } else {
            materials.materials[materialId].count -= materialCount;
        }

        // Subtract from total acounts
        if (materialType === "data") {
            materials.dataCount -= materialCount;
        } else {
            materials.materialCount -= materialCount;
        }

        // If there are 0, remove the material
        if (materials.materials[materialId].count < 1) {
            materials.materials.splice(materialId, 1);
        }

        if (materialType === "data") {
            if (materials.data[materialId].count < 1) {
                materials.data.splice(materialId, 1);
            }
        } else {
            if (materials.materials[materialId].count < 1) {
                materials.materials.splice(materialId, 1);
            }
        }
    }
}

// Get the index of a material
function findMaterialIndex(materialType, materialName) {
    const materialList = materialType === "data" ? materials.data : materials.materials;

    materialList.forEach(function(material, index) {
        if (material.name && material.name === materialName) {
            return index;
        }
    });

    return -1;
}

// On game load
function eventMaterials(journalEntry) {
    materials.materials     = [];
    materials.data          = [];
    materials.materialCount = 0;
    materials.dataCount     = 0;

    // Loop material types
    ["Raw", "Manufactured", "Encoded"].forEach(function(materialType) {
        if (journalEntry[materialType]) {
            // Loop materials
            journalEntry[materialType].forEach(function(material) {
                addMaterial(material.Name, material.Count);
            });
        }
    });

    journalData.update("materials", materials);
}

// When a material is collected
function eventCollected(journalEntry) {
    addMaterial(journalEntry.Name, journalEntry.Count);

    journalData.update("materials", materials);
}

// When a material is discarded
function eventDiscarded(journalEntry) {
    removeMaterial(journalEntry.Name, journalEntry.Count);

    journalData.update("materials", materials);
}

// When crafting an engineer upgrade
function eventCraft(journalEntry) {
    // journalEntry.Ingredients
    if (journalEntry.Ingredients) {
        const ingredients = journalEntry.Ingredients;
        for (var material in ingredients) {
            if (ingredients.hasOwnProperty(material)) {
                removeMaterial(material, ingredients[material], true);
            }
        }
        
        journalData.update("materials", materials);
    }
}

module.exports = {
    init
};