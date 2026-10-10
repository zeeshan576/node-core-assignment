const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const EventEmitter = require("node:events");

const { writeFile, readFile } = require("./fileSystem");

const PORT = 3000;
const events = new EventEmitter();

events.on("requestReceived", (url) => {
  console.log(`Request received: ${url}`);
});

const server = http.createServer(async (req, res) => {
  events.emit("requestReceived", req.url);

  // Route 1: Home page
  if (req.method === "GET" && req.url === "/") {
    const htmlPath = path.join(__dirname, "index.html");

    fs.readFile(htmlPath, "utf8", (error, content) => {
      if (error) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Could not load the home page.");
        return;
      }

      res.writeHead(200, {
        "Content-Type": "text/html; charset=utf-8",
      });
      res.end(content);
    });

    return;
  }

  // Route 2: API response
  if (req.method === "GET" && req.url === "/api") {
    res.writeHead(200, {
      "Content-Type": "application/json",
    });

    res.end(
      JSON.stringify({
        success: true,
        message: "Hello from Node.js HTTP server!",
      }),
    );

    return;
  }

  // Route 3: Write data to a file
  if (req.method === "GET" && req.url === "/write") {
    try {
      const message = await writeFile(
        "This data was written using Node.js fs module.",
      );

      res.writeHead(200, {
        "Content-Type": "text/plain; charset=utf-8",
      });
      res.end(message);
    } catch (error) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("File write failed.");
    }

    return;
  }

  // Route 4: Read data from a file
  if (req.method === "GET" && req.url === "/read") {
    try {
      const content = await readFile();

      res.writeHead(200, {
        "Content-Type": "text/plain; charset=utf-8",
      });
      res.end(content);
    } catch (error) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("File read failed.");
    }

    return;
  }

  // Route 5: Stream a file
  if (req.method === "GET" && req.url === "/stream") {
    const filePath = path.join(__dirname, "index.html");
    const stream = fs.createReadStream(filePath);

    stream.on("error", () => {
      if (!res.headersSent) {
        res.writeHead(500, { "Content-Type": "text/plain" });
      }

      res.end("Could not stream the file.");
    });

    res.writeHead(200, {
      "Content-Type": "text/html; charset=utf-8",
    });

    stream.pipe(res);
    return;
  }

  // Route 6: Handle unknown routes
  res.writeHead(404, {
    "Content-Type": "text/plain; charset=utf-8",
  });

  res.end("404 - Route not found");
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
