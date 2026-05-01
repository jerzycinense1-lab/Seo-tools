<p align="center">
  <img src="https://img.shields.io/badge/Version-4.1.0-blue?style=flat-square&logo=googlechrome" alt="Version">
  <img src="https://img.shields.io/badge/Platform-Chrome%20%26%20Edge-green?style=flat-square&logo=googlechrome" alt="Platform">
  <img src="https://img.shields.io/badge/Manifest-V3-orange?style=flat-square" alt="Manifest V3">
  <img src="https://img.shields.io/badge/Tools-85%2B-red?style=flat-square" alt="85+ Tools">
</p>

# 🛠️ SEO Tools Pro

> **The Last SEO Extension You'll Ever Need** — 85+ professional-grade tools packed into a beautifully designed, lightning-fast Chrome extension.

<br>

<p align="center">
  <i>Stop jumping between 20 tabs. Stop copy-pasting between tools. </i><br>
  <i><b>SEO Tools Pro</b> brings everything into one keyboard-shortcut away.</i>
</p>

<br>

---

## 🎯 Why SEO Tools Pro?

<table>
<tr>
<td width="50%">

### 😫 The Old Way
- Switch between 10+ browser tabs
- Manually copy/paste data between tools
- Juggle separate extensions for each task
- Nothing context-aware about your workflow
- Inconsistent UIs slowing you down

</td>
<td width="50%">

### 😎 With SEO Tools Pro
- <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>G</kbd> → Everything in one popup
- Right-click any element → Context-aware actions
- AI generates content, meta tags & alt text automatically
- Favorites system remembers your workflow
- Beautiful, consistent design with dark mode

</td>
</tr>
</table>

<br>

---

## 🚀 Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/seo-tools-pro.git

# 2. Open Chrome Extensions page
# chrome://extensions/

# 3. Toggle "Developer mode" (top-right)

# 4. Click "Load unpacked"
#    → Select the seo-tools-pro folder

# 5. Pin the icon to your toolbar
#    → You're ready to go! 🎉
```

> 💡 **Power user tip:** Press <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>G</kbd> (Mac: <kbd>⌘</kbd>+<kbd>⇧</kbd>+<kbd>G</kbd>) to open the popup without touching the mouse.

---

## 📖 Table of Contents

| Section | Description |
|:---|:---|
| [✨ Feature Showcase](#-feature-showcase) | Tour of all major tool categories |
| [⌨️ Keyboard Shortcuts](#️-keyboard-shortcuts) | Every shortcut you need |
| [📚 Usage Guide](#-usage-guide) | How to master the extension |
| [🏗️ Architecture](#-architecture) | How the extension works under the hood |
| [📦 Installation Details](#-installation-details) | File structure & setup |
| [🔧 Development](#-development) | Adding new tools, design system |
| [🔐 Permissions](#-permissions) | Why each permission is needed |
| [🐛 Troubleshooting](#-troubleshooting) | Fix common issues |
| [📊 Complete Tool List](#-complete-tool-list) | Every single tool cataloged |
| [📞 Support](#-support) | Get help, report issues |

---

## ✨ Feature Showcase

<br>

### ⭐ Pinned Favorites

> **Your personal command center.** Pin any tool and it appears everywhere.

| Feature | How It Works |
|:---|:---|
| **Popup Favorites Tab** | All pinned tools live in the ⭐ **Favs** tab, always one click away |
| **Right-Click Menu** | Pinned tools appear in your right-click context menu under "🛠️ SEO Tools Pro" |
| **Context Awareness** | The context menu shows different tools depending on what you clicked (page, selection, link, or image) |
| **One-Click Toggle** | Hover any tool → click ★ to pin or unpin |

```
Right-click workflow:
  Page        → Copy URL, Full Page Screenshot, Extract All Links
  Text Select → Text Compare, URL Slug Generator, Search Google
  Link        → Broken Link Checker, Extract Domains
  Image       → OCR Extract Text, Analyze Alt Text, Download
