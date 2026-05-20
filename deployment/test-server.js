import http from "node:http";

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
