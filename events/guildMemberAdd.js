const UserBalance = require('../utils/userBalance'); // Import the schema

module.exports = {
    name: 'guildMemberAdd',
    async execute(member) {
        try {
            // Check if the user already exists in the database
            const existingUser = await UserBalance.findOne({
                userId: member.id,
                guildId: member.guild.id,
            });

            if (!existingUser) {
                // Create a new balance entry for the user
                await UserBalance.create({
                    userId: member.id,
                    guildId: member.guild.id,
                });

                console.log(`Balance created for user ${member.id} in guild ${member.guild.id}`);
            } else {
                console.log(`User ${member.id} already exists in the database.`);
            }
        } catch (error) {
            console.error(`Error creating balance for user ${member.id}:`, error);
        }
    },
};
