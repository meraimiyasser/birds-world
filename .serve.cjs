const http = require("http"), fs = require("fs"), path = require("path");
const root = __dirname, port = process.argv[2] || 8123;
const type = { ".html": "text/html;charset=utf-8", ".js": "text/javascript;charset=utf-8", ".css": "text/css", ".webmanifest": "application/manifest+json", ".svg": "image/svg+xml", ".json": "application/json" };
http.createServer((req, res) => {
  const p = decodeURIComponent(req.url.split("?")[0]);
  let f = path.join(root, p === "/" ? "/index.html" : p);
  if (!f.startsWith(root)) { res.writeHead(403).end(); return; }
  fs.readFile(f, (e, buf) => {
    if (e) { res.writeHead(404, { "Content-Type": "text/plain" }).end("404 " + p); return; }
    res.writeHead(200, { "Content-Type": type[path.extname(f)] || "application/octet-stream", "Cache-Control": "no-store" });
    res.end(buf);
  });
}).listen(port, "127.0.0.1", () => console.log("serving " + root + " on http://localhost:" + port));
