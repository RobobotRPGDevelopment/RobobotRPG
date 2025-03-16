// NEED TO PROPERLY ATTRIBUTED THIS CODE - ITS NOT MINE



const { StringSelectMenuBuilder, ActionRowBuilder, StringSelectMenuOptionBuilder, ComponentType } = require('discord.js');

/**
 * Creates and handles a dropdown menu
 * @param {Object} options - Configuration options
 * @param {Object} options.message - The original message object
 * @param {Array} options.items - Array of menu items with label, description, and value
 * @param {String} options.placeholder - Placeholder text for the menu
 * @param {Number} options.minValues - Minimum number of selections (default: 1)
 * @param {Number} options.maxValues - Maximum number of selections (default: 1)
 * @param {Number} options.timeout - Time in ms before menu expires (default: 60000)
 * @param {Function} options.onSelect - Callback function when an option is selected (receives interaction and selectedValues)
 * @param {Function} options.onEnd - Callback function when collection ends (receives collected interactions)
 * @returns {Promise<Object>} - The reply message and collector
 */
async function createMenu({
    message,
    items,
    placeholder = "Select an option",
    minValues = 1,
    maxValues = 1,
    timeout = 60000,
    onSelect = null,
    onEnd = null
}) {
    // Create the select menu
    const selectMenu = new StringSelectMenuBuilder()
        .setCustomId(`menu-${message.author.id}-${Date.now()}`)
        .setPlaceholder(placeholder)
        .setMinValues(minValues)
        .setMaxValues(maxValues)
        .addOptions(
            items.map(item => new StringSelectMenuOptionBuilder()
                .setLabel(item.label)
                .setDescription(item.description || "")
                .setValue(item.value || item.label.toLowerCase())
            )
        );

    const actionRow = new ActionRowBuilder().addComponents(selectMenu);
    
    // Send the message with the dropdown menu
    const reply = await message.reply({
        content: placeholder,
        components: [actionRow],
        ephemeral: true
    });
    
    // Create a collector for interactions with this menu
    const collector = reply.createMessageComponentCollector({ 
        componentType: ComponentType.StringSelect,
        time: timeout
    });
    
    // Handle interactions
    collector.on('collect', async (interaction) => {
        // Only allow the original command user to interact with the menu
        if (interaction.user.id !== message.author.id) {
            return interaction.reply({ 
                content: "This menu is not for you!", 
                ephemeral: true 
            });
        }
        
        const selectedValues = interaction.values;
        
        // If custom handler is provided, use it
        if (onSelect && typeof onSelect === 'function') {
            await onSelect(interaction, selectedValues, items);
        } else {
            // Default handler
            if (selectedValues.length === 0) {
                await interaction.update({ 
                    content: "No options selected", 
                    components: [actionRow]
                });
            } else {
                const selectedLabels = selectedValues.map(value => 
                    items.find(item => (item.value || item.label.toLowerCase()) === value)?.label
                ).filter(Boolean).join(", ");
                
                await interaction.update({ 
                    content: `You selected: ${selectedLabels}`, 
                    components: [actionRow]
                });
            }
        }
    });
    
    // Handle when collection time expires
    collector.on('end', collected => {
        // If custom end handler is provided, use it
        if (onEnd && typeof onEnd === 'function') {
            onEnd(collected, reply);
        } else {
            // Default end handler
            if (collected.size === 0) {
                reply.edit({ 
                    content: "Menu expired without any selections.", 
                    components: [] 
                });
            } else {
                reply.edit({
                    content: reply.content,
                    components: []
                });
            }
        }
    });
    
    return { reply, collector };
}

module.exports = { createMenu }; 