const journalEvents = require("../utils/journalEvents.js");
const journalData   = require("../utils/journalDataStore.js");

// Balance data
var balance = {
    "credits":  0,
};

function init() {
    journalData.set("balance", balance);

    journalEvents.on(["LoadGame"], eventLoadGame);
    journalEvents.on(["RedeemVoucher", "PowerplaySalary"], eventRedeemedAmount);
    journalEvents.on(["PayFines", "PayLegacyFines"], eventFinesPaid);
    journalEvents.on(["BuyTradeData", "BuyExplorationData", "BuyAmmo", "RefuelAll", "RefuelPartial", "Repair", "RepairAll", "RestockVehicle", "Resurrect", "CrewHire"], eventPurchaseCost);
    journalEvents.on(["MarketBuy", "BuyDrones"], eventPurchaseTotalCost);
    journalEvents.on(["MarketSell"], eventSellTotalSale);
    journalEvents.on(["SellExplorationData"], eventExplorationSell);
    journalEvents.on(["ModuleBuy", "ModuleSell", "ModuleSellRemote", "SellDrones"], eventSellBuyPrice);
    journalEvents.on(["ShipyardBuy", "ShipyardSell"], eventShipBuySell);
    journalEvents.on(["ShipyardTransfer"], eventShipTransfer);
    journalEvents.on(["CommunityGoalReward", "DatalinkVoucher", "FactionKillBond", "MissionCompleted"], eventReward);
}

// Add and/or subtract from the current balance
function adjustBalance(addAmount, subtractAmount) {
    addAmount      = parseInt(addAmount) || 0;
    subtractAmount = parseInt(subtractAmount) || 0;

    const alterBalanceBy = addAmount - subtractAmount;
    balance.credits += alterBalanceBy;

    journalData.update("balance", balance);
}

// Load event
function eventLoadGame(journalEntry) {
    balance.credits = parseInt(journalEntry.Credits) || 0;

    journalData.update("balance", balance);
}

// When redeeming a bounty/getting a powerplay salary
function eventRedeemedAmount(journalEntry) {
    adjustBalance(journalEntry.Amount);
}

// When paying fines
function eventFinesPaid(journalEntry) {
    adjustBalance(0, journalEntry.Amount);
}

// When purchasing something with a single cost
function eventPurchaseCost(journalEntry) {
    adjustBalance(0, journalEntry.Cost);
}

// When purchasing something with a total cost
function eventPurchaseTotalCost(journalEntry) {
    adjustBalance(0, journalEntry.TotalCost);
}

// When selling something with a total sales value
function eventSellTotalSale(journalEntry) {
    adjustBalance(journalEntry.TotalSale);
}

// When selling exploration data
function eventExplorationSell(journalEntry) {
    const addAmount = (parseInt(journalEntry.BaseValue) || 0) + (parseInt(journalEntry.Bonus) || 0);
    adjustBalance(addAmount);
}

// When buying/selling things, like ship modules
function eventSellBuyPrice(journalEntry) {
    adjustBalance(journalEntry.SellPrice, journalEntry.BuyPrice);
}

// When buying a ship
function eventShipBuySell(journalEntry) {
    adjustBalance(journalEntry.SellPrice, journalEntry.ShipPrice);
}

// When paying for a ship transfer
function eventShipTransfer(journalEntry) {
    adjustBalance(0, journalEntry.TransferPrice);
}

// When receiving a reward for something, like completing a mission
function eventReward(journalEntry) {
    adjustBalance(journalEntry.Reward);
}

module.exports = {
    init
};