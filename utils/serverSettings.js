const mongoose = require('mongoose');

// Define the schema for server settings
const serverSettingsSchema = new mongoose.Schema({
    guildId: { type: String, required: true, unique: true }, // Guild ID
    prefix: { type: String, default: '?' }, // Default prefix
    currencyName: { type: String, default: "Coins" }, // Default currency name
    currencySymbol: { type: String, default: "$" }, // Default currency symbol
});

// Create and export the model
const serverSettings = mongoose.model('ServerSettings', serverSettingsSchema);

module.exports = serverSettings;