```

<br>

### 🤖 AI-Powered Generation

> **Let the extension think for you.** Contextual AI that understands your page.

<div align="center">

| Tool | What It Does | Tech |
|:---|:---|:---|
| 🏷️ **AI Meta Generator** | Extracts keywords using TF-IDF, generates optimized titles, descriptions & OG tags with quality scoring | On-page analysis |
| 📝 **Title Generator** | Creates 10+ title variations ranked by character count, keyword inclusion & SEO best practices | Scoring engine |
| 💡 **Topic Generator** | Analyzes page content across 6 categories (How-To, Listicles, Comparisons, Q&A, Case Studies, Trends) to suggest blog topics | Context extraction |
| 🖼️ **Alt Text Generator** | Inspects every image on the page, extracts context from nearby elements, generates alt text with confidence indicators | DOM analysis |

</div>

<br>

### 🔍 SEO Analysis Suite

<div align="center">

| Category | Tools | Highlights |
|:---|:---|:---|
| 📊 **On-Page** | Heading Structure, Meta Tags, Keyword Density, SERP Preview, Content Readability, URL Optimizer, Pub Date Checker | Visual hierarchy + action items |
| ⚙️ **Technical** | Schema Validator, robots.txt, Sitemap, Duplicate Content, Hreflang Generator, Mobile Usability | Automated scoring |
| 🔗 **Links** | DoFollow Highlighter, Broken Link Checker, Internal/External Ratio, Prospect Finder | Bulk + visual |
| 📍 **Local SEO** | Multi-City Keyword Generator, Maps Scraper, Citation Finder | CSV exports |
| 📈 **Reporting** | SEO Dashboard (graded A-F), Auto Audit, Interactive Checklist, Site Structure Visualizer, Social Card Preview | Professional reports |

</div>

<br>

### 📧 Email & Outreach Templates

> **14 pre-built templates** with dynamic variable substitution.

| Category | Templates |
|:---|:---|
| 💰 **Payment Requests** | Advance Payment (PayPal), Payment Request (PayPal), Payment Request (GCash), Send Invoice |
| 📝 **Article Communication** | Send Article (Detailed), Quick Article, 1st Follow-up, 2nd Follow-up, Final Notice, Cancellation |
| 🤝 **Outreach** | Guest Post Outreach, Negotiation ($50 offer), Contact Form Auto-Filler, Declined Response |

```
Available variables:
  {{yourName}}  {{webmaster}}  {{website}}  {{amount}}  {{currency}}
  {{articleTitle}}  {{publishedLink}}  {{clientAccount}}
