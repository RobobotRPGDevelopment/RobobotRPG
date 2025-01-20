module.exports = {
    name: "roll",
    description: "Rolls a specified number and type of dice.",
    usage: "{prefix}roll {x}d{y} (e.g., {prefix}roll 2d20)",
    adminOnly: false,
    tag: "chance", // Hidden tag for sorting
    async run(client, message, args) {
        // Validate input
        if (!args.length) {
            return message.reply("Usage: $roll {x}d{y} (e.g., $roll 2d20)");
        }

        const input = args[0];
        const diceRegex = /^(\d+)d(\d+)$/i;
        const match = input.match(diceRegex);

        if (!match) {
            return message.reply("Invalid format. Use: $roll {x}d{y} (e.g., $roll 2d20)");
        }

        const numberOfDice = parseInt(match[1], 10);
        const diceType = parseInt(match[2], 10);

        // Validate dice type
        const validDice = [4, 6, 8, 10, 12, 20];
        if (!validDice.includes(diceType)) {
            return message.reply(
                `Invalid dice type. Choose from: ${validDice.join(", ")}`
            );
        }

        // Validate number of dice
        if (numberOfDice < 1 || numberOfDice > 100) {
            return message.reply("You can roll between 1 and 100 dice.");
        }

        // Roll the dice
        const results = [];
        for (let i = 0; i < numberOfDice; i++) {
            results.push(Math.floor(Math.random() * diceType) + 1);
        }

        const total = results.reduce((sum, roll) => sum + roll, 0);

        // Respond with results
        message.reply(
            `You rolled ${numberOfDice}d${diceType}:\nResult: [${results.join(
                ", "
            )}]\nTotal: ${total}`
        );
    },
};
