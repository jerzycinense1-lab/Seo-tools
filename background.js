// GDI SEO Tools Pro - Background Service Worker v4.0

// Store current favorites in memory for quick access
let currentFavorites = [];
let contextMenuInitialized = false;
let isRebuildingMenu = false;

chrome.runtime.onInstalled.addListener((details) => {
  console.log('🚀 SEO Tools Pro v4.0 - Created by SearchWorks.ph');
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
    
    chrome.tabs.create({
      url: 'https://searchworks.ph',
      active: false
    });
  } else if (details.reason === 'update') {
    console.log('Updated from version', details.previousVersion);
  }
  
  loadFavoritesAndCreateMenu();
});

// Listen for storage changes
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'sync' && changes.favorites) {
    console.log('📌 Favorites updated, refreshing context menu');
    currentFavorites = changes.favorites.newValue || [];
    rebuildContextMenu();
  }
});

// Initialize on startup
chrome.runtime.onStartup.addListener(() => {
  loadFavoritesAndCreateMenu();
});

// Initialize when worker wakes up
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

// Rebuild context menu
async function rebuildContextMenu() {
  if (isRebuildingMenu) return;
  isRebuildingMenu = true;

  try {
    await new Promise(resolve => chrome.contextMenus.removeAll(resolve));
    
    // Main parent menu
    chrome.contextMenus.create({
      id: 'seoToolsPro',
      title: '🛠️ SEO Tools Pro',
      contexts: ['page', 'selection', 'link', 'image']
    });
    
    // Separator
    chrome.contextMenus.create({
      id: 'seoToolsPro-separator-1',
      parentId: 'seoToolsPro',
      type: 'separator',
      contexts: ['page', 'selection', 'link', 'image']
    });
    
    // Favorites header
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
    
    // Separator
    chrome.contextMenus.create({
      id: 'seoToolsPro-separator-2',
      parentId: 'seoToolsPro',
      type: 'separator',
      contexts: ['page', 'selection', 'link', 'image']
    });
    
    // Quick Actions
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
    chrome.contextMenus.create({ id: 'urlslug-selection', parentId: 'seoToolsPro', title: '🔗 Generate URL Slug', contexts: ['selection'] });
    chrome.contextMenus.create({ id: 'whatsapp-selection', parentId: 'seoToolsPro', title: '💬 WhatsApp Link', contexts: ['selection'] });
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
    isRebuildingMenu = false;
  }
}

// Get tool display name
function getToolInfo(actionId) {
  const toolMap = {
    'wayback': { name: '📜 Wayback Machine' },
    'whois': { name: '🔎 WHOIS Lookup' },
    'pagespeed': { name: '🚀 PageSpeed Insights' },
    'schema': { name: '📋 Schema Validator' },
    'richresults': { name: '✨ Rich Results Test' },
    'highlight-dofollow': { name: '✅ Highlight Do-Follow' },
    'remove-highlights': { name: '🗑️ Remove Highlights' },
    'analyze-headings': { name: '📊 Heading Structure' },
    'analyze-meta': { name: '🏷️ Meta Tags Analysis' },
    'analyze-images': { name: '🖼️ Images Alt Text' },
    'analyze-content': { name: '📝 Word Count & Readability' },
    'keyword-density': { name: '🔤 Keyword Density' },
    'serp-preview': { name: '👁️ SERP Preview' },
    'broken-links': { name: '🚨 Broken Link Checker' },
    'robots-txt': { name: '🤖 Check robots.txt' },
    'sitemap': { name: '🗺️ Find Sitemap' },
    'metrics': { name: '🎯 All Metrics' },
    'linkextract': { name: '🔗 Link Extractor' },
    'domainextract': { name: '🌐 Domain Extractor' },
    'email-extract': { name: '📧 Email Extractor' },
    'social-extract': { name: '📱 Social Media Links' },
    'urlslug': { name: '🔗 URL Slug Generator' },
    'whatsapp-link': { name: '💬 WhatsApp Link' },
    'copy-url': { name: '📋 Copy URL' },
    'copy-domain': { name: '🌐 Copy Domain' },
    'scroll': { name: '⬇️ Scroll to Bottom' },
    'full-page-capture': { name: '📸 Full Page Capture' },
  };
  
  return toolMap[actionId] || { name: actionId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) };
}

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  const menuId = info.menuItemId;
  const tabId = tab.id;
  
  if (menuId.startsWith('fav-')) {
    const action = menuId.replace('fav-', '');
    await executeToolAction(tabId, action, info);
    return;
  }
  
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
        chrome.tabs.create({ url: `https://www.google.com/search?q=${encodeURIComponent(info.selectionText)}` });
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
      chrome.action.openPopup();
      setTimeout(() => {
        chrome.runtime.sendMessage({ action: 'openSettings' }).catch(() => {});
      }, 500);
      break;
  }
});

// Execute tool action on a specific tab
async function executeToolAction(tabId, action, contextInfo = {}) {
  try {
    const settings = await chrome.storage.sync.get({
      userName: 'Jonathan Harris',
      userEmail: 'jonathn.p.harris@gmail.com',
      userPhone: '9928524796',
      userLinkedin: 'https://linkedin.com/in/jonathan-harris',
      defaultCurrency: 'USD',
      defaultAmount: '50'
    });
    
    const templates = await chrome.storage.sync.get({ customTemplates: {} });
    
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

    try {
      await chrome.tabs.sendMessage(tabId, messagePayload);
    } catch (injectionError) {
      console.log('Content script not active. Injecting dynamically...');
      
      await chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ['utils.js', 'seo-tools.js', 'content.js']
      });
      
      await new Promise(resolve => setTimeout(resolve, 100));
      await chrome.tabs.sendMessage(tabId, messagePayload);
    }
    
  } catch (error) {
    console.error('Failed to execute tool action:', error);
    
    // Fallback for direct URL tools
    const directUrls = {
      'wayback': () => `https://web.archive.org/web/*/${contextInfo.pageUrl}`,
      'whois': () => `https://www.whois.com/whois/${new URL(contextInfo.pageUrl).hostname}`,
      'pingdom': () => `https://tools.pingdom.com/?url=${encodeURIComponent(contextInfo.pageUrl)}`,
      'pagespeed': () => `https://developers.google.com/speed/pagespeed/insights/?url=${encodeURIComponent(contextInfo.pageUrl)}`,
    };
    
    if (directUrls[action] && contextInfo.pageUrl) {
      chrome.tabs.create({ url: directUrls[action]() });
    }
  }
}

// Keyboard shortcut
chrome.commands.onCommand.addListener((command) => {
  if (command === 'toggle-extension') {
    chrome.action.openPopup();
  }
});

// Message listener
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'openUrl') {
    chrome.tabs.create({ url: request.url });
    sendResponse({ success: true });
  }
  
  if (request.action === 'captureVisibleTab') {
    chrome.tabs.captureVisibleTab(null, { format: 'png' }, (dataUrl) => {
      sendResponse({ dataUrl: dataUrl });
    });
    return true;
  }
  
  if (request.action === 'refreshContextMenu') {
    loadFavoritesAndCreateMenu().then(() => {
      sendResponse({ success: true });
    });
    return true;
  }
  
  return true;
});

// Keep alive
try {
  chrome.alarms.create('keepAlive', { periodInMinutes: 1 });
  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'keepAlive') {
      console.log('🔧 SEO Tools Pro - Service Worker Active');
    }
  });
} catch (e) {
  console.log('Alarms API may not be available');
}