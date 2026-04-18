```markdown
# 🛠️ SEO Tools Pro - Chrome Extension

A comprehensive SEO and outreach toolkit for digital marketers, link builders, and content creators. Created by [SearchWorks.ph](https://searchworks.ph)

## ⚠️ Important Installation Note (Manifest V3)

This extension uses a **modular architecture** with separate files for utilities, SEO tools, and content scripts. The `manifest.json` must include the `content_scripts` section to ensure automatic injection on all pages.

**Correct file structure:**
```
seo-tools-pro/
├── manifest.json      # Extension configuration (MUST include content_scripts)
├── background.js      # Service worker
├── utils.js           # Helper functions (copy, notifications, modals)
├── seo-tools.js       # Core SEO tool implementations
├── content.js         # Message router & event handlers
├── popup.html         # Popup interface
├── popup.css          # Styling
└── popup.js           # Popup logic & favorites system
```

## ✨ Features

### ⭐ Favorites System
- **Pin Your Tools** - Click the star icon (★) on any tool to instantly pin it to your dedicated "Favs" tab for quick access to your most-used features.
- **Context Menu Integration** - Pinned tools appear in the right-click context menu for lightning-fast access.

### 📊 SEO Tools

#### Website Analysis
- Wayback Machine Archive
- WHOIS Lookup
- Pingdom Speed Test
- PageSpeed Insights
- Schema.org Validator
- Google Rich Results Test
- AMP Test
- Mobile-Friendly Test

#### Link Analysis
- **Highlight Do-Follow Links** - Visual identification of do-follow links (green highlight)
- **Remove Highlights** - Clear all link highlights
- **Internal vs External Links** - Comprehensive link analysis with ratio breakdown
- **Broken Link Checker** - Automatically tests all links on the page and visually highlights broken/blocked links in red and successful links in green. **Includes CSV export of broken links.**

#### Link Building & Prospecting
- **Link Prospect Finder** - Generate Google search queries to find guest post and link building opportunities
- **Resource Page Finder** - Find resource pages for broken link building and resource page outreach

#### On-Page SEO
- **Heading Structure (H1-H6)** - Analyze heading hierarchy and count
- **Meta Tags Analysis** - Check title, description, robots, canonical tags
- **Images Alt Text** - Accessibility audit for image alt attributes
- **Word Count & Readability** - Content analysis with readability scoring
- **Keyword Density** - Extracts the top keywords on the page, filters out common stop words, and highlights over-optimized densities.
- **SERP Preview** - Live, interactive Google Desktop preview of your Title and Meta Description with character length tracking.

#### 🤖 AI-Powered SEO
- **AI Meta Generator** - Generate SEO-optimized title tags and meta descriptions based on page content
- **SEO Title Generator** - Create 10+ optimized title variations with character count tracking
- **AI Topic Generator** - Generate blog topic ideas across multiple categories (How-To, Lists, Comparisons, etc.)
- **AI Alt Text Generator** - Smart alt text suggestions for images using contextual analysis

#### 📍 Local SEO
- **Local Keyword Finder** - Generate location-based keywords with "near me" and intent-based variations across multiple cities simultaneously.
- **Google Maps Scraper** - Extract business information from Google Maps results (manual selection or auto-extract modes).
- **Local Citation Finder** - Discover citation opportunities across 50+ directories with niche-specific options.

#### 🌍 International SEO
- **Hreflang Generator** - Generate hreflang tags for multilingual websites with multiple URL pattern options (subdirectory, subdomain, parameter).

#### 📅 Publishing & Freshness
- **Publication Date Checker** - Analyze content freshness from meta tags, schema, URLs, and visible dates.

#### 📱 Mobile SEO
- **Mobile Usability Test** - Test viewport configuration, tap targets, font sizes, and horizontal scrolling with detailed scoring.

#### 📄 Content Audit
- **Duplicate Content Finder** - Search for duplicate content both internally and externally with content fingerprinting.

#### 🏗️ Site Architecture
- **Site Structure Visualizer** - Map internal linking, heading structure, navigation hierarchy, and technical SEO metrics.

#### ⚙️ Technical SEO
- **Structured Data (Schema)** - Validate JSON-LD schema markup
- **Robots.txt Checker** - Quick access to robots.txt file
- **Sitemap Finder** - Locate sitemap.xml automatically
- **URL Optimizer** - Analyze and suggest optimized URL structures
- **Export SEO Data** - Download complete SEO metrics as JSON

#### 📈 Authority & Metrics
- Authority Score (SEMrush)
- Spam Score (Website SEO Checker)
- Domain Rating (Ahrefs)
- Organic Traffic (Ahrefs)
- All Metrics - Open multiple tools at once

#### 🔎 Search & Discovery
- Find Blog Pages
- Find Guest Post Pages
- Advanced Search
- Search Operators Tool
- **Keyword Rank Tracker** - Automatically scrape Google search results up to 10 pages deep to find your target domain's ranking position, complete with CSV export.

#### ✅ SEO Audit
- **SEO Audit Checklist** - Complete SEO checklist with progress tracking, export, and persistent save
- **SEO Dashboard** - Visual dashboard with overall SEO score and detailed metrics

### 📧 Email Templates

#### Payment Requests
- Advance Payment (PayPal)
- Payment Request (PayPal)
- Payment Request (GCash)
- Send Invoice to Webmaster

#### Article Communication
- Sending Article (with guidelines)
- Quick Article
- Article Follow-up
- 2nd Follow-up
- Final Notice
- Cancellation
- Declined Response

#### Outreach & Negotiation
- Email Outreach Templates
- Negotiation Templates ($50 offer)
- Contact Form Auto-Filler

#### Template Manager
- **Edit Custom Templates** - Modify any custom template
- **Create New Templates** - Add unlimited custom email templates
- **Reset to Default** - Restore customized templates to original
- **Delete Custom Templates** - Remove templates you no longer need
- **Preview** - See how your template looks with sample data
- **Export/Import** - Backup or restore templates anytime

### 🔗 Extractors
- Link Extractor (with internal/external classification and CSV export)
- Domain Extractor (filtered by TLD and social domains)
- Email Extractor (with modal UI and copy functionality)
- Social Media Links Finder
- Google Results Domain Extractor
- **Deep Google Domain Extractor** - Scrape up to 50 pages of Google results to extract unique domains

### ⚡ Utilities & Advanced Toolkits
- **Bulk URL Opener** - Paste a list of URLs and open them all simultaneously in background tabs with progress tracking.
- **Full Page Capture** - Take a screenshot of the entire webpage, even beyond the viewport.
- **Advanced SEO Text Compare** - Visually compare two pieces of text for similarity, reading time, and keyword gaps.
- **Advanced Image Toolkit** - A complete suite to resize, convert formats, optimize (compress to WebP), find free stock images, and analyze on-page image SEO.
- URL Slug Generator
- WhatsApp Link Generator
- Copy Current URL & Domain
- Scroll to Bottom & Next Page Navigation

### 🎨 Display Options
- **Dark Mode** - Toggle between light and dark themes
- **Clear Cache** - Remove cached tool data

### 🔗 Apps Integration
- Task Tracker
- GDI Profiler
- Link Tool
- PBN Buster
- SearchWorks Blog & YouTube Channel
- Search Engine Roundtable News

## 🚀 Installation

1. **Create a folder** named `seo-tools-pro`
2. **Save all files** into that folder:
   - `manifest.json` (use the updated version with `content_scripts`)
   - `background.js`
   - `utils.js`
   - `seo-tools.js`
   - `content.js`
   - `popup.html`
   - `popup.css`
   - `popup.js`
3. Open Chrome and navigate to `chrome://extensions/`
4. Enable **Developer mode** (toggle in top right)
5. Click **Load unpacked**
6. Select the extension folder
7. **Done!** The extension icon appears in your toolbar!

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+G` (Win) / `Cmd+Shift+G` (Mac) | Open extension |
| `/` (when popup open) | Focus search |
| `Ctrl+T` / `Cmd+T` | Open Template Manager |
| `Ctrl+S` / `Cmd+S` | Open Settings |
| `Ctrl+D` / `Cmd+D` | Toggle Dark Mode |
| `Ctrl+F` / `Cmd+F` | Focus Search |
| `Esc` (in search) | Clear search |

## 🎨 Settings

Access settings by clicking the ⚙️ icon in the header:

- **Personal Information**: Name, Email, Phone, LinkedIn
- **Appearance**: Dark/Light mode toggle
- **Payment Defaults**: Currency and amount presets
- **Export/Import**: Backup and restore settings (now includes both sync and local storage data)

## 📝 Template Manager & Variables

Use these variables in your templates for dynamic content:

| Variable | Description |
|----------|-------------|
| `{{yourName}}` | Your name from settings |
| `{{webmaster}}` | Webmaster's name |
| `{{website}}` | Website URL |
| `{{amount}}` | Payment amount |
| `{{currency}}` | Currency type |
| `{{articleTitle}}` | Article title |
| `{{clientAccount}}` | Client account name |
| `{{publishedLink}}` | Published article URL |
| `{{paypalName}}` | PayPal account name |
| `{{paypalDetails}}` | PayPal invoice details |
| `{{gcashName}}` | GCash account name |
| `{{gcashNumber}}` | GCash account number |

## 🔧 Development

### File Structure & Architecture

```
seo-tools-pro/
├── manifest.json      # Extension configuration (Manifest V3)
├── background.js      # Service worker (context menus, alarms, message routing)
├── utils.js           # Shared helpers (copyToClipboard, showNotification, createModal)
├── seo-tools.js       # Core implementations of all 85+ SEO tools
├── content.js         # Message listener that routes actions to seo-tools.js
├── popup.html         # Popup interface
├── popup.css          # Styling (light/dark mode support)
└── popup.js           # Popup logic, favorites system, settings, templates
```

### Permissions Explained

| Permission | Purpose |
|------------|---------|
| `activeTab` | Access current tab for tool execution |
| `clipboardWrite` | Copy results to clipboard |
| `tabs` | Create, update, and query tabs |
| `storage` | Save settings, templates, and favorites |
| `scripting` | Dynamically inject scripts when needed |
| `alarms` | Keep service worker alive |
| `contextMenus` | Right-click menu for quick tool access |
| `<all_urls>` | Allow content scripts to run on all websites |

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Tools not working | Ensure the `manifest.json` includes the `content_scripts` section. Reload the extension. |
| Highlights not appearing | Refresh the page after installing/reloading the extension. |
| Settings not saving | Check Chrome storage permissions in extension settings. |
| Dark mode not applying | Toggle dark mode twice or reload popup. |
| Content script errors | Check the console (F12) for errors. Ensure all files are in the correct folder. |
| Google Maps scraper not working | Use Manual Selection Mode if auto-extract fails. Scroll to load all results first. |
| Bulk URL opener blocked | Allow popups for the site or reduce the number of URLs opened at once. |

## 📊 Tool Count

| Category | Tools |
|----------|-------|
| SEO Tools | 45+ |
| Email Templates | 14 |
| Extractors | 6 |
| Utilities & Toolkits | 15+ |
| Apps | 7 |
| **Total** | **85+** |

## 📞 Support

- **Developer**: Jonathan Harris
- **Email**: jonathn.p.harris@gmail.com
- **Website**: [https://searchworks.ph](https://searchworks.ph)

## 📝 License

This extension is for personal and professional use.

---

**Version**: 2.4.0  
**Author**: Jonathan Harris  
**Created by**: [SearchWorks.ph](https://searchworks.ph)

## 💡 Pro Tips

1. **Use Template Variables** - Create dynamic templates with `{{variable}}` placeholders
2. **Export Settings** - Backup your configuration before updating (now includes both sync and local data)
3. **Pinning** - Use the Star icon to build your custom dashboard in the Favs tab. Pinned tools also appear in the right-click context menu!
4. **Search Feature** - Quickly find any tool with `/` shortcut or `Ctrl+F`
5. **Combine Tools** - Use Bulk URL opener with Link Extractors to speed up prospecting
6. **Keyword Rank Tracker** - Run on Google search results to find where your domain ranks
7. **Full Page Capture** - Great for saving competitor analysis or client reports
8. **AI Meta Generator** - Saves hours of manual SEO copywriting
9. **Local Keyword Finder** - Essential for local SEO campaigns (now supports multi-city permutations)
10. **SEO Dashboard** - Quick overview of any page's SEO health
11. **Broken Link Checker** - Use the CSV export to create a punch list for link reclamation campaigns.
12. **Manual Maps Scraper** - If auto-extract misses businesses, click "Manual Selection Mode" and click each result in the sidebar.
```

### 📋 Summary of README Updates

| Section | Changes Made |
|---------|--------------|
| **Installation Note** | Added a warning about the `content_scripts` requirement in `manifest.json` |
| **File Structure** | Updated to include the new modular files (`utils.js`, `seo-tools.js`) |
| **Features** | Added details about CSV export for Broken Link Checker, multi-city support for Local Keyword Finder, and manual mode for Maps Scraper |
| **Installation Steps** | Clarified which files need to be saved and emphasized the updated manifest |
| **Development Section** | Added a detailed file structure and architecture explanation |
| **Permissions Explained** | Added a table explaining why each permission is required |
| **Troubleshooting** | Added new entries for Maps scraper, Bulk URL opener, and manifest-related issues |
| **Pro Tips** | Added new tips about context menu pinning, broken link CSV export, and manual Maps scraper mode |