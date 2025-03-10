const mongoose = require('mongoose');

const userBalanceSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    guildId: { type: String, required: true },
    balance: { type: Number, default: 0 },
});

userBalanceSchema.index({ userId: 1, guildId: 1 }, { unique: true });

module.exports = mongoose.model('UserBalance', userBalanceSchema);