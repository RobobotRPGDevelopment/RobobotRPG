const { createMenu } = require('../../utils/helpers/menuBuilder');

const data = {
    name: "show-options",
    description: "Show options using the menu",
}

module.exports = {
    name: "menu",
    description: "Test the menu",
    usage: "{prefix}menu",
    adminOnly: false,
    tag: "testing",
    async run(client, message, args, prefix) {
        const colors = [
            {
                label: "Blue",
                description: "This is the blue option",
                value: "blue"
            },
            {
                label: "Red",
                description: "This is the red option",
                value: "red"
            },
            {
                label: "Green",
                description: "This is the green option",
                value: "green"
            }
        ];
        
        // Create a menu using our utility
        await createMenu({
            message,
            items: colors,
            placeholder: "Select a color",
            // Custom select handler
            onSelect: async (interaction, selectedValues, items) => {
                const selectedLabels = selectedValues.map(value => 
                    items.find(item => item.value === value).label
                ).join(", ");
                
                await interaction.update({ 
                    content: `You selected: ${selectedLabels}! That's a great choice!`, 
                    components: interaction.message.components
                });
            },
            // Custom end handler
            onEnd: (collected, reply) => {
                if (collected.size === 0) {
                    reply.edit({ 
                        content: "You didn't select any colors. Menu closed.", 
                        components: [] 
                    });
                } else {
                    reply.edit({
                        content: `${reply.content} Menu closed.`,
                        components: []
                    });
                }
            }
        });
    },
    data
}