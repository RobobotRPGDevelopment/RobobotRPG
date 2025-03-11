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
module.exports = {
    skillsList
};