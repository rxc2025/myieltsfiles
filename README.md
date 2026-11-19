# WebFile

这是一个可直接双击 `index.html` 打开的静态文件浏览页。

## 自动扫描文件

将文件和目录放入 `files/`。部署前运行：

```bash
node generate-files-manifest.mjs
```

脚本会扫描 `files/` 的所有子目录并更新 `files-manifest.js`。将 `index.html`、`files-manifest.js` 和整个 `files/` 目录一起上传。

Cloudflare Pages 配置：

- Build command：`node generate-files-manifest.mjs`
- Build output directory：`.`（仓库根目录）
- Environment variables：无需设置

新增、删除或重命名文件后重新部署即可自动更新目录。点开 HTML 文件将以实际部署路径打开。

## 外观设置

界面默认识别浏览器系统语言（简体中文或英语）及系统深色模式。顶部按钮可手动切换语言或主题，选择会保存在当前浏览器中；清除浏览器站点数据后恢复系统默认。侧栏底部显示当前版本号。

## 拖动排序

拖动同一目录下的文件或文件夹卡片，并放到目标卡片的前半或后半，可插入到其前后调整顺序；排序只在当前页面会话中生效，刷新后恢复清单顺序，不会移动 Cloudflare 上的实际文件。当前版本：`v1.4.0`。
