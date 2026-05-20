#!/bin/bash
set -e

dnf update -y
dnf install -y nodejs npm git

mkdir -p /home/ec2-user/mini-jira
chown -R ec2-user:ec2-user /home/ec2-user/mini-jira

cat > /home/ec2-user/mini-jira/server.js <<'APP'
const http = require("http");

const PORT = 3000;
const HOST = "0.0.0.0";

const server = http.createServer((req, res) => {
  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok" }));
    return;
  }

  if (req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Mini Jira infrastructure is working");
    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not found");
});

server.listen(PORT, HOST, () => {
  console.log(`Mini Jira test server listening on http://${HOST}:${PORT}`);
});
APP

chown ec2-user:ec2-user /home/ec2-user/mini-jira/server.js

cat > /etc/systemd/system/mini-jira.service <<'SERVICE'
[Unit]
Description=Mini Jira test server
After=network.target

[Service]
Type=simple
User=ec2-user
WorkingDirectory=/home/ec2-user/mini-jira
ExecStart=/usr/bin/node /home/ec2-user/mini-jira/server.js
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
SERVICE

systemctl daemon-reload
systemctl enable mini-jira.service
systemctl start mini-jira.service