```

<br>

### ⚡ Advanced Power Tools

<div align="center">

| Tool | Description | Key Features |
|:---|:---|:---|
| 🖼️ **Image Toolkit** | Complete image processing suite | Resize, Convert (WebP/PNG/JPEG), Optimize, Free Stock Sources, SEO Analyzer |
| 🔍 **Advanced Text Compare** | SEO-focused text diff tool | Cosine + Jaccard + LCS similarity, Readability scores, Keyword gap analysis, Export JSON/CSV |
| 🏗️ **Site Structure Visualizer** | Interactive architecture explorer | DOM tree, Heading hierarchy, Link graph visualization, SEO scoring |
| 🗺️ **Google Maps Scraper** | Business data extraction | Auto-scroll, Manual select mode, Real-time stats, CSV/JSON/Markdown export |
| 📸 **Full Page Capture** | Intelligent screenshot | Handles fixed elements, lazy images, scroll stitching |
| 👁️ **OCR Extractor** | AI text extraction from images | Image enhancement, Multi-language support, Paste & drag-drop input |
| 📱 **Multi-Device Emulator** | Responsive testing | Mobile/Tablet/Desktop frames, Rotate controls, Pop-out windows |
| 🧹 **Clear Site Data** | Selective data clearing | Cookies, LocalStorage, IndexedDB, Cache, Service Workers |

</div>

<br>

---

## ⌨️ Keyboard Shortcuts

<div align="center">

| Shortcut | Action | Context |
|:---|:---|:---|
| <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>G</kbd> | Open popup | Anywhere |
| <kbd>/</kbd> | Focus search | Popup open |
| <kbd>Esc</kbd> | Clear search / Close modal | Popup or modal |
| <kbd>↑</kbd> <kbd>↓</kbd> | Navigate search results | Search active |
| <kbd>Enter</kbd> | Execute highlighted tool | Search active |
| <kbd>Ctrl</kbd>+<kbd>T</kbd> | Open Template Manager | Popup open |
| <kbd>Ctrl</kbd>+<kbd>S</kbd> | Open Settings | Popup open |
| <kbd>Ctrl</kbd>+<kbd>D</kbd> | Toggle Dark Mode | Popup open |
| <kbd>Ctrl</kbd>+<kbd>E</kbd> | Start/Resume Auto-Scroll | Maps Scraper |
| <kbd>Ctrl</kbd>+<kbd>M</kbd> | Minimize/Maximize | Maps Scraper |

</div>

---

## 📚 Usage Guide

### 🎯 Basic Navigation

1. **Open the popup** — <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>G</kbd> or click the toolbar icon
2. **Browse by category** — Click tabs: ⭐ **Favs** | 📊 **SEO** | 📧 **Email** | 🔗 **Extract** | ⚡ **Utils** | 🔗 **Apps**
3. **Search** — Press <kbd>/</kbd> and type to find any tool instantly
4. **Click a tool** — It executes on your current page
5. **View results** — In a beautiful modal overlay

### 🖱️ Right-Click Context Menu

Access tools without opening the popup:

1. Right-click **anywhere on a page** → "🛠️ SEO Tools Pro" → Your pinned tools
2. Right-click **selected text** → Text comparison, URL slug generation, Google search
3. Right-click **a link** → Broken link checking, domain extraction
4. Right-click **an image** → OCR text extraction, alt text analysis, bulk download

### ⭐ Managing Favorites

1. **Hover** over any tool button
2. Click the **★** star that appears
3. The tool joins your **Favs tab** and **context menu**
4. Click the filled ★ again to remove

### 📦 Bulk Operations

| Operation | How To |
|:---|:---|
| **Open multiple URLs** | Paste list → "Bulk URL Opener" handles up to 50 with throttling |
| **Convert many currencies** | Paste amounts → "Bulk Currency Converter" with live rates |
| **Download multiple images** | Select in grid → "Bulk Image Downloader" saves all selected |
| **Export data** | Most tools include CSV/JSON/Markdown export buttons |

### 🎈 Floating Widget

Enable the **mini-widget** from Settings to see live page stats in a draggable panel:

```
┌──────────────────────────────────┐
│ 🛸  Words: 1.2k  H1: 1  Links: 47  │  ← Drag me anywhere!
└──────────────────────────────────┘
```

---

## 🏗️ Architecture

### System Overview

```
┌─────────────────────────────────────────────────────┐
│                    CHROME EXTENSION                    │
│                                                         │
│  ┌──────────┐    ┌──────────────┐    ┌─────────────┐ │
│  │ popup.js │───▶│ background.js│───▶│  content.js  │ │
│  │  (UI)    │    │  (orchestr.) │    │   (router)   │ │
│  └──────────┘    └──────────────┘    └──────┬──────┘ │
│                                               │         │
│                        ┌──────────────────────┤         │
│                        ▼                      ▼         │
│                 ┌─────────────┐    ┌───────────────┐  │
│                 │ seo-tools.js│    │tools-advanced │  │
│                 │  (85+ core  │    │      .js       │  │
│                 │   tools)    │    │ (OCR, Maps,   │  │
│                 └──────┬──────┘    │  Compare)     │  │
│                        │           └───────┬───────┘  │
│                        ▼                   ▼           │
│                 ┌─────────────────────────────┐       │
│                 │        utils.js (GDI)        │       │
│                 │  Shadow DOM • Theme • Modal  │       │
│                 │  Notification • Buttons •   │       │
│                 │  Tables • Charts • Forms     │       │
│                 └─────────────┬───────────────┘       │
│                               │                        │
│                               ▼                        │
│                    ┌─────────────────┐                │
│                    │  SHADOW DOM HOST │                │
│                    │ (CSS isolated UI)│                │
│                    └─────────────────┘                │
└─────────────────────────────────────────────────────┘
```

### Design System (GDI)

All UI is built with the **GDI (Graphical Design Interface)** library. Key principles:

| Principle | Implementation |
|:---|:---|
| **Consistency** | 100+ design tokens for colors, spacing, typography, shadows |
| **Dark Mode** | Single toggle — all components update instantly via CSS custom properties |
| **Accessibility** | WCAG 2.1 AA compliant, ARIA labels, keyboard navigation, focus trapping |
| **Isolation** | All UI rendered in Shadow DOM — no CSS leaks or conflicts with host pages |
| **Performance** | Virtual scrolling, lazy injection, debounced inputs, batch processing |

### Security Architecture

```
┌──────────────────────────────────────────┐
│ PAGE DOM (untrusted)                     │
│  • Cannot access extension internals     │
│  • Cannot style extension UI             │
│  • Cannot trigger extension actions      │
└──────────────┬───────────────────────────┘
               │ Shadow Boundary
