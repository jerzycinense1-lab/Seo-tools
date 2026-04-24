// GDI SEO Tools Pro - Background Service Worker

// Store current favorites in memory for quick access
let currentFavorites = [];
let contextMenuInitialized = false;
let isRebuildingMenu = false; // <-- ADD THIS NEW LOCK VARIABLE

chrome.runtime.onInstalled.addListener((details) => {
  console.log('🚀 SEO Tools Pro - Created by SearchWorks.ph');
  console.log('🔗 https://searchworks.ph');
  console.log('📧 Support: jonathn.p.harris@gmail.com');
  
  if (details.reason === 'install') {
    chrome.storage.sync.set({
      userName: 'Jonathan Harris',
      userEmail: 'jonathn.p.harris@gmail.com',
      userPhone: '9928524796',
      userLinkedin: 'https://linkedin.com/in/jonathan-harris',
      defaultCurrency: 'USD',
      defaultAmount: '50',
      darkMode: false,
      favorites: [],
      customTemplates: {}
    });
    
    // Show welcome message with credits
    chrome.tabs.create({
      url: 'https://searchworks.ph',
      active: false
    });
  } else if (details.reason === 'update') {
    console.log('Updated from version', details.previousVersion);
  }
  
  // Initialize context menu after installation
  loadFavoritesAndCreateMenu();
});

// Listen for storage changes to update context menu dynamically
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'sync' && changes.favorites) {
    console.log('📌 Favorites updated, refreshing context menu');
    currentFavorites = changes.favorites.newValue || [];
    rebuildContextMenu();
  }
});

// Initialize context menu when service worker starts
chrome.runtime.onStartup.addListener(() => {
  loadFavoritesAndCreateMenu();
});

// Also try to initialize when the worker wakes up
loadFavoritesAndCreateMenu();

// Load favorites and create context menu
async function loadFavoritesAndCreateMenu() {
  try {
    const result = await chrome.storage.sync.get({ favorites: [] });
    currentFavorites = result.favorites || [];
    await rebuildContextMenu();
  } catch (error) {
    console.error('Failed to load favorites:', error);
  }
}

// Rebuild the entire context menu securely
async function rebuildContextMenu() {
  // If we are already building the menu, stop and don't do it again
  if (isRebuildingMenu) return;
  isRebuildingMenu = true;

  try {
    // Wait securely for all menus to be removed before creating new ones
    await new Promise(resolve => chrome.contextMenus.removeAll(resolve));
    
    // Create the main parent menu
    chrome.contextMenus.create({
      id: 'seoToolsPro',
      title: '🛠️ SEO Tools Pro',
      contexts: ['page', 'selection', 'link', 'image']
    });
    
    // Add separator
    chrome.contextMenus.create({
      id: 'seoToolsPro-separator-1',
      parentId: 'seoToolsPro',
      type: 'separator',
      contexts: ['page', 'selection', 'link', 'image']
    });
    
    // Add Favorites section header
    chrome.contextMenus.create({
      id: 'favorites-header',
      parentId: 'seoToolsPro',
      title: '⭐ FAVORITES',
      enabled: false,
      contexts: ['page', 'selection', 'link', 'image']
    });
    
    if (currentFavorites.length === 0) {
      chrome.contextMenus.create({
        id: 'no-favorites',
        parentId: 'seoToolsPro',
        title: 'No pinned tools yet',
        enabled: false,
        contexts: ['page', 'selection', 'link', 'image']
      });
      
      chrome.contextMenus.create({
        id: 'add-favorites-hint',
        parentId: 'seoToolsPro',
        title: 'Click ★ in popup to pin tools',
        enabled: false,
        contexts: ['page', 'selection', 'link', 'image']
      });
    } else {
      currentFavorites.forEach((actionId) => {
        const toolInfo = getToolInfo(actionId);
        if (toolInfo) {
          chrome.contextMenus.create({
            id: `fav-${actionId}`,
            parentId: 'seoToolsPro',
            title: toolInfo.name,
            contexts: ['page', 'selection', 'link', 'image']
          });
        }
      });
    }
    
    // Add separator
    chrome.contextMenus.create({
      id: 'seoToolsPro-separator-2',
      parentId: 'seoToolsPro',
      type: 'separator',
      contexts: ['page', 'selection', 'link', 'image']
    });
    
    // Add Quick Actions section
    chrome.contextMenus.create({
      id: 'quick-actions-header',
      parentId: 'seoToolsPro',
      title: '⚡ QUICK ACTIONS',
      enabled: false,
      contexts: ['page', 'selection', 'link', 'image']
    });
    
    chrome.contextMenus.create({ id: 'copy-url', parentId: 'seoToolsPro', title: '📋 Copy Current URL', contexts: ['page'] });
    chrome.contextMenus.create({ id: 'copy-domain', parentId: 'seoToolsPro', title: '🌐 Copy Domain', contexts: ['page'] });
    chrome.contextMenus.create({ id: 'scroll-bottom', parentId: 'seoToolsPro', title: '⬇️ Scroll to Bottom', contexts: ['page'] });
    chrome.contextMenus.create({ id: 'full-page-capture', parentId: 'seoToolsPro', title: '📸 Full Page Capture', contexts: ['page'] });
    chrome.contextMenus.create({ id: 'urlslug-selection', parentId: 'seoToolsPro', title: '🔗 Generate URL Slug from Selection', contexts: ['selection'] });
    chrome.contextMenus.create({ id: 'whatsapp-selection', parentId: 'seoToolsPro', title: '💬 WhatsApp Link from Selection', contexts: ['selection'] });
    chrome.contextMenus.create({ id: 'search-selection', parentId: 'seoToolsPro', title: '🔍 Search Google for Selection', contexts: ['selection'] });
    chrome.contextMenus.create({ id: 'extract-links', parentId: 'seoToolsPro', title: '🔗 Extract All Links', contexts: ['page'] });
    chrome.contextMenus.create({ id: 'highlight-dofollow', parentId: 'seoToolsPro', title: '✅ Highlight Do-Follow Links', contexts: ['page'] });
    chrome.contextMenus.create({ id: 'remove-highlights', parentId: 'seoToolsPro', title: '🗑️ Remove Highlights', contexts: ['page'] });
    
    chrome.contextMenus.create({ id: 'seoToolsPro-separator-3', parentId: 'seoToolsPro', type: 'separator', contexts: ['page', 'selection', 'link', 'image'] });
    chrome.contextMenus.create({ id: 'open-popup', parentId: 'seoToolsPro', title: '🚀 Open Full Toolbox', contexts: ['page', 'selection', 'link', 'image'] });
    chrome.contextMenus.create({ id: 'open-settings', parentId: 'seoToolsPro', title: '⚙️ Settings', contexts: ['page', 'selection', 'link', 'image'] });
    
    contextMenuInitialized = true;
    console.log('✅ Context menu rebuilt with', currentFavorites.length, 'favorites');
    
  } catch (error) {
    console.error('Failed to rebuild context menu:', error);
  } finally {
    // Release the lock
    isRebuildingMenu = false;
  }
}

