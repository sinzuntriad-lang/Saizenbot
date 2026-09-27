const { api, config, commands, active, stats } = global.bot;
const replied = new Set();

function react(emoji, mid) {
  try { api.setMessageReaction(emoji, mid, () => {}); } catch (e) {}
}

module.exports = async function handleMessage(event) {
  const { threadID, senderID, body, messageID } = event;
  if (!api || !body || senderID === api.getCurrentUserID()) return;
  stats.messagesReceived++;
  const msg = body.trim();
  const isOwner = String(senderID) === String(config.ownerID);

  if (msg === "." && isOwner) {
    active.set("halimaw", true); replied.clear();
    react(config.halimaw.cmdReact, messageID); return;
  }
  if (msg === ".." && isOwner) {
    active.set("halimaw", false); replied.clear();
    react(config.halimaw.cmdReact, messageID); return;
  }
  if (msg === "..." && isOwner) {
    react(config.halimaw.cmdReact, messageID); return;
  }
  if (!active.get("halimaw") || replied.has(messageID)) return;
  replied.add(messageID);
  if (Math.random() > config.halimaw.replyChance) return;
  const halimaw = commands.get("halimaw");
  if (halimaw) await halimaw.run({ api, event, react, stats });
};
