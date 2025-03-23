├── commands/                  # Command definitions (organized by category)

│   ├── admin/                 # Admin-only commands
│   ├── info/                  # Informational commands
│   ├── bet.js                 # Betting commands
│   ├── roll.js                # Dice rolling
│   ├── createvote.js          # Voting creation
│   ├── balance.js             # Economy balance management
│   ├── endvote.js             # Ends an active vote
│   ├── flip.js                # Coin flip command
│   ├── vote.js                # Voting system
│
├── events/                    # Event handlers
│   ├── guildMemberAdd.js      # Event: New member joins
│   ├── interactionCreate.js   # Event: Slash command interaction
│   ├── ready.js               # Event: Bot ready state
│
├── utils/                     # Utility modules
│   ├── expirationCheck.js     # Handles automatic expiration of votes
│   ├── voteSchema.js          # Mongoose schema for vote tracking
│   ├── serverSettings.js      # Mongoose schema for server settings
│   ├── taskList.js            # Schema for task management
│   ├── userBalance.js         # Schema for user balances
│
├── config.json                # Configuration file for bot setup
├── deploy-commands.js         # Deployment script for slash commands
├── index.js                   # Main entry point of the bot
├── package.json               # Project dependencies and scripts
├── package-lock.json          # Dependency lock file

EXAMPLE COMMAND STRUCTURE: 
module.exports = {
    name: "roll",                  // Command name
    description: "Rolls dice.",    // Brief description
    usage: "{prefix}roll 1d20",    // How to use the command
    tag: "probability",            // Internal tag for sorting
    adminOnly: false,              // Restrict to admins only (false for this command)
    async run(client, message, args) {
        // Command logic
    },
};
