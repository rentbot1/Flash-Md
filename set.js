const fs = require('fs-extra');
const { Sequelize } = require('sequelize');
if (fs.existsSync('set.env'))
    require('dotenv').config({ path: __dirname + '/set.env' });
const path = require("path");
const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined
    ? databasePath
    : process.env.DATABASE_URL;
module.exports = { session: process.env.SESSION_ID || 'FLASH-MD-WA-BOT;;;=>eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiMkNJZitSQTFZOHdVWkdIN29KNGc3UFBXd05Na2t6SjAyNjYxbEg4UW0wQT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiaUZjTDBhOEZIRjlhdmF4S0Vmd3JOZ3F2TmVJcDJYOGtsT3RXRzkzMmUzZz0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiIwTy9HVU1pbW5ZWlBuNWdtL0pqVzhIZmVvc1U1bFNnRjNBUzZlelVDR25vPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiI3S3oyS1R5NTZGc0JMT2ZleGpMUm8rM3kzWGJhWW1WdHRjR1hwWW5pSkdZPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IndBUERSd3VobG1nUXRDNlhZKzFteHRBRFJUOVNBSk85MUhEUWdmdSs4Rzg9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IlNRMTBhaHBWZkpDQnprVGxXRi93TzRybmpFN21LT1ZZUEJYRm9tSHRGaW89In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiRUN3ZXM4TXdGc1NkMEdVYzJxR1RnQ1pxREFCd1RHNVpxbW9PNjBGVW9WRT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiZjhuTkl6TUV6akozS3ZmdjZDVXZEUUZuaHVSL3dyT05lekpLdm9JcTFsbz0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkpnYjFPYU5qcG1Tc3hDNkJkL2hYTWFRY2JMMngrOHlhMnJYanhYckVqaVpWd0h4MXM4OE1YYXUycEdDZDU5dzZPUW91Rm9OOFJoeU8yT0hyMm9LbGh3PT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MjI0LCJhZHZTZWNyZXRLZXkiOiJ3L2RWUTZKYnRheC9QWVR5eXU3Y1M4TnRsTS9SSkt4RElsNGVKbTFlc2t3PSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W10sIm5leHRQcmVLZXlJZCI6MzEsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjozMSwiYWNjb3VudFN5bmNDb3VudGVyIjowLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hcmNoaXZlQ2hhdHMiOmZhbHNlfSwiZGV2aWNlSWQiOiI0anNkQmpiU1ROQ284c3VpUjhmbzVRIiwicGhvbmVJZCI6IjliODA1YjEwLThkZGQtNDY4MC04YmYzLWZmYzcyNTY4ZDJiOSIsImlkZW50aXR5SWQiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJxbGd3MytCZExxUS9MeG1WRFJRazVZMW9iWlk9In0sInJlZ2lzdGVyZWQiOnRydWUsImJhY2t1cFRva2VuIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiRGdwQ2dBMEY4djJMSXRGTko3ckk3TnpCc3RFPSJ9LCJyZWdpc3RyYXRpb24iOnt9LCJwYWlyaW5nQ29kZSI6IlFCVEZIWlM3IiwibWUiOnsiaWQiOiIyMzM1MDYzMTA2MDk6M0BzLndoYXRzYXBwLm5ldCJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDT3VSaUlZSUVJeUt1YlFHR0FFZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoiNmZoR1pPL21NSHo5bWI5d0xqanowa1NpeFg4bW5GREhJRW9ISzRIaUozdz0iLCJhY2NvdW50U2lnbmF0dXJlIjoieGEzSUs0MmJJd0F5cmo0cVhWc1ZtRkxoNG5oeGkzUHZ3bEgxdE95b2VPUXFFcWFYck9mU1NXK3RIWEt3K3hiL0J5c1NvTnJIQ2pZVGFmWVh4dTVNaVE9PSIsImRldmljZVNpZ25hdHVyZSI6Ikhlc0JETGNvYVN3YUV6Vkk1aWNxUW02RDRoNzVLMVFiTE1xell4SDZaTGl2QTBVK0xpd1l1azZHQ0xOM200TFE4a1dlMlNFdGkvQ045TjE4U0FRd2hRPT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiMjMzNTA2MzEwNjA5OjNAcy53aGF0c2FwcC5uZXQiLCJkZXZpY2VJZCI6MH0sImlkZW50aWZpZXJLZXkiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJCZW40Um1UdjVqQjgvWm0vY0M0NDg5SkVvc1YvSnB4UXh5QktCeXVCNGlkOCJ9fV0sInBsYXRmb3JtIjoiaXBob25lIiwibGFzdEFjY291bnRTeW5jVGltZXN0YW1wIjoxNzIwNTk5ODM0fQ==',
    PREFIXE: process.env.PREFIX || "+",
    OWNER_NAME: process.env.OWNER_NAME || "PakWay",
    OWNER_NUMBER : process.env.OWNER_NUMBER || "254105915061", 
             
    AUTO_VIEW_STATUS: process.env.AUTO_VIEW_STATUS || "off",
AUTOREAD_MESSAGES: process.env.AUTO_READ_MESSAGES || "off",
CHATBOT: process.env.CHAT_BOT || "off",
    AUTO_SAVE_STATUS: process.env.AUTO_SAVE_STATUS || 'off',
    BOT : process.env.BOT_NAME || 'FLASH-MD',
    OPENAI_API_KEY : process.env.OPENAI_API_KEY || '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',
    URL : process.env.BOT_MENU_LINKS || 'https://static.animecorner.me/2023/08/op2.jpg',
    MODE: process.env.BOT_MODE || "private",
    PM_PERMIT: process.env.PM_PERMIT || 'no',
    HEROKU_APP_NAME : process.env.HEROKU_APP_NAME,
    HEROKU_APY_KEY : process.env.HEROKU_API_KEY ,
    WARN_COUNT : process.env.WARN_COUNT || '3' ,
    PRESENCE : process.env.PRESENCE || '',
    //GPT : process.env.OPENAI_API_KEY || '',
    DP : process.env.STARTING_MESSAGE || "off",
    ADM : process.env.ANTI_DELETE_MESSAGE || 'on',
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgres://db_7xp9_user:6hwmTN7rGPNsjlBEHyX49CXwrG7cDeYi@dpg-cj7ldu5jeehc73b2p7g0-a.oregon-postgres.render.com/db_7xp9" : "postgres://db_7xp9_user:6hwmTN7rGPNsjlBEHyX49CXwrG7cDeYi@dpg-cj7ldu5jeehc73b2p7g0-a.oregon-postgres.render.com/db_7xp9",
    /* new Sequelize({
     dialect: 'sqlite',
     storage: DATABASE_URL,
     logging: false,
})
: new Sequelize(DATABASE_URL, {
     dialect: 'postgres',
     ssl: true,
     protocol: 'postgres',
     dialectOptions: {
         native: true,
         ssl: { require: true, rejectUnauthorized: false },
     },
     logging: false,
}),*/
};
let fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`mise à jour ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});
