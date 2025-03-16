async function newQuestFromTask(client, task) {
    const quest = await Quest.create({
        name: task.name,
        description: task.description,
        reward: task.reward
    });
}

module.exports = {
    name: 'newQuestFromTask',
    async execute(client, task) {
        await newQuestFromTask(client, task);
    }
}