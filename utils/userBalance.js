const mongoose = require('mongoose');

const userBalanceSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    guildId: { type: String, required: true },
    balance: { type: Number, default: 0 },
});

module.exports = mongoose.model('UserBalance', userBalanceSchema);
