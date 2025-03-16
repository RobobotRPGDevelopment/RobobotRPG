// NEED TO PROPERLY ATTRIBUTED THIS CODE - ITS NOT MINE


const { createMenu } = require('../../utils/helpers/menuBuilder');

module.exports = {
    name: "simplemenu",
    description: "A simple menu example",
    usage: "{prefix}simplemenu",
    adminOnly: false,
    tag: "testing",
    async run(client, message, args, prefix) {
        // Simple example with minimal configuration
        const options = [
            { label: "Option 1", description: "First option" },
            { label: "Option 2", description: "Second option" },
            { label: "Option 3", description: "Third option" }
        ];
        
        // Using the menu builder with default handlers
        await createMenu({
            message,
            items: options,
            placeholder: "Choose an option"
        });
        
        // That's it! The utility handles everything else
    }
}; 