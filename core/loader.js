const fs = require("fs");
const path = require("path");
const CMD_DIR = path.join(__dirname, "..", "commands");

module.exports = async function loadCommands() {
  if (!fs.existsSync(CMD_DIR)) return;
  const files = fs.readdirSync(CMD_DIR).filter(f => f.endsWith(".js"));
  for (const file of files) {
    try {
      const cmd = require(path.join(CMD_DIR, file));
      if (cmd.config && cmd.run) {
        global.bot.commands.set(cmd.config.name, cmd);
        console.log(`✅ Loaded: ${cmd.config.name}`);
      }
    } catch (e) {
      console.log(`⚠️ Failed: ${file}`);
    }
  }
};
