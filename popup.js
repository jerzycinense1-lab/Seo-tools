// GDI SEO Tools Pro - Popup Script (UPDATED FOR SEO FEATURES)

document.addEventListener('DOMContentLoaded', function() {
  initExtension();
});

// ✅ EXACT DEFAULT TEMPLATES FROM YOUR BOOKMARKS
const DEFAULT_TEMPLATES = {
  'advance-payment': {
    id: 'advance-payment',
    name: 'Advance Payment Request (PayPal)',
    category: 'payment',
    description: 'Request advance payment via PayPal',
    content: `Hi,

This is an Advance Paypal payment request for {{account}} account. Here are the details:

Paypal Account Name: {{paypalName}}
Paypal Details/ Invoice: {{paypalDetails}}
Amount: {{amount}}
Currency: {{currency}}
Article Title: {{articleTitle}}
Website: {{website}}

Please let me know if you have any questions or concerns. Thank you.

Regards,
{{yourName}}`
  },
  'payment-paypal': {
    id: 'payment-paypal',
    name: 'Payment Request (PayPal)',
    category: 'payment',
    description: 'Request payment via PayPal after publication',
    content: `Hi,

This is a Paypal payment request for the {{clientAccount}} account. Here are the details:

Paypal Account Name: {{paypalAccountName}}
Paypal Invoice: {{paypalInvoice}}
Amount: {{amount}}
Currency: {{currency}}
Article Title: {{articleTitle}}
Website: {{website}}
Published Link: {{publishedLink}}

Please let me know if you have any questions or concerns. Thank you.

Regards,
{{yourName}}`
  },
  'payment-gcash': {
    id: 'payment-gcash',
    name: 'Payment Request (GCash)',
    category: 'payment',
    description: 'Request payment via GCash',
    content: `Hi,

This is a Gcash payment request for the {{clientAccount}}. Here are the details:

Gcash Account Name: {{gcashName}}
Gcash Account Number: {{gcashNumber}}
Amount: {{amount}}
Currency: Php
Article Title: {{articleTitle}}
Website: {{website}}
Published Link: {{publishedLink}}

Please let me know if you have any questions or concerns. Thank you.

Regards,
{{yourName}}`
  },
  'send-article': {
    id: 'send-article',
    name: 'Sending Article',
    category: 'article',
    description: 'Send article for publication (Detailed Guidelines)',
    content: `Hi {{webmaster}},

I hope this email finds you well. I'm writing to confirm that the article is now ready for publication. Attached, you'll find the finalized article for inclusion on your website {{website}}. As agreed, the payment of {{amount}} will be processed upon publication.

To ensure a smooth process, kindly adhere to the following guidelines:

* The link included in the article should be a do-follow link.
* Please avoid tagging the post as sponsored or adding any form of compensated disclaimer.
* Please do not include other external links to the article/if you do make sure they are credible websites and marked as no-follow. Internal links are acceptable.
* Incorporate the full article topic into the URL slug ({{articleTitle}}).
* The article and link must remain active for a minimum of 12 months.
* Please publish the article as-is without edits.
* Publication TAT/DATE: 24-48hrs.

For payment, PayPal is the preferred method. Once the article is live, please send a PayPal invoice to my email address and include the live URL for reference.

If you have any questions or need further clarification, feel free to reach out. I look forward to your confirmation and the successful publication of the article.

Best regards,
{{yourName}}`
  },
  'send-quick-article': {
    id: 'send-quick-article',
    name: 'Quick Article',
    category: 'article',
    description: 'Send quick article follow-up',
    content: `Hi {{webmasterName}},

I hope this email finds you well.

Attached is another article for publication on {{website}}, under the same terms and agreement as before.

Please let me know if you have any questions or need further adjustments.

Looking forward to your feedback.

Best regards,
{{yourName}}`
  },
  'article-followup': {
    id: 'article-followup',
    name: 'Article Follow-up',
    category: 'article',
    description: 'First follow-up for article',
    content: `Hi,

I hope you're doing well.

Just checking in to see if you've had a chance to review the article I sent for {{website}}. Please let me know if everything looks good or if any adjustments are needed.

Looking forward to your feedback.`
  },
  'second-followup': {
    id: 'second-followup',
    name: '2nd Follow-up',
    category: 'article',
    description: 'Second follow-up for article',
    content: `Hi,

I hope you're doing well.

I wanted to follow up on my previous email regarding the article I sent for {{website}}. I understand you're busy, but I wanted to check if you've had a chance to review it.

Please let me know if you need any additional information or if there's anything I can do to help move this forward.

Thank you for your time and consideration.

Best regards,`
  },
  'final-notice': {
    id: 'final-notice',
    name: 'Final Notice',
    category: 'article',
    description: 'Final notice before cancellation',
    content: `Hi,

I hope you're doing well.

This is my final follow-up regarding the article I sent for {{website}}. I understand you may be busy, but I wanted to give you a 12-hour window to respond before I consider this opportunity closed.

If I don't hear back from you within the next 12 hours, I'll assume you're no longer interested and will move on to other opportunities.

Please let me know your decision ASAP.

Thank you for your time.

Best regards,`
  },
  'cancel': {
    id: 'cancel',
    name: 'Cancellation Notice',
    category: 'article',
    description: 'Cancel article submission',
    content: `Hi,

I hope this email finds you well.

I am writing to inform you that I am canceling my submission for {{website}} {{reason}}.

Despite my previous attempts to follow up, I have not received any feedback regarding the article I sent. After careful consideration, I have decided to withdraw my submission and redirect my efforts elsewhere.

Thank you for your time, and I wish you all the best.

Best regards,`
  },
  'declined': {
    id: 'declined',
    name: 'Declined Response',
    category: 'outreach',
    description: 'Response when declined',
    content: `Hi,

Thank you for getting back to me. I really appreciate you taking the time to respond.

I completely understand that you're not currently accepting guest posts or link collaborations. I'm reaching out to a few platforms to share valuable content with new audiences, and I was wondering do you happen to know of any other websites or editors who are open to guest contributions?

Any leads or suggestions would be incredibly helpful and greatly appreciated.

Thanks again for your time.`
  },
  'email-outreach': {
    id: 'email-outreach',
    name: 'Email Outreach',
    category: 'outreach',
    description: 'Initial outreach email (Multiple Variations)',
    content: `Hi {{webmaster}} team,

I hope you're doing well.

I'm reaching out to ask if you currently accept guest contributions on your website. I'd be happy to provide original, well-researched content that aligns with your audience's interests and adds value to your platform.

If guest submissions are welcome, I'd appreciate it if you could share your guidelines or any requirements for consideration. I'd also like to know your average turnaround time when publishing articles on your website.

Looking forward to hearing from you. Thanks in advance!`
  },
  'nego': {
    id: 'nego',
    name: 'Negotiation Template',
    category: 'outreach',
    description: 'Price negotiation email ($50 offer)',
    content: `Hi,

Thank you for your response.

Unfortunately, I cannot afford your guest posting fee. I only have $50 available per article. I understand this might be below your standard rate, but I'm hoping you could consider it given my genuine interest in contributing quality content.

Please don't hesitate to contact me if you have any questions.

I'm looking forward to your kind response. Thank you!`
  },
  'send-invoice': {
    id: 'send-invoice',
    name: 'Send Invoice to WM',
    category: 'payment',
    description: 'Send invoice confirmation',
    content: `Hi {{webmaster}},

I'm pleased to confirm that the payment has now been successfully processed. Please see the attached invoice for your reference. If there's anything else you need from my end, do let me know.

Looking forward to more collaborations in the future!

Best regards,
{{yourName}}`
  }
};

