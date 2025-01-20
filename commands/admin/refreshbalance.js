const UserBalance = require('../../utils/userBalance'); // Import the schema

module.exports = {
    name: "refreshbalance",
    description: "Refresh balance records for all server members.",
    usage: "{prefix}refreshbalance",
    adminOnly: true,
    tag: "admin", // Hidden tag for sorting
    async run(client, message, args) {
        if (!message.member.permissions.has("Administrator")) {
            return message.reply("You do not have permission to use this command.");
        }

        try {
            const members = await message.guild.members.fetch();

            let createdCount = 0;

            for (const member of members.values()) {
                if (member.user.bot) continue;

                const existingRecord = await UserBalance.findOne({
                    userId: member.user.id,
                    guildId: message.guild.id,
                });

                if (!existingRecord) {
                    await UserBalance.create({
                        userId: member.user.id,
                        guildId: message.guild.id,
                    });
                    createdCount++;
                }
            }

            message.reply(
                `Balance refresh complete. ${createdCount} new balance records were created.`
            );
        } catch (error) {
            console.error("Error refreshing balance records:", error);
            message.reply("An error occurred while refreshing balance records. Please try again later.");
        }
    },
};
