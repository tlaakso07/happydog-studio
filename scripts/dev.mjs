import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const [mode, ...args] = process.argv.slice(2);
if (mode !== "beta" && mode !== "live") {
  console.error("Choose beta or live development mode.");
  process.exit(1);
}
const web = new URL("../apps/web/", import.meta.url);
const require = createRequire(new URL("package.json", web));
const child = spawn(
  process.execPath,
  [require.resolve("next/dist/bin/next"), "dev", "--webpack", ...args],
  {
    cwd: fileURLToPath(web),
    stdio: "inherit",
    env: { ...process.env, STUDIO_MODE: mode === "beta" ? "preview" : "live" },
  },
);
for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => child.kill(signal));
}
child.on("error", (error) => {
  console.error(error.message);
  process.exitCode = 1;
});
child.on("exit", (code) => {
  process.exitCode = code ?? 1;
});
