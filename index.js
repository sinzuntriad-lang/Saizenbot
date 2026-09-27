const fs = require("fs");
const path = require("path");
const express = require("express");
const login = require("@dongdev/fca-unofficial");
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

// Dashboard Setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// ========== DASHBOARD PAGES ==========
app.get("/", (req, res) => {
  res.render("index", {
    stats: global.bot.stats,
    active: global.bot.active.get("halimaw") || false,
    isLoggingIn: global.bot.isLoggingIn
  });
});

// ========== LOGIN SA DASHBOARD ==========
app.post("/login", async (req, res) => {
  const { email, password, dashPass } = req.body;
  
  // Check dashboard password
  if (dashPass !== config.dashboard.password) {
    return res.render("index", {
      error: "❌ Maling Dashboard Password",
      stats: global.bot.stats,
      active: global.bot.active.get("halimaw") || false
    });
  }

  if (!email || !password) {
    return res.render("index", {
      error: "❌ Ilagay ang Email at Password",
      stats: global.bot.stats,
      active: global.bot.active.get("halimaw") || false
    });
  }

  if (global.bot.isLoggingIn || global.bot.stats.online) {
    return res.render("index", {
      error: "⚠️ Naka-login na o nagla-login — maghintay ka",
      stats: global.bot.stats,
      active: global.bot.active.get("halimaw") || false
    });
  }

  global.bot.isLoggingIn = true;

  // Burahin lumang session
  if (fs.existsSync(APPSTATE_PATH)) fs.unlinkSync(APPSTATE_PATH);

  console.log(`🔐 Nagla-login: ${email}`);

  login(
    { email, password },
    {
      forceLogin: true,
      listenEvents: true,
      autoMarkDelivery: false,
      autoMarkRead: false
    },
    async (err, api) => {
      if (err) {
        console.error("❌ Login failed:", err.message || err);
        global.bot.isLoggingIn = false;
        return res.render("index", {
          error: "❌ Login Failed: " + (err.message || "Suriin ang Email/Password"),
          stats: global.bot.stats,
          active: global.bot.active.get("halimaw") || false
        });
      }

      // Save session
      fs.writeFileSync(APPSTATE_PATH, JSON.stringify(api.getAppState(), null, 2));
      
      global.bot.api = api;
      global.bot.stats.online = true;
      global.bot.stats.startedAt = new Date().toLocaleString("en-PH", { timeZone: "Asia/Manila" });
      global.bot.isLoggingIn = false;

      await loadCommands();
      console.log("✅ BOT ONLINE — Galing sa Dashboard Login!");

      api.listenMqtt(async (err, event) => {
        if (err) return console.error("Listener error:", err);
        await handleMessage(event);
      });

      res.render("index", {
        success: "✅ NAKA-LOGIN NA! — Bot Online",
        stats: global.bot.stats,
        active: global.bot.active.get("halimaw") || false
      });
    }
  );
});

// Toggle ON/OFF
app.post("/toggle", (req, res) => {
  if (req.body.dashPass !== config.dashboard.password) {
    return res.send("Wrong password");
  }
  global.bot.active.set("halimaw", !global.bot.active.get("halimaw"));
  res.redirect("/");
});

// Logout
app.post("/logout", (req, res) => {
  if (req.body.dashPass !== config.dashboard.password) {
    return res.send("Wrong password");
  }
  global.bot.api = null;
  global.bot.stats.online = false;
  global.bot.active.set("halimaw", false);
  if (fs.existsSync(APPSTATE_PATH)) fs.unlinkSync(APPSTATE_PATH);
  res.redirect("/");
});

app.listen(config.dashboard.port, () => {
  console.log(`🌐 Dashboard: http://localhost:${config.dashboard.port}`);
});

// Auto-restart
process.on("uncaughtException", (err) => {
  console.error("🔴 Error:", err.message);
  setTimeout(() => process.exit(1), 8000);
});