// Global Variables
let appSettings = {};
let customTemplates = {};
let currentEditingTemplate = null;

// Initialize Extension
async function initExtension() {
  await loadSettings();
  await loadTemplates();
  await updateCurrentSite();
  setupEventListeners();
  setupPinning(); // Initialize the favorites system
  updateToolCount();
  checkDarkMode();
}

// Load Settings from Storage
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
      favorites: [] // Default empty favorites array
    }, (settings) => {
      appSettings = settings;
      
      document.getElementById('userName').value = settings.userName;
      document.getElementById('userEmail').value = settings.userEmail;
      document.getElementById('userPhone').value = settings.userPhone;
      document.getElementById('userLinkedin').value = settings.userLinkedin;
      document.getElementById('defaultCurrency').value = settings.defaultCurrency;
      document.getElementById('defaultAmount').value = settings.defaultAmount;
      document.getElementById('darkMode').checked = settings.darkMode;
      
      resolve(settings);
    });
  });
}

// Load Templates from Storage
async function loadTemplates() {
  return new Promise((resolve) => {
    chrome.storage.sync.get({ customTemplates: {} }, (result) => {
      customTemplates = result.customTemplates || {};
      resolve(customTemplates);
    });
  });
}

// Save Templates to Storage
async function saveTemplates() {
  return new Promise((resolve) => {
    chrome.storage.sync.set({ customTemplates }, () => {
      resolve();
    });
  });
}

// Get Template (Custom or Default)
function getTemplate(templateId) {
  if (customTemplates[templateId]) {
    return { ...customTemplates[templateId], isCustom: true };
  }
  if (DEFAULT_TEMPLATES[templateId]) {
    return { ...DEFAULT_TEMPLATES[templateId], isCustom: false };
  }
  return null;
}

// Update Current Site Info
async function updateCurrentSite() {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      if (currentTab && currentTab.url) {
        try {
          const url = new URL(currentTab.url);
          const domain = url.hostname.replace(/^www\./, '');
          document.getElementById('currentDomain').textContent = domain;
          window.currentDomain = domain;
          window.currentUrl = currentTab.url;
          window.currentTabId = currentTab.id;
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

// Setup Event Listeners
function setupEventListeners() {
  document.querySelectorAll('.tab-btn[data-tab]').forEach(btn => {
    btn.addEventListener('click', handleTabSwitch);
  });

  document.querySelectorAll('.tool-btn[data-action]').forEach(btn => {
    btn.addEventListener('click', handleToolClick);
  });

  document.querySelectorAll('.tool-btn.external').forEach(btn => {
    btn.addEventListener('click', handleExternalLink);
  });

  document.getElementById('searchInput').addEventListener('input', handleSearch);
  
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
      e.preventDefault();
      document.getElementById('searchInput').focus();
    }
  });

  document.getElementById('copyDomainBtn').addEventListener('click', copyCurrentDomain);

  document.getElementById('settingsBtn').addEventListener('click', openSettings);
  const settingsModalClose = document.querySelector('#settingsModal .modal-close');
  if (settingsModalClose) settingsModalClose.addEventListener('click', closeSettings);
  document.getElementById('saveSettings').addEventListener('click', saveSettings);
  document.getElementById('resetSettings').addEventListener('click', resetSettings);

  document.getElementById('templatesBtn').addEventListener('click', openTemplateManager);
  const templateModalClose = document.querySelector('#templateManagerModal .modal-close');
  if (templateModalClose) templateModalClose.addEventListener('click', closeTemplateManager);
  document.getElementById('closeTemplateManager').addEventListener('click', closeTemplateManager);
  document.getElementById('addNewTemplate').addEventListener('click', addNewTemplate);
  document.getElementById('saveTemplate').addEventListener('click', saveCurrentTemplate);
  document.getElementById('resetTemplate').addEventListener('click', resetCurrentTemplate);
  document.getElementById('previewTemplate').addEventListener('click', previewCurrentTemplate);
  document.getElementById('exportTemplates').addEventListener('click', exportAllTemplates);
  document.getElementById('importTemplates').addEventListener('click', importTemplates);
  document.getElementById('templateSearch').addEventListener('input', filterTemplateList);
  
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('var-tag')) {
      insertVariableAtCursor(e.target.textContent);
    }
  });

  const previewModalClose = document.querySelector('#previewModal .modal-close');
  if (previewModalClose) previewModalClose.addEventListener('click', closePreview);
  document.getElementById('closePreview').addEventListener('click', closePreview);
  document.getElementById('copyPreview').addEventListener('click', copyPreview);

  document.getElementById('toggleDarkMode').addEventListener('click', toggleDarkMode);
  document.getElementById('clearCache').addEventListener('click', clearCache);
  document.getElementById('exportSettings').addEventListener('click', exportSettings);
  document.getElementById('importSettings').addEventListener('click', importSettings);

  const notificationClose = document.querySelector('.notification-close');
  if (notificationClose) notificationClose.addEventListener('click', hideNotification);

  document.getElementById('settingsModal').addEventListener('click', (e) => {
    if (e.target.id === 'settingsModal') closeSettings();
  });
  document.getElementById('templateManagerModal').addEventListener('click', (e) => {
    if (e.target.id === 'templateManagerModal') closeTemplateManager();
  });
  document.getElementById('previewModal').addEventListener('click', (e) => {
    if (e.target.id === 'previewModal') closePreview();
  });
}

