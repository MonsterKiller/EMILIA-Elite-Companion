// Store the event callbacks
const eventCallbacks = {};

// Add event listener for 1 or more events
function on(eventType, callback) {
    var eventTypes = [];

    // Store event(s) in array
    if (typeof eventType === 'string') {
        eventType = eventType.toLowerCase();
        eventTypes.push(eventType);
    } else if (typeof eventType === 'object') {
        eventType.forEach(function(event) {
            event = event.toLowerCase();
            eventTypes.push(event);
        });
    }

    eventTypes.forEach(function(event) {
        // Ensure this event is listed
        if (typeof eventCallbacks[event] === "undefined") {
            eventCallbacks[event] = [];
        }

        // Add the callback
        eventCallbacks[event].push(callback);
    });
}

// Broadcast an event
function broadcast(eventType, eventData) {
    eventType = eventType.toLowerCase();

    // Ensure this event is listed
    if (typeof eventCallbacks[eventType] !== "undefined") {
        eventCallbacks[eventType].forEach(function(eventCallback) {
            // Is the callback still a function?
            if (typeof eventCallback === "function") {
                try {
                    eventCallback(eventData);
                } catch (error) {
                    console.error("Error in callback for event \"" + eventType + "\": " + (error.name || ""));
                    console.log(error.message);
                    console.log(error.stack);
                }
            } else {
                eventCallback = null;
            }
        });
    }
}

module.exports = {
    on,
    broadcast
};