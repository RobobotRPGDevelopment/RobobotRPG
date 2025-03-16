// async function createRecord(userID, guildID, settings, prefix, schema, successMessage, existsMessage, message, defaultProperty, defaultValue) {
//     const record = await schema.findOne({
//         userId: userID,
//         guildId: guildID,
//     });
//     if(record) {
//         if (message) {
//             message.reply(typeof existsMessage === 'function' ? existsMessage(prefix, settings) : existsMessage);
//         }
//         return record;
//     }
//     else {
//         let createData = {
//             userId: userID,
//             guildId: guildID,
//         };
//         if(defaultProperty && defaultValue !== undefined) {
//             createData[defaultProperty] = defaultValue;
//         }
//         const newRecord = await schema.create(createData);
//         if (message) {
//             message.reply(typeof successMessage === 'function' ? successMessage(prefix, settings) : successMessage);
//         }
//         return newRecord;
//     }
// }
// // Convert messages to functions that accept parameters
// const existingBankMessage = (prefix) => `You already have a bank account. Run ${prefix}balance to check your balance.`;
// const existingSkillsMessage = (prefix) => `You have already joined the village. Run ${prefix}skills to view your skill levels.`;
// const successBankMessage = (prefix, settings) => {
//     const currencyName = settings ? settings.currencyName : "Coins";
//     const currencySymbol = settings ? settings.currencySymbol : "$";
//     return `You opened a bank account. Your initial balance is: ${currencySymbol}0 ${currencyName}`;
// };
// const successSkillsMessage = (prefix) => `You joined the village. Run ${prefix}skills at any time to view your skill levels.`;

// module.exports = {
//     createRecord, 
//     existingBankMessage, 
//     existingSkillsMessage, 
//     successBankMessage, 
//     successSkillsMessage
// };