┌──────────────▼───────────────────────────┐
│ SHADOW ROOT (isolated)                   │
│  • All modals, notifications, tooltips   │
│  • CSS completely sandboxed              │
│  • XSS-safe element construction         │
└──────────────────────────────────────────┘
```

---

## 📦 Installation Details

### File Structure

```
seo-tools-pro/
│
├── 📄 manifest.json           → Extension configuration (Manifest V3)
├── 📄 background.js            → Service worker (routing, context menus, OCR proxy)
├── 📄 content.js               → Message router connecting popup → tools
├── 📄 popup.html               → Extension popup interface
├── 📄 popup.css                → Popup & options styling (design tokens)
├── 📄 popup.js                 → Popup logic, favorites, settings
├── 📄 options.html             → Full-page template editor
├── 📄 options.js               → Options page logic
├── 📄 utils.js                 → GDI library (Shadow DOM, Theme, Components)
├── 📄 seo-tools.js             → 85+ core tool functions
├── 📄 tools-advanced.js        → Advanced modules (lazy-loaded)
├── 📄 widget.js                → Optional floating mini-widget
└── 📄 README.md                → This documentation
```

### Content Script Configuration

Your `manifest.json` **must** include:

```json
{
  "manifest_version": 3,
  "name": "SEO Tools Pro",
  "version": "4.1.0",
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["utils.js", "seo-tools.js", "tools-advanced.js", "content.js"],
      "run_at": "document_idle"
    },
    {
      "matches": ["<all_urls>"],
      "js": ["widget.js"],
      "run_at": "document_end"
    }
  ]
}
```

> ⚠️ **Without the `content_scripts` section, no tools will work!**

### After Installation

1. Navigate to any website
2. Click the extension icon or press <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>G</kbd>
3. All 85+ tools are ready to use

---

## 🔧 Development

### Adding a New Tool

```javascript
// Step 1: Create the tool in seo-tools.js
function toolMyNewAwesomeTool() {
  const content = GDI.createElement('div');
  content.appendChild(GDI.createToolHeader('🎯 My Tool', 'Description'));
  
  // Use any GDI component
  content.appendChild(GDI.createSection('Settings', [
    GDI.createInputField({ label: 'Input', id: 'my-input' }).wrapper,
    GDI.createButton('Execute', () => {
      GDI.showNotification('Done!', 'success');
    }, { variant: 'primary' })
  ]));
  
  GDI.createModal('My Awesome Tool', content, { width: '600px' });
}

// Step 2: Export it
Object.assign(window.SEOTools, {
  // ... existing exports ...
  toolMyNewAwesomeTool
});

// Step 3: Register in content.js toolMap
'my-awesome-tool': () => {
  SEOTools.toolMyNewAwesomeTool();
  return 'Tool executed!';
}

// Step 4: Add a button in popup.html
<button class="tool-btn" data-action="my-awesome-tool">🎯 My Awesome Tool</button>

// Step 5: Reload the extension — done!
```

### Available GDI Components

```javascript
// Create elements safely
GDI.createElement('div', { attrs, styles, children, text, html })

// Form components
GDI.createInputField({ label, id, placeholder, required, defaultValue })
GDI.createTextarea({ label, id, rows, defaultValue })
GDI.createSelect({ label, id, options, defaultValue })
GDI.createToggle({ label, checked, onChange })
GDI.createButton(text, onClick, { variant, size })

// Display components
GDI.createBadge(text, variant)
GDI.createProgressBar(value, color, height)     // Returns { container, fill, setValue() }
GDI.createScoreRing(score, size)                // Returns DOM with .setScore() method
GDI.createStatCard({ label, value, icon, color })
GDI.createDataTable({ columns, rows, maxHeight })
GDI.createSkeleton({ width, height, circle })
GDI.createTooltip(target, content, { position })

// System
GDI.createModal(title, content, options)        // Returns { overlay, modal, close }
GDI.showNotification(message, type, duration)
GDI.copyToClipboard(text)                       // Returns Promise<boolean>

// Utilities
GDI.escapeHtml(str)                             // XSS-safe
GDI.cleanText(str)                              // Normalize whitespace
GDI.debounce(fn, delay)                         // Debounce helper
GDI.throttle(fn, limit)                         // Throttle helper
GDI.formatFileSize(bytes)                       // Human-readable
GDI.hashString(str)                             // Simple hash
GDI.generateId(prefix)                          // Unique ID
```

### Theme Customization

```javascript
// Apply custom colors programmatically
GDI.ThemeEngine.applyCustomColors('#7C3AED', '#F59E0B');

// Toggle dark mode
GDI.ThemeEngine.toggle();

