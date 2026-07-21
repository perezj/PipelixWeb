import { createReadStream } from "node:fs";
import { access, stat } from "node:fs/promises";
import { createServer } from "node:http";
import { resolve, sep } from "node:path";

const siteRoot = resolve("dist", "client");
const port = Number(process.env.PORT ?? 3000);
const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".rsc": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
};

function contentType(pathname) {
  const extension = pathname.slice(pathname.lastIndexOf("."));
  return contentTypes[extension] ?? "application/octet-stream";
}

async function fileForRequest(url) {
  const pathname = decodeURIComponent(url.pathname);
  const requestedPath = pathname === "/" ? "index.html" : pathname.slice(1);
  const filePath = resolve(siteRoot, requestedPath);
  if (filePath !== siteRoot && !filePath.startsWith(`${siteRoot}${sep}`)) return null;

  try {
    const file = await stat(filePath);
    return file.isDirectory() ? resolve(filePath, "index.html") : filePath;
  } catch {
    if (filePath.endsWith(".html")) return null;
    try {
      const htmlFilePath = `${filePath}.html`;
      await stat(htmlFilePath);
      return htmlFilePath;
    } catch {
      return null;
    }
  }
}

const server = createServer(async (request, response) => {
  if (!request.url || !["GET", "HEAD"].includes(request.method ?? "")) {
    response.writeHead(405, { Allow: "GET, HEAD" }).end();
    return;
  }

  let filePath;
  try {
    filePath = await fileForRequest(new URL(request.url, `http://${request.headers.host ?? "localhost"}`));
  } catch {
    filePath = null;
  }

  if (!filePath) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }).end("Not found");
    return;
  }

  response.writeHead(200, { "Content-Type": contentType(filePath) });
  if (request.method === "HEAD") {
    response.end();
    return;
  }
  createReadStream(filePath).pipe(response);
});

await access(siteRoot);
server.listen(port, "127.0.0.1", () => {
  console.log(`Static site available at http://localhost:${port}`);
});