// Tab Switching
function handleTabSwitch(e) {
  const tabId = e.target.dataset.tab;
  
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
  
  e.target.classList.add('active');
  document.getElementById(tabId).classList.add('active');
  
  document.getElementById('searchInput').value = '';
  document.querySelectorAll('.tool-btn').forEach(btn => btn.classList.remove('hidden'));
}

// Replace the handleBulkUrlOpener function in popup.js with this improved version:

async function handleBulkUrlOpener() {
  const urlsText = prompt("📂 Bulk URL Opener\n\nPaste your list of URLs (one per line):\n\nExample:\nhttps://example.com\nhttps://google.com\nexample2.com (https will be added automatically)");
  
  if (!urlsText) return;

  // Clean the input and automatically add https if missing
  const urls = urlsText.split(/\n/)
    .map(u => u.trim())
    .filter(u => u.length > 0)
    .map(u => {
      // If it doesn't start with http:// or https://, add https://
      if (!/^https?:\/\//i.test(u)) {
        return 'https://' + u;
      }
      return u;
    });
  
  if (urls.length === 0) {
    showNotification('No valid URLs found.', 'error');
    return;
  }

  if (urls.length > 10) {
    if (!confirm(`⚠️ You are about to open ${urls.length} tabs.\n\nContinue?`)) return;
  }

  let opened = 0;
  urls.forEach((url, index) => {
    // Validate URL before opening
    try {
      new URL(url);
      // Staggered loading: opens one tab every 300ms
      setTimeout(() => {
        chrome.tabs.create({ url: url, active: false });
        opened++;
      }, index * 300);
    } catch (e) {
      console.warn('Invalid URL skipped:', url);
    }
  });
  
  setTimeout(() => {
    showNotification(`✅ Opened ${opened} of ${urls.length} tabs successfully!`, 'success');
  }, urls.length * 300 + 100);
}

