skillsList = (userSkills) => 
{
 return (
 `Your current skills are leveled:\n
    Woodcutting: ${userSkills.skills.woodcutting.level}
    Mining: ${userSkills.skills.mining.level}
    Herbalism: ${userSkills.skills.herbalism.level}
    Magic: ${userSkills.skills.magic.level}
    Archery: ${userSkills.skills.archery.level}
    Swordsmanship: ${userSkills.skills.swordsmanship.level}
    Meditation: ${userSkills.skills.meditation.level}`)
}
taskList = (tasks) => {
    return (
        `Your current tasks are:\n
        ${tasks.map(task => `${task.name} - ${task.category} - ${task.difficulty}`).join("\n")}`
    )
}
questList = (quests) => {
    message = "";
    if (quests.activeQuest.name != undefined) {
        console.log(quests.activeQuest);
        message += `Active Quest:\n${quests.activeQuest.name}\n${quests.activeQuest.description}\nDifficulty: ${quests.activeQuest.difficulty}\n`;
    }
    if (quests.availableQuests.length > 0) {
        console.log(quests.availableQuests);
        message += `Available Quests:\n${quests.availableQuests.map(quest => `${quest.name} - ${quest.description} - ${quest.difficulty}`).join("\n")}`;
    }
    return message;
}
module.exports = {
    skillsList,
    taskList,
    questList
};