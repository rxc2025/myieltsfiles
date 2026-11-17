const state = {
  folders: [],
  files: [],
  currentFolder: "",
  currentView: "all",
  currentType: "全部类型",
  selectedPath: "",
  grid: false,
};

const typeFilters = ["全部类型", "网页课件", "Word 文档", "PDF 文档", "图片", "文本文件"];
const $ = (selector) => document.querySelector(selector);

function folderName(path) {
  return path ? path.split("/").pop() : "全部材料";
}

function iconInfo(file) {
  const ext = file.extension;
  if ([".html", ".htm"].includes(ext)) return { label: "HTML", style: "html" };
  if ([".doc", ".docx", ".pdf", ".pptx", ".xlsx"].includes(ext)) return { label: ext.slice(1).toUpperCase(), style: "doc" };
  if ([".png", ".jpg", ".jpeg", ".gif", ".webp"].includes(ext)) return { label: "IMG", style: "image" };
  return { label: ext ? ext.slice(1, 5).toUpperCase() : "FILE", style: "text" };
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(value) {
  const date = new Date(value);
  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}`;
}

function renderTree() {
  const counts = new Map();
  for (const file of state.files) {
    const parts = file.path.split("/");
    for (let index = 0; index < parts.length - 1; index += 1) {
      const path = parts.slice(0, index + 1).join("/");
      counts.set(path, (counts.get(path) || 0) + 1);
    }
  }
  $("#folder-tree").innerHTML = state.folders.map((folder) => {
    const depth = folder.path.split("/").length - 1;
    return `<button class="folder-node ${state.currentFolder === folder.path ? "selected" : ""}" data-folder="${escapeAttr(folder.path)}" style="padding-left:${9 + depth * 13}px" title="${escapeAttr(folder.path)}"><span class="folder-glyph">▰</span><span class="folder-label">${escapeHtml(folder.name)}</span><span class="folder-total">${counts.get(folder.path) || 0}</span></button>`;
  }).join("");
  $("#folder-tree").querySelectorAll("[data-folder]").forEach((button) => {
    button.addEventListener("click", () => selectFolder(button.dataset.folder));
  });
}

function renderBreadcrumbs() {
  const pieces = state.currentFolder ? state.currentFolder.split("/") : [];
  let path = "";
  const crumbs = [`<button class="crumb ${pieces.length ? "" : "current"}" data-crumb="">全部材料</button>`];
  pieces.forEach((piece, index) => {
    path = path ? `${path}/${piece}` : piece;
    crumbs.push(`<span class="crumb-sep">›</span><button class="crumb ${index === pieces.length - 1 ? "current" : ""}" data-crumb="${escapeAttr(path)}">${escapeHtml(piece)}</button>`);
  });
  $("#breadcrumbs").innerHTML = crumbs.join("");
  $("#breadcrumbs").querySelectorAll("[data-crumb]").forEach((button) => {
    button.addEventListener("click", () => selectFolder(button.dataset.crumb));
  });
}

function getVisibleFiles() {
  const query = $("#search-input").value.trim().toLocaleLowerCase();
  return state.files.filter((file) => {
    const inFolder = !state.currentFolder || file.path.startsWith(`${state.currentFolder}/`);
    const inView = state.currentView !== "recent" || Date.now() - new Date(file.modified).getTime() < 30 * 24 * 60 * 60 * 1000;
    const inType = state.currentType === "全部类型" || file.kind === state.currentType;
    const matches = !query || `${file.name} ${file.path} ${file.kind} ${file.preview}`.toLocaleLowerCase().includes(query);
    return inFolder && inView && inType && matches;
  });
}

function renderChips() {
  $("#type-chips").innerHTML = typeFilters.map((type) =>
    `<button class="type-chip ${state.currentType === type ? "selected" : ""}" data-type="${escapeAttr(type)}">${escapeHtml(type)}</button>`
  ).join("");
  $("#type-chips").querySelectorAll("[data-type]").forEach((button) => {
    button.addEventListener("click", () => {
      state.currentType = button.dataset.type;
      renderChips();
      renderFiles();
    });
  });
}

function renderFiles() {
  const files = getVisibleFiles();
  const list = $("#file-list");
  list.classList.toggle("grid", state.grid);
  $("#result-count").textContent = `共 ${files.length} 个项目`;
  $("#empty-state").hidden = files.length > 0;
  list.hidden = files.length === 0;
  list.innerHTML = files.map((file) => {
    const icon = iconInfo(file);
    return `<div class="file-row ${file.path === state.selectedPath ? "selected" : ""}" role="listitem" tabindex="0" data-file="${escapeAttr(file.path)}" title="双击打开 ${escapeAttr(file.name)}">
      <div class="file-name-cell"><div class="file-icon ${icon.style}">${icon.label}</div><div style="min-width:0"><div class="file-name">${escapeHtml(file.name)}</div><div class="file-path">${escapeHtml(file.path)}</div></div></div>
      <span class="file-type">${escapeHtml(file.kind)}</span><span class="file-date">${formatDate(file.modified)}</span><span class="file-size">${formatSize(file.size)}</span>
    </div>`;
  }).join("");
  list.querySelectorAll("[data-file]").forEach((row) => {
    const file = state.files.find((item) => item.path === row.dataset.file);
    row.addEventListener("click", () => selectFile(file));
    row.addEventListener("dblclick", () => openFile(file));
    row.addEventListener("keydown", (event) => {
      if (event.key === "Enter") openFile(file);
    });
  });
  $("#status-left").textContent = `${files.length} 个项目`;
  if (state.selectedPath && !files.some((file) => file.path === state.selectedPath)) {
    state.selectedPath = "";
    renderDetails(null);
  }
}

function renderDetails(file) {
  const pane = $("#details-pane");
  if (!file) {
    pane.innerHTML = `<div class="details-empty"><div class="empty-preview-icon">▧</div><strong>选择一个文件</strong><span>文件信息和内容摘要会显示在这里</span></div>`;
    return;
  }
  const icon = iconInfo(file);
  const preview = file.preview
    ? `<div class="preview-text">${escapeHtml(file.preview)}</div>`
    : `<div class="preview-placeholder">此文件类型暂不支持文字摘要，可打开原文件查看完整内容。</div>`;
  pane.innerHTML = `<div class="detail-content">
    <div class="detail-file-icon ${icon.style}">${icon.label}</div>
    <div class="detail-name">${escapeHtml(file.name)}</div>
    <div class="detail-kind">${escapeHtml(file.kind)}</div>
    <a class="open-button" href="${escapeAttr(file.url)}" target="_blank" rel="noopener">打开文件 <span aria-hidden="true">↗</span></a>
    <div class="detail-section-title">文件信息</div>
    <dl class="detail-info"><dt>位置</dt><dd>${escapeHtml(file.path)}</dd><dt>大小</dt><dd>${formatSize(file.size)}</dd><dt>修改</dt><dd>${formatDate(file.modified)}</dd></dl>
    <div class="detail-section-title">内容摘要</div>${preview}
  </div>`;
}

function renderHeading() {
  const title = state.currentView === "recent" ? "最近更新" : folderName(state.currentFolder);
  $("#page-title").textContent = title;
  $("#page-subtitle").textContent = state.currentFolder
    ? `查看 ${state.currentFolder} 中的文件，双击即可打开`
    : "浏览并打开 materials 文件夹中的学习资料";
}

function selectFolder(path) {
  state.currentFolder = path;
  state.currentView = "all";
  state.selectedPath = "";
  document.querySelectorAll(".nav-item").forEach((item) => item.classList.toggle("active", item.dataset.view === "all" && !path));
  renderTree();
  renderBreadcrumbs();
  renderHeading();
  renderFiles();
  renderDetails(null);
}

function selectFile(file) {
  if (!file) return;
  state.selectedPath = file.path;
  renderFiles();
  renderDetails(file);
}

function openFile(file) {
  if (file) window.open(file.url, "_blank", "noopener");
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[char]);
}

function escapeAttr(value) {
  return escapeHtml(value);
}

async function loadFiles() {
  const button = $("#refresh-button");
  button.classList.add("spinning");
  $("#result-count").textContent = "正在读取材料…";
  try {
    const response = await fetch("./data.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    state.folders = data.folders;
    state.files = data.files;
    $("#all-count").textContent = String(state.files.length);
    $("#folder-count").textContent = `${state.files.length} 个文件 · ${state.folders.length} 个文件夹`;
    renderTree();
    renderBreadcrumbs();
    renderChips();
    renderHeading();
    renderFiles();
  } catch (error) {
    $("#file-list").innerHTML = `<div class="load-error">无法读取材料索引。请确认 Cloudflare Pages 部署包中包含 data.json 和 materials 文件夹，并重新部署完整的 dist 文件夹。<br><small>${escapeHtml(error.message)}</small></div>`;
    $("#result-count").textContent = "读取失败";
  } finally {
    button.classList.remove("spinning");
  }
}

document.querySelectorAll(".nav-item").forEach((item) => {
  item.addEventListener("click", () => {
    state.currentView = item.dataset.view;
    state.currentFolder = "";
    state.selectedPath = "";
    document.querySelectorAll(".nav-item").forEach((node) => node.classList.toggle("active", node === item));
    renderTree();
    renderBreadcrumbs();
    renderHeading();
    renderFiles();
    renderDetails(null);
  });
});
$("#search-input").addEventListener("input", renderFiles);
$("#refresh-button").addEventListener("click", loadFiles);
$("#view-toggle").addEventListener("click", () => {
  state.grid = !state.grid;
  $("#view-toggle").innerHTML = state.grid ? "<span>▦</span><span>图标视图</span>" : "<span>☷</span><span>详细信息</span>";
  renderFiles();
});
document.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    $("#search-input").focus();
  }
  if (event.key === "Escape" && document.activeElement === $("#search-input")) {
    $("#search-input").value = "";
    renderFiles();
    $("#search-input").blur();
  }
});

loadFiles();
