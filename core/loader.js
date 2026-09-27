const fs = require("fs");
const path = require("path");
const CMD_DIR = path.join(__dirname, "..", "commands");

module.exports = async function loadCommands() {
  if (!fs.existsSync(CMD_DIR)) return;
  for (const file of fs.readdirSync(CMD_DIR).filter(f => f.endsWith(".js"))) {
    try {
      const cmd = require(path.join(CMD_DIR, file));
      if (cmd.config && cmd.run) global.bot.commands.set(cmd.config.name, cmd);
    } catch (e) {}
  }
};
