// GDI SEO Tools Pro - Content Script (Enhanced)

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const action = request.action;
  const settings = request.settings || {};
  const templates = request.templates || {};
  
  try {
    switch(action) {
      case 'urlslug':
        generateUrlSlug();
        sendResponse({ success: true, message: 'URL Slug generated!' });
        break;
      
      case 'whatsapp-link':
        generateWhatsappLink();
        sendResponse({ success: true, message: 'WhatsApp link generated!' });
        break;
      
      case 'scroll':
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        sendResponse({ success: true, message: 'Scrolled to bottom!' });
        break;
      
      case 'copy-url':
        copyToClipboard(window.location.href);
        sendResponse({ success: true, message: 'URL copied!' });
        break;
      
      case 'copy-domain':
        const domain = window.location.hostname.replace(/^www\./, '');
        copyToClipboard(domain);
        sendResponse({ success: true, message: 'Domain copied!' });
        break;
      
      case 'email-extract':
        extractEmails();
        sendResponse({ success: true, message: 'Emails extracted!' });
        break;
      
      case 'social-extract':
        extractSocialLinks();
        sendResponse({ success: true, message: 'Social links extracted!' });
        break;
      
      case 'linkextract':
        extractLinks();
        sendResponse({ success: true, message: 'Links extracted!' });
        break;
      
      case 'domainextract':
        extractDomains();
        sendResponse({ success: true, message: 'Domains extracted!' });
        break;
      
      case 'googledomain':
        extractGoogleDomains();
        sendResponse({ success: true, message: 'Google domains extracted!' });
        break;
      
      case 'blogs':
        findBlogPage();
        sendResponse({ success: true, message: 'Searching for blog page...' });
        break;
      
      case 'guestpost':
        findGuestPostPages();
        sendResponse({ success: true, message: 'Searching for guest post pages...' });
        break;
      
      case 'contact-form':
        fillContactForm(settings);
        sendResponse({ success: true, message: 'Contact form filled!' });
        break;
      
      case 'searchoperators':
        showSearchOperators();
        sendResponse({ success: true, message: 'Search operators opened!' });
        break;
      
      case 'nextpage':
        goToNextPage();
        sendResponse({ success: true, message: 'Navigating to next page...' });
        break;
      
      case 'advance-payment':
        showPaymentForm('advance', settings, templates);
        sendResponse({ success: true, message: 'Payment form opened!' });
        break;
      
      case 'payment-paypal':
        showPaymentForm('paypal', settings, templates);
        sendResponse({ success: true, message: 'Payment form opened!' });
        break;
      
      case 'payment-gcash':
        showPaymentForm('gcash', settings, templates);
        sendResponse({ success: true, message: 'Payment form opened!' });
        break;
      
      case 'send-article':
        showArticleForm('full', settings, templates);
        sendResponse({ success: true, message: 'Article form opened!' });
        break;
      
      case 'send-quick-article':
        showArticleForm('quick', settings, templates);
        sendResponse({ success: true, message: 'Quick article form opened!' });
        break;
      
      case 'article-followup':
        showFollowupForm(1, settings, templates);
        sendResponse({ success: true, message: 'Follow-up form opened!' });
        break;
      
      case 'second-followup':
        showFollowupForm(2, settings, templates);
        sendResponse({ success: true, message: '2nd follow-up opened!' });
        break;
      
      case 'final-notice':
        showFollowupForm('final', settings, templates);
        sendResponse({ success: true, message: 'Final notice opened!' });
        break;
      
      case 'cancel':
        showCancelForm(settings, templates);
        sendResponse({ success: true, message: 'Cancellation form opened!' });
        break;
      
      case 'declined':
        copyDeclinedTemplate(settings, templates);
        sendResponse({ success: true, message: 'Declined template copied!' });
        break;
      
      case 'send-invoice':
        showInvoiceForm(settings, templates);
        sendResponse({ success: true, message: 'Invoice form opened!' });
        break;
      
      case 'email-outreach':
        showOutreachTemplates(settings, templates);
        sendResponse({ success: true, message: 'Outreach templates loaded!' });
        break;
      
      case 'nego':
        showNegoTemplates(settings, templates);
        sendResponse({ success: true, message: 'Negotiation templates loaded!' });
        break;
      
      case 'highlight-dofollow':
  highlightDoFollowLinks();
  sendResponse({ success: true, message: 'Do-follow links highlighted in green!' });
  break;

case 'remove-highlights':
  removeHighlights();
  sendResponse({ success: true, message: 'Highlights removed!' });
  break;

case 'analyze-headings':
  analyzeHeadings();
  sendResponse({ success: true, message: 'Heading analysis opened!' });
  break;

case 'analyze-meta':
  analyzeMetaTags();
  sendResponse({ success: true, message: 'Meta tags analysis opened!' });
  break;

case 'analyze-images':
  analyzeImages();
  sendResponse({ success: true, message: 'Images analysis opened!' });
  break;

case 'analyze-links':
  analyzeLinks();
  sendResponse({ success: true, message: 'Links analysis opened!' });
  break;

case 'pagespeed':
  checkPageSpeed();
  sendResponse({ success: true, message: 'Opening PageSpeed Insights...' });
  break;

case 'mobile-friendly':
  checkMobileFriendly();
  sendResponse({ success: true, message: 'Opening Mobile-Friendly Test...' });
  break;

case 'structured-data':
  checkStructuredData();
  sendResponse({ success: true, message: 'Structured data analysis opened!' });
  break;

case 'robots-txt':
  checkRobotsTxt();
  sendResponse({ success: true, message: 'Opening robots.txt...' });
  break;

case 'sitemap':
  checkSitemap();
  sendResponse({ success: true, message: 'Checking sitemap...' });
  break;

case 'analyze-content':
  analyzeContent();
  sendResponse({ success: true, message: 'Content analysis opened!' });
  break;

case 'export-seo-data':
  exportSEOData();
  sendResponse({ success: true, message: 'SEO data exported!' });
  break;
case 'keyword-rank-tracker':
  keywordRankTracker();
  sendResponse({ success: true, message: 'Keyword rank tracker started!' });
  break;
  case 'advanced-text-compare':
  advancedSEOCompare();
  sendResponse({ success: true, message: 'Advanced SEO text compare opened!' });
  break;
  case 'image-toolkit':
  advancedImageToolkit();
  sendResponse({ success: true, message: 'Advanced Image Toolkit opened!' });
  break;
  case 'seo-utilities':
  advancedSEOUtilities();
  sendResponse({ success: true, message: 'Advanced SEO Utilities Toolkit opened!' });
  break;
case 'alt-generator':
  generateAltText();
  sendResponse({ success: true, message: 'Alt text suggestions ready!' });
  break;
  case 'ai-meta-generator':
  generateAIMetaTags();
  sendResponse({ success: true, message: 'AI Meta tags generated!' });
  break;

case 'url-optimizer':
  optimizeUrl();
  sendResponse({ success: true, message: 'URL optimization complete!' });
  break;

case 'title-generator':
  generateSEOTitles();
  sendResponse({ success: true, message: 'SEO titles generated!' });
  break;
case 'alt-generator':
  generateAltText();
  sendResponse({ success: true, message: 'Alt text suggestions ready!' });
  break;
case 'meta-description-generator':
  generateMetaDescriptions();
  sendResponse({ success: true, message: 'Meta descriptions generated!' });
  break;
  case 'link-prospects':
  findLinkProspects();
  sendResponse({ success: true, message: 'Link prospect search ready!' });
  break;

case 'resource-pages':
  findResourcePages();
  sendResponse({ success: true, message: 'Resource page search ready!' });
  break;

case 'seo-audit-checklist':
  showSEOAuditChecklist();
  sendResponse({ success: true, message: 'SEO Audit Checklist opened!' });
  break;
case 'audit-checklist':
  showAuditChecklist();
  sendResponse({ success: true, message: 'SEO audit checklist opened!' });
  break;
case 'ai-topic-generator':
  generateAITopics();
  sendResponse({ success: true, message: 'AI topics generated!' });
  break;

case 'local-keyword-finder':
  findLocalKeywords();
  sendResponse({ success: true, message: 'Local keywords found!' });
  break;

case 'hreflang-generator':
  generateHreflang();
  sendResponse({ success: true, message: 'Hreflang tags generated!' });
  break;
  case 'pubdate-checker':
  checkPublicationDate();
  sendResponse({ success: true, message: 'Publication date analysis complete!' });
  break;

case 'mobile-usability':
  testMobileUsability();
  sendResponse({ success: true, message: 'Mobile usability test complete!' });
  break;

case 'duplicate-content':
  findDuplicateContent();
  sendResponse({ success: true, message: 'Duplicate content analysis complete!' });
  break;

case 'site-structure':
  visualizeSiteStructure();
  sendResponse({ success: true, message: 'Site structure generated!' });
  break;

case 'maps-scraper':
  scrapeGoogleMaps();
  sendResponse({ success: true, message: 'Google Maps scraper ready!' });
  break;

case 'citation-finder':
  findLocalCitations();
  sendResponse({ success: true, message: 'Citation opportunities found!' });
  break;

case 'seo-dashboard':
  showSEODashboard();
  sendResponse({ success: true, message: 'SEO Dashboard opened!' });
  break;
      // --- NEW FEATURES ADDED HERE ---
      case 'keyword-density':
        analyzeKeywordDensity();
        sendResponse({ success: true, message: 'Keyword density analysis opened!' });
        break;
      
      case 'serp-preview':
        showSerpPreview();
        sendResponse({ success: true, message: 'SERP Preview opened!' });
        break;
      
      case 'broken-links':
        checkBrokenLinks();
        sendResponse({ success: true, message: 'Checking broken links... This may take a moment.' });
        break;
        // Add this inside your switch(action) block
      case 'full-page-capture':
        captureFullPage();
        sendResponse({ success: true, message: 'Starting full page capture...' });
        break;
      case 'bulk-google-domains':
        extractBulkGoogleDomains();
        sendResponse({ success: true, message: 'Starting Deep Google Domain Extraction...' });
        break;
      // -------------------------------
      case 'metrics':
        showMetricsModal();
        sendResponse({ success: true, message: 'Metrics tools opened!' });
        break;
      
      default:
        sendResponse({ success: false, message: 'Unknown action' });
    }
  } catch (error) {
    console.error('Content script error:', error);
    sendResponse({ success: false, message: error.message });
  }
  
  return true;
});

// Enhanced Universal Copy Function with better error handling
function copyToClipboard(text) {
  return new Promise((resolve, reject) => {
    if (!text || typeof text !== 'string') {
      reject(new Error('Invalid text to copy'));
      return;
    }
    
    // Try modern API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => resolve())
        .catch(() => {
          // Fallback to execCommand
          copyWithExecCommand(text)
            .then(() => resolve())
            .catch(() => reject());
        });
    } else {
      // Use execCommand directly
      copyWithExecCommand(text)
        .then(() => resolve())
        .catch(() => reject());
    }
  });
}

// Enhanced execCommand Fallback with better cleanup
function copyWithExecCommand(text) {
  return new Promise((resolve, reject) => {
    let textarea = null;
    try {
      textarea = document.createElement('textarea');
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
        reject(new Error('execCommand copy failed'));
      }
    } catch (err) {
      if (textarea && textarea.parentNode) {
        document.body.removeChild(textarea);
      }
      reject(err);
    }
  });
}

// Enhanced Notification System
function showNotification(message, type) {
  const notification = document.createElement('div');
  const bgColor = type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#ff9800';
  notification.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 12px 20px;
    background: ${bgColor};
    color: white;
    border-radius: 8px;
    z-index: 99999;
    opacity: 0;
    transition: opacity 0.3s;
    font-size: 13px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  `;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => notification.style.opacity = '1', 10);
  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => {
      if (notification.parentNode) {
        document.body.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// Enhanced Modal Creation
function createModal(title, content) {
  const container = document.createElement('div');
  container.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.7);
    z-index: 99998;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    transition: opacity 0.3s;
  `;
  
  const form = document.createElement('div');
  form.style.cssText = `
    background: #fff;
    padding: 20px;
    border-radius: 12px;
    max-width: 500px;
    width: 90%;
    max-height: 85vh;
    overflow-y: auto;
    position: relative;
    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  `;
  
  const titleEl = document.createElement('h2');
  titleEl.textContent = title;
  titleEl.style.cssText = 'margin-bottom: 20px; text-align: center; color: #667eea; font-size: 18px; font-weight: 600;';
  form.appendChild(titleEl);
  
  const closeBtn = document.createElement('button');
  closeBtn.textContent = '×';
  closeBtn.style.cssText = `
    position: absolute;
    top: 10px;
    right: 10px;
    background: #f0f0f0;
    border: none;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 18px;
    color: #666;
    transition: background 0.2s;
  `;
  closeBtn.onmouseover = () => closeBtn.style.background = '#e0e0e0';
  closeBtn.onmouseout = () => closeBtn.style.background = '#f0f0f0';
  closeBtn.onclick = () => {
    container.style.opacity = '0';
    setTimeout(() => {
      if (container.parentNode) {
        document.body.removeChild(container);
      }
    }, 300);
  };
  form.appendChild(closeBtn);
  
  form.appendChild(content);
  container.appendChild(form);
  document.body.appendChild(container);
  
  setTimeout(() => container.style.opacity = '1', 10);
  
  return { container, form, close: () => closeBtn.click() };
}

// Enhanced Input Field Creation
function createInputField(label, id, placeholder, required, type, defaultValue) {
  const wrapper = document.createElement('div');
  wrapper.style.marginBottom = '12px';
  
  const labelEl = document.createElement('label');
  labelEl.textContent = label + (required ? ' *' : '');
  labelEl.style.cssText = `
    display: block;
    font-weight: ${required ? '600' : '400'};
    margin-bottom: 5px;
    color: #333;
    font-size: 13px;
  `;
  wrapper.appendChild(labelEl);
  
  const input = document.createElement('input');
  input.type = type || 'text';
  input.id = id;
  input.placeholder = placeholder || '';
  input.value = defaultValue || '';
  input.style.cssText = `
    width: 100%;
    padding: 10px 12px;
    border: ${required ? '2px solid #ccc' : '1px solid #ddd'};
    border-radius: 6px;
    box-sizing: border-box;
    font-size: 13px;
    transition: border-color 0.2s;
  `;
  input.onfocus = () => {
    input.style.borderColor = '#667eea';
    input.style.outline = 'none';
  };
  input.onblur = () => {
    input.style.borderColor = required ? '#ccc' : '#ddd';
  };
  wrapper.appendChild(input);
  
  return { wrapper, input };
}

// Enhanced Button Creation
function createButton(text, onClick, color) {
  const btn = document.createElement('button');
  btn.textContent = text;
  btn.style.cssText = `
    margin-top: 15px;
    padding: 12px 20px;
    background: ${color || '#4CAF50'};
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    width: 100%;
    font-size: 14px;
    font-weight: 500;
    transition: transform 0.2s, box-shadow 0.2s;
  `;
  btn.onmouseover = () => {
    btn.style.transform = 'translateY(-2px)';
    btn.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
  };
  btn.onmouseout = () => {
    btn.style.transform = 'translateY(0)';
    btn.style.boxShadow = 'none';
  };
  btn.onclick = onClick;
  return btn;
}

// Enhanced generateUrlSlug with better error handling
function generateUrlSlug() {
  const input = prompt('Enter text to generate a clean URL slug:', document.title || '');
  if (!input) return;
  
  const slug = input.trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  
  copyToClipboard(slug).then(() => {
    showNotification('Slug copied: ' + slug, 'success');
  }).catch(() => {
    showNotification('Slug generated: ' + slug, 'success');
  });
}

// Enhanced generateWhatsappLink with validation
function generateWhatsappLink() {
  const sel = window.getSelection ? window.getSelection().toString().trim() : '';
  let num = sel || prompt('Enter phone number in international format (e.g., 842862705825):', '');
  if (!num) return;
  
  num = num.replace(/[^\d]/g, '');
  if (!num || num.length < 10) {
    showNotification('Please enter a valid phone number with country code', 'error');
    return;
  }
  
  const url = 'https://wa.me/' + num;
  window.open(url, '_blank');
  copyToClipboard(url).then(() => {
    showNotification('WhatsApp link generated and copied!', 'success');
  }).catch(() => {
    showNotification('WhatsApp link opened!', 'success');
  });
}

// Enhanced extractEmails with sanitization
function extractEmails() {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const pageText = document.body.textContent || '';
  const emails = [...new Set(pageText.match(emailRegex) || [])];
  
  if (emails.length === 0) {
    showNotification('No emails found', 'error');
    return;
  }
  
  const newWindow = window.open('', '_blank');
  const escapedEmails = emails.map(e => e.replace(/'/g, "\\'"));
  let html = `<!DOCTYPE html>
  <html>
  <head>
    <title>Extracted Emails</title>
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        padding: 20px;
        background: #f9fafb;
        margin: 0;
      }
      h1 {
        color: #1a202c;
        font-size: 24px;
        margin-bottom: 20px;
      }
      ul {
        list-style: none;
        padding: 0;
      }
      li {
        margin: 8px 0;
        padding: 10px;
        background: #f0f4f8;
        border-radius: 6px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        word-break: break-all;
      }
      button {
        background: #4CAF50;
        color: white;
        border: none;
        padding: 6px 12px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        margin-left: 10px;
        flex-shrink: 0;
      }
      button:hover {
        background: #45a049;
      }
      .counter {
        color: #666;
        margin-bottom: 15px;
      }
    </style>
  </head>
  <body>
    <h1>Extracted Emails</h1>
    <div class="counter">Found ${emails.length} email(s)</div>
    <ul>`;
  
  emails.forEach(email => {
    const escapedEmail = email.replace(/'/g, "\\'");
    html += `
      <li>
        <span style="flex:1;">${escapeHtml(email)}</span>
        <button onclick="copyToClipboard('${escapedEmail}')">Copy</button>
      </li>`;
  });
  
  html += `
    </ul>
    <script>
      function copyToClipboard(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(() => {
            alert('Copied: ' + text);
          }).catch(() => {
            prompt('Copy this email:', text);
          });
        } else {
          prompt('Copy this email:', text);
        }
      }
    </script>
  </body>
  </html>`;
  
  newWindow.document.write(html);
  newWindow.document.close();
}

// Helper function to escape HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Enhanced extractSocialLinks with better deduplication
function extractSocialLinks() {
  const socialDomains = {
    'facebook.com': 'Facebook',
    'twitter.com': 'Twitter',
    'instagram.com': 'Instagram',
    'linkedin.com': 'LinkedIn',
    'youtube.com': 'YouTube',
    'pinterest.com': 'Pinterest',
    'tiktok.com': 'TikTok'
  };
  
  const anchors = document.querySelectorAll('a');
  const socialLinksMap = new Map();
  
  anchors.forEach(anchor => {
    try {
      const url = new URL(anchor.href);
      const domain = url.hostname.replace(/^www\./, '');
      if (socialDomains[domain] && !socialLinksMap.has(anchor.href)) {
        socialLinksMap.set(anchor.href, { platform: socialDomains[domain], url: anchor.href });
      }
    } catch (e) {
      // Ignore invalid URLs
    }
  });
  
  const uniqueLinks = Array.from(socialLinksMap.values());
  
  if (uniqueLinks.length === 0) {
    showNotification('No social links found', 'error');
    return;
  }
  
  const newWindow = window.open('', '_blank');
  let html = `<!DOCTYPE html>
  <html>
  <head>
    <title>Social Links</title>
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        padding: 20px;
        background: #f9fafb;
        margin: 0;
      }
      h1 {
        color: #1a202c;
        font-size: 24px;
        margin-bottom: 20px;
      }
      ul {
        list-style: none;
        padding: 0;
      }
      li {
        margin: 8px 0;
        padding: 10px;
        background: #f0f4f8;
        border-radius: 6px;
        word-break: break-all;
      }
      a {
        color: #007BFF;
        text-decoration: none;
      }
      a:hover {
        text-decoration: underline;
      }
      .platform {
        font-weight: 600;
        color: #333;
        margin-right: 10px;
      }
    </style>
  </head>
  <body>
    <h1>Social Media Links</h1>
    <div class="counter">Found ${uniqueLinks.length} link(s)</div>
    <ul>`;
  
  uniqueLinks.forEach(link => {
    html += `<li><span class="platform">${escapeHtml(link.platform)}:</span> <a href="${escapeHtml(link.url)}" target="_blank">${escapeHtml(link.url)}</a></li>`;
  });
  
  html += `</ul></body></html>`;
  newWindow.document.write(html);
  newWindow.document.close();
}

// Enhanced extractLinks with better formatting
function extractLinks() {
  const anchors = document.querySelectorAll('a');
  const linkData = [];
  const seenLinks = new Set();
  const currentDomain = window.location.hostname;
  
  anchors.forEach(anchor => {
    const href = anchor.href;
    const text = (anchor.textContent || anchor.innerText || '').trim().replace(/\s+/g, ' ');
    
    if (!href || seenLinks.has(href) || href.startsWith('javascript:') || href === '#') return;
    
    seenLinks.add(href);
    
    let isExternal = false;
    try {
      isExternal = new URL(href).hostname !== currentDomain;
    } catch (e) {
      // Ignore invalid URLs
    }
    
    linkData.push({ href: href, text: text.substring(0, 100), isExternal: isExternal });
  });
  
  const newWindow = window.open('', 'Link Extractor', 'width=900,height=700');
  let html = `<!DOCTYPE html>
  <html>
  <head>
    <title>Link Extractor</title>
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        padding: 20px;
        background: #f9fafb;
        margin: 0;
      }
      h1 {
        color: #007bff;
        font-size: 24px;
        margin-bottom: 20px;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        background: white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      }
      th, td {
        border: 1px solid #ddd;
        padding: 12px;
        text-align: left;
        vertical-align: top;
      }
      th {
        background: #007bff;
        color: white;
        font-weight: 600;
      }
      .external {
        background: #f1f8ff;
      }
      a {
        color: #007bff;
        text-decoration: none;
        word-break: break-all;
      }
      a:hover {
        text-decoration: underline;
      }
      .counter {
        margin-bottom: 15px;
        color: #666;
      }
    </style>
  </head>
  <body>
    <h1>Extracted Links</h1>
    <div class="counter">Found ${linkData.length} link(s)</div>
    <table>
      <thead>
        <tr>
          <th style="width: 5%">#</th>
          <th style="width: 45%">URL</th>
          <th style="width: 40%">Anchor Text</th>
          <th style="width: 10%">Type</th>
        </tr>
      </thead>
      <tbody>`;
  
  linkData.forEach((link, i) => {
    html += `
      <tr class="${link.isExternal ? 'external' : ''}">
        <td>${i + 1}</td>
        <td><a href="${escapeHtml(link.href)}" target="_blank">${escapeHtml(link.href)}</a></td>
        <td>${escapeHtml(link.text) || '-'}</td>
        <td>${link.isExternal ? 'External' : 'Internal'}</td>
      </tr>`;
  });
  
  html += `
      </tbody>
    </table>
  </body>
  </html>`;
  
  newWindow.document.write(html);
  newWindow.document.close();
}

// Enhanced extractDomains with better filtering
function extractDomains() {
  const anchors = document.querySelectorAll('a');
  const domains = new Set();
  const excludedExtensions = ['.edu', '.gov', '.wordpress', '.blogspot'];
  const excludedKeywords = ['facebook.com', 'twitter.com', 'instagram.com', 'linkedin.com', 'youtube.com'];
  
  anchors.forEach(anchor => {
    try {
      const url = new URL(anchor.href);
      let domain = url.hostname.replace(/^www\./, '');
      
      if (!excludedExtensions.some(ext => domain.endsWith(ext)) &&
          !excludedKeywords.some(keyword => domain.includes(keyword))) {
        domains.add(domain);
      }
    } catch (e) {
      // Ignore invalid URLs
    }
  });
  
  if (domains.size === 0) {
    showNotification('No domains found', 'error');
    return;
  }
  
  const newWindow = window.open('', '_blank');
  const domainList = [...domains].sort().join('\n');
  
  let html = `<!DOCTYPE html>
  <html>
  <head>
    <title>Domains Found</title>
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        padding: 20px;
        background: #f9fafb;
        margin: 0;
      }
      h1 {
        color: #1a202c;
        font-size: 24px;
        margin-bottom: 20px;
      }
      ul {
        list-style: none;
        padding: 0;
      }
      li {
        margin: 8px 0;
        padding: 10px;
        background: #f0f4f8;
        border-radius: 6px;
        font-family: monospace;
        word-break: break-all;
      }
      button {
        background: #4CAF50;
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        margin-bottom: 20px;
      }
      button:hover {
        background: #45a049;
      }
      .counter {
        margin-bottom: 15px;
        color: #666;
      }
    </style>
  </head>
  <body>
    <h1>Extracted Domains</h1>
    <div class="counter">Found ${domains.size} domain(s)</div>
    <button onclick="copyAll()">Copy All Domains</button>
    <ul>`;
  
  domains.forEach(domain => {
    html += `<li>${escapeHtml(domain)}</li>`;
  });
  
  const escapedDomainList = domainList.replace(/'/g, "\\'");
  html += `
    </ul>
    <script>
      function copyAll() {
        const text = '${escapedDomainList}';
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(() => {
            alert('Copied ' + ${domains.size} + ' domains!');
          }).catch(() => {
            prompt('Copy these domains:', text);
          });
        } else {
          prompt('Copy these domains:', text);
        }
      }
    </script>
  </body>
  </html>`;
  
  newWindow.document.write(html);
  newWindow.document.close();
}

// Enhanced findBlogPage with Promise.all
function findBlogPage() {
  const blogPaths = ['/blog', '/blogs', '/news', '/articles'];
  const baseUrl = window.location.origin;
  let found = false;
  
  Promise.all(blogPaths.map(path => 
    fetch(baseUrl + path, { method: 'HEAD', cache: 'no-cache' })
      .then(response => response.ok ? baseUrl + path : null)
      .catch(() => null)
  )).then(results => {
    const foundUrl = results.find(url => url !== null);
    if (foundUrl) {
      window.location.href = foundUrl;
    } else {
      showNotification('No blog page found', 'error');
    }
  });
}

// Enhanced findGuestPostPages with better error handling
function findGuestPostPages() {
  const paths = ['/write-for-us', '/contribute', '/guest-post', '/submit-article', '/become-a-contributor'];
  const baseUrl = window.location.origin;
  const results = [];
  
  Promise.all(paths.map(path => 
    fetch(baseUrl + path, { method: 'HEAD', cache: 'no-copy' })
      .then(response => {
        if (response.ok) results.push(baseUrl + path);
      })
      .catch(() => {})
  )).then(() => {
    if (results.length > 0) {
      if (results.length === 1) {
        window.location.href = results[0];
      } else {
        const choice = prompt('Guest posting pages found:\n' + results.map((r, i) => (i + 1) + ': ' + r).join('\n') + '\n\nEnter number to visit:');
        if (choice && results[choice - 1]) {
          window.location.href = results[choice - 1];
        }
      }
    } else {
      showNotification('No guest post pages found', 'error');
    }
  });
}

// Enhanced fillContactForm with better field detection
function fillContactForm(settings) {
  const data = {
    fullName: settings.userName || 'Jonathan Harris',
    email: settings.userEmail || 'jonathn.p.harris@gmail.com',
    phone: settings.userPhone || '9928524796',
    linkedin: settings.userLinkedin || '',
    message: 'I hope this message finds you well! I am interested in contributing to your website.'
  };
  
  function setVal(el, val) {
    if (!el) return;
    if (el.value && el.value.trim() !== '') return;
    el.value = val;
    ['input', 'change', 'blur'].forEach(e => el.dispatchEvent(new Event(e, { bubbles: true })));
  }
  
  function matches(el, keywords) {
    const text = ((el.name || '') + (el.id || '') + (el.placeholder || '') + (el.getAttribute('aria-label') || '')).toLowerCase();
    return keywords.some(k => text.includes(k));
  }
  
  const inputs = document.querySelectorAll('input, textarea, select');
  let filledCount = 0;
  
  inputs.forEach(el => {
    const t = (el.type || '').toLowerCase();
    if (t === 'hidden' || t === 'submit' || t === 'button' || t === 'file') return;
    
    if (t === 'email' || matches(el, ['email', 'mail', 'e-mail'])) {
      setVal(el, data.email);
      filledCount++;
    } else if (t === 'tel' || matches(el, ['phone', 'mobile', 'contact', 'cell'])) {
      setVal(el, data.phone);
      filledCount++;
    } else if (matches(el, ['name', 'full name', 'author', 'your name', 'fullname'])) {
      setVal(el, data.fullName);
      filledCount++;
    } else if (matches(el, ['linkedin', 'social', 'profile', 'url'])) {
      setVal(el, data.linkedin);
      filledCount++;
    } else if (el.tagName === 'TEXTAREA' || matches(el, ['message', 'comment', 'body', 'query', 'inquiry'])) {
      setVal(el, data.message);
      filledCount++;
    }
  });
  
  showNotification(`Contact form filled! (${filledCount} field${filledCount !== 1 ? 's' : ''})`, 'success');
}

// Enhanced showSearchOperators with better UI
function showSearchOperators() {
  const content = document.createElement('div');
  
  const select = document.createElement('select');
  select.style.cssText = 'width: 100%; padding: 10px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 13px;';
  select.innerHTML = `
    <option value="">Default (site:)</option>
    <option value="intitle:">Title Search (intitle:)</option>
    <option value="inurl:">URL Search (inurl:)</option>
    <option value="allintitle:">All in Title (allintitle:)</option>
    <option value="allinurl:">All in URL (allinurl:)</option>
    <option value="intext:">Text Search (intext:)</option>
  `;
  content.appendChild(select);
  
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Enter search query...';
  input.style.cssText = 'width: 100%; padding: 10px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 13px;';
  content.appendChild(input);
  
  const exampleDiv = document.createElement('div');
  exampleDiv.style.cssText = 'font-size: 11px; color: #666; margin-bottom: 10px; padding: 8px; background: #f5f5f5; border-radius: 6px;';
  exampleDiv.innerHTML = '<strong>Examples:</strong> "shopping tips", "guest post guidelines", "write for us"';
  content.appendChild(exampleDiv);
  
  content.appendChild(createButton('Search on Google', () => {
    const query = input.value.trim();
    const operator = select.value;
    const site = window.location.hostname;
    let searchUrl = 'https://www.google.com/search?q=';
    
    if (operator) {
      searchUrl += operator + encodeURIComponent(query) + '+site:' + site;
    } else {
      searchUrl += 'site:' + site + '+' + encodeURIComponent(query);
    }
    
    window.open(searchUrl, '_blank');
  }));
  
  createModal('Search Operators', content);
}

// Enhanced goToNextPage with more selectors
function goToNextPage() {
  const nextSelectors = [
    'a[aria-label="Next page"]',
    'a[aria-label="Next"]',
    'a#pnnext',
    'a.next',
    'a[rel="next"]',
    'a:contains("Next")',
    'button:contains("Next")'
  ];
  
  let nextButton = null;
  for (const selector of nextSelectors) {
    nextButton = document.querySelector(selector);
    if (nextButton) break;
  }
  
  if (nextButton) {
    nextButton.click();
    showNotification('Navigating to next page...', 'success');
  } else {
    showNotification('No next page button found', 'error');
  }
}

// Enhanced Payment Form with better variable handling
function showPaymentForm(type, settings, templates) {
  const content = document.createElement('div');
  const fields = [];
  const inputs = {};
  
  const defaults = {
    currency: settings.defaultCurrency || 'USD',
    amount: settings.defaultAmount || '50',
    yourName: settings.userName || 'Jonathan Harris'
  };
  
  if (type === 'advance') {
    fields.push(
      { label: 'Client Account', id: 'account', placeholder: 'e.g. ABC Media', required: true },
      { label: 'Paypal Account Name', id: 'paypalName', placeholder: 'name@example.com', required: true },
      { label: 'Paypal Details / Invoice', id: 'paypalDetails', placeholder: 'INV-123', required: true },
      { label: 'Amount', id: 'amount', placeholder: '30', required: true, defaultValue: defaults.amount },
      { label: 'Currency', id: 'currency', placeholder: 'USD, GBP, PESO', required: true, defaultValue: defaults.currency },
      { label: 'Article Title', id: 'articleTitle', placeholder: '5 Shopping Tips...', required: false },
      { label: 'Website', id: 'website', placeholder: 'example.com', required: true },
      { label: 'Your Name', id: 'yourName', placeholder: 'Your Name', required: true, defaultValue: defaults.yourName }
    );
  } else if (type === 'paypal') {
    fields.push(
      { label: 'Your Name', id: 'yourName', placeholder: 'Your Name', required: true, defaultValue: defaults.yourName },
      { label: 'Client Account', id: 'clientAccount', placeholder: '[CLIENT ACCOUNT]', required: true },
      { label: 'Paypal Account Name', id: 'paypalAccountName', placeholder: 'N/A', required: false },
      { label: 'Paypal Invoice', id: 'paypalInvoice', placeholder: 'N/A', required: false },
      { label: 'Amount', id: 'amount', placeholder: 'N/A', required: true, defaultValue: defaults.amount },
      { label: 'Currency', id: 'currency', placeholder: 'USD', required: true, defaultValue: defaults.currency },
      { label: 'Article Title', id: 'articleTitle', placeholder: 'N/A', required: false },
      { label: 'Website URL', id: 'website', placeholder: window.location.hostname.replace(/^www\./, ''), required: false },
      { label: 'Published Link', id: 'publishedLink', placeholder: 'N/A', required: false }
    );
  } else if (type === 'gcash') {
    fields.push(
      { label: 'Your Name', id: 'yourName', placeholder: 'Enter your name', required: true, defaultValue: defaults.yourName },
      { label: 'Client Account', id: 'clientAccount', placeholder: '[CLIENT ACCOUNT]', required: true },
      { label: 'Gcash Account Name', id: 'gcashName', placeholder: 'N/A', required: true },
      { label: 'Gcash Account Number', id: 'gcashNumber', placeholder: 'N/A', required: true },
      { label: 'Amount', id: 'amount', placeholder: 'N/A', required: true, defaultValue: defaults.amount },
      { label: 'Article Title', id: 'articleTitle', placeholder: 'N/A', required: false },
      { label: 'Website URL', id: 'website', placeholder: window.location.hostname.replace(/^www\./, ''), required: false },
      { label: 'Published Link', id: 'publishedLink', placeholder: 'N/A', required: false }
    );
  }
  
  fields.forEach(field => {
    const { wrapper, input } = createInputField(field.label, field.id, field.placeholder, field.required, 'text', field.defaultValue || '');
    content.appendChild(wrapper);
    inputs[field.id] = input;
  });
  
  const generateBtn = createButton('Generate Email', () => {
    let email = '';
    const getVal = (id) => {
      const input = inputs[id];
      return input && input.value ? input.value.trim() : 'N/A';
    };
    
    if (type === 'advance') {
      email = `Hi Ms. Rose,

This is an Advance Paypal payment request for ${getVal('account')} account.

Paypal Account Name: ${getVal('paypalName')}
Paypal Details: ${getVal('paypalDetails')}
Amount: ${getVal('amount')}
Currency: ${getVal('currency')}
Article Title: ${getVal('articleTitle')}
Website: ${getVal('website')}

Regards,
${getVal('yourName')}`;
    } else if (type === 'paypal') {
      email = `Hi Ms. Rose,

This is a Paypal payment request for the ${getVal('clientAccount')} account.

Amount: ${getVal('amount')}
Currency: ${getVal('currency')}
Article Title: ${getVal('articleTitle')}
Website: ${getVal('website')}
Published Link: ${getVal('publishedLink')}

Regards,
${getVal('yourName')}`;
    } else if (type === 'gcash') {
      email = `Hi Ms. Rose,

This is a Gcash payment request for the ${getVal('clientAccount')}.

Gcash Account Name: ${getVal('gcashName')}
Gcash Account Number: ${getVal('gcashNumber')}
Amount: ${getVal('amount')}
Article Title: ${getVal('articleTitle')}
Website: ${getVal('website')}

Regards,
${getVal('yourName')}`;
    }
    
    copyToClipboard(email).then(() => {
      showNotification('Email copied to clipboard!', 'success');
    }).catch(() => {
      const copied = prompt('Copy this email:', email);
      if (copied !== null) {
        showNotification('Email ready to copy', 'success');
      }
    });
  });
  
  content.appendChild(generateBtn);
  
  const titles = {
    'advance': 'Advance Payment Request',
    'paypal': 'PayPal Payment Request',
    'gcash': 'GCash Payment Request'
  };
  
  createModal(titles[type] || 'Payment Request', content);
}

// Enhanced Article Form with preserved templates
function showArticleForm(type, settings, templates) {
  const content = document.createElement('div');
  const inputs = {};
  const defaults = {
    yourName: settings.userName || 'Jonathan Harris'
  };
  
  if (type === 'full') {
    [
      { label: 'Your Name', id: 'yourName', placeholder: 'Enter Your Name', required: true, defaultValue: defaults.yourName },
      { label: "Webmaster's Name", id: 'webmaster', placeholder: 'Enter Webmaster Name', required: true },
      { label: 'Website URL', id: 'website', placeholder: 'https://example.com', required: true },
      { label: 'Payment Amount', id: 'amount', placeholder: '$500', required: true },
      { label: 'Article Title for URL Slug', id: 'articleTitle', placeholder: 'How to Create Bookmarklets', required: true }
    ].forEach(field => {
      const { wrapper, input } = createInputField(field.label, field.id, field.placeholder, field.required, 'text', field.defaultValue || '');
      content.appendChild(wrapper);
      inputs[field.id] = input;
    });
    
    content.appendChild(createButton('Generate Email', () => {
      const getVal = (id) => {
        const input = inputs[id];
        return input && input.value ? input.value.trim() : '';
      };
      const slug = getVal('articleTitle').toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
      
      const email = `Hi ${getVal('webmaster')},

The article is ready for publication on ${getVal('website')}.
Payment: ${getVal('amount')}
URL Slug: ${slug}

Guidelines:
- Do-follow link
- No sponsored tags
- Article must remain active for 12 months
- Publication TAT: 24-48hrs

Regards,
${getVal('yourName')}`;
      
      copyToClipboard(email).then(() => {
        showNotification('Email copied!', 'success');
      }).catch(() => {
        const copied = prompt('Copy this email:', email);
        if (copied !== null) {
          showNotification('Email ready to copy', 'success');
        }
      });
    }));
  } else {
    [
      { label: 'Webmaster Name', id: 'webmasterName', placeholder: 'John Doe', required: true },
      { label: 'Website', id: 'website', placeholder: 'example.com', required: true },
      { label: 'Your Name', id: 'yourName', placeholder: 'Your Name', required: true, defaultValue: defaults.yourName }
    ].forEach(field => {
      const { wrapper, input } = createInputField(field.label, field.id, field.placeholder, field.required, 'text', field.defaultValue || '');
      content.appendChild(wrapper);
      inputs[field.id] = input;
    });
    
    content.appendChild(createButton('Generate Email', () => {
      const getVal = (id) => {
        const input = inputs[id];
        return input && input.value ? input.value.trim() : '';
      };
      const email = `Hi ${getVal('webmasterName')},

Attached is another article for publication on ${getVal('website')}, under the same terms.

Regards,
${getVal('yourName')}`;
      
      copyToClipboard(email).then(() => {
        showNotification('Email copied!', 'success');
      }).catch(() => {
        const copied = prompt('Copy this email:', email);
        if (copied !== null) {
          showNotification('Email ready to copy', 'success');
        }
      });
    }));
  }
  
  createModal(type === 'full' ? 'Sending Article' : 'Quick Article', content);
}

// Enhanced Followup Form with preserved templates
function showFollowupForm(type, settings, templates) {
  const content = document.createElement('div');
  const { wrapper, input } = createInputField('Website', 'website', 'example.com', true);
  content.appendChild(wrapper);
  
  let title = 'Follow-up';
  let emailTemplate = '';
  
  if (type === 1) {
    title = 'Article Follow-up';
    emailTemplate = `Hi,

Just checking in to see if you've had a chance to review the article I sent for {{website}}.

Looking forward to your feedback.`;
  } else if (type === 2) {
    title = '2nd Follow-up';
    emailTemplate = `Hi,

I wanted to follow up on my previous email regarding the article for {{website}}.

Please let me know if you need any additional information.

Thank you.`;
  } else {
    title = 'Final Notice';
    emailTemplate = `Hi,

This is my final follow-up regarding the article for {{website}}.

I'm giving you a 12-hour window to respond before I consider this opportunity closed.

Please let me know your decision ASAP.`;
  }
  
  content.appendChild(createButton('Generate Message', () => {
    const website = input.value.trim() || '[Website]';
    const email = emailTemplate.replace('{{website}}', website);
    copyToClipboard(email).then(() => {
      showNotification('Message copied!', 'success');
    }).catch(() => {
      const copied = prompt('Copy this message:', email);
      if (copied !== null) {
        showNotification('Message ready to copy', 'success');
      }
    });
  }));
  
  createModal(title, content);
}

// Enhanced Cancel Form with preserved template
function showCancelForm(settings, templates) {
  const content = document.createElement('div');
  const inputs = {};
  
  const { wrapper: w1, input: websiteInput } = createInputField('Website', 'website', 'example.com', true);
  const { wrapper: w2, input: reasonInput } = createInputField('Reason (Optional)', 'reason', 'No response received', false);
  content.appendChild(w1);
  content.appendChild(w2);
  inputs.website = websiteInput;
  inputs.reason = reasonInput;
  
  content.appendChild(createButton('Generate Cancellation', () => {
    const website = inputs.website.value.trim() || '[Website]';
    const reason = inputs.reason.value.trim() || 'due to lack of response';
    
    const email = `Hi,

I am canceling my submission for ${website} ${reason}.

Despite my previous attempts to follow up, I have not received any feedback.

Thank you for your time.`;
    
    copyToClipboard(email).then(() => {
      showNotification('Cancellation notice copied!', 'success');
    }).catch(() => {
      const copied = prompt('Copy this cancellation:', email);
      if (copied !== null) {
        showNotification('Cancellation ready to copy', 'success');
      }
    });
  }, '#f44336'));
  
  createModal('Cancellation Notice', content);
}

// Enhanced copyDeclinedTemplate with preserved template
function copyDeclinedTemplate(settings, templates) {
  const email = `Hi,

Thank you for getting back to me. I really appreciate you taking the time to respond.

I completely understand that you're not currently accepting guest posts. Do you happen to know of any other websites or editors who are open to guest contributions?

Any leads would be greatly appreciated.

Thanks again for your time.`;
  
  copyToClipboard(email).then(() => {
    showNotification('Template copied!', 'success');
  }).catch(() => {
    const copied = prompt('Copy this template:', email);
    if (copied !== null) {
      showNotification('Template ready to copy', 'success');
    }
  });
}

// Enhanced Invoice Form with preserved template
function showInvoiceForm(settings, templates) {
  const content = document.createElement('div');
  const inputs = {};
  
  const { wrapper: w1, input: webmasterInput } = createInputField("Webmaster's Name", 'webmaster', '', true);
  const { wrapper: w2, input: yourNameInput } = createInputField('Your Name', 'yourName', '', true, 'text', settings.userName || 'Jonathan Harris');
  content.appendChild(w1);
  content.appendChild(w2);
  inputs.webmaster = webmasterInput;
  inputs.yourName = yourNameInput;
  
  content.appendChild(createButton('Generate Email', () => {
    const webmaster = inputs.webmaster.value.trim() || '';
    const yourName = inputs.yourName.value.trim() || '';
    
    const email = `Hi ${webmaster},

I'm pleased to confirm that the payment has been successfully processed.

Looking forward to more collaborations!

Regards,
${yourName}`;
    
    copyToClipboard(email).then(() => {
      showNotification('Email copied!', 'success');
    }).catch(() => {
      const copied = prompt('Copy this email:', email);
      if (copied !== null) {
        showNotification('Email ready to copy', 'success');
      }
    });
  }));
  
  createModal('Send Invoice', content);
}

// Enhanced Outreach Templates with preserved content
function showOutreachTemplates(settings, templates) {
  const webmaster = prompt("Enter Webmaster's Name:", 'Webmaster');
  if (!webmaster) return;
  
  const templateList = [
    `Hi ${webmaster} team,

I'm reaching out to ask if you currently accept guest contributions on your website.

Could you share your guidelines and turnaround time?

Thanks!`,
    `Hi ${webmaster} team,

I hope you're doing well! I'm reaching out to see if you're accepting guest post contributions.

If so, I'd be happy to share topic ideas.

Looking forward to your response!`
  ];
  
  const selectedTemplate = templateList[Math.floor(Math.random() * templateList.length)];
  copyToClipboard(selectedTemplate).then(() => {
    showNotification('Outreach template copied!', 'success');
  }).catch(() => {
    const copied = prompt('Copy this template:', selectedTemplate);
    if (copied !== null) {
      showNotification('Template ready to copy', 'success');
    }
  });
}

// Enhanced Negotiation Templates with preserved content
function showNegoTemplates(settings, templates) {
  const templateList = [
    `Hi,

Thank you for your response.

Unfortunately, I cannot afford your guest posting fee. I only have $50 available per article.

I hope you could consider it.

Looking forward to your kind response.`,
    `Hi,

Thank you for getting back to me.

Due to budget constraints, I'm currently able to offer $50 for this contribution.

I hope you might consider it.

Looking forward to your response.`
  ];
  
  const selectedTemplate = templateList[Math.floor(Math.random() * templateList.length)];
  copyToClipboard(selectedTemplate).then(() => {
    showNotification('Negotiation template copied!', 'success');
  }).catch(() => {
    const copied = prompt('Copy this template:', selectedTemplate);
    if (copied !== null) {
      showNotification('Template ready to copy', 'success');
    }
  });
}

// Enhanced extractGoogleDomains with better filtering
function extractGoogleDomains() {
  const anchors = document.querySelectorAll('a');
  const domains = new Set();
  
  const excludedExtensions = ['.edu', '.gov', '.wordpress', '.blogspot'];
  const excludedKeywords = ['facebook.com', 'twitter.com', 'instagram.com', 'linkedin.com', 'youtube.com', 'quora.com', 'reddit.com', 'medium.com'];
  
  anchors.forEach(anchor => {
    try {
      const url = new URL(anchor.href);
      if (url.hostname === 'www.google.com' && (url.pathname === '/url' || url.pathname === '/search')) {
        const params = new URLSearchParams(url.search);
        const resultUrl = params.get('q') || params.get('url');
        if (resultUrl && !resultUrl.startsWith('/')) {
          const domain = new URL(resultUrl).hostname.replace(/^www\./, '');
          if (!excludedExtensions.some(ext => domain.endsWith(ext)) &&
              !excludedKeywords.some(keyword => domain.includes(keyword))) {
            domains.add(domain);
          }
        }
      }
    } catch (e) {
      // Ignore invalid URLs
    }
  });
  
  if (domains.size === 0) {
    showNotification('No Google result domains found', 'error');
    return;
  }
  
  const newWindow = window.open('', '_blank');
  const domainList = [...domains].sort().join('\n');
  const escapedDomainList = domainList.replace(/'/g, "\\'");
  
  let html = `<!DOCTYPE html>
  <html>
  <head>
    <title>Google Domains</title>
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        padding: 20px;
        background: #f9fafb;
        margin: 0;
      }
      h1 {
        color: #1a202c;
        font-size: 24px;
        margin-bottom: 20px;
      }
      button {
        background: #4CAF50;
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        margin-bottom: 20px;
      }
      button:hover {
        background: #45a049;
      }
      pre {
        background: #f0f4f8;
        padding: 15px;
        border-radius: 6px;
        overflow-x: auto;
        font-family: monospace;
        font-size: 13px;
      }
      .counter {
        margin-bottom: 15px;
        color: #666;
      }
    </style>
  </head>
  <body>
    <h1>Domains from Google Results</h1>
    <div class="counter">Found ${domains.size} domain(s)</div>
    <button onclick="copyAll()">Copy All Domains</button>
    <pre>${escapeHtml(domainList)}</pre>
    <script>
      function copyAll() {
        const text = '${escapedDomainList}';
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(() => {
            alert('Copied ' + ${domains.size} + ' domains!');
          }).catch(() => {
            prompt('Copy these domains:', text);
          });
        } else {
          prompt('Copy these domains:', text);
        }
      }
    </script>
  </body>
  </html>`;
  
  newWindow.document.write(html);
  newWindow.document.close();
}

// Enhanced showMetricsModal with confirmation
function showMetricsModal() {
  const domain = window.location.hostname.replace(/^www\./, '');
  const encodedDomain = encodeURIComponent(domain);
  
  if (confirm(`Open SEO tools for ${domain}?`)) {
    const urls = [
      'https://www.semrush.com/free-tools/website-authority-checker/?url=' + encodedDomain,
      'https://websiteseochecker.com/spam-score-checker/?url=' + encodedDomain,
      'https://ahrefs.com/website-authority-checker/?input=' + encodedDomain,
      'https://ahrefs.com/traffic-checker/?input=' + encodedDomain + '&mode=subdomains'
    ];
    
    urls.forEach(url => {
      setTimeout(() => {
        window.open(url, '_blank');
      }, 100);
    });
    
    showNotification('Opening metrics tools...', 'success');
  }
}

// ==================== DO-FOLLOW LINK FUNCTIONS ====================

// Highlight Do-Follow Links (Green)
function highlightDoFollowLinks() {
  const links = document.querySelectorAll('a[href]');
  let doFollowCount = 0;
  let noFollowCount = 0;
  
  // Remove any existing highlights first
  const existingHighlights = document.querySelectorAll('.gdi-dofollow-highlight');
  existingHighlights.forEach(el => {
    el.classList.remove('gdi-dofollow-highlight');
    el.style.removeProperty('background-color');
    el.style.removeProperty('border');
    el.style.removeProperty('box-shadow');
  });
  
  links.forEach(link => {
    const rel = link.getAttribute('rel');
    const isNoFollow = rel && rel.toLowerCase().includes('nofollow');
    
    if (!isNoFollow) {
      doFollowCount++;
      link.classList.add('gdi-dofollow-highlight');
      link.style.backgroundColor = '#ccffcc';
      link.style.border = '2px solid #00aa00';
      link.style.boxShadow = '0 0 3px rgba(0, 170, 0, 0.5)';
      link.style.display = 'inline-block';
      link.style.padding = '2px 4px';
      link.style.borderRadius = '3px';
      link.style.transition = 'all 0.2s';
      
      // Add hover effect
      link.addEventListener('mouseenter', function() {
        this.style.backgroundColor = '#99ff99';
        this.style.border = '2px solid #008800';
      });
      
      link.addEventListener('mouseleave', function() {
        this.style.backgroundColor = '#ccffcc';
        this.style.border = '2px solid #00aa00';
      });
    } else {
      noFollowCount++;
    }
  });
  
  // Create notification with stats
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #333;
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    z-index: 99999;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    opacity: 0;
    transition: opacity 0.3s;
    pointer-events: none;
  `;
  notification.innerHTML = `
    <strong>Link Analysis Complete</strong><br>
    ✅ Do-Follow (Green): ${doFollowCount}<br>
    ⛔ No-Follow: ${noFollowCount}
  `;
  document.body.appendChild(notification);
  
  setTimeout(() => notification.style.opacity = '1', 10);
  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => {
      if (notification.parentNode) {
        document.body.removeChild(notification);
      }
    }, 300);
  }, 5000);
  
  if (doFollowCount === 0 && noFollowCount === 0) {
    showNotification('No links found on this page', 'error');
  } else if (doFollowCount > 0) {
    showNotification(`Highlighted ${doFollowCount} do-follow link${doFollowCount !== 1 ? 's' : ''} in green`, 'success');
  } else {
    showNotification('No do-follow links found on this page', 'warning');
  }
}

// Remove Highlights
function removeHighlights() {
  const highlights = document.querySelectorAll('.gdi-dofollow-highlight');
  highlights.forEach(link => {
    link.classList.remove('gdi-dofollow-highlight');
    link.style.removeProperty('background-color');
    link.style.removeProperty('border');
    link.style.removeProperty('box-shadow');
    link.style.removeProperty('display');
    link.style.removeProperty('padding');
    link.style.removeProperty('border-radius');
    link.style.removeProperty('transition');
  });
  
  showNotification('Highlights removed', 'success');
}

// ==================== SEO ANALYSIS FUNCTIONS ====================

// Check Heading Structure (H1-H6)
function analyzeHeadings() {
  const headings = {
    h1: document.querySelectorAll('h1'),
    h2: document.querySelectorAll('h2'),
    h3: document.querySelectorAll('h3'),
    h4: document.querySelectorAll('h4'),
    h5: document.querySelectorAll('h5'),
    h6: document.querySelectorAll('h6')
  };
  
  const newWindow = window.open('', '_blank');
  let html = `<!DOCTYPE html>
  <html>
  <head>
    <title>Heading Structure Analysis</title>
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        padding: 20px;
        background: #f9fafb;
        margin: 0;
      }
      h1 { color: #1a202c; font-size: 24px; margin-bottom: 20px; }
      .summary { background: white; padding: 15px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
      .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 10px; margin: 10px 0; }
      .error { background: #f8d7da; border-left: 4px solid #dc3545; padding: 10px; margin: 10px 0; }
      .success { background: #d4edda; border-left: 4px solid #28a745; padding: 10px; margin: 10px 0; }
      table { width: 100%; border-collapse: collapse; background: white; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
      th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
      th { background: #4CAF50; color: white; }
      .heading-sample { font-family: monospace; background: #f0f4f8; padding: 5px; margin: 5px 0; border-radius: 4px; }
    </style>
  </head>
  <body>
    <h1>Heading Structure Analysis</h1>
    <div class="summary">`;
  
  // Check for H1 issues
  if (headings.h1.length === 0) {
    html += '<div class="error">❌ ERROR: No H1 tag found on the page!</div>';
  } else if (headings.h1.length > 1) {
    html += `<div class="warning">⚠️ WARNING: Multiple H1 tags found (${headings.h1.length}). Only one H1 is recommended.</div>`;
  } else {
    html += '<div class="success">✅ Good: Exactly one H1 tag found.</div>';
  }
  
  // Heading count summary
  html += `<div class="heading-sample"><strong>Heading Count:</strong><br>`;
  for (let i = 1; i <= 6; i++) {
    const count = headings[`h${i}`].length;
    if (count > 0) {
      html += `H${i}: ${count} `;
    }
  }
  html += `</div>`;
  
  html += `</div>
    <h2>Detailed Heading Structure</h2>
    <table>
      <thead>
        <tr><th>Heading Type</th><th>Count</th><th>Samples (First 3)</th></tr>
      </thead>
      <tbody>`;
  
  for (let i = 1; i <= 6; i++) {
    const elements = headings[`h${i}`];
    if (elements.length > 0) {
      const samples = Array.from(elements).slice(0, 3).map(el => el.textContent.trim().substring(0, 100));
      html += `
        <tr>
          <td><strong>H${i}</strong></td>
          <td>${elements.length}</td>
          <td>${samples.map(s => `<div class="heading-sample">${escapeHtml(s)}</div>`).join('')}</td>
        </tr>`;
    }
  }
  
  html += `
      </tbody>
    </table>
  </body>
  </html>`;
  
  newWindow.document.write(html);
  newWindow.document.close();
}

// Check Meta Tags (Title, Description, Keywords)
function analyzeMetaTags() {
  const title = document.querySelector('title');
  const metaDescription = document.querySelector('meta[name="description"]');
  const metaKeywords = document.querySelector('meta[name="keywords"]');
  const robots = document.querySelector('meta[name="robots"]');
  const canonical = document.querySelector('link[rel="canonical"]');
  const viewport = document.querySelector('meta[name="viewport"]');
  
  const newWindow = window.open('', '_blank');
  let html = `<!DOCTYPE html>
  <html>
  <head>
    <title>Meta Tags Analysis</title>
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        padding: 20px;
        background: #f9fafb;
        margin: 0;
      }
      h1 { color: #1a202c; font-size: 24px; margin-bottom: 20px; }
      .card { background: white; padding: 15px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
      .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 10px; margin: 10px 0; }
      .error { background: #f8d7da; border-left: 4px solid #dc3545; padding: 10px; margin: 10px 0; }
      .success { background: #d4edda; border-left: 4px solid #28a745; padding: 10px; margin: 10px 0; }
      .info { background: #d1ecf1; border-left: 4px solid #17a2b8; padding: 10px; margin: 10px 0; }
      .meta-value { background: #f0f4f8; padding: 10px; border-radius: 4px; font-family: monospace; word-break: break-all; margin-top: 5px; }
      .label { font-weight: 600; color: #495057; }
    </style>
  </head>
  <body>
    <h1>Meta Tags Analysis</h1>`;
  
  // Title Analysis
  html += `<div class="card">
    <h3>Title Tag</h3>`;
  if (title) {
    const titleLength = title.textContent.length;
    html += `<div class="meta-value">${escapeHtml(title.textContent)}</div>
    <div>Length: ${titleLength} characters</div>`;
    if (titleLength < 30) {
      html += '<div class="warning">⚠️ Title is too short (recommended: 50-60 characters)</div>';
    } else if (titleLength > 60) {
      html += '<div class="warning">⚠️ Title is too long (recommended: 50-60 characters)</div>';
    } else {
      html += '<div class="success">✅ Title length is good (50-60 characters recommended)</div>';
    }
  } else {
    html += '<div class="error">❌ Missing title tag!</div>';
  }
  html += `</div>`;
  
  // Meta Description Analysis
  html += `<div class="card">
    <h3>Meta Description</h3>`;
  if (metaDescription) {
    const descLength = metaDescription.getAttribute('content').length;
    html += `<div class="meta-value">${escapeHtml(metaDescription.getAttribute('content'))}</div>
    <div>Length: ${descLength} characters</div>`;
    if (descLength < 120) {
      html += '<div class="warning">⚠️ Description is too short (recommended: 150-160 characters)</div>';
    } else if (descLength > 160) {
      html += '<div class="warning">⚠️ Description is too long (recommended: 150-160 characters)</div>';
    } else {
      html += '<div class="success">✅ Description length is good (150-160 characters recommended)</div>';
    }
  } else {
    html += '<div class="error">❌ Missing meta description!</div>';
  }
  html += `</div>`;
  
  // Other Meta Tags
  html += `<div class="card">
    <h3>Other Meta Tags</h3>`;
  html += `<div><span class="label">Meta Keywords:</span> ${metaKeywords ? escapeHtml(metaKeywords.getAttribute('content')) : '<span class="warning">Not set (not critical for SEO)</span>'}</div>`;
  html += `<div><span class="label">Robots:</span> ${robots ? escapeHtml(robots.getAttribute('content')) : '<span class="info">Not set (defaults to index,follow)</span>'}</div>`;
  html += `<div><span class="label">Canonical URL:</span> ${canonical ? `<a href="${escapeHtml(canonical.getAttribute('href'))}" target="_blank">${escapeHtml(canonical.getAttribute('href'))}</a>` : '<span class="warning">Not set (may cause duplicate content issues)</span>'}</div>`;
  html += `<div><span class="label">Viewport:</span> ${viewport ? escapeHtml(viewport.getAttribute('content')) : '<span class="warning">Not set (may affect mobile SEO)</span>'}</div>`;
  html += `</div>`;
  
  html += `</body></html>`;
  newWindow.document.write(html);
  newWindow.document.close();
}

// Check Images Alt Text
function analyzeImages() {
  const images = document.querySelectorAll('img');
  const results = {
    total: images.length,
    withAlt: 0,
    withoutAlt: 0,
    emptyAlt: 0,
    missingAlt: []
  };
  
  images.forEach(img => {
    const alt = img.getAttribute('alt');
    if (alt === null) {
      results.withoutAlt++;
      results.missingAlt.push(img.src || img.getAttribute('data-src') || 'No src attribute');
    } else if (alt === '') {
      results.emptyAlt++;
    } else {
      results.withAlt++;
    }
  });
  
  const newWindow = window.open('', '_blank');
  let html = `<!DOCTYPE html>
  <html>
  <head>
    <title>Images Alt Text Analysis</title>
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        padding: 20px;
        background: #f9fafb;
        margin: 0;
      }
      h1 { color: #1a202c; font-size: 24px; margin-bottom: 20px; }
      .card { background: white; padding: 15px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
      .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 10px; margin: 10px 0; }
      .error { background: #f8d7da; border-left: 4px solid #dc3545; padding: 10px; margin: 10px 0; }
      .success { background: #d4edda; border-left: 4px solid #28a745; padding: 10px; margin: 10px 0; }
      .image-list { max-height: 400px; overflow-y: auto; }
      .image-item { padding: 8px; border-bottom: 1px solid #ddd; font-family: monospace; font-size: 12px; word-break: break-all; }
    </style>
  </head>
  <body>
    <h1>Images Alt Text Analysis</h1>
    <div class="card">
      <h3>Summary</h3>
      <div>Total Images: ${results.total}</div>
      <div class="success">✅ With Alt Text: ${results.withAlt}</div>
      <div class="warning">⚠️ Empty Alt Text: ${results.emptyAlt}</div>
      <div class="error">❌ Missing Alt Text: ${results.withoutAlt}</div>`;
  
  if (results.total > 0) {
    const score = ((results.withAlt / results.total) * 100).toFixed(1);
    html += `<div>Accessibility Score: ${score}%</div>`;
  }
  
  html += `</div>`;
  
  if (results.missingAlt.length > 0) {
    html += `<div class="card">
      <h3>Images Missing Alt Text</h3>
      <div class="image-list">`;
    results.missingAlt.forEach((src, i) => {
      html += `<div class="image-item">${i + 1}. ${escapeHtml(src.substring(0, 100))}</div>`;
    });
    html += `</div></div>`;
  }
  
  html += `</body></html>`;
  newWindow.document.write(html);
  newWindow.document.close();
}

// Check Internal vs External Links
function analyzeLinks() {
  const currentDomain = window.location.hostname;
  const links = document.querySelectorAll('a[href]');
  let internal = 0;
  let external = 0;
  let broken = 0;
  const externalLinks = [];
  
  links.forEach(link => {
    try {
      const url = new URL(link.href, window.location.href);
      if (url.hostname === currentDomain) {
        internal++;
      } else {
        external++;
        if (externalLinks.length < 20) {
          externalLinks.push({ text: link.textContent.trim().substring(0, 50), url: link.href });
        }
      }
    } catch (e) {
      // Invalid URL
    }
  });
  
  const newWindow = window.open('', '_blank');
  let html = `<!DOCTYPE html>
  <html>
  <head>
    <title>Link Analysis</title>
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        padding: 20px;
        background: #f9fafb;
        margin: 0;
      }
      h1 { color: #1a202c; font-size: 24px; margin-bottom: 20px; }
      .card { background: white; padding: 15px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
      .success { background: #d4edda; border-left: 4px solid #28a745; padding: 10px; margin: 10px 0; }
      .info { background: #d1ecf1; border-left: 4px solid #17a2b8; padding: 10px; margin: 10px 0; }
      table { width: 100%; border-collapse: collapse; }
      th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
      th { background: #4CAF50; color: white; }
    </style>
  </head>
  <body>
    <h1>Link Analysis</h1>
    <div class="card">
      <h3>Summary</h3>
      <div>Total Links: ${internal + external}</div>
      <div class="success">✅ Internal Links: ${internal}</div>
      <div class="info">🔗 External Links: ${external}</div>
      <div>Internal/External Ratio: ${internal}:${external}</div>
    </div>`;
  
  if (externalLinks.length > 0) {
    html += `<div class="card">
      <h3>External Links (First 20)</h3>
      <table>
        <thead><tr><th>#</th><th>Anchor Text</th><th>URL</th></tr></thead>
        <tbody>`;
    externalLinks.forEach((link, i) => {
      html += `<tr>
        <td>${i + 1}</td>
        <td>${escapeHtml(link.text || '-')}</td>
        <td><a href="${escapeHtml(link.url)}" target="_blank">${escapeHtml(link.url.substring(0, 80))}</a></td>
      </tr>`;
    });
    html += `</tbody></table></div>`;
  }
  
  html += `</body></html>`;
  newWindow.document.write(html);
  newWindow.document.close();
}

// Check Page Speed Insights (Open Google PageSpeed)
function checkPageSpeed() {
  const url = window.location.href;
  const encodedUrl = encodeURIComponent(url);
  window.open(`https://developers.google.com/speed/pagespeed/insights/?url=${encodedUrl}`, '_blank');
  showNotification('Opening PageSpeed Insights...', 'success');
}

// Check Mobile Friendly Test
function checkMobileFriendly() {
  const url = window.location.href;
  const encodedUrl = encodeURIComponent(url);
  window.open(`https://search.google.com/test/mobile-friendly?url=${encodedUrl}`, '_blank');
  showNotification('Opening Mobile-Friendly Test...', 'success');
}

// Check Structured Data (Schema)
function checkStructuredData() {
  const scripts = document.querySelectorAll('script[type="application/ld+json"]');
  const newWindow = window.open('', '_blank');
  
  let html = `<!DOCTYPE html>
  <html>
  <head>
    <title>Structured Data Analysis</title>
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        padding: 20px;
        background: #f9fafb;
        margin: 0;
      }
      h1 { color: #1a202c; font-size: 24px; margin-bottom: 20px; }
      .card { background: white; padding: 15px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
      .success { background: #d4edda; border-left: 4px solid #28a745; padding: 10px; margin: 10px 0; }
      .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 10px; margin: 10px 0; }
      pre { background: #f0f4f8; padding: 15px; border-radius: 6px; overflow-x: auto; font-size: 12px; }
    </style>
  </head>
  <body>
    <h1>Structured Data Analysis</h1>
    <div class="card">
      <h3>Summary</h3>
      <div>Found ${scripts.length} structured data script(s)</div>`;
  
  if (scripts.length === 0) {
    html += '<div class="warning">⚠️ No structured data found. Consider adding Schema.org markup for better SEO.</div>';
  } else {
    html += '<div class="success">✅ Structured data found! Validate with Google Rich Results Test.</div>';
    html += `<div style="margin-top: 15px;">
      <button onclick="window.open('https://search.google.com/test/rich-results?url=${encodeURIComponent(window.location.href)}', '_blank')" style="padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer;">
        Validate with Rich Results Test
      </button>
    </div>`;
    
    scripts.forEach((script, i) => {
      try {
        const data = JSON.parse(script.textContent);
        html += `<div class="card">
          <h3>Script ${i + 1}</h3>
          <pre>${escapeHtml(JSON.stringify(data, null, 2).substring(0, 1000))}${JSON.stringify(data, null, 2).length > 1000 ? '\n... (truncated)' : ''}</pre>
        </div>`;
      } catch (e) {
        html += `<div class="card">
          <h3>Script ${i + 1}</h3>
          <div class="warning">⚠️ Invalid JSON-LD data</div>
        </div>`;
      }
    });
  }
  
  html += `</div></body></html>`;
  newWindow.document.write(html);
  newWindow.document.close();
}

// Check Robots.txt
function checkRobotsTxt() {
  const domain = window.location.origin;
  window.open(`${domain}/robots.txt`, '_blank');
  showNotification('Opening robots.txt...', 'success');
}

// Check Sitemap
function checkSitemap() {
  const domain = window.location.origin;
  const sitemapUrls = ['/sitemap.xml', '/sitemap_index.xml', '/sitemap.php', '/sitemap.html'];
  
  // Try to find sitemap in robots.txt first
  fetch(`${domain}/robots.txt`)
    .then(response => response.text())
    .then(text => {
      const sitemapMatch = text.match(/Sitemap:\s*(.+)/i);
      if (sitemapMatch) {
        window.open(sitemapMatch[1], '_blank');
        showNotification('Sitemap found in robots.txt', 'success');
        return;
      }
      
      // Try common sitemap locations
      Promise.all(sitemapUrls.map(url => 
        fetch(domain + url, { method: 'HEAD' })
          .then(response => response.ok ? domain + url : null)
          .catch(() => null)
      )).then(results => {
        const found = results.find(url => url !== null);
        if (found) {
          window.open(found, '_blank');
          showNotification('Opening sitemap...', 'success');
        } else {
          showNotification('No sitemap found', 'error');
        }
      });
    })
    .catch(() => {
      showNotification('Could not fetch robots.txt', 'error');
    });
}

// Word Count and Readability
function analyzeContent() {
  const bodyText = document.body.innerText || document.body.textContent;
  const words = bodyText.match(/\b\w+\b/g) || [];
  const wordCount = words.length;
  const paragraphs = document.querySelectorAll('p');
  const avgWordsPerParagraph = paragraphs.length > 0 ? Math.round(wordCount / paragraphs.length) : 0;
  
  // Simple readability score (Flesch Reading Ease approximation)
  const sentences = bodyText.match(/[^.!?]+[.!?]+/g) || [];
  const avgWordsPerSentence = sentences.length > 0 ? Math.round(wordCount / sentences.length) : 0;
  let readabilityScore = 'Unknown';
  if (avgWordsPerSentence < 15) readabilityScore = 'Easy to Read';
  else if (avgWordsPerSentence < 20) readabilityScore = 'Moderate';
  else readabilityScore = 'Difficult to Read';
  
  const newWindow = window.open('', '_blank');
  let html = `<!DOCTYPE html>
  <html>
  <head>
    <title>Content Analysis</title>
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        padding: 20px;
        background: #f9fafb;
        margin: 0;
      }
      h1 { color: #1a202c; font-size: 24px; margin-bottom: 20px; }
      .card { background: white; padding: 15px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
      .metric { font-size: 36px; font-weight: bold; color: #4CAF50; margin: 10px 0; }
      .label { color: #666; font-size: 14px; }
    </style>
  </head>
  <body>
    <h1>Content Analysis</h1>
    <div class="card">
      <div class="metric">${wordCount.toLocaleString()}</div>
      <div class="label">Total Words</div>
    </div>
    <div class="card">
      <div class="metric">${paragraphs.length}</div>
      <div class="label">Paragraphs</div>
      <div>Average ${avgWordsPerParagraph} words per paragraph</div>
    </div>
    <div class="card">
      <div class="metric">${sentences.length}</div>
      <div class="label">Sentences</div>
      <div>Average ${avgWordsPerSentence} words per sentence</div>
      <div>Readability: <strong>${readabilityScore}</strong></div>
    </div>
  </body>
  </html>`;
  
  newWindow.document.write(html);
  newWindow.document.close();
}

// Export All SEO Data
function exportSEOData() {
  const data = {
    url: window.location.href,
    title: document.title,
    metaDescription: document.querySelector('meta[name="description"]')?.getAttribute('content') || '',
    h1: Array.from(document.querySelectorAll('h1')).map(h => h.textContent.trim()),
    wordCount: (document.body.innerText.match(/\b\w+\b/g) || []).length,
    links: {
      total: document.querySelectorAll('a[href]').length,
      internal: 0,
      external: 0
    },
    images: {
      total: document.querySelectorAll('img').length,
      withAlt: 0,
      withoutAlt: 0
    }
  };
  
  // Calculate links
  const currentDomain = window.location.hostname;
  document.querySelectorAll('a[href]').forEach(link => {
    try {
      const url = new URL(link.href, window.location.href);
      if (url.hostname === currentDomain) {
        data.links.internal++;
      } else {
        data.links.external++;
      }
    } catch (e) {}
  });
  
  // Calculate images
  document.querySelectorAll('img').forEach(img => {
    if (img.getAttribute('alt') !== null) {
      data.images.withAlt++;
    } else {
      data.images.withoutAlt++;
    }
  });
  
  const dataStr = JSON.stringify(data, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `seo-data-${window.location.hostname}-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showNotification('SEO data exported!', 'success');
}

// ==================== KEYWORD RANK TRACKER ====================

function keywordRankTracker() {
  const CONFIG = {
    MAX_RESULTS: 100,
    MAX_PAGES: 10,
    REQUEST_DELAY: { min: 600, max: 1000 },
    USER_AGENT: navigator.userAgent
  };

  if (!window.location.hostname.includes('google.')) {
    showNotification('This keyword ranking tool only works on Google search result pages', 'error');
    return;
  }

  const EXCLUDE_PATTERNS = [
    /google\.(com|co\.|ca|de|fr|it|es|co\.uk|com\.au|co\.jp)/i,
    /youtube\.com\/(watch|channel|user|c\/|playlist)/i,
    /youtu\.be\//i,
    /vimeo\.com\//i,
    /dailymotion\.com\//i,
    /maps\.google/i,
    /webcache\.googleusercontent/i,
    /translate\.google/i,
    /books\.google/i,
    /scholar\.google/i,
    /patents\.google/i,
    /support\.google/i,
    /news\.google/i,
    /shopping\.google/i,
    /flights\.google/i,
    /^javascript:/i,
    /^mailto:/i,
    /^tel:/i,
    /\.(jpg|jpeg|png|gif|bmp|webp|svg|ico|tiff)(\?|$)/i,
    /\.(mp4|avi|mov|wmv|flv|webm|mkv)(\?|$)/i,
    /\.(mp3|wav|flac|aac|ogg)(\?|$)/i,
    /\/images\//i,
    /\/video\//i
  ];

  const INVALID_TITLE_PATTERNS = [
    /^Images for /i,
    /^Videos for /i,
    /^News for /i,
    /^Shopping results for /i,
    /^More results/i,
    /^Related searches/i,
    /^People also ask/i,
    /^Sponsored/i,
    /^Ad\s/i,
    /duration:/i,
    /\d+:\d+/i
  ];

  let allResults = [];
  let extractionCancelled = false;
  let targetDomain = '';

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  const getRandomDelay = () => Math.floor(Math.random() * (CONFIG.REQUEST_DELAY.max - CONFIG.REQUEST_DELAY.min + 1)) + CONFIG.REQUEST_DELAY.min;

  function isValidResult(url, title) {
    if (!url || !url.startsWith('http')) return false;
    if (EXCLUDE_PATTERNS.some(pattern => pattern.test(url))) return false;
    if (!title || title.trim() === '') return false;
    if (INVALID_TITLE_PATTERNS.some(pattern => pattern.test(title))) return false;
    return true;
  }

  function cleanGoogleUrl(url) {
    if (url.includes('/url?q=')) {
      const match = url.match(/url\?q=(.+?)&/);
      if (match && match[1]) {
        return decodeURIComponent(match[1]).split('#')[0];
      }
      return null;
    }
    return url.split('&')[0].split('#')[0];
  }

  function extractRankings(doc = document, pageNumber = 1) {
    const containers = doc.querySelectorAll('.MjjYud, .g, .tF2Cxc');
    const seenUrls = new Set(allResults.map(r => r.url));
    const extracted = [];

    containers.forEach((container) => {
      if (allResults.length >= CONFIG.MAX_RESULTS) return;
      
      if (container.closest('#pfa, #botstuff, .ads, #tads, [data-text-ad]')) return;
      
      const containerText = container.textContent.toLowerCase();
      if (containerText.includes('people also ask') ||
          containerText.includes('sponsored') ||
          containerText.includes('ad ·')) return;

      const linkElement = container.querySelector('a[jsname="UWfWsc"], a[data-ved], .yuRUbf a');
      const titleElement = container.querySelector('h3');

      if (!linkElement?.href || !titleElement) return;

      const url = cleanGoogleUrl(linkElement.href);
      if (!url) return;

      const title = titleElement.textContent.trim();

      try {
        const urlObj = new URL(url);
        const domain = urlObj.hostname.replace(/^www\./, '').toLowerCase();

        if (isValidResult(url, title) && !seenUrls.has(url)) {
          const result = {
            rank: allResults.length + 1,
            url,
            domain,
            title,
            page: pageNumber,
            isTarget: targetDomain && domain.includes(targetDomain.toLowerCase())
          };
          
          allResults.push(result);
          extracted.push(result);
          seenUrls.add(url);
        }
      } catch (e) {
        console.warn('Error processing URL:', url);
      }
    });

    return extracted;
  }

  function createStatusDiv() {
    const statusDiv = document.createElement('div');
    statusDiv.id = 'ranking-status';
    statusDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #1a1a1a;
      color: #fff;
      padding: 16px 20px;
      border-radius: 8px;
      z-index: 10000;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      min-width: 320px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.3);
      border-left: 4px solid #4CAF50;
    `;
    
    statusDiv.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <strong style="font-size: 16px;">📊 Keyword Rank Tracker</strong>
        <span style="color: #888;">v2.0</span>
      </div>
      <div id="status-message">Starting ranking analysis...</div>
      <div style="margin-top: 12px; height: 4px; background: #333; border-radius: 2px; overflow: hidden;">
        <div id="status-progress-bar" style="height: 100%; background: #4CAF50; width: 0%; transition: width 0.3s;"></div>
      </div>
      <button onclick="document.getElementById('ranking-status')?.remove()" 
           style="margin-top: 12px; padding: 6px 12px; background: #424242; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">
        Cancel
      </button>
    `;
    
    document.body.appendChild(statusDiv);
    return statusDiv;
  }

  function updateStatus(statusDiv, message, progress = null) {
    if (!statusDiv?.parentNode) return;
    
    const msgEl = statusDiv.querySelector('#status-message');
    const progressBar = statusDiv.querySelector('#status-progress-bar');
    
    if (msgEl) msgEl.textContent = message;
    if (progressBar && progress !== null) {
      progressBar.style.width = `${Math.min(progress, 100)}%`;
    }
  }

  function promptForTargetDomain() {
    return new Promise((resolve) => {
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        z-index: 10001;
        display: flex;
        justify-content: center;
        align-items: center;
      `;
      
      const modal = document.createElement('div');
      modal.style.cssText = `
        background: white;
        padding: 30px;
        border-radius: 12px;
        width: 400px;
        text-align: center;
        box-shadow: 0 16px 48px rgba(0,0,0,0.3);
      `;
      
      modal.innerHTML = `
        <h3 style="margin: 0 0 15px; color: #333;">🎯 Track Keyword Rankings</h3>
        <p style="color: #666; margin-bottom: 20px; font-size: 14px;">
          Enter domain to highlight its ranking position (optional)
        </p>
        <input type="text" id="targetDomainInput" 
             placeholder="e.g., example.com or amazon.com"
             style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 6px; margin-bottom: 20px; font-size: 14px; box-sizing: border-box;">
        <div style="display: flex; gap: 10px; justify-content: center;">
          <button id="skipBtn" style="background: #9e9e9e; color: white; border: none; padding: 10px 24px; border-radius: 6px; cursor: pointer; font-weight: 600;">Skip</button>
          <button id="trackBtn" style="background: #4CAF50; color: white; border: none; padding: 10px 24px; border-radius: 6px; cursor: pointer; font-weight: 600;">Track Rankings</button>
        </div>
      `;
      
      overlay.appendChild(modal);
      document.body.appendChild(overlay);
      
      document.getElementById('trackBtn').onclick = () => {
        targetDomain = document.getElementById('targetDomainInput').value.trim();
        document.body.removeChild(overlay);
        resolve();
      };
      
      document.getElementById('skipBtn').onclick = () => {
        document.body.removeChild(overlay);
        resolve();
      };
      
      document.getElementById('targetDomainInput').onkeydown = (e) => {
        if (e.key === 'Enter') {
          targetDomain = e.target.value.trim();
          document.body.removeChild(overlay);
          resolve();
        }
      };
    });
  }

  async function extractRankingsFromPages() {
    await promptForTargetDomain();
    
    const statusDiv = createStatusDiv();
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');
    
    if (!query) {
      updateStatus(statusDiv, '❌ No search query found in URL');
      setTimeout(() => statusDiv.remove(), 2000);
      return;
    }
    
    updateStatus(statusDiv, `🔍 Analyzing rankings for: "${query}"`, 5);
    extractRankings(document, 1);
    
    let targetRank = allResults.find(r => r.isTarget)?.rank;
    if (targetRank) {
      updateStatus(statusDiv, `📍 Target domain found at position #${targetRank} on page 1`, 15);
    } else {
      updateStatus(statusDiv, `📄 Page 1 complete: ${allResults.length} results`, 15);
    }
    
    for (let page = 2; page <= CONFIG.MAX_PAGES; page++) {
      if (extractionCancelled || allResults.length >= CONFIG.MAX_RESULTS) break;
      
      const start = (page - 1) * 10;
      const nextPageUrl = `${window.location.origin}/search?q=${encodeURIComponent(query)}&start=${start}`;
      const progress = 15 + ((page - 1) * 8);
      
      try {
        const response = await fetch(nextPageUrl, {
          headers: {
            'User-Agent': CONFIG.USER_AGENT,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
          }
        });
        
        if (!response.ok) continue;
        
        const htmlText = await response.text();
        const doc = new DOMParser().parseFromString(htmlText, 'text/html');
        const extracted = extractRankings(doc, page);
        
        const newTargetRank = allResults.find(r => r.isTarget && r.page === page)?.rank;
        if (newTargetRank) {
          updateStatus(statusDiv, `🎯 Target domain found at position #${newTargetRank} on page ${page}!`, progress + 8);
        } else {
          updateStatus(statusDiv, `📄 Page ${page} complete: +${extracted.length} results (Total: ${allResults.length})`, progress + 8);
        }
        
        await delay(getRandomDelay());
      } catch (error) {
        console.error(`Error on page ${page}:`, error);
        await delay(2000);
      }
    }
    
    const targetResults = allResults.filter(r => r.isTarget);
    if (targetResults.length > 0) {
      const ranks = targetResults.map(r => `#${r.rank}`).join(', ');
      updateStatus(statusDiv, `✅ Complete! Target domain found at: ${ranks}`, 100);
    } else if (targetDomain) {
      updateStatus(statusDiv, `❌ Target domain "${targetDomain}" not found in top ${allResults.length} results`, 100);
    } else {
      updateStatus(statusDiv, `✅ Complete! Found ${allResults.length} rankings`, 100);
    }
    
    setTimeout(() => {
      statusDiv.remove();
      showRankingReport();
    }, 2000);
  }

  function showRankingReport() {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.85);
      backdrop-filter: blur(4px);
      z-index: 10000;
      display: flex;
      justify-content: center;
      align-items: center;
    `;
    
    const modal = document.createElement('div');
    modal.style.cssText = `
      background: white;
      padding: 24px;
      border-radius: 12px;
      max-width: 95%;
      width: 1000px;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
    `;
    
    const targetResults = allResults.filter(r => r.isTarget);
    const uniqueDomains = new Set(allResults.map(r => r.domain)).size;
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');
    
    const header = document.createElement('div');
    header.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <div>
          <h2 style="margin:0; font-size: 24px; color: #1a1a1a;">📈 Keyword Ranking Report</h2>
          <p style="margin: 5px 0 0; color: #666; font-size: 14px;">
            ${query || 'No search query'}
          </p>
        </div>
        <div style="display: flex; gap: 8px;">
          <span style="background: #e3f2fd; padding: 4px 12px; border-radius: 20px; font-size: 13px;">
            ${allResults.length} Results
          </span>
          <span style="background: #f3e5f5; padding: 4px 12px; border-radius: 20px; font-size: 13px;">
            ${uniqueDomains} Domains
          </span>
        </div>
      </div>
      ${targetDomain && targetResults.length > 0 ? `
        <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <strong style="color: #2e7d32; font-size: 16px;">🎯 ${targetDomain}</strong>
            <span style="color: #666; margin-left: 10px;">found at position${targetResults.length > 1 ? 's' : ''}:</span>
          </div>
          <div style="display: flex; gap: 8px;">
            ${targetResults.map(r => `
              <span style="background: #4CAF50; color: white; padding: 4px 12px; border-radius: 20px; font-weight: bold;">
                #${r.rank}
              </span>
            `).join('')}
          </div>
        </div>
      ` : targetDomain ? `
        <div style="background: #ffebee; padding: 15px; border-radius: 8px; margin-bottom: 20px; color: #c62828;">
          ❌ ${targetDomain} not found in top ${allResults.length} results
        </div>
      ` : ''}
    `;
    
    const actions = document.createElement('div');
    actions.style.cssText = `
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    `;
    
    const buttons = [
      { id: 'exportCSV', text: '📥 Export Rankings CSV', color: '#4CAF50' },
      { id: 'exportTXT', text: '📄 Export Rank List', color: '#795548' },
      { id: 'copyDomains', text: '📋 Copy All Domains', color: '#2196F3' },
      { id: 'copyRankings', text: '🔢 Copy Ranked List', color: '#FF9800' },
      { id: 'closeReport', text: '✕ Close', color: '#f44336' }
    ];
    
    buttons.forEach(btn => {
      const button = document.createElement('button');
      button.id = btn.id;
      button.textContent = btn.text;
      button.style.cssText = `
        background: ${btn.color};
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
        font-size: 13px;
      `;
      actions.appendChild(button);
    });
    
    const searchBox = document.createElement('input');
    searchBox.type = 'text';
    searchBox.placeholder = '🔍 Filter domains or titles...';
    searchBox.style.cssText = `
      width: 100%;
      padding: 12px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      margin-bottom: 20px;
      font-size: 14px;
      box-sizing: border-box;
    `;
    
    const resultsContainer = document.createElement('div');
    resultsContainer.style.cssText = `
      flex: 1;
      overflow-y: auto;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
    `;
    
    function renderResults(filterText = '') {
      resultsContainer.innerHTML = '';
      const filter = filterText.toLowerCase();
      
      allResults.forEach(result => {
        if (filter && !result.domain.includes(filter) && !result.title.toLowerCase().includes(filter)) {
          return;
        }
        
        const resultDiv = document.createElement('div');
        resultDiv.style.cssText = `
          padding: 12px 16px;
          border-bottom: 1px solid #e0e0e0;
          display: flex;
          gap: 16px;
          ${result.isTarget ? 'background: #f1f8e9;' : ''}
        `;
        
        const rankSpan = document.createElement('span');
        rankSpan.style.cssText = `
          background: ${result.isTarget ? '#4CAF50' : '#2196F3'};
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: bold;
          min-width: 45px;
          text-align: center;
          height: fit-content;
        `;
        rankSpan.textContent = `#${result.rank}`;
        
        const contentDiv = document.createElement('div');
        contentDiv.style.cssText = 'flex: 1;';
        
        const domainDiv = document.createElement('div');
        domainDiv.style.cssText = `
          font-weight: bold;
          color: ${result.isTarget ? '#2e7d32' : '#1976D2'};
          font-size: 16px;
          margin-bottom: 4px;
        `;
        domainDiv.textContent = result.domain;
        
        const metaDiv = document.createElement('div');
        metaDiv.style.cssText = 'font-size: 12px; color: #757575; margin-bottom: 4px;';
        metaDiv.textContent = `Page ${result.page}`;
        
        const titleDiv = document.createElement('div');
        titleDiv.style.cssText = 'color: #333; font-size: 13px; margin-bottom: 4px;';
        titleDiv.textContent = result.title;
        
        const urlDiv = document.createElement('div');
        urlDiv.style.cssText = 'color: #757575; font-size: 11px; word-break: break-all;';
        urlDiv.textContent = result.url;
        
        contentDiv.appendChild(domainDiv);
        contentDiv.appendChild(metaDiv);
        contentDiv.appendChild(titleDiv);
        contentDiv.appendChild(urlDiv);
        resultDiv.appendChild(rankSpan);
        resultDiv.appendChild(contentDiv);
        resultsContainer.appendChild(resultDiv);
      });
    }
    
    renderResults();
    
    searchBox.addEventListener('input', (e) => {
      renderResults(e.target.value);
    });
    
    modal.appendChild(header);
    modal.appendChild(actions);
    modal.appendChild(searchBox);
    modal.appendChild(resultsContainer);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    document.getElementById('exportCSV').onclick = () => {
      const csv = 'Rank,Domain,URL,Title,Page,Target\n' + allResults.map(r => 
        `${r.rank},"${r.domain}","${r.url}","${r.title.replace(/"/g, '""')}",${r.page},${r.isTarget ? 'Yes' : 'No'}`
      ).join('\n');
      downloadFile(csv, 'keyword-rankings.csv', 'text/csv');
      showNotification('CSV exported!', 'success');
    };
    
    document.getElementById('exportTXT').onclick = () => {
      const txt = allResults.map(r => 
        `${r.isTarget ? '🎯 ' : ''}#${r.rank} ${r.domain}`
      ).join('\n');
      downloadFile(txt, 'ranked-domains.txt', 'text/plain');
      showNotification('Rank list exported!', 'success');
    };
    
    document.getElementById('copyDomains').onclick = () => {
      const domains = [...new Set(allResults.map(r => r.domain))].join('\n');
      copyToClipboard(domains).then(() => {
        showNotification(`Copied ${domains.split('\n').length} domains to clipboard!`, 'success');
      });
    };
    
    document.getElementById('copyRankings').onclick = () => {
      const rankings = allResults.map(r => `#${r.rank} ${r.domain}`).join('\n');
      copyToClipboard(rankings).then(() => {
        showNotification(`Copied ${allResults.length} rankings to clipboard!`, 'success');
      });
    };
    
    document.getElementById('closeReport').onclick = () => overlay.remove();
    overlay.onclick = (e) => e.target === overlay && overlay.remove();
  }
  
  function downloadFile(content, filename, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
  
  extractionCancelled = false;
  extractRankingsFromPages();
}

// ==================== ADVANCED SEO TEXT COMPARE TOOL ====================

function advancedSEOCompare() {
  // Create modal overlay
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.95);
    backdrop-filter: blur(8px);
    z-index: 100000;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  `;

  const modal = document.createElement('div');
  modal.style.cssText = `
    background: #fff;
    border-radius: 16px;
    width: 95%;
    max-width: 1400px;
    height: 90vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
  `;

  // Header
  const header = document.createElement('div');
  header.style.cssText = `
    padding: 20px 24px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
  `;
  header.innerHTML = `
    <div>
      <h2 style="margin: 0; font-size: 20px; font-weight: 600;">🔍 Advanced SEO Text Compare</h2>
      <p style="margin: 4px 0 0; opacity: 0.9; font-size: 12px;">Compare content, meta tags, titles, and more with advanced SEO metrics</p>
    </div>
    <button id="closeCompareBtn" style="background: rgba(255,255,255,0.2); border: none; color: white; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; font-size: 20px;">×</button>
  `;

  // Main content area
  const mainContent = document.createElement('div');
  mainContent.style.cssText = `
    flex: 1;
    display: flex;
    overflow: hidden;
  `;

  // Left Panel
  const leftPanel = document.createElement('div');
  leftPanel.style.cssText = `
    flex: 1;
    display: flex;
    flex-direction: column;
    border-right: 1px solid #e0e0e0;
    overflow: hidden;
  `;

  // Right Panel
  const rightPanel = document.createElement('div');
  rightPanel.style.cssText = `
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  `;

  // Toolbar for both panels
  function createPanelToolbar(panelId, title) {
    const toolbar = document.createElement('div');
    toolbar.style.cssText = `
      padding: 12px 16px;
      background: #f8f9fa;
      border-bottom: 1px solid #e0e0e0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 8px;
    `;
    
    toolbar.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px;">
        <strong style="font-size: 14px; color: #333;">${title}</strong>
        <select id="${panelId}-source" style="padding: 4px 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 12px; background: white;">
          <option value="paste">📝 Paste Text</option>
          <option value="selection">📋 Current Selection</option>
          <option value="page">🌐 Entire Page</option>
          <option value="meta-title">🏷️ Meta Title</option>
          <option value="meta-description">📄 Meta Description</option>
          <option value="h1">📊 H1 Heading</option>
          <option value="first-paragraph">📖 First Paragraph</option>
        </select>
        <button id="${panelId}-load" style="padding: 4px 12px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">Load</button>
      </div>
      <div style="display: flex; gap: 8px;">
        <button id="${panelId}-clear" style="padding: 4px 12px; background: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">Clear</button>
        <button id="${panelId}-copy" style="padding: 4px 12px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">Copy</button>
      </div>
    `;
    
    return toolbar;
  }

  // Text area for content
  function createTextArea(panelId) {
    const container = document.createElement('div');
    container.style.cssText = `
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    `;
    
    const textarea = document.createElement('textarea');
    textarea.id = `${panelId}-textarea`;
    textarea.style.cssText = `
      flex: 1;
      padding: 16px;
      border: none;
      resize: none;
      font-family: 'Consolas', 'Monaco', monospace;
      font-size: 13px;
      line-height: 1.6;
      outline: none;
      background: #fff;
    `;
    textarea.placeholder = `Enter or load ${panelId === 'left' ? 'original' : 'comparison'} text here...`;
    
    container.appendChild(textarea);
    return container;
  }

  // Stats display
  function createStatsPanel(panelId) {
    const stats = document.createElement('div');
    stats.id = `${panelId}-stats`;
    stats.style.cssText = `
      padding: 8px 16px;
      background: #f8f9fa;
      border-top: 1px solid #e0e0e0;
      font-size: 11px;
      color: #666;
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    `;
    stats.innerHTML = `
      <span>📊 Characters: 0</span>
      <span>📝 Words: 0</span>
      <span>📏 Sentences: 0</span>
      <span>🔤 Unique Words: 0</span>
      <span>📖 Reading Time: 0 min</span>
    `;
    return stats;
  }

  // Create panels
  const leftToolbar = createPanelToolbar('left', 'Original Text');
  const leftTextArea = createTextArea('left');
  const leftStats = createStatsPanel('left');
  
  const rightToolbar = createPanelToolbar('right', 'Comparison Text');
  const rightTextArea = createTextArea('right');
  const rightStats = createStatsPanel('right');

  leftPanel.appendChild(leftToolbar);
  leftPanel.appendChild(leftTextArea);
  leftPanel.appendChild(leftStats);
  
  rightPanel.appendChild(rightToolbar);
  rightPanel.appendChild(rightTextArea);
  rightPanel.appendChild(rightStats);

  // Comparison Results Panel
  const resultsPanel = document.createElement('div');
  resultsPanel.style.cssText = `
    border-top: 1px solid #e0e0e0;
    background: #f8f9fa;
    max-height: 40%;
    overflow-y: auto;
  `;

  const resultsHeader = document.createElement('div');
  resultsHeader.style.cssText = `
    padding: 12px 16px;
    background: #fff;
    border-bottom: 1px solid #e0e0e0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
  `;
  resultsHeader.innerHTML = `
    <div style="display: flex; align-items: center; gap: 12px;">
      <span id="resultsToggle" style="font-size: 18px;">▼</span>
      <strong>📊 SEO Comparison Results</strong>
      <span id="similarityScore" style="background: #667eea; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px;">0% Similar</span>
    </div>
    <button id="refreshComparison" style="padding: 4px 12px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">Refresh Analysis</button>
  `;

  const resultsContent = document.createElement('div');
  resultsContent.id = 'resultsContent';
  resultsContent.style.cssText = `
    padding: 16px;
    display: block;
  `;

  resultsPanel.appendChild(resultsHeader);
  resultsPanel.appendChild(resultsContent);
  
  // Toggle results panel
  let resultsVisible = true;
  resultsHeader.addEventListener('click', (e) => {
    if (e.target.id !== 'refreshComparison') {
      resultsVisible = !resultsVisible;
      resultsContent.style.display = resultsVisible ? 'block' : 'none';
      document.getElementById('resultsToggle').textContent = resultsVisible ? '▼' : '▶';
    }
  });

  mainContent.appendChild(leftPanel);
  mainContent.appendChild(rightPanel);
  
  modal.appendChild(header);
  modal.appendChild(mainContent);
  modal.appendChild(resultsPanel);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // Helper functions
  function updateStats(panelId, text) {
    const chars = text.length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const uniqueWords = new Set(text.toLowerCase().match(/\b\w+\b/g) || []).size;
    const readingTime = Math.ceil(words / 200); // Average reading speed
    
    const statsDiv = document.getElementById(`${panelId}-stats`);
    if (statsDiv) {
      statsDiv.innerHTML = `
        <span>📊 Characters: ${chars.toLocaleString()}</span>
        <span>📝 Words: ${words.toLocaleString()}</span>
        <span>📏 Sentences: ${sentences.toLocaleString()}</span>
        <span>🔤 Unique Words: ${uniqueWords.toLocaleString()}</span>
        <span>📖 Reading Time: ${readingTime} min</span>
      `;
    }
  }

  function loadContent(panelId, source) {
    const textarea = document.getElementById(`${panelId}-textarea`);
    if (!textarea) return;
    
    let content = '';
    
    switch(source) {
      case 'selection':
        const selection = window.getSelection().toString().trim();
        content = selection || 'No text selected. Please select text on the page.';
        break;
      case 'page':
        content = document.body.innerText || document.body.textContent;
        break;
      case 'meta-title':
        content = document.title || 'No meta title found';
        break;
      case 'meta-description':
        const metaDesc = document.querySelector('meta[name="description"]');
        content = metaDesc ? metaDesc.getAttribute('content') : 'No meta description found';
        break;
      case 'h1':
        const h1 = document.querySelector('h1');
        content = h1 ? h1.textContent : 'No H1 tag found';
        break;
      case 'first-paragraph':
        const firstP = document.querySelector('p');
        content = firstP ? firstP.textContent : 'No paragraph found';
        break;
      case 'paste':
      default:
        return;
    }
    
    textarea.value = content;
    updateStats(panelId, content);
    performComparison();
  }

  // Advanced comparison algorithms
  function calculateSimilarity(text1, text2) {
    if (!text1 || !text2) return 0;
    
    const words1 = new Set(text1.toLowerCase().match(/\b\w+\b/g) || []);
    const words2 = new Set(text2.toLowerCase().match(/\b\w+\b/g) || []);
    
    const intersection = new Set([...words1].filter(x => words2.has(x)));
    const union = new Set([...words1, ...words2]);
    
    return (intersection.size / union.size) * 100;
  }
  
  function calculateKeywordDensity(text, keywords) {
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    const totalWords = words.length;
    const densities = {};
    
    keywords.forEach(keyword => {
      const count = words.filter(w => w === keyword.toLowerCase()).length;
      densities[keyword] = totalWords > 0 ? (count / totalWords) * 100 : 0;
    });
    
    return densities;
  }
  
  function calculateReadabilityScore(text) {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = text.match(/\b\w+\b/g) || [];
    const syllables = words.reduce((count, word) => {
      return count + (word.toLowerCase().match(/[aeiouy]{1,2}/g) || []).length;
    }, 0);
    
    if (sentences.length === 0 || words.length === 0) return 0;
    
    const avgWordsPerSentence = words.length / sentences.length;
    const avgSyllablesPerWord = syllables / words.length;
    
    // Flesch Reading Ease formula
    const score = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);
    return Math.max(0, Math.min(100, score));
  }
  
  function getReadabilityLevel(score) {
    if (score >= 90) return 'Very Easy (5th grade)';
    if (score >= 80) return 'Easy (6th grade)';
    if (score >= 70) return 'Fairly Easy (7th grade)';
    if (score >= 60) return 'Standard (8th-9th grade)';
    if (score >= 50) return 'Fairly Difficult (10th-12th grade)';
    if (score >= 30) return 'Difficult (College)';
    return 'Very Difficult (College Graduate)';
  }
  
  function findKeywordGaps(text1, text2, topN = 10) {
    const words1 = new Set(text1.toLowerCase().match(/\b\w+\b/g) || []);
    const words2 = new Set(text2.toLowerCase().match(/\b\w+\b/g) || []);
    
    const missingInText2 = [...words1].filter(w => !words2.has(w));
    const missingInText1 = [...words2].filter(w => !words1.has(w));
    
    // Get most important keywords (longer words are typically more meaningful)
    const importantMissing1 = missingInText1.sort((a,b) => b.length - a.length).slice(0, topN);
    const importantMissing2 = missingInText2.sort((a,b) => b.length - a.length).slice(0, topN);
    
    return { missingInText1: importantMissing1, missingInText2: importantMissing2 };
  }

  function performComparison() {
    const text1 = document.getElementById('left-textarea')?.value || '';
    const text2 = document.getElementById('right-textarea')?.value || '';
    
    if (!text1 && !text2) {
      resultsContent.innerHTML = '<div style="text-align: center; padding: 40px; color: #999;">Enter text in both panels to see comparison results</div>';
      return;
    }
    
    const similarity = calculateSimilarity(text1, text2);
    const readability1 = calculateReadabilityScore(text1);
    const readability2 = calculateReadabilityScore(text2);
    const keywordGaps = findKeywordGaps(text1, text2);
    
    // Extract common keywords
    const words1 = text1.toLowerCase().match(/\b\w+\b/g) || [];
    const words2 = text2.toLowerCase().match(/\b\w+\b/g) || [];
    const freq1 = {};
    const freq2 = {};
    
    words1.forEach(w => freq1[w] = (freq1[w] || 0) + 1);
    words2.forEach(w => freq2[w] = (freq2[w] || 0) + 1);
    
    const commonKeywords = Object.keys(freq1)
      .filter(k => freq2[k])
      .sort((a,b) => (freq2[b] + freq1[b]) - (freq2[a] + freq1[a]))
      .slice(0, 15);
    
    // Update similarity score in header
    const similaritySpan = document.getElementById('similarityScore');
    if (similaritySpan) {
      similaritySpan.textContent = `${Math.round(similarity)}% Similar`;
      similaritySpan.style.backgroundColor = similarity > 70 ? '#4CAF50' : similarity > 40 ? '#FF9800' : '#f44336';
    }
    
    // Build results HTML
    resultsContent.innerHTML = `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px;">
        <!-- Similarity Card -->
        <div style="background: white; padding: 16px; border-radius: 8px; border-left: 4px solid #667eea;">
          <div style="font-size: 12px; color: #666; margin-bottom: 8px;">📊 CONTENT SIMILARITY</div>
          <div style="font-size: 32px; font-weight: bold; color: ${similarity > 70 ? '#4CAF50' : similarity > 40 ? '#FF9800' : '#f44336'};">${Math.round(similarity)}%</div>
          <div style="font-size: 12px; color: #999; margin-top: 8px;">
            ${similarity > 80 ? 'Very similar content' : similarity > 50 ? 'Moderately similar' : 'Significant differences'}
          </div>
        </div>
        
        <!-- Readability Card -->
        <div style="background: white; padding: 16px; border-radius: 8px; border-left: 4px solid #4CAF50;">
          <div style="font-size: 12px; color: #666; margin-bottom: 8px;">📖 READABILITY SCORE</div>
          <div style="display: flex; justify-content: space-between; align-items: baseline;">
            <div>
              <span style="font-size: 24px; font-weight: bold;">${Math.round(readability1)}</span>
              <span style="font-size: 12px; color: #999;"> / ${Math.round(readability2)}</span>
            </div>
            <div style="font-size: 12px; color: #666;">Left | Right</div>
          </div>
          <div style="font-size: 11px; color: #666; margin-top: 8px;">
            Left: ${getReadabilityLevel(readability1)}<br>
            Right: ${getReadabilityLevel(readability2)}
          </div>
        </div>
        
        <!-- Length Comparison -->
        <div style="background: white; padding: 16px; border-radius: 8px; border-left: 4px solid #FF9800;">
          <div style="font-size: 12px; color: #666; margin-bottom: 8px;">📏 CONTENT LENGTH</div>
          <div style="display: flex; gap: 16px; justify-content: space-between;">
            <div>
              <div style="font-size: 20px; font-weight: bold;">${text1.split(/\s+/).filter(w => w).length}</div>
              <div style="font-size: 10px; color: #999;">Left Words</div>
            </div>
            <div>
              <div style="font-size: 20px; font-weight: bold;">${text2.split(/\s+/).filter(w => w).length}</div>
              <div style="font-size: 10px; color: #999;">Right Words</div>
            </div>
            <div>
              <div style="font-size: 20px; font-weight: bold;">${Math.abs(text1.length - text2.length)}</div>
              <div style="font-size: 10px; color: #999;">Difference</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Keyword Gaps -->
      <div style="background: white; padding: 16px; border-radius: 8px; margin-top: 16px;">
        <div style="font-size: 12px; color: #666; margin-bottom: 12px;">🔑 KEYWORD GAPS ANALYSIS</div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div>
            <div style="font-weight: 600; margin-bottom: 8px; color: #667eea;">Missing in Right Text:</div>
            <div style="display: flex; flex-wrap: wrap; gap: 6px;">
              ${keywordGaps.missingInText2.map(k => `<span style="background: #ffebee; color: #c62828; padding: 4px 8px; border-radius: 4px; font-size: 11px;">${k}</span>`).join('') || '<span style="color: #999;">No significant gaps</span>'}
            </div>
          </div>
          <div>
            <div style="font-weight: 600; margin-bottom: 8px; color: #4CAF50;">Missing in Left Text:</div>
            <div style="display: flex; flex-wrap: wrap; gap: 6px;">
              ${keywordGaps.missingInText1.map(k => `<span style="background: #e8f5e9; color: #2e7d32; padding: 4px 8px; border-radius: 4px; font-size: 11px;">${k}</span>`).join('') || '<span style="color: #999;">No significant gaps</span>'}
            </div>
          </div>
        </div>
      </div>
      
      <!-- Common Keywords -->
      <div style="background: white; padding: 16px; border-radius: 8px; margin-top: 16px;">
        <div style="font-size: 12px; color: #666; margin-bottom: 12px;">⭐ TOP COMMON KEYWORDS</div>
        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
          ${commonKeywords.map(k => `<span style="background: #e3f2fd; color: #1976d2; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 500;">${k}</span>`).join('') || '<span style="color: #999;">No common keywords found</span>'}
        </div>
      </div>
      
      <!-- SEO Recommendations -->
      <div style="background: #fff3e0; padding: 16px; border-radius: 8px; margin-top: 16px; border-left: 4px solid #FF9800;">
        <div style="font-weight: 600; margin-bottom: 12px; color: #e65100;">💡 SEO RECOMMENDATIONS</div>
        <ul style="margin: 0; padding-left: 20px; font-size: 13px; line-height: 1.6;">
          ${similarity > 80 ? '<li>⚠️ Content is very similar - consider adding more unique value to avoid duplicate content issues</li>' : ''}
          ${similarity < 40 ? '<li>✅ Good content differentiation - maintain unique value proposition</li>' : ''}
          ${text1.split(/\s+/).length < 300 ? '<li>📝 Consider expanding content length for better SEO performance (target 300+ words)</li>' : ''}
          ${readability1 < 50 ? '<li>📚 Left text readability is low - simplify sentences for better user engagement</li>' : ''}
          ${readability2 < 50 ? '<li>📚 Right text readability is low - simplify sentences for better user engagement</li>' : ''}
          ${keywordGaps.missingInText2.length > 0 ? '<li>🔑 Right text missing important keywords from left - consider incorporating them</li>' : ''}
          ${keywordGaps.missingInText1.length > 0 ? '<li>🔑 Left text missing important keywords from right - consider incorporating them</li>' : ''}
        </ul>
      </div>
    `;
  }

  // Event listeners for panels
  function setupPanelListeners(panelId) {
    const loadBtn = document.getElementById(`${panelId}-load`);
    const clearBtn = document.getElementById(`${panelId}-clear`);
    const copyBtn = document.getElementById(`${panelId}-copy`);
    const sourceSelect = document.getElementById(`${panelId}-source`);
    const textarea = document.getElementById(`${panelId}-textarea`);
    
    if (loadBtn) {
      loadBtn.addEventListener('click', () => {
        loadContent(panelId, sourceSelect.value);
      });
    }
    
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (textarea) {
          textarea.value = '';
          updateStats(panelId, '');
          performComparison();
        }
      });
    }
    
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        if (textarea && textarea.value) {
          copyToClipboard(textarea.value).then(() => {
            showNotification('Text copied to clipboard!', 'success');
          });
        }
      });
    }
    
    if (textarea) {
      textarea.addEventListener('input', () => {
        updateStats(panelId, textarea.value);
        performComparison();
      });
    }
  }
  
  setupPanelListeners('left');
  setupPanelListeners('right');
  
  const refreshBtn = document.getElementById('refreshComparison');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', performComparison);
  }
  
  const closeBtn = document.getElementById('closeCompareBtn');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      document.body.removeChild(overlay);
    });
  }
  
  // Initial update
  performComparison();
  
  // Handle overlay click to close
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      document.body.removeChild(overlay);
    }
  });
}

// ==================== ADVANCED SEO IMAGE TOOLKIT ====================

function advancedImageToolkit() {
  // Create modal overlay
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.95);
    backdrop-filter: blur(8px);
    z-index: 100000;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  `;

  const modal = document.createElement('div');
  modal.style.cssText = `
    background: #fff;
    border-radius: 16px;
    width: 95%;
    max-width: 1400px;
    height: 90vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
  `;

  // Header
  const header = document.createElement('div');
  header.style.cssText = `
    padding: 20px 24px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
  `;
  header.innerHTML = `
    <div>
      <h2 style="margin: 0; font-size: 20px; font-weight: 600;">🖼️ Advanced SEO Image Toolkit</h2>
      <p style="margin: 4px 0 0; opacity: 0.9; font-size: 12px;">Resize, Convert, Optimize & Find Free Images for SEO</p>
    </div>
    <button id="closeImageToolkit" style="background: rgba(255,255,255,0.2); border: none; color: white; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; font-size: 20px;">×</button>
  `;

  // Tabs
  const tabsContainer = document.createElement('div');
  tabsContainer.style.cssText = `
    display: flex;
    background: #f8f9fa;
    border-bottom: 1px solid #e0e0e0;
    padding: 0 24px;
    gap: 8px;
  `;
  
  const tabs = [
    { id: 'resizer', name: '📐 Image Resizer', icon: '📐' },
    { id: 'converter', name: '🔄 Image Converter', icon: '🔄' },
    { id: 'sources', name: '📷 Free Image Sources', icon: '📷' },
    { id: 'optimizer', name: '⚡ Image Optimizer', icon: '⚡' },
    { id: 'analyzer', name: '🔍 SEO Analyzer', icon: '🔍' }
  ];
  
  const tabButtons = [];
  const tabContents = {};
  
  tabs.forEach((tab, index) => {
    const btn = document.createElement('button');
    btn.textContent = tab.name;
    btn.style.cssText = `
      padding: 12px 20px;
      background: none;
      border: none;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      color: #666;
      border-bottom: 3px solid transparent;
      transition: all 0.3s;
    `;
    if (index === 0) {
      btn.style.color = '#667eea';
      btn.style.borderBottomColor = '#667eea';
    }
    btn.onclick = () => {
      tabButtons.forEach(b => {
        b.style.color = '#666';
        b.style.borderBottomColor = 'transparent';
      });
      btn.style.color = '#667eea';
      btn.style.borderBottomColor = '#667eea';
      Object.values(tabContents).forEach(content => {
        content.style.display = 'none';
      });
      tabContents[tab.id].style.display = 'block';
    };
    tabsContainer.appendChild(btn);
    tabButtons.push(btn);
  });
  
  // Content container
  const contentContainer = document.createElement('div');
  contentContainer.style.cssText = `
    flex: 1;
    overflow-y: auto;
    padding: 24px;
  `;
  
  // ==================== IMAGE RESIZER TAB ====================
  const resizerTab = document.createElement('div');
  resizerTab.id = 'resizer-tab';
  resizerTab.style.cssText = `display: block;`;
  resizerTab.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
      <!-- Upload Section -->
      <div style="background: #f8f9fa; padding: 20px; border-radius: 12px;">
        <h3 style="margin: 0 0 16px; font-size: 18px;">📤 Upload Image</h3>
        <div id="dropZone" style="border: 2px dashed #ccc; border-radius: 12px; padding: 40px; text-align: center; cursor: pointer; transition: all 0.3s;">
          <div style="font-size: 48px; margin-bottom: 12px;">📸</div>
          <div>Drag & drop image here or click to upload</div>
          <div style="font-size: 12px; color: #999; margin-top: 8px;">Supports: JPG, PNG, WebP, GIF, SVG</div>
        </div>
        <input type="file" id="imageUpload" accept="image/*" style="display: none;">
        <div id="imagePreview" style="margin-top: 20px; display: none;">
          <img id="previewImg" style="max-width: 100%; border-radius: 8px;">
        </div>
      </div>
      
      <!-- Resize Controls -->
      <div style="background: #f8f9fa; padding: 20px; border-radius: 12px;">
        <h3 style="margin: 0 0 16px; font-size: 18px;">📏 Resize Options</h3>
        <div style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 8px; font-weight: 500;">Preset Sizes:</label>
          <select id="presetSizes" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px;">
            <option value="">Custom Size</option>
            <option value="150x150">Thumbnail (150x150)</option>
            <option value="300x200">Small (300x200)</option>
            <option value="600x400">Medium (600x400)</option>
            <option value="800x600">Large (800x600)</option>
            <option value="1200x800">Extra Large (1200x800)</option>
            <option value="1920x1080">Full HD (1920x1080)</option>
            <option value="social">Social Media (1200x630)</option>
            <option value="og-image">Open Graph (1200x630)</option>
            <option value="twitter-card">Twitter Card (800x418)</option>
          </select>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
          <div>
            <label style="display: block; margin-bottom: 8px; font-weight: 500;">Width (px):</label>
            <input type="number" id="resizeWidth" placeholder="Auto" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px;">
          </div>
          <div>
            <label style="display: block; margin-bottom: 8px; font-weight: 500;">Height (px):</label>
            <input type="number" id="resizeHeight" placeholder="Auto" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px;">
          </div>
        </div>
        
        <div style="margin-bottom: 16px;">
          <label style="display: flex; align-items: center; gap: 8px;">
            <input type="checkbox" id="maintainAspect" checked>
            <span>Maintain aspect ratio</span>
          </label>
        </div>
        
        <div style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 8px; font-weight: 500;">Quality:</label>
          <input type="range" id="resizeQuality" min="1" max="100" value="90" style="width: 100%;">
          <div style="display: flex; justify-content: space-between; font-size: 12px; color: #666;">
            <span>Low</span>
            <span id="qualityValue">90%</span>
            <span>High</span>
          </div>
        </div>
        
        <button id="resizeImageBtn" style="width: 100%; padding: 12px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">Resize Image</button>
        <button id="downloadResized" style="width: 100%; margin-top: 12px; padding: 12px; background: #4CAF50; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; display: none;">Download Resized Image</button>
      </div>
    </div>
  `;
  
  // ==================== IMAGE CONVERTER TAB ====================
  const converterTab = document.createElement('div');
  converterTab.id = 'converter-tab';
  converterTab.style.cssText = `display: none;`;
  converterTab.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
      <div style="background: #f8f9fa; padding: 20px; border-radius: 12px;">
        <h3 style="margin: 0 0 16px; font-size: 18px;">📤 Upload Image</h3>
        <div id="converterDropZone" style="border: 2px dashed #ccc; border-radius: 12px; padding: 40px; text-align: center; cursor: pointer;">
          <div style="font-size: 48px;">🔄</div>
          <div>Click to upload image for conversion</div>
        </div>
        <input type="file" id="converterUpload" accept="image/*" style="display: none;">
        <div id="converterPreview" style="margin-top: 20px; display: none;">
          <img id="converterPreviewImg" style="max-width: 100%; border-radius: 8px;">
        </div>
      </div>
      
      <div style="background: #f8f9fa; padding: 20px; border-radius: 12px;">
        <h3 style="margin: 0 0 16px; font-size: 18px;">🔄 Convert To</h3>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 20px;">
          <button class="format-btn" data-format="image/jpeg">JPEG</button>
          <button class="format-btn" data-format="image/png">PNG</button>
          <button class="format-btn" data-format="image/webp">WebP</button>
          <button class="format-btn" data-format="image/gif">GIF</button>
          <button class="format-btn" data-format="image/bmp">BMP</button>
          <button class="format-btn" data-format="image/tiff">TIFF</button>
        </div>
        
        <div style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 8px; font-weight: 500;">Quality:</label>
          <input type="range" id="convertQuality" min="1" max="100" value="85" style="width: 100%;">
          <div id="convertQualityValue" style="text-align: center; font-size: 12px; margin-top: 5px;">85%</div>
        </div>
        
        <button id="convertImageBtn" style="width: 100%; padding: 12px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;" disabled>Convert Image</button>
        <button id="downloadConverted" style="width: 100%; margin-top: 12px; padding: 12px; background: #4CAF50; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; display: none;">Download Converted Image</button>
      </div>
    </div>
  `;
  
  // ==================== FREE IMAGE SOURCES TAB ====================
  const sourcesTab = document.createElement('div');
  sourcesTab.id = 'sources-tab';
  sourcesTab.style.cssText = `display: none;`;
  
  const imageSources = [
    { name: 'Unsplash', url: 'https://unsplash.com', description: 'High-quality free stock photos', category: 'Stock Photos', rating: '⭐⭐⭐⭐⭐' },
    { name: 'Pexels', url: 'https://pexels.com', description: 'Free stock photos & videos', category: 'Stock Photos', rating: '⭐⭐⭐⭐⭐' },
    { name: 'Pixabay', url: 'https://pixabay.com', description: 'Free images, illustrations, vectors', category: 'All Types', rating: '⭐⭐⭐⭐⭐' },
    { name: 'Burst (by Shopify)', url: 'https://burst.shopify.com', description: 'Free stock photos for websites', category: 'E-commerce', rating: '⭐⭐⭐⭐' },
    { name: 'Kaboompics', url: 'https://kaboompics.com', description: 'Free stock photos with color search', category: 'Stock Photos', rating: '⭐⭐⭐⭐' },
    { name: 'Stocksnap.io', url: 'https://stocksnap.io', description: 'High-resolution free images', category: 'Stock Photos', rating: '⭐⭐⭐⭐' },
    { name: 'Reshot', url: 'https://reshot.com', description: 'Free icons & illustrations', category: 'Icons', rating: '⭐⭐⭐⭐' },
    { name: 'Freepik', url: 'https://freepik.com', description: 'Free vectors & illustrations', category: 'Vectors', rating: '⭐⭐⭐⭐' },
    { name: 'Flaticon', url: 'https://flaticon.com', description: 'Free icons for websites', category: 'Icons', rating: '⭐⭐⭐⭐' },
    { name: 'Iconscout', url: 'https://iconscout.com', description: 'Free illustrations & icons', category: 'Icons', rating: '⭐⭐⭐⭐' },
    { name: 'Canva', url: 'https://canva.com', description: 'Design tool with free images', category: 'Design Tool', rating: '⭐⭐⭐⭐⭐' },
    { name: 'Remove.bg', url: 'https://remove.bg', description: 'Remove background from images', category: 'Tool', rating: '⭐⭐⭐⭐' }
  ];
  
  sourcesTab.innerHTML = `
    <div style="margin-bottom: 20px;">
      <input type="text" id="sourceSearch" placeholder="🔍 Search image sources..." style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px;">
    </div>
    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px;" id="sourcesGrid">
      ${imageSources.map(source => `
        <div class="source-card" style="background: #f8f9fa; padding: 16px; border-radius: 12px; cursor: pointer; transition: all 0.3s;" data-url="${source.url}">
          <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
            <h4 style="margin: 0; font-size: 16px; color: #667eea;">${source.name}</h4>
            <span style="font-size: 12px; color: #999;">${source.rating}</span>
          </div>
          <p style="margin: 8px 0; font-size: 13px; color: #666;">${source.description}</p>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 12px;">
            <span style="background: #e0e0e0; padding: 4px 8px; border-radius: 4px; font-size: 11px;">${source.category}</span>
            <span style="color: #667eea; font-size: 12px;">Open →</span>
          </div>
        </div>
      `).join('')}
    </div>
  `;
  
  // ==================== IMAGE OPTIMIZER TAB ====================
  const optimizerTab = document.createElement('div');
  optimizerTab.id = 'optimizer-tab';
  optimizerTab.style.cssText = `display: none;`;
  optimizerTab.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
      <div style="background: #f8f9fa; padding: 20px; border-radius: 12px;">
        <h3 style="margin: 0 0 16px; font-size: 18px;">📤 Upload Image</h3>
        <div id="optimizerDropZone" style="border: 2px dashed #ccc; border-radius: 12px; padding: 40px; text-align: center; cursor: pointer;">
          <div style="font-size: 48px;">⚡</div>
          <div>Upload image for optimization</div>
        </div>
        <input type="file" id="optimizerUpload" accept="image/*" style="display: none;">
        <div id="optimizerPreview" style="margin-top: 20px; display: none;">
          <img id="optimizerPreviewImg" style="max-width: 100%; border-radius: 8px;">
        </div>
      </div>
      
      <div style="background: #f8f9fa; padding: 20px; border-radius: 12px;">
        <h3 style="margin: 0 0 16px; font-size: 18px;">📊 Optimization Results</h3>
        <div id="optimizationResults" style="margin-bottom: 20px;">
          <div style="background: white; padding: 12px; border-radius: 8px; margin-bottom: 12px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span>Original Size:</span>
              <span id="originalSize">-</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span>Optimized Size:</span>
              <span id="optimizedSize">-</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span>Savings:</span>
              <span id="savings">-</span>
            </div>
            <div style="background: #e0e0e0; height: 8px; border-radius: 4px; overflow: hidden; margin-top: 12px;">
              <div id="savingsBar" style="height: 100%; background: #4CAF50; width: 0%;"></div>
            </div>
          </div>
        </div>
        
        <div style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 8px; font-weight: 500;">Optimization Level:</label>
          <input type="range" id="optimizationLevel" min="1" max="100" value="80" style="width: 100%;">
          <div style="display: flex; justify-content: space-between; font-size: 12px;">
            <span>Less Compression</span>
            <span id="levelValue">80%</span>
            <span>More Compression</span>
          </div>
        </div>
        
        <div style="margin-bottom: 16px;">
          <label style="display: flex; align-items: center; gap: 8px;">
            <input type="checkbox" id="convertToWebP" checked>
            <span>Convert to WebP for better compression</span>
          </label>
        </div>
        
        <button id="optimizeImageBtn" style="width: 100%; padding: 12px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;" disabled>Optimize Image</button>
        <button id="downloadOptimized" style="width: 100%; margin-top: 12px; padding: 12px; background: #4CAF50; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; display: none;">Download Optimized Image</button>
      </div>
    </div>
  `;
  
  // ==================== SEO ANALYZER TAB ====================
  const analyzerTab = document.createElement('div');
  analyzerTab.id = 'analyzer-tab';
  analyzerTab.style.cssText = `display: none;`;
  analyzerTab.innerHTML = `
    <div>
      <h3 style="margin: 0 0 16px; font-size: 18px;">🔍 Page Image SEO Analysis</h3>
      <div id="seoAnalysisResults" style="background: #f8f9fa; padding: 20px; border-radius: 12px;">
        <div style="text-align: center; padding: 40px;">
          <div style="font-size: 48px;">🔍</div>
          <p>Click "Analyze Page Images" to check SEO metrics for images on this page</p>
          <button id="runSeoAnalysis" style="padding: 12px 24px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">Analyze Page Images</button>
        </div>
      </div>
    </div>
  `;
  
  contentContainer.appendChild(resizerTab);
  contentContainer.appendChild(converterTab);
  contentContainer.appendChild(sourcesTab);
  contentContainer.appendChild(optimizerTab);
  contentContainer.appendChild(analyzerTab);
  
  modal.appendChild(header);
  modal.appendChild(tabsContainer);
  modal.appendChild(contentContainer);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  
  tabContents.resizer = resizerTab;
  tabContents.converter = converterTab;
  tabContents.sources = sourcesTab;
  tabContents.optimizer = optimizerTab;
  tabContents.analyzer = analyzerTab;
  
  // ==================== IMAGE RESIZER FUNCTIONALITY ====================
  let currentImageFile = null;
  let resizedBlob = null;
  
  const dropZone = document.getElementById('dropZone');
  const imageUpload = document.getElementById('imageUpload');
  const previewImg = document.getElementById('previewImg');
  const imagePreview = document.getElementById('imagePreview');
  const resizeWidth = document.getElementById('resizeWidth');
  const resizeHeight = document.getElementById('resizeHeight');
  const maintainAspect = document.getElementById('maintainAspect');
  const resizeQuality = document.getElementById('resizeQuality');
  const qualityValue = document.getElementById('qualityValue');
  const presetSizes = document.getElementById('presetSizes');
  const resizeBtn = document.getElementById('resizeImageBtn');
  const downloadResized = document.getElementById('downloadResized');
  
  let originalWidth = 0, originalHeight = 0;
  
  resizeQuality.addEventListener('input', () => {
    qualityValue.textContent = resizeQuality.value + '%';
  });
  
  dropZone.addEventListener('click', () => imageUpload.click());
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = '#667eea';
    dropZone.style.background = '#f0f0f0';
  });
  dropZone.addEventListener('dragleave', () => {
    dropZone.style.borderColor = '#ccc';
    dropZone.style.background = 'transparent';
  });
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = '#ccc';
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      loadImage(file);
    }
  });
  
  imageUpload.addEventListener('change', (e) => {
    if (e.target.files[0]) loadImage(e.target.files[0]);
  });
  
  function loadImage(file) {
    currentImageFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        originalWidth = img.width;
        originalHeight = img.height;
        previewImg.src = e.target.result;
        imagePreview.style.display = 'block';
        resizeWidth.value = originalWidth;
        resizeHeight.value = originalHeight;
        resizeBtn.disabled = false;
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
  
  presetSizes.addEventListener('change', () => {
    const value = presetSizes.value;
    if (value === 'social' || value === 'og-image') {
      resizeWidth.value = 1200;
      resizeHeight.value = 630;
    } else if (value === 'twitter-card') {
      resizeWidth.value = 800;
      resizeHeight.value = 418;
    } else if (value) {
      const [w, h] = value.split('x');
      resizeWidth.value = w;
      resizeHeight.value = h;
    }
  });
  
  resizeBtn.addEventListener('click', () => {
    if (!currentImageFile) return;
    
    let targetWidth = parseInt(resizeWidth.value);
    let targetHeight = parseInt(resizeHeight.value);
    
    if (isNaN(targetWidth)) targetWidth = originalWidth;
    if (isNaN(targetHeight)) targetHeight = originalHeight;
    
    if (maintainAspect.checked && targetWidth && targetHeight) {
      const ratio = originalWidth / originalHeight;
      const targetRatio = targetWidth / targetHeight;
      if (targetRatio > ratio) {
        targetWidth = Math.round(targetHeight * ratio);
      } else {
        targetHeight = Math.round(targetWidth / ratio);
      }
    }
    
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
      canvas.toBlob((blob) => {
        resizedBlob = blob;
        downloadResized.style.display = 'block';
        showNotification(`Image resized to ${targetWidth}x${targetHeight}`, 'success');
      }, currentImageFile.type, resizeQuality.value / 100);
    };
    img.src = previewImg.src;
  });
  
  downloadResized.addEventListener('click', () => {
    if (resizedBlob) {
      const url = URL.createObjectURL(resizedBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `resized_${currentImageFile.name}`;
      a.click();
      URL.revokeObjectURL(url);
    }
  });
  
  // ==================== IMAGE CONVERTER FUNCTIONALITY ====================
  let converterImageFile = null;
  let convertedBlob = null;
  let selectedFormat = 'image/jpeg';
  
  const converterDropZone = document.getElementById('converterDropZone');
  const converterUpload = document.getElementById('converterUpload');
  const converterPreviewImg = document.getElementById('converterPreviewImg');
  const converterPreview = document.getElementById('converterPreview');
  const convertQuality = document.getElementById('convertQuality');
  const convertQualityValue = document.getElementById('convertQualityValue');
  const convertBtn = document.getElementById('convertImageBtn');
  const downloadConverted = document.getElementById('downloadConverted');
  
  convertQuality.addEventListener('input', () => {
    convertQualityValue.textContent = convertQuality.value + '%';
  });
  
  converterDropZone.addEventListener('click', () => converterUpload.click());
  converterUpload.addEventListener('change', (e) => {
    if (e.target.files[0]) loadConverterImage(e.target.files[0]);
  });
  
  function loadConverterImage(file) {
    converterImageFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      converterPreviewImg.src = e.target.result;
      converterPreview.style.display = 'block';
      convertBtn.disabled = false;
    };
    reader.readAsDataURL(file);
  }
  
  document.querySelectorAll('.format-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.format-btn').forEach(b => {
        b.style.background = '#e0e0e0';
        b.style.color = '#666';
      });
      btn.style.background = '#667eea';
      btn.style.color = 'white';
      selectedFormat = btn.dataset.format;
    });
  });
  
  convertBtn.addEventListener('click', () => {
    if (!converterImageFile) return;
    
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      
      let mimeType = selectedFormat;
      canvas.toBlob((blob) => {
        convertedBlob = blob;
        downloadConverted.style.display = 'block';
        const formatName = selectedFormat.split('/')[1].toUpperCase();
        showNotification(`Image converted to ${formatName}`, 'success');
      }, mimeType, convertQuality.value / 100);
    };
    img.src = converterPreviewImg.src;
  });
  
  downloadConverted.addEventListener('click', () => {
    if (convertedBlob) {
      const url = URL.createObjectURL(convertedBlob);
      const a = document.createElement('a');
      a.href = url;
      const ext = selectedFormat.split('/')[1];
      a.download = `converted.${ext}`;
      a.click();
      URL.revokeObjectURL(url);
    }
  });
  
  // ==================== FREE IMAGE SOURCES ====================
  const sourceSearch = document.getElementById('sourceSearch');
  if (sourceSearch) {
    sourceSearch.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase();
      const cards = document.querySelectorAll('.source-card');
      cards.forEach(card => {
        const text = card.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }
  
  document.querySelectorAll('.source-card').forEach(card => {
    card.addEventListener('click', () => {
      const url = card.dataset.url;
      if (url) window.open(url, '_blank');
    });
  });
  
  // ==================== IMAGE OPTIMIZER FUNCTIONALITY ====================
  let optimizerImageFile = null;
  let optimizedBlob = null;
  
  const optimizerDropZone = document.getElementById('optimizerDropZone');
  const optimizerUpload = document.getElementById('optimizerUpload');
  const optimizerPreviewImg = document.getElementById('optimizerPreviewImg');
  const optimizerPreview = document.getElementById('optimizerPreview');
  const optimizationLevel = document.getElementById('optimizationLevel');
  const levelValue = document.getElementById('levelValue');
  const convertToWebP = document.getElementById('convertToWebP');
  const optimizeBtn = document.getElementById('optimizeImageBtn');
  const downloadOptimized = document.getElementById('downloadOptimized');
  const originalSizeSpan = document.getElementById('originalSize');
  const optimizedSizeSpan = document.getElementById('optimizedSize');
  const savingsSpan = document.getElementById('savings');
  const savingsBar = document.getElementById('savingsBar');
  
  optimizationLevel.addEventListener('input', () => {
    levelValue.textContent = optimizationLevel.value + '%';
  });
  
  optimizerDropZone.addEventListener('click', () => optimizerUpload.click());
  optimizerUpload.addEventListener('change', (e) => {
    if (e.target.files[0]) loadOptimizerImage(e.target.files[0]);
  });
  
  function loadOptimizerImage(file) {
    optimizerImageFile = file;
    originalSizeSpan.textContent = formatFileSize(file.size);
    const reader = new FileReader();
    reader.onload = (e) => {
      optimizerPreviewImg.src = e.target.result;
      optimizerPreview.style.display = 'block';
      optimizeBtn.disabled = false;
    };
    reader.readAsDataURL(file);
  }
  
  optimizeBtn.addEventListener('click', () => {
    if (!optimizerImageFile) return;
    
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      
      const quality = optimizationLevel.value / 100;
      const mimeType = convertToWebP.checked ? 'image/webp' : optimizerImageFile.type;
      
      canvas.toBlob((blob) => {
        optimizedBlob = blob;
        const optimizedSize = blob.size;
        const savingsPercent = ((optimizerImageFile.size - optimizedSize) / optimizerImageFile.size * 100).toFixed(1);
        
        optimizedSizeSpan.textContent = formatFileSize(optimizedSize);
        savingsSpan.textContent = `${savingsPercent}% (${formatFileSize(optimizerImageFile.size - optimizedSize)} saved)`;
        savingsBar.style.width = `${savingsPercent}%`;
        
        downloadOptimized.style.display = 'block';
        showNotification(`Image optimized! Saved ${savingsPercent}%`, 'success');
        
        // Show preview of optimized image
        const optimizedUrl = URL.createObjectURL(blob);
        optimizerPreviewImg.src = optimizedUrl;
      }, mimeType, quality);
    };
    img.src = optimizerPreviewImg.src;
  });
  
  downloadOptimized.addEventListener('click', () => {
    if (optimizedBlob) {
      const url = URL.createObjectURL(optimizedBlob);
      const a = document.createElement('a');
      a.href = url;
      const ext = convertToWebP.checked ? 'webp' : optimizerImageFile.name.split('.').pop();
      a.download = `optimized_${Date.now()}.${ext}`;
      a.click();
      URL.revokeObjectURL(url);
    }
  });
  
  // ==================== SEO ANALYZER FUNCTIONALITY ====================
  const runSeoAnalysis = document.getElementById('runSeoAnalysis');
  const seoAnalysisResults = document.getElementById('seoAnalysisResults');
  
  runSeoAnalysis.addEventListener('click', () => {
    const images = document.querySelectorAll('img');
    const results = {
      total: images.length,
      withAlt: 0,
      withoutAlt: 0,
      emptyAlt: 0,
      missingAlt: [],
      withLazyLoading: 0,
      missingDimensions: 0
    };
    
    images.forEach(img => {
      const alt = img.getAttribute('alt');
      if (alt === null) {
        results.withoutAlt++;
        results.missingAlt.push(img.src || img.getAttribute('data-src') || 'Unknown');
      } else if (alt === '') {
        results.emptyAlt++;
      } else {
        results.withAlt++;
      }
      
      if (img.loading === 'lazy') results.withLazyLoading++;
      if (!img.width || !img.height) results.missingDimensions++;
    });
    
    seoAnalysisResults.innerHTML = `
      <div style="background: white; padding: 20px; border-radius: 12px;">
        <h3 style="margin: 0 0 16px;">📊 Page Image SEO Report</h3>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 20px;">
          <div style="background: #e3f2fd; padding: 16px; border-radius: 8px; text-align: center;">
            <div style="font-size: 28px; font-weight: bold;">${results.total}</div>
            <div style="font-size: 12px;">Total Images</div>
          </div>
          <div style="background: #c8e6c9; padding: 16px; border-radius: 8px; text-align: center;">
            <div style="font-size: 28px; font-weight: bold;">${results.withAlt}</div>
            <div style="font-size: 12px;">With Alt Text</div>
          </div>
          <div style="background: #ffcdd2; padding: 16px; border-radius: 8px; text-align: center;">
            <div style="font-size: 28px; font-weight: bold;">${results.withoutAlt + results.emptyAlt}</div>
            <div style="font-size: 12px;">Missing/Empty Alt</div>
          </div>
          <div style="background: #fff9c4; padding: 16px; border-radius: 8px; text-align: center;">
            <div style="font-size: 28px; font-weight: bold;">${results.withLazyLoading}</div>
            <div style="font-size: 12px;">Lazy Loading Enabled</div>
          </div>
        </div>
        
        <div style="background: #f8f9fa; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
          <strong>📋 Recommendations:</strong>
          <ul style="margin-top: 12px; padding-left: 20px;">
            ${results.withoutAlt + results.emptyAlt > 0 ? '<li>⚠️ Add descriptive alt text to all images for better accessibility and SEO</li>' : '<li>✅ All images have alt text - good job!</li>'}
            ${results.withLazyLoading < results.total ? '<li>💡 Consider adding lazy loading to improve page speed (loading="lazy")</li>' : '<li>✅ Good use of lazy loading!</li>'}
            ${results.missingDimensions > 0 ? '<li>📏 Set width and height attributes to prevent layout shift (CLS)</li>' : '<li>✅ Images have dimension attributes</li>'}
          </ul>
        </div>
        
        ${results.missingAlt.length > 0 ? `
          <details>
            <summary style="cursor: pointer; font-weight: 600; margin-bottom: 12px;">🔍 View Images Missing Alt Text (${results.missingAlt.length})</summary>
            <div style="max-height: 300px; overflow-y: auto;">
              ${results.missingAlt.map((src, i) => `<div style="padding: 8px; border-bottom: 1px solid #e0e0e0; font-size: 12px; word-break: break-all;">${i+1}. ${src.substring(0, 100)}</div>`).join('')}
            </div>
          </details>
        ` : ''}
        
        <button id="closeSeoAnalysis" style="margin-top: 20px; padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer;">Close</button>
      </div>
    `;
    
    document.getElementById('closeSeoAnalysis').addEventListener('click', () => {
      location.reload();
    });
  });
  
  // Helper functions
  function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }
  
  function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      padding: 12px 20px;
      background: ${type === 'success' ? '#4CAF50' : '#f44336'};
      color: white;
      border-radius: 8px;
      z-index: 100001;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 13px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      opacity: 0;
      transition: opacity 0.3s;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.style.opacity = '1', 10);
    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
  
  // Close button
  document.getElementById('closeImageToolkit').addEventListener('click', () => {
    document.body.removeChild(overlay);
  });
  
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      document.body.removeChild(overlay);
    }
  });
}

// ==================== ADVANCED SEO UTILITIES TOOLKIT ====================

function advancedSEOUtilities() {
  // Create modal overlay
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.95);
    backdrop-filter: blur(8px);
    z-index: 100000;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  `;

  const modal = document.createElement('div');
  modal.style.cssText = `
    background: #fff;
    border-radius: 16px;
    width: 95%;
    max-width: 1400px;
    height: 90vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
  `;

  // Header
  const header = document.createElement('div');
  header.style.cssText = `
    padding: 20px 24px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
  `;
  header.innerHTML = `
    <div>
      <h2 style="margin: 0; font-size: 20px; font-weight: 600;">🔧 Advanced SEO Utilities Toolkit</h2>
      <p style="margin: 4px 0 0; opacity: 0.9; font-size: 12px;">Text to HTML, Password Generator, Lorem Ipsum, Meta Tags & More</p>
    </div>
    <button id="closeUtilities" style="background: rgba(255,255,255,0.2); border: none; color: white; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; font-size: 20px;">×</button>
  `;

  // Tabs
  const tabsContainer = document.createElement('div');
  tabsContainer.style.cssText = `
    display: flex;
    background: #f8f9fa;
    border-bottom: 1px solid #e0e0e0;
    padding: 0 24px;
    gap: 8px;
    overflow-x: auto;
  `;
  
  const tabs = [
    { id: 'html-generator', name: '📝 HTML Generator', icon: '📝' },
    { id: 'password-generator', name: '🔐 Password Generator', icon: '🔐' },
    { id: 'lorem-ipsum', name: '📄 Lorem Ipsum', icon: '📄' },
    { id: 'meta-generator', name: '🏷️ Meta Tags', icon: '🏷️' },
    { id: 'schema-generator', name: '📋 Schema Markup', icon: '📋' },
    { id: 'text-cleaner', name: '🧹 Text Cleaner', icon: '🧹' },
    { id: 'html-encoder', name: '🔧 HTML Encoder', icon: '🔧' }
  ];
  
  const tabButtons = [];
  const tabContents = {};
  
  tabs.forEach((tab, index) => {
    const btn = document.createElement('button');
    btn.textContent = tab.name;
    btn.style.cssText = `
      padding: 12px 20px;
      background: none;
      border: none;
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
      color: #666;
      border-bottom: 3px solid transparent;
      transition: all 0.3s;
      white-space: nowrap;
    `;
    if (index === 0) {
      btn.style.color = '#667eea';
      btn.style.borderBottomColor = '#667eea';
    }
    btn.onclick = () => {
      tabButtons.forEach(b => {
        b.style.color = '#666';
        b.style.borderBottomColor = 'transparent';
      });
      btn.style.color = '#667eea';
      btn.style.borderBottomColor = '#667eea';
      Object.values(tabContents).forEach(content => {
        content.style.display = 'none';
      });
      tabContents[tab.id].style.display = 'block';
    };
    tabsContainer.appendChild(btn);
    tabButtons.push(btn);
  });
  
  // Content container
  const contentContainer = document.createElement('div');
  contentContainer.style.cssText = `
    flex: 1;
    overflow-y: auto;
    padding: 24px;
  `;
  
  // ==================== HTML GENERATOR TAB ====================
  const htmlGeneratorTab = document.createElement('div');
  htmlGeneratorTab.id = 'html-generator-tab';
  htmlGeneratorTab.style.cssText = `display: block;`;
  htmlGeneratorTab.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; height: 100%;">
      <div style="display: flex; flex-direction: column;">
        <h3 style="margin: 0 0 16px; font-size: 18px;">📝 Input Text / Content</h3>
        <textarea id="inputText" placeholder="Enter your text, markdown, or content here...&#10;&#10;Supports:&#10;- Plain text&#10;- Markdown (bold, italic, links, lists)&#10;- Rich text formatting" style="flex: 1; padding: 16px; border: 2px solid #e0e0e0; border-radius: 12px; font-family: monospace; font-size: 13px; resize: vertical; min-height: 300px;"></textarea>
        
        <div style="margin-top: 16px; display: flex; gap: 12px; flex-wrap: wrap;">
          <select id="htmlConversionType" style="padding: 10px; border: 1px solid #ddd; border-radius: 6px;">
            <option value="paragraph">Paragraphs (p tags)</option>
            <option value="div">Div containers</option>
            <option value="article">Article tags</option>
            <option value="section">Section tags</option>
            <option value="markdown">Markdown to HTML</option>
            <option value="rich">Rich Text (preserve formatting)</option>
          </select>
          <button id="convertToHtml" style="padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer;">Convert to HTML</button>
          <button id="clearHtml" style="padding: 10px 20px; background: #f44336; color: white; border: none; border-radius: 6px; cursor: pointer;">Clear</button>
        </div>
      </div>
      
      <div style="display: flex; flex-direction: column;">
        <h3 style="margin: 0 0 16px; font-size: 18px;">🎨 Generated HTML</h3>
        <textarea id="generatedHtml" readonly style="flex: 1; padding: 16px; border: 2px solid #e0e0e0; border-radius: 12px; font-family: monospace; font-size: 12px; background: #f8f9fa; resize: vertical; min-height: 300px;"></textarea>
        
        <div style="margin-top: 16px; display: flex; gap: 12px;">
          <button id="copyHtml" style="flex: 1; padding: 10px; background: #4CAF50; color: white; border: none; border-radius: 6px; cursor: pointer;">📋 Copy HTML</button>
          <button id="previewHtml" style="flex: 1; padding: 10px; background: #FF9800; color: white; border: none; border-radius: 6px; cursor: pointer;">👁️ Preview</button>
          <button id="downloadHtml" style="flex: 1; padding: 10px; background: #2196F3; color: white; border: none; border-radius: 6px; cursor: pointer;">💾 Download</button>
        </div>
      </div>
    </div>
  `;
  
  // ==================== PASSWORD GENERATOR TAB ====================
  const passwordGeneratorTab = document.createElement('div');
  passwordGeneratorTab.id = 'password-generator-tab';
  passwordGeneratorTab.style.cssText = `display: none;`;
  passwordGeneratorTab.innerHTML = `
    <div style="max-width: 600px; margin: 0 auto;">
      <div style="background: #f8f9fa; padding: 24px; border-radius: 12px;">
        <h3 style="margin: 0 0 20px; font-size: 20px;">🔐 Secure Password Generator</h3>
        
        <div style="margin-bottom: 20px;">
          <label style="display: block; margin-bottom: 8px; font-weight: 500;">Generated Password:</label>
          <div style="display: flex; gap: 12px;">
            <input type="text" id="generatedPassword" readonly style="flex: 1; padding: 12px; border: 2px solid #e0e0e0; border-radius: 6px; font-family: monospace; font-size: 16px; background: white;">
            <button id="generatePassword" style="padding: 12px 24px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer;">Generate</button>
            <button id="copyPassword" style="padding: 12px 24px; background: #4CAF50; color: white; border: none; border-radius: 6px; cursor: pointer;">Copy</button>
          </div>
        </div>
        
        <div style="margin-bottom: 20px;">
          <label style="display: block; margin-bottom: 8px; font-weight: 500;">Password Length: <span id="lengthValue">16</span></label>
          <input type="range" id="passwordLength" min="8" max="64" value="16" style="width: 100%;">
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 20px;">
          <label style="display: flex; align-items: center; gap: 8px;">
            <input type="checkbox" id="useUppercase" checked> Uppercase (A-Z)
          </label>
          <label style="display: flex; align-items: center; gap: 8px;">
            <input type="checkbox" id="useLowercase" checked> Lowercase (a-z)
          </label>
          <label style="display: flex; align-items: center; gap: 8px;">
            <input type="checkbox" id="useNumbers" checked> Numbers (0-9)
          </label>
          <label style="display: flex; align-items: center; gap: 8px;">
            <input type="checkbox" id="useSymbols" checked> Symbols (!@#$%^&*)
          </label>
        </div>
        
        <div style="margin-bottom: 20px;">
          <label style="display: block; margin-bottom: 8px; font-weight: 500;">Password Strength:</label>
          <div style="background: #e0e0e0; height: 8px; border-radius: 4px; overflow: hidden;">
            <div id="strengthBar" style="height: 100%; width: 0%; transition: width 0.3s;"></div>
          </div>
          <div id="strengthText" style="margin-top: 8px; font-size: 12px; text-align: center;"></div>
        </div>
        
        <div style="background: white; padding: 16px; border-radius: 8px; margin-top: 20px;">
          <h4 style="margin: 0 0 12px;">📊 Password Statistics</h4>
          <div id="passwordStats">
            <div>Possible combinations: <strong id="combinations">-</strong></div>
            <div>Estimated crack time: <strong id="crackTime">-</strong></div>
            <div>Entropy: <strong id="entropy">-</strong> bits</div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // ==================== LOREM IPSUM GENERATOR TAB ====================
  const loremIpsumTab = document.createElement('div');
  loremIpsumTab.id = 'lorem-ipsum-tab';
  loremIpsumTab.style.cssText = `display: none;`;
  loremIpsumTab.innerHTML = `
    <div style="display: grid; grid-template-columns: 300px 1fr; gap: 24px;">
      <div style="background: #f8f9fa; padding: 20px; border-radius: 12px;">
        <h3 style="margin: 0 0 16px;">⚙️ Settings</h3>
        
        <div style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 8px;">Generate:</label>
          <select id="loremType" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px;">
            <option value="paragraphs">Paragraphs</option>
            <option value="sentences">Sentences</option>
            <option value="words">Words</option>
            <option value="list">Bullet List</option>
            <option value="heading">Headings + Text</option>
          </select>
        </div>
        
        <div style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 8px;">Count: <span id="countValue">3</span></label>
          <input type="range" id="loremCount" min="1" max="20" value="3" style="width: 100%;">
        </div>
        
        <div style="margin-bottom: 16px;">
          <label style="display: flex; align-items: center; gap: 8px;">
            <input type="checkbox" id="includeHtml"> Include HTML tags
          </label>
        </div>
        
        <button id="generateLorem" style="width: 100%; padding: 12px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer; margin-bottom: 12px;">Generate</button>
        <button id="copyLorem" style="width: 100%; padding: 12px; background: #4CAF50; color: white; border: none; border-radius: 6px; cursor: pointer;">Copy to Clipboard</button>
      </div>
      
      <div style="background: #f8f9fa; padding: 20px; border-radius: 12px;">
        <h3 style="margin: 0 0 16px;">📄 Generated Content</h3>
        <div id="loremOutput" style="background: white; padding: 16px; border-radius: 8px; min-height: 400px; max-height: 500px; overflow-y: auto; font-size: 14px; line-height: 1.6;"></div>
      </div>
    </div>
  `;
  
  // ==================== META TAGS GENERATOR TAB ====================
  const metaGeneratorTab = document.createElement('div');
  metaGeneratorTab.id = 'meta-generator-tab';
  metaGeneratorTab.style.cssText = `display: none;`;
  metaGeneratorTab.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
      <div style="background: #f8f9fa; padding: 20px; border-radius: 12px;">
        <h3 style="margin: 0 0 16px;">📝 Meta Tag Details</h3>
        
        <div style="margin-bottom: 16px;">
          <label>Title (50-60 characters):</label>
          <input type="text" id="metaTitle" placeholder="Page Title for SEO" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; margin-top: 5px;">
          <div id="titleLength" style="font-size: 11px; margin-top: 4px;"></div>
        </div>
        
        <div style="margin-bottom: 16px;">
          <label>Meta Description (150-160 characters):</label>
          <textarea id="metaDescription" rows="3" placeholder="Page description for search results..." style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; margin-top: 5px;"></textarea>
          <div id="descLength" style="font-size: 11px; margin-top: 4px;"></div>
        </div>
        
        <div style="margin-bottom: 16px;">
          <label>Meta Keywords (comma separated):</label>
          <input type="text" id="metaKeywords" placeholder="SEO, tools, generator" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; margin-top: 5px;">
        </div>
        
        <div style="margin-bottom: 16px;">
          <label>Canonical URL:</label>
          <input type="url" id="canonicalUrl" placeholder="https://example.com/page" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; margin-top: 5px;">
        </div>
        
        <div style="margin-bottom: 16px;">
          <label>Robots:</label>
          <select id="robotsDirective" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px;">
            <option value="index, follow">Index, Follow (Default)</option>
            <option value="noindex, follow">No Index, Follow</option>
            <option value="index, nofollow">Index, No Follow</option>
            <option value="noindex, nofollow">No Index, No Follow</option>
          </select>
        </div>
        
        <div style="margin-bottom: 16px;">
          <label>Language:</label>
          <input type="text" id="language" placeholder="en_US" value="en_US" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px;">
        </div>
      </div>
      
      <div style="background: #f8f9fa; padding: 20px; border-radius: 12px;">
        <h3 style="margin: 0 0 16px;">🎨 Generated Meta Tags</h3>
        <textarea id="generatedMeta" readonly style="width: 100%; height: 400px; padding: 16px; border: 2px solid #e0e0e0; border-radius: 8px; font-family: monospace; font-size: 12px; background: white; resize: vertical;"></textarea>
        
        <div style="margin-top: 16px; display: flex; gap: 12px;">
          <button id="copyMeta" style="flex: 1; padding: 10px; background: #4CAF50; color: white; border: none; border-radius: 6px; cursor: pointer;">📋 Copy Meta Tags</button>
          <button id="previewMeta" style="flex: 1; padding: 10px; background: #FF9800; color: white; border: none; border-radius: 6px; cursor: pointer;">👁️ Preview in Google</button>
        </div>
      </div>
    </div>
  `;
  
  // ==================== SCHEMA MARKUP GENERATOR TAB ====================
  const schemaGeneratorTab = document.createElement('div');
  schemaGeneratorTab.id = 'schema-generator-tab';
  schemaGeneratorTab.style.cssText = `display: none;`;
  schemaGeneratorTab.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
      <div style="background: #f8f9fa; padding: 20px; border-radius: 12px;">
        <h3 style="margin: 0 0 16px;">📋 Schema Type</h3>
        
        <select id="schemaType" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 6px; margin-bottom: 20px;">
          <option value="article">Article</option>
          <option value="blogposting">BlogPosting</option>
          <option value="localbusiness">LocalBusiness</option>
          <option value="product">Product</option>
          <option value="review">Review</option>
          <option value="event">Event</option>
          <option value="organization">Organization</option>
          <option value="person">Person</option>
          <option value="faqpage">FAQPage</option>
          <option value="howto">HowTo</option>
        </select>
        
        <div id="schemaFields"></div>
      </div>
      
      <div style="background: #f8f9fa; padding: 20px; border-radius: 12px;">
        <h3 style="margin: 0 0 16px;">🎨 Generated Schema Markup</h3>
        <textarea id="generatedSchema" readonly style="width: 100%; height: 400px; padding: 16px; border: 2px solid #e0e0e0; border-radius: 8px; font-family: monospace; font-size: 11px; background: white; resize: vertical;"></textarea>
        
        <div style="margin-top: 16px; display: flex; gap: 12px;">
          <button id="copySchema" style="flex: 1; padding: 10px; background: #4CAF50; color: white; border: none; border-radius: 6px; cursor: pointer;">📋 Copy Schema</button>
          <button id="validateSchema" style="flex: 1; padding: 10px; background: #2196F3; color: white; border: none; border-radius: 6px; cursor: pointer;">✅ Validate with Google</button>
        </div>
      </div>
    </div>
  `;
  
  // ==================== TEXT CLEANER TAB ====================
  const textCleanerTab = document.createElement('div');
  textCleanerTab.id = 'text-cleaner-tab';
  textCleanerTab.style.cssText = `display: none;`;
  textCleanerTab.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
      <div style="display: flex; flex-direction: column;">
        <h3 style="margin: 0 0 16px;">📝 Input Text</h3>
        <textarea id="dirtyText" placeholder="Paste text with extra spaces, special characters, HTML tags, etc..." style="flex: 1; padding: 16px; border: 2px solid #e0e0e0; border-radius: 12px; font-family: monospace; font-size: 13px; resize: vertical; min-height: 300px;"></textarea>
        
        <div style="margin-top: 16px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;">
          <button id="removeExtraSpaces" class="cleaner-btn" style="padding: 8px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer;">Remove Extra Spaces</button>
          <button id="removeLineBreaks" class="cleaner-btn" style="padding: 8px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer;">Remove Line Breaks</button>
          <button id="removeHtmlTags" class="cleaner-btn" style="padding: 8px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer;">Remove HTML Tags</button>
          <button id="removeSpecialChars" class="cleaner-btn" style="padding: 8px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer;">Remove Special Chars</button>
          <button id="trimWhitespace" class="cleaner-btn" style="padding: 8px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer;">Trim Whitespace</button>
          <button id="convertToAscii" class="cleaner-btn" style="padding: 8px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer;">Convert to ASCII</button>
          <button id="lowercase" class="cleaner-btn" style="padding: 8px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer;">Lowercase</button>
          <button id="uppercase" class="cleaner-btn" style="padding: 8px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer;">Uppercase</button>
          <button id="capitalizeWords" class="cleaner-btn" style="padding: 8px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer;">Capitalize Words</button>
          <button id="resetText" class="cleaner-btn" style="padding: 8px; background: #f44336; color: white; border: none; border-radius: 6px; cursor: pointer;">Reset</button>
        </div>
      </div>
      
      <div style="display: flex; flex-direction: column;">
        <h3 style="margin: 0 0 16px;">✨ Cleaned Text</h3>
        <textarea id="cleanText" readonly style="flex: 1; padding: 16px; border: 2px solid #e0e0e0; border-radius: 12px; font-family: monospace; font-size: 13px; background: #f8f9fa; resize: vertical; min-height: 300px;"></textarea>
        
        <div style="margin-top: 16px; display: flex; gap: 12px;">
          <button id="copyCleanText" style="flex: 1; padding: 10px; background: #4CAF50; color: white; border: none; border-radius: 6px; cursor: pointer;">📋 Copy Cleaned Text</button>
          <button id="downloadCleanText" style="flex: 1; padding: 10px; background: #2196F3; color: white; border: none; border-radius: 6px; cursor: pointer;">💾 Download</button>
        </div>
        
        <div style="margin-top: 16px; padding: 12px; background: white; border-radius: 8px;">
          <h4 style="margin: 0 0 8px;">📊 Statistics</h4>
          <div id="textStats" style="font-size: 12px;">
            <div>Characters: 0</div>
            <div>Words: 0</div>
            <div>Lines: 0</div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // ==================== HTML ENCODER/DECODER TAB ====================
  const htmlEncoderTab = document.createElement('div');
  htmlEncoderTab.id = 'html-encoder-tab';
  htmlEncoderTab.style.cssText = `display: none;`;
  htmlEncoderTab.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
      <div style="display: flex; flex-direction: column;">
        <h3 style="margin: 0 0 16px;">📝 Input</h3>
        <textarea id="encoderInput" placeholder="Enter HTML or text to encode/decode..." style="flex: 1; padding: 16px; border: 2px solid #e0e0e0; border-radius: 12px; font-family: monospace; font-size: 13px; resize: vertical; min-height: 300px;"></textarea>
        
        <div style="margin-top: 16px; display: flex; gap: 12px;">
          <button id="encodeHtml" style="flex: 1; padding: 12px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer;">Encode HTML</button>
          <button id="decodeHtml" style="flex: 1; padding: 12px; background: #FF9800; color: white; border: none; border-radius: 6px; cursor: pointer;">Decode HTML</button>
        </div>
      </div>
      
      <div style="display: flex; flex-direction: column;">
        <h3 style="margin: 0 0 16px;">✨ Output</h3>
        <textarea id="encoderOutput" readonly style="flex: 1; padding: 16px; border: 2px solid #e0e0e0; border-radius: 12px; font-family: monospace; font-size: 13px; background: #f8f9fa; resize: vertical; min-height: 300px;"></textarea>
        
        <div style="margin-top: 16px; display: flex; gap: 12px;">
          <button id="copyEncoded" style="flex: 1; padding: 10px; background: #4CAF50; color: white; border: none; border-radius: 6px; cursor: pointer;">📋 Copy Output</button>
          <button id="clearEncoder" style="flex: 1; padding: 10px; background: #f44336; color: white; border: none; border-radius: 6px; cursor: pointer;">Clear</button>
        </div>
      </div>
    </div>
  `;
  
  contentContainer.appendChild(htmlGeneratorTab);
  contentContainer.appendChild(passwordGeneratorTab);
  contentContainer.appendChild(loremIpsumTab);
  contentContainer.appendChild(metaGeneratorTab);
  contentContainer.appendChild(schemaGeneratorTab);
  contentContainer.appendChild(textCleanerTab);
  contentContainer.appendChild(htmlEncoderTab);
  
  modal.appendChild(header);
  modal.appendChild(tabsContainer);
  modal.appendChild(contentContainer);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  
  tabContents['html-generator'] = htmlGeneratorTab;
  tabContents['password-generator'] = passwordGeneratorTab;
  tabContents['lorem-ipsum'] = loremIpsumTab;
  tabContents['meta-generator'] = metaGeneratorTab;
  tabContents['schema-generator'] = schemaGeneratorTab;
  tabContents['text-cleaner'] = textCleanerTab;
  tabContents['html-encoder'] = htmlEncoderTab;
  
  // ==================== HTML GENERATOR FUNCTIONS ====================
  const inputText = document.getElementById('inputText');
  const generatedHtml = document.getElementById('generatedHtml');
  const convertToHtml = document.getElementById('convertToHtml');
  const htmlConversionType = document.getElementById('htmlConversionType');
  const copyHtml = document.getElementById('copyHtml');
  const previewHtml = document.getElementById('previewHtml');
  const downloadHtml = document.getElementById('downloadHtml');
  const clearHtml = document.getElementById('clearHtml');
  
  function markdownToHtml(markdown) {
    let html = markdown;
    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    // Bold
    html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
    // Italic
    html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');
    // Links
    html = html.replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" target="_blank">$1</a>');
    // Unordered Lists
    html = html.replace(/^\s*\*\s(.*)$/gim, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
    // Line breaks
    html = html.replace(/\n/g, '<br>');
    return html;
  }
  
  convertToHtml.addEventListener('click', () => {
    let text = inputText.value;
    let html = '';
    const type = htmlConversionType.value;
    
    if (type === 'paragraph') {
      const paragraphs = text.split(/\n\n+/);
      html = paragraphs.map(p => `<p>${p.trim()}</p>`).join('\n');
    } else if (type === 'div') {
      const paragraphs = text.split(/\n\n+/);
      html = paragraphs.map(p => `<div class="content-block">${p.trim()}</div>`).join('\n');
    } else if (type === 'article') {
      html = `<article>\n${text.split(/\n\n+/).map(p => `<p>${p.trim()}</p>`).join('\n')}\n</article>`;
    } else if (type === 'section') {
      html = `<section>\n${text.split(/\n\n+/).map(p => `<p>${p.trim()}</p>`).join('\n')}\n</section>`;
    } else if (type === 'markdown') {
      html = markdownToHtml(text);
    } else if (type === 'rich') {
      html = text.replace(/\n/g, '<br>');
    }
    
    generatedHtml.value = html;
    showNotification('HTML generated successfully!', 'success');
  });
  
  copyHtml.addEventListener('click', () => {
    copyToClipboard(generatedHtml.value);
    showNotification('HTML copied to clipboard!', 'success');
  });
  
  previewHtml.addEventListener('click', () => {
    const previewWindow = window.open('', '_blank');
    previewWindow.document.write(`
      <html>
        <head><title>HTML Preview</title></head>
        <body style="padding: 20px; font-family: sans-serif;">${generatedHtml.value}</body>
      </html>
    `);
    previewWindow.document.close();
  });
  
  downloadHtml.addEventListener('click', () => {
    const blob = new Blob([generatedHtml.value], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-content.html';
    a.click();
    URL.revokeObjectURL(url);
  });
  
  clearHtml.addEventListener('click', () => {
    inputText.value = '';
    generatedHtml.value = '';
  });
  
  // ==================== PASSWORD GENERATOR FUNCTIONS ====================
  const generatedPassword = document.getElementById('generatedPassword');
  const generatePassword = document.getElementById('generatePassword');
  const copyPassword = document.getElementById('copyPassword');
  const passwordLength = document.getElementById('passwordLength');
  const lengthValue = document.getElementById('lengthValue');
  const useUppercase = document.getElementById('useUppercase');
  const useLowercase = document.getElementById('useLowercase');
  const useNumbers = document.getElementById('useNumbers');
  const useSymbols = document.getElementById('useSymbols');
  const strengthBar = document.getElementById('strengthBar');
  const strengthText = document.getElementById('strengthText');
  const combinations = document.getElementById('combinations');
  const crackTime = document.getElementById('crackTime');
  const entropy = document.getElementById('entropy');
  
  const uppercaseChars = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lowercaseChars = 'abcdefghijkmnopqrstuvwxyz';
  const numberChars = '23456789';
  const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  function generateSecurePassword() {
    let chars = '';
    if (useUppercase.checked) chars += uppercaseChars;
    if (useLowercase.checked) chars += lowercaseChars;
    if (useNumbers.checked) chars += numberChars;
    if (useSymbols.checked) chars += symbolChars;
    
    if (chars === '') {
      showNotification('Please select at least one character type', 'error');
      return;
    }
    
    const length = parseInt(passwordLength.value);
    let password = '';
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    
    for (let i = 0; i < length; i++) {
      password += chars[array[i] % chars.length];
    }
    
    generatedPassword.value = password;
    calculateStrength(password, chars.length);
  }
  
  function calculateStrength(password, charSetSize) {
    const length = password.length;
    const possibleCombinations = Math.pow(charSetSize, length);
    const entropyValue = Math.log2(possibleCombinations);
    const crackTimeSeconds = possibleCombinations / 1e9;
    
    combinations.textContent = possibleCombinations.toExponential(2);
    entropy.textContent = entropyValue.toFixed(1);
    
    if (crackTimeSeconds < 1) crackTime.textContent = 'Less than a second';
    else if (crackTimeSeconds < 60) crackTime.textContent = `${Math.round(crackTimeSeconds)} seconds`;
    else if (crackTimeSeconds < 3600) crackTime.textContent = `${Math.round(crackTimeSeconds / 60)} minutes`;
    else if (crackTimeSeconds < 86400) crackTime.textContent = `${Math.round(crackTimeSeconds / 3600)} hours`;
    else if (crackTimeSeconds < 31536000) crackTime.textContent = `${Math.round(crackTimeSeconds / 86400)} days`;
    else crackTime.textContent = `${(crackTimeSeconds / 31536000).toFixed(1)} years`;
    
    let strength = 0;
    let strengthPercent = 0;
    let strengthLevel = '';
    
    if (entropyValue < 28) {
      strength = 20;
      strengthLevel = 'Very Weak';
      strengthBar.style.background = '#f44336';
    } else if (entropyValue < 35) {
      strength = 40;
      strengthLevel = 'Weak';
      strengthBar.style.background = '#FF9800';
    } else if (entropyValue < 60) {
      strength = 60;
      strengthLevel = 'Good';
      strengthBar.style.background = '#FFC107';
    } else if (entropyValue < 80) {
      strength = 80;
      strengthLevel = 'Strong';
      strengthBar.style.background = '#8BC34A';
    } else {
      strength = 100;
      strengthLevel = 'Very Strong';
      strengthBar.style.background = '#4CAF50';
    }
    
    strengthPercent = Math.min(100, (entropyValue / 128) * 100);
    strengthBar.style.width = `${strengthPercent}%`;
    strengthText.textContent = `${strengthLevel} Password (${strengthPercent.toFixed(0)}%)`;
    strengthText.style.color = strengthBar.style.background;
  }
  
  passwordLength.addEventListener('input', () => {
    lengthValue.textContent = passwordLength.value;
    generateSecurePassword();
  });
  
  [useUppercase, useLowercase, useNumbers, useSymbols].forEach(checkbox => {
    checkbox.addEventListener('change', generateSecurePassword);
  });
  
  generatePassword.addEventListener('click', generateSecurePassword);
  copyPassword.addEventListener('click', () => {
    copyToClipboard(generatedPassword.value);
    showNotification('Password copied to clipboard!', 'success');
  });
  
  generateSecurePassword();
  
  // ==================== LOREM IPSUM GENERATOR ====================
  const loremWords = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'ut', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi', 'ut', 'aliquip', 'ex', 'ea', 'commodo', 'consequat', 'duis', 'aute', 'irure', 'dolor', 'in', 'reprehenderit', 'voluptate', 'velit', 'esse', 'cillum', 'dolore', 'eu', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint', 'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'in', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'
  ];
  
  function generateLoremParagraph(sentences = 5) {
    const paragraph = [];
    for (let i = 0; i < sentences; i++) {
      const wordCount = Math.floor(Math.random() * 15) + 5;
      const sentence = [];
      for (let j = 0; j < wordCount; j++) {
        sentence.push(loremWords[Math.floor(Math.random() * loremWords.length)]);
      }
      paragraph.push(sentence.join(' ') + '.');
    }
    return paragraph.join(' ');
  }
  
  const loremType = document.getElementById('loremType');
  const loremCount = document.getElementById('loremCount');
  const countValue = document.getElementById('countValue');
  const includeHtml = document.getElementById('includeHtml');
  const generateLorem = document.getElementById('generateLorem');
  const copyLorem = document.getElementById('copyLorem');
  const loremOutput = document.getElementById('loremOutput');
  
  loremCount.addEventListener('input', () => {
    countValue.textContent = loremCount.value;
  });
  
  generateLorem.addEventListener('click', () => {
    const type = loremType.value;
    const count = parseInt(loremCount.value);
    const withHtml = includeHtml.checked;
    let output = '';
    
    if (type === 'paragraphs') {
      for (let i = 0; i < count; i++) {
        const paragraph = generateLoremParagraph(3 + Math.floor(Math.random() * 4));
        if (withHtml) {
          output += `<p>${paragraph}</p>\n\n`;
        } else {
          output += `${paragraph}\n\n`;
        }
      }
    } else if (type === 'sentences') {
      const sentences = [];
      for (let i = 0; i < count; i++) {
        sentences.push(generateLoremParagraph(1));
      }
      output = sentences.join(' ');
    } else if (type === 'words') {
      const words = [];
      for (let i = 0; i < count; i++) {
        words.push(loremWords[Math.floor(Math.random() * loremWords.length)]);
      }
      output = words.join(' ');
    } else if (type === 'list') {
      if (withHtml) output = '<ul>\n';
      for (let i = 0; i < count; i++) {
        const item = generateLoremParagraph(1);
        if (withHtml) {
          output += `  <li>${item}</li>\n`;
        } else {
          output += `• ${item}\n`;
        }
      }
      if (withHtml) output += '</ul>';
    } else if (type === 'heading') {
      for (let i = 0; i < count; i++) {
        const heading = loremWords.slice(0, 3 + Math.floor(Math.random() * 5)).join(' ').replace(/^\w/, c => c.toUpperCase());
        const content = generateLoremParagraph(2 + Math.floor(Math.random() * 3));
        if (withHtml) {
          output += `<h2>${heading}</h2>\n<p>${content}</p>\n\n`;
        } else {
          output += `${heading.toUpperCase()}\n${content}\n\n`;
        }
      }
    }
    
    if (withHtml) {
      loremOutput.innerHTML = output;
    } else {
      loremOutput.textContent = output;
    }
  });
  
  copyLorem.addEventListener('click', () => {
    const text = loremOutput.textContent || loremOutput.innerText;
    copyToClipboard(text);
    showNotification('Lorem ipsum copied to clipboard!', 'success');
  });
  
  generateLorem.click();
  
  // ==================== META TAGS GENERATOR ====================
  const metaTitle = document.getElementById('metaTitle');
  const metaDescription = document.getElementById('metaDescription');
  const metaKeywords = document.getElementById('metaKeywords');
  const canonicalUrl = document.getElementById('canonicalUrl');
  const robotsDirective = document.getElementById('robotsDirective');
  const language = document.getElementById('language');
  const generatedMeta = document.getElementById('generatedMeta');
  const copyMeta = document.getElementById('copyMeta');
  const previewMeta = document.getElementById('previewMeta');
  const titleLengthSpan = document.getElementById('titleLength');
  const descLengthSpan = document.getElementById('descLength');
  
  function updateMetaTags() {
    let meta = '';
    
    if (metaTitle.value) {
      meta += `<!-- Title Tag (50-60 characters) -->\n<title>${escapeHtml(metaTitle.value)}</title>\n\n`;
    }
    
    if (metaDescription.value) {
      meta += `<!-- Meta Description (150-160 characters) -->\n<meta name="description" content="${escapeHtml(metaDescription.value)}">\n\n`;
    }
    
    if (metaKeywords.value) {
      meta += `<!-- Meta Keywords -->\n<meta name="keywords" content="${escapeHtml(metaKeywords.value)}">\n\n`;
    }
    
    if (canonicalUrl.value) {
      meta += `<!-- Canonical URL -->\n<link rel="canonical" href="${escapeHtml(canonicalUrl.value)}">\n\n`;
    }
    
    meta += `<!-- Robots Directive -->\n<meta name="robots" content="${escapeHtml(robotsDirective.value)}">\n\n`;
    
    meta += `<!-- Viewport for Mobile -->\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n\n`;
    
    if (language.value) {
      meta += `<!-- Language -->\n<meta name="language" content="${escapeHtml(language.value)}">\n\n`;
    }
    
    meta += `<!-- Charset -->\n<meta charset="UTF-8">\n\n`;
    
    meta += `<!-- Open Graph Tags for Social Media -->\n<meta property="og:title" content="${escapeHtml(metaTitle.value || 'Page Title')}">\n`;
    meta += `<meta property="og:description" content="${escapeHtml(metaDescription.value || 'Page Description')}">\n`;
    meta += `<meta property="og:type" content="website">\n\n`;
    
    meta += `<!-- Twitter Card Tags -->\n<meta name="twitter:card" content="summary_large_image">\n`;
    meta += `<meta name="twitter:title" content="${escapeHtml(metaTitle.value || 'Page Title')}">\n`;
    meta += `<meta name="twitter:description" content="${escapeHtml(metaDescription.value || 'Page Description')}">\n`;
    
    generatedMeta.value = meta;
  }
  
  function escapeHtml(str) {
    return str.replace(/[&<>]/g, function(m) {
      if (m === '&') return '&amp;';
      if (m === '<') return '&lt;';
      if (m === '>') return '&gt;';
      return m;
    });
  }
  
  metaTitle.addEventListener('input', () => {
    const length = metaTitle.value.length;
    titleLengthSpan.innerHTML = `<span style="color: ${length < 30 ? '#f44336' : length > 60 ? '#FF9800' : '#4CAF50'}">${length} characters</span> (Recommended: 50-60)`;
    updateMetaTags();
  });
  
  metaDescription.addEventListener('input', () => {
    const length = metaDescription.value.length;
    descLengthSpan.innerHTML = `<span style="color: ${length < 120 ? '#f44336' : length > 160 ? '#FF9800' : '#4CAF50'}">${length} characters</span> (Recommended: 150-160)`;
    updateMetaTags();
  });
  
  [metaKeywords, canonicalUrl, robotsDirective, language].forEach(field => {
    field.addEventListener('input', updateMetaTags);
  });
  
  copyMeta.addEventListener('click', () => {
    copyToClipboard(generatedMeta.value);
    showNotification('Meta tags copied to clipboard!', 'success');
  });
  
  previewMeta.addEventListener('click', () => {
    const previewWindow = window.open('', '_blank');
    previewWindow.document.write(`
      <html>
        <head>
          <title>${metaTitle.value || 'Page Title'}</title>
          <meta name="description" content="${metaDescription.value || 'Page Description'}">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
            .preview-card { background: white; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; margin-bottom: 20px; }
            .preview-title { color: #1a0dab; font-size: 20px; text-decoration: none; margin-bottom: 8px; }
            .preview-url { color: #006621; font-size: 14px; margin-bottom: 8px; }
            .preview-desc { color: #545454; font-size: 14px; line-height: 1.4; }
          </style>
        </head>
        <body>
          <h2>🔍 Google Search Preview</h2>
          <div class="preview-card">
            <div class="preview-title">${metaTitle.value || 'Page Title'}</div>
            <div class="preview-url">${canonicalUrl.value || window.location.href || 'https://example.com/page'}</div>
            <div class="preview-desc">${metaDescription.value || 'Page Description'}</div>
          </div>
          <p style="font-size: 12px; color: #666; margin-top: 20px;">This is how your page will appear in Google search results.</p>
        </body>
      </html>
    `);
    previewWindow.document.close();
  });
  
  updateMetaTags();
  
  // ==================== SCHEMA MARKUP GENERATOR ====================
  const schemaType = document.getElementById('schemaType');
  const schemaFields = document.getElementById('schemaFields');
  const generatedSchema = document.getElementById('generatedSchema');
  const copySchema = document.getElementById('copySchema');
  const validateSchema = document.getElementById('validateSchema');
  
  const schemaTemplates = {
    article: (data) => ({
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": data.headline || "Article Title",
      "description": data.description || "Article description",
      "author": {
        "@type": "Person",
        "name": data.author || "Author Name"
      },
      "datePublished": data.datePublished || new Date().toISOString().split('T')[0],
      "dateModified": data.dateModified || new Date().toISOString().split('T')[0],
      "mainEntityOfPage": data.url || window.location.href
    }),
    localbusiness: (data) => ({
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": data.name || "Business Name",
      "description": data.description || "Business description",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": data.streetAddress || "123 Main St",
        "addressLocality": data.city || "City",
        "addressRegion": data.state || "State",
        "postalCode": data.zip || "12345",
        "addressCountry": data.country || "US"
      },
      "telephone": data.phone || "+1-555-555-5555",
      "email": data.email || "contact@example.com",
      "url": data.url || window.location.href
    }),
    product: (data) => ({
      "@context": "https://schema.org",
      "@type": "Product",
      "name": data.name || "Product Name",
      "description": data.description || "Product description",
      "sku": data.sku || "SKU-123",
      "brand": {
        "@type": "Brand",
        "name": data.brand || "Brand Name"
      },
      "offers": {
        "@type": "Offer",
        "price": data.price || "99.99",
        "priceCurrency": data.currency || "USD",
        "availability": "https://schema.org/InStock"
      }
    }),
    faqpage: (data) => ({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": data.q1 || "Question 1?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": data.a1 || "Answer to question 1"
          }
        },
        {
          "@type": "Question",
          "name": data.q2 || "Question 2?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": data.a2 || "Answer to question 2"
          }
        }
      ]
    }),
    organization: (data) => ({
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": data.name || "Organization Name",
      "url": data.url || window.location.href,
      "logo": data.logo || "https://example.com/logo.png",
      "sameAs": data.socialMedia ? data.socialMedia.split(',').map(s => s.trim()) : [
        "https://www.facebook.com/example",
        "https://www.twitter.com/example",
        "https://www.linkedin.com/company/example"
      ]
    })
  };
  
  function updateSchemaFields() {
    const type = schemaType.value;
    let html = '';
    
    const templates = {
      article: `
        <div style="margin-bottom: 12px;"><label>Headline:</label><input type="text" id="schema_headline" placeholder="Article Title" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;"></div>
        <div style="margin-bottom: 12px;"><label>Description:</label><textarea id="schema_description" rows="2" placeholder="Article Description" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;"></textarea></div>
        <div style="margin-bottom: 12px;"><label>Author:</label><input type="text" id="schema_author" placeholder="Author Name" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;"></div>
        <div style="margin-bottom: 12px;"><label>Date Published:</label><input type="date" id="schema_datePublished" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;"></div>
      `,
      localbusiness: `
        <div style="margin-bottom: 12px;"><label>Business Name:</label><input type="text" id="schema_name" placeholder="Business Name" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;"></div>
        <div style="margin-bottom: 12px;"><label>Description:</label><textarea id="schema_description" rows="2" placeholder="Business Description" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;"></textarea></div>
        <div style="margin-bottom: 12px;"><label>Street Address:</label><input type="text" id="schema_streetAddress" placeholder="123 Main St" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;"></div>
        <div style="margin-bottom: 12px;"><label>City:</label><input type="text" id="schema_city" placeholder="City" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;"></div>
        <div style="margin-bottom: 12px;"><label>Phone:</label><input type="text" id="schema_phone" placeholder="+1-555-555-5555" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;"></div>
        <div style="margin-bottom: 12px;"><label>Email:</label><input type="email" id="schema_email" placeholder="contact@example.com" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;"></div>
      `,
      product: `
        <div style="margin-bottom: 12px;"><label>Product Name:</label><input type="text" id="schema_name" placeholder="Product Name" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;"></div>
        <div style="margin-bottom: 12px;"><label>Description:</label><textarea id="schema_description" rows="2" placeholder="Product Description" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;"></textarea></div>
        <div style="margin-bottom: 12px;"><label>Price:</label><input type="text" id="schema_price" placeholder="99.99" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;"></div>
        <div style="margin-bottom: 12px;"><label>Currency:</label><select id="schema_currency" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;"><option>USD</option><option>EUR</option><option>GBP</option></select></div>
        <div style="margin-bottom: 12px;"><label>Brand:</label><input type="text" id="schema_brand" placeholder="Brand Name" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;"></div>
      `,
      faqpage: `
        <div style="margin-bottom: 12px;"><label>Question 1:</label><input type="text" id="schema_q1" placeholder="Frequently asked question 1?" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;"></div>
        <div style="margin-bottom: 12px;"><label>Answer 1:</label><textarea id="schema_a1" rows="2" placeholder="Answer to question 1" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;"></textarea></div>
        <div style="margin-bottom: 12px;"><label>Question 2:</label><input type="text" id="schema_q2" placeholder="Frequently asked question 2?" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;"></div>
        <div style="margin-bottom: 12px;"><label>Answer 2:</label><textarea id="schema_a2" rows="2" placeholder="Answer to question 2" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;"></textarea></div>
      `,
      organization: `
        <div style="margin-bottom: 12px;"><label>Organization Name:</label><input type="text" id="schema_name" placeholder="Organization Name" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;"></div>
        <div style="margin-bottom: 12px;"><label>Logo URL:</label><input type="url" id="schema_logo" placeholder="https://example.com/logo.png" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;"></div>
        <div style="margin-bottom: 12px;"><label>Social Media URLs (comma separated):</label><textarea id="schema_socialMedia" rows="2" placeholder="https://facebook.com/example, https://twitter.com/example" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;"></textarea></div>
      `
    };
    
    html = templates[type] || '<div>Select a schema type to configure</div>';
    schemaFields.innerHTML = html;
    updateSchemaMarkup();
  }
  
  function updateSchemaMarkup() {
    const type = schemaType.value;
    const template = schemaTemplates[type];
    if (!template) return;
    
    const data = {};
    const inputs = schemaFields.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      const id = input.id;
      if (id) {
        const fieldName = id.replace('schema_', '');
        data[fieldName] = input.value;
      }
    });
    
    const schema = template(data);
    generatedSchema.value = JSON.stringify(schema, null, 2);
  }
  
  schemaType.addEventListener('change', () => {
    updateSchemaFields();
  });
  
  schemaFields.addEventListener('input', updateSchemaMarkup);
  
  copySchema.addEventListener('click', () => {
    copyToClipboard(generatedSchema.value);
    showNotification('Schema markup copied to clipboard!', 'success');
  });
  
  validateSchema.addEventListener('click', () => {
    window.open('https://search.google.com/test/rich-results', '_blank');
  });
  
  updateSchemaFields();
  
  // ==================== TEXT CLEANER FUNCTIONS ====================
  const dirtyText = document.getElementById('dirtyText');
  const cleanText = document.getElementById('cleanText');
  const textStats = document.getElementById('textStats');
  
  function updateCleanText() {
    let text = dirtyText.value;
    cleanText.value = text;
    updateStats(text);
  }
  
  function updateStats(text) {
    const chars = text.length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const lines = text.split(/\n/).length;
    textStats.innerHTML = `
      <div>Characters: ${chars.toLocaleString()}</div>
      <div>Words: ${words.toLocaleString()}</div>
      <div>Lines: ${lines.toLocaleString()}</div>
    `;
  }
  
  const cleaningFunctions = {
    removeExtraSpaces: (text) => text.replace(/\s+/g, ' '),
    removeLineBreaks: (text) => text.replace(/\r?\n|\r/g, ' '),
    removeHtmlTags: (text) => text.replace(/<[^>]*>/g, ''),
    removeSpecialChars: (text) => text.replace(/[^\w\s]/g, ''),
    trimWhitespace: (text) => text.trim(),
    convertToAscii: (text) => text.replace(/[^\x00-\x7F]/g, ''),
    lowercase: (text) => text.toLowerCase(),
    uppercase: (text) => text.toUpperCase(),
    capitalizeWords: (text) => text.replace(/\b\w/g, c => c.toUpperCase())
  };
  
  document.querySelectorAll('.cleaner-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.id;
      if (action === 'resetText') {
        dirtyText.value = '';
        cleanText.value = '';
        updateStats('');
      } else if (cleaningFunctions[action]) {
        cleanText.value = cleaningFunctions[action](dirtyText.value);
        updateStats(cleanText.value);
      }
      updateStats(cleanText.value);
    });
  });
  
  dirtyText.addEventListener('input', () => {
    cleanText.value = dirtyText.value;
    updateStats(dirtyText.value);
  });
  
  const copyCleanText = document.getElementById('copyCleanText');
  const downloadCleanText = document.getElementById('downloadCleanText');
  
  copyCleanText.addEventListener('click', () => {
    copyToClipboard(cleanText.value);
    showNotification('Cleaned text copied!', 'success');
  });
  
  downloadCleanText.addEventListener('click', () => {
    const blob = new Blob([cleanText.value], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cleaned-text.txt';
    a.click();
    URL.revokeObjectURL(url);
  });
  
  // ==================== HTML ENCODER/DECODER FUNCTIONS ====================
  const encoderInput = document.getElementById('encoderInput');
  const encoderOutput = document.getElementById('encoderOutput');
  const encodeHtml = document.getElementById('encodeHtml');
  const decodeHtml = document.getElementById('decodeHtml');
  const copyEncoded = document.getElementById('copyEncoded');
  const clearEncoder = document.getElementById('clearEncoder');
  
  function htmlEncode(str) {
    return str.replace(/[&<>]/g, function(m) {
      if (m === '&') return '&amp;';
      if (m === '<') return '&lt;';
      if (m === '>') return '&gt;';
      return m;
    });
  }
  
  function htmlDecode(str) {
    return str.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
  }
  
  encodeHtml.addEventListener('click', () => {
    encoderOutput.value = htmlEncode(encoderInput.value);
    showNotification('HTML encoded!', 'success');
  });
  
  decodeHtml.addEventListener('click', () => {
    encoderOutput.value = htmlDecode(encoderInput.value);
    showNotification('HTML decoded!', 'success');
  });
  
  copyEncoded.addEventListener('click', () => {
    copyToClipboard(encoderOutput.value);
    showNotification('Output copied!', 'success');
  });
  
  clearEncoder.addEventListener('click', () => {
    encoderInput.value = '';
    encoderOutput.value = '';
  });
  
  // Helper functions
  function copyToClipboard(text) {
    return new Promise((resolve, reject) => {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(resolve).catch(reject);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        const success = document.execCommand('copy');
        document.body.removeChild(textarea);
        success ? resolve() : reject();
      }
    });
  }
  
  function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      padding: 12px 20px;
      background: ${type === 'success' ? '#4CAF50' : '#f44336'};
      color: white;
      border-radius: 8px;
      z-index: 100001;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 13px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      opacity: 0;
      transition: opacity 0.3s;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.style.opacity = '1', 10);
    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
  
  // Close button
  document.getElementById('closeUtilities').addEventListener('click', () => {
    document.body.removeChild(overlay);
  });
  
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      document.body.removeChild(overlay);
    }
  });
}

// ==================== NEW SEO UPGRADES ====================

// 1. Keyword Density Analyzer
function analyzeKeywordDensity() {
  const text = document.body.innerText.toLowerCase().replace(/[^a-z\s]/g, '');
  const words = text.split(/\s+/).filter(w => w.length > 2); // filter tiny words
  
  // Common stop words to ignore
  const stopWords = new Set(['the', 'and', 'are', 'for', 'that', 'this', 'with', 'you', 'was', 'have', 'from', 'but', 'they', 'will', 'your', 'about', 'can', 'has', 'not']);
  
  const wordCounts = {};
  words.forEach(word => {
    if (!stopWords.has(word)) {
      wordCounts[word] = (wordCounts[word] || 0) + 1;
    }
  });

  const sortedWords = Object.entries(wordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15); // Top 15

  const content = document.createElement('div');
  let html = `
    <div style="margin-bottom: 15px; font-size: 13px; color: #666;">
      Top 15 single-word keywords found on this page (excluding common stop words). Total eligible words analyzed: <strong>${words.length}</strong>.
    </div>
    <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
      <thead>
        <tr style="background: #f8f9fa;">
          <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Keyword</th>
          <th style="padding: 10px; border: 1px solid #ddd; text-align: center;">Count</th>
          <th style="padding: 10px; border: 1px solid #ddd; text-align: right;">Density</th>
        </tr>
      </thead>
      <tbody>
  `;

  sortedWords.forEach(([word, count]) => {
    const density = ((count / words.length) * 100).toFixed(2);
    let densityColor = density > 5 ? '#f44336' : (density > 2 ? '#4CAF50' : '#333'); // Highlight over-optimized keywords
    
    html += `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; text-transform: capitalize;"><strong>${escapeHtml(word)}</strong></td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${count}</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: right; color: ${densityColor}; font-weight: bold;">${density}%</td>
      </tr>
    `;
  });

  html += `</tbody></table>`;
  content.innerHTML = html;
  
  createModal('Keyword Density Analyzer', content);
}

// 2. SERP Preview Visualizer
function showSerpPreview() {
  const currentTitle = document.title || '';
  const metaDescTag = document.querySelector('meta[name="description"]');
  const currentDesc = metaDescTag ? metaDescTag.getAttribute('content') : '';
  const currentUrl = window.location.href;

  const content = document.createElement('div');
  content.innerHTML = `
    <div style="margin-bottom: 20px;">
      <label style="display: block; font-weight: 600; margin-bottom: 5px; font-size: 13px;">Page Title (Target: 50-60 chars)</label>
      <input type="text" id="simTitle" value="${escapeHtml(currentTitle)}" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; margin-bottom: 5px;">
      <div id="simTitleCount" style="font-size: 11px; color: #666;">${currentTitle.length} chars</div>
    </div>
    
    <div style="margin-bottom: 20px;">
      <label style="display: block; font-weight: 600; margin-bottom: 5px; font-size: 13px;">Meta Description (Target: 150-160 chars)</label>
      <textarea id="simDesc" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; min-height: 60px; margin-bottom: 5px;">${escapeHtml(currentDesc)}</textarea>
      <div id="simDescCount" style="font-size: 11px; color: #666;">${currentDesc.length} chars</div>
    </div>

    <h3 style="font-size: 14px; margin-bottom: 10px; color: #333; border-bottom: 1px solid #eee; padding-bottom: 5px;">Live Google Desktop Preview</h3>
    
    <div style="background: #fff; border: 1px solid #eee; padding: 15px; border-radius: 8px; box-shadow: 0 1px 4px rgba(0,0,0,0.1); font-family: arial, sans-serif;">
      <div style="color: #202124; font-size: 14px; display: flex; align-items: center; gap: 8px; margin-bottom: 5px;">
        <div style="background: #f1f3f4; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; font-size: 12px;">🌐</div>
        <div>
          <span style="display: block; line-height: 1.2;">${window.location.hostname}</span>
          <span style="color: #4d5156; font-size: 12px;">${escapeHtml(currentUrl)}</span>
        </div>
      </div>
      <div id="previewTitle" style="color: #1a0dab; font-size: 20px; line-height: 1.3; margin-bottom: 4px; cursor: pointer; text-decoration: none;">
        ${escapeHtml(currentTitle) || 'Your Page Title Goes Here'}
      </div>
      <div id="previewDesc" style="color: #4d5156; font-size: 14px; line-height: 1.58;">
        ${escapeHtml(currentDesc) || 'Your meta description will appear here. Make it compelling to improve your click-through rate (CTR).'}
      </div>
    </div>
  `;

  createModal('SERP Preview Tool', content);

  // Live Updating Logic
  const simTitle = document.getElementById('simTitle');
  const simDesc = document.getElementById('simDesc');
  const previewTitle = document.getElementById('previewTitle');
  const previewDesc = document.getElementById('previewDesc');
  const simTitleCount = document.getElementById('simTitleCount');
  const simDescCount = document.getElementById('simDescCount');

  const updatePreview = () => {
    let t = simTitle.value;
    let d = simDesc.value;
    
    simTitleCount.textContent = `${t.length} chars`;
    simTitleCount.style.color = (t.length < 30 || t.length > 60) ? '#f44336' : '#4CAF50';
    
    simDescCount.textContent = `${d.length} chars`;
    simDescCount.style.color = (d.length < 120 || d.length > 160) ? '#f44336' : '#4CAF50';

    // Truncate for realistic Google preview
    previewTitle.textContent = t.length > 65 ? t.substring(0, 65) + '...' : (t || 'Your Page Title Goes Here');
    previewDesc.textContent = d.length > 160 ? d.substring(0, 160) + '...' : (d || 'Your meta description will appear here.');
  };

  simTitle.addEventListener('input', updatePreview);
  simDesc.addEventListener('input', updatePreview);
  updatePreview();
}

// 3. Broken Link Checker
async function checkBrokenLinks() {
  const links = Array.from(document.querySelectorAll('a[href]')).filter(link => {
    return !link.href.startsWith('javascript:') && 
           !link.href.startsWith('mailto:') && 
           !link.href.startsWith('tel:');
  });
  
  let checked = 0;
  let broken = 0;
  const BATCH_SIZE = 5; // Process 5 links concurrently
  
  // Create UI overlay securely
  const statusDiv = document.createElement('div');
  statusDiv.style.cssText = `
    position: fixed; top: 20px; right: 20px; background: #1a1a1a; color: #fff; 
    padding: 15px; border-radius: 8px; z-index: 100000; font-family: sans-serif;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3); border-left: 4px solid #FF9800;
  `;
  
  const titleStr = document.createElement('strong');
  titleStr.textContent = '🚨 Broken Link Checker';
  statusDiv.appendChild(titleStr);
  statusDiv.appendChild(document.createElement('br'));
  
  const statusText = document.createElement('span');
  statusText.id = 'bl-status';
  statusText.textContent = 'Initializing...';
  statusDiv.appendChild(statusText);
  document.body.appendChild(statusDiv);

  // Helper function to check a single link
  const checkLink = async (link) => {
    try {
      link.style.border = '2px dashed #ff9800';
      await fetch(link.href, { method: 'HEAD', mode: 'no-cors' });
      link.style.border = '2px solid #4CAF50'; 
      link.style.backgroundColor = '#e8f5e9';
    } catch (e) {
      broken++;
      link.style.border = '2px solid #f44336';
      link.style.backgroundColor = '#ffebee';
      link.title = "Warning: Link may be broken or blocked by CORS";
    } finally {
      checked++;
      statusText.textContent = `Checked: ${checked} | Broken/Blocked: ${broken}`;
    }
  };

  // Process in batches
  for (let i = 0; i < links.length; i += BATCH_SIZE) {
    const batch = links.slice(i, i + BATCH_SIZE);
    await Promise.all(batch.map(link => checkLink(link)));
  }

  statusDiv.style.borderLeftColor = broken > 0 ? '#f44336' : '#4CAF50';
  statusText.innerHTML = `<strong>Done!</strong> Checked ${checked} links.<br>${broken} returned errors.`;
  
  setTimeout(() => {
    statusDiv.style.opacity = '0';
    setTimeout(() => statusDiv.remove(), 500);
  }, 5000);
}

// ==================== FULL PAGE CAPTURE ====================

async function captureFullPage() {
  showNotification('📸 Capturing full page... Please do not scroll!', 'warning');

  // 1. Setup variables and hide scrollbars to avoid capturing them
  const originalOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';

  const totalHeight = Math.max(
    document.body.scrollHeight, document.documentElement.scrollHeight,
    document.body.offsetHeight, document.documentElement.offsetHeight,
    document.body.clientHeight, document.documentElement.clientHeight
  );
  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;
  
  const captures = [];
  const scrollSteps = [];
  
  // Calculate exactly where we need to scroll
  let y = 0;
  while (y < totalHeight) {
    scrollSteps.push(y);
    y += viewportHeight;
  }
  
  // Adjust the last step so we don't scroll past the bottom and get overlapping images
  if (scrollSteps.length > 1) {
    const lastMaxScroll = totalHeight - viewportHeight;
    scrollSteps[scrollSteps.length - 1] = lastMaxScroll;
  }

  // 2. Scroll and capture process
  for (let i = 0; i < scrollSteps.length; i++) {
    const currentY = scrollSteps[i];
    window.scrollTo(0, currentY);
    
    // Wait a moment for sticky headers to settle and lazy-loaded images to appear
    await new Promise(r => setTimeout(r, 600)); 

    // Ask background.js to take a screenshot
    const response = await new Promise(resolve => {
      chrome.runtime.sendMessage({ action: 'captureVisibleTab' }, resolve);
    });

    captures.push({
      dataUrl: response.dataUrl,
      y: currentY
    });
  }

  // 3. Restore the page's original state
  document.body.style.overflow = originalOverflow;
  window.scrollTo(0, 0);
  showNotification('Stitching images together...', 'info');

  // 4. Stitch everything together on an HTML5 Canvas
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  // Handle high-DPI (Retina) displays by checking the device pixel ratio
  const ratio = window.devicePixelRatio || 1;
  canvas.width = viewportWidth * ratio;
  canvas.height = totalHeight * ratio;

  let loadedImages = 0;

  captures.forEach((capture) => {
    const img = new Image();
    img.onload = () => {
      // Draw the image at the exact Y coordinate it was captured
      ctx.drawImage(img, 0, capture.y * ratio, viewportWidth * ratio, viewportHeight * ratio);
      loadedImages++;

      // 5. When all images are drawn, trigger the download
      if (loadedImages === captures.length) {
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          // Create a clean filename
          const cleanTitle = (document.title || 'screenshot').replace(/[^a-z0-9]/gi, '_').toLowerCase();
          a.download = `full_page_${cleanTitle}.png`;
          a.click();
          URL.revokeObjectURL(url);
          
          showNotification('✅ Full page capture saved successfully!', 'success');
        }, 'image/png');
      }
    };
    img.src = capture.dataUrl;
  });
}
// ==================== DEEP GOOGLE DOMAIN EXTRACTOR ====================

function extractBulkGoogleDomains() {
  const urlParams = new URLSearchParams(window.location.search);
  const originalQuery = urlParams.get('q');
  
  if (!originalQuery || !window.location.hostname.includes('google.')) {
    showNotification('Please run this on a Google search results page', 'error');
    return;
  }

  const allDomains = new Set();
  const excludedExtensions = ['.edu', '.gov', '.edu.ph', '.gov.ph', '.wordpress.com', '.blogspot.com'];
  const excludedKeywords = [
    'google.com', 'youtube.com', 'facebook.com', 'twitter.com', 'instagram.com', 
    'linkedin.com', 'pinterest.com', 'reddit.com', 'quora.com', 'medium.com', 
    'wikipedia.org', 'amazon.com', 'ebay.com', 'apple.com', 'microsoft.com', 
    'github.com', 'stackoverflow.com', 'ahref.com', 'ahrefs.com'
  ];
  
  const maxPages = 50;
  const baseUrl = window.location.href.split('&start=')[0].split('#')[0];
  const debugInfo = [];
  let extractionCancelled = false;
  let statusDiv = null;
  const totalDomainsCount = Math.floor(Math.random() * 500) + 200; // Estimated progress base

  function createStatusDiv() {
    const div = document.createElement('div');
    div.style.cssText = `
      position: fixed; top: 20px; right: 20px; background: #1a1a2e; color: #eee; 
      padding: 15px; border-radius: 8px; z-index: 100000; font-family: -apple-system, sans-serif; 
      font-size: 13px; min-width: 280px; box-shadow: 0 8px 24px rgba(0,0,0,0.3); 
      border-left: 4px solid #4285f4;
    `;
    return div;
  }

  function updateStatus(message) {
    if (!statusDiv) return;
    const progress = Math.round((allDomains.size / totalDomainsCount) * 100) || 0;
    
    statusDiv.innerHTML = `
      <div style="font-weight:600; margin-bottom:8px; font-size:14px;">🌐 Deep Domain Extractor</div>
      <div style="margin-bottom:8px; color:#aaa;">${message}</div>
      <div style="background:#333; border-radius:4px; margin:8px 0; height:6px; overflow:hidden;">
        <div style="background:#4285f4; width:${Math.min(progress, 100)}%; height:100%; border-radius:4px; transition:width 0.3s;"></div>
      </div>
      <div style="display:flex; justify-content:space-between; margin-bottom:12px; font-size:12px;">
        <span>Domains: <strong>${allDomains.size}</strong></span>
        <span>Pages: <strong>${debugInfo.length}</strong></span>
      </div>
      <button id="cancelDeepExtract" style="width:100%; padding:6px; background:#dc3545; color:white; border:none; border-radius:4px; cursor:pointer; font-weight:bold;">Cancel Extraction</button>
    `;

    document.getElementById('cancelDeepExtract').addEventListener('click', () => {
      extractionCancelled = true;
      if (statusDiv && statusDiv.parentElement) statusDiv.remove();
      showNotification('Extraction cancelled.', 'warning');
      if (allDomains.size > 0) showResults();
    });
  }

  function extractDomainsFromHtml(html, pageNum) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const anchors = tempDiv.querySelectorAll('a[href]');
    let newDomains = 0;

    anchors.forEach(anchor => {
      const href = anchor.getAttribute('href');
      if (href) {
        try {
          let finalUrl = null;
          if (href.startsWith('/url?')) {
            const params = new URLSearchParams(href.substring(5));
            finalUrl = params.get('q') || params.get('url');
          } else if (href.startsWith('http') && !href.includes('google.com/search')) {
            finalUrl = href;
          }

          if (finalUrl) {
            const url = new URL(finalUrl);
            const domain = url.hostname.replace(/^www\./, '').toLowerCase();
            let isExcluded = false;

            if (excludedExtensions.some(ext => domain.endsWith(ext))) isExcluded = true;
            if (!isExcluded && excludedKeywords.some(kw => domain.includes(kw))) isExcluded = true;

            if (!isExcluded && domain && domain.length > 0 && domain.includes('.')) {
              if (!allDomains.has(domain)) {
                allDomains.add(domain);
                newDomains++;
              }
            }
          }
        } catch (e) {}
      }
    });

    debugInfo.push({ page: pageNum + 1, newDomains: newDomains, totalUnique: allDomains.size });
    return newDomains;
  }

  function fetchPage(pageNum) {
    if (extractionCancelled) return;
    const startNum = pageNum * 10;
    const url = baseUrl + '&start=' + startNum;
    
    updateStatus(`Fetching page ${pageNum + 1}/${maxPages}...`);
    
    fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': navigator.userAgent,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      },
      mode: 'cors',
      credentials: 'include'
    }).then(response => {
      if (!response.ok) throw new Error('HTTP ' + response.status);
      return response.text();
    }).then(html => {
      if (extractionCancelled) return;
      const newDomains = extractDomainsFromHtml(html, pageNum);
      updateStatus(`Page ${pageNum + 1} complete (+${newDomains} new)`);
      
      const hasNext = html.includes('Next</span>') || html.includes('aria-label="Next"') || html.includes('id="pnnext"') || html.includes('&start=' + (startNum + 10));
      const hasResults = !html.includes('did not match any documents');
      
      if (hasNext && hasResults && pageNum < maxPages - 1) {
        setTimeout(() => { fetchPage(pageNum + 1); }, Math.random() * 800 + 400);
      } else {
        updateStatus('Complete! Showing results...');
        setTimeout(showResults, 500);
      }
    }).catch(error => {
      updateStatus(`Error on page ${pageNum + 1}, continuing...`);
      if (pageNum < maxPages - 1) {
        setTimeout(() => { fetchPage(pageNum + 1); }, 2000);
      } else {
        setTimeout(showResults, 500);
      }
    });
  }

  function showResults() {
    if (statusDiv && statusDiv.parentElement) statusDiv.remove();
    
    if (allDomains.size === 0) {
      showNotification('No unique domains found.', 'error');
      return;
    }

    const sortedDomains = Array.from(allDomains).sort();
    const domainList = sortedDomains.join('\n');
    
    const outputWindow = window.open('', '_blank');
    if (!outputWindow) {
      alert('Popup blocked! Please allow popups to see your domains.');
      return;
    }

    const htmlContent = `<!DOCTYPE html>
    <html>
    <head>
      <title>Deep Extraction - ${sortedDomains.length} Domains</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px; background: #f9fafb; margin: 0; }
        h1 { color: #1a202c; font-size: 24px; margin-bottom: 10px; }
        .counter { color: #666; margin-bottom: 20px; font-size: 14px; }
        button { background: #4CAF50; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-size: 14px; margin-bottom: 20px; font-weight: bold; }
        button:hover { background: #45a049; }
        pre { background: white; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; white-space: pre-wrap; word-wrap: break-word; font-family: monospace; font-size: 13px; max-height: 70vh; overflow-y: auto; }
      </style>
    </head>
    <body>
      <h1>Deep Google Domain Extraction</h1>
      <div class="counter">Successfully scraped <strong>${sortedDomains.length}</strong> unique domains across ${debugInfo.length} pages.</div>
      <button onclick="copyAll()">📋 Copy All Domains</button>
      <pre>${sortedDomains.join('\n')}</pre>
      <script>
        function copyAll() {
          const text = '${domainList}';
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
              alert('Copied ' + ${sortedDomains.length} + ' domains!');
            });
          } else {
            prompt('Copy these domains:', text);
          }
        }
      </script>
    </body>
    </html>`;

    outputWindow.document.write(htmlContent);
    outputWindow.document.close();
  }

  // Start the process
  statusDiv = createStatusDiv();
  document.body.appendChild(statusDiv);
  updateStatus('Starting deep extraction...');
  
  setTimeout(() => {
    extractDomainsFromHtml(document.documentElement.innerHTML, -1); // Process current page
    fetchPage(0); // Begin fetching next pages
  }, 300);
}
// ==================== ALT TEXT GENERATOR ====================
function generateAltText() {
  const images = document.querySelectorAll('img');
  const results = [];
  
  images.forEach((img, index) => {
    const src = img.src || img.getAttribute('data-src') || '';
    const existingAlt = img.getAttribute('alt') || '';
    const filename = src.split('/').pop().split('?')[0] || 'image';
    const nameWithoutExt = filename.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
    
    // AI-powered suggestions based on context
    let suggestion = '';
    
    // Check for surrounding context
    const parent = img.closest('figure, div, a, picture');
    const nearbyText = parent?.textContent?.trim() || '';
    const caption = img.closest('figure')?.querySelector('figcaption')?.textContent || '';
    
    // Analyze image attributes
    const classes = img.className || '';
    const id = img.id || '';
    const ariaLabel = img.getAttribute('aria-label') || '';
    const title = img.title || '';
    
    // Generate smart suggestion
    if (existingAlt && existingAlt.length > 5) {
      suggestion = existingAlt;
    } else if (caption) {
      suggestion = caption.substring(0, 100);
    } else if (ariaLabel) {
      suggestion = ariaLabel;
    } else if (title) {
      suggestion = title;
    } else if (classes.includes('logo')) {
      const domain = window.location.hostname.replace('www.', '');
      suggestion = `${domain} logo`;
    } else if (classes.includes('avatar') || classes.includes('profile')) {
      suggestion = `Profile photo of ${nameWithoutExt}`;
    } else if (classes.includes('banner') || classes.includes('hero')) {
      suggestion = `Hero banner image for ${document.title}`;
    } else if (classes.includes('icon')) {
      suggestion = `${nameWithoutExt} icon`;
    } else if (classes.includes('product')) {
      suggestion = `Product image of ${nameWithoutExt}`;
    } else {
      // Contextual suggestion
      const contextWords = nearbyText.split(/\s+/).slice(0, 5).join(' ');
      if (contextWords.length > 10) {
        suggestion = `Image showing ${contextWords}`;
      } else {
        suggestion = nameWithoutExt.replace(/([A-Z])/g, ' $1').trim();
      }
    }
    
    // Clean up suggestion
    suggestion = suggestion
      .replace(/\s+/g, ' ')
      .replace(/^\d+[-_]/, '')
      .replace(/[-_]/g, ' ')
      .trim();
    
    // Capitalize first letter
    suggestion = suggestion.charAt(0).toUpperCase() + suggestion.slice(1);
    
    results.push({
      index: index + 1,
      src: src.substring(0, 80),
      filename: filename,
      existingAlt: existingAlt || '(missing)',
      suggestion: suggestion,
      needsAlt: !existingAlt || existingAlt.length < 5
    });
  });
  
  // Filter images that need alt text
  const needsAlt = results.filter(r => r.needsAlt);
  const hasAlt = results.filter(r => !r.needsAlt);
  
  // Create modal
  const content = document.createElement('div');
  content.innerHTML = `
    <div style="padding: 15px;">
      <div style="display: flex; gap: 20px; margin-bottom: 20px; border-bottom: 2px solid #e0e0e0; padding-bottom: 15px;">
        <div style="text-align: center;">
          <div style="font-size: 28px; font-weight: bold; color: #f44336;">${needsAlt.length}</div>
          <div style="color: #666; font-size: 12px;">Missing Alt Text</div>
        </div>
        <div style="text-align: center;">
          <div style="font-size: 28px; font-weight: bold; color: #4CAF50;">${hasAlt.length}</div>
          <div style="color: #666; font-size: 12px;">Has Alt Text</div>
        </div>
        <div style="text-align: center;">
          <div style="font-size: 28px; font-weight: bold; color: #667eea;">${results.length}</div>
          <div style="color: #666; font-size: 12px;">Total Images</div>
        </div>
      </div>
      
      <div style="margin-bottom: 15px;">
        <button id="copyAllAlts" style="padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 6px; cursor: pointer; margin-right: 10px;">
          📋 Copy All Suggestions
        </button>
        <button id="applyAllAlts" style="padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer;">
          ✨ Apply to Missing Alts
        </button>
      </div>
      
      <div style="max-height: 400px; overflow-y: auto;">
        ${needsAlt.length > 0 ? `
          <h4 style="margin: 15px 0 10px; color: #f44336;">⚠️ Images Missing Alt Text</h4>
          ${renderAltSuggestions(needsAlt)}
        ` : '<p style="color: #4CAF50; padding: 20px; text-align: center;">✅ All images have alt text!</p>'}
        
        ${hasAlt.length > 0 ? `
          <h4 style="margin: 20px 0 10px; color: #4CAF50;">✅ Images with Existing Alt Text</h4>
          ${renderAltSuggestions(hasAlt, true)}
        ` : ''}
      </div>
    </div>
  `;
  
  function renderAltSuggestions(items, readonly = false) {
    return items.map(item => `
      <div style="background: ${readonly ? '#f5f5f5' : '#fff3e0'}; padding: 15px; border-radius: 8px; margin-bottom: 12px; border-left: 4px solid ${readonly ? '#4CAF50' : '#f44336'};">
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
          <div style="flex: 1;">
            <div style="font-size: 12px; color: #666; margin-bottom: 5px;">
              <strong>Image #${item.index}:</strong> ${escapeHtml(item.filename)}
            </div>
            ${!readonly ? `
              <div style="margin-bottom: 10px;">
                <label style="display: block; font-size: 11px; color: #666; margin-bottom: 3px;">AI Suggestion:</label>
                <input type="text" class="alt-input" data-index="${item.index}" value="${escapeHtml(item.suggestion)}" 
                  style="width: 100%; padding: 8px; border: 2px solid #667eea; border-radius: 6px; font-size: 13px;">
              </div>
            ` : `
              <div style="color: #333; font-size: 13px; padding: 8px; background: white; border-radius: 6px;">
                <strong>Current:</strong> ${escapeHtml(item.existingAlt)}
              </div>
            `}
          </div>
          ${!readonly ? `
            <button class="copy-suggestion" data-text="${escapeHtml(item.suggestion)}" 
              style="margin-left: 10px; padding: 6px 12px; background: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 11px;">
              Copy
            </button>
          ` : ''}
        </div>
      </div>
    `).join('');
  }
  
  const modal = createModal('🖼️ AI Alt Text Generator', content);
  
  // Add event listeners
  setTimeout(() => {
    document.querySelectorAll('.copy-suggestion').forEach(btn => {
      btn.addEventListener('click', () => {
        copyToClipboard(btn.dataset.text);
        showNotification('Suggestion copied!', 'success');
      });
    });
    
    const copyAllBtn = document.getElementById('copyAllAlts');
    if (copyAllBtn) {
      copyAllBtn.addEventListener('click', () => {
        const allSuggestions = needsAlt.map(r => r.suggestion).join('\n');
        copyToClipboard(allSuggestions);
        showNotification(`Copied ${needsAlt.length} suggestions!`, 'success');
      });
    }
    
    const applyAllBtn = document.getElementById('applyAllAlts');
    if (applyAllBtn) {
      applyAllBtn.addEventListener('click', () => {
        const inputs = document.querySelectorAll('.alt-input');
        let applied = 0;
        inputs.forEach(input => {
          const index = parseInt(input.dataset.index) - 1;
          const img = document.querySelectorAll('img')[index];
          if (img && !img.getAttribute('alt')) {
            img.setAttribute('alt', input.value);
            applied++;
          }
        });
        showNotification(`Applied alt text to ${applied} images!`, 'success');
        modal.close();
      });
    }
  }, 100);
}
// ==================== AI META TAG GENERATOR ====================
function generateAIMetaTags() {
  const pageTitle = document.title;
  const h1 = document.querySelector('h1')?.textContent || '';
  const firstParagraph = document.querySelector('p')?.textContent || '';
  const bodyText = document.body.innerText.substring(0, 2000);
  
  // Extract key topics
  const words = bodyText.toLowerCase().match(/\b\w+\b/g) || [];
  const stopWords = new Set(['the', 'and', 'for', 'with', 'that', 'this', 'from', 'have', 'are']);
  const keywords = [...new Set(words.filter(w => w.length > 4 && !stopWords.has(w)))].slice(0, 10);
  
  // Generate title variations
  const titleVariations = [
    `${h1} | ${window.location.hostname.replace('www.', '')}`,
    `${h1}: ${keywords.slice(0, 3).join(' ')} Guide`,
    `Ultimate Guide to ${h1} (${new Date().getFullYear()})`,
    `${h1} - Everything You Need to Know`,
    `How to Master ${h1}: Complete Tutorial`,
    `${keywords.slice(0, 2).join(' ')} Tips: ${h1}`,
    `The Complete ${h1} Checklist for ${new Date().getFullYear()}`,
    `${h1} Made Simple: Step-by-Step Guide`
  ];
  
  // Generate meta descriptions
  const metaVariations = [
    `Learn everything about ${h1}. ${firstParagraph.substring(0, 100)}...`,
    `Discover ${keywords.slice(0, 3).join(', ')} and more in our comprehensive ${h1} guide. Expert tips and strategies.`,
    `Want to master ${h1}? Our complete guide covers ${keywords.slice(0, 4).join(', ')} and proven techniques.`,
    `${h1} explained: ${firstParagraph.substring(0, 120)}...`,
    `The ultimate resource for ${h1}. Includes ${keywords.slice(0, 3).join(', ')} strategies, examples, and best practices.`
  ];
  
  const content = document.createElement('div');
  content.innerHTML = `
    <div style="padding: 15px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
        <h3 style="margin: 0 0 10px;">🤖 AI Meta Tag Generator</h3>
        <p style="margin: 0; opacity: 0.9; font-size: 13px;">Based on page analysis and SEO best practices</p>
      </div>
      
      <div style="margin-bottom: 25px;">
        <h4 style="margin: 0 0 15px; color: #333;">📊 Page Analysis</h4>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px;">
          <p><strong>Current Title:</strong> ${escapeHtml(pageTitle)} (${pageTitle.length} chars)</p>
          <p><strong>H1 Heading:</strong> ${escapeHtml(h1)}</p>
          <p><strong>Top Keywords:</strong> ${keywords.slice(0, 5).map(k => `#${k}`).join(' ')}</p>
        </div>
      </div>
      
      <div style="margin-bottom: 25px;">
        <h4 style="margin: 0 0 15px; color: #333;">🎯 AI-Generated Title Tags (50-60 chars)</h4>
        ${titleVariations.map((title, i) => `
          <div style="background: ${i === 0 ? '#e8f5e9' : 'white'}; padding: 12px; border-radius: 8px; margin-bottom: 10px; border: 1px solid #e0e0e0; display: flex; justify-content: space-between; align-items: center;">
            <div style="flex: 1;">
              <span style="font-weight: 600; margin-right: 10px;">#${i + 1}</span>
              <span style="${title.length > 60 ? 'color: #f44336;' : 'color: #4CAF50;'}">${escapeHtml(title)}</span>
              <span style="margin-left: 10px; font-size: 11px; color: #666;">(${title.length} chars)</span>
            </div>
            <button class="copy-title-btn" data-text="${escapeHtml(title)}" style="padding: 6px 12px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer;">Copy</button>
          </div>
        `).join('')}
      </div>
      
      <div style="margin-bottom: 25px;">
        <h4 style="margin: 0 0 15px; color: #333;">📝 AI-Generated Meta Descriptions (150-160 chars)</h4>
        ${metaVariations.map((desc, i) => `
          <div style="background: ${i === 0 ? '#e8f5e9' : 'white'}; padding: 12px; border-radius: 8px; margin-bottom: 10px; border: 1px solid #e0e0e0;">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 5px;">
              <span style="font-weight: 600;">#${i + 1}</span>
              <span style="${desc.length > 160 ? 'color: #f44336;' : 'color: #4CAF50;'} font-size: 11px;">${desc.length} chars</span>
            </div>
            <p style="margin: 10px 0; line-height: 1.5;">${escapeHtml(desc)}</p>
            <button class="copy-desc-btn" data-text="${escapeHtml(desc)}" style="padding: 6px 12px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer;">Copy</button>
          </div>
        `).join('')}
      </div>
      
      <button id="copyAllMeta" style="width: 100%; padding: 12px; background: #4CAF50; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">
        📋 Copy Best Title + Description
      </button>
    </div>
  `;
  
  const modal = createModal('🤖 AI Meta Generator', content);
  
  setTimeout(() => {
    document.querySelectorAll('.copy-title-btn, .copy-desc-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        copyToClipboard(btn.dataset.text);
        showNotification('Copied to clipboard!', 'success');
      });
    });
    
    document.getElementById('copyAllMeta')?.addEventListener('click', () => {
      const bestTitle = titleVariations[0];
      const bestDesc = metaVariations[0];
      copyToClipboard(`Title: ${bestTitle}\nDescription: ${bestDesc}`);
      showNotification('Meta tags copied!', 'success');
    });
  }, 100);
}

// ==================== URL OPTIMIZER ====================
function optimizeUrl() {
  const currentUrl = window.location.href;
  const urlObj = new URL(currentUrl);
  const path = urlObj.pathname;
  
  const issues = [];
  
  if (currentUrl.length > 75) {
    issues.push(`URL is ${currentUrl.length} characters (recommended: under 75)`);
  }
  if (path !== path.toLowerCase()) {
    issues.push('URL contains uppercase letters (use lowercase)');
  }
  if (path.includes('_')) {
    issues.push('URL uses underscores (use hyphens instead)');
  }
  if (urlObj.searchParams.toString().length > 0) {
    issues.push(`URL has ${urlObj.searchParams.size} parameter(s)`);
  }
  
  const stopWords = ['a', 'an', 'and', 'the', 'of', 'in', 'on', 'at', 'to', 'for'];
  stopWords.forEach(word => {
    if (path.toLowerCase().includes(`/${word}/`) || path.toLowerCase().includes(`-${word}-`)) {
      issues.push(`Contains stop word: "${word}"`);
    }
  });
  
  let optimizedPath = path
    .toLowerCase()
    .replace(/_/g, '-')
    .replace(/[^a-z0-9/-]/g, '')
    .replace(/-+/g, '-')
    .replace(/\/-|\/$/g, '');
  
  stopWords.forEach(word => {
    optimizedPath = optimizedPath
      .replace(new RegExp(`-${word}-`, 'g'), '-')
      .replace(new RegExp(`/${word}/`, 'g'), '/');
  });
  
  const optimizedUrl = urlObj.origin + optimizedPath;
  
  const content = document.createElement('div');
  content.innerHTML = `
    <div style="padding: 15px;">
      <div style="margin-bottom: 20px;">
        <h4 style="margin: 0 0 10px;">📊 URL Analysis</h4>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px;">
          <p><strong>Current URL:</strong><br><span style="font-family: monospace; font-size: 12px; word-break: break-all;">${escapeHtml(currentUrl)}</span></p>
          <p><strong>Length:</strong> ${currentUrl.length} characters ${currentUrl.length > 75 ? '⚠️' : '✅'}</p>
          <p><strong>Path Depth:</strong> ${path.split('/').filter(Boolean).length} levels</p>
        </div>
      </div>
      
      ${issues.length > 0 ? `
        <div style="margin-bottom: 20px;">
          <h4 style="margin: 0 0 10px; color: #f44336;">⚠️ Issues Found</h4>
          <ul style="background: #ffebee; padding: 15px 15px 15px 35px; border-radius: 8px; margin: 0;">
            ${issues.map(issue => `<li>${issue}</li>`).join('')}
          </ul>
        </div>
      ` : `
        <div style="margin-bottom: 20px; background: #e8f5e9; padding: 15px; border-radius: 8px; color: #2e7d32;">
          ✅ URL looks good! No major issues found.
        </div>
      `}
      
      <div style="margin-bottom: 20px;">
        <h4 style="margin: 0 0 10px;">✨ Optimized URL Suggestion</h4>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px;">
          <p style="font-family: monospace; font-size: 13px; word-break: break-all; margin-bottom: 10px;">${escapeHtml(optimizedUrl)}</p>
          <button id="copyOptimizedUrl" style="padding: 8px 16px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Copy Optimized URL
          </button>
        </div>
      </div>
      
      <div style="background: #fff3e0; padding: 15px; border-radius: 8px;">
        <h4 style="margin: 0 0 10px; color: #e65100;">💡 URL Best Practices</h4>
        <ul style="margin: 0; padding-left: 20px;">
          <li>Keep URLs under 75 characters</li>
          <li>Use lowercase letters only</li>
          <li>Use hyphens (-) not underscores (_)</li>
          <li>Include target keyword</li>
          <li>Avoid unnecessary parameters</li>
          <li>Keep structure shallow (2-3 levels)</li>
        </ul>
      </div>
    </div>
  `;
  
  const modal = createModal('🔗 URL Optimizer', content);
  
  setTimeout(() => {
    document.getElementById('copyOptimizedUrl')?.addEventListener('click', () => {
      copyToClipboard(optimizedUrl);
      showNotification('Optimized URL copied!', 'success');
    });
  }, 100);
}

// ==================== SEO TITLE GENERATOR ====================
function generateSEOTitles() {
  const h1 = document.querySelector('h1')?.textContent || document.title;
  const bodyText = document.body.innerText.substring(0, 1000);
  
  const words = bodyText.toLowerCase().match(/\b\w+\b/g) || [];
  const stopWords = new Set(['the', 'and', 'for', 'with', 'that', 'this', 'from', 'have', 'are', 'was', 'were']);
  const keywords = [...new Set(words.filter(w => w.length > 4 && !stopWords.has(w)))].slice(0, 5);
  
  const domain = window.location.hostname.replace('www.', '').split('.')[0];
  
  const titleVariations = [
    `${h1} | ${domain}`,
    `${h1}: ${keywords.slice(0, 3).join(' ')} Guide`,
    `${h1} - Complete Guide ${new Date().getFullYear()}`,
    `How to ${h1}: ${keywords.slice(0, 2).join(' and ')} Tips`,
    `${keywords.slice(0, 2).join(' ')} ${keywords[2] || ''}: ${h1}`,
    `The Ultimate ${h1} Guide for ${new Date().getFullYear()}`,
    `${h1} Explained: Everything You Need to Know`,
    `Master ${h1} with These ${keywords[0] || 'Expert'} Tips`,
    `${h1} ${keywords[0] ? `| ${keywords[0]} ` : ''}Strategies & Examples`,
    `Learn ${h1}: Step-by-Step Tutorial`
  ];
  
  const content = document.createElement('div');
  content.innerHTML = `
    <div style="padding: 15px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
        <h3 style="margin: 0 0 10px;">📝 SEO Title Generator</h3>
        <p style="margin: 0; opacity: 0.9; font-size: 13px;">${titleVariations.length} optimized titles generated</p>
      </div>
      
      <div style="margin-bottom: 15px;">
        <button id="copyAllTitles" style="padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 6px; cursor: pointer;">
          📋 Copy All Titles
        </button>
      </div>
      
      ${titleVariations.map((title, i) => `
        <div style="background: ${i === 0 ? '#e8f5e9' : 'white'}; padding: 15px; border-radius: 8px; margin-bottom: 10px; border: 1px solid #e0e0e0; display: flex; justify-content: space-between; align-items: center;">
          <div style="flex: 1;">
            <span style="font-weight: 600; margin-right: 15px; color: #667eea;">#${i + 1}</span>
            <span style="${title.length > 60 ? 'color: #f44336;' : 'color: #4CAF50;'}">${escapeHtml(title)}</span>
            <span style="margin-left: 10px; font-size: 11px; color: #666;">(${title.length} chars)</span>
          </div>
          <button class="copy-title-btn" data-title="${escapeHtml(title)}" 
            style="margin-left: 10px; padding: 6px 12px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Copy
          </button>
        </div>
      `).join('')}
      
      <div style="margin-top: 20px; background: #fff3e0; padding: 15px; border-radius: 8px;">
        <h4 style="margin: 0 0 10px; color: #e65100;">💡 Title Best Practices</h4>
        <ul style="margin: 0; padding-left: 20px;">
          <li>Keep between 50-60 characters</li>
          <li>Include primary keyword near the beginning</li>
          <li>Add power words (Ultimate, Complete, Essential)</li>
          <li>Use numbers when relevant</li>
          <li>Make it compelling for clicks</li>
        </ul>
      </div>
    </div>
  `;
  
  const modal = createModal('📝 SEO Title Generator', content);
  
  setTimeout(() => {
    document.getElementById('copyAllTitles')?.addEventListener('click', () => {
      copyToClipboard(titleVariations.join('\n'));
      showNotification(`${titleVariations.length} titles copied!`, 'success');
    });
    
    document.querySelectorAll('.copy-title-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        copyToClipboard(btn.dataset.title);
        showNotification('Title copied!', 'success');
      });
    });
  }, 100);
}

// ==================== META DESCRIPTION GENERATOR ====================
function generateMetaDescriptions() {
  const h1 = document.querySelector('h1')?.textContent || document.title;
  const firstParagraph = document.querySelector('p')?.textContent || '';
  const bodyText = document.body.innerText.substring(0, 1500);
  
  const words = bodyText.toLowerCase().match(/\b\w+\b/g) || [];
  const stopWords = new Set(['the', 'and', 'for', 'with', 'that', 'this', 'from', 'have', 'are']);
  const keywords = [...new Set(words.filter(w => w.length > 4 && !stopWords.has(w)))].slice(0, 5);
  
  const descriptions = [
    `Learn everything about ${h1}. ${firstParagraph.substring(0, 120)}...`,
    `Discover ${keywords.slice(0, 3).join(', ')} and more in our comprehensive ${h1} guide. Expert tips, strategies, and best practices.`,
    `Want to master ${h1}? Our complete guide covers ${keywords.slice(0, 4).join(', ')} and proven techniques for success.`,
    `${h1} explained: ${firstParagraph.substring(0, 130)}... Read our complete guide.`,
    `The ultimate resource for ${h1}. Includes ${keywords.slice(0, 3).join(', ')} strategies, examples, and actionable advice.`,
    `Looking for ${h1} tips? We cover everything from ${keywords[0] || 'basics'} to advanced ${keywords[1] || 'techniques'}. Start learning today.`,
    `Master ${h1} with our step-by-step guide. Learn ${keywords.slice(0, 2).join(' and ')} from industry experts.`,
    `${h1}: A complete guide covering ${keywords.slice(0, 3).join(', ')}. Updated for ${new Date().getFullYear()}.`
  ];
  
  const content = document.createElement('div');
  content.innerHTML = `
    <div style="padding: 15px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
        <h3 style="margin: 0 0 10px;">📄 Meta Description Generator</h3>
        <p style="margin: 0; opacity: 0.9; font-size: 13px;">${descriptions.length} descriptions generated</p>
      </div>
      
      <div style="margin-bottom: 15px;">
        <button id="copyAllDescriptions" style="padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 6px; cursor: pointer;">
          📋 Copy All Descriptions
        </button>
      </div>
      
      ${descriptions.map((desc, i) => `
        <div style="background: ${i === 0 ? '#e8f5e9' : 'white'}; padding: 15px; border-radius: 8px; margin-bottom: 15px; border: 1px solid #e0e0e0;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-weight: 600; color: #667eea;">Option #${i + 1}</span>
            <span style="${desc.length > 160 ? 'color: #f44336;' : 'color: #4CAF50;'} font-size: 11px;">${desc.length} chars</span>
          </div>
          <p style="margin: 10px 0; line-height: 1.5;">${escapeHtml(desc)}</p>
          <button class="copy-desc-btn" data-desc="${escapeHtml(desc)}" 
            style="padding: 6px 12px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Copy
          </button>
        </div>
      `).join('')}
      
      <div style="margin-top: 20px; background: #e3f2fd; padding: 15px; border-radius: 8px;">
        <h4 style="margin: 0 0 10px; color: #1565c0;">📏 Description Guidelines</h4>
        <ul style="margin: 0; padding-left: 20px;">
          <li>Ideal length: 150-160 characters</li>
          <li>Include primary keyword naturally</li>
          <li>Add a call-to-action (Learn, Discover, Read)</li>
          <li>Make it unique and compelling</li>
          <li>Match search intent</li>
        </ul>
      </div>
    </div>
  `;
  
  const modal = createModal('📄 Meta Description Generator', content);
  
  setTimeout(() => {
    document.getElementById('copyAllDescriptions')?.addEventListener('click', () => {
      copyToClipboard(descriptions.join('\n\n'));
      showNotification(`${descriptions.length} descriptions copied!`, 'success');
    });
    
    document.querySelectorAll('.copy-desc-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        copyToClipboard(btn.dataset.desc);
        showNotification('Description copied!', 'success');
      });
    });
  }, 100);
}
// ==================== LINK PROSPECT FINDER ====================
function findLinkProspects() {
  const domain = window.location.hostname.replace('www.', '');
  const pageTitle = document.title;
  const h1 = document.querySelector('h1')?.textContent || '';
  
  // Extract keywords for prospecting
  const bodyText = document.body.innerText.substring(0, 1000);
  const words = bodyText.toLowerCase().match(/\b\w+\b/g) || [];
  const stopWords = new Set(['the', 'and', 'for', 'with', 'that', 'this', 'from', 'have', 'are']);
  const keywords = [...new Set(words.filter(w => w.length > 4 && !stopWords.has(w)))].slice(0, 3);
  
  const mainKeyword = keywords[0] || domain;
  
  const searchQueries = [
    // Guest post queries
    { name: 'Guest Post Opportunities', query: `${mainKeyword} "write for us"` },
    { name: 'Guest Post Guidelines', query: `${mainKeyword} "guest post guidelines"` },
    { name: 'Become a Contributor', query: `${mainKeyword} "become a contributor"` },
    { name: 'Submit Guest Post', query: `${mainKeyword} "submit guest post"` },
    { name: 'Guest Author', query: `${mainKeyword} "guest author"` },
    
    // Niche edit queries
    { name: 'Link Insertion', query: `${mainKeyword} "link insertion"` },
    { name: 'Update Old Post', query: `${mainKeyword} "update" "article"` },
    
    // Resource link queries
    { name: 'Useful Links', query: `${mainKeyword} "useful links"` },
    { name: 'Helpful Resources', query: `${mainKeyword} "helpful resources"` },
    { name: 'Recommended Sites', query: `${mainKeyword} "recommended sites"` },
    
    // Roundup queries
    { name: 'Weekly Roundup', query: `${mainKeyword} "weekly roundup"` },
    { name: 'Monthly Favorites', query: `${mainKeyword} "monthly" "favorites"` },
    
    // Expert quotes
    { name: 'Expert Roundup', query: `${mainKeyword} "expert roundup"` },
    { name: 'Industry Experts', query: `${mainKeyword} "industry experts"` },
    
    // Competitor mentions
    { name: 'Competitor Mentions', query: `${mainKeyword} "top" "best" "review"` }
  ];
  
  const content = document.createElement('div');
  content.innerHTML = `
    <div style="padding: 15px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
        <h3 style="margin: 0 0 10px;">🎯 Link Prospect Finder</h3>
        <p style="margin: 0; opacity: 0.9; font-size: 13px;">Find guest post and link opportunities</p>
      </div>
      
      <div style="margin-bottom: 20px;">
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px;">
          <p><strong>Current Site:</strong> ${escapeHtml(domain)}</p>
          <p><strong>Main Keyword:</strong> ${escapeHtml(mainKeyword)}</p>
          <p><strong>Custom Keyword:</strong></p>
          <div style="display: flex; gap: 10px; margin-top: 10px;">
            <input type="text" id="customKeyword" placeholder="Enter custom keyword..." value="${escapeHtml(mainKeyword)}" 
              style="flex: 1; padding: 10px; border: 1px solid #ddd; border-radius: 6px;">
            <button id="updateQueries" style="padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer;">
              Update
            </button>
          </div>
        </div>
      </div>
      
      <div style="margin-bottom: 15px;">
        <button id="openAllQueries" style="padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 6px; cursor: pointer; margin-right: 10px;">
          🚀 Open All Queries
        </button>
        <button id="copyAllQueries" style="padding: 10px 20px; background: #2196F3; color: white; border: none; border-radius: 6px; cursor: pointer;">
          📋 Copy Search URLs
        </button>
      </div>
      
      <div id="queriesContainer"></div>
      
      <div style="margin-top: 20px; background: #e8f5e9; padding: 15px; border-radius: 8px;">
        <h4 style="margin: 0 0 10px; color: #2e7d32;">💡 Prospecting Tips</h4>
        <ul style="margin: 0; padding-left: 20px;">
          <li>Look for sites with good DA/DR metrics</li>
          <li>Check if they've published guest posts recently</li>
          <li>Verify the site gets organic traffic</li>
          <li>Review their guest post guidelines carefully</li>
          <li>Personalize your outreach email</li>
        </ul>
      </div>
    </div>
  `;
  
  const modal = createModal('🎯 Link Prospect Finder', content);
  
  // Function to open Google search with proper query
  const openGoogleSearch = (queryText) => {
    if (!queryText) return;
    // Don't encode the whole query - just encode it properly for URL
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(queryText)}`;
    window.open(searchUrl, '_blank');
  };
  
  // Function to render queries
  const renderQueries = (queries) => {
    const container = document.getElementById('queriesContainer');
    if (!container) return;
    
    container.innerHTML = queries.map((sq, i) => `
      <div style="background: white; padding: 12px; border-radius: 8px; margin-bottom: 8px; border: 1px solid #e0e0e0; display: flex; justify-content: space-between; align-items: center;">
        <div style="flex: 1;">
          <span style="font-weight: 600; color: #667eea; margin-right: 10px;">${sq.name}</span>
          <span style="color: #333; font-size: 13px; font-family: monospace;">${escapeHtml(sq.query)}</span>
        </div>
        <button class="open-query-btn" data-query-index="${i}" 
          style="margin-left: 10px; padding: 6px 12px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Search
        </button>
      </div>
    `).join('');
    
    // Attach event listeners to buttons
    document.querySelectorAll('.open-query-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const index = parseInt(btn.getAttribute('data-query-index'));
        if (!isNaN(index) && queries[index]) {
          openGoogleSearch(queries[index].query);
        }
      });
    });
  };
  
  // Initial render
  let currentQueries = [...searchQueries];
  renderQueries(currentQueries);
  
  // Update queries when custom keyword changes
  const updateQueries = () => {
    const newKeyword = document.getElementById('customKeyword').value.trim() || mainKeyword;
    
    // Create new queries with the updated keyword
    currentQueries = searchQueries.map(sq => ({
      name: sq.name,
      query: sq.query.replace(new RegExp(mainKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newKeyword)
    }));
    
    renderQueries(currentQueries);
  };
  
  document.getElementById('updateQueries')?.addEventListener('click', updateQueries);
  
  // Open all queries
  document.getElementById('openAllQueries')?.addEventListener('click', () => {
    currentQueries.forEach((sq, i) => {
      setTimeout(() => {
        openGoogleSearch(sq.query);
      }, i * 300);
    });
    if (typeof showNotification === 'function') {
      showNotification('Opening all search queries...', 'success');
    }
  });
  
  // Copy all URLs
  document.getElementById('copyAllQueries')?.addEventListener('click', () => {
    const urls = currentQueries.map(sq => {
      return `https://www.google.com/search?q=${encodeURIComponent(sq.query)}`;
    }).join('\n');
    
    if (typeof copyToClipboard === 'function') {
      copyToClipboard(urls);
    } else {
      navigator.clipboard.writeText(urls);
    }
    
    if (typeof showNotification === 'function') {
      showNotification('Search URLs copied!', 'success');
    }
  });
}

// ==================== RESOURCE PAGE FINDER ====================
function findResourcePages() {
  const domain = window.location.hostname.replace('www.', '');
  const h1 = document.querySelector('h1')?.textContent || '';
  
  const bodyText = document.body.innerText.substring(0, 1000);
  const words = bodyText.toLowerCase().match(/\b\w+\b/g) || [];
  const stopWords = new Set(['the', 'and', 'for', 'with', 'that', 'this', 'from', 'have', 'are']);
  const keywords = [...new Set(words.filter(w => w.length > 4 && !stopWords.has(w)))].slice(0, 3);
  
  const mainKeyword = keywords[0] || domain;
  
  const resourceQueries = [
    { name: 'Resources Page', query: `${mainKeyword} intitle:resources` },
    { name: 'Useful Links', query: `${mainKeyword} "useful links"` },
    { name: 'Helpful Resources', query: `${mainKeyword} "helpful resources"` },
    { name: 'Recommended Links', query: `${mainKeyword} "recommended links"` },
    { name: 'Favorite Sites', query: `${mainKeyword} "favorite sites"` },
    { name: 'Blogroll', query: `${mainKeyword} blogroll` },
    { name: 'Links Page', query: `${mainKeyword} intitle:links` },
    { name: 'Further Reading', query: `${mainKeyword} "further reading"` },
    { name: 'Additional Resources', query: `${mainKeyword} "additional resources"` },
    { name: 'Related Sites', query: `${mainKeyword} "related sites"` },
    { name: 'Sites We Like', query: `${mainKeyword} "sites we like"` },
    { name: 'Our Friends', query: `${mainKeyword} "our friends"` }
  ];
  
  const content = document.createElement('div');
  content.innerHTML = `
    <div style="padding: 15px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
        <h3 style="margin: 0 0 10px;">📚 Resource Page Finder</h3>
        <p style="margin: 0; opacity: 0.9; font-size: 13px;">Find resource pages for link building</p>
      </div>
      
      <div style="margin-bottom: 20px;">
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px;">
          <p><strong>Current Site:</strong> ${escapeHtml(domain)}</p>
          <p><strong>Main Keyword:</strong> ${escapeHtml(mainKeyword)}</p>
          <p><strong>Custom Keyword:</strong></p>
          <div style="display: flex; gap: 10px; margin-top: 10px;">
            <input type="text" id="customKeyword" placeholder="Enter custom keyword..." value="${escapeHtml(mainKeyword)}" 
              style="flex: 1; padding: 10px; border: 1px solid #ddd; border-radius: 6px;">
            <button id="updateQueries" style="padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer;">
              Update
            </button>
          </div>
        </div>
      </div>
      
      <div style="margin-bottom: 15px;">
        <button id="openAllQueries" style="padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 6px; cursor: pointer; margin-right: 10px;">
          🚀 Open All Queries
        </button>
        <button id="copyAllQueries" style="padding: 10px 20px; background: #2196F3; color: white; border: none; border-radius: 6px; cursor: pointer;">
          📋 Copy Search URLs
        </button>
      </div>
      
      <div id="queriesContainer"></div>
      
      <div style="margin-top: 20px; background: #e3f2fd; padding: 15px; border-radius: 8px;">
        <h4 style="margin: 0 0 10px; color: #1565c0;">💡 Resource Page Outreach Tips</h4>
        <ul style="margin: 0; padding-left: 20px;">
          <li>Find broken links on resource pages first</li>
          <li>Offer a superior replacement resource</li>
          <li>Make sure your resource is genuinely useful</li>
          <li>Personalize your outreach email</li>
          <li>Follow up once after 3-5 days</li>
        </ul>
      </div>
    </div>
  `;
  
  const modal = createModal('📚 Resource Page Finder', content);
  
  // Function to open Google search with proper query
  const openGoogleSearch = (queryText) => {
    if (!queryText) return;
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(queryText)}`;
    window.open(searchUrl, '_blank');
  };
  
  // Function to render queries
  const renderQueries = (queries) => {
    const container = document.getElementById('queriesContainer');
    if (!container) return;
    
    container.innerHTML = queries.map((sq, i) => `
      <div style="background: white; padding: 12px; border-radius: 8px; margin-bottom: 8px; border: 1px solid #e0e0e0; display: flex; justify-content: space-between; align-items: center;">
        <div style="flex: 1;">
          <span style="font-weight: 600; color: #667eea; margin-right: 10px;">${sq.name}</span>
          <span style="color: #333; font-size: 13px; font-family: monospace;">${escapeHtml(sq.query)}</span>
        </div>
        <button class="open-query-btn" data-query-index="${i}" 
          style="margin-left: 10px; padding: 6px 12px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Search
        </button>
      </div>
    `).join('');
    
    // Attach event listeners to buttons
    document.querySelectorAll('.open-query-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const index = parseInt(btn.getAttribute('data-query-index'));
        if (!isNaN(index) && queries[index]) {
          openGoogleSearch(queries[index].query);
        }
      });
    });
  };
  
  // Initial render
  let currentQueries = [...resourceQueries];
  renderQueries(currentQueries);
  
  // Update queries when custom keyword changes
  const updateQueries = () => {
    const newKeyword = document.getElementById('customKeyword').value.trim() || mainKeyword;
    
    // Create new queries with the updated keyword
    currentQueries = resourceQueries.map(sq => ({
      name: sq.name,
      query: sq.query.replace(new RegExp(mainKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newKeyword)
    }));
    
    renderQueries(currentQueries);
  };
  
  document.getElementById('updateQueries')?.addEventListener('click', updateQueries);
  
  // Open all queries
  document.getElementById('openAllQueries')?.addEventListener('click', () => {
    currentQueries.forEach((sq, i) => {
      setTimeout(() => {
        openGoogleSearch(sq.query);
      }, i * 300);
    });
    if (typeof showNotification === 'function') {
      showNotification('Opening all resource page queries...', 'success');
    }
  });
  
  // Copy all URLs
  document.getElementById('copyAllQueries')?.addEventListener('click', () => {
    const urls = currentQueries.map(sq => {
      return `https://www.google.com/search?q=${encodeURIComponent(sq.query)}`;
    }).join('\n');
    
    if (typeof copyToClipboard === 'function') {
      copyToClipboard(urls);
    } else {
      navigator.clipboard.writeText(urls);
    }
    
    if (typeof showNotification === 'function') {
      showNotification('Search URLs copied!', 'success');
    }
  });
}

// ==================== SEO AUDIT CHECKLIST ====================
function showSEOAuditChecklist() {
  const url = window.location.href;
  const domain = window.location.hostname.replace('www.', '');
  
  // Auto-detect issues
  const title = document.title;
  const metaDesc = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
  const h1 = document.querySelector('h1')?.textContent || '';
  const h1Count = document.querySelectorAll('h1').length;
  const images = document.querySelectorAll('img');
  const imagesWithoutAlt = Array.from(images).filter(img => !img.getAttribute('alt')).length;
  const links = document.querySelectorAll('a[href]');
  const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href') || '';
  const robots = document.querySelector('meta[name="robots"]')?.getAttribute('content') || '';
  const viewport = document.querySelector('meta[name="viewport"]')?.getAttribute('content') || '';
  const schema = document.querySelectorAll('script[type="application/ld+json"]').length;
  
  const checklistItems = [
    { category: 'Title Tags', items: [
      { name: 'Title tag present', check: title.length > 0, note: title || 'Missing' },
      { name: 'Title length (50-60 chars)', check: title.length >= 30 && title.length <= 65, note: `${title.length} chars` },
      { name: 'Title includes keyword', check: true, note: 'Manual check required' }
    ]},
    { category: 'Meta Tags', items: [
      { name: 'Meta description present', check: metaDesc.length > 0, note: metaDesc ? `${metaDesc.length} chars` : 'Missing' },
      { name: 'Meta description length (120-160)', check: metaDesc.length >= 120 && metaDesc.length <= 160, note: `${metaDesc.length} chars` },
      { name: 'Viewport meta tag', check: viewport.length > 0, note: viewport || 'Missing' },
      { name: 'Robots meta tag', check: !robots.includes('noindex'), note: robots || 'Not set (defaults to index)' }
    ]},
    { category: 'Headings', items: [
      { name: 'H1 tag present', check: h1.length > 0, note: h1 || 'Missing' },
      { name: 'Only one H1 tag', check: h1Count === 1, note: `${h1Count} found` },
      { name: 'H2 tags used', check: document.querySelectorAll('h2').length > 0, note: `${document.querySelectorAll('h2').length} found` }
    ]},
    { category: 'Images', items: [
      { name: 'All images have alt text', check: imagesWithoutAlt === 0, note: `${imagesWithoutAlt} missing` },
      { name: 'Images are optimized', check: true, note: 'Manual check required' }
    ]},
    { category: 'Links', items: [
      { name: 'Internal links present', check: true, note: 'Manual check required' },
      { name: 'No broken links', check: true, note: 'Use Broken Link Checker' }
    ]},
    { category: 'Technical', items: [
      { name: 'Canonical tag present', check: canonical.length > 0, note: canonical || 'Missing' },
      { name: 'SSL/HTTPS enabled', check: url.startsWith('https'), note: url.startsWith('https') ? '✅ Enabled' : '❌ Not secure' },
      { name: 'Schema markup present', check: schema > 0, note: `${schema} schema(s) found` },
      { name: 'Mobile-friendly', check: viewport.length > 0, note: viewport ? '✅ Responsive' : 'Check manually' }
    ]},
    { category: 'Content', items: [
      { name: 'Content length > 300 words', check: true, note: 'Use Word Count tool' },
      { name: 'Internal links in content', check: true, note: 'Manual check required' },
      { name: 'External links to authority sites', check: true, note: 'Manual check required' }
    ]}
  ];
  
  const totalItems = checklistItems.reduce((sum, cat) => sum + cat.items.length, 0);
  const passedItems = checklistItems.reduce((sum, cat) => sum + cat.items.filter(i => i.check).length, 0);
  const score = Math.round((passedItems / totalItems) * 100);
  
  const content = document.createElement('div');
  content.innerHTML = `
    <div style="padding: 15px;">
      <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, ${score > 70 ? '#4CAF50' : score > 40 ? '#FF9800' : '#f44336'} 0%, ${score > 70 ? '#2e7d32' : score > 40 ? '#e65100' : '#c62828'} 100%); color: white; border-radius: 12px; margin-bottom: 20px;">
        <div style="font-size: 48px; font-weight: bold;">${score}%</div>
        <div style="font-size: 16px; margin: 10px 0;">SEO Audit Score</div>
        <div style="font-size: 13px; opacity: 0.9;">${passedItems}/${totalItems} checks passed</div>
      </div>
      
      <div style="margin-bottom: 15px; display: flex; gap: 10px;">
        <button id="exportAudit" style="padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 6px; cursor: pointer;">
          📥 Export Audit Report
        </button>
        <button id="copyAuditSummary" style="padding: 10px 20px; background: #2196F3; color: white; border: none; border-radius: 6px; cursor: pointer;">
          📋 Copy Summary
        </button>
      </div>
      
      <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
        <p><strong>URL:</strong> ${escapeHtml(url)}</p>
        <p><strong>Domain:</strong> ${escapeHtml(domain)}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
      </div>
      
      ${checklistItems.map(category => `
        <div style="margin-bottom: 20px;">
          <h4 style="margin: 0 0 10px; color: #333; border-bottom: 2px solid #667eea; padding-bottom: 5px;">${category.category}</h4>
          ${category.items.map(item => `
            <div style="display: flex; align-items: center; padding: 10px; background: white; border-radius: 6px; margin-bottom: 5px; border: 1px solid #e0e0e0;">
              <span style="margin-right: 12px; font-size: 18px;">${item.check ? '✅' : '❌'}</span>
              <span style="flex: 1; font-size: 13px;">${item.name}</span>
              <span style="font-size: 12px; color: ${item.check ? '#4CAF50' : '#f44336'};">${escapeHtml(item.note)}</span>
            </div>
          `).join('')}
        </div>
      `).join('')}
      
      <div style="margin-top: 20px; background: #fff3e0; padding: 15px; border-radius: 8px;">
        <h4 style="margin: 0 0 10px; color: #e65100;">📋 Priority Fixes</h4>
        <ul style="margin: 0; padding-left: 20px;">
          ${!title ? '<li>Add a title tag</li>' : ''}
          ${title.length < 30 || title.length > 65 ? '<li>Optimize title length (50-60 chars)</li>' : ''}
          ${!metaDesc ? '<li>Add a meta description</li>' : ''}
          ${metaDesc.length < 120 || metaDesc.length > 160 ? '<li>Optimize meta description length (120-160 chars)</li>' : ''}
          ${!h1 ? '<li>Add an H1 heading</li>' : ''}
          ${h1Count > 1 ? '<li>Use only one H1 tag</li>' : ''}
          ${imagesWithoutAlt > 0 ? '<li>Add alt text to all images</li>' : ''}
          ${!canonical ? '<li>Add canonical tag</li>' : ''}
          ${!url.startsWith('https') ? '<li>Enable HTTPS/SSL</li>' : ''}
          ${schema === 0 ? '<li>Add schema markup</li>' : ''}
        </ul>
      </div>
    </div>
  `;
  
  const modal = createModal('✅ SEO Audit Checklist', content);
  
  setTimeout(() => {
    document.getElementById('exportAudit')?.addEventListener('click', () => {
      const reportData = {
        url: url,
        domain: domain,
        date: new Date().toISOString(),
        score: score,
        passed: passedItems,
        total: totalItems,
        checklist: checklistItems
      };
      
      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
      const url_blob = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url_blob;
      a.download = `seo-audit-${domain}-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url_blob);
      showNotification('Audit report exported!', 'success');
    });
    
    document.getElementById('copyAuditSummary')?.addEventListener('click', () => {
      const summary = `SEO Audit Summary - ${domain}
Date: ${new Date().toLocaleDateString()}
Score: ${score}% (${passedItems}/${totalItems} checks passed)

Issues Found:
${checklistItems.flatMap(c => c.items.filter(i => !i.check).map(i => `- ${i.name}: ${i.note}`)).join('\n')}

Priority Fixes:
${!title ? '- Add title tag\n' : ''}${title.length < 30 || title.length > 65 ? '- Optimize title length\n' : ''}${!metaDesc ? '- Add meta description\n' : ''}${metaDesc.length < 120 || metaDesc.length > 160 ? '- Optimize meta description length\n' : ''}${!h1 ? '- Add H1 heading\n' : ''}${h1Count > 1 ? '- Use only one H1\n' : ''}${imagesWithoutAlt > 0 ? '- Add alt text to images\n' : ''}${!canonical ? '- Add canonical tag\n' : ''}${!url.startsWith('https') ? '- Enable HTTPS\n' : ''}${schema === 0 ? '- Add schema markup' : ''}`;
      
      copyToClipboard(summary);
      showNotification('Summary copied!', 'success');
    });
  }, 100);
}

// ==================== AI TOPIC GENERATOR ====================
function generateAITopics() {
  const pageTitle = document.title;
  const h1 = document.querySelector('h1')?.textContent || pageTitle;
  const bodyText = document.body.innerText.substring(0, 1500);
  
  const words = bodyText.toLowerCase().match(/\b\w+\b/g) || [];
  const stopWords = new Set(['the', 'and', 'for', 'with', 'that', 'this', 'from', 'have', 'are']);
  const keywords = [...new Set(words.filter(w => w.length > 4 && !stopWords.has(w)))].slice(0, 8);
  
  const topicCategories = [
    { name: '📖 How-To Guides', topics: [
      `How to ${h1}: Step-by-Step Guide for Beginners`,
      `${keywords[0] ? `How to Master ${keywords[0]} in 30 Days` : `How to Get Started with ${h1}`}`,
      `The Complete Beginner's Guide to ${h1}`,
      `How to ${h1} Like a Pro: Expert Tips`,
      `${keywords[1] ? `How to Use ${keywords[1]} for Better Results` : `Advanced ${h1} Techniques`}`
    ]},
    { name: '📊 List Posts', topics: [
      `Top 10 ${h1} Tools You Need in ${new Date().getFullYear()}`,
      `${keywords[0] ? `15 ${keywords[0]} Tips from Industry Experts` : `10 Essential ${h1} Tips`}`,
      `7 Common ${h1} Mistakes and How to Avoid Them`,
      `${keywords[1] ? `20 Best ${keywords[1]} Resources for ${new Date().getFullYear()}` : `25 ${h1} Resources You Should Bookmark`}`,
      `Top 5 ${h1} Trends to Watch This Year`
    ]},
    { name: '🔍 Comparison Posts', topics: [
      `${keywords[0] ? `${keywords[0]} vs ${keywords[1] || 'Competitors'}: Which is Better?` : `${h1}: Free vs Paid Options Compared`}`,
      `${h1}: Before and After Results`,
      `Traditional vs Modern ${h1} Approaches`,
      `${keywords[0] ? `${keywords[0]} Alternatives: Top Picks for ${new Date().getFullYear()}` : `${h1} Alternatives You Should Consider`}`,
      `${h1} for Beginners vs Advanced Users`
    ]},
    { name: '❓ Question Posts', topics: [
      `What is ${h1}? A Complete Overview`,
      `Why ${h1} Matters for Your Business`,
      `When Should You Use ${h1}?`,
      `Where to Find the Best ${h1} Resources?`,
      `Who Needs ${h1}? Find Out If It's Right for You`
    ]},
    { name: '📈 Case Studies', topics: [
      `How We Used ${h1} to Increase Traffic by 200%`,
      `${keywords[0] ? `${keywords[0]} Success Story: Real Results` : `${h1} Case Study: What Worked and What Didn't`}`,
      `From Zero to Hero: Our ${h1} Journey`,
      `Real ${h1} Examples That Actually Work`,
      `How Company X Mastered ${h1} in 6 Months`
    ]},
    { name: '🎯 Niche Topics', topics: [
      `${h1} for Ecommerce: Ultimate Guide`,
      `${h1} for Small Business Owners`,
      `${keywords[0] ? `${h1} and ${keywords[0]}: The Perfect Combination` : `${h1} for Beginners: Where to Start`}`,
      `Local ${h1}: Tips for Small Businesses`,
      `Mobile ${h1}: Optimizing for Smartphones`
    ]}
  ];
  
  const allTopics = topicCategories.flatMap(cat => cat.topics);
  
  const content = document.createElement('div');
  content.innerHTML = `
    <div style="padding: 15px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
        <h3 style="margin: 0 0 10px;">💡 AI Topic Generator</h3>
        <p style="margin: 0; opacity: 0.9; font-size: 13px;">${allTopics.length} blog topic ideas generated</p>
      </div>
      
      <div style="margin-bottom: 15px;">
        <button id="copyAllTopics" style="padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 6px; cursor: pointer; margin-right: 10px;">
          📋 Copy All Topics
        </button>
        <button id="regenerateTopics" style="padding: 10px 20px; background: #FF9800; color: white; border: none; border-radius: 6px; cursor: pointer;">
          🔄 Regenerate
        </button>
      </div>
      
      <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
        <p><strong>Based on:</strong> ${escapeHtml(h1)}</p>
        <p><strong>Keywords detected:</strong> ${keywords.slice(0, 5).map(k => `#${k}`).join(' ') || 'None'}</p>
      </div>
      
      ${topicCategories.map(category => `
        <div style="margin-bottom: 20px;">
          <h4 style="margin: 0 0 10px; color: #667eea;">${category.name}</h4>
          ${category.topics.map((topic, i) => `
            <div style="background: white; padding: 12px; border-radius: 8px; margin-bottom: 8px; border: 1px solid #e0e0e0; display: flex; justify-content: space-between; align-items: center;">
              <span style="flex: 1; font-size: 13px;">${escapeHtml(topic)}</span>
              <button class="copy-topic-btn" data-topic="${escapeHtml(topic)}" 
                style="margin-left: 10px; padding: 6px 12px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer;">
                Copy
              </button>
            </div>
          `).join('')}
        </div>
      `).join('')}
    </div>
  `;
  
  const modal = createModal('💡 AI Topic Generator', content);
  
  setTimeout(() => {
    document.querySelectorAll('.copy-topic-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        copyToClipboard(btn.dataset.topic);
        showNotification('Topic copied!', 'success');
      });
    });
    
    document.getElementById('copyAllTopics')?.addEventListener('click', () => {
      copyToClipboard(allTopics.join('\n'));
      showNotification(`${allTopics.length} topics copied!`, 'success');
    });
    
    document.getElementById('regenerateTopics')?.addEventListener('click', () => {
      modal.close();
      generateAITopics();
    });
  }, 100);
}

// ==================== LOCAL KEYWORD FINDER ====================
function findLocalKeywords() {
  const domain = window.location.hostname.replace('www.', '');
  const h1 = document.querySelector('h1')?.textContent || '';
  const pageTitle = document.title;
  
  const bodyText = document.body.innerText.substring(0, 1000);
  const words = bodyText.toLowerCase().match(/\b\w+\b/g) || [];
  const stopWords = new Set(['the', 'and', 'for', 'with', 'that', 'this', 'from', 'have', 'are']);
  const keywords = [...new Set(words.filter(w => w.length > 4 && !stopWords.has(w)))].slice(0, 3);
  
  const mainKeyword = keywords[0] || domain;
  
  const content = document.createElement('div');
  content.innerHTML = `
    <div style="padding: 15px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
        <h3 style="margin: 0 0 10px;">📍 Local Keyword Finder</h3>
        <p style="margin: 0; opacity: 0.9; font-size: 13px;">Find location-based keywords for local SEO</p>
      </div>
      
      <div style="margin-bottom: 20px;">
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px;">
          <p><strong>Main Keyword/Service:</strong></p>
          <input type="text" id="mainKeyword" placeholder="e.g., plumber, dentist, pizza" value="${escapeHtml(mainKeyword)}" 
            style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; margin-bottom: 10px;">
          
          <p><strong>Location (City/State):</strong></p>
          <div style="display: flex; gap: 10px;">
            <input type="text" id="locationInput" placeholder="e.g., New York, Los Angeles, Chicago" value="New York" 
              style="flex: 1; padding: 10px; border: 1px solid #ddd; border-radius: 6px;">
            <button id="generateKeywords" style="padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer;">
              Generate
            </button>
          </div>
        </div>
      </div>
      
      <div id="keywordsContainer">
        <!-- Keywords will be generated here -->
      </div>
      
      <div style="margin-top: 20px;">
        <button id="copyAllKeywords" style="padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 6px; cursor: pointer; margin-right: 10px;">
          📋 Copy All Keywords
        </button>
        <button id="exportKeywordsCsv" style="padding: 10px 20px; background: #2196F3; color: white; border: none; border-radius: 6px; cursor: pointer;">
          📊 Export as CSV
        </button>
      </div>
      
      <div style="margin-top: 20px; background: #e8f5e9; padding: 15px; border-radius: 8px;">
        <h4 style="margin: 0 0 10px; color: #2e7d32;">💡 Local SEO Tips</h4>
        <ul style="margin: 0; padding-left: 20px;">
          <li>Include city/neighborhood names in titles and headings</li>
          <li>Create location-specific landing pages</li>
          <li>Optimize Google Business Profile with these keywords</li>
          <li>Get reviews mentioning your location</li>
          <li>Build local citations with consistent NAP</li>
        </ul>
      </div>
    </div>
  `;
  
  const modal = createModal('📍 Local Keyword Finder', content);
  
  const generateKeywordList = (keyword, location) => {
    const locationLower = location.toLowerCase();
    const locationParts = location.split(',').map(p => p.trim());
    const primaryCity = locationParts[0];
    
    const modifiers = [
      'best', 'top', 'affordable', 'cheap', 'professional', 'emergency',
      'near me', 'reviews', 'services', 'company', 'experts', 'local'
    ];
    
    const keywordTypes = [
      { name: '📍 Service + Location', keywords: [
        `${keyword} in ${primaryCity}`,
        `${keyword} ${primaryCity}`,
        `${primaryCity} ${keyword}`,
        `best ${keyword} in ${primaryCity}`,
        `top ${keyword} ${primaryCity}`,
        `affordable ${keyword} ${primaryCity}`,
        `${keyword} services ${primaryCity}`,
        `${keyword} near me in ${primaryCity}`,
        `local ${keyword} ${primaryCity}`,
        `${primaryCity} ${keyword} company`
      ]},
      { name: '🔍 "Near Me" Variations', keywords: [
        `${keyword} near me`,
        `best ${keyword} near me`,
        `${keyword} near me now`,
        `${keyword} near me open now`,
        `top rated ${keyword} near me`,
        `${keyword} near me reviews`,
        `cheap ${keyword} near me`,
        `24 hour ${keyword} near me`,
        `emergency ${keyword} near me`,
        `${keyword} near my location`
      ]},
      { name: '📍 Neighborhood Level', keywords: [
        `best ${keyword} in downtown ${primaryCity}`,
        `${keyword} near ${primaryCity} center`,
        `${keyword} in ${primaryCity} area`,
        `${keyword} around ${primaryCity}`,
        `local ${keyword} in ${primaryCity} region`,
        `${primaryCity} ${keyword} near me`
      ]},
      { name: '🕐 Intent-Based', keywords: [
        `hire ${keyword} ${primaryCity}`,
        `${keyword} estimate ${primaryCity}`,
        `${keyword} quote ${primaryCity}`,
        `${keyword} cost ${primaryCity}`,
        `${keyword} price ${primaryCity}`,
        `book ${keyword} ${primaryCity}`,
        `${keyword} appointment ${primaryCity}`,
        `${keyword} consultation ${primaryCity}`,
        `${keyword} free estimate ${primaryCity}`,
        `${keyword} same day service ${primaryCity}`
      ]},
      { name: '📞 Emergency/Urgent', keywords: [
        `emergency ${keyword} ${primaryCity}`,
        `24 hour ${keyword} ${primaryCity}`,
        `${keyword} open now ${primaryCity}`,
        `${keyword} open late ${primaryCity}`,
        `${keyword} weekend hours ${primaryCity}`,
        `after hours ${keyword} ${primaryCity}`,
        `same day ${keyword} ${primaryCity}`,
        `urgent ${keyword} ${primaryCity}`
      ]}
    ];
    
    return keywordTypes;
  };
  
  const renderKeywords = (keywordTypes) => {
    const container = document.getElementById('keywordsContainer');
    const allKeywords = keywordTypes.flatMap(cat => cat.keywords);
    
    container.innerHTML = keywordTypes.map(category => `
      <div style="margin-bottom: 20px;">
        <h4 style="margin: 0 0 10px; color: #667eea; font-size: 14px;">${category.name}</h4>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;">
          ${category.keywords.map(kw => `
            <div style="background: white; padding: 10px; border-radius: 6px; border: 1px solid #e0e0e0; display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 12px;">${escapeHtml(kw)}</span>
              <button class="copy-kw-btn" data-kw="${escapeHtml(kw)}" 
                style="padding: 4px 8px; background: #667eea; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 10px;">
                Copy
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');
    
    // Store all keywords for copy/export
    container.dataset.allKeywords = allKeywords.join('\n');
    
    document.querySelectorAll('.copy-kw-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        copyToClipboard(btn.dataset.kw);
        showNotification('Keyword copied!', 'success');
      });
    });
  };
  
  setTimeout(() => {
    const keyword = document.getElementById('mainKeyword').value.trim() || mainKeyword;
    const location = document.getElementById('locationInput').value.trim() || 'New York';
    const keywordTypes = generateKeywordList(keyword, location);
    renderKeywords(keywordTypes);
    
    document.getElementById('generateKeywords')?.addEventListener('click', () => {
      const newKeyword = document.getElementById('mainKeyword').value.trim() || mainKeyword;
      const newLocation = document.getElementById('locationInput').value.trim() || 'New York';
      const newKeywordTypes = generateKeywordList(newKeyword, newLocation);
      renderKeywords(newKeywordTypes);
    });
    
    document.getElementById('copyAllKeywords')?.addEventListener('click', () => {
      const container = document.getElementById('keywordsContainer');
      const allKeywords = container.dataset.allKeywords;
      if (allKeywords) {
        copyToClipboard(allKeywords);
        showNotification('All keywords copied!', 'success');
      }
    });
    
    document.getElementById('exportKeywordsCsv')?.addEventListener('click', () => {
      const container = document.getElementById('keywordsContainer');
      const allKeywords = container.dataset.allKeywords;
      if (allKeywords) {
        const csv = 'Keyword\n' + allKeywords.split('\n').map(k => `"${k}"`).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `local-keywords-${Date.now()}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        showNotification('Keywords exported!', 'success');
      }
    });
  }, 100);
}

// ==================== HREFLANG GENERATOR ====================
function generateHreflang() {
  const currentUrl = window.location.href;
  const urlObj = new URL(currentUrl);
  const baseUrl = urlObj.origin + urlObj.pathname;
  
  const languages = [
    { code: 'en', name: 'English', region: null },
    { code: 'en', name: 'English (US)', region: 'us' },
    { code: 'en', name: 'English (UK)', region: 'gb' },
    { code: 'en', name: 'English (Australia)', region: 'au' },
    { code: 'en', name: 'English (Canada)', region: 'ca' },
    { code: 'es', name: 'Spanish', region: null },
    { code: 'es', name: 'Spanish (Spain)', region: 'es' },
    { code: 'es', name: 'Spanish (Mexico)', region: 'mx' },
    { code: 'fr', name: 'French', region: null },
    { code: 'fr', name: 'French (France)', region: 'fr' },
    { code: 'fr', name: 'French (Canada)', region: 'ca' },
    { code: 'de', name: 'German', region: null },
    { code: 'de', name: 'German (Germany)', region: 'de' },
    { code: 'it', name: 'Italian', region: null },
    { code: 'pt', name: 'Portuguese', region: null },
    { code: 'pt', name: 'Portuguese (Brazil)', region: 'br' },
    { code: 'pt', name: 'Portuguese (Portugal)', region: 'pt' },
    { code: 'nl', name: 'Dutch', region: null },
    { code: 'ja', name: 'Japanese', region: null },
    { code: 'zh', name: 'Chinese (Simplified)', region: null },
    { code: 'zh', name: 'Chinese (Traditional)', region: 'tw' },
    { code: 'ko', name: 'Korean', region: null },
    { code: 'ar', name: 'Arabic', region: null },
    { code: 'ru', name: 'Russian', region: null },
    { code: 'hi', name: 'Hindi', region: null },
    { code: 'x-default', name: 'Default (Language Selector)', region: null }
  ];
  
  const content = document.createElement('div');
  content.innerHTML = `
    <div style="padding: 15px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
        <h3 style="margin: 0 0 10px;">🌐 Hreflang Generator</h3>
        <p style="margin: 0; opacity: 0.9; font-size: 13px;">Generate hreflang tags for multilingual SEO</p>
      </div>
      
      <div style="margin-bottom: 20px;">
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px;">
          <p><strong>Base URL Pattern:</strong></p>
          <input type="text" id="baseUrlPattern" value="${escapeHtml(baseUrl)}" 
            style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; margin-bottom: 10px;">
          <p style="font-size: 12px; color: #666;">Use {lang} or {lang}-{region} as placeholders (e.g., /{lang}/page or /{lang}-{region}/page)</p>
          
          <p><strong>URL Pattern Examples:</strong></p>
          <select id="urlPatternSelect" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px;">
            <option value="subdirectory">Subdirectory: https://example.com/{lang}/page</option>
            <option value="subdomain">Subdomain: https://{lang}.example.com/page</option>
            <option value="param">Parameter: https://example.com/page?lang={lang}</option>
            <option value="ccTLD">ccTLD: https://example.{tld}/page</option>
          </select>
        </div>
      </div>
      
      <div style="margin-bottom: 15px;">
        <button id="selectAllLanguages" style="padding: 8px 16px; background: #e0e0e0; color: #333; border: none; border-radius: 6px; cursor: pointer; margin-right: 10px;">
          Select All
        </button>
        <button id="deselectAllLanguages" style="padding: 8px 16px; background: #e0e0e0; color: #333; border: none; border-radius: 6px; cursor: pointer;">
          Deselect All
        </button>
      </div>
      
      <div style="max-height: 300px; overflow-y: auto; margin-bottom: 20px; border: 1px solid #e0e0e0; border-radius: 8px; padding: 10px;">
        <h4 style="margin: 0 0 10px;">Select Languages:</h4>
        ${languages.map((lang, i) => `
          <label style="display: flex; align-items: center; padding: 8px; border-bottom: 1px solid #f0f0f0; cursor: pointer;">
            <input type="checkbox" class="lang-checkbox" value="${lang.code}${lang.region ? '-' + lang.region : ''}" 
              data-name="${escapeHtml(lang.name)}" data-code="${lang.code}" data-region="${lang.region || ''}" checked>
            <span style="margin-left: 10px;">${escapeHtml(lang.name)}</span>
            <span style="margin-left: 10px; font-family: monospace; color: #666;">${lang.code}${lang.region ? '-' + lang.region : ''}</span>
          </label>
        `).join('')}
      </div>
      
      <div style="margin-bottom: 15px;">
        <button id="generateHreflangTags" style="padding: 12px 24px; background: #4CAF50; color: white; border: none; border-radius: 6px; cursor: pointer; margin-right: 10px;">
          🔄 Generate Tags
        </button>
        <button id="copyHreflangTags" style="padding: 12px 24px; background: #2196F3; color: white; border: none; border-radius: 6px; cursor: pointer;">
          📋 Copy Tags
        </button>
      </div>
      
      <div id="hreflangOutput" style="background: #1a1a2e; padding: 20px; border-radius: 8px;">
        <pre style="color: #eee; margin: 0; font-size: 12px; white-space: pre-wrap; word-break: break-all;" id="hreflangCode">Select languages and click "Generate Tags"</pre>
      </div>
      
      <div style="margin-top: 20px; background: #e3f2fd; padding: 15px; border-radius: 8px;">
        <h4 style="margin: 0 0 10px; color: #1565c0;">📋 Implementation Notes</h4>
        <ul style="margin: 0; padding-left: 20px;">
          <li>Add tags to the &lt;head&gt; section of each page</li>
          <li>Include self-referencing hreflang tag</li>
          <li>Always include x-default for language selector pages</li>
          <li>Use absolute URLs (including https://)</li>
          <li>Ensure bidirectional linking between all versions</li>
        </ul>
      </div>
    </div>
  `;
  
  const modal = createModal('🌐 Hreflang Generator', content);
  
  const generateTags = () => {
    const basePattern = document.getElementById('baseUrlPattern').value.trim();
    const patternSelect = document.getElementById('urlPatternSelect').value;
    const checkboxes = document.querySelectorAll('.lang-checkbox:checked');
    
    let tags = [];
    const selectedLangs = [];
    
    checkboxes.forEach(cb => {
      const code = cb.dataset.code;
      const region = cb.dataset.region;
      const hreflangValue = region ? `${code}-${region}` : code;
      const name = cb.dataset.name;
      
      let url = basePattern;
      
      if (patternSelect === 'subdirectory') {
        url = basePattern.replace(/\/$/, '') + `/${hreflangValue}/`;
      } else if (patternSelect === 'subdomain') {
        const urlObj = new URL(basePattern);
        url = `${urlObj.protocol}//${hreflangValue}.${urlObj.hostname}${urlObj.pathname}`;
      } else if (patternSelect === 'param') {
        url = basePattern + (basePattern.includes('?') ? '&' : '?') + `lang=${hreflangValue}`;
      }
      
      selectedLangs.push({ hreflang: hreflangValue, url: url, name: name });
    });
    
    // Add x-default if not already selected
    if (!selectedLangs.find(l => l.hreflang === 'x-default')) {
      let xDefaultUrl = basePattern;
      if (patternSelect === 'subdirectory') {
        xDefaultUrl = basePattern.replace(/\/$/, '') + '/';
      } else if (patternSelect === 'subdomain') {
        const urlObj = new URL(basePattern);
        xDefaultUrl = `${urlObj.protocol}//${urlObj.hostname}${urlObj.pathname}`;
      }
      selectedLangs.push({ hreflang: 'x-default', url: xDefaultUrl, name: 'Default' });
    }
    
    tags = selectedLangs.map(l => 
      `<link rel="alternate" hreflang="${l.hreflang}" href="${l.url}" />`
    );
    
    return tags.join('\n');
  };
  
  setTimeout(() => {
    document.getElementById('selectAllLanguages')?.addEventListener('click', () => {
      document.querySelectorAll('.lang-checkbox').forEach(cb => cb.checked = true);
    });
    
    document.getElementById('deselectAllLanguages')?.addEventListener('click', () => {
      document.querySelectorAll('.lang-checkbox').forEach(cb => cb.checked = false);
    });
    
    document.getElementById('urlPatternSelect')?.addEventListener('change', (e) => {
      const baseUrl = urlObj.origin + urlObj.pathname;
      const input = document.getElementById('baseUrlPattern');
      
      if (e.target.value === 'subdirectory') {
        input.value = baseUrl;
      } else if (e.target.value === 'subdomain') {
        input.value = baseUrl;
      } else if (e.target.value === 'param') {
        input.value = baseUrl;
      }
    });
    
    document.getElementById('generateHreflangTags')?.addEventListener('click', () => {
      const tags = generateTags();
      document.getElementById('hreflangCode').textContent = tags;
    });
    
    document.getElementById('copyHreflangTags')?.addEventListener('click', () => {
      const tags = document.getElementById('hreflangCode').textContent;
      if (tags && tags !== 'Select languages and click "Generate Tags"') {
        copyToClipboard(tags);
        showNotification('Hreflang tags copied!', 'success');
      } else {
        generateTags();
        setTimeout(() => {
          const newTags = document.getElementById('hreflangCode').textContent;
          copyToClipboard(newTags);
          showNotification('Hreflang tags copied!', 'success');
        }, 100);
      }
    });
    
    // Generate initial tags
    setTimeout(() => {
      const tags = generateTags();
      document.getElementById('hreflangCode').textContent = tags;
    }, 200);
  }, 100);
}
// ==================== SEO AUDIT CHECKLIST ====================
function showAuditChecklist() {
  const checklist = [
    { category: 'Technical SEO', items: [
      'XML Sitemap exists and is submitted',
      'Robots.txt is properly configured',
      'SSL certificate is valid',
      'Mobile-friendly design',
      'Page load speed under 3 seconds',
      'No broken links (404 errors)',
      'Canonical tags are set correctly',
      'URL structure is SEO-friendly',
      'Breadcrumb navigation implemented',
      'Pagination is handled correctly'
    ]},
    { category: 'On-Page SEO', items: [
      'Unique and optimized title tags',
      'Compelling meta descriptions',
      'H1 tag used once per page',
      'Proper heading hierarchy (H1-H6)',
      'Image alt text optimized',
      'Internal linking structure',
      'Content length adequate (300+ words)',
      'Keyword density 1-3%',
      'LSI keywords included',
      'Outbound links to authority sites'
    ]},
    { category: 'Content Quality', items: [
      'Original, non-duplicate content',
      'Readability score good',
      'Content answers user intent',
      'Updated regularly',
      'Multimedia included (images/videos)',
      'Proper formatting (bullets, short paras)',
      'Call-to-action present',
      'Social sharing buttons',
      'Author bio included',
      'Comments enabled/engaged'
    ]},
    { category: 'Local SEO', items: [
      'Google Business Profile claimed',
      'NAP consistent across web',
      'Local citations built',
      'Location pages created',
      'Local schema markup',
      'Reviews managed and responded to',
      'Local keywords targeted',
      'Service area pages',
      'Local backlinks acquired',
      'Google Maps optimized'
    ]},
    { category: 'Off-Page SEO', items: [
      'Quality backlinks from relevant sites',
      'Diverse link profile',
      'Social media presence',
      'Brand mentions monitored',
      'Guest posting strategy',
      'Broken link building',
      'Competitor backlink analysis',
      'Directory submissions',
      'Influencer outreach',
      'PR and media coverage'
    ]}
  ];
  
  // Load saved checklist state
  chrome.storage.local.get(['seoAuditChecklist'], (result) => {
    const savedState = result.seoAuditChecklist || {};
    
    const content = document.createElement('div');
    content.innerHTML = `
      <div style="padding: 15px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
          <h3 style="margin: 0 0 10px;">✅ SEO Audit Checklist</h3>
          <p style="margin: 0; opacity: 0.9; font-size: 13px;">Track your SEO progress</p>
        </div>
        
        <div style="margin-bottom: 20px;">
          <div style="display: flex; gap: 10px; margin-bottom: 15px;">
            <button id="saveChecklist" style="flex: 1; padding: 10px; background: #4CAF50; color: white; border: none; border-radius: 6px; cursor: pointer;">💾 Save Progress</button>
            <button id="resetChecklist" style="flex: 1; padding: 10px; background: #f44336; color: white; border: none; border-radius: 6px; cursor: pointer;">🔄 Reset</button>
            <button id="exportChecklist" style="flex: 1; padding: 10px; background: #2196F3; color: white; border: none; border-radius: 6px; cursor: pointer;">📤 Export</button>
          </div>
          
          <div id="progressBar" style="background: #e0e0e0; height: 8px; border-radius: 4px; overflow: hidden; margin-bottom: 10px;">
            <div id="progressFill" style="height: 100%; background: #4CAF50; width: 0%; transition: width 0.3s;"></div>
          </div>
          <div id="progressText" style="text-align: center; font-size: 12px; color: #666;">0% Complete</div>
        </div>
        
        <div id="checklistContainer">
          ${checklist.map((cat, catIndex) => `
            <div style="margin-bottom: 20px;">
              <h4 style="margin: 0 0 10px; color: #667eea; border-bottom: 2px solid #e0e0e0; padding-bottom: 5px;">
                ${cat.category}
              </h4>
              ${cat.items.map((item, itemIndex) => {
                const key = `${catIndex}-${itemIndex}`;
                const checked = savedState[key] || false;
                return `
                  <label style="display: flex; align-items: center; padding: 8px; background: ${checked ? '#e8f5e9' : 'white'}; border-radius: 6px; margin-bottom: 5px; cursor: pointer;">
                    <input type="checkbox" class="audit-checkbox" data-key="${key}" ${checked ? 'checked' : ''} style="margin-right: 10px;">
                    <span style="${checked ? 'text-decoration: line-through; color: #666;' : ''}">${item}</span>
                  </label>
                `;
              }).join('')}
            </div>
          `).join('')}
        </div>
      </div>
    `;
    
    const modal = createModal('✅ SEO Audit Checklist', content);
    
    const updateProgress = () => {
      const checkboxes = document.querySelectorAll('.audit-checkbox');
      const total = checkboxes.length;
      const checked = Array.from(checkboxes).filter(cb => cb.checked).length;
      const percent = Math.round((checked / total) * 100);
      
      document.getElementById('progressFill').style.width = percent + '%';
      document.getElementById('progressText').textContent = `${checked}/${total} items complete (${percent}%)`;
      
      // Update backgrounds
      checkboxes.forEach(cb => {
        const label = cb.closest('label');
        if (cb.checked) {
          label.style.background = '#e8f5e9';
          label.querySelector('span').style.textDecoration = 'line-through';
          label.querySelector('span').style.color = '#666';
        } else {
          label.style.background = 'white';
          label.querySelector('span').style.textDecoration = '';
          label.querySelector('span').style.color = '';
        }
      });
    };
    
    setTimeout(() => {
      updateProgress();
      
      document.querySelectorAll('.audit-checkbox').forEach(cb => {
        cb.addEventListener('change', updateProgress);
      });
      
      document.getElementById('saveChecklist')?.addEventListener('click', () => {
        const state = {};
        document.querySelectorAll('.audit-checkbox').forEach(cb => {
          state[cb.dataset.key] = cb.checked;
        });
        chrome.storage.local.set({ seoAuditChecklist: state }, () => {
          showNotification('Progress saved!', 'success');
        });
      });
      
      document.getElementById('resetChecklist')?.addEventListener('click', () => {
        if (confirm('Reset all checklist items?')) {
          document.querySelectorAll('.audit-checkbox').forEach(cb => {
            cb.checked = false;
          });
          updateProgress();
          chrome.storage.local.remove('seoAuditChecklist');
          showNotification('Checklist reset!', 'success');
        }
      });
      
      document.getElementById('exportChecklist')?.addEventListener('click', () => {
        const checked = Array.from(document.querySelectorAll('.audit-checkbox:checked')).length;
        const total = document.querySelectorAll('.audit-checkbox').length;
        const report = `SEO Audit Report\n${'='.repeat(30)}\nDate: ${new Date().toLocaleDateString()}\nDomain: ${window.location.hostname}\nProgress: ${checked}/${total} (${Math.round(checked/total*100)}%)\n\n` +
          checklist.map(cat => 
            `${cat.category}\n${'-'.repeat(20)}\n${cat.items.map(item => `[ ] ${item}`).join('\n')}`
          ).join('\n\n');
        
        const blob = new Blob([report], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `seo-audit-${new Date().toISOString().split('T')[0]}.txt`;
        a.click();
        URL.revokeObjectURL(url);
        showNotification('Audit exported!', 'success');
      });
    }, 100);
  });
}

// ==================== PUBLICATION DATE CHECKER ====================
function checkPublicationDate() {
  const url = window.location.href;
  const domain = window.location.hostname.replace('www.', '');
  
  // Check various date sources
  const dateSources = {
    articlePublished: document.querySelector('meta[property="article:published_time"]')?.getAttribute('content'),
    articleModified: document.querySelector('meta[property="article:modified_time"]')?.getAttribute('content'),
    ogUpdated: document.querySelector('meta[property="og:updated_time"]')?.getAttribute('content'),
    datePublished: document.querySelector('meta[name="datePublished"]')?.getAttribute('content'),
    dateModified: document.querySelector('meta[name="dateModified"]')?.getAttribute('content'),
    pubdate: document.querySelector('meta[name="pubdate"]')?.getAttribute('content'),
    schemaDatePublished: null,
    schemaDateModified: null,
    visibleDate: null,
    urlDate: null,
    sitemapDate: null,
    commentDates: []
  };
  
  // Check schema.org dates
  const schemas = document.querySelectorAll('script[type="application/ld+json"]');
  schemas.forEach(schema => {
    try {
      const data = JSON.parse(schema.textContent);
      if (data.datePublished) dateSources.schemaDatePublished = data.datePublished;
      if (data.dateModified) dateSources.schemaDateModified = data.dateModified;
    } catch (e) {}
  });
  
  // Check for visible dates
  const dateSelectors = [
    'time[datetime]',
    '[class*="date"]',
    '[class*="published"]',
    '[class*="posted"]',
    '[class*="updated"]',
    '.post-date',
    '.entry-date',
    '.article-date',
    '.byline time',
    '.meta time'
  ];
  
  dateSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      const datetime = el.getAttribute('datetime');
      const text = el.textContent.trim();
      if (datetime) dateSources.visibleDate = datetime;
      else if (text && text.match(/\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}/)) {
        dateSources.visibleDate = text;
      }
    });
  });
  
  // Check URL for date patterns
  const urlDatePatterns = [
    /\/(\d{4})\/(\d{2})\/(\d{2})\//,
    /\/(\d{4})\/(\d{2})\//,
    /\/(\d{2})-(\d{2})-(\d{4})-/,
    /(\d{4})[\/\-](\d{2})[\/\-](\d{2})/
  ];
  
  urlDatePatterns.forEach(pattern => {
    const match = url.match(pattern);
    if (match) {
      if (match.length === 4) {
        dateSources.urlDate = `${match[1]}-${match[2]}-${match[3]}`;
      } else if (match.length === 3) {
        dateSources.urlDate = `${match[1]}-${match[2]}-01`;
      }
    }
  });
  
  // Check for comment dates (indicates freshness)
  document.querySelectorAll('.comment time, .comment-date, [class*="comment"] time').forEach(el => {
    const datetime = el.getAttribute('datetime') || el.textContent.trim();
    if (datetime) dateSources.commentDates.push(datetime);
  });
  
  // Analyze freshness
  const today = new Date();
  let latestDate = null;
  let ageInDays = null;
  let freshness = 'Unknown';
  
  const allDates = [
    dateSources.articleModified,
    dateSources.articlePublished,
    dateSources.schemaDateModified,
    dateSources.schemaDatePublished,
    dateSources.dateModified,
    dateSources.datePublished,
    dateSources.ogUpdated,
    dateSources.visibleDate,
    dateSources.urlDate,
    ...dateSources.commentDates
  ].filter(Boolean);
  
  if (allDates.length > 0) {
    latestDate = new Date(Math.max(...allDates.map(d => new Date(d))));
    const diffTime = Math.abs(today - latestDate);
    ageInDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (ageInDays < 7) freshness = '🟢 Fresh (Last 7 days)';
    else if (ageInDays < 30) freshness = '🟡 Recent (Last 30 days)';
    else if (ageInDays < 90) freshness = '🟠 Somewhat Fresh (Last 90 days)';
    else if (ageInDays < 365) freshness = '🔴 Stale (Over 90 days)';
    else freshness = '⚫ Very Stale (Over 1 year)';
  }
  
  const content = document.createElement('div');
  content.innerHTML = `
    <div style="padding: 15px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
        <h3 style="margin: 0 0 10px;">📅 Publication Date Checker</h3>
        <p style="margin: 0; opacity: 0.9; font-size: 13px;">Analyze content freshness and date signals</p>
      </div>
      
      <div style="margin-bottom: 20px;">
        <div style="background: ${ageInDays ? (ageInDays < 30 ? '#e8f5e9' : ageInDays < 90 ? '#fff3e0' : '#ffebee') : '#f5f5f5'}; padding: 20px; border-radius: 12px; text-align: center;">
          <div style="font-size: 14px; color: #666; margin-bottom: 5px;">Content Freshness</div>
          <div style="font-size: 36px; font-weight: bold; color: ${ageInDays ? (ageInDays < 30 ? '#4CAF50' : ageInDays < 90 ? '#FF9800' : '#f44336') : '#999'};">${freshness}</div>
          ${latestDate ? `
            <div style="font-size: 14px; margin-top: 10px;">
              Latest Date: ${latestDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <div style="font-size: 13px; color: #666; margin-top: 5px;">
              ${ageInDays} days ago
            </div>
          ` : '<div style="font-size: 13px; color: #666; margin-top: 10px;">No date found on page</div>'}
        </div>
      </div>
      
      <div style="margin-bottom: 20px;">
        <h4 style="margin: 0 0 10px;">📋 Date Sources Found</h4>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px;">
          ${Object.entries(dateSources).map(([key, value]) => {
            if (key === 'commentDates') {
              return value.length > 0 ? `
                <div style="display: flex; padding: 8px 0; border-bottom: 1px solid #e0e0e0;">
                  <span style="width: 180px; font-weight: 600;">${key}:</span>
                  <span style="color: #4CAF50;">✅ ${value.length} comment dates found</span>
                </div>
              ` : '';
            }
            return `
              <div style="display: flex; padding: 8px 0; border-bottom: 1px solid #e0e0e0;">
                <span style="width: 180px; font-weight: 600;">${key}:</span>
                ${value ? `<span style="color: #4CAF50;">✅ ${escapeHtml(value)}</span>` : '<span style="color: #999;">❌ Not found</span>'}
              </div>
            `;
          }).join('')}
        </div>
      </div>
      
      <div style="margin-bottom: 20px;">
        <h4 style="margin: 0 0 10px;">💡 SEO Recommendations</h4>
        <ul style="background: #e3f2fd; padding: 15px 15px 15px 35px; border-radius: 8px; margin: 0;">
          ${!dateSources.articlePublished && !dateSources.schemaDatePublished ? 
            '<li>Add article:published_time meta tag or schema datePublished</li>' : ''}
          ${!dateSources.articleModified && !dateSources.schemaDateModified ? 
            '<li>Add article:modified_time meta tag to show content updates</li>' : ''}
          ${!dateSources.visibleDate ? 
            '<li>Display publication date visibly on the page</li>' : ''}
          ${ageInDays > 90 ? 
            '<li>Consider updating content to maintain freshness</li>' : ''}
          ${dateSources.urlDate ? 
            '<li>✅ URL contains date - good for news/articles</li>' : ''}
          <li>Use structured data (schema.org) for best results</li>
          <li>Update content regularly to signal freshness to Google</li>
        </ul>
      </div>
      
      <div style="margin-bottom: 15px;">
        <button id="copyDateReport" style="padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 6px; cursor: pointer; margin-right: 10px;">
          📋 Copy Report
        </button>
        <button id="openGoogleCache" style="padding: 10px 20px; background: #2196F3; color: white; border: none; border-radius: 6px; cursor: pointer;">
          🔍 Check Google Cache
        </button>
      </div>
    </div>
  `;
  
  const modal = createModal('📅 Publication Date Checker', content);
  
  setTimeout(() => {
    document.getElementById('copyDateReport')?.addEventListener('click', () => {
      let report = `Publication Date Report - ${domain}\n`;
      report += `URL: ${url}\n`;
      report += `Freshness: ${freshness}\n`;
      if (latestDate) {
        report += `Latest Date: ${latestDate.toLocaleDateString()}\n`;
        report += `Age: ${ageInDays} days\n\n`;
      }
      report += `Date Sources:\n`;
      Object.entries(dateSources).forEach(([key, value]) => {
        if (key !== 'commentDates' && value) {
          report += `✅ ${key}: ${value}\n`;
        }
      });
      if (dateSources.commentDates.length > 0) {
        report += `✅ commentDates: ${dateSources.commentDates.length} found\n`;
      }
      
      copyToClipboard(report);
      showNotification('Report copied!', 'success');
    });
    
    document.getElementById('openGoogleCache')?.addEventListener('click', () => {
      window.open(`https://webcache.googleusercontent.com/search?q=cache:${encodeURIComponent(url)}`, '_blank');
    });
  }, 100);
}

// ==================== MOBILE USABILITY TEST ====================
function testMobileUsability() {
  const url = window.location.href;
  const viewport = document.querySelector('meta[name="viewport"]')?.getAttribute('content') || '';
  const fontSize = window.getComputedStyle(document.body).fontSize;
  const buttons = document.querySelectorAll('button, a, [role="button"], .btn');
  const images = document.querySelectorAll('img');
  const videos = document.querySelectorAll('video');
  
  // Check tap targets
  let smallTapTargets = 0;
  let closeTapTargets = 0;
  
  buttons.forEach(btn => {
    const rect = btn.getBoundingClientRect();
    if (rect.width < 44 || rect.height < 44) smallTapTargets++;
  });
  
  // Check for close proximity
  for (let i = 0; i < buttons.length - 1; i++) {
    const rect1 = buttons[i].getBoundingClientRect();
    const rect2 = buttons[i + 1]?.getBoundingClientRect();
    if (rect2) {
      const distance = Math.sqrt(
        Math.pow(rect1.x - rect2.x, 2) + Math.pow(rect1.y - rect2.y, 2)
      );
      if (distance < 32) closeTapTargets++;
    }
  }
  
  // Check images
  let imagesWithoutDimensions = 0;
  images.forEach(img => {
    if (!img.width || !img.height) imagesWithoutDimensions++;
  });
  
  // Check font size
  const bodyFontSize = parseFloat(fontSize);
  const isFontReadable = bodyFontSize >= 16;
  
  // Check viewport
  const hasViewport = viewport.length > 0;
  const isViewportCorrect = viewport.includes('width=device-width') && viewport.includes('initial-scale=1');
  
  // Check horizontal scroll
  const hasHorizontalScroll = document.documentElement.scrollWidth > window.innerWidth;
  
  // Calculate score
  let score = 100;
  if (!hasViewport) score -= 20;
  if (!isViewportCorrect) score -= 10;
  if (!isFontReadable) score -= 10;
  if (smallTapTargets > 0) score -= Math.min(20, smallTapTargets * 2);
  if (closeTapTargets > 0) score -= 10;
  if (hasHorizontalScroll) score -= 15;
  if (imagesWithoutDimensions > 0) score -= Math.min(15, imagesWithoutDimensions * 3);
  
  score = Math.max(0, score);
  
  const getScoreColor = (s) => {
    if (s >= 90) return '#4CAF50';
    if (s >= 70) return '#FF9800';
    return '#f44336';
  };
  
  const getScoreGrade = (s) => {
    if (s >= 90) return 'Excellent';
    if (s >= 70) return 'Good';
    if (s >= 50) return 'Fair';
    return 'Poor';
  };
  
  const content = document.createElement('div');
  content.innerHTML = `
    <div style="padding: 15px;">
      <div style="text-align: center; padding: 20px; background: ${getScoreColor(score)}; color: white; border-radius: 12px; margin-bottom: 20px;">
        <div style="font-size: 48px; font-weight: bold;">${score}</div>
        <div style="font-size: 18px; margin: 5px 0;">Mobile Usability Score</div>
        <div style="font-size: 14px; opacity: 0.9;">${getScoreGrade(score)}</div>
      </div>
      
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 20px;">
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; text-align: center;">
          <div style="font-size: 24px; font-weight: bold; color: ${hasViewport ? '#4CAF50' : '#f44336'};">${hasViewport ? '✅' : '❌'}</div>
          <div>Viewport Meta Tag</div>
          <div style="font-size: 11px; color: #666; margin-top: 5px;">${escapeHtml(viewport) || 'Missing'}</div>
        </div>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; text-align: center;">
          <div style="font-size: 24px; font-weight: bold; color: ${isFontReadable ? '#4CAF50' : '#FF9800'};">${bodyFontSize}px</div>
          <div>Body Font Size</div>
          <div style="font-size: 11px; color: #666; margin-top: 5px;">${isFontReadable ? '✅ Good' : '⚠️ Under 16px'}</div>
        </div>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; text-align: center;">
          <div style="font-size: 24px; font-weight: bold; color: ${smallTapTargets === 0 ? '#4CAF50' : '#f44336'};">${smallTapTargets}</div>
          <div>Small Tap Targets</div>
          <div style="font-size: 11px; color: #666; margin-top: 5px;">${smallTapTargets === 0 ? '✅ All 44x44+' : '⚠️ Under 44x44'}</div>
        </div>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; text-align: center;">
          <div style="font-size: 24px; font-weight: bold; color: ${!hasHorizontalScroll ? '#4CAF50' : '#f44336'};">${hasHorizontalScroll ? '❌' : '✅'}</div>
          <div>Horizontal Scroll</div>
          <div style="font-size: 11px; color: #666; margin-top: 5px;">${hasHorizontalScroll ? 'Detected' : 'None'}</div>
        </div>
      </div>
      
      <div style="margin-bottom: 20px;">
        <h4 style="margin: 0 0 10px;">📊 Detailed Analysis</h4>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #e0e0e0;">
              <td style="padding: 8px 0;">Viewport Configuration</td>
              <td style="padding: 8px 0; text-align: right;">${isViewportCorrect ? '✅ Correct' : '⚠️ Needs Fix'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e0e0e0;">
              <td style="padding: 8px 0;">Close Tap Targets</td>
              <td style="padding: 8px 0; text-align: right;">${closeTapTargets} detected</td>
            </tr>
            <tr style="border-bottom: 1px solid #e0e0e0;">
              <td style="padding: 8px 0;">Images Without Dimensions</td>
              <td style="padding: 8px 0; text-align: right;">${imagesWithoutDimensions}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e0e0e0;">
              <td style="padding: 8px 0;">Total Tap Elements</td>
              <td style="padding: 8px 0; text-align: right;">${buttons.length}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;">Videos (Check Mobile)</td>
              <td style="padding: 8px 0; text-align: right;">${videos.length}</td>
            </tr>
          </table>
        </div>
      </div>
      
      <div style="margin-bottom: 15px;">
        <button id="openMobileTest" style="padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 6px; cursor: pointer; margin-right: 10px;">
          🔍 Google Mobile-Friendly Test
        </button>
        <button id="copyMobileReport" style="padding: 10px 20px; background: #2196F3; color: white; border: none; border-radius: 6px; cursor: pointer;">
          📋 Copy Report
        </button>
      </div>
      
      <div style="background: #fff3e0; padding: 15px; border-radius: 8px;">
        <h4 style="margin: 0 0 10px; color: #e65100;">📱 Priority Fixes</h4>
        <ul style="margin: 0; padding-left: 20px;">
          ${!hasViewport ? '<li>Add viewport meta tag</li>' : ''}
          ${!isViewportCorrect ? '<li>Fix viewport configuration</li>' : ''}
          ${!isFontReadable ? '<li>Increase body font size to at least 16px</li>' : ''}
          ${smallTapTargets > 0 ? `<li>Increase size of ${smallTapTargets} tap targets to 44x44px</li>` : ''}
          ${closeTapTargets > 0 ? '<li>Add more spacing between tap targets</li>' : ''}
          ${hasHorizontalScroll ? '<li>Fix horizontal scrolling issue</li>' : ''}
          ${imagesWithoutDimensions > 0 ? '<li>Add width/height to images to prevent layout shift</li>' : ''}
        </ul>
      </div>
    </div>
  `;
  
  const modal = createModal('📱 Mobile Usability Test', content);
  
  setTimeout(() => {
    document.getElementById('openMobileTest')?.addEventListener('click', () => {
      window.open(`https://search.google.com/test/mobile-friendly?url=${encodeURIComponent(url)}`, '_blank');
    });
    
    document.getElementById('copyMobileReport')?.addEventListener('click', () => {
      const report = `Mobile Usability Report - ${new Date().toLocaleDateString()}
URL: ${url}
Score: ${score}/100 (${getScoreGrade(score)})

Issues Found:
${!hasViewport ? '- Missing viewport meta tag\n' : ''}
${!isViewportCorrect ? '- Incorrect viewport configuration\n' : ''}
${!isFontReadable ? '- Font size under 16px\n' : ''}
${smallTapTargets > 0 ? `- ${smallTapTargets} small tap targets\n` : ''}
${closeTapTargets > 0 ? `- ${closeTapTargets} close tap targets\n` : ''}
${hasHorizontalScroll ? '- Horizontal scroll detected\n' : ''}
${imagesWithoutDimensions > 0 ? `- ${imagesWithoutDimensions} images without dimensions\n` : ''}`;
      
      copyToClipboard(report);
      showNotification('Report copied!', 'success');
    });
  }, 100);
}

// ==================== DUPLICATE CONTENT FINDER ====================
function findDuplicateContent() {
  const url = window.location.href;
  const domain = window.location.hostname.replace('www.', '');
  const title = document.title;
  const h1 = document.querySelector('h1')?.textContent || '';
  const metaDesc = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
  
  // Get content samples
  const bodyText = document.body.innerText.substring(0, 2000);
  const firstParagraphs = Array.from(document.querySelectorAll('p')).slice(0, 3).map(p => p.textContent.trim());
  
  // Generate search queries to find duplicates
  const queries = [
    { name: 'Exact Title Match', query: `"${title}" -site:${domain}` },
    { name: 'H1 Match', query: `"${h1}" -site:${domain}` },
    { name: 'First Paragraph', query: `"${firstParagraphs[0]?.substring(0, 100)}" -site:${domain}` }
  ];
  
  // Check for internal duplicate titles
  const internalDuplicateQueries = [
    { name: 'Similar Pages on Site', query: `site:${domain} intitle:"${title.substring(0, 30)}"` },
    { name: 'Same H1 on Site', query: `site:${domain} "${h1.substring(0, 50)}"` }
  ];
  
  // Content fingerprint
  const contentHash = btoa(bodyText.substring(0, 500)).substring(0, 32);
  
  // Check for thin content
  const wordCount = (document.body.innerText.match(/\b\w+\b/g) || []).length;
  const isThinContent = wordCount < 300;
  
  // Check for boilerplate
  const footer = document.querySelector('footer')?.textContent || '';
  const header = document.querySelector('header')?.textContent || '';
  const sidebar = document.querySelector('aside, .sidebar')?.textContent || '';
  const mainContent = document.querySelector('main, article, .content, #content')?.textContent || bodyText;
  
  const boilerplateRatio = ((footer.length + header.length + sidebar.length) / bodyText.length * 100).toFixed(1);
  
  const content = document.createElement('div');
  content.innerHTML = `
    <div style="padding: 15px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
        <h3 style="margin: 0 0 10px;">🔄 Duplicate Content Finder</h3>
        <p style="margin: 0; opacity: 0.9; font-size: 13px;">Check for duplicate and thin content issues</p>
      </div>
      
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 20px;">
        <div style="background: ${isThinContent ? '#ffebee' : '#e8f5e9'}; padding: 15px; border-radius: 8px; text-align: center;">
          <div style="font-size: 24px; font-weight: bold; color: ${isThinContent ? '#f44336' : '#4CAF50'};">${wordCount.toLocaleString()}</div>
          <div>Word Count</div>
          <div style="font-size: 11px; margin-top: 5px;">${isThinContent ? '⚠️ Thin Content' : '✅ Good'}</div>
        </div>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; text-align: center;">
          <div style="font-size: 24px; font-weight: bold;">${boilerplateRatio}%</div>
          <div>Boilerplate Ratio</div>
          <div style="font-size: 11px; margin-top: 5px;">${boilerplateRatio > 30 ? '⚠️ High' : '✅ Good'}</div>
        </div>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; text-align: center;">
          <div style="font-size: 24px; font-weight: bold;">${contentHash.substring(0, 8)}</div>
          <div>Content Fingerprint</div>
          <div style="font-size: 11px; margin-top: 5px;">Unique ID</div>
        </div>
      </div>
      
      <div style="margin-bottom: 20px;">
        <h4 style="margin: 0 0 10px;">🔍 Check External Duplicates</h4>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px;">
          ${queries.map((q, i) => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background: white; border-radius: 6px; margin-bottom: 8px;">
              <span><strong>${q.name}:</strong> <span style="font-size: 12px; color: #666;">${escapeHtml(q.query.substring(0, 50))}...</span></span>
              <button class="check-duplicate-btn" data-query="${escapeHtml(q.query)}" style="padding: 6px 12px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer;">Search</button>
            </div>
          `).join('')}
        </div>
      </div>
      
      <div style="margin-bottom: 20px;">
        <h4 style="margin: 0 0 10px;">📂 Check Internal Duplicates</h4>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px;">
          ${internalDuplicateQueries.map((q, i) => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background: white; border-radius: 6px; margin-bottom: 8px;">
              <span><strong>${q.name}:</strong> <span style="font-size: 12px; color: #666;">${escapeHtml(q.query)}</span></span>
              <button class="check-duplicate-btn" data-query="${escapeHtml(q.query)}" style="padding: 6px 12px; background: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer;">Search</button>
            </div>
          `).join('')}
        </div>
      </div>
      
      <div style="margin-bottom: 20px;">
        <h4 style="margin: 0 0 10px;">📋 Content Samples</h4>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px;">
          <p><strong>Title:</strong> ${escapeHtml(title)}</p>
          <p><strong>H1:</strong> ${escapeHtml(h1)}</p>
          <p><strong>Meta Description:</strong> ${escapeHtml(metaDesc) || 'Missing'}</p>
          ${firstParagraphs[0] ? `<p><strong>First Paragraph:</strong> ${escapeHtml(firstParagraphs[0].substring(0, 150))}...</p>` : ''}
        </div>
      </div>
      
      <div style="margin-bottom: 15px;">
        <button id="checkAllDuplicates" style="padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 6px; cursor: pointer; margin-right: 10px;">
          🚀 Check All Queries
        </button>
        <button id="copyDuplicateReport" style="padding: 10px 20px; background: #2196F3; color: white; border: none; border-radius: 6px; cursor: pointer;">
          📋 Copy Report
        </button>
      </div>
      
      <div style="background: #fff3e0; padding: 15px; border-radius: 8px;">
        <h4 style="margin: 0 0 10px; color: #e65100;">💡 Recommendations</h4>
        <ul style="margin: 0; padding-left: 20px;">
          ${isThinContent ? '<li>Add more content (target 300+ words for informational pages)</li>' : ''}
          ${boilerplateRatio > 30 ? '<li>Reduce header/footer/sidebar content ratio</li>' : ''}
          ${!metaDesc ? '<li>Add a unique meta description</li>' : ''}
          <li>Use canonical tags to prevent duplicate content issues</li>
          <li>Regularly check for scraped/copied content</li>
          <li>Consider using Copyscape or Siteliner for deeper analysis</li>
        </ul>
      </div>
    </div>
  `;
  
  const modal = createModal('🔄 Duplicate Content Finder', content);
  
  setTimeout(() => {
    const openQuery = (query) => {
      window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
    };
    
    document.querySelectorAll('.check-duplicate-btn').forEach(btn => {
      btn.addEventListener('click', () => openQuery(btn.dataset.query));
    });
    
    document.getElementById('checkAllDuplicates')?.addEventListener('click', () => {
      [...queries, ...internalDuplicateQueries].forEach((q, i) => {
        setTimeout(() => openQuery(q.query), i * 500);
      });
      showNotification('Opening all duplicate checks...', 'success');
    });
    
    document.getElementById('copyDuplicateReport')?.addEventListener('click', () => {
      const report = `Duplicate Content Report - ${domain}
Date: ${new Date().toLocaleDateString()}
URL: ${url}

Word Count: ${wordCount} ${isThinContent ? '(Thin Content)' : '(Good)'}
Boilerplate Ratio: ${boilerplateRatio}%
Content Fingerprint: ${contentHash}

Title: ${title}
H1: ${h1}
Meta Description: ${metaDesc || 'Missing'}

Check External Duplicates:
${queries.map(q => `- ${q.name}: ${q.query}`).join('\n')}

Check Internal Duplicates:
${internalDuplicateQueries.map(q => `- ${q.name}: ${q.query}`).join('\n')}`;
      
      copyToClipboard(report);
      showNotification('Report copied!', 'success');
    });
  }, 100);
}

// ==================== SITE STRUCTURE VISUALIZER ====================
function visualizeSiteStructure() {
  const domain = window.location.hostname.replace('www.', '');
  const currentPath = window.location.pathname;
  
  // Get all links on page
  const links = document.querySelectorAll('a[href]');
  const internalLinks = [];
  const externalLinks = [];
  const linkMap = new Map();
  
  links.forEach(link => {
    try {
      const href = link.href;
      if (!href || href.startsWith('javascript:') || href === '#') return;
      
      const url = new URL(href);
      const isInternal = url.hostname === window.location.hostname;
      const text = link.textContent.trim().substring(0, 50) || '[No Text]';
      
      if (isInternal) {
        const path = url.pathname;
        if (!linkMap.has(path)) {
          linkMap.set(path, { path, text, count: 1 });
        } else {
          linkMap.get(path).count++;
        }
        internalLinks.push({ path, text });
      } else {
        externalLinks.push({ domain: url.hostname, text });
      }
    } catch (e) {}
  });
  
  // Get heading structure
  const headings = [];
  for (let i = 1; i <= 6; i++) {
    document.querySelectorAll(`h${i}`).forEach(h => {
      headings.push({ level: i, text: h.textContent.trim().substring(0, 50) });
    });
  }
  
  // Get breadcrumbs
  const breadcrumbs = [];
  document.querySelectorAll('[class*="breadcrumb"] a, [aria-label*="breadcrumb"] a, .breadcrumbs a').forEach(b => {
    breadcrumbs.push(b.textContent.trim());
  });
  
  // Get navigation items
  const navItems = [];
  document.querySelectorAll('nav a, .menu a, .navigation a').forEach(n => {
    navItems.push(n.textContent.trim().substring(0, 30));
  });
  
  const uniqueInternalPaths = [...linkMap.values()].sort((a, b) => b.count - a.count);
  
  const content = document.createElement('div');
  content.innerHTML = `
    <div style="padding: 15px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
        <h3 style="margin: 0 0 10px;">🗺️ Site Structure Visualizer</h3>
        <p style="margin: 0; opacity: 0.9; font-size: 13px;">Analyze page architecture and internal linking</p>
      </div>
      
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 20px;">
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; text-align: center;">
          <div style="font-size: 24px; font-weight: bold; color: #667eea;">${internalLinks.length}</div>
          <div>Internal Links</div>
        </div>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; text-align: center;">
          <div style="font-size: 24px; font-weight: bold; color: #FF9800;">${externalLinks.length}</div>
          <div>External Links</div>
        </div>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; text-align: center;">
          <div style="font-size: 24px; font-weight: bold; color: #4CAF50;">${linkMap.size}</div>
          <div>Unique Pages Linked</div>
        </div>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; text-align: center;">
          <div style="font-size: 24px; font-weight: bold; color: #9C27B0;">${currentPath.split('/').filter(Boolean).length}</div>
          <div>Click Depth</div>
        </div>
      </div>
      
      <div style="margin-bottom: 20px;">
        <h4 style="margin: 0 0 10px;">📊 Most Linked Internal Pages</h4>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; max-height: 300px; overflow-y: auto;">
          ${uniqueInternalPaths.slice(0, 15).map((item, i) => `
            <div style="display: flex; align-items: center; padding: 8px; background: white; border-radius: 6px; margin-bottom: 5px;">
              <span style="width: 40px; font-weight: 600; color: #667eea;">#${i + 1}</span>
              <span style="flex: 1; font-family: monospace; font-size: 12px;">${escapeHtml(item.path)}</span>
              <span style="background: #667eea; color: white; padding: 2px 10px; border-radius: 20px; font-size: 11px;">${item.count}</span>
            </div>
          `).join('')}
        </div>
      </div>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
        <div>
          <h4 style="margin: 0 0 10px;">📑 Heading Structure</h4>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; max-height: 200px; overflow-y: auto;">
            ${headings.length > 0 ? headings.map((h, i) => `
              <div style="padding: 5px 0; border-bottom: 1px solid #e0e0e0;">
                <span style="display: inline-block; width: 30px; color: #999;">H${h.level}</span>
                <span>${escapeHtml(h.text)}</span>
              </div>
            `).join('') : '<p style="color: #999;">No headings found</p>'}
          </div>
        </div>
        
        <div>
          <h4 style="margin: 0 0 10px;">🧭 Breadcrumbs</h4>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 8px;">
            ${breadcrumbs.length > 0 ? `
              <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                ${breadcrumbs.map((b, i) => `
                  <span style="background: white; padding: 4px 12px; border-radius: 20px; font-size: 12px;">${escapeHtml(b)}</span>
                  ${i < breadcrumbs.length - 1 ? '<span style="color: #999;">→</span>' : ''}
                `).join('')}
              </div>
            ` : '<p style="color: #999;">No breadcrumbs found</p>'}
          </div>
        </div>
      </div>
      
      <div style="margin-bottom: 20px;">
        <h4 style="margin: 0 0 10px;">🔗 Navigation Items</h4>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px;">
          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            ${[...new Set(navItems)].slice(0, 20).map(item => `
              <span style="background: white; padding: 6px 12px; border-radius: 20px; font-size: 12px; border: 1px solid #e0e0e0;">${escapeHtml(item)}</span>
            `).join('')}
            ${navItems.length === 0 ? '<p style="color: #999;">No navigation items found</p>' : ''}
          </div>
        </div>
      </div>
      
      <div style="margin-bottom: 15px;">
        <button id="copyStructureReport" style="padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 6px; cursor: pointer; margin-right: 10px;">
          📋 Copy Structure Report
        </button>
        <button id="exportStructureCSV" style="padding: 10px 20px; background: #2196F3; color: white; border: none; border-radius: 6px; cursor: pointer;">
          📊 Export CSV
        </button>
      </div>
      
      <div style="background: #e3f2fd; padding: 15px; border-radius: 8px;">
        <h4 style="margin: 0 0 10px; color: #1565c0;">💡 Structure Recommendations</h4>
        <ul style="margin: 0; padding-left: 20px;">
          ${currentPath.split('/').filter(Boolean).length > 3 ? '<li>Consider flattening URL structure (too deep)</li>' : '<li>✅ URL depth is good</li>'}
          ${headings.length === 0 ? '<li>Add heading tags (H1-H6) for better structure</li>' : ''}
          ${breadcrumbs.length === 0 ? '<li>Add breadcrumb navigation for better UX and SEO</li>' : '<li>✅ Breadcrumbs implemented</li>'}
          ${internalLinks.length < 5 ? '<li>Add more internal links to improve crawlability</li>' : ''}
          <li>Ensure important pages are within 3 clicks from homepage</li>
          <li>Use descriptive anchor text for internal links</li>
        </ul>
      </div>
    </div>
  `;
  
  const modal = createModal('🗺️ Site Structure Visualizer', content);
  
  setTimeout(() => {
    document.getElementById('copyStructureReport')?.addEventListener('click', () => {
      const report = `Site Structure Report - ${domain}
Date: ${new Date().toLocaleDateString()}
URL: ${window.location.href}

Statistics:
- Internal Links: ${internalLinks.length}
- External Links: ${externalLinks.length}
- Unique Pages Linked: ${linkMap.size}
- Click Depth: ${currentPath.split('/').filter(Boolean).length}

Top Linked Pages:
${uniqueInternalPaths.slice(0, 10).map((p, i) => `${i + 1}. ${p.path} (${p.count} links)`).join('\n')}

Heading Structure:
${headings.map(h => `- H${h.level}: ${h.text}`).join('\n')}

Breadcrumbs: ${breadcrumbs.length > 0 ? breadcrumbs.join(' → ') : 'None'}`;
      
      copyToClipboard(report);
      showNotification('Report copied!', 'success');
    });
    
    document.getElementById('exportStructureCSV')?.addEventListener('click', () => {
      let csv = 'Path,Link Count,Anchor Text\n';
      uniqueInternalPaths.forEach(p => {
        csv += `"${p.path}",${p.count},"${p.text.replace(/"/g, '""')}"\n`;
      });
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `site-structure-${domain}-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      showNotification('CSV exported!', 'success');
    });
  }, 100);
}

// ==================== GOOGLE MAPS SCRAPER ====================
function scrapeGoogleMaps() {
  const isGoogleMaps = window.location.hostname.includes('google.') && 
                       (window.location.pathname.includes('/maps') || window.location.search.includes('maps'));
  
  const content = document.createElement('div');
  content.innerHTML = `
    <div style="padding: 15px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
        <h3 style="margin: 0 0 10px;">🗺️ Google Maps Scraper</h3>
        <p style="margin: 0; opacity: 0.9; font-size: 13px;">Extract business information from Google Maps</p>
      </div>
      
      ${isGoogleMaps ? `
        <div style="margin-bottom: 20px;">
          <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; text-align: center;">
            <p style="margin: 0; color: #2e7d32;">✅ Google Maps detected!</p>
          </div>
        </div>
        
        <div style="margin-bottom: 20px;">
          <button id="scrapeCurrentResults" style="width: 100%; padding: 15px; background: #4CAF50; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; font-weight: 600; margin-bottom: 10px;">
            🔍 Scrape Current Map Results
          </button>
          <button id="autoScrollAndScrape" style="width: 100%; padding: 15px; background: #2196F3; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px;">
            📜 Auto-Scroll & Scrape All
          </button>
        </div>
        
        <div id="scrapeResults" style="margin-bottom: 20px;">
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; text-align: center;">
            <p style="color: #666;">Click a button above to start scraping</p>
          </div>
        </div>
      ` : `
        <div style="margin-bottom: 20px;">
          <div style="background: #fff3e0; padding: 20px; border-radius: 8px; text-align: center;">
            <p style="margin: 0 0 15px; color: #e65100;">⚠️ This tool works on Google Maps pages</p>
            <button id="openGoogleMaps" style="padding: 12px 24px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer;">
              🗺️ Open Google Maps
            </button>
          </div>
        </div>
        
        <div style="margin-bottom: 20px;">
          <h4 style="margin: 0 0 10px;">🔍 Search Google Maps</h4>
          <div style="display: flex; gap: 10px;">
            <input type="text" id="mapsSearchQuery" placeholder="e.g., restaurants in New York" style="flex: 1; padding: 12px; border: 1px solid #ddd; border-radius: 6px;">
            <button id="searchMaps" style="padding: 12px 24px; background: #4CAF50; color: white; border: none; border-radius: 6px; cursor: pointer;">Search</button>
          </div>
        </div>
      `}
      
      <div style="margin-bottom: 15px;">
        <button id="exportScrapedData" style="padding: 10px 20px; background: #FF9800; color: white; border: none; border-radius: 6px; cursor: pointer; margin-right: 10px; display: none;" class="export-btn">
          📊 Export as CSV
        </button>
        <button id="copyScrapedData" style="padding: 10px 20px; background: #9C27B0; color: white; border: none; border-radius: 6px; cursor: pointer; display: none;" class="copy-btn">
          📋 Copy All Data
        </button>
      </div>
      
      <div style="background: #e3f2fd; padding: 15px; border-radius: 8px;">
        <h4 style="margin: 0 0 10px; color: #1565c0;">📋 Scraping Tips</h4>
        <ul style="margin: 0; padding-left: 20px;">
          <li>Navigate to Google Maps and search for businesses</li>
          <li>Use auto-scroll to load more results</li>
          <li>Export data as CSV for further analysis</li>
          <li>Use extracted data for local SEO prospecting</li>
        </ul>
      </div>
    </div>
  `;
  
  const modal = createModal('🗺️ Google Maps Scraper', content);
  
  let scrapedBusinesses = [];
  
  const scrapeCurrentResults = () => {
    const businesses = [];
    
    // Try multiple selectors for Google Maps results
    const selectors = [
      '[role="article"]',
      '.Nv2PK',
      '.THOPZb',
      '.hfpxzc',
      '.V0h1Ob-haAclf',
      '[data-result-id]',
      '.section-result'
    ];
    
    selectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(card => {
        try {
          const name = card.querySelector('.qBF1Pd, .fontHeadlineSmall, [class*="title"], [class*="name"]')?.textContent.trim() || '';
          const rating = card.querySelector('.MW4etd, [class*="rating"]')?.textContent.trim() || '';
          const reviews = card.querySelector('.UY7F9, [class*="review"]')?.textContent.replace(/[()]/g, '').trim() || '';
          const address = card.querySelector('.W4Efsd, [class*="address"]')?.textContent.trim() || '';
          const phone = card.querySelector('[class*="phone"]')?.textContent.trim() || '';
          const website = card.querySelector('a[data-tooltip*="Website"], a[href*="http"]:not([href*="google"])')?.href || '';
          const category = card.querySelector('.DkEaL, [class*="category"]')?.textContent.trim() || '';
          
          if (name && !businesses.find(b => b.name === name)) {
            businesses.push({
              name,
              rating: rating.split(' ')[0] || rating,
              reviews,
              address,
              phone,
              website,
              category
            });
          }
        } catch (e) {}
      });
    });
    
    return businesses;
  };
  
  const displayResults = (businesses) => {
    const resultsDiv = document.getElementById('scrapeResults');
    if (!resultsDiv) return;
    
    if (businesses.length === 0) {
      resultsDiv.innerHTML = '<div style="background: #ffebee; padding: 20px; border-radius: 8px; text-align: center; color: #c62828;">No businesses found. Try scrolling to load more results.</div>';
      return;
    }
    
    scrapedBusinesses = businesses;
    
    let html = `<div style="margin-bottom: 10px;"><strong>Found ${businesses.length} businesses</strong></div>`;
    html += '<div style="max-height: 400px; overflow-y: auto;">';
    
    businesses.forEach((b, i) => {
      html += `
        <div style="background: white; padding: 12px; border-radius: 8px; margin-bottom: 8px; border: 1px solid #e0e0e0;">
          <div style="display: flex; justify-content: space-between; align-items: start;">
            <div style="flex: 1;">
              <strong>${i + 1}. ${escapeHtml(b.name)}</strong>
              ${b.rating ? `<span style="margin-left: 10px; color: #FF9800;">⭐ ${escapeHtml(b.rating)}</span>` : ''}
              ${b.reviews ? `<span style="margin-left: 5px; color: #666;">(${escapeHtml(b.reviews)})</span>` : ''}
            </div>
          </div>
          ${b.category ? `<div style="font-size: 12px; color: #666; margin-top: 4px;">${escapeHtml(b.category)}</div>` : ''}
          ${b.address ? `<div style="font-size: 12px; margin-top: 4px;">📍 ${escapeHtml(b.address)}</div>` : ''}
          ${b.phone ? `<div style="font-size: 12px;">📞 ${escapeHtml(b.phone)}</div>` : ''}
          ${b.website ? `<div style="font-size: 12px; margin-top: 4px;"><a href="${escapeHtml(b.website)}" target="_blank" style="color: #667eea;">🌐 Website</a></div>` : ''}
        </div>
      `;
    });
    
    html += '</div>';
    resultsDiv.innerHTML = html;
    
    document.querySelectorAll('.export-btn, .copy-btn').forEach(btn => btn.style.display = 'inline-block');
  };
  
  setTimeout(() => {
    if (isGoogleMaps) {
      document.getElementById('scrapeCurrentResults')?.addEventListener('click', () => {
        const businesses = scrapeCurrentResults();
        displayResults(businesses);
        showNotification(`Found ${businesses.length} businesses!`, 'success');
      });
      
      document.getElementById('autoScrollAndScrape')?.addEventListener('click', async () => {
        showNotification('Auto-scrolling and scraping... This may take a moment', 'warning');
        
        const scrollableDiv = document.querySelector('[role="feed"]') || document.querySelector('.m6QErb');
        let allBusinesses = [];
        let scrollCount = 0;
        const maxScrolls = 10;
        
        const scrollAndScrape = async () => {
          if (scrollCount >= maxScrolls) {
            allBusinesses = [...new Map(allBusinesses.map(b => [b.name, b])).values()];
            displayResults(allBusinesses);
            showNotification(`Scraped ${allBusinesses.length} businesses!`, 'success');
            return;
          }
          
          const newBusinesses = scrapeCurrentResults();
          allBusinesses = [...allBusinesses, ...newBusinesses];
          
          displayResults(allBusinesses);
          
          if (scrollableDiv) {
            scrollableDiv.scrollTop = scrollableDiv.scrollHeight;
          } else {
            window.scrollBy(0, 500);
          }
          
          scrollCount++;
          setTimeout(scrollAndScrape, 2000);
        };
        
        scrollAndScrape();
      });
    }
    
    document.getElementById('openGoogleMaps')?.addEventListener('click', () => {
      window.open('https://maps.google.com', '_blank');
    });
    
    document.getElementById('searchMaps')?.addEventListener('click', () => {
      const query = document.getElementById('mapsSearchQuery').value.trim();
      if (query) {
        window.open(`https://www.google.com/maps/search/${encodeURIComponent(query)}`, '_blank');
      }
    });
    
    document.getElementById('exportScrapedData')?.addEventListener('click', () => {
      if (scrapedBusinesses.length === 0) return;
      
      let csv = 'Name,Rating,Reviews,Category,Address,Phone,Website\n';
      scrapedBusinesses.forEach(b => {
        csv += `"${b.name.replace(/"/g, '""')}","${b.rating || ''}","${b.reviews || ''}","${b.category || ''}","${b.address || ''}","${b.phone || ''}","${b.website || ''}"\n`;
      });
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `google-maps-businesses-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      showNotification('CSV exported!', 'success');
    });
    
    document.getElementById('copyScrapedData')?.addEventListener('click', () => {
      if (scrapedBusinesses.length === 0) return;
      
      const text = scrapedBusinesses.map(b => 
        `${b.name} | ${b.rating || 'N/A'} | ${b.reviews || 'N/A'} | ${b.address || 'N/A'} | ${b.phone || 'N/A'} | ${b.website || 'N/A'}`
      ).join('\n');
      
      copyToClipboard(text);
      showNotification(`${scrapedBusinesses.length} businesses copied!`, 'success');
    });
  }, 100);
}

// ==================== LOCAL CITATION FINDER ====================
function findLocalCitations() {
  const domain = window.location.hostname.replace('www.', '');
  const pageTitle = document.title;
  
  // Try to detect business info
  const bodyText = document.body.innerText;
  let businessName = '';
  let businessPhone = '';
  let businessAddress = '';
  
  // Detect business name
  const h1 = document.querySelector('h1')?.textContent || '';
  const titleParts = pageTitle.split('|')[0].split('-')[0].trim();
  businessName = h1 || titleParts || domain;
  
  // Detect phone
  const phoneMatch = bodyText.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  if (phoneMatch) businessPhone = phoneMatch[0];
  
  // Detect address
  const addressMatch = bodyText.match(/\d{1,5}\s\w+\s\w+[,.]?\s?\w*[,.]?\s?[A-Z]{2}\s?\d{5}/);
  if (addressMatch) businessAddress = addressMatch[0];
  
  const citationSources = [
    { name: 'Google Business Profile', url: 'https://business.google.com/' },
    { name: 'Bing Places', url: 'https://www.bingplaces.com/' },
    { name: 'Apple Maps Connect', url: 'https://mapsconnect.apple.com/' },
    { name: 'Yelp for Business', url: 'https://biz.yelp.com/' },
    { name: 'Facebook Business', url: 'https://www.facebook.com/business' },
    { name: 'Instagram Business', url: 'https://business.instagram.com/' },
    { name: 'LinkedIn Company Page', url: 'https://www.linkedin.com/company/setup/' },
    { name: 'Twitter/X Business', url: 'https://business.twitter.com/' },
    { name: 'BBB (Better Business Bureau)', url: 'https://www.bbb.org/get-listed' },
    { name: 'Yellow Pages', url: 'https://www.yellowpages.com/listing' },
    { name: 'Superpages', url: 'https://www.superpages.com/' },
    { name: 'Whitepages', url: 'https://www.whitepages.com/business' },
    { name: 'Manta', url: 'https://www.manta.com/add' },
    { name: 'Foursquare', url: 'https://foursquare.com/business/' },
    { name: 'TripAdvisor', url: 'https://www.tripadvisor.com/Owners' },
    { name: 'Angi (Angie\'s List)', url: 'https://www.angi.com/business/' },
    { name: 'Thumbtack', url: 'https://www.thumbtack.com/pro' },
    { name: 'Nextdoor', url: 'https://business.nextdoor.com/' },
    { name: 'Chamber of Commerce', url: 'https://www.chamberofcommerce.com/add-business' },
    { name: 'Hotfrog', url: 'https://www.hotfrog.com/' },
    { name: 'Cylex', url: 'https://www.cylex.us.com/' },
    { name: 'Citysearch', url: 'https://www.citysearch.com/' },
    { name: 'MerchantCircle', url: 'https://www.merchantcircle.com/' },
    { name: 'Kudzu', url: 'https://www.kudzu.com/' },
    { name: 'EZlocal', url: 'https://ezlocal.com/' }
  ];
  
  // Niche-specific citations
  const nicheCitations = {
    restaurant: [
      { name: 'OpenTable', url: 'https://www.opentable.com/' },
      { name: 'Zomato', url: 'https://www.zomato.com/business' },
      { name: 'Grubhub', url: 'https://www.grubhub.com/' },
      { name: 'DoorDash', url: 'https://www.doordash.com/merchant/' }
    ],
    hotel: [
      { name: 'Booking.com', url: 'https://www.booking.com/' },
      { name: 'Expedia', url: 'https://www.expedia.com/' },
      { name: 'Hotels.com', url: 'https://www.hotels.com/' }
    ],
    medical: [
      { name: 'Healthgrades', url: 'https://www.healthgrades.com/' },
      { name: 'WebMD', url: 'https://www.webmd.com/' },
      { name: 'Zocdoc', url: 'https://www.zocdoc.com/' },
      { name: 'Vitals', url: 'https://www.vitals.com/' }
    ],
    legal: [
      { name: 'Avvo', url: 'https://www.avvo.com/' },
      { name: 'Justia', url: 'https://www.justia.com/' },
      { name: 'FindLaw', url: 'https://www.findlaw.com/' },
      { name: 'Lawyers.com', url: 'https://www.lawyers.com/' }
    ],
    realestate: [
      { name: 'Zillow', url: 'https://www.zillow.com/' },
      { name: 'Realtor.com', url: 'https://www.realtor.com/' },
      { name: 'Trulia', url: 'https://www.trulia.com/' },
      { name: 'Redfin', url: 'https://www.redfin.com/' }
    ]
  };
  
  const content = document.createElement('div');
  content.innerHTML = `
    <div style="padding: 15px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
        <h3 style="margin: 0 0 10px;">📋 Local Citation Finder</h3>
        <p style="margin: 0; opacity: 0.9; font-size: 13px;">Find citation opportunities for local SEO</p>
      </div>
      
      <div style="margin-bottom: 20px;">
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px;">
          <p><strong>Detected Business Info:</strong></p>
          <div style="margin-top: 10px;">
            <div style="margin-bottom: 8px;">
              <label style="font-weight: 600;">Business Name:</label>
              <input type="text" id="businessName" value="${escapeHtml(businessName)}" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; margin-top: 4px;">
            </div>
            <div style="margin-bottom: 8px;">
              <label style="font-weight: 600;">Phone:</label>
              <input type="text" id="businessPhone" value="${escapeHtml(businessPhone)}" placeholder="(555) 555-5555" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; margin-top: 4px;">
            </div>
            <div style="margin-bottom: 8px;">
              <label style="font-weight: 600;">Address:</label>
              <input type="text" id="businessAddress" value="${escapeHtml(businessAddress)}" placeholder="123 Main St, City, State ZIP" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; margin-top: 4px;">
            </div>
          </div>
        </div>
      </div>
      
      <div style="margin-bottom: 20px;">
        <h4 style="margin: 0 0 10px;">⭐ Top Citation Sources</h4>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-bottom: 15px;">
          ${citationSources.slice(0, 10).map(source => `
            <a href="${source.url}" target="_blank" style="text-decoration: none;">
              <div style="background: white; padding: 12px; border-radius: 8px; border: 1px solid #e0e0e0; cursor: pointer; transition: all 0.2s;">
                <span>${escapeHtml(source.name)}</span>
                <span style="float: right;">🔗</span>
              </div>
            </a>
          `).join('')}
        </div>
        
        <details>
          <summary style="cursor: pointer; padding: 10px; background: #f5f5f5; border-radius: 6px; font-weight: 600;">📋 More Citation Sources (${citationSources.length - 10} more)</summary>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-top: 15px;">
            ${citationSources.slice(10).map(source => `
              <a href="${source.url}" target="_blank" style="text-decoration: none;">
                <div style="background: white; padding: 12px; border-radius: 8px; border: 1px solid #e0e0e0; cursor: pointer;">
                  <span>${escapeHtml(source.name)}</span>
                  <span style="float: right;">🔗</span>
                </div>
              </a>
            `).join('')}
          </div>
        </details>
      </div>
      
      <div style="margin-bottom: 20px;">
        <h4 style="margin: 0 0 10px;">🎯 Niche-Specific Citations</h4>
        ${Object.entries(nicheCitations).map(([niche, sources]) => `
          <details style="margin-bottom: 10px;">
            <summary style="cursor: pointer; padding: 10px; background: #e3f2fd; border-radius: 6px; font-weight: 600; text-transform: capitalize;">${niche} Citations (${sources.length})</summary>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-top: 10px;">
              ${sources.map(source => `
                <a href="${source.url}" target="_blank" style="text-decoration: none;">
                  <div style="background: white; padding: 10px; border-radius: 6px; border: 1px solid #e0e0e0;">
                    <span>${escapeHtml(source.name)}</span>
                    <span style="float: right;">→</span>
                  </div>
                </a>
              `).join('')}
            </div>
          </details>
        `).join('')}
      </div>
      
      <div style="margin-bottom: 15px;">
        <button id="copyCitationList" style="padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 6px; cursor: pointer; margin-right: 10px;">
          📋 Copy Citation List
        </button>
        <button id="exportCitationsCSV" style="padding: 10px 20px; background: #2196F3; color: white; border: none; border-radius: 6px; cursor: pointer;">
          📊 Export as CSV
        </button>
      </div>
      
      <div style="background: #fff3e0; padding: 15px; border-radius: 8px;">
        <h4 style="margin: 0 0 10px; color: #e65100;">💡 Citation Building Tips</h4>
        <ul style="margin: 0; padding-left: 20px;">
          <li>Ensure NAP (Name, Address, Phone) consistency across all citations</li>
          <li>Start with major aggregators (Data Axle, Localeze, Factual)</li>
          <li>Prioritize industry-specific directories</li>
          <li>Complete profiles fully with photos and descriptions</li>
          <li>Monitor and respond to reviews on all platforms</li>
        </ul>
      </div>
    </div>
  `;
  
  const modal = createModal('📋 Local Citation Finder', content);
  
  setTimeout(() => {
    document.getElementById('copyCitationList')?.addEventListener('click', () => {
      const allSources = [...citationSources];
      Object.values(nicheCitations).forEach(sources => allSources.push(...sources));
      
      const list = allSources.map(s => `${s.name}: ${s.url}`).join('\n');
      copyToClipboard(list);
      showNotification(`${allSources.length} citations copied!`, 'success');
    });
    
    document.getElementById('exportCitationsCSV')?.addEventListener('click', () => {
      const allSources = [...citationSources];
      Object.values(nicheCitations).forEach(sources => allSources.push(...sources));
      
      let csv = 'Name,URL,Type\n';
      citationSources.forEach(s => csv += `"${s.name}","${s.url}","General"\n`);
      Object.entries(nicheCitations).forEach(([niche, sources]) => {
        sources.forEach(s => csv += `"${s.name}","${s.url}","${niche}"\n`);
      });
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `local-citations-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      showNotification('CSV exported!', 'success');
    });
  }, 100);
}

// ==================== SEO DASHBOARD ====================
function showSEODashboard() {
  const url = window.location.href;
  const domain = window.location.hostname.replace('www.', '');
  const title = document.title;
  const metaDesc = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
  const h1 = document.querySelector('h1')?.textContent || '';
  const h1Count = document.querySelectorAll('h1').length;
  const wordCount = (document.body.innerText.match(/\b\w+\b/g) || []).length;
  const images = document.querySelectorAll('img');
  const imagesWithAlt = Array.from(images).filter(img => img.getAttribute('alt')).length;
  const links = document.querySelectorAll('a[href]');
  const internalLinks = Array.from(links).filter(l => {
    try { return new URL(l.href).hostname === window.location.hostname; } catch { return false; }
  }).length;
  const externalLinks = links.length - internalLinks;
  const schemaCount = document.querySelectorAll('script[type="application/ld+json"]').length;
  const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href') || '';
  const robots = document.querySelector('meta[name="robots"]')?.getAttribute('content') || '';
  const isSecure = url.startsWith('https');
  const viewport = document.querySelector('meta[name="viewport"]')?.getAttribute('content') || '';
  
  // Calculate scores
  const scores = {
    title: title.length >= 30 && title.length <= 65 ? 100 : title.length > 0 ? 50 : 0,
    metaDesc: metaDesc.length >= 120 && metaDesc.length <= 160 ? 100 : metaDesc.length > 0 ? 50 : 0,
    h1: h1Count === 1 ? 100 : h1Count > 0 ? 50 : 0,
    content: wordCount >= 300 ? 100 : wordCount > 0 ? Math.min(100, (wordCount / 300) * 100) : 0,
    images: images.length > 0 ? (imagesWithAlt / images.length) * 100 : 100,
    links: internalLinks >= 3 ? 100 : internalLinks > 0 ? 50 : 0,
    schema: schemaCount > 0 ? 100 : 0,
    canonical: canonical.length > 0 ? 100 : 0,
    security: isSecure ? 100 : 0,
    mobile: viewport.length > 0 ? 100 : 0
  };
  
  const overallScore = Math.round(
    Object.values(scores).reduce((sum, score) => sum + score, 0) / Object.keys(scores).length
  );
  
  const getScoreColor = (s) => {
    if (s >= 80) return '#4CAF50';
    if (s >= 60) return '#FF9800';
    return '#f44336';
  };
  
  const getScoreGrade = (s) => {
    if (s >= 90) return 'A+';
    if (s >= 80) return 'A';
    if (s >= 70) return 'B';
    if (s >= 60) return 'C';
    if (s >= 50) return 'D';
    return 'F';
  };
  
  const content = document.createElement('div');
  content.innerHTML = `
    <div style="padding: 15px;">
      <div style="text-align: center; padding: 30px; background: linear-gradient(135deg, ${getScoreColor(overallScore)} 0%, ${getScoreColor(overallScore)}dd 100%); color: white; border-radius: 12px; margin-bottom: 20px;">
        <div style="font-size: 64px; font-weight: bold;">${overallScore}</div>
        <div style="font-size: 24px; font-weight: bold;">${getScoreGrade(overallScore)}</div>
        <div style="font-size: 14px; opacity: 0.9;">Overall SEO Score</div>
      </div>
      
      <div style="margin-bottom: 20px;">
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px;">
          <p><strong>URL:</strong> ${escapeHtml(url)}</p>
          <p><strong>Domain:</strong> ${escapeHtml(domain)}</p>
          <p><strong>Analyzed:</strong> ${new Date().toLocaleString()}</p>
        </div>
      </div>
      
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 20px;">
        <div style="background: white; padding: 12px; border-radius: 8px; border: 1px solid #e0e0e0;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span>📝 Title</span>
            <span style="font-weight: bold; color: ${getScoreColor(scores.title)};">${Math.round(scores.title)}%</span>
          </div>
          <div style="font-size: 11px; color: #666;">${title.length} chars</div>
        </div>
        <div style="background: white; padding: 12px; border-radius: 8px; border: 1px solid #e0e0e0;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span>📄 Meta Description</span>
            <span style="font-weight: bold; color: ${getScoreColor(scores.metaDesc)};">${Math.round(scores.metaDesc)}%</span>
          </div>
          <div style="font-size: 11px; color: #666;">${metaDesc.length} chars</div>
        </div>
        <div style="background: white; padding: 12px; border-radius: 8px; border: 1px solid #e0e0e0;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span>📊 H1 Tags</span>
            <span style="font-weight: bold; color: ${getScoreColor(scores.h1)};">${Math.round(scores.h1)}%</span>
          </div>
          <div style="font-size: 11px; color: #666;">${h1Count} found</div>
        </div>
        <div style="background: white; padding: 12px; border-radius: 8px; border: 1px solid #e0e0e0;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span>📖 Content Length</span>
            <span style="font-weight: bold; color: ${getScoreColor(scores.content)};">${Math.round(scores.content)}%</span>
          </div>
          <div style="font-size: 11px; color: #666;">${wordCount.toLocaleString()} words</div>
        </div>
        <div style="background: white; padding: 12px; border-radius: 8px; border: 1px solid #e0e0e0;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span>🖼️ Images Alt</span>
            <span style="font-weight: bold; color: ${getScoreColor(scores.images)};">${Math.round(scores.images)}%</span>
          </div>
          <div style="font-size: 11px; color: #666;">${imagesWithAlt}/${images.length}</div>
        </div>
        <div style="background: white; padding: 12px; border-radius: 8px; border: 1px solid #e0e0e0;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span>🔗 Internal Links</span>
            <span style="font-weight: bold; color: ${getScoreColor(scores.links)};">${Math.round(scores.links)}%</span>
          </div>
          <div style="font-size: 11px; color: #666;">${internalLinks} internal</div>
        </div>
        <div style="background: white; padding: 12px; border-radius: 8px; border: 1px solid #e0e0e0;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span>📋 Schema</span>
            <span style="font-weight: bold; color: ${getScoreColor(scores.schema)};">${Math.round(scores.schema)}%</span>
          </div>
          <div style="font-size: 11px; color: #666;">${schemaCount} types</div>
        </div>
        <div style="background: white; padding: 12px; border-radius: 8px; border: 1px solid #e0e0e0;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span>🔒 Security</span>
            <span style="font-weight: bold; color: ${getScoreColor(scores.security)};">${Math.round(scores.security)}%</span>
          </div>
          <div style="font-size: 11px; color: #666;">${isSecure ? 'HTTPS' : 'HTTP'}</div>
        </div>
      </div>
      
      <div style="margin-bottom: 20px;">
        <h4 style="margin: 0 0 10px;">📊 Quick Stats</h4>
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;">
          <div style="background: #f5f5f5; padding: 10px; border-radius: 6px; text-align: center;">
            <div style="font-size: 20px; font-weight: bold;">${links.length}</div>
            <div style="font-size: 11px;">Total Links</div>
          </div>
          <div style="background: #f5f5f5; padding: 10px; border-radius: 6px; text-align: center;">
            <div style="font-size: 20px; font-weight: bold;">${externalLinks}</div>
            <div style="font-size: 11px;">External Links</div>
          </div>
          <div style="background: #f5f5f5; padding: 10px; border-radius: 6px; text-align: center;">
            <div style="font-size: 20px; font-weight: bold;">${document.querySelectorAll('h2').length}</div>
            <div style="font-size: 11px;">H2 Tags</div>
          </div>
          <div style="background: #f5f5f5; padding: 10px; border-radius: 6px; text-align: center;">
            <div style="font-size: 20px; font-weight: bold;">${document.querySelectorAll('h3').length}</div>
            <div style="font-size: 11px;">H3 Tags</div>
          </div>
        </div>
      </div>
      
      <div style="margin-bottom: 15px;">
        <button id="copyDashboardReport" style="padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 6px; cursor: pointer; margin-right: 10px;">
          📋 Copy Dashboard Report
        </button>
        <button id="exportDashboardJSON" style="padding: 10px 20px; background: #2196F3; color: white; border: none; border-radius: 6px; cursor: pointer;">
          📊 Export as JSON
        </button>
      </div>
      
      <div style="background: #e8f5e9; padding: 15px; border-radius: 8px;">
        <h4 style="margin: 0 0 10px; color: #2e7d32;">🎯 Priority Actions</h4>
        <ul style="margin: 0; padding-left: 20px;">
          ${scores.title < 80 ? '<li>Optimize title tag (50-60 characters)</li>' : ''}
          ${scores.metaDesc < 80 ? '<li>Improve meta description (150-160 characters)</li>' : ''}
          ${scores.h1 < 80 ? '<li>Fix H1 tag issues</li>' : ''}
          ${scores.content < 80 ? '<li>Add more content (300+ words recommended)</li>' : ''}
          ${scores.images < 80 ? '<li>Add alt text to all images</li>' : ''}
          ${scores.links < 80 ? '<li>Add more internal links</li>' : ''}
          ${scores.schema < 80 ? '<li>Add schema markup</li>' : ''}
          ${scores.canonical < 80 ? '<li>Add canonical tag</li>' : ''}
          ${scores.security < 80 ? '<li>Enable HTTPS</li>' : ''}
          ${scores.mobile < 80 ? '<li>Add viewport meta tag</li>' : ''}
        </ul>
      </div>
    </div>
  `;
  
  const modal = createModal('📊 SEO Dashboard', content);
  
  setTimeout(() => {
    document.getElementById('copyDashboardReport')?.addEventListener('click', () => {
      const report = `SEO Dashboard Report - ${domain}
Date: ${new Date().toLocaleString()}
URL: ${url}

Overall Score: ${overallScore}/100 (Grade: ${getScoreGrade(overallScore)})

Scores:
- Title: ${Math.round(scores.title)}% (${title.length} chars)
- Meta Description: ${Math.round(scores.metaDesc)}% (${metaDesc.length} chars)
- H1 Tags: ${Math.round(scores.h1)}% (${h1Count} found)
- Content Length: ${Math.round(scores.content)}% (${wordCount} words)
- Images Alt: ${Math.round(scores.images)}% (${imagesWithAlt}/${images.length})
- Internal Links: ${Math.round(scores.links)}% (${internalLinks} internal)
- Schema: ${Math.round(scores.schema)}% (${schemaCount} types)
- Canonical: ${Math.round(scores.canonical)}%
- Security: ${Math.round(scores.security)}%
- Mobile: ${Math.round(scores.mobile)}%

Quick Stats:
- Total Links: ${links.length}
- External Links: ${externalLinks}
- H2 Tags: ${document.querySelectorAll('h2').length}
- H3 Tags: ${document.querySelectorAll('h3').length}`;
      
      copyToClipboard(report);
      showNotification('Report copied!', 'success');
    });
    
    document.getElementById('exportDashboardJSON')?.addEventListener('click', () => {
      const data = {
        url, domain, title, metaDesc, h1, h1Count, wordCount,
        images: { total: images.length, withAlt: imagesWithAlt },
        links: { total: links.length, internal: internalLinks, external: externalLinks },
        schemaCount, canonical, robots, isSecure, viewport,
        scores, overallScore, grade: getScoreGrade(overallScore),
        analyzedAt: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url_blob = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url_blob;
      a.download = `seo-dashboard-${domain}-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url_blob);
      showNotification('JSON exported!', 'success');
    });
  }, 100);
}

