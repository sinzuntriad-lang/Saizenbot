<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SAIZEN BOT — Dashboard Login</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; font-family: system-ui; }
    body { background: #0f0f23; color: #fff; min-height: 100vh; padding: 2rem; }
    .container { max-width: 500px; margin: 0 auto; }
    h1 { text-align: center; font-size: 2rem; margin-bottom: 2rem; background: linear-gradient(90deg, #f97316, #eab308); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .card { background: #1a1a2e; border-radius: 12px; padding: 1.5rem; margin-bottom: 1rem; border: 1px solid #2a2a4e; }
    .status { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem; }
    .dot { width: 12px; height: 12px; border-radius: 50%; background: #666; }
    .dot.online { background: #22c55e; box-shadow: 0 0 10px #22c55e; }
    .dot.logging { background: #eab308; animation: blink 1s infinite; }
    @keyframes blink { 0%{opacity:1} 50%{opacity:0.3} 100%{opacity:1} }
    .alert { padding: 0.75rem; border-radius: 8px; margin-bottom: 1rem; }
    .alert.error { background: rgba(239,68,68,0.2); border: 1px solid #ef4444; color: #fca5a5; }
    .alert.success { background: rgba(34,197,94,0.2); border: 1px solid #22c55e; color: #86efac; }
    input { width: 100%; padding: 0.75rem; margin: 0.5rem 0; border-radius: 8px; border: 1px solid #3a3a5e; background: #0f0f23; color: #fff; font-size: 1rem; }
    button { width: 100%; padding: 0.85rem; border: none; border-radius: 8px; font-size: 1rem; font-weight: bold; cursor: pointer; margin-top: 0.5rem; transition: 0.2s; }
    button:hover { transform: scale(1.02); }
    .btn-login { background: linear-gradient(90deg, #f97316, #eab308); color: #000; }
    .btn-on { background: #22c55e; color: #fff; }
    .btn-off { background: #ef4444; color: #fff; }
    .btn-logout { background: #3b82f6; color: #fff; }
    .stat-row { display: flex; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid #2a2a4e; }
    .label { color: #9ca3af; }
    .value { font-weight: 600; }
    .time { font-size: 0.8rem; color: #6b7280; margin-top: 0.5rem; }
  </style>
</head>
<body>
  <div class="container">
    <h1>🔥 SAIZEN BOT</h1>

    <% if (error) { %><div class="alert error"><%= error %></div><% } %>
    <% if (success) { %><div class="alert success"><%= success %></div><% } %>

    <div class="card">
      <div class="status">
        <div class="dot <%= stats.online ? 'online' : isLoggingIn ? 'logging' : '' %>"></div>
        <span>
          <%= stats.online ? '🟢 ONLINE' : isLoggingIn ? '🟡 NAGLA-LOGIN...' : '🔴 OFFLINE' %>
        </span>
      </div>

      <% if (!stats.online) { %>
        <form method="POST" action="/login">
          <input type="email" name="email" placeholder="📧 FB Email mo" required>
          <input type="password" name="password" placeholder="🔑 FB Password mo" required>
          <input type="password" name="dashPass" placeholder="🔐 Dashboard Password" required>
          <button class="btn-login" type="submit">🔐 MAG-LOGIN</button>
        </form>
      <% } else { %>
        <div class="stat-row">
          <span class="label">Halimaw Mode</span>
          <span class="value" style="color: <%= active ? '#22c55e' : '#ef4444' %>">
            <%= active ? '✅ ACTIVE' : '❌ OFF' %>
          </span>
        </div>
        <div class="stat-row">
          <span class="label">Messages Received</span>
          <span class="value"><%= stats.messagesReceived %></span>
        </div>
        <div class="stat-row">
          <span class="label">Replies Sent</span>
          <span class="value"><%= stats.repliesSent %></span>
        </div>
        <div class="stat-row">
          <span class="label">Started At</span>
          <span class="value time"><%= stats.startedAt || '—' %></span>
        </div>
        <div class="stat-row">
          <span class="label">Last Reply</span>
          <span class="value time"><%= stats.lastReply || '—' %></span>
        </div>

        <form method="POST" action="/toggle">
          <input type="hidden" name="dashPass" value="saizen123">
          <button class="<%= active ? 'btn-off' : 'btn-on' %>" type="submit">
            <%= active ? '🔴 TURN OFF' : '🟢 TURN ON' %>
          </button>
        </form>

        <form method="POST" action="/logout">
          <input type="hidden" name="dashPass" value="saizen123">
          <button class="btn-logout" type="submit" style="margin-top:0.75rem;">🚪 LOGOUT / BAGUHIN ACCOUNT</button>
        </form>
      <% } %>
    </div>

    <div class="card" style="text-align:center; opacity:0.6; font-size:0.9rem;">
      Commands: . = ON | .. = OFF | ... = STATUS
    </div>
  </div>
</body>
</html>
