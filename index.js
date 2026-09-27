const fs = require("fs");
const path = require("path");
const express = require("express");
const login = require("fca-unofficial");
const config = require("./config");
const loadCommands = require("./core/loader");
const handleMessage = require("./core/handler");

const APPSTATE_PATH = path.join(__dirname, "appstate.json");
const app = express();

global.bot = {
  api: null,
  isLoggingIn: false,
  config,
  commands: new Map(),
  active: new Map(),
  stats: {
    online: false,
    repliesSent: 0,
    messagesReceived: 0,
    startedAt: null,
    lastReply: null
  }
};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index", {
    stats: global.bot.stats,
    active: global.bot.active.get("halimaw") || false,
    isLoggingIn: global.bot.isLoggingIn
  });
});

app.post("/login", async (req, res) => {
  const { email, password, dashPass } = req.body;
  
  if (dashPass !== config.dashboard.password) {
    return res.render("index", { error: "❌ Maling Dashboard Password", stats: global.bot.stats, active: false });
  }
  if (!email || !password) {
    return res.render("index", { error: "❌ Ilagay ang Email at Password", stats: global.bot.stats, active: false });
  }
  if (global.bot.isLoggingIn || global.bot.stats.online) {
    return res.render("index", { error: "⚠️ Naka-login na", stats: global.bot.stats, active: global.bot.active.get("halimaw") });
  }

  global.bot.isLoggingIn = true;
  if (fs.existsSync(APPSTATE_PATH)) fs.unlinkSync(APPSTATE_PATH);

  login({ email, password }, {
    forceLogin: true,
    listenEvents: true,
    autoMarkDelivery: false,
    autoMarkRead: false
  }, async (err, api) => {
    if (err) {
      global.bot.isLoggingIn = false;
      return res.render("index", { error: "❌ Login Failed: " + (err.message || "Suriin ang credentials"), stats: global.bot.stats, active: false });
    }
    fs.writeFileSync(APPSTATE_PATH, JSON.stringify(api.getAppState(), null, 2));
    global.bot.api = api;
    global.bot.stats.online = true;
    global.bot.stats.startedAt = new Date().toLocaleString("en-PH", { timeZone: "Asia/Manila" });
    global.bot.isLoggingIn = false;
    await loadCommands();
    api.listenMqtt(async (err, event) => { if (!err) await handleMessage(event); });
    res.render("index", { success: "✅ NAKA-LOGIN NA!", stats: global.bot.stats, active: global.bot.active.get("halimaw") });
  });
});

app.post("/toggle", (req, res) => {
  if (req.body.dashPass !== config.dashboard.password) return res.send("Wrong");
  global.bot.active.set("halimaw", !global.bot.active.get("halimaw"));
  res.redirect("/");
});

app.post("/logout", (req, res) => {
  if (req.body.dashPass !== config.dashboard.password) return res.send("Wrong");
  global.bot.api = null;
  global.bot.stats.online = false;
  global.bot.active.set("halimaw", false);
  if (fs.existsSync(APPSTATE_PATH)) fs.unlinkSync(APPSTATE_PATH);
  res.redirect("/");
});

const PORT = config.dashboard.port || process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Dashboard: Port ${PORT}`));

process.on("uncaughtException", (err) => console.error("Error:", err.message));
