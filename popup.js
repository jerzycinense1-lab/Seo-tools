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

// ==================== DEFAULT TEMPLATES ====================

const DEFAULT_TEMPLATES = {
  'advance-payment': {
    id: 'advance-payment',
    name: 'Advance Payment Request (PayPal)',
    category: 'payment',
    description: 'Request advance payment via PayPal',
    content: `Hi,\n\nThis is an Advance PayPal payment request for {{account}} account. Here are the details:\n\nPayPal Account Name: {{paypalName}}\nPayPal Details/Invoice: {{paypalDetails}}\nAmount: {{amount}}\nCurrency: {{currency}}\nArticle Title: {{articleTitle}}\nWebsite: {{website}}\n\nPlease let me know if you have any questions. Thank you.\n\nRegards,\n{{yourName}}`
  },
  'payment-paypal': {
    id: 'payment-paypal',
    name: 'Payment Request (PayPal)',
    category: 'payment',
    description: 'Request payment via PayPal after publication',
    content: `Hi,\n\nThis is a PayPal payment request for the {{clientAccount}} account.\n\nPayPal Account Name: {{paypalAccountName}}\nPayPal Invoice: {{paypalInvoice}}\nAmount: {{amount}}\nCurrency: {{currency}}\nArticle Title: {{articleTitle}}\nWebsite: {{website}}\nPublished Link: {{publishedLink}}\n\nPlease let me know if you have any questions. Thank you.\n\nRegards,\n{{yourName}}`
  },
  'payment-gcash': {
    id: 'payment-gcash',
    name: 'Payment Request (GCash)',
    category: 'payment',
    description: 'Request payment via GCash',
    content: `Hi,\n\nThis is a GCash payment request for the {{clientAccount}}.\n\nGCash Account Name: {{gcashName}}\nGCash Account Number: {{gcashNumber}}\nAmount: {{amount}}\nCurrency: Php\nArticle Title: {{articleTitle}}\nWebsite: {{website}}\nPublished Link: {{publishedLink}}\n\nPlease let me know if you have any questions. Thank you.\n\nRegards,\n{{yourName}}`
  },
  'send-article': {
    id: 'send-article',
    name: 'Sending Article (Detailed)',
    category: 'article',
    description: 'Send article with full guidelines',
    content: `Hi {{webmaster}},\n\nI hope this email finds you well. The article is now ready for publication on {{website}}. Payment of {{amount}} will be processed upon publication.\n\nGuidelines:\n• Do-follow link only\n• No sponsored tags\n• No external links (or mark as no-follow)\n• URL slug: {{articleTitle}}\n• Article active for 12+ months\n• Publish as-is\n• TAT: 24-48hrs\n\nPayPal is preferred for payment. Please send invoice with live URL after publication.\n\nBest regards,\n{{yourName}}`
  },
  'send-quick-article': {
    id: 'send-quick-article',
    name: 'Quick Article',
    category: 'article',
    description: 'Quick article submission',
    content: `Hi {{webmasterName}},\n\nAttached is another article for publication on {{website}}, under the same terms as before.\n\nPlease let me know if you have any questions.\n\nBest regards,\n{{yourName}}`
  },
  'article-followup': {
    id: 'article-followup',
    name: 'Article Follow-up (1st)',
    category: 'article',
    description: 'First follow-up',
    content: `Hi,\n\nJust checking in to see if you've had a chance to review the article for {{website}}. Please let me know if everything looks good.\n\nLooking forward to your feedback.`
  },
  'second-followup': {
    id: 'second-followup',
    name: '2nd Follow-up',
    category: 'article',
    description: 'Second follow-up',
    content: `Hi,\n\nI wanted to follow up on my previous email regarding the article for {{website}}. I understand you're busy.\n\nPlease let me know if you need any additional information.\n\nThank you for your time.`
  },
  'final-notice': {
    id: 'final-notice',
    name: 'Final Notice',
    category: 'article',
    description: 'Final notice before cancellation',
    content: `Hi,\n\nThis is my final follow-up regarding the article for {{website}}. I'm giving you a 12-hour window to respond before I consider this opportunity closed.\n\nPlease let me know your decision ASAP.`
  },
  'cancel': {
    id: 'cancel',
    name: 'Cancellation Notice',
    category: 'article',
    description: 'Cancel article submission',
    content: `Hi,\n\nI am writing to inform you that I am canceling my submission for {{website}} {{reason}}.\n\nDespite my previous attempts to follow up, I have not received any feedback. I have decided to withdraw my submission.\n\nThank you for your time.\n\nBest regards,`
  },
  'declined': {
    id: 'declined',
    name: 'Declined Response',
    category: 'outreach',
    description: 'Response when declined',
    content: `Hi,\n\nThank you for getting back to me. I really appreciate you taking the time.\n\nI completely understand. Do you happen to know of any other websites open to guest contributions?\n\nAny leads would be greatly appreciated. Thanks again!`
  },
  'email-outreach': {
    id: 'email-outreach',
    name: 'Email Outreach',
    category: 'outreach',
    description: 'Initial outreach email',
    content: `Hi {{webmaster}} team,\n\nI hope you're doing well! I'm reaching out to ask if you currently accept guest contributions on your website.\n\nIf so, I'd be happy to share topic ideas for your audience. Could you share your guidelines?\n\nLooking forward to your response!`
  },
  'nego': {
    id: 'nego',
    name: 'Negotiation Template',
    category: 'outreach',
    description: 'Price negotiation ($50 offer)',
    content: `Hi,\n\nThank you for your response.\n\nUnfortunately, I cannot afford your guest posting fee. I only have $50 available per article. I'm hoping you could consider it.\n\nLooking forward to your kind response. Thank you!`
  },
  'send-invoice': {
    id: 'send-invoice',
    name: 'Send Invoice',
    category: 'payment',
    description: 'Invoice confirmation email',
    content: `Hi {{webmaster}},\n\nI'm pleased to confirm that the payment has been successfully processed. Please see the attached invoice.\n\nLooking forward to more collaborations!\n\nBest regards,\n{{yourName}}`
  }
};

