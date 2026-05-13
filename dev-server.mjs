// Programmatic Next dev server — bypasses the buggy `next/dist/bin/next` CLI
// which has CJS↔ESM interop failures under Node 20+ for some installs.
import http from "node:http";
import next from "next";

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev, hostname: "localhost", port });
const handle = app.getRequestHandler();

await app.prepare();

http.createServer((req, res) => handle(req, res)).listen(port, () => {
  console.log(`▲ Elevations247 dev ready at http://localhost:${port}`);
});