// Tool Click Handler
// UPGRADED Tool Click Handler
async function handleToolClick(e) {
  const btn = e.currentTarget;
  const action = btn.dataset.action;
  
  if (!action) return;

  // FIX: This must come BEFORE the sendMessageToContent call
  if (action === 'bulk-url') {
    handleBulkUrlOpener();
    return; // Stop here so it doesn't try to talk to the content script
  }
  
  btn.classList.add('loading');
  
  try {
    if (!window.currentTabId) {
      await updateCurrentSite();
    }
    
    const response = await sendMessageToContent({ 
      action: action, 
      settings: appSettings,
      templates: customTemplates
    });
    
    if (response && response.success) {
      showNotification(response.message || 'Tool executed successfully!', 'success');
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

// Send Message to Content Script
function sendMessageToContent(message) {
  return new Promise((resolve) => {
    if (!window.currentTabId) {
      resolve({ success: false });
      return;
    }
    
    chrome.tabs.sendMessage(window.currentTabId, message, (response) => {
      if (chrome.runtime.lastError) {
        chrome.scripting.executeScript({
          target: { tabId: window.currentTabId },
          files: ['content.js']
        }, () => {
          setTimeout(() => {
            chrome.tabs.sendMessage(window.currentTabId, message, resolve);
          }, 100);
        });
      } else {
        resolve(response);
      }
    });
  });
}

// Execute Tool Directly (fallback)
function executeToolDirect(action) {
  const domain = window.currentDomain || '';
  const url = window.currentUrl || '';
  const encodedDomain = encodeURIComponent(domain);
  const encodedUrl = encodeURIComponent(url);

  const toolUrls = {
    'wayback': 'https://web.archive.org/web/*/' + url,
    'whois': 'https://www.whois.com/whois/' + encodedDomain,
    'pingdom': 'https://tools.pingdom.com/?url=' + encodedUrl,
    'pagespeed': 'https://developers.google.com/speed/pagespeed/insights/?url=' + encodedUrl,
    'mobile-friendly': 'https://search.google.com/test/mobile-friendly?url=' + encodedUrl,
    'schema': 'https://validator.schema.org/#url=' + encodedUrl,
    'richresults': 'https://search.google.com/test/rich-results?url=' + encodedUrl,
    'amp': 'https://search.google.com/test/amp?url=' + encodedUrl,
    'textcompare': 'https://prepostseo.org/text-compare',
    'authority': 'https://www.semrush.com/free-tools/website-authority-checker/?url=' + encodedDomain,
    'spamscore': 'https://websiteseochecker.com/spam-score-checker/?url=' + encodedDomain,
    'domainrating': 'https://ahrefs.com/website-authority-checker/?input=' + encodedDomain,
    'traffic': 'https://ahrefs.com/traffic-checker/?input=' + encodedDomain + '&mode=subdomains',
    'advsearch': 'https://www.google.com/advanced_search',
    'structured-data': 'https://search.google.com/test/rich-results?url=' + encodedUrl,
    'robots-txt': domain ? domain + '/robots.txt' : null,
    'sitemap': null // Handled by content script
  };

  if (toolUrls[action]) {
    if (action === 'metrics') {
      ['authority', 'spamscore', 'domainrating', 'traffic'].forEach(tool => {
        if (toolUrls[tool]) {
          chrome.tabs.create({ url: toolUrls[tool], active: false });
        }
      });
      showNotification('Opening all metrics tools...', 'success');
    } else if (action === 'robots-txt' && toolUrls[action]) {
      chrome.tabs.create({ url: toolUrls[action] });
      showNotification('Opening robots.txt...', 'success');
    } else {
      chrome.tabs.create({ url: toolUrls[action] });
      showNotification('Opening tool...', 'success');
    }
  } else {
    sendMessageToContent({ action: action, settings: appSettings, templates: customTemplates }).then(response => {
      if (response && response.success) {
        showNotification(response.message || 'Tool executed!', 'success');
      } else {
        showNotification('Please refresh the page and try again', 'warning');
      }
    });
  }
}

// External Link Handler
function handleExternalLink(e) {
  const url = e.currentTarget.dataset.url;
  if (url) {
    chrome.tabs.create({ url: url });
    showNotification('Opening external link...', 'success');
  }
}

// Enhanced Search Handler
function handleSearch(e) {
  const searchTerm = e.target.value.toLowerCase().trim();
  
  // Search across ALL tabs if there's a search term, otherwise just the active tab
  const containerToSearch = searchTerm === '' 
    ? document.querySelector('.tab-content.active') 
    : document;
    
  const toolGroups = containerToSearch.querySelectorAll('.tool-group');
  
  toolGroups.forEach(group => {
    // Skip the pinned favorites group if it's empty
    if (group.id === 'favorites-grid' && group.children.length === 0) return;

    const tools = group.querySelectorAll('.tool-btn');
    let visibleCount = 0;
    
    tools.forEach(tool => {
      const toolName = tool.textContent.toLowerCase();
      const toolTitle = tool.title ? tool.title.toLowerCase() : '';
      const keywords = tool.dataset.keywords ? tool.dataset.keywords.toLowerCase() : '';
      
      // Check if search term matches name, title, or hidden keywords
      if (toolName.includes(searchTerm) || toolTitle.includes(searchTerm) || keywords.includes(searchTerm)) {
        tool.classList.remove('hidden');
        visibleCount++;
      } else {
        tool.classList.add('hidden');
      }
    });
    
    // Smoothly hide the entire category header if no tools match in this group
    if (visibleCount === 0 && searchTerm !== '') {
      group.style.display = 'none';
    } else {
      group.style.display = 'block';
    }
  });

  // If searching globally, temporarily show all tab contents containing matches
  if (searchTerm !== '') {
    document.querySelectorAll('.tab-content').forEach(tab => {
      const hasVisibleTools = Array.from(tab.querySelectorAll('.tool-group')).some(g => g.style.display === 'block');
      if (hasVisibleTools) {
        tab.style.display = 'block';
      } else {
        tab.style.display = 'none';
      }
    });
  } else {
    // Reset tabs back to normal when search is cleared
    document.querySelectorAll('.tab-content').forEach(tab => tab.style.display = '');
    const activeTabId = document.querySelector('.tab-btn.active').dataset.tab;
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.getElementById(activeTabId).classList.add('active');
  }
}

// Copy Current Domain
function copyCurrentDomain() {
  const domain = document.getElementById('currentDomain').textContent;
  if (domain && domain !== 'N/A') {
    copyTextFallback(domain).then(() => {
      showNotification('Domain copied to clipboard!', 'success');
    }).catch(() => {
      const copied = prompt('Copy this domain:', domain);
      if (copied !== null) {
        showNotification('Domain ready to copy', 'success');
      }
    });
  }
}

// Universal Copy Function
// Modernized Universal Copy Function
async function copyTextFallback(text) {
  try {
    if (!text || typeof text !== 'string') {
      throw new Error('Invalid text to copy');
    }
    
    // Ensure we have focus before copying
    if (!document.hasFocus()) {
      window.focus();
    }

    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Clipboard write failed:', err);
    throw err;
  }
}

function copyWithExecCommand(text) {
  return new Promise((resolve, reject) => {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.top = '-9999px';
      textarea.style.left = '-9999px';
      textarea.style.width = '2em';
      textarea.style.height = '2em';
      textarea.style.padding = '0';
      textarea.style.border = 'none';
      textarea.style.outline = 'none';
      textarea.style.boxShadow = 'none';
      textarea.style.background = 'transparent';
      textarea.style.opacity = '0';
      
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textarea);
      
      if (successful) {
        resolve();
      } else {
        reject();
      }
    } catch (err) {
      reject();
    }
  });
}

// Settings Functions
function openSettings() {
  document.getElementById('settingsModal').classList.add('show');
}

function closeSettings() {
  document.getElementById('settingsModal').classList.remove('show');
}

function saveSettings() {
  const settings = {
    userName: document.getElementById('userName').value.trim(),
    userEmail: document.getElementById('userEmail').value.trim(),
    userPhone: document.getElementById('userPhone').value.trim(),
    userLinkedin: document.getElementById('userLinkedin').value.trim(),
    defaultCurrency: document.getElementById('defaultCurrency').value,
    defaultAmount: document.getElementById('defaultAmount').value,
    darkMode: document.getElementById('darkMode').checked
  };
  
  chrome.storage.sync.set(settings, () => {
    appSettings = settings;
    showNotification('Settings saved successfully!', 'success');
    closeSettings();
    checkDarkMode();
  });
}

function resetSettings() {
  if (confirm('Are you sure you want to reset all settings to defaults?')) {
    chrome.storage.sync.clear(() => {
      loadSettings().then(() => {
        showNotification('Settings reset to defaults', 'success');
      });
    });
  }
}

// Dark Mode
function toggleDarkMode() {
  appSettings.darkMode = !appSettings.darkMode;
  chrome.storage.sync.set({ darkMode: appSettings.darkMode });
  checkDarkMode();
  showNotification(appSettings.darkMode ? 'Dark mode enabled' : 'Light mode enabled', 'success');
}

function checkDarkMode() {
  if (appSettings.darkMode) {
    document.body.classList.add('dark-mode');
    document.getElementById('toggleDarkMode').textContent = '☀️ Toggle Light Mode';
  } else {
    document.body.classList.remove('dark-mode');
    document.getElementById('toggleDarkMode').textContent = '🌙 Toggle Dark Mode';
  }
}

// Clear Cache
function clearCache() {
  if (confirm('Clear all cached tool data? This will not affect your settings.')) {
    chrome.storage.local.clear(() => {
      showNotification('Cache cleared successfully!', 'success');
    });
  }
}

// Export/Import Settings
function exportSettings() {
  chrome.storage.sync.get(null, (settings) => {
    const dataStr = JSON.stringify(settings, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gdi-tools-settings-' + new Date().toISOString().split('T')[0] + '.json';
    a.click();
    
    URL.revokeObjectURL(url);
    showNotification('Settings exported!', 'success');
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
        const settings = JSON.parse(event.target.result);
        chrome.storage.sync.set(settings, () => {
          loadSettings().then(() => {
            showNotification('Settings imported successfully!', 'success');
            checkDarkMode();
          });
        });
      } catch (error) {
        showNotification('Invalid settings file', 'error');
      }
    };
    reader.readAsText(file);
  });
  
  input.click();
}

