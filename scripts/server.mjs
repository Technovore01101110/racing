// hot-server.mjs
import http from "http";
import fs from "fs";
import path from "path";
import { WebSocketServer } from "ws";
import { fileURLToPath } from "url";

const port = 3000;

// Resolve __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// HTTP server
const server = http.createServer((req, res) => {
  let filePath = req.url === "/" ? "../src/index.html" : "." + req.url;
  filePath = path.join(__dirname, filePath);

  const ext = path.extname(filePath).toLowerCase();

  const mimeTypes = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
  };

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("404 Not Found");
    } else {
      // Inject reload script into HTML files
      if (ext === ".html") {
        content =
          content.toString() +
          `
          <script>
            const ws = new WebSocket("ws://localhost:${port}");
            ws.onmessage = (e) => {
              console.log(e);
              if (e.data === "reload") location.reload();
            };
          </script>`;
      }
      res.writeHead(200, { "Content-Type": mimeTypes[ext] || "text/plain" });
      res.end(content, "utf-8");
    }
  });
});

// WebSocket server
const wss = new WebSocketServer({ server });

// Watch files for changes
fs.watch(
  path.join(__dirname, ".."),
  { recursive: true },
  (eventType, filename) => {
    if (filename) {
      wss.clients.forEach((client) => {
        if (client.readyState === 1) {
          client.send("reload");
        }
      });
    }
  }
);

server.listen(port, () => {
  console.log(`Hot reload server running at http://localhost:${port}/`);
});
