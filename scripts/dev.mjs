import { spawn } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const args = process.argv.slice(2);
const option = (name, fallback) => {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] || fallback : fallback;
};

// sites-preview passes Vite-style flags. Translate them to Next's CLI.
const hostname = option("--host", option("--hostname", "0.0.0.0"));
const port = option("--port", "3000");
const child = spawn(process.execPath, [require.resolve("next/dist/bin/next"), "dev", "--hostname", hostname, "--port", port], {
  stdio: "inherit",
  env: process.env,
});
for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => child.kill(signal));
child.on("exit", (code) => process.exit(code ?? 0));