// Template Manager Functions
function openTemplateManager() {
  renderTemplateList();
  document.getElementById('templateManagerModal').classList.add('show');
}

function closeTemplateManager() {
  document.getElementById('templateManagerModal').classList.remove('show');
  currentEditingTemplate = null;
}

function renderTemplateList() {
  const templateList = document.getElementById('templateList');
  const searchQuery = document.getElementById('templateSearch').value.toLowerCase();
  
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
    templateList.innerHTML = '<div class="template-empty"><div style="font-size:48px;margin-bottom:10px;">📭</div><p>No templates found</p></div>';
    return;
  }
  
  templateList.innerHTML = filtered.map(template => {
    const deleteBtn = template.isCustom ? '<button class="template-delete" data-template-id="' + template.id + '" title="Delete Template">×</button>' : '';
    return '<div class="template-item ' + (template.isCustom ? 'template-item-custom' : 'template-item-default') + ' ' + (currentEditingTemplate === template.id ? 'active' : '') + '" data-template-id="' + template.id + '">' +
      '<div class="template-item-name">' + escapeHtml(template.name) + '</div>' +
      '<div class="template-item-category">' + escapeHtml(template.category) + ' ' + (template.isCustom ? '• Custom' : '• Default') + '</div>' +
      deleteBtn +
      '</div>';
  }).join('');
  
  templateList.querySelectorAll('.template-item').forEach(item => {
    item.addEventListener('click', (e) => {
      if (!e.target.classList.contains('template-delete')) {
        loadTemplateForEdit(item.dataset.templateId);
      }
    });
  });
  
  templateList.querySelectorAll('.template-delete').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteTemplate(btn.dataset.templateId);
    });
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function filterTemplateList() {
  renderTemplateList();
}

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
  document.getElementById('templateName').disabled = !isCustom;
  document.getElementById('templateCategory').disabled = !isCustom;
  document.getElementById('templateDescription').disabled = !isCustom;
  document.getElementById('templateContent').disabled = !isCustom;
  document.getElementById('saveTemplate').style.display = isCustom ? 'inline-block' : 'none';
  document.getElementById('resetTemplate').style.display = isCustom ? 'inline-block' : 'none';
  
  renderTemplateList();
}

function addNewTemplate() {
  const newId = 'custom-' + Date.now();
  const newTemplate = {
    id: newId,
    name: 'New Custom Template',
    category: 'custom',
    description: 'Custom email template',
    content: 'Hi {{webmaster}},\n\nI hope this email finds you well.\n\n[Your message here]\n\nBest regards,\n{{yourName}}'
  };
  
  customTemplates[newId] = newTemplate;
  saveTemplates().then(() => {
    renderTemplateList();
    loadTemplateForEdit(newId);
    showNotification('New template created!', 'success');
  });
}

function saveCurrentTemplate() {
  if (!currentEditingTemplate || !customTemplates[currentEditingTemplate]) {
    showNotification('No template to save', 'error');
    return;
  }
  
  customTemplates[currentEditingTemplate] = {
    id: currentEditingTemplate,
    name: document.getElementById('templateName').value.trim() || 'Untitled Template',
    category: document.getElementById('templateCategory').value,
    description: document.getElementById('templateDescription').value.trim(),
    content: document.getElementById('templateContent').value
  };
  
  saveTemplates().then(() => {
    renderTemplateList();
    showNotification('Template saved successfully!', 'success');
  });
}

function resetCurrentTemplate() {
  if (!currentEditingTemplate || !customTemplates[currentEditingTemplate]) {
    return;
  }
  
  if (DEFAULT_TEMPLATES[currentEditingTemplate]) {
    if (confirm('Reset this template to default? Your customizations will be lost.')) {
      delete customTemplates[currentEditingTemplate];
      saveTemplates().then(() => {
        renderTemplateList();
        loadTemplateForEdit(currentEditingTemplate);
        showNotification('Template reset to default', 'success');
      });
    }
  }
}

function deleteTemplate(templateId) {
  if (!customTemplates[templateId]) {
    showNotification('Cannot delete default templates', 'error');
    return;
  }
  
  if (confirm('Are you sure you want to delete this custom template?')) {
    delete customTemplates[templateId];
    saveTemplates().then(() => {
      if (currentEditingTemplate === templateId) {
        currentEditingTemplate = null;
        document.getElementById('templateName').value = '';
        document.getElementById('templateCategory').value = 'custom';
        document.getElementById('templateDescription').value = '';
        document.getElementById('templateContent').value = '';
      }
      renderTemplateList();
      showNotification('Template deleted', 'success');
    });
  }
}

