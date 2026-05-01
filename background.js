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
      userName: '',
      userEmail: '',
      userPhone: '',
      userLinkedin: '',
      defaultCurrency: '',
      defaultAmount: '',
      darkMode: false,
      themePrimary: '#2563EB',
      themeAccent: '#F59E0B',
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
    const result = await chrome.storage.sync.get({ favorites: [], customTemplates: {} });
    currentFavorites = result.favorites || [];
    await rebuildContextMenu(result.customTemplates || {});
  } catch (error) {
    console.error('Failed to load favorites:', error);
  }
}

// Rebuild context menu
async function rebuildContextMenu(customTemplates = {}) {
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
        const toolInfo = getToolInfo(actionId, customTemplates);
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
    
    // --- Context: Page ---
    chrome.contextMenus.create({ id: 'page-header', parentId: 'seoToolsPro', title: '📄 PAGE ACTIONS', enabled: false, contexts: ['page'] });
    chrome.contextMenus.create({ id: 'copy-url', parentId: 'seoToolsPro', title: '📋 Copy Current URL', contexts: ['page'] });
    chrome.contextMenus.create({ id: 'copy-domain', parentId: 'seoToolsPro', title: '🌐 Copy Domain', contexts: ['page'] });
    chrome.contextMenus.create({ id: 'full-page-capture', parentId: 'seoToolsPro', title: '📸 Full Page Capture', contexts: ['page'] });
    chrome.contextMenus.create({ id: 'extract-links', parentId: 'seoToolsPro', title: '🔗 Extract All Links', contexts: ['page'] });
    chrome.contextMenus.create({ id: 'highlight-dofollow', parentId: 'seoToolsPro', title: '✅ Highlight Do-Follow', contexts: ['page'] });
    chrome.contextMenus.create({ id: 'remove-highlights', parentId: 'seoToolsPro', title: '🗑️ Remove Highlights', contexts: ['page'] });

    // --- Context: Selection ---
    chrome.contextMenus.create({ id: 'sel-header', parentId: 'seoToolsPro', title: '📝 SELECTION ACTIONS', enabled: false, contexts: ['selection'] });
    chrome.contextMenus.create({ id: 'sel-compare', parentId: 'seoToolsPro', title: '✨ Advanced Text Compare', contexts: ['selection'] });
    chrome.contextMenus.create({ id: 'sel-urlslug', parentId: 'seoToolsPro', title: '🔗 Generate URL Slug', contexts: ['selection'] });
    chrome.contextMenus.create({ id: 'sel-whatsapp', parentId: 'seoToolsPro', title: '💬 WhatsApp Link', contexts: ['selection'] });
    chrome.contextMenus.create({ id: 'sel-search', parentId: 'seoToolsPro', title: '🔍 Search Google', contexts: ['selection'] });

    // --- Context: Link ---
    chrome.contextMenus.create({ id: 'link-header', parentId: 'seoToolsPro', title: '🔗 LINK ACTIONS', enabled: false, contexts: ['link'] });
    chrome.contextMenus.create({ id: 'link-broken', parentId: 'seoToolsPro', title: '🚨 Check Broken Links', contexts: ['link'] });
    chrome.contextMenus.create({ id: 'link-domain', parentId: 'seoToolsPro', title: '🌐 Extract Domains', contexts: ['link'] });

    // --- Context: Image ---
    chrome.contextMenus.create({ id: 'img-header', parentId: 'seoToolsPro', title: '🖼️ IMAGE ACTIONS', enabled: false, contexts: ['image'] });
    chrome.contextMenus.create({ id: 'img-ocr', parentId: 'seoToolsPro', title: '👁️ Extract Text (OCR)', contexts: ['image'] });
    chrome.contextMenus.create({ id: 'img-analyze', parentId: 'seoToolsPro', title: '📊 Analyze Alt Text', contexts: ['image'] });
    chrome.contextMenus.create({ id: 'img-download', parentId: 'seoToolsPro', title: '⬇️ Bulk Image Downloader', contexts: ['image'] });
    
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
function getToolInfo(actionId, customTemplates = {}) {
  if (actionId.startsWith('custom-') && customTemplates[actionId]) {
    return { name: '📝 ' + customTemplates[actionId].name };
  }
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
  
  const actionMap = {
    'copy-url': 'copy-url',
    'copy-domain': 'copy-domain',
    'full-page-capture': 'full-page-capture',
    'extract-links': 'linkextract',
    'highlight-dofollow': 'highlight-dofollow',
    'remove-highlights': 'remove-highlights',
    'sel-urlslug': 'urlslug',
    'sel-whatsapp': 'whatsapp-link',
    'sel-compare': 'advanced-text-compare',
    'link-broken': 'broken-links',
    'link-domain': 'domainextract',
    'img-ocr': 'image-ocr',
    'img-analyze': 'analyze-images',
    'img-download': 'image-downloader'
  };

  if (menuId === 'sel-search') {
    if (info.selectionText) {
      chrome.tabs.create({ url: `https://www.google.com/search?q=${encodeURIComponent(info.selectionText)}` });
    }
    return;
  }

  if (menuId === 'open-popup') {
    chrome.action.openPopup();
    return;
  }

  if (menuId === 'open-settings') {
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open(chrome.runtime.getURL('options.html'));
    }
    return;
  }

  if (actionMap[menuId]) {
    await executeToolAction(tabId, actionMap[menuId], info);
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
      defaultAmount: '50',
      themePrimary: '#2563EB',
      themeAccent: '#F59E0B'
    });
    
    const templates = await chrome.storage.sync.get({ customTemplates: {} });
    
    const messagePayload = {
      action: action,
      settings: settings,
      templates: templates.customTemplates,
      contextInfo: {
        selectionText: contextInfo.selectionText || '',
        linkUrl: contextInfo.linkUrl || '',
        pageUrl: contextInfo.pageUrl || '',
        srcUrl: contextInfo.srcUrl || ''
      }
    };

    try {
      let response = await chrome.tabs.sendMessage(tabId, messagePayload);
      
      // If content script is active but missing advanced tools
      if (response && response.requireAdvanced) {
         await chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ['tools-advanced.js']
         });
         await new Promise(resolve => setTimeout(resolve, 50));
         await chrome.tabs.sendMessage(tabId, messagePayload);
      }
    } catch (injectionError) {
      console.log('Content script not active. Injecting dynamically...');
      
      const advancedTools = ['advanced-text-compare', 'image-toolkit', 'maps-scraper', 'site-structure', 'keyword-rank-tracker', 'image-ocr'];
      const filesToInject = ['utils.js', 'seo-tools.js'];
      if (advancedTools.includes(action)) {
          filesToInject.push('tools-advanced.js');
      }
      filesToInject.push('content.js');
      
      await chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: filesToInject
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

  // >>> ADD THIS NEW BLOCK FOR OCR <<<
  if (request.action === 'performOCR') {
  const formData = new FormData();
  formData.append('base64Image', request.base64Image);
  formData.append('language', request.language || 'eng'); // <-- Uses payload

    fetch('https://api.ocr.space/parse/image', {
      method: 'POST',
      headers: { 'apikey': 'helloworld' }, // Free API key
      body: formData
    })
      .then(response => response.json())
      .then(data => sendResponse({ success: true, data: data }))
      .catch(error => sendResponse({ success: false, error: error.message }));
      
    return true; // Keep message channel open for async fetch
  }
  // >>> END NEW BLOCK <<<
  
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