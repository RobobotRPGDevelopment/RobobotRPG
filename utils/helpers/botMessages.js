skillsList = (userSkills) => 
{
 return (
 `Your current skills are leveled:\n
    Woodcutting: ${userSkills.woodcutting.level}
    Mining: ${userSkills.mining.level}
    Herbalism: ${userSkills.herbalism.level}
    Magic: ${userSkills.magic.level}
    Archery: ${userSkills.archery.level}
    Swordsmanship: ${userSkills.swordsmanship.level}
    Meditation: ${userSkills.meditation.level}`)
}
module.exports = {
    skillsList
};