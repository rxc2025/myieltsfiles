import { readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const rootPath = path.resolve("files");
const extensions = {
  html: "html", htm: "html",
  pdf: "document", doc: "document", docx: "document", md: "document", txt: "document",
  jpg: "image", jpeg: "image", png: "image", gif: "image", svg: "image", webp: "image", avif: "image",
  mp4: "video", webm: "video", mov: "video",
  mp3: "audio", wav: "audio", m4a: "audio", ogg: "audio",
  zip: "archive", rar: "archive", "7z": "archive", tar: "archive", gz: "archive",
  js: "code", mjs: "code", cjs: "code", ts: "code", css: "code", json: "code",
  jsx: "code", tsx: "code", py: "code", java: "code", c: "code", cpp: "code",
  other: "other"
};
const labels = {
  html: "HTML", document: "文档", image: "图片", video: "视频",
  audio: "音频", archive: "压缩文件", code: "代码", other: "文件"
};

async function scanDirectory(directory, relativeDirectory = "") {
  const entries = await readdir(directory, { withFileTypes: true });
  const children = [];

  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name, "zh-CN"))) {
    if (entry.name.startsWith(".")) continue;
    const absolutePath = path.join(directory, entry.name);
    const relativePath = path.posix.join(relativeDirectory, entry.name);

    if (entry.isDirectory()) {
      children.push({
        name: entry.name,
        type: "folder",
        children: await scanDirectory(absolutePath, relativePath)
      });
      continue;
    }

    if (!entry.isFile()) continue;
    const metadata = await stat(absolutePath);
    const extension = path.extname(entry.name).slice(1).toLowerCase();
    const fileType = extensions[extension] || "other";
    const name = path.basename(entry.name, path.extname(entry.name));

    children.push({
      name,
      type: fileType,
      category: fileType,
      fileType,
      meta: `${labels[fileType]} · ${formatSize(metadata.size)}`,
      size: formatSize(metadata.size),
      modified: metadata.mtime.toISOString().slice(0, 10),
      url: path.posix.join("files", relativePath)
    });
  }

  return children;
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

const manifest = {
  name: "所有文件",
  type: "folder",
  children: await scanDirectory(rootPath)
};

await writeFile(
  path.resolve("files-manifest.js"),
  `window.FILE_MANIFEST = ${JSON.stringify(manifest, null, 2)};\n`,
  "utf8"
);
console.log(`Indexed ${countFiles(manifest)} files from files/.`);

function countFiles(folder) {
  return folder.children.reduce((count, item) =>
    count + (item.type === "folder" ? countFiles(item) : 1), 0);
}
