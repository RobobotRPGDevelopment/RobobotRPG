const TaskService = require("../../utils/services/taskService");
const SkillsService = require("../../utils/services/skillsService");
module.exports = {
    name: "finishtask",
    description: "Mark a task as completed.",
    usage: '{prefix}finishtask {optional: "Task Name"}',
    adminOnly: false,
    tag: "tasks",
    async run(client, message, args, prefix) {
        if (args.length < 1) {
            //TODO return menubuilder which allows to select the task
        }
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
};