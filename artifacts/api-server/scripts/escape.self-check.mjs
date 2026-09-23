// Self-check for escapeHtml: fails if the escaping regresses.
// Transpiles the real source at runtime via esbuild so we test the shipped code.
import * as esbuild from "esbuild";
import fs from "node:fs";

const src = fs.readFileSync(new URL("../src/lib/html.ts", import.meta.url), "utf8");
const { code } = await esbuild.transform(src, { loader: "ts", format: "esm" });
const dataUri = "data:text/javascript;base64," + Buffer.from(code).toString("base64");
const { escapeHtml } = await import(dataUri);

const cases = [
  ["plain", "hello", "hello"],
  ["amp", "a&b", "a&amp;b"],
  ["tags", "<script>x</script>", "&lt;script&gt;x&lt;/script&gt;"],
  // The bug that was fixed: a bare quote used to break out of href="mailto:..."
  ["attr-injection", `" onmouseover="alert(1)`, "&quot; onmouseover=&quot;alert(1)"],
  ["single-quote", "it's", "it&#39;s"],
];

let ok = true;
for (const [name, input, expected] of cases) {
  const got = escapeHtml(input);
  const pass = got === expected;
  if (!pass) ok = false;
  console.log(`${pass ? "PASS" : "FAIL"} ${name}: ${JSON.stringify(got)}`);
}
console.log(ok ? "ALL ESCAPE CHECKS PASSED" : "ESCAPE CHECKS FAILED");
process.exit(ok ? 0 : 1);