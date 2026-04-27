## 📖 Table of Contents

- [✨ Why SEO Tools Pro?](#-why-seo-tools-pro)
- [🚀 Quick Start](#-quick-start)
- [🧰 Feature Showcase](#-feature-showcase)
  - [⭐ Favorites & Context Menu](#-favorites--context-menu)
  - [🤖 AI-Powered Tools](#-ai-powered-tools)
  - [🔍 SEO Analysis](#-seo-analysis)
  - [📧 Email & Outreach](#-email--outreach)
  - [⚡ Advanced Toolkits](#-advanced-toolkits)
- [📁 Installation](#-installation)
- [⌨️ Keyboard Shortcuts](#️-keyboard-shortcuts)
- [🔧 Development](#-development)
- [🐛 Troubleshooting](#-troubleshooting)
- [📞 Support](#-support)

---

## ✨ Why SEO Tools Pro?

Stop jumping between 20 different tabs. **SEO Tools Pro** packs everything you need into one sleek popup.

| Traditional Workflow | With SEO Tools Pro |
|:---|:---|
| Open 10+ websites | Click one button |
| Copy/paste between tabs | Everything in one place |
| Manual data entry | AI-generated suggestions |
| No context awareness | Auto-detects page data |

---

## 🚀 Quick Start

```bash
# 1. Clone or download this repository
git clone https://github.com/yourusername/seo-tools-pro.git

# 2. Open Chrome and navigate to:
chrome://extensions/

# 3. Enable "Developer mode" (top-right toggle)

# 4. Click "Load unpacked" and select the folder

# 5. Pin the extension to your toolbar and you're ready!
```

> ⚡ **Pro tip:** Press `Ctrl+Shift+G` (or `Cmd+Shift+G` on Mac) to open the popup instantly.

---

## 🧰 Feature Showcase

### ⭐ Favorites & Context Menu

> Build your personal command center.

Pin your most-used tools to the **Favs** tab. They'll also appear in your **right-click context menu** for zero-click access.

```
Right-click anywhere → SEO Tools Pro → Your Pinned Tools
```

### 🤖 AI-Powered Tools

> Let AI do the heavy lifting.

| Tool | What It Does |
|:---|:---|
| 🏷️ **AI Meta Generator** | Generates SEO titles & descriptions from page content |
| 📝 **SEO Title Generator** | Creates 10+ optimized title variations |
| 💡 **AI Topic Generator** | Suggests blog topics across 6 categories |
| 🖼️ **AI Alt Text Generator** | Smart alt text suggestions with editable previews |

### 🔍 SEO Analysis

> Everything you need to audit any page.

| Category | Tools |
|:---|:---|
| **On-Page** | Heading Structure, Meta Tags, Keyword Density, SERP Preview, Content Readability |
| **Technical** | Schema Validator, robots.txt, Sitemap, URL Optimizer, Duplicate Content, Hreflang Generator |
| **Links** | Do-Follow Highlighter, Broken Link Checker (with CSV), Internal/External Analysis, Link Prospect Finder |
| **Local SEO** | Multi-City Keyword Finder, Maps Scraper, Citation Finder, Local Keyword Finder |
| **Reporting** | SEO Dashboard, Automated SEO Audit, Interactive Audit Checklist, Site Structure Visualizer |

### 📧 Email & Outreach

> Pre-written templates with dynamic variables.

| Template Type | Examples |
|:---|:---|
| 💰 **Payment** | PayPal Request, GCash Request, Send Invoice, Advance Payment |
| 📝 **Article** | Sending Article, Follow-ups (1st, 2nd, Final), Cancellation |
| 🤝 **Outreach** | Guest Post Outreach, Negotiation, Contact Form Auto-Filler, Declined Response |

**Variables you can use:**
```
{{yourName}}  {{webmaster}}  {{website}}  {{amount}}  {{currency}}  {{articleTitle}}  {{publishedLink}}  {{clientAccount}}
```

### ⚡ Advanced Toolkits

> Power tools for power users.

| Toolkit | Features |
|:---|:---|
| 🖼️ **Image Toolkit** | Resize, Convert (WebP/PNG/JPEG), Optimize, Free Stock Sources, SEO Analyzer |
| 🔍 **Text Compare** | Similarity %, Reading Time, Keyword Gaps, Readability Scores, Recommendations |
| 📂 **Bulk URL Opener** | Paste a list, open all tabs with progress tracking |
| 📸 **Full Page Capture** | Screenshot entire page with intelligent stitching (handles fixed elements) |
| 📊 **Keyword Rank Tracker** | Find your domain's position in Google (up to 100 results) |
| 🌐 **Deep Google Domain Extractor** | Scrape up to 50 pages of Google results with filtering |
| 🗺️ **Google Maps Scraper** | Auto-scroll, extract business info with CSV export |
| 🏗️ **Site Structure Visualizer** | Interactive DOM tree, link graph, SEO scoring |
| 🎨 **Design Inspector** | Extract color palettes & typography |
| 📱 **Multi-Device Emulator** | Preview pages in mobile, tablet, and desktop frames |
| 🧹 **Clear Site Data** | Selectively clear cookies, localStorage, IndexedDB, caches, service workers |
| 🖼️ **Bulk Image Downloader** | Extract images from `<img>`, CSS backgrounds, srcset, video posters |

---

## 📁 Installation

### 📋 Required Files

Make sure your folder contains **all 8 files**:

```
seo-tools-pro/
├── 📄 manifest.json      # Extension configuration (Manifest V3)
├── 📄 background.js      # Service worker (context menus, message routing)
├── 📄 utils.js           # Shared UI library & design system (GDI)
├── 📄 seo-tools.js       # Core tool logic (85+ functions)
├── 📄 content.js         # Action router (connects popup to tools)
├── 📄 popup.html         # Extension popup interface
├── 📄 popup.css          # Styling (light/dark mode, design tokens)
└── 📄 popup.js           # Popup logic, favorites, settings, template manager
```

### ✅ Manifest V3 Configuration

Your `manifest.json` **must** include the `content_scripts` section:

```json
{
  "manifest_version": 3,
  "name": "SEO Tools Pro",
  "version": "4.0.0",
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["utils.js", "seo-tools.js", "content.js"],
      "run_at": "document_idle"
    }
  ]
}
```

> ⚠️ **Without this section, tools will not work on web pages!**

### 🔄 After Installation

1. Navigate to any website
2. Click the extension icon or press `Ctrl+Shift+G`
3. Start using any of the **85+ tools**!

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|:---|:---|
| `Ctrl` + `Shift` + `G` | Open extension popup |
| `/` | Focus search (when popup is open) |
| `Ctrl` + `T` | Open Template Manager |
| `Ctrl` + `S` | Open Settings |
| `Ctrl` + `D` | Toggle Dark Mode |
| `Ctrl` + `E` | Auto-scroll (in Maps Scraper) |
| `Esc` | Clear search / Close modal |

---

## 🔧 Development

### 🏗️ Architecture

```mermaid
graph TD
    A[popup.html/js] -->|User clicks tool| B[background.js]
    B -->|Send message| C[content.js]
    C -->|Route action| D[seo-tools.js]
    D -->|Use helpers| E[utils.js]
    D -->|Return result| C
    C -->|Show notification| A
    B -->|Context menu| F[Right-click]
    F -->|Execute| C
```

### 🎨 Design System

All UI components use the **GDI (Graphical Design Interface)** library defined in `utils.js`:

- **Theme Engine**: Automatic light/dark mode with CSS custom properties
- **Components**: Modal, Notification, Score Ring, Progress Bar, Stat Card, Data Table, Badge, Button, Input
- **Tokens**: Consistent colors, shadows, radii, typography, animations

### 🔐 Permissions Explained

| Permission | Why It's Needed |
|:---|:---|
| `activeTab` | Execute tools on the current page |
| `clipboardWrite` | Copy results to clipboard |
| `tabs` | Create new tabs for external tools |
| `storage` | Save your settings and templates |
| `scripting` | Inject scripts dynamically |
| `contextMenus` | Right-click quick access menu |
| `alarms` | Keep service worker alive |
| `<all_urls>` | Work on any website you visit |

---

## 🐛 Troubleshooting

<details>
<summary><b>🔴 Tools don't work on web pages</b></summary>
<br>
<ol>
  <li>Ensure your <code>manifest.json</code> includes the <code>content_scripts</code> section.</li>
  <li>Go to <code>chrome://extensions/</code> and click the <b>Reload</b> button.</li>
  <li>Refresh the web page and try again.</li>
</ol>
</details>

<details>
<summary><b>🔴 Highlights or modals not appearing</b></summary>
<br>
<ol>
  <li>Open DevTools (F12) and check the Console for errors.</li>
  <li>Make sure all 8 files are in the same folder.</li>
  <li>Try disabling and re-enabling the extension.</li>
</ol>
</details>

<details>
<summary><b>🔴 Google Maps scraper not finding businesses</b></summary>
<br>
<ol>
  <li>Scroll down to load more results first.</li>
  <li>Try <b>Manual Selection Mode</b> instead of auto-extract.</li>
  <li>Click on individual business listings in the sidebar.</li>
</ol>
</details>

<details>
<summary><b>🔴 Bulk URL opener blocked by browser</b></summary>
<br>
<ol>
  <li>Allow popups for the current site.</li>
  <li>Reduce the number of URLs (open in batches of 10-15).</li>
  <li>Use the "Open First 15" option when prompted.</li>
</ol>
</details>

---

## 📊 All 85+ Tools at a Glance

| Category | Count | Examples |
|:---|:---:|:---|
| ⭐ Favorites | ∞ | Your pinned tools |
| 📊 SEO Analysis | 20+ | Heading Structure, Meta Tags, Keyword Density, SERP Preview, Content Readability |
| 🔗 Link Tools | 8 | Do-Follow Highlighter, Broken Links, Link Extractor, Link Prospect Finder |
| 🤖 AI Tools | 5 | Meta Generator, Title Generator, Topic Generator, Alt Text Generator |
| 📍 Local SEO | 4 | Keyword Finder, Maps Scraper, Citation Finder |
| 📧 Email Templates | 14 | Payment, Article, Outreach, Negotiation, Contact Form Filler |
| 🔍 Extractors | 8 | Links, Domains, Emails, Social, Deep Google, Images, Colors, Fonts |
| ⚡ Utilities | 15+ | Bulk URL, Full Page Capture, Text Compare, Image Toolkit, Site Structure |
| 🎨 Design & Dev | 5 | Color Extractor, Typography Inspector, Multi-Device Emulator, Clear Site Data, Image Downloader |
| 🔗 Apps | 4 | Task Tracker, Profiler, Link Tool, PBN Buster |

---

## 📞 Support

<p align="center">
  <a href="https://searchworks.ph"><img src="https://img.shields.io/badge/🌐_Website-searchworks.ph-blue?style=for-the-badge" alt="Website" /></a>
  <a href="mailto:jonathn.p.harris@gmail.com"><img src="https://img.shields.io/badge/📧_Email-jonathn.p.harris%40gmail.com-red?style=for-the-badge" alt="Email" /></a>
</p>

<p align="center">
  <strong>Developer:</strong> Jonathan Harris<br>
  <strong>Version:</strong> 4.0.0<br>
  <strong>License:</strong> Personal & Professional Use
</p>

---

<p align="center">
  Made by <a href="https://searchworks.ph">SearchWorks.ph</a>
</p>
