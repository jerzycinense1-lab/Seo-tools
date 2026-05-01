/**
 * SEO Tools Pro - Popup Script v4.0 (Complete)
 * 
 * Unified popup logic with favorites system, settings management,
 * template editor, and tool execution routing for ALL 55+ tools.
 */

// ==================== GLOBAL STATE ====================

let appSettings = {};
let customTemplates = {};
let windowState = {
  currentTabId: null,
  currentDomain: '',
  currentUrl: '',
};

// ==================== THEME APPLY ====================
function applyThemeToPopup(primary, accent) {
  let style = document.getElementById('custom-theme-overrides');
  if (!style) {
    style = document.createElement('style');
    style.id = 'custom-theme-overrides';
    document.head.appendChild(style);
  }
  style.textContent = `
    :root {
      ${primary ? `--primary: ${primary} !important; --primary-gradient: linear-gradient(135deg, #1B2A4A 0%, ${primary} 100%) !important;` : ''}
      ${accent ? `--accent: ${accent} !important;` : ''}
    }
    body.dark-mode {
      ${primary ? `--primary: ${primary} !important; --primary-gradient: linear-gradient(135deg, #0F172A 0%, ${primary} 100%) !important;` : ''}
      ${accent ? `--accent: ${accent} !important;` : ''}
    }
  `;
}

// ==================== INITIALIZATION ====================

document.addEventListener('DOMContentLoaded', () => {
  initExtension();
});

async function initExtension() {
  await loadSettings();
  await loadTemplates();
  await updateCurrentSite();
  renderCustomTemplates();
  setupEventListeners();
  setupCollapsibleGroups();
  applyContextAwareSorting();
  setupPinning();
  setupKeyboardShortcuts();
  updateToolCount();
  checkDarkMode();
  
  console.log('🚀 SEO Tools Pro v4.0 - Ready');
  console.log('📦 Tools Available: 55+');
  console.log('🎨 Design System: Unified');
}

// ==================== SETTINGS MANAGEMENT ====================

async function loadSettings() {
  return new Promise((resolve) => {
    chrome.storage.sync.get({
      userName: 'Jonathan Harris',
      userEmail: 'jonathn.p.harris@gmail.com',
      userPhone: '9928524796',
      userLinkedin: 'https://linkedin.com/in/jonathan-harris',
      defaultCurrency: 'USD',
      defaultAmount: '50',
      darkMode: false,
      themePrimary: '#2563EB',
      themeAccent: '#F59E0B',
      favorites: [],
      compactMode: false,
      enableWidget: false,
      recentlyUsed: []
    }, (settings) => {
      appSettings = settings;
      
      // Populate fields
      const fields = {
        userName: settings.userName,
        userEmail: settings.userEmail,
        userPhone: settings.userPhone,
        userLinkedin: settings.userLinkedin,
        defaultCurrency: settings.defaultCurrency,
        defaultAmount: settings.defaultAmount,
        darkMode: settings.darkMode,
        themePrimary: settings.themePrimary,
        themeAccent: settings.themeAccent,
        enableWidget: settings.enableWidget,
      };
      if (settings.compactMode) document.body.classList.add('compact-mode');
      renderRecentlyUsed();
      
      applyThemeToPopup(settings.themePrimary, settings.themeAccent);
      
      Object.entries(fields).forEach(([id, value]) => {
        const el = document.getElementById(id);
        if (el) {
          if (el.type === 'checkbox') el.checked = value;
          else el.value = value;
        }
      });
      
      resolve(settings);
    });
  });
}

async function loadTemplates() {
  return new Promise((resolve) => {
    chrome.storage.sync.get({ customTemplates: {} }, (result) => {
      customTemplates = result.customTemplates || {};
      resolve(customTemplates);
    });
  });
}

// ==================== CURRENT SITE ====================

async function updateCurrentSite() {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (tab?.url) {
        try {
          const url = new URL(tab.url);
          windowState.currentDomain = url.hostname.replace(/^www\./, '');
          windowState.currentUrl = tab.url;
          windowState.currentTabId = tab.id;
          document.getElementById('currentDomain').textContent = windowState.currentDomain;
        } catch (e) {
          document.getElementById('currentDomain').textContent = 'N/A';
        }
      } else {
        document.getElementById('currentDomain').textContent = 'N/A';
      }
      resolve();
    });
  });
}

// ==================== UI / UX ENHANCEMENTS ====================

function setupCollapsibleGroups() {
  const savedState = JSON.parse(localStorage.getItem('gdi-collapsed-groups') || '{}');
  
  document.querySelectorAll('.tool-group').forEach((group) => {
    // Ignore the Pinned tools group and Custom Templates which are auto-managed
    if (group.querySelector('#favorites-grid') || group.id === 'custom-templates-group') return;
    
    const header = group.querySelector('h3');
    if (!header) return;
    
    const groupId = 'group-' + header.textContent.replace(/[^a-z0-9]/gi, '-').toLowerCase();
    
    // Restore collapsed state
    if (savedState[groupId]) {
      group.classList.add('collapsed');
    }
    
    header.addEventListener('click', () => {
      group.classList.toggle('collapsed');
      savedState[groupId] = group.classList.contains('collapsed');
      localStorage.setItem('gdi-collapsed-groups', JSON.stringify(savedState));
    });
  });
}

function applyContextAwareSorting() {
  const url = windowState.currentUrl || '';
  if (!url) return;
  
  const suggestions = [];
  
  // Rule Engine
  if (url.includes('google.com/maps') || url.includes('maps.google.com')) {
    suggestions.push('maps-scraper', 'local-keyword-finder');
  } else if (url.includes('google.com/search')) {
    suggestions.push('bulk-google-domains', 'serp-preview', 'searchoperators');
  } else if (url.match(/linkedin\.com|facebook\.com|twitter\.com|x\.com|instagram\.com|youtube\.com/)) {
    suggestions.push('social-extract', 'social-preview');
  } else if (url.match(/\/blog|\/article|\/news/)) {
    suggestions.push('content-analyzer', 'keyword-density', 'analyze-headings');
  }
  
  // Apply sorting
  suggestions.reverse().forEach(action => {
    const btn = document.querySelector(`.tool-btn[data-action="${action}"]`);
    if (btn) {
      const grid = btn.closest('.tool-grid');
      const group = btn.closest('.tool-group');
      if (grid && group) {
        grid.prepend(btn); // Move to top of grid
        group.parentElement.prepend(group); // Move group to top of tab
        btn.classList.add('suggested'); // Add UI highlight
        group.classList.remove('collapsed'); // Ensure it is expanded so user sees it
      }
    }
  });
}


function showButtonSuccess(btn, successMsg = '✅ Copied!') {
  if (!btn || btn.classList.contains('btn-success')) return;
  const originalText = btn.innerHTML;
  const originalWidth = btn.offsetWidth;
  btn.style.width = originalWidth + 'px';
  btn.classList.add('btn-success');
  btn.innerHTML = successMsg;
  setTimeout(() => {
    btn.classList.remove('btn-success');
    btn.innerHTML = originalText;
    btn.style.width = '';
  }, 1500);
}

function trackRecent(action, name) {
  if (!appSettings.recentlyUsed) appSettings.recentlyUsed = [];
  
  // Safely strip the leading emoji and trailing star
  let cleanName = name.replace('★', '').trim();
  cleanName = cleanName.replace(/^[\u2700-\u27BF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, '').trim();
  if (!cleanName) cleanName = name.trim(); // fallback
  
  const existingIdx = appSettings.recentlyUsed.findIndex(r => r.action === action);
  if (existingIdx > -1) appSettings.recentlyUsed.splice(existingIdx, 1);
  appSettings.recentlyUsed.unshift({ action, name: cleanName });
  if (appSettings.recentlyUsed.length > 5) appSettings.recentlyUsed.pop();
  chrome.storage.sync.set({ recentlyUsed: appSettings.recentlyUsed });
  renderRecentlyUsed();
}

function renderRecentlyUsed() {
  const row = document.getElementById('recentlyUsedRow');
  if (!row) return;
  if (!appSettings.recentlyUsed || appSettings.recentlyUsed.length === 0) {
    row.style.display = 'none';
    return;
  }
  row.style.display = 'flex';
  row.innerHTML = '<span style="font-size:10px;color:var(--text-muted);display:flex;align-items:center;margin-right:4px;">⏱️ RECENT:</span>';
  appSettings.recentlyUsed.forEach(item => {
    const btn = document.createElement('button');
    btn.className = 'ru-btn';
    btn.textContent = item.name;
    btn.addEventListener('click', () => {
      const targetBtn = document.querySelector(`.tool-btn[data-action="${item.action}"], .tool-btn[data-url="${item.action}"]`);
      if (targetBtn) targetBtn.click();
    });
    row.appendChild(btn);
  });
}

// ==================== EVENT LISTENERS ====================

function setupEventListeners() {
  // Tabs
  document.querySelectorAll('.tab-btn[data-tab]').forEach(btn => {
    btn.addEventListener('click', handleTabSwitch);
  });

  // Tool buttons
  document.querySelectorAll('.tool-btn[data-action]').forEach(btn => {
    btn.addEventListener('click', handleToolClick);
  });

  // External links
  document.querySelectorAll('.tool-btn.external').forEach(btn => {
    btn.addEventListener('click', handleExternalLink);
  });

  // Search
  document.getElementById('searchInput').addEventListener('input', handleSearch);
  
  // Command Palette Keyboard Navigation
  let currentSearchIndex = -1;
  const searchInput = document.getElementById('searchInput');
  
  searchInput.addEventListener('keydown', (e) => {
    const isSearching = searchInput.value.trim() !== '';
    const visibleTools = Array.from(document.querySelectorAll('.tool-btn:not(.hidden)'));
    
    const activeTools = isSearching ? visibleTools : visibleTools.filter(btn => {
        const tab = btn.closest('.tab-content');
        return tab && tab.style.display !== 'none' && tab.classList.contains('active');
    });

    if (activeTools.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      currentSearchIndex = (currentSearchIndex + 1) % activeTools.length;
      updateSearchFocus(activeTools);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      currentSearchIndex = (currentSearchIndex - 1 + activeTools.length) % activeTools.length;
      updateSearchFocus(activeTools);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (currentSearchIndex >= 0 && activeTools[currentSearchIndex]) {
        activeTools[currentSearchIndex].click();
      } else if (activeTools.length > 0) {
        // Fallback: If nothing specifically highlighted, execute the first one
        activeTools[0].click();
      }
    }
  });

  function updateSearchFocus(tools) {
    document.querySelectorAll('.tool-btn.keyboard-focus').forEach(b => b.classList.remove('keyboard-focus'));
    if (currentSearchIndex >= 0 && tools[currentSearchIndex]) {
      const btn = tools[currentSearchIndex];
      btn.classList.add('keyboard-focus');
      btn.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
      e.preventDefault();
      document.getElementById('searchInput').focus();
    }
    if (e.key === 'Escape') {
      const si = document.getElementById('searchInput');
      if (document.activeElement === si) {
        si.value = '';
        si.dispatchEvent(new Event('input'));
        si.blur();
      }
    }
  });

  // Copy domain
  document.getElementById('copyDomainBtn').addEventListener('click', () => {
    const domain = document.getElementById('currentDomain').textContent;
    if (domain && domain !== 'N/A') {
      navigator.clipboard.writeText(domain)
        .then(() => { showNotification('✅ Domain copied!', 'success'); showButtonSuccess(document.getElementById('copyDomainBtn')); })
        .catch(() => showNotification('Failed to copy', 'error'));
    }
  });

  // View Toggle
  document.getElementById('viewToggleBtn')?.addEventListener('click', () => {
    document.body.classList.toggle('compact-mode');
    appSettings.compactMode = document.body.classList.contains('compact-mode');
    chrome.storage.sync.set({ compactMode: appSettings.compactMode });
  });

  // Settings
  document.getElementById('settingsBtn').addEventListener('click', openSettings);
  document.querySelector('#settingsModal .modal-close')?.addEventListener('click', closeSettings);
  document.getElementById('saveSettings').addEventListener('click', handleSaveSettings);
  
  // Auto-save toggle for Mini-Widget
  document.getElementById('enableWidget')?.addEventListener('change', async (e) => {
    appSettings.enableWidget = e.target.checked;
    await chrome.storage.sync.set({ enableWidget: appSettings.enableWidget });
    
    // Inject widget.js into current active tab if not already present (handles tabs opened before extension update)
    if (appSettings.enableWidget && windowState.currentTabId) {
      chrome.scripting.executeScript({
        target: { tabId: windowState.currentTabId },
        files: ['widget.js']
      }).catch(err => console.log('Widget injection skipped:', err));
    }
  });
  document.getElementById('resetSettings').addEventListener('click', resetSettings);

  // Open Options Page
  document.getElementById('templatesBtn').addEventListener('click', () => {
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open(chrome.runtime.getURL('options.html'));
    }
  });

  // Utility buttons
  document.getElementById('clearCache').addEventListener('click', clearCache);
  document.getElementById('exportSettings').addEventListener('click', exportSettings);
  document.getElementById('importSettings').addEventListener('click', importSettings);

  // Notification
  document.querySelector('.notification-close')?.addEventListener('click', hideNotification);

  // Modal overlay clicks
  ['settingsModal', 'templateManagerModal', 'previewModal'].forEach(id => {
    document.getElementById(id)?.addEventListener('click', (e) => {
      if (e.target.id === id) {
        if (id === 'settingsModal') closeSettings();
        else if (id === 'templateManagerModal') closeTemplateManager();
        else if (id === 'previewModal') closePreview();
      }
    });
  });

  // Variable tags
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('var-tag')) {
      insertVariableAtCursor(e.target.textContent);
    }
  });

  // Bulk URL modal
  document.getElementById('executeBulkUrls')?.addEventListener('click', processBulkUrls);
  document.getElementById('closeBulkUrl')?.addEventListener('click', closeBulkUrlModal);
  document.querySelector('#bulkUrlModal .modal-close')?.addEventListener('click', closeBulkUrlModal);

  // Listen for settings open from context menu
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'openSettings') {
      openSettings();
      sendResponse({ success: true });
    }
    return true;
  });
}

// ==================== KEYBOARD SHORTCUTS ====================

function setupKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 't') {
      e.preventDefault();
      document.getElementById('templatesBtn').click();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      openSettings();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
      e.preventDefault();
      toggleDarkMode();
    }
  });
}

// ==================== TAB SWITCHING ====================

function handleTabSwitch(e) {
  const tabId = e.target.dataset.tab;
  
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
  
  e.target.classList.add('active');
  document.getElementById(tabId).classList.add('active');
  
  document.getElementById('searchInput').value = '';
  document.querySelectorAll('.tool-btn').forEach(btn => btn.classList.remove('hidden'));
  
  if (tabId === 'favorites') renderFavorites();
}

// ==================== SEARCH ====================

function handleSearch(e) {
  const searchTerm = e.target.value.toLowerCase().trim();
  const isSearching = searchTerm !== '';

  // 1. Handle Tab Visibility
  document.querySelectorAll('.tab-content').forEach(tab => {
    if (isSearching) {
      // Show all tabs during a search (except favorites to prevent duplicates)
      if (tab.id !== 'favorites') {
        tab.style.display = 'block';
      } else {
        tab.style.display = 'none';
      }
    } else {
      // Clear inline styles when not searching so CSS takes over again
      tab.style.display = '';
    }
  });

  // 2. Filter Tools
  const toolGroups = document.querySelectorAll('.tool-group');
  
  toolGroups.forEach(group => {
    // Skip the favorites grid
    if (group.querySelector('#favorites-grid')) return;
    
    // Get the category title for broader matching
    const categoryTitle = group.querySelector('h3')?.textContent.toLowerCase() || '';
    const tools = group.querySelectorAll('.tool-btn');
    let visibleCount = 0;
    
    tools.forEach(tool => {
      const toolName = tool.textContent.toLowerCase();
      const actionId = tool.dataset.action || tool.dataset.url || '';
      
      // Smart Match: Check the button text, the hidden action ID, AND the category title
      if (
        toolName.includes(searchTerm) || 
        actionId.toLowerCase().includes(searchTerm) ||
        (categoryTitle.includes(searchTerm) && isSearching)
      ) {
        tool.classList.remove('hidden');
        visibleCount++;
      } else {
        tool.classList.add('hidden');
      }
    });
    
    // Hide the whole group header if no tools match inside it
    if (isSearching) {
      group.style.display = visibleCount === 0 ? 'none' : 'block';
      group.classList.remove('collapsed'); // Auto-expand when searching
    } else {
      group.style.display = ''; // Reset when search is cleared
      // Restore collapse state
      const header = group.querySelector('h3');
      if (header) {
        const savedState = JSON.parse(localStorage.getItem('gdi-collapsed-groups') || '{}');
        const groupId = 'group-' + header.textContent.replace(/[^a-z0-9]/gi, '-').toLowerCase();
        if (savedState[groupId]) group.classList.add('collapsed');
      }
    }
  });

  // Reset command palette focus
  if (typeof currentSearchIndex !== 'undefined') currentSearchIndex = -1;
  document.querySelectorAll('.tool-btn.keyboard-focus').forEach(b => b.classList.remove('keyboard-focus'));

  // 3. Restore Active Tab State if search is cleared
  if (!isSearching) {
    const activeTabBtn = document.querySelector('.tab-btn.active');
    if (activeTabBtn) {
      const tabId = activeTabBtn.dataset.tab;
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      document.getElementById(tabId).classList.add('active');
    }
  }
}

// ==================== TOOL EXECUTION ====================

async function handleToolClick(e) {
  const btn = e.currentTarget;
  const action = btn.dataset.action;
  
  if (!action) return;
  
  // Handle popup-only tools
  if (action === 'bulk-url') {
    openBulkUrlModal();
    return;
  }
  
  trackRecent(action, btn.textContent);
  btn.classList.add('loading');
  
  try {
    if (!windowState.currentTabId) await updateCurrentSite();
    
    const response = await sendMessageToContent({
      action: action,
      settings: appSettings,
      templates: customTemplates
    });
    
    if (response?.success) {
      showNotification(response.message || '✅ Tool executed!', 'success');
      showButtonSuccess(btn, '✅ Done!');
    } else {
      executeToolDirect(action);
    }
  } catch (error) {
    console.error('Tool execution error:', error);
    executeToolDirect(action);
  } finally {
    btn.classList.remove('loading');
  }
}

function handleExternalLink(e) {
  const url = e.currentTarget.dataset.url;
  if (url) {
    chrome.tabs.create({ url });
    showNotification('Opening external link...', 'success');
  }
}

function sendMessageToContent(message) {
  return new Promise((resolve) => {
    if (!windowState.currentTabId) {
      resolve({ success: false });
      return;
    }
    
    chrome.tabs.sendMessage(windowState.currentTabId, message, (response) => {
      if (chrome.runtime.lastError || (response && response.requireAdvanced)) {
        const filesToInject = [];
        
        if (chrome.runtime.lastError) {
            filesToInject.push('utils.js', 'seo-tools.js', 'content.js');
        }
        
        const advancedTools = ['advanced-text-compare', 'image-toolkit', 'maps-scraper', 'site-structure', 'keyword-rank-tracker', 'image-ocr'];
        if (advancedTools.includes(message.action) || (response && response.requireAdvanced)) {
            if (!filesToInject.includes('tools-advanced.js')) {
                filesToInject.push('tools-advanced.js');
            }
        }
        
        chrome.scripting.executeScript({
          target: { tabId: windowState.currentTabId },
          files: filesToInject
        }, () => {
          setTimeout(() => {
            chrome.tabs.sendMessage(windowState.currentTabId, message, resolve);
          }, 150);
        });
      } else {
        resolve(response);
      }
    });
  });
}

function executeToolDirect(action) {
  const domain = windowState.currentDomain || '';
  const url = windowState.currentUrl || '';
  const encodedDomain = encodeURIComponent(domain);
  const encodedUrl = encodeURIComponent(url);

  const toolUrls = {
    'wayback': `https://web.archive.org/web/*/${url}`,
    'whois': `https://www.whois.com/whois/${encodedDomain}`,
    'pingdom': `https://tools.pingdom.com/?url=${encodedUrl}`,
    'pagespeed': `https://developers.google.com/speed/pagespeed/insights/?url=${encodedUrl}`,
    'mobile-friendly': `https://search.google.com/test/mobile-friendly?url=${encodedUrl}`,
    'schema': `https://validator.schema.org/#url=${encodedUrl}`,
    'richresults': `https://search.google.com/test/rich-results?url=${encodedUrl}`,
    'amp': `https://search.google.com/test/amp?url=${encodedUrl}`,
    'authority': `https://www.semrush.com/free-tools/website-authority-checker/?url=${encodedDomain}`,
    'spamscore': `https://websiteseochecker.com/spam-score-checker/?url=${encodedDomain}`,
    'domainrating': `https://ahrefs.com/website-authority-checker/?input=${encodedDomain}`,
    'traffic': `https://ahrefs.com/traffic-checker/?input=${encodedDomain}&mode=subdomains`,
    'advsearch': 'https://www.google.com/advanced_search',
  };

  if (toolUrls[action]) {
    if (action === 'metrics') {
      ['authority', 'spamscore', 'domainrating', 'traffic'].forEach(tool => {
        if (toolUrls[tool]) chrome.tabs.create({ url: toolUrls[tool], active: false });
      });
      showNotification('Opening all metrics tools...', 'success');
    } else if (toolUrls[action]) {
      chrome.tabs.create({ url: toolUrls[action] });
      showNotification('Opening tool...', 'success');
    }
  } else {
    sendMessageToContent({ action, settings: appSettings, templates: customTemplates })
      .then(response => {
        if (response?.success) {
          showNotification(response.message || '✅ Tool executed!', 'success');
          showButtonSuccess(btn, '✅ Done!');
        } else {
          showNotification('⚠️ Please refresh the page and try again', 'warning');
        }
      });
  }
}

