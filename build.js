#!/usr/bin/env node
/**
 * build.js — Script de build do acessibilidade-br
 * Copia src/index.js → dist/acessibilidade.js
 * Copia src/styles.css → dist/acessibilidade.css
 */

const fs = require("fs");
const path = require("path");

const root = __dirname;
const src = path.join(root, "src");
const dist = path.join(root, "dist");

// Garante que dist/ existe
if (!fs.existsSync(dist)) {
  fs.mkdirSync(dist, { recursive: true });
}

function copy(from, to) {
  fs.copyFileSync(from, to);
  const kb = (fs.statSync(to).size / 1024).toFixed(1);
  console.log(`  ✔  ${path.relative(root, from)}  →  ${path.relative(root, to)}  (${kb} KB)`);
}

console.log("\nacessibilidade-br — build\n");

copy(path.join(src, "index.js"),   path.join(dist, "acessibilidade.js"));
copy(path.join(src, "styles.css"), path.join(dist, "acessibilidade.css"));

console.log("\nBuild concluído!\n");
