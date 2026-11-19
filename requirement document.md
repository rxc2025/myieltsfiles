# PROJECT: WebFile Explorer Pro

## 1. Project Objective

Develop a premium, modern, highly interactive web-based file manager called "WebFile Explorer Pro".

The website should combine the usability of Windows 11 File Explorer, the simplicity of Google Drive, and the visual quality of modern SaaS dashboards.

The entire project MUST be deployable directly to Cloudflare Pages Free Plan.

## 2. Strict Technical Requirements

Technology:
- HTML5
- CSS3
- Vanilla JavaScript ES6+
- Lucide Icons
- JSON-based file manifest

Restrictions:
- No React
- No Vue
- No Angular
- No Node.js backend
- No database
- No paid APIs
- No mandatory external services
- No Cloudflare Workers dependency
- No server-side runtime requirement

The project must work as a static website.

## 3. Premium UI Design

Create a sophisticated modern interface.

Design inspiration:
- Windows 11 File Explorer
- Linear
- macOS Finder
- Modern SaaS dashboards

Visual characteristics:
- Premium dark theme
- Elegant light theme
- Glassmorphism
- Subtle gradients
- Soft shadows
- Smooth rounded corners
- Refined typography
- Consistent spacing
- Minimalist iconography

Avoid:
- Excessive gradients
- Overly bright neon colors
- Excessive animations
- Cluttered layouts
- Cheap-looking UI components

## 4. Advanced Animation System

Build a consistent animation system using CSS and JavaScript.

Required animations:

1. Smooth page transitions.
2. Sidebar expand and collapse.
3. File card hover elevation.
4. Folder opening animation.
5. Modal scale and fade transitions.
6. Toast notification slide animations.
7. Search result transitions.
8. Theme switching transitions.
9. Loading skeleton shimmer.
10. Dropdown menu animations.
11. Context menu transitions.
12. Breadcrumb navigation transitions.

Animation requirements:
- Prefer transform and opacity.
- Use GPU-friendly transitions.
- Avoid unnecessary layout recalculation.
- Keep animations smooth on low-end devices.
- Support prefers-reduced-motion.

## 5. Application Layout

### Sidebar

Include:
- Home
- All Files
- HTML Websites
- Documents
- Images
- Videos
- Audio
- Archives
- Code Files
- Favorites
- Recently Opened

Sidebar features:
- Collapsible navigation.
- Animated active indicator.
- Custom icons.
- Responsive mobile drawer.

### Topbar

Include:
- Global search.
- Breadcrumb navigation.
- Theme switcher.
- Grid/List toggle.
- Refresh button.
- Settings.

### Main Workspace

Include:
- Current folder title.
- File count.
- Sort menu.
- File type filters.
- File grid.
- File list.
- Empty state.

## 6. File Management

Support:
- Folder navigation.
- Nested directories.
- Breadcrumb navigation.
- File classification.
- File search.
- Sorting.
- Filtering.
- File information.
- Copy URL.
- Download.
- Open in new tab.

File categories:
- HTML
- PDF
- Images
- Videos
- Audio
- Documents
- Archives
- Code
- Other

## 7. HTML Website Launcher

This is one of the most important features.

Automatically identify HTML files and display them in a dedicated HTML Websites section.

Each HTML website card should include:
- Website title.
- Website icon.
- File path.
- Description, if available.
- Open website button.
- Preview button.
- Copy URL button.
- Favorite button.

Support nested HTML projects.

Opening an HTML file should open its actual deployed URL in a new browser tab.

## 8. File Preview

Create a modern preview modal.

Support:
- Images.
- PDF.
- TXT.
- Markdown.
- HTML.
- Audio.
- Video.

Include:
- Close button.
- Download button.
- File information.
- Fullscreen preview where supported.

Do not execute arbitrary HTML inside the main application DOM.

Use sandboxed iframe previews for HTML files and apply appropriate security restrictions.

## 9. Advanced Interaction

Implement:
- Global search.
- Keyboard shortcuts.
- Command Palette (Ctrl+K).
- Right-click context menu.
- Favorites.
- Recently opened files.
- Grid/List switching.
- File details panel.
- Sort and filter.
- Persistent theme preference.
- Persistent view preference.

Use localStorage only for user interface preferences and personal browser-side settings, not as a substitute for server file storage.

## 10. File Index System

Because Cloudflare Pages is a static hosting platform, browsers cannot directly enumerate all files on the server.

Implement a JSON-based manifest system.

Example:

{
  "name": "Root",
  "type": "folder",
  "children": [
    {
      "name": "Websites",
      "type": "folder",
      "children": [
        {
          "name": "My Website",
          "type": "file",
          "fileType": "html",
          "path": "/files/websites/index.html"
        }
      ]
    }
  ]
}

The application must read manifest.json and dynamically render the actual file structure.

Never use fake files as real content.

## 11. Responsive Design

Support:
- 1920px desktop.
- 1440px laptop.
- 1024px tablet.
- 768px tablet.
- 375px mobile.

Use adaptive layouts and responsive navigation.

## 12. Performance

Requirements:
- Lazy loading images.
- Efficient DOM rendering.
- Debounced search.
- Event delegation.
- Avoid unnecessary reflows.
- Efficient file indexing.
- Lightweight assets.
- No unnecessary libraries.

The application should remain responsive with thousands of indexed file entries.

## 13. Project Structure

Generate a clean structure:

/
├── index.html
├── manifest.json
├── assets/
│   ├── css/
│   │   ├── main.css
│   │   ├── themes.css
│   │   └── animations.css
│   ├── js/
│   │   ├── app.js
│   │   ├── explorer.js
│   │   ├── search.js
│   │   ├── preview.js
│   │   ├── navigation.js
│   │   └── settings.js
│   └── icons/
├── files/
│   ├── websites/
│   ├── documents/
│   ├── images/
│   └── other/

## 14. Code Quality

- Write production-quality code.
- Separate HTML, CSS and JavaScript.
- Use modular functions.
- Add meaningful comments.
- Avoid duplicate code.
- Handle missing files gracefully.
- Handle invalid manifest data.
- Ensure every visible button works.
- Do not leave placeholder functionality.
- Do not generate fake file operations.

## 15. Deployment

The project must be deployable directly using Cloudflare Pages.

Provide:
- GitHub repository deployment instructions.
- Cloudflare Pages configuration.
- Build command: None.
- Build output directory: / (repository root).
- No required environment variables.
- No paid services.

## 16. Final Delivery

Generate the complete working project.

Do not generate only a visual prototype.

Prioritize:
1. Premium visual quality.
2. Smooth interactions.
3. Real file indexing.
4. Reliable navigation.
5. HTML website management.
6. Cloudflare Pages compatibility.

The final result should feel like a polished commercial software product.