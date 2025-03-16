const TaskService = require("../../utils/services/taskService");
const MenuBuilder = require("../../utils/helpers/menuBuilder");
module.exports = {
    name: "finishtask",
    description: "Mark a task as completed.",
    usage: '{prefix}finishtask {optional: "Task Name"}',
    adminOnly: false,
    tag: "tasks",
    async run(client, message, args, prefix) {
        if (args.length < 1) {
            try {
                const tasks = await TaskService.findByUser(message.author.id, message.guild.id);
                const options = [];
                tasks.forEach(t => {
                    options.push({
                        label: t.name,
                        description: t.category ? `Category: ${t.category}` : "No category",
                        value: t.name_lower
                    })
                });
                await MenuBuilder.createMenu({
                    message: message,
                    items: options,
                    placeholder: "Select a task to complete",
                    minValues: 1,
                    maxValues: 1,
                    timeout: 60000,
                    onSelect: async (interaction, selectedValues) => {
                        const taskName = selectedValues[0];
                        await interaction.update({ content: `Completing task: ${taskName}...`, components: [] });
                        await this.run(client, message, [taskName], prefix);
                    },
                    // onEnd: async (interaction) => {
                    //     console.log("Menu closed");
                    // }
                });
            }
            catch(error) {
                console.error(`Error in finishtask command:`, error);
                message.reply(`Error: ${error.message}`);
            }
        }
        else {
            const taskName = args[0];
            try {
                const {task, err, didYouMean} = await TaskService.finishTask(message.author.id, message.guild.id, taskName);
                
                if (err === "Task not found") {
                    console.log("did you mean: " + didYouMean);
                    if (didYouMean) {
                        client.nextMessageAuthor = message.author.id;
                        client.nextMessageHandler = async (client, message) => {
                            console.log("running next message handler");
                            const answer = message.content;
                            if (answer.toLowerCase() === "yes") {
                                await this.run(client, message, [didYouMean], prefix);
                            }
                            client.listenNextMessage = false;
                        }
                        client.listenNextMessage = true;
                        return message.reply(`Did you mean ${didYouMean}? Reply yes or no.`);
                    } else {
                        message.reply(`Task ${taskName} not found.`);
                        //TODO: return menubuilder which allows to select the task
                    }
                }
                if (task) {
                    message.reply(`Task ${taskName} marked as completed.`);
                }
            }
            catch(error) {
                console.error(`Error in finishtask command:`, error);
                message.reply(`Error: ${error.message}`);
            }    
        }
    }
};