// Get tool display name from action ID
function getToolInfo(actionId) {
  const toolMap = {
    // SEO Tools
    'wayback': { name: '📜 Wayback Machine' },
    'whois': { name: '🔎 WHOIS Lookup' },
    'pingdom': { name: '⚡ Pingdom Speed Test' },
    'pagespeed': { name: '🚀 PageSpeed Insights' },
    'mobile-friendly': { name: '📱 Mobile-Friendly Test' },
    'schema': { name: '📋 Schema Validator' },
    'richresults': { name: '✨ Rich Results Test' },
    'amp': { name: '📱 AMP Test' },
    'highlight-dofollow': { name: '✅ Highlight Do-Follow Links' },
    'remove-highlights': { name: '🗑️ Remove Highlights' },
    'analyze-links': { name: '🔗 Link Analysis' },
    'broken-links': { name: '🚨 Broken Link Checker' },
    'analyze-headings': { name: '📊 Heading Structure' },
    'analyze-meta': { name: '🏷️ Meta Tags Analysis' },
    'analyze-images': { name: '🖼️ Images Alt Text' },
    'analyze-content': { name: '📝 Word Count & Readability' },
    'keyword-density': { name: '🔤 Keyword Density' },
    'serp-preview': { name: '👁️ SERP Preview' },
    'ai-meta-generator': { name: '🤖 AI Meta Generator' },
    'title-generator': { name: '📝 SEO Title Generator' },
    'ai-topic-generator': { name: '💡 AI Topic Generator' },
    'alt-generator': { name: '🖼️ AI Alt Text Generator' },
    'structured-data': { name: '📋 Structured Data Check' },
    'robots-txt': { name: '🤖 Check robots.txt' },
    'sitemap': { name: '🗺️ Find Sitemap' },
    'url-optimizer': { name: '🔗 URL Optimizer' },
    'export-seo-data': { name: '💾 Export SEO Data' },
    'authority': { name: '💪 Authority Score' },
    'spamscore': { name: '⚠️ Spam Score' },
    'domainrating': { name: '📊 Domain Rating' },
    'traffic': { name: '📈 Organic Traffic' },
    'metrics': { name: '🎯 All Metrics' },
    'blogs': { name: '📰 Find Blog' },
    'guestpost': { name: '✍️ Guest Post Pages' },
    'advsearch': { name: '🔬 Advanced Search' },
    'searchoperators': { name: '🔤 Search Operators' },
    'keyword-rank-tracker': { name: '🎯 Keyword Rank Tracker' },
    'seo-audit-checklist': { name: '✅ SEO Audit Checklist' },
    'audit-checklist': { name: '✅ SEO Audit' },
    'link-prospects': { name: '🎯 Link Prospect Finder' },
    'resource-pages': { name: '📚 Resource Page Finder' },
    'local-keyword-finder': { name: '📍 Local Keyword Finder' },
    'hreflang-generator': { name: '🌐 Hreflang Generator' },
    'pubdate-checker': { name: '📅 Publication Date Checker' },
    'mobile-usability': { name: '📱 Mobile Usability Test' },
    'duplicate-content': { name: '🔄 Duplicate Content Finder' },
    'site-structure': { name: '🗺️ Site Structure Visualizer' },
    'maps-scraper': { name: '🗺️ Google Maps Scraper' },
    'citation-finder': { name: '📋 Local Citation Finder' },
    'seo-dashboard': { name: '📊 SEO Dashboard' },
    
    // Email Templates
    'advance-payment': { name: '💵 Advance Payment' },
    'payment-paypal': { name: '📬 PayPal Payment Request' },
    'payment-gcash': { name: '📱 GCash Payment Request' },
    'send-invoice': { name: '📄 Send Invoice' },
    'send-article': { name: '📤 Sending Article' },
    'send-quick-article': { name: '⚡ Quick Article' },
    'article-followup': { name: '📞 Article Follow-up' },
    'second-followup': { name: '📞 2nd Follow-up' },
    'final-notice': { name: '⚠️ Final Notice' },
    'cancel': { name: '❌ Cancellation' },
    'declined': { name: '🙏 Declined Response' },
    'email-outreach': { name: '📧 Email Outreach' },
    'nego': { name: '💬 Negotiation' },
    'contact-form': { name: '📝 Contact Form Filler' },
    
    // Extractors
    'linkextract': { name: '🔗 Link Extractor' },
    'domainextract': { name: '🌐 Domain Extractor' },
    'googledomain': { name: '🔍 Google Domain Search' },
    'email-extract': { name: '📧 Email Extractor' },
    'social-extract': { name: '📱 Social Media Links' },
    'bulk-google-domains': { name: '🌐 Deep Google Domain Extractor' },
    
    // Utilities
    'urlslug': { name: '🔗 URL Slug Generator' },
    'whatsapp-link': { name: '💬 WhatsApp Link' },
    'copy-url': { name: '📋 Copy URL' },
    'copy-domain': { name: '🌐 Copy Domain' },
    'scroll': { name: '⬇️ Scroll to Bottom' },
    'nextpage': { name: '➡️ Next Page' },
    'bulk-url': { name: '📂 Bulk URL Opener' },
    'full-page-capture': { name: '📸 Full Page Capture' },
    'advanced-text-compare': { name: '🔍 SEO Text Compare' },
    'image-toolkit': { name: '🖼️ Image Toolkit' },
    
    // External Apps
    'https://task-tracker.searchworks.ph/': { name: '📋 Task Tracker' },
    'https://gdi-profiler.searchworks.ph/dashboard': { name: '📊 GDI Profiler' },
    'https://link-tool.searchworks.ph/dashboard': { name: '🔗 Link Tool' },
    'https://pbn-buster.searchworks.ph/': { name: '🛡️ PBN Buster' }
  };
  
  return toolMap[actionId] || { name: actionId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) };
}

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  const menuId = info.menuItemId;
  const tabId = tab.id;
  
  console.log('Context menu clicked:', menuId);
  
  // Handle favorite tools (prefixed with 'fav-')
  if (menuId.startsWith('fav-')) {
    const action = menuId.replace('fav-', '');
    await executeToolAction(tabId, action, info);
    return;
  }
  
  // Handle other menu items
  switch (menuId) {
    case 'copy-url':
      await executeToolAction(tabId, 'copy-url', info);
      break;
      
    case 'copy-domain':
      await executeToolAction(tabId, 'copy-domain', info);
      break;
      
    case 'scroll-bottom':
      await executeToolAction(tabId, 'scroll', info);
      break;
      
    case 'full-page-capture':
      await executeToolAction(tabId, 'full-page-capture', info);
      break;
      
    case 'urlslug-selection':
      await executeToolAction(tabId, 'urlslug', info);
      break;
      
    case 'whatsapp-selection':
      await executeToolAction(tabId, 'whatsapp-link', info);
      break;
      
    case 'search-selection':
      if (info.selectionText) {
        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(info.selectionText)}`;
        chrome.tabs.create({ url: searchUrl });
      }
      break;
      
    case 'extract-links':
      await executeToolAction(tabId, 'linkextract', info);
      break;
      
    case 'highlight-dofollow':
      await executeToolAction(tabId, 'highlight-dofollow', info);
      break;
      
    case 'remove-highlights':
      await executeToolAction(tabId, 'remove-highlights', info);
      break;
      
    case 'open-popup':
      chrome.action.openPopup();
      break;
      
    case 'open-settings':
      // Open popup and trigger settings
      chrome.action.openPopup();
      // Send message to popup to open settings (will be handled when popup loads)
      setTimeout(() => {
        chrome.runtime.sendMessage({ action: 'openSettings' }).catch(() => {});
      }, 500);
      break;
  }
});

// Execute tool action on a specific tab (Dynamic Injection Ready)
async function executeToolAction(tabId, action, contextInfo = {}) {
  try {
    // 1. Get settings from storage
    const settings = await chrome.storage.sync.get({
      userName: 'Jonathan Harris',
      userEmail: 'jonathn.p.harris@gmail.com',
      userPhone: '9928524796',
      userLinkedin: 'https://linkedin.com/in/jonathan-harris',
      defaultCurrency: 'USD',
      defaultAmount: '50'
    });
    
    const templates = await chrome.storage.sync.get({ customTemplates: {} });
    
    // 2. Prepare the message payload
    const messagePayload = {
      action: action,
      settings: settings,
      templates: templates.customTemplates,
      contextInfo: {
        selectionText: contextInfo.selectionText || '',
        linkUrl: contextInfo.linkUrl || '',
        pageUrl: contextInfo.pageUrl || ''
      }
    };

    // 3. Try to send the message. If content.js isn't injected yet, this will throw an error.
    try {
      await chrome.tabs.sendMessage(tabId, messagePayload);
    } catch (injectionError) {
      console.log('Content script not active. Injecting dynamically...');
      
     // Inject the scripts on-demand (Order matters!)
      await chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: [
          'utils.js',     // 1. Load helpers first
          'seo-tools.js', // 2. Load tool logic second
          'content.js'    // 3. Load the message listener last
        ]
      });
      
      // Wait a tiny fraction of a second for the script to initialize its listeners
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Try sending the message again now that the script is ready
      await chrome.tabs.sendMessage(tabId, messagePayload);
    }
    
  } catch (error) {
    console.error('Failed to execute tool action:', error);
    
    // If it's a direct URL tool, open it as a fallback
    const directUrls = {
      'wayback': () => `https://web.archive.org/web/*/${contextInfo.pageUrl}`,
      'whois': () => `https://www.whois.com/whois/${new URL(contextInfo.pageUrl).hostname}`,
      'pingdom': () => `https://tools.pingdom.com/?url=${encodeURIComponent(contextInfo.pageUrl)}`,
      'pagespeed': () => `https://developers.google.com/speed/pagespeed/insights/?url=${encodeURIComponent(contextInfo.pageUrl)}`,
      'mobile-friendly': () => `https://search.google.com/test/mobile-friendly?url=${encodeURIComponent(contextInfo.pageUrl)}`
    };
    
    if (directUrls[action] && contextInfo.pageUrl) {
      chrome.tabs.create({ url: directUrls[action]() });
    }
  }
}

chrome.commands.onCommand.addListener((command) => {
  if (command === 'toggle-extension') {
    chrome.action.openPopup();
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'openUrl') {
    chrome.tabs.create({ url: request.url });
    sendResponse({ success: true });
  }
  
  // Listen for screenshot requests from content.js
  if (request.action === 'captureVisibleTab') {
    chrome.tabs.captureVisibleTab(null, { format: 'png' }, (dataUrl) => {
      sendResponse({ dataUrl: dataUrl });
    });
    return true; // Keep the message channel open for the asynchronous response
  }
  
  // Listen for context menu refresh request
  if (request.action === 'refreshContextMenu') {
    loadFavoritesAndCreateMenu().then(() => {
      sendResponse({ success: true });
    });
    return true;
  }
  
  return true;
});

// UPGRADE: Use Alarms instead of setInterval for Manifest V3 reliability
try {
  chrome.alarms.create('keepAlive', { periodInMinutes: 1 });
  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'keepAlive') {
      console.log('🔧 SEO Tools Pro - Service Worker Active');
    }
  });
} catch (e) {
  console.log('Alarms API may not be available in this context');
}
