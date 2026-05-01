
let customTemplates = {};
let appSettings = {};
let currentEditingTemplate = null;

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

document.addEventListener('DOMContentLoaded', async () => {
  await loadData();
  applyTheme();
  renderTemplateList();
  setupEventListeners();
  
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'sync') {
      if (changes.darkMode !== undefined) {
        appSettings.darkMode = changes.darkMode.newValue;
        applyTheme();
      }
      if (changes.themePrimary !== undefined || changes.themeAccent !== undefined) {
        if (changes.themePrimary) appSettings.themePrimary = changes.themePrimary.newValue;
        if (changes.themeAccent) appSettings.themeAccent = changes.themeAccent.newValue;
        applyTheme();
      }
      if (changes.customTemplates) {
        customTemplates = changes.customTemplates.newValue || {};
        renderTemplateList();
      }
    }
  });
});

async function loadData() {
  return new Promise((resolve) => {
    chrome.storage.sync.get({ customTemplates: {}, darkMode: false, themePrimary: '#2563EB', themeAccent: '#F59E0B', userName: 'Your Name', defaultAmount: '50', defaultCurrency: 'USD', enableWidget: false, compactMode: false, recentlyUsed: [] }, (result) => {
      customTemplates = result.customTemplates || {};
      appSettings = result;
      resolve();
    });
  });
}

function applyTheme() {
  if (appSettings.darkMode) document.body.classList.add('dark-mode');
  
  let style = document.getElementById('custom-theme-overrides');
  if (!style) {
    style = document.createElement('style');
    style.id = 'custom-theme-overrides';
    document.head.appendChild(style);
  }
  
  const primary = appSettings.themePrimary;
  const accent = appSettings.themeAccent;
  
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

function setupEventListeners() {
  document.getElementById('addNewTemplate')?.addEventListener('click', addNewTemplate);
  document.getElementById('saveTemplate')?.addEventListener('click', saveCurrentTemplate);
  document.getElementById('resetTemplate')?.addEventListener('click', resetCurrentTemplate);
  document.getElementById('previewTemplate')?.addEventListener('click', previewCurrentTemplate);
  document.getElementById('exportTemplates')?.addEventListener('click', exportAllTemplates);
  document.getElementById('importTemplates')?.addEventListener('click', importTemplates);
  document.getElementById('templateSearch')?.addEventListener('input', () => renderTemplateList());

  document.querySelector('#previewModal .modal-close')?.addEventListener('click', closePreview);
  document.getElementById('closePreview')?.addEventListener('click', closePreview);
  document.getElementById('copyPreview')?.addEventListener('click', copyPreview);

  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('var-tag')) {
      insertVariableAtCursor(e.target.textContent);
    }
    if (e.target.id === 'previewModal') {
      closePreview();
    }
  });
  document.querySelector('.notification-close')?.addEventListener('click', hideNotification);
}

function getTemplate(templateId) {
  if (customTemplates[templateId]) return { ...customTemplates[templateId], isCustom: true };
  if (DEFAULT_TEMPLATES[templateId]) return { ...DEFAULT_TEMPLATES[templateId], isCustom: false };
  return null;
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
  if (confirm('Reset to default? Your customizations will be lost.')) {
    delete customTemplates[currentEditingTemplate];
    chrome.storage.sync.set({ customTemplates }, () => {
      renderTemplateList();
      loadTemplateForEdit(currentEditingTemplate);
      showNotification('✅ Template reset!', 'success');
    });
  }
}

function deleteTemplate(templateId) {
  if (!customTemplates[templateId]) return;
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