// Check current theme
if (GDI.ThemeEngine.isDark()) {
  // Dark mode active
}
```

---

## 🔐 Permissions

| Permission | Why We Need It |
|:---|:---|
| `activeTab` | Execute tools only on the tab you're currently viewing — never in background |
| `clipboardWrite` | Copy extracted data, generated content, and tool results to your clipboard |
| `tabs` | Open external tools (PageSpeed Insights, WHOIS, etc.) in new tabs |
| `storage` | Save your settings, email templates, favorites, and checklist progress locally |
| `scripting` | Dynamically inject advanced tool modules only when needed (lazy loading) |
| `contextMenus` | Provide right-click quick access to your pinned tools |
| `alarms` | Keep the background service worker responsive |
| `<all_urls>` | Allow tools to work on any website you visit |

> 🔒 **Privacy:** No user data is ever collected, stored externally, or transmitted to third-party servers except when you explicitly use tools requiring external APIs (OCR, live currency rates). All settings and templates are stored locally using `chrome.storage`.

---

## 🐛 Troubleshooting

<details>
<summary><b>🔴 "Tools don't work on any page!"</b></summary>

**Quick fixes:**
1. Go to `chrome://extensions/`
2. Find SEO Tools Pro
3. Click **Reload** (🔄 icon)
4. Refresh the target web page
5. Try again

**If that doesn't work:**
- Check the extension is **enabled** (toggle switch)
- Check for errors in **DevTools Console** (F12)
- Verify all files are present in the extension folder
</details>

<details>
<summary><b>🔴 "Modals or highlights don't appear!"</b></summary>

**Check content script loading:**
1. Open DevTools <kbd>F12</kbd>
2. Look for `"SEO Tools Pro v4.0 - Content Script Ready"` in Console
3. If missing, the content script didn't inject — reload the extension
4. Test on a simple website (like `example.com`) first to rule out CSP conflicts
</details>

<details>
<summary><b>🔴 "Google Maps Scraper isn't finding anything!"</b></summary>

**Step-by-step:**
1. Ensure you're on a Google Maps **search results** page (maps.google.com + search query)
2. **Scroll the sidebar** manually first to load some results
3. Run "Auto-Scroll" or use "Manual Select" and click individual cards
4. If auto-scroll fails, manually scroll → click "Extract Visible"
5. Check the stats cards in the extract tab for real-time feedback
</details>

<details>
<summary><b>🔴 "OCR returns blank or error!"</b></summary>

- Ensure the image has **clear, readable text** (not stylized fonts)
- Toggle **"Enhance Image"** ON for better contrast
- Try **pasting** (<kbd>Ctrl</kbd>+<kbd>V</kbd>) a screenshot directly
- The free OCR API has rate limits — wait ~60 seconds between batches
- Select the correct **language** from the dropdown
</details>

<details>
<summary><b>🔴 "Bulk URL Opener blocked by browser!"</b></summary>

- Click the **popup blocked** icon in the address bar → Allow
- Reduce batch size to 10-15 URLs at a time
- The opener automatically pauses and shows a "Resume" button if overwhelmed
- URLs without `https://` are automatically prefixed
</details>

<details>
<summary><b>🔴 "Dark mode or custom theme not applying!"</b></summary>

- Open **Settings** (⚙️) → Toggle Dark Mode → Click **Save Settings**
- If using custom colors, they override the default theme
- Try **Reset Defaults** in Settings to factory state
- Clear extension cache: ⚡ **Utils tab** → **Clear Cached Data**
</details>

---

## 📊 Complete Tool List

### ⭐ Favorites
| Tool | Description |
|:---|:---|
| Custom | Pin any tool to this tab and context menu |