// ==================== INITIALIZATION ====================

document.addEventListener('DOMContentLoaded', () => {
  initExtension();
});

async function initExtension() {
  await loadSettings();
  await loadTemplates();
  await updateCurrentSite();
  setupEventListeners();
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
      favorites: []
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
        darkMode: settings.darkMode
      };
      
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
        .then(() => showNotification('✅ Domain copied!', 'success'))
        .catch(() => showNotification('Failed to copy', 'error'));
    }
  });

  // Settings
  document.getElementById('settingsBtn').addEventListener('click', openSettings);
  document.querySelector('#settingsModal .modal-close')?.addEventListener('click', closeSettings);
  document.getElementById('saveSettings').addEventListener('click', handleSaveSettings);
  document.getElementById('resetSettings').addEventListener('click', resetSettings);

  // Template Manager
  document.getElementById('templatesBtn').addEventListener('click', openTemplateManager);
  document.querySelector('#templateManagerModal .modal-close')?.addEventListener('click', closeTemplateManager);
  document.getElementById('closeTemplateManager')?.addEventListener('click', closeTemplateManager);
  document.getElementById('addNewTemplate')?.addEventListener('click', addNewTemplate);
  document.getElementById('saveTemplate')?.addEventListener('click', saveCurrentTemplate);
  document.getElementById('resetTemplate')?.addEventListener('click', resetCurrentTemplate);
  document.getElementById('previewTemplate')?.addEventListener('click', previewCurrentTemplate);
  document.getElementById('exportTemplates')?.addEventListener('click', exportAllTemplates);
  document.getElementById('importTemplates')?.addEventListener('click', importTemplates);
  document.getElementById('templateSearch')?.addEventListener('input', filterTemplateList);

  // Preview modal
  document.querySelector('#previewModal .modal-close')?.addEventListener('click', closePreview);
  document.getElementById('closePreview')?.addEventListener('click', closePreview);
  document.getElementById('copyPreview')?.addEventListener('click', copyPreview);

  // Utility buttons
  document.getElementById('toggleDarkMode').addEventListener('click', toggleDarkMode);
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
      openTemplateManager();
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
    } else {
      group.style.display = ''; // Reset when search is cleared
    }
  });

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
      if (chrome.runtime.lastError) {
        chrome.scripting.executeScript({
          target: { tabId: windowState.currentTabId },
          files: ['utils.js', 'seo-tools.js', 'content.js']
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
}

function processBulkUrls() {
  const input = document.getElementById('bulkUrlInput');
  const text = input?.value?.trim();
  
  if (!text) {
    showNotification('❌ Please enter at least one URL', 'error');
    return;
  }
  
  const urls = text.split('\n')
    .map(u => u.trim())
    .filter(u => u.length > 0)
    .map(u => /^https?:\/\//i.test(u) ? u : 'https://' + u);
  
  if (urls.length > 15) {
    if (!confirm(`You're about to open ${urls.length} tabs. Continue?`)) return;
  }
  
  urls.forEach((url, i) => {
    setTimeout(() => chrome.tabs.create({ url, active: false }), i * 200);
  });
  
  closeBulkUrlModal();
  showNotification(`✅ Opening ${urls.length} URLs...`, 'success');
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
    favorites: appSettings.favorites || []
  };
  
  return new Promise((resolve) => {
    chrome.storage.sync.set(settings, () => {
      appSettings = { ...appSettings, ...settings };
      showNotification('✅ Settings saved!', 'success');
      closeSettings();
      checkDarkMode();
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

// ==================== TEMPLATE MANAGER ====================

let currentEditingTemplate = null;

function getTemplate(templateId) {
  if (customTemplates[templateId]) return { ...customTemplates[templateId], isCustom: true };
  if (DEFAULT_TEMPLATES[templateId]) return { ...DEFAULT_TEMPLATES[templateId], isCustom: false };
  return null;
}

function openTemplateManager() {
  renderTemplateList();
  document.getElementById('templateManagerModal').classList.add('show');
}

function closeTemplateManager() {
  document.getElementById('templateManagerModal').classList.remove('show');
  currentEditingTemplate = null;
}

function renderTemplateList() {
  const list = document.getElementById('templateList');
  const searchQuery = document.getElementById('templateSearch')?.value?.toLowerCase() || '';
  
  const allTemplates = [
    ...Object.values(DEFAULT_TEMPLATES).map(t => ({ ...t, isCustom: false })),
    ...Object.values(customTemplates).map(t => ({ ...t, isCustom: true }))
  ];
  
  const filtered = allTemplates.filter(t =>
    t.name.toLowerCase().includes(searchQuery) ||
    t.description.toLowerCase().includes(searchQuery) ||
    t.category.toLowerCase().includes(searchQuery)
  );
  
  if (filtered.length === 0) {
    list.innerHTML = `<div style="text-align:center;padding:30px;color:var(--text-muted);"><div style="font-size:40px;">📭</div><p>No templates found</p></div>`;
    return;
  }
  
  list.innerHTML = filtered.map(template => {
    const deleteBtn = template.isCustom ? `<button class="template-delete" data-id="${template.id}">×</button>` : '';
    const activeClass = currentEditingTemplate === template.id ? ' active' : '';
    const customClass = template.isCustom ? ' template-item-custom' : '';
    
    return `<div class="template-item${activeClass}${customClass}" data-id="${template.id}">
      <div class="template-item-name">${escapeHtml(template.name)}</div>
      <div class="template-item-category">${escapeHtml(template.category)} ${template.isCustom ? '• Custom' : '• Default'}</div>
      ${deleteBtn}
    </div>`;
  }).join('');
  
  list.querySelectorAll('.template-item').forEach(item => {
    item.addEventListener('click', (e) => {
      if (!e.target.classList.contains('template-delete')) loadTemplateForEdit(item.dataset.id);
    });
  });
  
  list.querySelectorAll('.template-delete').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteTemplate(btn.dataset.id);
    });
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text || '';
  return div.innerHTML;
}

function filterTemplateList() { renderTemplateList(); }

function loadTemplateForEdit(templateId) {
  const template = getTemplate(templateId);
  if (!template) return;
  
  currentEditingTemplate = templateId;
  
  document.getElementById('editorTitle').textContent = template.isCustom ? 'Edit Custom Template' : 'View Default Template';
  document.getElementById('templateName').value = template.name;
  document.getElementById('templateCategory').value = template.category;
  document.getElementById('templateDescription').value = template.description || '';
  document.getElementById('templateContent').value = template.content;
  
  const isCustom = template.isCustom;
  ['templateName', 'templateCategory', 'templateDescription', 'templateContent'].forEach(id => {
    document.getElementById(id).disabled = !isCustom;
  });
  
  document.getElementById('saveTemplate').style.display = isCustom ? '' : 'none';
  document.getElementById('resetTemplate').style.display = isCustom ? '' : 'none';
  
  renderTemplateList();
}

function addNewTemplate() {
  const newId = 'custom-' + Date.now();
  customTemplates[newId] = {
    id: newId,
    name: 'New Custom Template',
    category: 'custom',
    description: 'My custom email template',
    content: 'Hi {{webmaster}},\n\nI hope this email finds you well.\n\n[Your message here]\n\nBest regards,\n{{yourName}}'
  };
  
  chrome.storage.sync.set({ customTemplates }, () => {
    renderTemplateList();
    loadTemplateForEdit(newId);
    showNotification('✅ New template created!', 'success');
  });
}

function saveCurrentTemplate() {
  if (!currentEditingTemplate || !customTemplates[currentEditingTemplate]) {
    showNotification('No template to save', 'error');
    return;
  }
  
  customTemplates[currentEditingTemplate] = {
    id: currentEditingTemplate,
    name: document.getElementById('templateName').value.trim() || 'Untitled',
    category: document.getElementById('templateCategory').value,
    description: document.getElementById('templateDescription').value.trim(),
    content: document.getElementById('templateContent').value
  };
  
  chrome.storage.sync.set({ customTemplates }, () => {
    renderTemplateList();
    showNotification('✅ Template saved!', 'success');
  });
}

function resetCurrentTemplate() {
  if (!currentEditingTemplate || !customTemplates[currentEditingTemplate]) return;
  
  if (DEFAULT_TEMPLATES[currentEditingTemplate]) {
    if (confirm('Reset to default? Your customizations will be lost.')) {
      delete customTemplates[currentEditingTemplate];
      chrome.storage.sync.set({ customTemplates }, () => {
        renderTemplateList();
        loadTemplateForEdit(currentEditingTemplate);
        showNotification('✅ Template reset!', 'success');
      });
    }
  }
}

function deleteTemplate(templateId) {
  if (!customTemplates[templateId]) {
    showNotification('Cannot delete default templates', 'error');
    return;
  }
  
  if (confirm('Delete this custom template?')) {
    delete customTemplates[templateId];
    chrome.storage.sync.set({ customTemplates }, () => {
      if (currentEditingTemplate === templateId) {
        currentEditingTemplate = null;
        ['templateName', 'templateCategory', 'templateDescription', 'templateContent'].forEach(id => {
          const el = document.getElementById(id);
          if (el) el.value = '';
        });
      }
      renderTemplateList();
      showNotification('✅ Template deleted', 'success');
    });
  }
}

function previewCurrentTemplate() {
  if (!currentEditingTemplate) { showNotification('Select a template first', 'error'); return; }
  
  const template = getTemplate(currentEditingTemplate);
  if (!template) return;
  
  let preview = template.content;
  const sampleData = {
    yourName: appSettings.userName || 'Your Name',
    webmaster: 'John Doe',
    website: 'example.com',
    amount: appSettings.defaultAmount || '50',
    currency: appSettings.defaultCurrency || 'USD',
    articleTitle: 'Sample Article',
    clientAccount: 'Client Account',
    publishedLink: 'https://example.com/article',
    paypalName: 'paypal@example.com',
    paypalDetails: 'INV-123',
    gcashName: 'GCash Name',
    gcashNumber: '09123456789',
    reason: 'due to lack of response',
    webmasterName: 'John Doe',
    account: 'ABC Media',
    paypalAccountName: 'paypal@example.com',
    paypalInvoice: 'INV-123'
  };
  
  Object.entries(sampleData).forEach(([key, value]) => {
    preview = preview.replace(new RegExp(`{{${key}}}`, 'g'), value);
  });
  
  document.getElementById('templatePreview').textContent = preview;
  document.getElementById('previewModal').classList.add('show');
}

function closePreview() { document.getElementById('previewModal').classList.remove('show'); }

function copyPreview() {
  const preview = document.getElementById('templatePreview').textContent;
  navigator.clipboard.writeText(preview)
    .then(() => showNotification('✅ Preview copied!', 'success'))
    .catch(() => showNotification('Failed to copy', 'error'));
}

function insertVariableAtCursor(variable) {
  const textarea = document.getElementById('templateContent');
  if (!textarea || textarea.disabled) return;
  
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const text = textarea.value;
  
  textarea.value = text.substring(0, start) + variable + text.substring(end);
  textarea.selectionStart = textarea.selectionEnd = start + variable.length;
  textarea.focus();
}

function exportAllTemplates() {
  const exportData = { customTemplates, exportedAt: new Date().toISOString() };
  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `gdi-templates-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showNotification('✅ Templates exported!', 'success');
}

function importTemplates() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  
  input.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (data.customTemplates) {
          customTemplates = { ...customTemplates, ...data.customTemplates };
          chrome.storage.sync.set({ customTemplates }, () => {
            renderTemplateList();
            showNotification(`✅ ${Object.keys(data.customTemplates).length} templates imported!`, 'success');
          });
        } else {
          showNotification('❌ Invalid template file', 'error');
        }
      } catch (error) {
        showNotification('❌ Failed to import', 'error');
      }
    };
    reader.readAsText(file);
  });
  
  input.click();
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