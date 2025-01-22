const UserBalance = require('../utils/userBalance'); // Import user balance schema
const serverSettings = require('../utils/serverSettings'); // Import server settings

module.exports = {
    name: "bet",
    description: "Place a bet on a chained command like {prefix}flip or {prefix}roll.",
    usage: "{prefix}bet {chained command} {arguments} {amount} (e.g., {prefix}bet {prefix}roll 1d20 15 50)",
    adminOnly: false,
    tag: "chance", // Hidden tag for sorting
    async run(client, message, args, prefix) {
        // Validate input
        if (args.length < 3) {
            return message.reply(
                `Usage: ${prefix}bet ${prefix}roll {x}d{y} {condition/number} {amount} (e.g., ${prefix}bet ${prefix}roll 1d20 15 50)`
            );
        }

        const chainedCommand = args[0].toLowerCase(); // e.g., $roll
        const rollParams = args[1]; // e.g., 1d20
        const conditionOrNumber = args[2].toLowerCase(); // e.g., over, under, or exact number
        const betAmount = parseFloat(args[args.length - 1]); // The last argument is the bet amount

        // Validate bet amount
        if (isNaN(betAmount) || betAmount <= 0) {
            return message.reply("Please provide a valid bet amount greater than 0.");
        }

        // Validate dice roll parameters
        const rollRegex = /^(\d+)d(\d+)$/i;
        const match = rollParams.match(rollRegex);
        if (!match) {
            return message.reply("Invalid dice format. Use {x}d{y} (e.g., 1d20).");
        }
        const numDice = parseInt(match[1]);
        const diceType = parseInt(match[2]);

        if (isNaN(numDice) || isNaN(diceType) || numDice < 1 || diceType < 2) {
            return message.reply("Invalid dice format. Use {x}d{y} (e.g., 1d20).");
        }

        // Fetch user balance
        const userBalance = await UserBalance.findOne({
            userId: message.author.id,
            guildId: message.guild.id,
        });

        if (!userBalance) {
            return message.reply(
                "You do not have a balance record. Try rejoining the server or ask an admin to refresh your balance."
            );
        }

        // Check if the user has enough balance
        if (userBalance.balance < betAmount) {
            return message.reply(
                `You do not have enough balance to place this bet. Your current balance is ${userBalance.balance}.`
            );
        }

        // Deduct the bet amount
        userBalance.balance -= betAmount;
        await userBalance.save();

        // Roll the dice
        const rolls = [];
        for (let i = 0; i < numDice; i++) {
            rolls.push(Math.floor(Math.random() * diceType) + 1);
        }
        const total = rolls.reduce((sum, roll) => sum + roll, 0);

        let win = false;
        let payoutMultiplier = 0;
        let odds = 0;
        let result = "";

        // Determine condition (Exact if a single number is specified, Over/Under if a condition is specified)
        if (!isNaN(conditionOrNumber)) {
            const exactNumber = parseInt(conditionOrNumber);

            // Exact Match Logic
            win = total === exactNumber;
            const probability = 1 / diceType ** numDice; // Exact match probability
            payoutMultiplier = 1 / probability; // Inverse of probability for payout
            odds = (probability * 100).toFixed(2); // Convert to percentage
            result = `Roll: [${rolls.join(", ")}]`;
        } else if (conditionOrNumber === "over") {
            const range = parseInt(args[3]);
            win = total > range;
            odds = ((numDice * diceType - range) / (numDice * diceType) * 100).toFixed(2); // Over odds
            payoutMultiplier = 1 + (1 - (range / (numDice * diceType))) * 1.5;
            result = `Roll: [${rolls.join(", ")}]`;
        } else if (conditionOrNumber === "under") {
            const range = parseInt(args[3]);
            win = total < range;
            odds = ((range / (numDice * diceType)) * 100).toFixed(2); // Under odds
            payoutMultiplier = 1 + (range / (numDice * diceType)) * 1.5;
            result = `Roll: [${rolls.join(", ")}]`;
        } else {
            return message.reply(
                "Invalid condition or number. Use 'over', 'under', or a single number for exact match."
            );
        }

        // Calculate payout
        const payout = win ? betAmount * payoutMultiplier : 0;

        // Simplify output for single-dice rolls
        if (numDice === 1) {
            result = `Roll: [${rolls[0]}]`;
        } else {
            result = `Roll: [${rolls.join(", ")}] (Total: ${total})`;
        }

        // Reward if the user wins
        if (win) {
            userBalance.balance += payout;
            await userBalance.save();
            return message.reply(
                `${result}\nOdds: ${odds}%\nYou won ${payout.toFixed(
                    2
                )} coins! Your new balance is ${userBalance.balance.toFixed(2)}.`
            );
        } else {
            return message.reply(
                `${result}\nOdds: ${odds}%\nYou lost ${betAmount.toFixed(
                    2
                )} coins. Your new balance is ${userBalance.balance.toFixed(2)}.`
            );
        }
    },
};