// ==================== BULK URL OPENER ====================

function openBulkUrlModal() {
  document.getElementById('bulkUrlModal').classList.add('show');
  setTimeout(() => document.getElementById('bulkUrlInput')?.focus(), 100);
}

function closeBulkUrlModal() {
  document.getElementById('bulkUrlModal').classList.remove('show');
  if (bulkUrlInterval) {
    clearInterval(bulkUrlInterval);
    bulkUrlInterval = null;
    bulkUrlQueue = [];
    const btn = document.getElementById('executeBulkUrls');
    if (btn) {
      btn.textContent = '🚀 Open All URLs';
      btn.style.background = '';
    }
  }
}

let bulkUrlQueue = [];
let bulkUrlInterval = null;

function processBulkUrls() {
  const input = document.getElementById('bulkUrlInput');
  const text = input?.value?.trim();
  
  if (!text && bulkUrlQueue.length === 0) {
    showNotification('❌ Please enter at least one URL', 'error');
    return;
  }
  
  const urls = text.split('\n')
    .map(u => u.trim())
    .filter(u => u.length > 0)
    .map(u => /^https?:\/\//i.test(u) ? u : 'https://' + u);
  
  const btn = document.getElementById('executeBulkUrls');
  
  if (bulkUrlInterval) {
    clearInterval(bulkUrlInterval);
    bulkUrlInterval = null;
    btn.textContent = '▶️ Resume Opening';
    btn.style.background = 'var(--warning)';
    showNotification('⏸️ Paused opening URLs', 'warning');
    return;
  }
  
  if (bulkUrlQueue.length === 0) {
    bulkUrlQueue = urls;
    if (urls.length > 10) {
      if (!confirm(`You're about to open ${urls.length} tabs. We will open them safely (1 tab per second) to prevent crashing your browser. Continue?`)) {
        bulkUrlQueue = [];
        return;
      }
    }
  }

  if (bulkUrlQueue.length === 0) return;

  btn.textContent = `⏹ Stop (${bulkUrlQueue.length} left)`;
  btn.style.background = 'var(--error)';
  
  bulkUrlInterval = setInterval(() => {
    if (bulkUrlQueue.length === 0) {
      clearInterval(bulkUrlInterval);
      bulkUrlInterval = null;
      btn.textContent = '🚀 Open All URLs';
      btn.style.background = '';
      showNotification('✅ All URLs opened!', 'success');
      closeBulkUrlModal();
      return;
    }
    const url = bulkUrlQueue.shift();
    chrome.tabs.create({ url, active: false });
    btn.textContent = `⏹ Stop (${bulkUrlQueue.length} left)`;
  }, 1000);
  
  showNotification('🚀 Opening URLs safely...', 'success');
}

// ==================== SETTINGS ====================

function openSettings() {
  document.getElementById('settingsModal').classList.add('show');
}

function closeSettings() {
  document.getElementById('settingsModal').classList.remove('show');
}

async function handleSaveSettings() {
  const settings = {
    userName: document.getElementById('userName')?.value?.trim() || '',
    userEmail: document.getElementById('userEmail')?.value?.trim() || '',
    userPhone: document.getElementById('userPhone')?.value?.trim() || '',
    userLinkedin: document.getElementById('userLinkedin')?.value?.trim() || '',
    defaultCurrency: document.getElementById('defaultCurrency')?.value || 'USD',
    defaultAmount: document.getElementById('defaultAmount')?.value || '50',
    darkMode: document.getElementById('darkMode')?.checked || false,
    themePrimary: document.getElementById('themePrimary')?.value || '#2563EB',
    themeAccent: document.getElementById('themeAccent')?.value || '#F59E0B',
    favorites: appSettings.favorites || [],
    compactMode: document.body.classList.contains('compact-mode'),
    enableWidget: document.getElementById('enableWidget')?.checked || false
  };
  
  return new Promise((resolve) => {
    chrome.storage.sync.set(settings, () => {
      appSettings = { ...appSettings, ...settings };
      showNotification('✅ Settings saved!', 'success');
      closeSettings();
      checkDarkMode();
      applyThemeToPopup(settings.themePrimary, settings.themeAccent);
      resolve();
    });
  });
}

function resetSettings() {
  if (confirm('Reset all settings to defaults?')) {
    chrome.storage.sync.clear(() => {
      loadSettings().then(() => showNotification('✅ Settings reset!', 'success'));
    });
  }
}

// ==================== DARK MODE ====================

function toggleDarkMode() {
  appSettings.darkMode = !appSettings.darkMode;
  chrome.storage.sync.set({ darkMode: appSettings.darkMode });
  checkDarkMode();
  showNotification(
    appSettings.darkMode ? '🌙 Dark mode enabled' : '☀️ Light mode enabled',
    'success'
  );
}

function checkDarkMode() {
  if (appSettings.darkMode) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
}

// ==================== CACHE ====================

function clearCache() {
  if (confirm('Clear all cached tool data? Settings will not be affected.')) {
    chrome.storage.local.clear(() => showNotification('✅ Cache cleared!', 'success'));
  }
}

// ==================== IMPORT/EXPORT ====================

function exportSettings() {
  chrome.storage.sync.get(null, (syncData) => {
    chrome.storage.local.get(null, (localData) => {
      const backup = {
        version: '4.0.0',
        sync: syncData,
        local: localData,
        exportedAt: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `seo-tools-pro-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
      showNotification('✅ Complete backup exported!', 'success');
    });
  });
}

function importSettings() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  
  input.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const backup = JSON.parse(event.target.result);
        
        if (backup.sync && backup.local) {
          chrome.storage.sync.set(backup.sync, () => {
            chrome.storage.local.set(backup.local, () => {
              loadSettings().then(() => {
                loadTemplates().then(() => {
                  renderTemplateList();
                  renderFavorites();
                  checkDarkMode();
                  showNotification('✅ Settings imported!', 'success');
                });
              });
            });
          });
        } else {
          chrome.storage.sync.set(backup, () => {
            loadSettings().then(() => {
              showNotification('✅ Legacy settings imported!', 'success');
              checkDarkMode();
            });
          });
        }
      } catch (error) {
        showNotification('❌ Invalid backup file', 'error');
      }
    };
    reader.readAsText(file);
  });
  
  input.click();
}

// ==================== CUSTOM TEMPLATES RENDER ====================
function renderCustomTemplates() {
  const group = document.getElementById('custom-templates-group');
  const grid = document.getElementById('custom-templates-grid');
  
  if (!group || !grid) return;
  
  const templates = Object.values(customTemplates);
  if (templates.length === 0) {
    group.style.display = 'none';
    return;
  }
  
  group.style.display = 'block';
  grid.innerHTML = '';
  
  templates.forEach(t => {
    const btn = document.createElement('button');
    btn.className = 'tool-btn';
    btn.dataset.action = t.id;
    btn.textContent = `📝 ${t.name}`;
    btn.title = t.description || 'Custom Template';
    grid.appendChild(btn);
  });
}

// ==================== FAVORITES / PINNING ====================

function setupPinning() {
  const allTools = document.querySelectorAll('.tool-btn[data-action], .tool-btn.external');
  
  allTools.forEach(btn => {
    if (btn.querySelector('.pin-btn')) return;
    
    const actionId = btn.dataset.action || btn.dataset.url;
    const isPinned = appSettings.favorites?.includes(actionId);
    
    const pinBtn = document.createElement('button');
    pinBtn.className = `pin-btn ${isPinned ? 'pinned' : ''}`;
    pinBtn.innerHTML = '★';
    pinBtn.title = isPinned ? 'Unpin from Favorites' : 'Pin to Favorites';
    
    pinBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      
      if (!appSettings.favorites) appSettings.favorites = [];
      
      const index = appSettings.favorites.indexOf(actionId);
      if (index > -1) {
        appSettings.favorites.splice(index, 1);
        pinBtn.classList.remove('pinned');
        pinBtn.title = 'Pin to Favorites';
      } else {
        appSettings.favorites.push(actionId);
        pinBtn.classList.add('pinned');
        pinBtn.title = 'Unpin from Favorites';
      }
      
      chrome.storage.sync.set({ favorites: appSettings.favorites }, () => {
        renderFavorites();
        chrome.runtime.sendMessage({ action: 'refreshContextMenu' }).catch(() => {});
      });
    });
    
    btn.appendChild(pinBtn);
  });
  
  renderFavorites();
}

function renderFavorites() {
  const grid = document.getElementById('favorites-grid');
  if (!grid) return;
  
  grid.innerHTML = '';
  
  if (!appSettings.favorites || appSettings.favorites.length === 0) return;
  
  appSettings.favorites.forEach(actionId => {
    const originalBtn = document.querySelector(`.tool-btn[data-action="${actionId}"], .tool-btn[data-url="${actionId}"]`);
    
    if (originalBtn) {
      const clonedBtn = originalBtn.cloneNode(true);
      
      if (clonedBtn.dataset.action) {
        clonedBtn.addEventListener('click', handleToolClick);
      } else if (clonedBtn.dataset.url) {
        clonedBtn.addEventListener('click', handleExternalLink);
      }
      
      const clonePinBtn = clonedBtn.querySelector('.pin-btn');
      if (clonePinBtn) {
        clonePinBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const originalPinBtn = originalBtn.querySelector('.pin-btn');
          if (originalPinBtn) originalPinBtn.click();
        });
      }
      
      grid.appendChild(clonedBtn);
    }
  });
}

// ==================== NOTIFICATIONS ====================

function showNotification(message, type = 'success') {
  const notification = document.getElementById('notification');
  const messageEl = notification.querySelector('.notification-message');
  
  messageEl.textContent = message;
  notification.className = 'notification show';
  
  if (type === 'error') notification.classList.add('error');
  if (type === 'warning') notification.classList.add('warning');
  
  clearTimeout(notification._timeout);
  notification._timeout = setTimeout(() => hideNotification(), 3500);
}

function hideNotification() {
  document.getElementById('notification').classList.remove('show');
}

// ==================== TOOL COUNT ====================

function updateToolCount() {
  const totalTools = document.querySelectorAll('.tool-btn[data-action], .tool-btn.external').length;
  document.getElementById('toolCount').textContent = `${totalTools} tools`;
}

// ==================== READY ====================

console.log('✅ SEO Tools Pro v4.0 - Popup Initialized');
console.log('🛠️ Favorites:', appSettings.favorites?.length || 0, 'pinned');
console.log('📧 Templates:', Object.keys(customTemplates).length, 'custom');