function previewCurrentTemplate() {
  if (!currentEditingTemplate) {
    showNotification('Select a template to preview', 'error');
    return;
  }
  
  const template = getTemplate(currentEditingTemplate);
  if (!template) return;
  
  let preview = template.content;
  const sampleData = {
    yourName: appSettings.userName || 'Your Name',
    webmaster: 'John Doe',
    website: 'example.com',
    amount: appSettings.defaultAmount || '50',
    currency: appSettings.defaultCurrency || 'USD',
    articleTitle: 'Sample Article Title',
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
  
  Object.keys(sampleData).forEach(key => {
    const regex = new RegExp('{{' + key + '}}', 'g');
    preview = preview.replace(regex, sampleData[key]);
  });
  
  document.getElementById('templatePreview').textContent = preview;
  document.getElementById('previewModal').classList.add('show');
}

function closePreview() {
  document.getElementById('previewModal').classList.remove('show');
}

function copyPreview() {
  const preview = document.getElementById('templatePreview').textContent;
  copyTextFallback(preview).then(() => {
    showNotification('Preview copied!', 'success');
  }).catch(() => {
    const copied = prompt('Copy this preview:', preview);
    if (copied !== null) {
      showNotification('Preview ready to copy', 'success');
    }
  });
}

function insertVariableAtCursor(variable) {
  const textarea = document.getElementById('templateContent');
  if (!textarea.disabled) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    
    textarea.value = text.substring(0, start) + variable + text.substring(end);
    textarea.selectionStart = textarea.selectionEnd = start + variable.length;
    textarea.focus();
  }
}

function exportAllTemplates() {
  const exportData = {
    customTemplates: customTemplates,
    exportedAt: new Date().toISOString()
  };
  
  const dataStr = JSON.stringify(exportData, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = 'gdi-templates-' + new Date().toISOString().split('T')[0] + '.json';
  a.click();
  
  URL.revokeObjectURL(url);
  showNotification('Templates exported!', 'success');
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
        const importData = JSON.parse(event.target.result);
        if (importData.customTemplates) {
          customTemplates = { ...customTemplates, ...importData.customTemplates };
          saveTemplates().then(() => {
            renderTemplateList();
            showNotification('Imported ' + Object.keys(importData.customTemplates).length + ' templates!', 'success');
          });
        } else {
          showNotification('Invalid template file format', 'error');
        }
      } catch (error) {
        showNotification('Failed to import templates', 'error');
      }
    };
    reader.readAsText(file);
  });
  
  input.click();
}

// Notification System
function showNotification(message, type) {
  const notification = document.getElementById('notification');
  const messageEl = notification.querySelector('.notification-message');
  
  messageEl.textContent = message;
  notification.className = 'notification show ' + (type === 'error' ? 'error' : type === 'warning' ? 'warning' : '');
  
  setTimeout(() => {
    hideNotification();
  }, 4000);
}

function hideNotification() {
  const notification = document.getElementById('notification');
  notification.classList.remove('show');
}

// Update Tool Count
function updateToolCount() {
  const totalTools = document.querySelectorAll('.tool-btn[data-action], .tool-btn.external').length;
  document.getElementById('toolCount').textContent = totalTools + ' tools';
}

// ==================== FAVORITES / PINNING SYSTEM ====================

function setupPinning() {
  const allTools = document.querySelectorAll('.tool-btn[data-action], .tool-btn.external');
  
  allTools.forEach(btn => {
    // Prevent adding multiple pins if setup is called twice
    if(btn.querySelector('.pin-btn')) return; 

    const actionId = btn.dataset.action || btn.dataset.url;
    const isPinned = appSettings.favorites && appSettings.favorites.includes(actionId);
    
    const pinBtn = document.createElement('button');
    pinBtn.className = `pin-btn ${isPinned ? 'pinned' : ''}`;
    pinBtn.innerHTML = '★';
    pinBtn.title = isPinned ? 'Unpin from Favorites' : 'Pin to Favorites';
    
    // Handle the pin click
    pinBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // Stop the tool from actually running
      
      if (!appSettings.favorites) appSettings.favorites = [];
      
      const index = appSettings.favorites.indexOf(actionId);
      if (index > -1) {
        // Remove from favorites
        appSettings.favorites.splice(index, 1);
        pinBtn.classList.remove('pinned');
        pinBtn.title = 'Pin to Favorites';
      } else {
        // Add to favorites
        appSettings.favorites.push(actionId);
        pinBtn.classList.add('pinned');
        pinBtn.title = 'Unpin from Favorites';
      }
      
      // Save settings and update the UI
      chrome.storage.sync.set({ favorites: appSettings.favorites }, () => {
        renderFavorites();
      });
    });
    
    btn.appendChild(pinBtn);
  });
  
  renderFavorites();
}

function renderFavorites() {
  const grid = document.getElementById('favorites-grid');
  if (!grid) return;
  
  grid.innerHTML = ''; // Clear current favorites
  
  if (!appSettings.favorites || appSettings.favorites.length === 0) {
    grid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; color: var(--text-secondary); padding: 20px;">No pinned tools yet. Click the ★ on any tool to pin it here!</div>';
    return;
  }
  
  appSettings.favorites.forEach(actionId => {
    // Find the original button anywhere in the DOM
    const originalBtn = document.querySelector(`.tool-btn[data-action="${actionId}"], .tool-btn[data-url="${actionId}"]`);
    
    if (originalBtn) {
      const clonedBtn = originalBtn.cloneNode(true);
      
      // Re-attach the execution listener since cloneNode doesn't copy event listeners
      if (clonedBtn.dataset.action) {
        clonedBtn.addEventListener('click', handleToolClick);
      } else if (clonedBtn.dataset.url) {
        clonedBtn.addEventListener('click', handleExternalLink);
      }
      
      // Re-attach the pin listener to the clone's star icon
      const clonePinBtn = clonedBtn.querySelector('.pin-btn');
      if (clonePinBtn) {
        clonePinBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          // Find the original pin button and click it to ensure state stays synced
          const originalPinBtn = originalBtn.querySelector('.pin-btn');
          if (originalPinBtn) originalPinBtn.click();
        });
      }
      
      grid.appendChild(clonedBtn);
    }
  });
}
// ==================== UI ENHANCEMENTS ====================

// Smooth tool button animation on click
function addRippleEffect(button) {
  button.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
}

