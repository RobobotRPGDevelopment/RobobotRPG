module.exports = {
    name: "flip",
    description: "Flip a coin.",
    usage: "{prefix}flip",
    adminOnly: false,
    tag: "chance", // Hidden tag for sorting
    async run(client, message, args, prefix) {
        // Generate a random number for the coin flip
        const random = Math.floor(Math.random() * 6000); // 0 to 5999
        let result;

        if (random === 0) {
            result = "The coin landed on its side! 🎉 (1 in 6,000 odds)";
        } else if (random % 2 === 0) {
            result = "Heads";
        } else {
            result = "Tails";
        }

        // Reply with the result
        message.reply(result);
    },
};