### 📊 SEO Analysis (30 tools)
| Tool | Action |
|:---|:---|
| 🏷️ Meta Tags Analysis | Reviews all meta tags with scoring |
| 📊 Heading Structure | Visualizes H1-H6 hierarchy |
| 🔤 Keyword Density | Analyzes word & phrase frequency |
| 👁️ SERP Preview | Preview Google search appearance |
| 📝 Content Readability | Flesch-Kincaid score analysis |
| 🖼️ Image Alt Text | Finds missing alt attributes |
| 🚨 Broken Link Checker | Scans for 404 errors |
| 📄 Schema Validator | Structured data testing |
| 🤖 robots.txt Checker | Opens robots.txt |
| 🗺️ Sitemap Finder | Locates XML sitemaps |
| ⚡ PageSpeed Insights | Google Core Web Vitals |
| 📜 Wayback Machine | Historical snapshots |
| 🔎 WHOIS Lookup | Domain registration info |
| 🔗 Link Analysis | Internal vs external ratio |
| ✅ Do-Follow Highlighter | Color-codes link types |
| 📱 Mobile Usability | Responsive design testing |
| 📅 Pub Date Checker | Content freshness analysis |
| 🔗 URL Optimizer | SEO-friendly URL analysis |
| 🎨 Color Extractor | Website color palette |
| 🔤 Typography Inspector | Font family analysis |
| 🏷️ AI Meta Generator | AI title & description |
| 📝 Title Generator | SEO title variations |
| 💡 Topic Generator | Blog idea suggestions |
| 🖼️ Alt Text Generator | AI-powered alt text |
| 🎯 Link Prospect Finder | Guest post opportunities |
| 📚 Resource Page Finder | Link building targets |
| 📍 Local Keyword Finder | Geo-targeted keywords |
| 🌐 Hreflang Generator | International tags |
| 🔄 Duplicate Content | Content uniqueness check |
| 📊 SEO Dashboard | Overall health score |
| ✅ SEO Audit | Automated checks |
| 📋 Audit Checklist | Interactive tracker |

### 📧 Email Templates (14 tools)
| Tool | Type |
|:---|:---|
| 💵 Advance Payment | PayPal request |
| 📬 Payment Request | PayPal invoice |
| 📱 GCash Payment | GCash request |
| 📄 Send Invoice | Invoice confirmation |
| 📤 Send Article | Detailed submission |
| ⚡ Quick Article | Quick submission |
| 📞 1st Follow-up | First reminder |
| 📞 2nd Follow-up | Second reminder |
| ⚠️ Final Notice | Last chance |
| ❌ Cancellation | Withdraw submission |
| 🙏 Declined Response | Polite reply |
| 📧 Email Outreach | Guest post pitch |
| 💬 Negotiation | Price negotiation |
| 📝 Contact Form Filler | Auto-fill forms |

### 🔗 Extractors (10 tools)
| Tool | Extracts |
|:---|:---|
| 🔗 Link Extractor | All links with metadata |
| 🌐 Domain Extractor | External domains |
| 📧 Email Extractor | Email addresses |
| 📱 Social Extractor | Social media links |
| 🌐 Deep Google Domain | SERP scraping |
| 🖼️ Image Downloader | Grid-based image extraction |
| 👁️ OCR Extractor | Text from images |
| 📱 Social Preview | OG/Twitter card preview |
| 🎨 Color Theme | Website palette |
| 🔤 Typography | Font families |

### ⚡ Utilities (20 tools)
| Tool | Function |
|:---|:---|
| 📋 Copy URL | Current page URL |
| 🌐 Copy Domain | Current domain |
| 🔗 URL Slug Generator | SEO-friendly slugs |
| 💬 WhatsApp Link | Chat link generator |
| ⬇️ Scroll to Bottom | Smooth scroll |
| 📸 Full Page Capture | Screenshot entire page |
| 📂 Bulk URL Opener | Open multiple links |
| 💱 Currency Converter | Bulk conversion |
| 💰 Currency Copier | Symbol reference |
| ⚡ Pingdom Test | Speed testing |
| 📈 All Metrics | Authority & traffic |
| 🔬 Search Operators | Advanced Google queries |
| 📰 Find Blog Page | Blog URL detection |
| ✍️ Guest Post Pages | "Write for us" finder |
| 🔍 Image Toolkit | Resize, convert, optimize |
| 🔍 Text Compare | SEO diff tool |
| 🏗️ Site Structure | Visualizer |
| 🗺️ Maps Scraper | Business extraction |
| 📱 Multi-Device | Responsive emulator |
| 🧹 Clear Site Data | Selective cleanup |

---

## 📞 Support

<div align="center">

| Channel | Link |
|:---|:---|
| 🌐 **Website** | [searchworks.ph](https://searchworks.ph) |
| 📧 **Email** | [jonathn.p.harris@gmail.com](mailto:jonathn.p.harris@gmail.com) |

<br>

**Developer:** Jonathan Harris  
**Version:** 4.1.0  
**License:** Personal & Professional Use  
**Tech:** Vanilla JavaScript · Chrome Manifest V3 · Shadow DOM · CSS Custom Properties

<br>

<p>
  Made by <a href="https://searchworks.ph">SearchWorks.ph</a>
</p>

</div>
```