// Add CSS for ripple effect
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
  .tool-btn {
    position: relative;
    overflow: hidden;
  }
  .ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.4);
    transform: scale(0);
    animation: ripple-animation 0.6s linear;
    pointer-events: none;
  }
  @keyframes ripple-animation {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
  body.dark-mode .ripple {
    background: rgba(255, 255, 255, 0.2);
  }
`;
document.head.appendChild(rippleStyle);

// Apply ripple to all tool buttons
document.querySelectorAll('.tool-btn').forEach(btn => addRippleEffect(btn));

// Smooth tab switching with progress indicator
function enhanceTabSwitching() {
  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', function(e) {
      // Add haptic feedback vibration (if supported)
      if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(10);
      }
      
      // Update active state with smooth transition
      const tabId = this.dataset.tab;
      const targetContent = document.getElementById(tabId);
      
      // Fade out current content
      const activeContent = document.querySelector('.tab-content.active');
      if (activeContent && activeContent !== targetContent) {
        activeContent.style.opacity = '0';
        activeContent.style.transform = 'translateY(8px)';
        setTimeout(() => {
          activeContent.classList.remove('active');
          activeContent.style.opacity = '';
          activeContent.style.transform = '';
        }, 150);
      }
      
      // Fade in new content
      setTimeout(() => {
        targetContent.classList.add('active');
        targetContent.style.animation = 'none';
        targetContent.offsetHeight; // Force reflow
        targetContent.style.animation = 'fadeIn var(--transition-base)';
      }, 50);
    });
  });
}

// Enhanced search with keyboard navigation
function enhanceSearch() {
  const searchInput = document.getElementById('searchInput');
  const toolButtons = document.querySelectorAll('.tool-btn');
  
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      searchInput.value = '';
      searchInput.dispatchEvent(new Event('input'));
      searchInput.blur();
      showNotification('Search cleared', 'success');
    }
    
    if (e.key === 'Enter') {
      const visibleTools = Array.from(toolButtons).filter(btn => !btn.classList.contains('hidden'));
      if (visibleTools.length === 1) {
        visibleTools[0].click();
        showNotification(`Launching: ${visibleTools[0].textContent}`, 'success');
      } else if (visibleTools.length > 0) {
        showNotification(`${visibleTools.length} tools match your search`, 'info');
      }
    }
  });
  
  // Add search counter
  const searchCounter = document.createElement('span');
  searchCounter.style.cssText = `
    position: absolute;
    right: 80px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 10px;
    color: var(--text-muted);
    background: var(--bg-tertiary);
    padding: 2px 6px;
    border-radius: var(--radius-full);
    pointer-events: none;
  `;
  searchCounter.textContent = '0/0';
  document.querySelector('.search-box').appendChild(searchCounter);
  
  const originalSearch = handleSearch;
  window.handleSearch = function(e) {
    originalSearch(e);
    const visible = Array.from(toolButtons).filter(btn => !btn.classList.contains('hidden')).length;
    const total = toolButtons.length;
    searchCounter.textContent = `${visible}/${total}`;
    if (visible === 0) {
      searchCounter.style.color = 'var(--danger-color)';
    } else {
      searchCounter.style.color = 'var(--text-muted)';
    }
  };
}

// Tooltip system for better UX
function addTooltips() {
  const tooltips = {
    'templatesBtn': 'Manage email templates (Ctrl+T)',
    'settingsBtn': 'Open settings (Ctrl+S)',
    'copyDomainBtn': 'Copy current domain to clipboard',
    'toggleDarkMode': 'Switch between light and dark theme',
    'clearCache': 'Clear cached tool data',
    'exportSettings': 'Export all settings as JSON',
    'importSettings': 'Import settings from JSON file',
    'searchInput': 'Type / to focus, Esc to clear, Enter to launch first tool'
  };
  
  for (const [id, tooltip] of Object.entries(tooltips)) {
    const element = document.getElementById(id);
    if (element) {
      element.title = tooltip;
    }
  }
  
  // Add tooltips to all tool buttons
  document.querySelectorAll('.tool-btn').forEach(btn => {
    const action = btn.dataset.action;
    if (action && !btn.title) {
      const toolNames = {
        'highlight-dofollow': 'Highlight all do-follow links in green',
        'analyze-headings': 'Analyze heading structure (H1-H6)',
        'analyze-meta': 'Check meta tags for SEO optimization',
        'pagespeed': 'Test page speed with Google PageSpeed Insights',
        'keyword-rank-tracker': 'Track keyword rankings in Google search results'
      };
      btn.title = toolNames[action] || 'Click to run this tool';
    }
  });
}

// Keyboard shortcuts
function setupKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + T - Open Template Manager
    if ((e.ctrlKey || e.metaKey) && e.key === 't') {
      e.preventDefault();
      document.getElementById('templatesBtn').click();
      showNotification('📝 Template Manager opened', 'success');
    }
    
    // Ctrl/Cmd + S - Open Settings
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      document.getElementById('settingsBtn').click();
      showNotification('⚙️ Settings opened', 'success');
    }
    
    // Ctrl/Cmd + D - Toggle Dark Mode
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
      e.preventDefault();
      document.getElementById('toggleDarkMode').click();
    }
    
    // Ctrl/Cmd + F - Focus Search
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
      e.preventDefault();
      document.getElementById('searchInput').focus();
    }
  });
}

// Loading skeleton for better perceived performance
function showLoadingSkeleton() {
  const toolGroups = document.querySelectorAll('.tool-group');
  toolGroups.forEach(group => {
    const grid = group.querySelector('.tool-grid');
    if (grid && grid.children.length === 0) {
      for (let i = 0; i < 4; i++) {
        const skeleton = document.createElement('div');
        skeleton.className = 'tool-btn skeleton';
        skeleton.style.cssText = `
          height: 44px;
          background: linear-gradient(90deg, var(--bg-tertiary) 25%, var(--bg-secondary) 50%, var(--bg-tertiary) 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: var(--radius-md);
        `;
        grid.appendChild(skeleton);
      }
    }
  });
  
  const style = document.createElement('style');
  style.textContent = `
    @keyframes loading {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `;
  document.head.appendChild(style);
  
  // Remove skeletons after content loads
  setTimeout(() => {
    document.querySelectorAll('.skeleton').forEach(s => s.remove());
  }, 500);
}

// Progress indicator for long operations
function showProgressIndicator(message, duration = 2000) {
  const indicator = document.createElement('div');
  indicator.className = 'progress-indicator';
  indicator.style.cssText = `
    position: fixed;
    bottom: 80px;
    right: 20px;
    background: var(--bg-primary);
    border-radius: var(--radius-lg);
    padding: 12px 16px;
    box-shadow: var(--shadow-lg);
    border: 1px solid var(--border-color);
    z-index: 10002;
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 13px;
    animation: slideInRight var(--transition-base);
  `;
  indicator.innerHTML = `
    <div class="spinner" style="width: 20px; height: 20px; border: 2px solid var(--border-color); border-top-color: var(--primary-color); border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
    <span>${message}</span>
  `;
  document.body.appendChild(indicator);
  
  setTimeout(() => {
    indicator.style.animation = 'slideOutRight var(--transition-base)';
    setTimeout(() => indicator.remove(), 200);
  }, duration);
}

// Add CSS animations
const animationStyle = document.createElement('style');
animationStyle.textContent = `
  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  @keyframes slideOutRight {
    from {
      opacity: 1;
      transform: translateX(0);
    }
    to {
      opacity: 0;
      transform: translateX(20px);
    }
  }
`;
document.head.appendChild(animationStyle);

// Call enhancement functions
function initUIEnhancements() {
  enhanceTabSwitching();
  enhanceSearch();
  addTooltips();
  setupKeyboardShortcuts();
  showLoadingSkeleton();
}

// Call this in your DOMContentLoaded event
// initUIEnhancements();
// Welcome tour for first-time users
async function showWelcomeTour() {
  const { hasSeenTour } = await chrome.storage.sync.get('hasSeenTour');
  if (hasSeenTour) return;
  
  const tourSteps = [
    {
      element: '.header h1',
      title: '🎉 Welcome to SEO Tools Pro!',
      content: 'Your complete SEO and outreach toolkit. Let\'s take a quick tour!',
      position: 'bottom'
    },
    {
      element: '.search-box',
      title: '🔍 Quick Search',
      content: 'Press "/" to focus search, type any tool name, and press Enter to launch the first match!',
      position: 'bottom'
    },
    {
      element: '.pin-btn',
      title: '⭐ Pin Your Favorite Tools',
      content: 'Click the star icon on any tool to pin it to your Favorites tab for quick access!',
      position: 'left'
    },
    {
      element: '.tabs',
      title: '📂 Organized Categories',
      content: 'Tools are organized into SEO, Email, Extractors, Utilities, and Apps tabs.',
      position: 'bottom'
    },
    {
      element: '.footer',
      title: '💾 Export/Import Settings',
      content: 'Backup your settings and custom templates anytime using the export/import buttons.',
      position: 'top'
    }
  ];
  
  let currentStep = 0;
  
  function showStep() {
    const step = tourSteps[currentStep];
    const target = document.querySelector(step.element);
    if (!target) {
      currentStep++;
      if (currentStep < tourSteps.length) showStep();
      return;
    }
    
    // Remove existing tour
    const existingTour = document.querySelector('.tour-overlay');
    if (existingTour) existingTour.remove();
    
    // Create tour overlay
    const overlay = document.createElement('div');
    overlay.className = 'tour-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.7);
      z-index: 20000;
      display: flex;
      justify-content: center;
      align-items: center;
    `;
    
    const rect = target.getBoundingClientRect();
    const tooltip = document.createElement('div');
    tooltip.style.cssText = `
      position: fixed;
      ${step.position === 'bottom' ? `top: ${rect.bottom + 10}px; left: ${rect.left}px;` : ''}
      ${step.position === 'top' ? `bottom: ${window.innerHeight - rect.top + 10}px; left: ${rect.left}px;` : ''}
      ${step.position === 'left' ? `right: ${window.innerWidth - rect.left + 10}px; top: ${rect.top}px;` : ''}
      background: var(--bg-primary);
      color: var(--text-primary);
      padding: 16px 20px;
      border-radius: var(--radius-lg);
      max-width: 280px;
      box-shadow: var(--shadow-xl);
      z-index: 20001;
      animation: fadeIn var(--transition-base);
    `;
    tooltip.innerHTML = `
      <h3 style="margin: 0 0 8px; font-size: 16px;">${step.title}</h3>
      <p style="margin: 0 0 16px; font-size: 13px; line-height: 1.5;">${step.content}</p>
      <div style="display: flex; gap: 10px; justify-content: flex-end;">
        ${currentStep > 0 ? '<button id="tourPrev" class="btn-secondary" style="padding: 6px 12px;">← Back</button>' : ''}
        <button id="tourNext" class="btn-primary" style="padding: 6px 16px;">${currentStep === tourSteps.length - 1 ? '✨ Get Started' : 'Next →'}</button>
      </div>
    `;
    
    overlay.appendChild(tooltip);
    document.body.appendChild(overlay);
    
    // Highlight target
    target.style.position = 'relative';
    target.style.zIndex = '20002';
    target.style.boxShadow = '0 0 0 3px var(--accent-color)';
    
    document.getElementById('tourNext').onclick = () => {
      target.style.boxShadow = '';
      overlay.remove();
      currentStep++;
      if (currentStep < tourSteps.length) {
        showStep();
      } else {
        chrome.storage.sync.set({ hasSeenTour: true });
        showNotification('🎉 You\'re ready to go! Enjoy SEO Tools Pro!', 'success');
      }
    };
    
    if (document.getElementById('tourPrev')) {
      document.getElementById('tourPrev').onclick = () => {
        target.style.boxShadow = '';
        overlay.remove();
        currentStep--;
        showStep();
      };
    }
  }
  
  showStep();
}

// Call this after initExtension()
// showWelcomeTour();
