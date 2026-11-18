import * as pendo from "pendo-server-sdk";
import { createApp } from "./app.js";

// Pendo Agent Analytics: records the Tripwise Assistant's turns. Set PENDO_DISABLED=true to turn it off.
pendo.init({
  apiKey: "28295213-8355-456d-bfe4-53af84174634",
  agentId: "8NKf6QmSx8X6bx-bgYNA4d6GvtY",
  endpoint: "https://app.pendo-dev.pendo-dev.com",
  autoPatch: true,
});

const port = Number(process.env.PORT) || 3001;
const corsOrigin = process.env.CORS_ORIGIN ?? "http://localhost:5173";

const server = createApp(corsOrigin).listen(port, () => {
  console.log(`Tripwise API on port ${port}, allowing ${corsOrigin}`);
});

// Send Pendo's buffered events before the process exits.
server.on("close", () => {
  void pendo.shutdown();
});

for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.on(signal, async () => {
    await pendo.shutdown();
    process.exit(0);
  });
}
