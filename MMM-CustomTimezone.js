/* Magic Mirror
 * Module: MMM-CustomTimezone
 * 
 * By Assistant
 * Custom timezone display module
 */

Module.register("MMM-CustomTimezone", {
    // Default module config
    defaults: {
        timezone: "EST", // Default timezone abbreviation
        timeFormat: 12, // 12 or 24 hour format
        updateInterval: 1000, // Update every second
        showTimezone: true, // Show timezone abbreviation
        animationSpeed: 1000
    },

    // Timezone mapping from abbreviations to IANA timezone identifiers
    timezoneMap: {
        // North America
        "AST": "America/Halifax",       // Atlantic Standard Time
        "ADT": "America/Halifax",       // Atlantic Daylight Time
        "EST": "America/New_York",      // Eastern Standard Time
        "EDT": "America/New_York",      // Eastern Daylight Time
        "CST": "America/Chicago",       // Central Standard Time
        "CDT": "America/Chicago",       // Central Daylight Time
        "MST": "America/Denver",        // Mountain Standard Time
        "MDT": "America/Denver",        // Mountain Daylight Time
        "PST": "America/Los_Angeles",   // Pacific Standard Time
        "PDT": "America/Los_Angeles",   // Pacific Daylight Time
        "AKST": "America/Anchorage",    // Alaska Standard Time
        "AKDT": "America/Anchorage",    // Alaska Daylight Time
        "HST": "Pacific/Honolulu",      // Hawaii Standard Time
        
        // Europe
        "GMT": "Europe/London",         // Greenwich Mean Time
        "BST": "Europe/London",         // British Summer Time
        "CET": "Europe/Paris",          // Central European Time
        "CEST": "Europe/Paris",         // Central European Summer Time
        "EET": "Europe/Helsinki",       // Eastern European Time
        "EEST": "Europe/Helsinki",      // Eastern European Summer Time
        
        // Asia Pacific
        "JST": "Asia/Tokyo",            // Japan Standard Time
        "CST_CHINA": "Asia/Shanghai",   // China Standard Time
        "IST": "Asia/Kolkata",          // India Standard Time
        "AEST": "Australia/Sydney",     // Australian Eastern Standard Time
        "AEDT": "Australia/Sydney",     // Australian Eastern Daylight Time
        "AWST": "Australia/Perth",      // Australian Western Standard Time
        
        // Others
        "UTC": "UTC",                   // Coordinated Universal Time
        "NZST": "Pacific/Auckland",     // New Zealand Standard Time
        "NZDT": "Pacific/Auckland",     // New Zealand Daylight Time
    },

    // Define start sequence
    start: function() {
        Log.info("Starting module: " + this.name);
        this.lastTimeString = "";  // Track the last displayed time
        this.scheduleUpdate();
    },

    // Override dom generator
    getDom: function() {
        const wrapper = document.createElement("div");
        wrapper.className = "custom-timezone";

        const timeElement = document.createElement("div");
        timeElement.className = "time";
        
        const timezoneElement = document.createElement("span");
        timezoneElement.className = "timezone";

        // Convert timezone abbreviation to IANA timezone
        const ianaTimezone = this.timezoneMap[this.config.timezone.toUpperCase()] || this.config.timezone;

        // Get current time in specified timezone
        const now = new Date();
        const options = {
            timeZone: ianaTimezone,
            hour12: this.config.timeFormat === 12,
            hour: "2-digit",
            minute: "2-digit"
        };

        const timeString = now.toLocaleTimeString("en-US", options);
        
        // Use the configured timezone abbreviation for display
        let timezoneAbbr = this.config.timezone.toUpperCase();

        timeElement.innerHTML = timeString;
        if (this.config.showTimezone && timezoneAbbr) {
            timezoneElement.innerHTML = " " + timezoneAbbr;
            timeElement.appendChild(timezoneElement);
        }

        wrapper.appendChild(timeElement);
        
        // Store the current time string for comparison
        this.currentTimeString = timeString + (this.config.showTimezone ? " " + timezoneAbbr : "");
        
        return wrapper;
    },

    // Define required styles
    getStyles: function() {
        return ["MMM-CustomTimezone.css"];
    },

    // Schedule next update
    scheduleUpdate: function() {
        const self = this;
        setInterval(function() {
            self.checkForTimeChange();
        }, this.config.updateInterval);
        
        // Initial update
        this.updateDom(this.config.animationSpeed);
    },

    // Check if time has changed before updating DOM
    checkForTimeChange: function() {
        // Convert timezone abbreviation to IANA timezone
        const ianaTimezone = this.timezoneMap[this.config.timezone.toUpperCase()] || this.config.timezone;

        // Get current time in specified timezone
        const now = new Date();
        const options = {
            timeZone: ianaTimezone,
            hour12: this.config.timeFormat === 12,
            hour: "2-digit",
            minute: "2-digit"
        };

        const timeString = now.toLocaleTimeString("en-US", options);
        const timezoneAbbr = this.config.timezone.toUpperCase();
        const fullTimeString = timeString + (this.config.showTimezone ? " " + timezoneAbbr : "");

        // Only update DOM if the time has actually changed
        if (fullTimeString !== this.lastTimeString) {
            this.lastTimeString = fullTimeString;
            this.updateDom(this.config.animationSpeed);
        }
    }
});